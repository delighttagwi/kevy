import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet using CDNs
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for tracking
const driverIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const customerIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const centerHarare: [number, number] = [-17.8248, 31.0530];

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

function LocationMarker({ onLocationSelect, initialLocation }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLocation ? L.latLng(initialLocation.lat, initialLocation.lng) : null
  );

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export function MapPicker({ onLocationSelect, initialLocation }: MapPickerProps) {
  return (
    <div className="h-64 rounded-xl overflow-hidden border-2 border-gray-100 shadow-inner">
      <MapContainer center={initialLocation ? [initialLocation.lat, initialLocation.lng] : centerHarare} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker onLocationSelect={onLocationSelect} initialLocation={initialLocation} />
      </MapContainer>
    </div>
  );
}

interface LiveMapProps {
  customerLocation?: { lat: number; lng: number };
  driverLocation?: { lat: number; lng: number };
}

function MapUpdater({ locations }: { locations: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  return null;
}

export function LiveMap({ customerLocation, driverLocation }: LiveMapProps) {
  const points: [number, number][] = [];
  if (customerLocation) points.push([customerLocation.lat, customerLocation.lng]);
  if (driverLocation) points.push([driverLocation.lat, driverLocation.lng]);

  return (
    <div className="h-[400px] md:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <MapContainer center={centerHarare} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {customerLocation && (
          <Marker position={[customerLocation.lat, customerLocation.lng]} icon={customerIcon}>
            <Popup>Delivery Dropoff Point</Popup>
          </Marker>
        )}
        {driverLocation && (
          <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
            <Popup>Delivery Driver</Popup>
          </Marker>
        )}
        <MapUpdater locations={points} />
      </MapContainer>
    </div>
  );
}
