import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import React from 'react'

const LocationMarker = ({ setCoordinates,setAddress }) => {
    const [position, setPosition] = useState(null);

    const map = useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;

            setPosition(e.latlng);
            setCoordinates({ lat, lng });

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
                const data = await res.json();

                setAddress({
                    address: data.display_name || "",
                    city: data.address.city || data.address.town || data.address.village || "",
                    state:data.address.state || ""
                })
            } catch (error) {
                console.error("Reverse geocoding failed",error)
            }
        }
    })

    return position ? <Marker position={position} /> : null;
}

const MapPicker = ({setCoordinates,setAddress}) => {
  return (
      <MapContainer center={[23.0225,72.5714]} zoom={6} className="h-80 w-full rounded-lg">
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker setCoordinates={setCoordinates} setAddress={setAddress}/>
    </MapContainer>
  )
}

export default MapPicker