import React, { useEffect, useState, useContext, useRef } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import Swal from "sweetalert2";
import { FaLocationDot } from "react-icons/fa6";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "350px" };

const LocationView = () => {
    const { store, actions } = useContext(Context);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [directions, setDirections] = useState(null);
    const mapRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API,
        libraries,
    });

    useEffect(() => {
        if (selectedType && store.userLocation) {
            actions.fetchNearbyPlaces(selectedType);
            setSelectedPlace(null); // Limpiar ruta al cambiar de tipo
            setDirections(null);
        }
    }, [selectedType, store.userLocation]);

    const handlePlaceClick = async (place) => {
        setSelectedPlace(place);
        setDirections(null);

        if (place.location && store.userLocation) {
            const directionsService = new window.google.maps.DirectionsService();
            const result = await directionsService.route({
                origin: store.userLocation,
                destination: {
                    lat: place.location.latitude,
                    lng: place.location.longitude,
                },
                travelMode: window.google.maps.TravelMode.DRIVING,
            });
            setDirections(result);
            if (mapRef.current) {
                mapRef.current.panTo({
                    lat: place.location.latitude,
                    lng: place.location.longitude,
                });
                mapRef.current.setZoom(15);
            }
        }
    };

    const handleCenterUser = () => {
        if (store.userLocation && mapRef.current) {
            mapRef.current.panTo(store.userLocation);
            mapRef.current.setZoom(14);
        }
    };

    if (loadError) return <p>Error cargando el mapa</p>;
    if (!isLoaded) return <p>Cargando mapa...</p>;

    return (
        <div className='containerRMC'>
            <div className='containerH'>
                <div className="formContact">

                    <div className="inputContact" style={{ width: "90vw", maxHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={
                                selectedPlace?.location
                                    ? { lat: selectedPlace.location.latitude, lng: selectedPlace.location.longitude }
                                    : store.userLocation
                            }
                            zoom={14}
                            onLoad={(map) => {
                                mapRef.current = map;
                            }}
                        >
                        </GoogleMap>

                        {store.userLocation && <Marker position={store.userLocation} />}
                        {store.nearbyPlaces?.map((place, index) => (
                            place.location && (
                                <Marker
                                    key={index}
                                    position={{
                                        lat: place.location.latitude,
                                        lng: place.location.longitude,
                                    }}
                                    onClick={() =>
                                        Swal.fire(
                                            `${place.displayName?.text || "Sin nombre"}\nDirección: ${place.formattedAddress}\nTeléfono: ${place.internationalPhoneNumber || "No disponible"}`
                                        )
                                    }
                                />
                            )
                        ))}
                        {directions && <DirectionsRenderer directions={directions} />}
                        <button className="buttonPearl" style={{ width: "150px", height: "40px", borderRadius: "20px", color: 'white' }} onClick={handleCenterUser}> <FaLocationDot style={{ fontSize: '1em' }} />Mi ubicación</button>

                        {/* Botones de tipo de lugar */}
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", width: "80vw", gap: "10px", flexWrap: "wrap" }}>
                            <button className="buttonPearl" style={{ width: "100px", height: "50px", borderRadius: "20px", color: 'white' }} onClick={() => setSelectedType("Centro LIBRE para mujeres")}>Centro LIBRE</button>
                            <button className="buttonPearl" style={{ width: "70px", height: "50px", borderRadius: "20px", color: 'white' }} onClick={() => setSelectedType("police")}>Policía</button>
                            <button className="buttonPearl" style={{ width: "90px", height: "50px", borderRadius: "20px", color: 'white' }} onClick={() => setSelectedType("hospitals")}>Hospitales</button>
                        </div>

                    </div>

                    {/* Lista de lugares */}
                    <div className="inputContact" style={{ borderRadius: "none", textAlign: "center", color: "black", maxHeight: "30vh", overflowY: "auto", marginTop: "10px" }}>
                        {store.nearbyPlaces.length > 0 ? (
                            store.nearbyPlaces.map((place, index) => (
                                <div
                                    key={index}
                                    onClick={() => handlePlaceClick(place)}
                                    style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}
                                >
                                    <h2>{place.displayName?.text || "Sin nombre"}</h2>
                                    <p>{place.formattedAddress || "Dirección desconocida"}</p>
                                    {place.internationalPhoneNumber && (
                                        <p>Teléfono: {place.internationalPhoneNumber}</p>
                                    )}
                                    {store.userLocation && place.location && (
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&origin=${store.userLocation.lat},${store.userLocation.lng}&destination=${place.location.latitude},${place.location.longitude}&travelmode=driving`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: "inline-block", marginTop: "8px", color: "#007bff", textDecoration: "underline" }}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            ¿Cómo llegar?
                                        </a>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div>
                                <h5>Presiona una opción para ver lugares cercanos</h5>
                                <h6 style={{color:"red"}}>NOTA: Los Centros LIBRE aun no se encuentran dados de alta en Google. Para este DEMO, inscribimos solo uno de Nuevo León. Para su uso nacional, podemos incluir la gestión del alta de todos los Centros.</h6>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationView;
