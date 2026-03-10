import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

import React from 'react'
const LocationMarker = ({ setCoordinates }) => {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setCoordinates(e.latlng);
        }
    })

    return position ? <Marker position={position} /> : null;
}

const MapPicker = ({setCoordinates}) => {
  return (
      <MapContainer center={[23.0225,72.5714]} zoom={6} className="h-80 w-full rounded-lg">
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker setCoordinates={setCoordinates}/>
    </MapContainer>
  )
}

export default MapPicker