import React, { useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate, Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";;
import "../../styles/home.css";
import LOGO from "../../img/mujeres.png"
import { RiHome6Fill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import Swal from 'sweetalert2';


const Navbar = () => {
  const { store, actions } = useContext(Context);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) return null;

  const handleLogout = async () => {
    try {
      await actions.logout();

      navigate("/login");

      Swal.fire("Has cerrado sesión correctamente.");
    } catch (error) {
      console.error("Error en el logout:", error);
      Swal.fire("Ocurrió un error al cerrar sesión. Inténtalo de nuevo.");
    }
  };

  const handleMigrappClick = () => {
    const token = localStorage.getItem('token');

    if (token) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      <nav className="navbar bg-body-tertiary fixed-top"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(15px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="container-fluid">
          <img src={LOGO} alt="Via Sacra" className="logoNav" />

          <button className="login-buttonesN" style={{ float: "right" }}>
            <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
              <RiHome6Fill style={{ fontSize: "2em" }} />
            </Link></button>


          <button className="login-buttonesN" style={{ float: "right" }}>
            <Link
              to="/login"
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={(e) => {
                e.preventDefault(); // Evita la navegación predeterminada
                handleLogout(); // Llama a la función de cierre de sesión
              }}
            >
              <MdLogout style={{ fontSize: "2em" }} />
            </Link>
          </button>
          <div
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h6 className="navbar-brand" id="offcanvasNavbarLabel">
                Menu
              </h6>
              <button
                type="button"
                className="btn-close btn-close-dark"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body ">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li>
                  <Link
                    className="nav-link"
                    to="/login"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onClick={(e) => {
                      e.preventDefault(); // Evita la navegación predeterminada
                      handleLogout(); // Llama a la función de cierre de sesión
                    }}
                  >
                    Cerrar sesión
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;