import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Map = ({ customers, onMarkerClick, selectedClientCoordinates, zoom }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);

  // Calcula el centro promedio de las coordenadas de los clientes
// Calcula el centro para el mapa
const calculateCenter = () => {
  if (selectedClientCoordinates) {
    // Si hay coordenadas de cliente seleccionado, centrar en esas coordenadas
    return [
      selectedClientCoordinates.latitude,
      selectedClientCoordinates.longitude,
    ];
  } else if (customers.length < 0) {
    // Si no hay coordenadas de cliente seleccionado, calcular el centro promedio de todos los clientes
    const totalCustomers = customers.length;
    const totalLatitude = customers.reduce(
      (sum, customer) => sum + customer.location.latitude,
      0
    );
    const totalLongitude = customers.reduce(
      (sum, customer) => sum + customer.location.longitude,
      0
    );

    const centerLatitude = totalLatitude / totalCustomers;
    const centerLongitude = totalLongitude / totalCustomers;

    return [centerLatitude, centerLongitude];
  } else {
    // Default center if no customers
    return [0, 0];
  }
};

  console.log("nuevo zoom", zoom)
  console.log("coordendas seleccionadas", selectedClientCoordinates)
  // Define un icono personalizado utilizando la clase Leaflet.Icon
  const customIcon = new L.Icon({
    iconUrl:
      "https://app16.persat.com.ar/inhar/res/res_version_44/js/myGoogleMapsUtilities/markers/client_type_markers/default_client_violet.png",
    iconSize: [32, 32],
  });

  const map = useMap(); // Obtén la instancia del mapa

  useEffect(() => {
    // Update the map center based on selectedClientCoordinates and zoom
    if (selectedClientCoordinates) {
      map.setView(
        [selectedClientCoordinates.latitude, selectedClientCoordinates.longitude],
        zoom
      );
    }
  }, [map, selectedClientCoordinates, zoom]);
  
  return (
    <MapContainer center={selectedClientCoordinates} zoom={zoom} style={{ height: "500px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {customers.map((customer) => (
        <Marker
          key={customer.id}
          position={[
            customer.location.latitude,
            customer.location.longitude,
          ]}
          onClick={() => {
            onMarkerClick(customer);
          }}
          icon={customIcon}
        >
          <Popup>{customer.name}</Popup>
        </Marker>
      ))}
      {selectedClientCoordinates && (
        <Marker position={[selectedClientCoordinates.latitude, selectedClientCoordinates.longitude]}>
          <Popup>Selected Client</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;