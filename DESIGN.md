---
name: HAEWS Tactical Design System
description: Mission-control operational precision design system for Vietnam national disaster early warning and rescue.
colors:
  primary: "#0284c7"
  primary-hover: "#0369a1"
  neutral-bg: "#070b14"
  surface: "#0b1220"
  surface-card: "#0f172a"
  border: "#1e293b"
  text-primary: "#ffffff"
  text-secondary: "#94a3b8"
  text-muted: "#64748b"
  alert-safe: "#10b981"
  alert-advisory: "#0284c7"
  alert-warning: "#f59e0b"
  alert-danger: "#ef4444"
  telemetry-cyan: "#06b6d4"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.05em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  badge-warning:
    backgroundColor: "{colors.alert-warning}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  badge-danger:
    backgroundColor: "{colors.alert-danger}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
---

# HAEWS Design System & Visual Authority

## Overview
HAEWS (Hydro-meteorological & Airborne Early Warning System) delivers military-grade operational situational awareness and civic emergency coordination. The visual language avoids decorative AI tropes in favor of crisp mission-control contrast, high information density, and instant scanability under stress.

## Colors
- **Canvas & Surface:** Deep Obsidian Slate (`#070B14`, `#0B1220`, `#0F172A`) ensures map tiles and radar sweeps remain the brightest elements on screen.
- **Status Hierarchy:**
  - **Normal / Safe:** Emerald (`#10B981`)
  - **Watch (Cấp I):** Sky Cobalt (`#0284C7`)
  - **Warning (Cấp II-III):** Amber (`#F59E0B`)
  - **Emergency (Cấp IV-V):** Crimson (`#EF4444`)
  - **Telemetry / GIS Nowcast:** Cyan (`#06B6D4`)

## Typography
- **UI & Controls:** Inter / System Sans for rapid reading.
- **Sensor Readings & Coordinates:** `font-mono tabular-nums` (`ui-monospace`, `SFMono`) for aligned numbers and zero jitter during live data polling.

## Layout
- **Command War Room:** 3-panel split layout (Left: Tactical Layers & Zone Selector; Center: WebGIS Tactical Map & Doppler Radar; Right: AI Copilot & Hydrographs).
- **Public Portal:** Clean vertical flow with sticky emergency ticker, 1-click rescue reporting hotline, and interactive commune risk search.

## Elevation & Depth
- Subtle frosted glass (`backdrop-blur-md bg-slate-900/85 border border-slate-800/80`).
- Glow effects are reserved exclusively for active emergency alerts (pulsing rings on critical flood/storm zones).

## Shapes
- Tight, functional corner radiuses (`rounded-lg` 8px for cards, `rounded-md` 6px for buttons).
- Avoid overly rounded pill shapes for tactical buttons; use pills only for alert status tags.

## Components
- **Tactical Header:** Slim, fixed-top command bar with digital telemetry clock, module switcher, and global disaster intel trigger.
- **Global Disaster Ticker:** Marquee headline bar with live NASA/USGS feed updates and urgency color coding.
- **WebGIS HUD Overlay:** Transparent floating controls with high-contrast text and instant layer toggles.

## Do's and Don'ts
- ✅ **DO** use `font-mono tabular-nums` for all telemetry, rainfall (mm), water level (m), and coordinate values.
- ✅ **DO** verify WCAG AAA contrast between badge text and status backgrounds.
- ❌ **DON'T** use purple or violet gradient backgrounds (`from-purple-600 to-indigo-600`).
- ❌ **DON'T** place muted gray text (`text-slate-400`) directly on colored status chips.
