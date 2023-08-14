import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from 'react-leaflet';
import L from 'leaflet'; // Importa la clase Leaflet.Icon

const Map = ({ customers, onMarkerClick, selectedClientCoordinates }) => {

  const [mapInstance, setMapInstance] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);

  console.log("desde mapa", selectedClientCoordinates)
  // Calcula el centro promedio de las coordenadas de los clientes
  const calculateCenter = () => {
    if (selectedClientCoordinates) {
      return [
        selectedClientCoordinates.latitude,
        selectedClientCoordinates.longitude
      ];
    } else if (customers.length > 0) {
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

  // Define un icono personalizado utilizando la clase Leaflet.Icon
  const customIcon = new L.Icon({
    iconUrl: 'https://app16.persat.com.ar/inhar/res/res_version_44/js/myGoogleMapsUtilities/markers/client_type_markers/default_client_violet.png', // Coloca aquí la URL del icono
    iconSize: [32, 32], // Define el tamaño del icono [ancho, alto]
  });

 useEffect(() => {
    // Update the map center based on selectedClientCoordinates
    if (mapInstance && selectedClientCoordinates) {
      setMapCenter([
        selectedClientCoordinates.latitude,
        selectedClientCoordinates.longitude
      ]);

      // Manually update the map's view
      mapInstance.setView(
        [selectedClientCoordinates.latitude, selectedClientCoordinates.longitude],
        10
      );
    }
  }, [mapInstance, selectedClientCoordinates]);

  return (
    <MapContainer center={calculateCenter()} zoom={10} style={{ height: '500px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {customers.map((customer) => (
        <Marker
          key={customer.id}
          position={[customer.location.latitude, customer.location.longitude]}
          onClick={() => onMarkerClick(customer)}
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