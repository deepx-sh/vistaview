import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import React from 'react'

const FlyToDefault = ({ defaultCoordinates }) => {
    const map = useMap();
    useEffect(() => {
        if (defaultCoordinates?.lat && defaultCoordinates?.lng) {
            map.flyTo([defaultCoordinates.lat,defaultCoordinates.lng],13)
        }
    }, [defaultCoordinates?.lat, defaultCoordinates?.lng])
    
    return null
}
const LocationMarker = ({ setCoordinates,setAddress,defaultCoordinates }) => {
    const [position, setPosition] = useState(defaultCoordinates?.lat && defaultCoordinates?.lng ? {lat:defaultCoordinates.lat,lng:defaultCoordinates.lng}:null);

    useEffect(() => {
        if (defaultCoordinates?.lat && defaultCoordinates?.lng) {
            setPosition({lat:defaultCoordinates.lat,lng:defaultCoordinates.lng})
        }
    },[defaultCoordinates?.lat,defaultCoordinates?.lng])
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

const MapPicker = ({setCoordinates,setAddress,defaultCoordinates}) => {
  return (
      <MapContainer center={[23.0225,72.5714]} zoom={6} className="h-80 w-full rounded-lg">
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FlyToDefault defaultCoordinates={defaultCoordinates}/>
          <LocationMarker setCoordinates={setCoordinates} setAddress={setAddress} defaultCoordinates={defaultCoordinates}/>
    </MapContainer>
  )
}

export default MapPicker