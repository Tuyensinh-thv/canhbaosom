import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  User,
  Key,
  ShieldCheck,
  X,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { DEMO_ACCOUNTS, UserRole, ROLE_PERMISSIONS } from '../data/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('commander.pctt');
  const [password, setPassword] = useState<string>('123');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectQuickAccount = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setErrorMsg('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      // Find matching mock account or send to server auth
      const found = DEMO_ACCOUNTS.find(
        (a) => a.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (found) {
        // Successful login
        const permissions = ROLE_PERMISSIONS[found.role].permissions;
        const loggedUser = {
          id: `usr-${Date.now()}`,
          username: found.username,
          full_name: found.full_name,
          role: found.role,
          role_label: found.role_label,
          department: found.department,
          email: found.email,
          permissions
        };

        // Save session locally
        localStorage.setItem('haews_auth_user', JSON.stringify(loggedUser));
        onLoginSuccess(loggedUser);
        onClose();
      } else {
        setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    } catch (err: any) {
      setErrorMsg('Đã xảy ra lỗi khi xác thực tài khoản.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl max-w-md w-full relative text-slate-100 space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-950/60 ring-2 ring-indigo-500/30">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-100">
              Đăng Nhập Trung Tâm Tác Chiến
            </h3>
            <p className="text-xs text-slate-400">
              Hệ thống Phân quyền Tác chiến & Điều hành PCTT (RBAC)
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-950/50 border border-rose-600/60 text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] text-slate-400 font-semibold uppercase mb-1">
              Tài Khoản / Tên Đăng Nhập:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-semibold uppercase mb-1">
              Mật Khẩu Truy Cập:
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-950/60 transition disabled:opacity-50"
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng Nhập Vào Trung Tâm Tác Chiến'}
          </button>
        </form>

        {/* 1-Click Role Switcher for Testing/Demonstration */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Chọn Nhanh Tài Khoản Phân Quyền (Demo):
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = username === acc.username;
              const roleMeta = ROLE_PERMISSIONS[acc.role];

              return (
                <div
                  key={acc.username}
                  onClick={() => handleSelectQuickAccount(acc)}
                  className={`p-2 rounded-xl border cursor-pointer transition text-xs flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <span>{acc.full_name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${roleMeta.badgeColor}`}>
                        {acc.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{acc.role_label}</div>
                  </div>

                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
