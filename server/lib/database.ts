import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const { Client } = pg;

/**
 * Database class for direct PostgreSQL operations
 * Used for: migrations, bulk operations, spatial queries, stored procedures
 * For regular CRUD, prefer Supabase client (supabase.ts)
 */
export class Database {
  private connectionString: string;

  constructor() {
    this.connectionString = process.env.DATABASE_URL || '';
    if (!this.connectionString) {
      const host = process.env.SUPABASE_DB_HOST || 'localhost';
      const port = process.env.SUPABASE_DB_PORT || '5432';
      const database = process.env.SUPABASE_DB_NAME || 'postgres';
      const user = process.env.SUPABASE_DB_USER || 'postgres';
      const password = process.env.SUPABASE_DB_PASSWORD || '';
      this.connectionString = `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
    }
  }

  /**
   * Get a new client connection
   */
  async getClient(): Promise<pg.Client> {
    const client = new Client({
      connectionString: this.connectionString,
      ssl: { rejectUnauthorized: false }, // Supabase requires SSL
    });
    await client.connect();
    return client;
  }

  /**
   * Execute a single SQL query
   */
  async query(sql: string, params?: any[]): Promise<pg.QueryResult> {
    const client = await this.getClient();
    try {
      const result = await client.query(sql, params);
      return result;
    } finally {
      await client.end();
    }
  }

  /**
   * Execute a SQL file
   */
  async executeFile(filePath: string): Promise<void> {
    const sql = fs.readFileSync(filePath, 'utf8');
    const client = await this.getClient();
    try {
      await client.query(sql);
      console.log(`[DB] ✅ Executed: ${path.basename(filePath)}`);
    } catch (err: any) {
      console.error(`[DB] ❌ Error in ${path.basename(filePath)}:`, err.message);
      throw err;
    } finally {
      await client.end();
    }
  }

  /**
   * Run all migration files in order
   */
  async runMigrations(migrationsDir: string): Promise<{ success: string[]; failed: string[] }> {
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`\n[DB] 🚀 Running ${files.length} migrations from ${migrationsDir}\n`);

    const success: string[] = [];
    const failed: string[] = [];

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      try {
        await this.executeFile(filePath);
        success.push(file);
      } catch (err: any) {
        console.error(`[DB] Failed: ${file} - ${err.message}`);
        failed.push(file);
        // Continue with next migration instead of stopping
      }
    }

    console.log(`\n[DB] ✅ Migrations complete: ${success.length} success, ${failed.length} failed`);
    if (failed.length > 0) {
      console.log(`[DB] ❌ Failed migrations: ${failed.join(', ')}`);
    }

    return { success, failed };
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const client = await this.getClient();
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      console.log(`[DB] ✅ Connected to PostgreSQL`);
      console.log(`[DB]    Time: ${result.rows[0].current_time}`);
      console.log(`[DB]    Version: ${result.rows[0].pg_version.split(',')[0]}`);
      await client.end();
      return true;
    } catch (err: any) {
      console.error(`[DB] ❌ Connection failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Execute a spatial query
   */
  async spatialQuery(sql: string, params?: any[]): Promise<any[]> {
    const result = await this.query(sql, params);
    return result.rows;
  }

  /**
   * Execute within a transaction
   */
  async transaction(fn: (client: pg.Client) => Promise<void>): Promise<void> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      await fn(client);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      await client.end();
    }
  }
}

// Singleton instance
export const database = new Database();
export default database;
