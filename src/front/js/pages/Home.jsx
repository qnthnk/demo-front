import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';
import { Navigate } from 'react-router-dom';
import './../../styles/home.css';
import HomeUser from './HomeUser.jsx';
import HomeAdmin from './HomeAdmin.jsx';
import { FaInfo } from "react-icons/fa";
import fondo from '../../img/cartilla.png'; // Ajusta el path

const Home = () => {
  const token = localStorage.getItem('token');
  const { actions } = useContext(Context);
    const estiloFondo = {
      backgroundImage: `url(${fondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh'
    };

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La geolocalización no es soportada por este navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitud: latitude, longitud: longitude });
        actions.setUserLocation(latitude, longitude);
        console.log("Ubicación:", location);
      },
      (error) => {
        setError("Error al obtener la ubicación: ", error);
      }
    );
  }, []);

  // Función para manejar el cambio del checkbox
  const handleToggle = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <>
      {token ? (
        <div
          className='containerRMC' style={estiloFondo}
        >
          <div className='containerH'>
           
              <button className="checkbox-wrapper-8"
               style={{ 
                marginTop: '20px', 
                borderRadius: '20px', 
                backgroundColor: isAdmin ? 'rgba(163, 139, 43, 0.5)' : 'rgb(134, 37, 68, 0.5)',
                transition: 'background-color 0.3s ease', 
                backdropFilter: 'blur(15px)', width: '170px' }}>
            

                <input
                  type="checkbox"
                  id="cb3-8"
                  className="tgl tgl-skewed"
                  checked={isAdmin}
                  onChange={handleToggle}
                />
                <label
                  htmlFor="cb3-8"
                  data-tg-on="Modo Admin"
                  data-tg-off="Modo Usuario"
                  className="tgl-btn"
                ></label>
              </button>

            <div className="checkbox-wrapper-8">
              {isAdmin ? <HomeAdmin /> : <HomeUser />}
            </div>
          </div>
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content demoContainer">
                  <div className="modal-body">
                    <div className=''>Debajo de la leyenda de "Usuario" se encuentra un botón que activa el modo Admin. Puedes cambiar las vistas para tener acceso a ambas consolas. Esto es solo para el Demo. Cuando el sistema está en funcionamiento, cada rol de usuario puede ver únicamente las opciones que le corresponden.</div>
                  </div>
                  <div className="modal-content">
                    <button type="button" className="btn btn-warning" data-bs-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default Home;