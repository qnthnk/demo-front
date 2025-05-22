import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import { useNavigate, Link } from 'react-router-dom';
import './../../styles/Login.css';
import fondo from '../../img/tejedoras.webp';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showVideo, setShowVideo] = useState(true); // 👈 Para mostrar el video
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (store.user?.isAuthenticated) {
      const redirectPath = store.user.role === 'admin' ? '/admin-dashboard' : '/home';
      navigate(redirectPath, { replace: true });
    }
  }, [store.user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setError('');

    try {
      const response = await actions.login({ email, password });

      if (response?.token) {
        const redirectPath = store.user.role === 'admin' ? '/admin-dashboard' : '/home';
        navigate(redirectPath);
      } else {
        setError('Credenciales incorrectas o error en el servidor');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setError(error.message || 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
    }
  };

  const estiloFondo = {
    backgroundImage: `url(${fondo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh'
  };

  return (
    <div className="containernn2" style={estiloFondo}>
      {/* Modal de video */}
      {showVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{ position: 'relative', width: '80%', maxWidth: '800px' }}>
            <iframe
              width="100%"
              height="350"
              src="https://www.youtube.com/embed/KrTuzouf-44?autoplay=1"
              title="YouTube video player"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setShowVideo(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'red',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
                height: '20px',
                width: '40px',
                fontSize: '10px',
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      

      <div style={{marginTop: '-120px'}}>
        <form className="form" onSubmit={handleSubmit} style={{ textAlign: 'center', height:'150px' }}>
          <input
            placeholder="Correo electrónico"
            id="email"
            name="email"
            type="email"
            className="inputlog"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Contraseña"
            id="password"
            name="password"
            type="password"
            className="inputlog"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="loginNew" style={{ marginTop: "-30px" }}>
            <button type="submit">Ingresar</button>
          </div>
          <div style={{ marginTop: '10%', textAlign: 'center' }}>
            <span>
              <Link style={{ color: "rgb(130, 23, 156)" }} className='forgot-password' to="/login">Olvidé mi contraseña</Link>
            </span>
            <span>
              <Link className='forgot-password' style={{ fontSize: 'x-large', color: "rgb(130, 23, 156)" }} to="/login">Regístrate</Link>
            </span>
            {/* <span>
              <Link className='forgot-password' style={{ fontSize: 'x-large', color: "rgb(130, 23, 156)" }} to="/ocr">OCR</Link>
            </span> */}

          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
