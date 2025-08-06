import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card } from 'react-bootstrap';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const LocationPicker = ({ position, setPosition }) => {
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position ? (
      <Marker position={position} />
    ) : null;
  };

  return (
    <Card className="mb-3">
      <Card.Body className="p-0" style={{ height: '300px' }}>
        <MapContainer
          center={position || [-1.2921, 36.8219]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </Card.Body>
      {position && (
        <Card.Footer className="small">
          Selected: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </Card.Footer>
      )}
    </Card>
  );
};

export default LocationPicker;