import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  LocateFixed, 
  Info,
  Maximize2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Worker, Waypoint, Customer } from '../types';

interface MapTrackerProps {
  worker: Worker;
  waypoints?: Waypoint[];
  customerLocation?: { latitude: number; longitude: number; name: string };
  isWorkerActive: boolean;
  interactive?: boolean;
  height?: string;
  showPrivacyNotice?: boolean;
}

export const MapTracker: React.FC<MapTrackerProps> = ({
  worker,
  waypoints = [],
  customerLocation,
  isWorkerActive,
  height = 'h-72',
  showPrivacyNotice = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedPin, setSelectedPin] = useState<string | null>('worker');
  const [isUsingRealGps, setIsUsingRealGps] = useState(false);
  const [realGpsCoords, setRealGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Center coordinate reference around Anna Nagar, Chennai
  const baseLat = 13.0870;
  const baseLng = 80.2115;

  const getRealLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRealGpsCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsUsingRealGps(true);
      },
      (error) => {
        setGpsError(`GPS Permission: ${error.message}. Showing simulation.`);
        setIsUsingRealGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Convert GPS coordinates to 2D SVG canvas percentages
  // Anna Nagar bounding box: Lat ~13.0820 to 13.0920, Lng ~80.2030 to 80.2200
  const toCanvasCoords = (lat: number, lng: number) => {
    const latSpan = 0.0100;
    const lngSpan = 0.0170;
    const minLat = 13.0820;
    const minLng = 80.2030;

    const x = Math.max(8, Math.min(92, ((lng - minLng) / lngSpan) * 100));
    const y = Math.max(8, Math.min(92, (1 - (lat - minLat) / latSpan) * 100));
    return { x, y };
  };

  const currentWorkerLat = isUsingRealGps && realGpsCoords ? realGpsCoords.lat : worker.currentLatitude;
  const currentWorkerLng = isUsingRealGps && realGpsCoords ? realGpsCoords.lng : worker.currentLongitude;
  const workerCoords = toCanvasCoords(currentWorkerLat, currentWorkerLng);

  // Distance to customer estimation
  const estDistanceMeters = customerLocation ? Math.round(
    Math.sqrt(
      Math.pow((currentWorkerLat - customerLocation.latitude) * 111000, 2) +
      Math.pow((currentWorkerLng - customerLocation.longitude) * 111000 * Math.cos(baseLat * Math.PI / 180), 2)
    )
  ) : 340;

  const estMinutes = Math.max(2, Math.round(estDistanceMeters / 60));

  return (
    <div className="relative rounded-2xl overflow-hidden border border-emerald-100 bg-slate-900 shadow-inner flex flex-col">
      {/* Top Map HUD Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs text-white z-10">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${isWorkerActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          <span className="font-semibold tracking-wide text-slate-100">
            {isWorkerActive ? 'LIVE GPS ROUTE: ACTIVE' : 'WORKER OFF-DUTY'}
          </span>
          <span className="text-slate-400 hidden sm:inline">| Anna Nagar Ward 12</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={getRealLocation}
            title="Use device GPS location"
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors ${
              isUsingRealGps ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <LocateFixed className="w-3.5 h-3.5" />
            <span className="text-[11px]">{isUsingRealGps ? 'Device GPS' : 'Simulated GPS'}</span>
          </button>
        </div>
      </div>

      {/* Map Surface (Vector Google Maps / Leaflet aesthetic canvas) */}
      <div className={`relative ${height} w-full overflow-hidden select-none bg-[#0f172a]`}>
        {/* Background Grid Roads & Blocks (Chennai Metro Grid style) */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#0f172a" />
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
            <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#city-grid)" />

          {/* Main Avenues / Roads in Anna Nagar */}
          <path d="M 0 50 Q 150 40, 300 60 T 600 50" fill="none" stroke="#334155" strokeWidth="14" strokeLinecap="round" />
          <path d="M 0 50 Q 150 40, 300 60 T 600 50" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
          
          <path d="M 120 0 L 140 300" fill="none" stroke="#334155" strokeWidth="12" />
          <path d="M 120 0 L 140 300" fill="none" stroke="#1e293b" strokeWidth="8" />

          <path d="M 280 0 L 290 300" fill="none" stroke="#334155" strokeWidth="12" />
          <path d="M 280 0 L 290 300" fill="none" stroke="#1e293b" strokeWidth="8" />

          <path d="M 50 180 L 500 190" fill="none" stroke="#334155" strokeWidth="12" />
          <path d="M 50 180 L 500 190" fill="none" stroke="#1e293b" strokeWidth="8" />

          {/* Active Collection Route Polyline connecting waypoints */}
          {waypoints.length > 1 && (
            <polyline
              points={waypoints
                .map(wp => {
                  const pt = toCanvasCoords(wp.latitude, wp.longitude);
                  return `${pt.x}%,${pt.y}%`;
                })
                .join(' ')}
              fill="none"
              stroke="url(#route-gradient)"
              strokeWidth="4"
              strokeDasharray="6 3"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Waypoints / Household Pins */}
        {waypoints.map((wp, index) => {
          const pt = toCanvasCoords(wp.latitude, wp.longitude);
          const isSelected = selectedPin === wp.id;

          return (
            <div
              key={wp.id}
              onClick={() => setSelectedPin(isSelected ? null : wp.id)}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform duration-200 hover:scale-125 z-10"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md border ${
                  wp.isCollected
                    ? 'bg-emerald-500 border-white text-white'
                    : wp.hasViolation
                    ? 'bg-amber-500 border-white text-white'
                    : 'bg-slate-700 border-slate-300 text-slate-100'
                }`}
              >
                {wp.isCollected ? '✓' : index + 1}
              </div>

              {/* Waypoint Tooltip Popup */}
              {isSelected && (
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 rounded-lg p-2 text-white shadow-xl text-[11px] w-44 z-30 pointer-events-none">
                  <p className="font-bold text-emerald-400">{wp.householdName}</p>
                  <p className="text-slate-300 text-[10px] truncate">{wp.address}</p>
                  <p className="mt-1 text-[10px] font-medium flex items-center gap-1">
                    Status:{' '}
                    {wp.isCollected ? (
                      <span className="text-emerald-400">Waste Collected</span>
                    ) : wp.hasViolation ? (
                      <span className="text-amber-400">Violation Reported</span>
                    ) : (
                      <span className="text-slate-400">Pending Collection</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Customer Home Pin (if specified) */}
        {customerLocation && (
          <div
            style={{
              left: `${toCanvasCoords(customerLocation.latitude, customerLocation.longitude).x}%`,
              top: `${toCanvasCoords(customerLocation.latitude, customerLocation.longitude).y}%`
            }}
            onClick={() => setSelectedPin('customer')}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
          >
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-cyan-500/30 animate-ping" />
              <div className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-white text-white flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4" />
              </div>
            </div>

            {selectedPin === 'customer' && (
              <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-500/40 rounded-lg p-2 text-white shadow-xl text-[11px] w-48 z-30 pointer-events-none">
                <p className="font-bold text-cyan-400">Your Household</p>
                <p className="text-slate-300 text-[10px]">{customerLocation.name}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">
                  Worker is ~{estDistanceMeters}m away (~{estMinutes} mins)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sanitation Worker Tipper / E-Cart Pin */}
        <div
          style={{ left: `${workerCoords.x}%`, top: `${workerCoords.y}%` }}
          onClick={() => setSelectedPin('worker')}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all duration-1000 ease-linear"
        >
          <div className="relative">
            {isWorkerActive && (
              <span className="absolute -inset-2.5 rounded-full bg-emerald-500/40 animate-ping" />
            )}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xl border-2 ${
              isWorkerActive ? 'bg-emerald-600 border-white text-white' : 'bg-slate-600 border-slate-400 text-slate-300'
            }`}>
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          {/* Worker Popover info */}
          {selectedPin === 'worker' && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-emerald-500/40 rounded-xl p-2.5 text-white shadow-2xl text-[11px] w-52 z-30 pointer-events-none">
              <div className="flex items-center justify-between">
                <p className="font-bold text-emerald-400">{worker.name}</p>
                <span className="text-[9px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                  ★ {worker.rating}
                </span>
              </div>
              <p className="text-slate-300 text-[10px] mt-0.5">{worker.vehicleNumber}</p>
              <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>GPS Status:</span>
                <span className={isWorkerActive ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                  {isWorkerActive ? 'Transmitting' : 'Idle'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* GPS Error badge if any */}
        {gpsError && (
          <div className="absolute top-2 left-2 right-2 bg-amber-900/90 text-amber-200 px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5 border border-amber-700">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Bottom Floating Live Telemetry Card */}
        {isWorkerActive && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-white text-xs z-10 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">
                  {worker.name} • {worker.workerCode}
                </p>
                <p className="text-[11px] text-emerald-400 font-medium">
                  {worker.lastLocationUpdate}
                </p>
              </div>
            </div>

            {customerLocation && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Arrival ETA</span>
                <span className="font-bold text-emerald-300 text-sm">~{estMinutes} Mins</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Privacy Guarantee Banner (Mandated by Section 8) */}
      {showPrivacyNotice && (
        <div className="bg-slate-950 px-3 py-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Location Privacy Guarantee:</strong> Worker GPS is tracked and visible only while actively performing the designated collection route. Tracking halts automatically when the route ends.
          </span>
        </div>
      )}
    </div>
  );
};
