import React, { useEffect, useContext, useState } from 'react'
import { Context } from '../store/appContext';
import { Link } from "react-router-dom";
import './../../styles/home.css';
import { TbMessageChatbotFilled } from "react-icons/tb";
import { FaChartPie } from "react-icons/fa";
import { LiaMapSolid } from "react-icons/lia";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";




const HomeAdmin = () => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  const token = localStorage.getItem('token');
  const { store, actions } = useContext(Context);

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La geolocalización no es soportada por este navegador.");
      return;
    }

    const getLocation = () => {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitud: latitude, longitud: longitude });
          actions.setUserLocation(latitude, longitude);
          console.log("ubiv", location);
        },
        (error) => {
          setError("Error al obtener la ubicación: ", error);
        }
      );

    };

    getLocation();
  }, []);
  return (
    <div>
      {token ? (
        <>
          <h2 className='headingH'>Inicio</h2>
          <div className='formis'>

            {/* {token && (
              <button className='buttonPearlAdmin'>
                <Link className='wrap' to='/admin-console'>
                  <p>
                    <span><MdOutlineDashboardCustomize style={{ fontSize: '2.5em' }} /></span>
                    <span>Consola</span>
                  </p>
                </Link>
              </button>
            )} */}
            {token && (
              <button className='buttonPearlAdmin'>
                <Link className='wrap' to='/mapine'>
                  <p>
                    <span><LiaMapSolid style={{ fontSize: '2.5em' }} /></span>
                    <span> Mapas</span>
                  </p>
                </Link>
              </button>
            )}
            {token && (
              <button className='buttonPearlAdmin'>
                <Link className='wrap' to='/stats-and-reports'>
                  <p>
                    <span><FaChartPie style={{ fontSize: '2.5em' }} /></span>
                    <span> Estadística</span>
                  </p>
                </Link>
              </button>
            )}

            {/* {token && (
              <button className='buttonPearlAdmin'>
                <Link className='wrap' to='/chatbot'>
                  <p>
                    <span><TbMessageChatbotFilled style={{ fontSize: '2.5em' }} /></span>
                    <span> Chatbot</span>
                  </p>
                </Link>
              </button>
            )} */}
            {token && (
              <button className='buttonPearlAdmin'>
                <Link className='wrap' to='/expediente'>
                  <p>
                    <span><FaAddressCard style={{ fontSize: '2.5em' }} /></span>
                    <span> Expediente</span>
                  </p>
                </Link>
              </button>
            )}
            {token && (
              <button className='buttonPearlAdmin'>
                <Link className='wrap' to='/blog'>
                  <p>
                    <span><TbReportSearch style={{ fontSize: '2.5em' }} /></span>
                    <span>Reportes</span>
                  </p>
                </Link>
              </button>
            )}
          </div>
        </>
      ) : (
        <div>
          <h1>Por favor inicia sesión</h1>
          <Link to='/login'>Iniciar sesión</Link>
        </div>
      )}
    </div>
  );
};

export default HomeAdmin
