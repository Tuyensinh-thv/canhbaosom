import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { KpiBar } from './components/KpiBar';
import { WebGisMap } from './components/WebGisMap';
import { AlertPanel } from './components/AlertPanel';
import { ZoneDetailDrawer } from './components/ZoneDetailDrawer';
import { SimulationModal } from './components/SimulationModal';
import { ReplayControlBar } from './components/ReplayControlBar';
import { ThresholdConfigModal } from './components/ThresholdConfigModal';
import { DataQualityDrawer } from './components/DataQualityDrawer';
import { SystemObservabilityModal } from './components/SystemObservabilityModal';
import { AdminPortal } from './components/AdminPortal';
import { GoogleEarthAiModal } from './components/GoogleEarthAiModal';
import { LstmHydrographModal } from './components/LstmHydrographModal';
import { RadarNowcastModal } from './components/RadarNowcastModal';
import { BroadcastDispatcherModal } from './components/BroadcastDispatcherModal';
import { SocialSensorsModal } from './components/SocialSensorsModal';
import { SevereWeatherModal } from './components/SevereWeatherModal';
import { TransboundaryHydroModal } from './components/TransboundaryHydroModal';
import { TyphoonTrackerModal } from './components/TyphoonTrackerModal';
import { AiCopilotModal } from './components/AiCopilotModal';
import { DisasterReportModal } from './components/DisasterReportModal';
import { PublicPortalHome } from './components/PublicPortalHome';
import { LoginModal } from './components/LoginModal';
import { Earth3DInspectorModal } from './components/Earth3DInspectorModal';
import { OperationalViewSelector } from './components/OperationalViewSelector';
import { CommanderDashboardView } from './components/CommanderDashboardView';
import { FieldOperationView } from './components/FieldOperationView';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { TacticalTimelineBar, TimelineStep } from './components/TacticalTimelineBar';
import { TacticalHeader } from './components/TacticalHeader';
import { TacticalKpiStrip } from './components/TacticalKpiStrip';
import { TacticalLeftSidebar, TacticalLayerState } from './components/TacticalLeftSidebar';
import { TacticalRightPanel } from './components/TacticalRightPanel';
import { TacticalBottomTimeline } from './components/TacticalBottomTimeline';
import { GlobalDisasterTicker } from './components/GlobalDisasterTicker';
import { GlobalDisasterIntelModal } from './components/GlobalDisasterIntelModal';
import { WeatherNextModal } from './components/WeatherNextModal';
import { HydroTelemetryWorkspace } from './components/workspaces/HydroTelemetryWorkspace';
import { RadarTyphoonWorkspace } from './components/workspaces/RadarTyphoonWorkspace';
import { IncidentOperationsWorkspace } from './components/workspaces/IncidentOperationsWorkspace';
import { SituationReportAiWorkspace } from './components/workspaces/SituationReportAiWorkspace';
import { INITIAL_INCIDENTS, INITIAL_MULTI_TIER_KPIS } from './data/incidentsData';
import {
  GeoJsonFeatureProperties,
  GeoJsonWarningMap,
  RainfallStation,
  RiskLevel,
  RiskType,
  SpatialZone,
  SystemMode,
  RegionScope,
  OperationalViewMode,
  DisasterIncident,
  MultiTierKPIs,
  GlobalDisasterSummary
} from './types';
import { NORTHERN_VIETNAM_ZONES } from '../server/data/northern_vietnam_zones';
import { safeFetchJson, createFallbackWarningMap } from './utils/apiClient';

export default function App() {
  // Public Portal ('PORTAL') vs War Room ('MAP') vs Admin Management ('ADMIN')
  const [currentView, setCurrentView] = useState<'PORTAL' | 'MAP' | 'ADMIN'>('PORTAL');
  const [systemMode, setSystemMode] = useState<SystemMode>('REAL_TIME');
  const [warningMapData, setWarningMapData] = useState<GeoJsonWarningMap>(() => createFallbackWarningMap());
  const [stations, setStations] = useState<RainfallStation[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Authentication & RBAC
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('haews_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [pendingWarRoomTargetZone, setPendingWarRoomTargetZone] = useState<string | null>(null);

  // Filters
  const [activeRiskTypeFilter, setActiveRiskTypeFilter] = useState<RiskType | 'all'>('all');
  const [activeLevelFilter, setActiveLevelFilter] = useState<RiskLevel | null>(null);
  const [activeRegion, setActiveRegion] = useState<RegionScope>('ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [defaultProvince, setDefaultProvince] = useState<string>(() => {
    try {
      return localStorage.getItem('haews_default_province') || 'phu_tho';
    } catch {
      return 'phu_tho';
    }
  });

  // Modals & Drawers
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isKpiCollapsed, setIsKpiCollapsed] = useState<boolean>(false);
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState<boolean>(true);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState<boolean>(true);
  const [isBottomTimelineVisible, setIsBottomTimelineVisible] = useState<boolean>(true);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [operationalViewMode, setOperationalViewMode] = useState<OperationalViewMode>('OPERATION');
  const [tacticalTab, setTacticalTab] = useState<'OVERVIEW' | 'SENSORS' | 'FORECAST' | 'ALERTS' | 'RESPONSE' | 'REPORTS' | 'AI'>('OVERVIEW');
  const [tacticalHorizon, setTacticalHorizon] = useState<string>('+6h');
  const [tacticalLayers, setTacticalLayers] = useState<TacticalLayerState>({
    landslide_points: true,
    landslide_zones: true,
    flood_points: true,
    flood_zones: true,
    lightning: false,
    rain_stations: true,
    hydro_stations: true,
    radar_nowcast: true,
    satellite: false,
    camera: false,
    residential: true,
    schools: true,
    hospitals: true,
    bridges: true,
    roads: true,
    evacuation_points: true,
    rescue_teams: true,
    supplies_depot: true
  });
  const [incidents, setIncidents] = useState<DisasterIncident[]>(INITIAL_INCIDENTS);
  const [kpis, setKpis] = useState<MultiTierKPIs>(INITIAL_MULTI_TIER_KPIS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('INC-SL-0821');
  const [showIncidentModal, setShowIncidentModal] = useState<boolean>(false);
  const [timelineStep, setTimelineStep] = useState<TimelineStep>('NOW');
  const [isTimelineSimulating, setIsTimelineSimulating] = useState<boolean>(false);

  const [showCopilotModal, setShowCopilotModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showEarthAiModal, setShowEarthAiModal] = useState<boolean>(false);
  const [showEarth3DModal, setShowEarth3DModal] = useState<boolean>(false);
  const [showTransboundaryModal, setShowTransboundaryModal] = useState<boolean>(false);
  const [showTyphoonModal, setShowTyphoonModal] = useState<boolean>(false);
  const [showSevereWeatherModal, setShowSevereWeatherModal] = useState<boolean>(false);
  const [showLstmModal, setShowLstmModal] = useState<boolean>(false);
  const [showRadarModal, setShowRadarModal] = useState<boolean>(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [showSocialSensorsModal, setShowSocialSensorsModal] = useState<boolean>(false);
  const [showSimulationModal, setShowSimulationModal] = useState<boolean>(false);
  const [showThresholdsModal, setShowThresholdsModal] = useState<boolean>(false);
  const [showDataQualityDrawer, setShowDataQualityDrawer] = useState<boolean>(false);
  const [showObservabilityModal, setShowObservabilityModal] = useState<boolean>(false);
  const [showGlobalDisasterModal, setShowGlobalDisasterModal] = useState<boolean>(false);
  const [showWeatherNextModal, setShowWeatherNextModal] = useState<boolean>(false);
  const [globalDisasterSummary, setGlobalDisasterSummary] = useState<GlobalDisasterSummary | null>(null);
  const [replayFrameIndex, setReplayFrameIndex] = useState<number>(0);
  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);

  // Fetch Warning Map, Stations and Global Disaster Data
  const fetchData = useCallback(async () => {
    try {
      // Async fetch global disasters summary concurrently
      safeFetchJson<GlobalDisasterSummary>('/api/v2/global-disasters/summary').then((summary) => {
        if (summary) setGlobalDisasterSummary(summary);
      }).catch(() => {});

      if (systemMode === 'HISTORICAL_REPLAY') {
        const data = await safeFetchJson<any>(`/api/v1/replay/frame?scenario_id=scenario-yagi-2024&frame_index=${replayFrameIndex}`);
        if (data && data.assessments) {
          const levelCounts = {
            level_1: data.assessments.filter((a: any) => a.overall_risk_level === 1).length,
            level_2: data.assessments.filter((a: any) => a.overall_risk_level === 2).length,
            level_3: data.assessments.filter((a: any) => a.overall_risk_level === 3).length,
            level_4: data.assessments.filter((a: any) => a.overall_risk_level === 4).length,
            level_5: data.assessments.filter((a: any) => a.overall_risk_level === 5).length
          };

          const geoJson: GeoJsonWarningMap = {
            type: 'FeatureCollection',
            features: NORTHERN_VIETNAM_ZONES.map((zone) => {
              const assessment = data.assessments.find((a: any) => a.zone_id === zone.id) || data.assessments[0];
              return {
                type: 'Feature',
                id: zone.id,
                geometry: {
                  type: 'Polygon',
                  coordinates: zone.coordinates[0] ? [zone.coordinates[0]] : []
                },
                properties: {
                  ...assessment,
                  center: zone.center,
                  elevation: zone.elevation,
                  slope: zone.slope,
                  aspect: zone.aspect,
                  soil_type: zone.soil_type,
                  geology_sensitivity: zone.geology_sensitivity,
                  basin_name: zone.basin_name,
                  vulnerable_population: zone.vulnerable_population
                }
              };
            }),
            metadata: {
              generated_at: data.frame?.timestamp || new Date().toISOString(),
              total_zones: NORTHERN_VIETNAM_ZONES.length,
              level_counts: levelCounts,
              system_mode: 'HISTORICAL_REPLAY',
              model_version: 'HAEWS-v2.0-Replay'
            }
          };
          setWarningMapData(geoJson);
        }
        return;
      }

      // Normal mode (REAL_TIME or DEMO)
      const [mapJson, staJson] = await Promise.all([
        safeFetchJson<GeoJsonWarningMap>('/api/v1/warning-map'),
        safeFetchJson<{ total: number; online_count: number; data: RainfallStation[] }>('/api/v1/stations')
      ]);

      if (mapJson && mapJson.features && mapJson.features.length > 0) {
        setWarningMapData(mapJson);
      }

      if (staJson && Array.isArray(staJson.data)) {
        setStations(staJson.data);
      }
    } catch (err) {
      console.warn('Silent data update notice:', err);
    }
  }, [systemMode, replayFrameIndex]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, systemMode === 'REAL_TIME' ? 20000 : 10000);
    return () => clearInterval(interval);
  }, [fetchData, systemMode]);

  // Mode Switch Handler
  const handleSelectMode = async (mode: SystemMode) => {
    setSystemMode(mode);
    if (mode !== 'HISTORICAL_REPLAY') {
      try {
        await safeFetchJson('/api/v1/system/mode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode })
        });
        await fetchData();
      } catch (e) {
        console.warn('Notice setting mode:', e);
      }
    }
  };

  // Force Live Real-time Sync
  const handleSyncLive = async () => {
    setIsSyncingLive(true);
    try {
      await safeFetchJson('/api/v1/realtime/sync', { method: 'POST' });
      await fetchData();
    } catch (e) {
      console.warn('Notice syncing live data:', e);
    } finally {
      setIsSyncingLive(false);
    }
  };

  // User Authentication Handlers
  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    if (pendingWarRoomTargetZone) {
      setSelectedZoneId(pendingWarRoomTargetZone);
      setPendingWarRoomTargetZone(null);
    }
    setCurrentView('MAP');
  };

  const handleLogout = () => {
    localStorage.removeItem('haews_auth_user');
    setCurrentUser(null);
    setCurrentView('PORTAL');
  };

  // Navigating to protected War Room / Admin
  const handleNavigateView = (view: 'PORTAL' | 'MAP' | 'ADMIN') => {
    if (view === 'PORTAL') {
      setCurrentView('PORTAL');
      return;
    }

    // MAP or ADMIN require login
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    setCurrentView(view);
  };

  const handleEnterWarRoomFromPublic = (zoneId?: string) => {
    if (zoneId) {
      setPendingWarRoomTargetZone(zoneId);
      setSelectedZoneId(zoneId);
    }

    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      setCurrentView('MAP');
    }
  };

  const handleApproveOrder = (incidentId: string, orderId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'ALERT_ISSUED',
            tacticalOrders: inc.tacticalOrders.map((o) =>
              o.id === orderId ? { ...o, status: 'APPROVED' } : o
            )
          };
        }
        return inc;
      })
    );
  };

  const handleOpenIncidentWorkspace = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    setShowIncidentModal(true);
  };

  // Find selected zone properties
  const selectedFeature = warningMapData?.features.find((f) => f.id === selectedZoneId);
  const selectedZoneProps: GeoJsonFeatureProperties | null = selectedFeature ? selectedFeature.properties : null;

  const levelCounts = warningMapData?.metadata.level_counts || {
    level_1: 0,
    level_2: 0,
    level_3: 0,
    level_4: 0,
    level_5: 0
  };

  const activeWarningCount = levelCounts.level_5 + levelCounts.level_4 + levelCounts.level_3;
  const activeSelectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0] || null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Global Breaking Disaster & Landslide Ticker (NASA EONET / USGS Live Stream) */}
      <GlobalDisasterTicker
        summary={globalDisasterSummary}
        onOpenModal={() => setShowGlobalDisasterModal(true)}
      />

      {/* 1. PUBLIC INDEX PORTAL VIEW (Default for Unauthenticated Citizens) */}
      {currentView === 'PORTAL' ? (
        <div className="flex-1 overflow-y-auto">
          <PublicPortalHome
            warningMapData={warningMapData}
            stations={stations}
            onOpenLoginModal={() => setShowLoginModal(true)}
            onOpenTyphoonModal={() => setShowTyphoonModal(true)}
            onOpenEarthquakeModal={() => setShowSevereWeatherModal(true)}
            onOpenGlobalDisaster={() => setShowGlobalDisasterModal(true)}
            onOpenWeatherNext={() => setShowWeatherNextModal(true)}
            onEnterWarRoom={handleEnterWarRoomFromPublic}
            defaultProvinceId={defaultProvince}
          />
        </div>
      ) : (
        /* 2. PROTECTED WAR ROOM OR ADMIN SYSTEM */
        <>
          {/* Top Navigation Bar: Tactical Header in Map view, Standard Navbar in Admin */}
          {currentView === 'MAP' ? (
            <TacticalHeader
              activeTab={tacticalTab}
              onSelectTab={(tab) => {
                setTacticalTab(tab);
                if (tab === 'SENSORS') setShowLstmModal(true);
                if (tab === 'FORECAST') setShowRadarModal(true);
                if (tab === 'ALERTS') setShowBroadcastModal(true);
                if (tab === 'REPORTS') setShowReportModal(true);
                if (tab === 'AI') setShowCopilotModal(true);
              }}
              currentUser={currentUser}
              onLogout={handleLogout}
              onNavigatePortal={() => handleNavigateView('PORTAL')}
              onNavigateAdmin={() => handleNavigateView('ADMIN')}
              onOpenCopilot={() => setShowCopilotModal(true)}
              onOpenReport={() => setShowReportModal(true)}
              onOpenTyphoon={() => setShowTyphoonModal(true)}
              onOpenRadar={() => setShowRadarModal(true)}
              onOpenBroadcast={() => setShowBroadcastModal(true)}
              onOpenLstm={() => setShowLstmModal(true)}
              onOpenEarthAi={() => setShowEarthAiModal(true)}
              onOpenGlobalDisaster={() => setShowGlobalDisasterModal(true)}
              onOpenWeatherNext={() => setShowWeatherNextModal(true)}
            />
          ) : (
            <Navbar
              systemMode={systemMode}
              currentView={currentView}
              onToggleView={handleNavigateView}
              onSelectMode={handleSelectMode}
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenLoginModal={() => setShowLoginModal(true)}
              onOpenCopilot={() => setShowCopilotModal(true)}
              onOpenReport={() => setShowReportModal(true)}
              onOpenEarthAi={() => setShowEarthAiModal(true)}
              onOpenTransboundary={() => setShowTransboundaryModal(true)}
              onOpenTyphoonTracker={() => setShowTyphoonModal(true)}
              onOpenSevereWeather={() => setShowSevereWeatherModal(true)}
              onOpenLstm={() => setShowLstmModal(true)}
              onOpenRadar={() => setShowRadarModal(true)}
              onOpenBroadcast={() => setShowBroadcastModal(true)}
              onOpenSocialSensors={() => setShowSocialSensorsModal(true)}
              onOpenSimulation={() => setShowSimulationModal(true)}
              onOpenReplay={() => handleSelectMode('HISTORICAL_REPLAY')}
              onOpenThresholds={() => setShowThresholdsModal(true)}
              onOpenDataQuality={() => setShowDataQualityDrawer(true)}
              onOpenObservability={() => setShowObservabilityModal(true)}
              onOpenGlobalDisaster={() => setShowGlobalDisasterModal(true)}
              onOpenWeatherNext={() => setShowWeatherNextModal(true)}
              activeWarningCount={activeWarningCount}
            />
          )}

          {/* VIEW: ADMIN PORTAL */}
          {currentView === 'ADMIN' ? (
            <div className="flex-1 overflow-y-auto">
              <AdminPortal
                onBackToMap={() => setCurrentView('MAP')}
                onOpenThresholds={() => setShowThresholdsModal(true)}
                onOpenDataQuality={() => setShowDataQualityDrawer(true)}
                defaultProvince={defaultProvince}
                onUpdateDefaultProvince={setDefaultProvince}
              />
            </div>
          ) : (
            /* VIEW: WAR ROOM / DECISION SUPPORT PLATFORM */
            <div className="flex-1 flex flex-col overflow-hidden bg-[#040812]">
              {/* TIER 1: COMMANDER VIEW (Lãnh đạo Tỉnh & Ban Chỉ Huy) */}
              {operationalViewMode === 'COMMANDER' ? (
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#001428]">
                  <CommanderDashboardView
                    incidents={incidents}
                    kpis={kpis}
                    onSelectIncident={(id) => {
                      setSelectedIncidentId(id);
                      setShowIncidentModal(true);
                    }}
                    onOpenIncidentWorkspace={handleOpenIncidentWorkspace}
                    onApproveOrder={handleApproveOrder}
                    onOpenBroadcastModal={() => setShowBroadcastModal(true)}
                    onOpenReportModal={() => setShowReportModal(true)}
                  />
                </div>
              ) : operationalViewMode === 'FIELD' ? (
                /* TIER 3: FIELD VIEW (Hiện trường cấp Xã / Xung kích) */
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#001428]">
                  <FieldOperationView
                    incidents={incidents}
                    onSelectIncident={(id) => {
                      setSelectedIncidentId(id);
                      setShowIncidentModal(true);
                    }}
                    onOpenIncidentWorkspace={handleOpenIncidentWorkspace}
                  />
                </div>
              ) : tacticalTab === 'SENSORS' ? (
                <HydroTelemetryWorkspace
                  stations={stations}
                  onOpenTransboundaryModal={() => setShowTransboundaryModal(true)}
                  onOpenLstmModal={() => setShowLstmModal(true)}
                />
              ) : tacticalTab === 'FORECAST' ? (
                <RadarTyphoonWorkspace
                  onOpenTyphoonModal={() => setShowTyphoonModal(true)}
                  onOpenRadarModal={() => setShowRadarModal(true)}
                />
              ) : tacticalTab === 'RESPONSE' || tacticalTab === 'ALERTS' ? (
                <IncidentOperationsWorkspace
                  incidents={incidents}
                  kpis={kpis}
                  onSelectIncident={(id) => {
                    setSelectedIncidentId(id);
                    setShowIncidentModal(true);
                  }}
                  onApproveOrder={handleApproveOrder}
                  onOpenBroadcastModal={() => setShowBroadcastModal(true)}
                  onOpenReportModal={() => setShowReportModal(true)}
                />
              ) : tacticalTab === 'REPORTS' || tacticalTab === 'AI' ? (
                <SituationReportAiWorkspace
                  globalDisasterSummary={globalDisasterSummary}
                  onOpenGlobalDisasterModal={() => setShowGlobalDisasterModal(true)}
                  onOpenCopilotModal={() => setShowCopilotModal(true)}
                />
              ) : (
                /* TIER 2: TACTICAL WAR ROOM (Clean Fullscreen GIS Map Interface) */
                <div className="flex-1 flex flex-col overflow-hidden relative">
                  {/* Top Tactical KPI Strip */}
                  {!isZenMode && (
                    <TacticalKpiStrip
                      levelCounts={levelCounts}
                      totalStations={91}
                      onlineStations={91}
                      activeRiskFilter={activeLevelFilter}
                      onFilterByLevel={setActiveLevelFilter}
                      onOpenSensorHealth={() => setShowDataQualityDrawer(true)}
                    />
                  )}

                  {/* Main Middle Layout: Left Sidebar + GIS Map + Right Panel */}
                  <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                    {/* Left Tactical Sidebar (Scope, Mini Dock, Layer Tree) */}
                    {isLeftSidebarVisible && !isZenMode && (
                      <div className="hidden lg:flex shrink-0 h-full">
                        <TacticalLeftSidebar
                          selectedProvince={selectedProvince}
                          onChangeProvince={setSelectedProvince}
                          layers={tacticalLayers}
                          onToggleLayer={(key) =>
                            setTacticalLayers((prev) => ({ ...prev, [key]: !prev[key] }))
                          }
                          onOpenLayerConfig={() => setShowThresholdsModal(true)}
                          onSelectTool={(tool) => {
                            if (tool === 'sensors') setTacticalTab('SENSORS');
                            if (tool === 'radar') setTacticalTab('FORECAST');
                            if (tool === 'camera') setShowEarth3DModal(true);
                          }}
                        />
                      </div>
                    )}

                    {/* Center: Interactive GIS Map */}
                    <div className="flex-1 h-full relative">
                      <WebGisMap
                        warningMapData={warningMapData}
                        stations={stations}
                        selectedZoneId={selectedZoneId}
                        onSelectZone={setSelectedZoneId}
                        activeRiskTypeFilter={activeRiskTypeFilter}
                        activeLevelFilter={activeLevelFilter}
                        activeRegion={activeRegion}
                        onChangeRegion={setActiveRegion}
                        selectedProvince={selectedProvince}
                        onSelectProvince={setSelectedProvince}
                        systemMode={systemMode}
                        onToggleMode={handleSelectMode}
                        onSyncLive={handleSyncLive}
                        isSyncingLive={isSyncingLive}
                      />

                      {/* Floating Workspace & Layout Quick Toggles HUD */}
                      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-[#071326]/90 p-1.5 rounded-xl border border-sky-800/60 backdrop-blur-md shadow-2xl text-xs select-none">
                        <button
                          onClick={() => setIsLeftSidebarVisible(!isLeftSidebarVisible)}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                            isLeftSidebarVisible ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white'
                          }`}
                          title="Ẩn / Hiện Cây Lớp bên trái"
                        >
                          Lớp: {isLeftSidebarVisible ? 'Bật' : 'Tắt'}
                        </button>

                        <button
                          onClick={() => setIsRightPanelVisible(!isRightPanelVisible)}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                            isRightPanelVisible ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white'
                          }`}
                          title="Ẩn / Hiện Bảng Tình Huống bên phải"
                        >
                          Tình huống: {isRightPanelVisible ? 'Bật' : 'Tắt'}
                        </button>

                        <button
                          onClick={() => setIsBottomTimelineVisible(!isBottomTimelineVisible)}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                            isBottomTimelineVisible ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white'
                          }`}
                          title="Ẩn / Hiện Thanh Dòng Thời Gian đáy"
                        >
                          Timeline: {isBottomTimelineVisible ? 'Bật' : 'Tắt'}
                        </button>

                        <div className="h-4 w-px bg-slate-700 mx-0.5" />

                        <button
                          onClick={() => setIsZenMode(!isZenMode)}
                          className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                            isZenMode
                              ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                              : 'bg-gradient-to-r from-sky-600 to-blue-700 text-white hover:brightness-110'
                          }`}
                          title="Bật/Tắt chế độ Toàn cảnh (100% diện tích cho bản đồ GIS)"
                        >
                          <span>{isZenMode ? 'Thoát Toàn Cảnh' : 'Bản Đồ Toàn Cảnh'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Tactical Panel (Incidents, Tasks, Weather) */}
                    {isRightPanelVisible && !isZenMode && (
                      <div className="hidden md:flex shrink-0 h-full">
                        <TacticalRightPanel
                          incidents={incidents}
                          onSelectIncident={(id) => {
                            setSelectedIncidentId(id);
                            setShowIncidentModal(true);
                          }}
                          onOpenBroadcast={(id) => {
                            setSelectedIncidentId(id || 'inc-001');
                            setShowBroadcastModal(true);
                          }}
                          onOpenTasks={() => {
                            setTacticalTab('RESPONSE');
                          }}
                          onOpenWeatherDetails={() => setTacticalTab('SENSORS')}
                        />
                      </div>
                    )}
                  </div>

                  {/* Bottom: Tactical Timeline Bar & Multi-Wave Risk Forecast Curve */}
                  {isBottomTimelineVisible && !isZenMode && (
                    <TacticalBottomTimeline
                      currentHorizon={tacticalHorizon}
                      onChangeHorizon={setTacticalHorizon}
                      isPlaying={isTimelineSimulating}
                      onTogglePlay={() => setIsTimelineSimulating(!isTimelineSimulating)}
                      onSelectHistoricalReplay={() => handleSelectMode('HISTORICAL_REPLAY')}
                      onLiveSync={handleSyncLive}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 3. Auth Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 4. Drawers & Modals (Available inside War Room) */}
      {/* Zone Detail Drill-down */}
      {selectedZoneProps && (
        <ZoneDetailDrawer
          zoneData={selectedZoneProps}
          onClose={() => setSelectedZoneId(null)}
          onOpenEarthAi={() => setShowEarthAiModal(true)}
          onOpenLstm={() => setShowLstmModal(true)}
          onOpen3DEarth={() => setShowEarth3DModal(true)}
        />
      )}

      {/* 3D Earth & Terrain Slope Inspector Modal */}
      <Earth3DInspectorModal
        isOpen={showEarth3DModal}
        onClose={() => setShowEarth3DModal(false)}
        zoneProps={selectedZoneProps}
      />

      {/* LSTM Hydrograph Modal */}
      <LstmHydrographModal
        isOpen={showLstmModal}
        onClose={() => setShowLstmModal(false)}
        zones={NORTHERN_VIETNAM_ZONES}
        initialZoneId={selectedZoneId || undefined}
      />

      {/* Radar Doppler Nowcasting Modal */}
      <RadarNowcastModal
        isOpen={showRadarModal}
        onClose={() => setShowRadarModal(false)}
      />

      {/* Emergency Broadcast Dispatcher Modal */}
      <BroadcastDispatcherModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
      />

      {/* Social Sensors AI & VGI Modal */}
      <SocialSensorsModal
        isOpen={showSocialSensorsModal}
        onClose={() => setShowSocialSensorsModal(false)}
        zones={NORTHERN_VIETNAM_ZONES}
      />

      {/* Simulation Sandbox Modal */}
      <SimulationModal
        isOpen={showSimulationModal}
        onClose={() => setShowSimulationModal(false)}
        zones={NORTHERN_VIETNAM_ZONES}
      />

      {/* Historical Replay Control Bar */}
      {systemMode === 'HISTORICAL_REPLAY' && (
        <ReplayControlBar
          currentFrameIndex={replayFrameIndex}
          onFrameChange={setReplayFrameIndex}
          onClose={() => handleSelectMode('REAL_TIME')}
        />
      )}

      {/* Threshold Profiles Configuration Modal */}
      <ThresholdConfigModal
        isOpen={showThresholdsModal}
        onClose={() => setShowThresholdsModal(false)}
      />

      {/* Data Quality Engine Audit Drawer */}
      <DataQualityDrawer
        isOpen={showDataQualityDrawer}
        onClose={() => setShowDataQualityDrawer(false)}
      />

      {/* Google Earth AI Modal */}
      <GoogleEarthAiModal
        isOpen={showEarthAiModal}
        onClose={() => setShowEarthAiModal(false)}
        selectedZone={NORTHERN_VIETNAM_ZONES.find((z) => z.id === selectedZoneId) || null}
        allZones={NORTHERN_VIETNAM_ZONES}
        assessments={warningMapData?.features.map((f) => f.properties) || []}
        onSelectZone={(z) => setSelectedZoneId(z.id)}
      />

      {/* Severe Convective Weather, Lightning & Urban Flood Modal */}
      <SevereWeatherModal
        isOpen={showSevereWeatherModal}
        onClose={() => setShowSevereWeatherModal(false)}
      />

      {/* Typhoon & Tropical Cyclone Live Tracker Modal */}
      <TyphoonTrackerModal
        isOpen={showTyphoonModal}
        onClose={() => setShowTyphoonModal(false)}
        onSelectZoneOnMap={(zId) => {
          setSelectedZoneId(zId);
          setShowTyphoonModal(false);
        }}
        onLoadScenarioForReplay={(stormId) => {
          setSystemMode('HISTORICAL_REPLAY');
          setCurrentView('MAP');
          setShowTyphoonModal(false);
        }}
      />

      {/* Transboundary River Basins & Upstream Reservoirs Modal */}
      <TransboundaryHydroModal
        isOpen={showTransboundaryModal}
        onClose={() => setShowTransboundaryModal(false)}
      />

      {/* System Observability Modal */}
      <SystemObservabilityModal
        isOpen={showObservabilityModal}
        onClose={() => setShowObservabilityModal(false)}
      />

      {/* AI War Room Copilot Modal */}
      {showCopilotModal && (
        <AiCopilotModal
          onClose={() => setShowCopilotModal(false)}
          onOpenReport={() => setShowReportModal(true)}
        />
      )}

      {/* Official Situation Report & Disaster Bulletin Modal */}
      {showReportModal && (
        <DisasterReportModal
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Decision-Support Incident Lifecycle Workspace Modal */}
      {showIncidentModal && (
        <IncidentDetailModal
          incident={activeSelectedIncident}
          onClose={() => setShowIncidentModal(false)}
          onApproveOrder={handleApproveOrder}
        />
      )}

      {/* Global Disaster Intelligence & Landslide Monitor Modal */}
      <GlobalDisasterIntelModal
        isOpen={showGlobalDisasterModal}
        onClose={() => setShowGlobalDisasterModal(false)}
        onOpen3DGlobe={() => {
          setShowGlobalDisasterModal(false);
          setShowEarth3DModal(true);
        }}
      />

      {/* Google DeepMind WeatherNext 3 AI Forecast & Ensemble Modal */}
      <WeatherNextModal
        isOpen={showWeatherNextModal}
        onClose={() => setShowWeatherNextModal(false)}
      />
    </div>
  );
}
