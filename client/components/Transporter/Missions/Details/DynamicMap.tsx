'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
  pickupLat: number | null;
  pickupLng: number | null;
  deliveryLat: number | null;
  deliveryLng: number | null;
  pickupAddress: string;
  deliveryAddress: string;
  status?: string;
}

export default function DynamicMap({ 
  pickupLat, 
  pickupLng, 
  deliveryLat, 
  deliveryLng, 
  pickupAddress, 
  deliveryAddress,
  status 
}: Props) {
  // ✅ ADD THIS DEBUG SECTION HERE (after props, before useState)
  console.log('DynamicMap props (raw):', { pickupLat, pickupLng, deliveryLat, deliveryLng });

  // ✅ Convert to numbers safely
  const safePickupLat = pickupLat ? Number(pickupLat) : null;
  const safePickupLng = pickupLng ? Number(pickupLng) : null;
  const safeDeliveryLat = deliveryLat ? Number(deliveryLat) : null;
  const safeDeliveryLng = deliveryLng ? Number(deliveryLng) : null;

  console.log('DynamicMap props (converted):', { 
    safePickupLat, 
    safePickupLng, 
    safeDeliveryLat, 
    safeDeliveryLng 
  });

  const hasValidCoordinates = safePickupLat && safePickupLng && safeDeliveryLat && safeDeliveryLng 
    && !isNaN(safePickupLat) && !isNaN(safePickupLng) 
    && !isNaN(safeDeliveryLat) && !isNaN(safeDeliveryLng);

  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  // Fetch route from OSRM
  useEffect(() => {
    const fetchRoute = async () => {
      if (!hasValidCoordinates) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${safePickupLng},${safePickupLat};${safeDeliveryLng},${safeDeliveryLat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          const coordinates = data.routes[0].geometry.coordinates.map(
            (coord: number[]) => [coord[1], coord[0]] as [number, number]
          );
          setRoutePoints(coordinates);
          
          const distKm = (data.routes[0].distance / 1000).toFixed(1);
          setDistance(`${distKm} km`);
          
          const mins = Math.round(data.routes[0].duration / 60);
          setDuration(`${mins} min`);
        }
      } catch (error) {
        console.error('Failed to fetch route:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoute();
  }, [safePickupLat, safePickupLng, safeDeliveryLat, safeDeliveryLng, hasValidCoordinates]);

  // Default center for Algeria
  const defaultCenter: [number, number] = [28.0339, 1.6596];
  
  let centerLat = defaultCenter[0];
  let centerLng = defaultCenter[1];
  
  if (hasValidCoordinates && safePickupLat && safePickupLng && safeDeliveryLat && safeDeliveryLng) {
    centerLat = (safePickupLat + safeDeliveryLat) / 2;
    centerLng = (safePickupLng + safeDeliveryLng) / 2;
  }
  
  const getZoomLevel = () => {
    if (!hasValidCoordinates) return 5;
    if (!safePickupLat || !safeDeliveryLat) return 5;
    const latDiff = Math.abs(safePickupLat - safeDeliveryLat);
    if (latDiff > 5) return 5;
    if (latDiff > 2) return 6;
    if (latDiff > 1) return 7;
    return 8;
  };

  if (!hasValidCoordinates) {
    return (
      <div className="bg-slate-200 dark:bg-slate-800 rounded-xl h-80 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-slate-400">map</span>
          <p className="text-sm text-slate-500 mt-3">Map will appear when mission starts</p>
          <p className="text-xs text-slate-400 mt-1">Waiting for location coordinates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden h-80 relative shadow-md">
      {loading && (
        <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
            <span className="text-sm">Loading route...</span>
          </div>
        </div>
      )}
      
      {(distance || duration) && (
        <div className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg px-3 py-1.5 shadow-md">
          <div className="flex items-center gap-3 text-xs">
            {distance && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">straighten</span>
                <span className="font-medium">{distance}</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="font-medium">{duration}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {status === 'delivered' && (
        <div className="absolute top-3 left-3 z-10 bg-green-500 text-white rounded-lg px-3 py-1.5 shadow-md">
          <div className="flex items-center gap-1 text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">task_alt</span>
            <span>Delivery Complete</span>
          </div>
        </div>
      )}
      
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={getZoomLevel()}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {safePickupLat && safePickupLng && (
          <Marker position={[safePickupLat, safePickupLng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-green-600">📍 Pickup Location</p>
                <p className="text-xs text-slate-500 mt-1 max-w-48">{pickupAddress}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {safeDeliveryLat && safeDeliveryLng && (
          <Marker position={[safeDeliveryLat, safeDeliveryLng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-red-500">🏁 Delivery Location</p>
                <p className="text-xs text-slate-500 mt-1 max-w-48">{deliveryAddress}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            color="#0df20d"
            weight={4}
            opacity={0.8}
            dashArray="8, 8"
          />
        )}
      </MapContainer>
    </div>
  );
}