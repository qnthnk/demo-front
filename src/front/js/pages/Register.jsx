import React, { useState, useContext, useEffect, useRef } from 'react';
import { Context } from '../store/appContext';
import postalCodesData from './../../../../csvjson.json';
import './../../styles/Register.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const { store, actions } = useContext(Context);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  // Configuración de reCAPTCHA
  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

  // Estado del formulario (manteniendo todos tus campos originales)
  const [formData, setFormData] = useState({
    first_name: '',
    first_last_name: '',
    second_last_name: '',
    curp: '',
    gender: '',
    birthdate: '',
    email: '',
    password: '',
    phone_number: '',
    facebook: '',
    instagram: '',
    x: '',
    blood_type: '',
    allergy: '',
    disease: '',
    state: 'Nuevo León',
    colonia_mex: '',
    house_number: 'none',
    street: '',
    seccion: 'none',
    zip_code: '',
    distrito_federal: 'none',
    distrito_local: 'none',
    nombre_municipio: '',
    tipo_seccion: 'none',
    latitude: '',
    longitude: ''
  });

  const [errors, setErrors] = useState({});
  const [matchingColonies, setMatchingColonies] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler para reCAPTCHA
  const onCaptchaChange = (token) => {
    setRecaptchaToken(token);
    if (errors.recaptcha) {
      setErrors(prev => ({ ...prev, recaptcha: undefined }));
    }
  };

  const resetRecaptcha = () => {
    setRecaptchaToken(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  // Validación del formulario (modificada para incluir reCAPTCHA en el paso 5)
  const validateForm = (currentStep) => {
    let newErrors = {};
    let genericLegend = "Completa este campo para continuar.";

    if (currentStep === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = genericLegend;
      if (!formData.first_last_name.trim()) newErrors.first_last_name = genericLegend;
      if (!formData.second_last_name.trim()) newErrors.second_last_name = genericLegend;
      if (!formData.curp.trim()) {
        newErrors.curp = genericLegend;
      } else if (!/^[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]{0,2}$/.test(formData.curp)) {
        newErrors.curp = "Ingrese un CURP válido.";
      }
    }

    if (currentStep === 2) {
      if (!formData.street.trim()) newErrors.street = genericLegend;
      if (!formData.zip_code.trim()) {
        newErrors.zip_code = genericLegend;
      } else if (!/^\d{5}$/.test(formData.zip_code)) {
        newErrors.zip_code = "Ingrese un código postal válido de 5 dígitos.";
      } else if (matchingColonies.length === 0 && formData.nombre_municipio === '' && formData.zip_code.length === 5) {
        newErrors.zip_code = "Código postal no encontrado.";
      }

      if (matchingColonies.length > 0 && !formData.colonia_mex) {
        newErrors.colonia_mex = "Debes seleccionar una colonia.";
      }
    }

    if (currentStep === 3) {
      if (!formData.email.trim()) {
        newErrors.email = genericLegend;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Formato de email inválido.";
      }
      if (!formData.phone_number.trim()) {
        newErrors.phone_number = genericLegend;
      } else if (!/^\d{10}$/.test(formData.phone_number)) {
        newErrors.phone_number = "El teléfono debe contener 10 dígitos.";
      }
    }

    if (currentStep === 4) {
      if (!formData.blood_type.trim()) newErrors.blood_type = genericLegend;
      if (!formData.allergy.trim()) newErrors.allergy = genericLegend;
      if (!formData.disease.trim()) newErrors.disease = genericLegend;
    }

    if (currentStep === 5) {
      if (!formData.password) {
        newErrors.password = genericLegend;
      } else if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
      }
      if (!recaptchaToken) {
        newErrors.recaptcha = "Por favor completa la verificación reCAPTCHA.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers originales (se mantienen igual)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
    }
    if (name === 'colonia_mex' && errors.colonia_mex) {
      setErrors(prevErrors => ({ ...prevErrors, colonia_mex: undefined }));
    }
  };

  const handleZipCodeChange = (e) => {
    const zipCode = e.target.value;

    if (!/^\d*$/.test(zipCode) || zipCode.length > 5) {
      return;
    }

    setFormData(prevData => ({
      ...prevData,
      zip_code: zipCode,
      nombre_municipio: '',
      colonia_mex: ''
    }));

    setMatchingColonies([]);

    if (errors.zip_code || errors.colonia_mex) {
      setErrors(prevErrors => ({
        ...prevErrors,
        zip_code: undefined,
        colonia_mex: undefined
      }));
    }

    if (zipCode.length === 5) {
      const dataForZip = postalCodesData[zipCode];

      if (dataForZip) {
        const municipio = dataForZip.MUNICIPIO;
        const coloniesString = dataForZip.COLONIAS || '';

        const coloniesArray = coloniesString
          .split(',')
          .map(colonia => colonia.trim())
          .filter(colonia => colonia !== '')
          .sort();

        setMatchingColonies(coloniesArray);

        setFormData(prevData => ({
          ...prevData,
          nombre_municipio: municipio
        }));

      } else {
        setMatchingColonies([]);
        setErrors(prevErrors => ({
          ...prevErrors,
          zip_code: "Código postal no encontrado."
        }));
      }
    }
  };

  const handleCURPChange = (e) => {
    const { value } = e.target;
    const curp = value.toUpperCase();
    const { birthdate, gender } = extractBirthdateAndGenderFromCURP(curp);

    setFormData(prevData => ({
      ...prevData,
      curp: curp,
      birthdate: birthdate,
      gender: gender
    }));

    if (errors.curp) {
      setErrors(prevErrors => ({ ...prevErrors, curp: undefined }));
    }
  };

  const extractBirthdateAndGenderFromCURP = (curp) => {
    if (curp && curp.length === 18) {
      const rawYear = curp.substring(4, 6);
      const month = curp.substring(6, 8);
      const day = curp.substring(8, 10);
      const genderChar = curp[10];

      const yearDigits = parseInt(rawYear, 10);
      const currentYearLastTwoDigits = new Date().getFullYear() % 100;
      const fullYear = yearDigits <= currentYearLastTwoDigits ? `20${rawYear}` : `19${rawYear}`;

      const dateObj = new Date(`${fullYear}-${month}-${day}`);
      if (isNaN(dateObj.getTime()) || dateObj.getDate() !== parseInt(day, 10) || dateObj.getMonth() + 1 !== parseInt(month, 10)) {
        return { birthdate: '', gender: '' };
      }

      const birthdate = `${fullYear}-${month}-${day}`;
      const gender = genderChar === 'H' ? 'Hombre' : genderChar === 'M' ? 'Mujer' : '';

      return { birthdate, gender };
    }
    return { birthdate: '', gender: '' };
  };

  const handleNext = () => {
    if (validateForm(step)) {
      setStep(step + 1);
    } else {
      console.log("Errores de validación impiden avanzar:", errors);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    if (step === 5) {
      resetRecaptcha();
    }
  };

  // Handler de envío modificado para incluir reCAPTCHA
  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!validateForm(5)) {
      Swal.fire("Formulario incompleto", "Por favor complete los campos requeridos en el último paso.", "warning");
      setIsSubmitting(false);
      return;
    }

    let dataToSend = {
      ...formData,
      recaptcha_token: recaptchaToken
    };

    try {
      const result = await actions.register(dataToSend);
      Swal.fire({
        title: "¡Registro Exitoso!",
        text: "Serás redirigido al inicio de sesión.",
        icon: "success"
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      console.error("Error en el registro:", error);
      resetRecaptcha();
      const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error inesperado durante el registro.";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("La geolocalización no es soportada por este navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }));
      },
      (geoError) => {
        console.error("Error al obtener la ubicación: ", geoError);
      }
    );
  }, []);

  return (
    <div className='containerRMC'>
      <div className='containerH'>
        <h3 className='heading'>Completa el siguiente formulario para inscribirte</h3>
        <div className="container">
          <form className='forms' onSubmit={(e) => e.preventDefault()} noValidate>
            {step === 1 && (
              <div>
                <h3 className='heading'>Paso 1: Datos Generales</h3>
                <input className={`inputs ${errors.first_name ? 'input-error' : ''}`} type="text" name="first_name" placeholder='Nombre(s)' value={formData.first_name} onChange={handleChange} />
                {errors.first_name && <p className="error-text">{errors.first_name}</p>}
                <input className={`inputs ${errors.first_last_name ? 'input-error' : ''}`} type="text" name="first_last_name" placeholder='Primer Apellido' value={formData.first_last_name} onChange={handleChange} />
                {errors.first_last_name && <p className="error-text">{errors.first_last_name}</p>}
                <input className={`inputs ${errors.second_last_name ? 'input-error' : ''}`} type="text" name="second_last_name" placeholder='Segundo Apellido' value={formData.second_last_name} onChange={handleChange} />
                {errors.second_last_name && <p className="error-text">{errors.second_last_name}</p>}
                <input className={`inputs ${errors.curp ? 'input-error' : ''}`} type="text" name="curp" placeholder='CURP (18 caracteres)' value={formData.curp} onChange={handleCURPChange} maxLength="18" style={{ textTransform: 'uppercase' }} />
                {errors.curp && <p className="error-text">{errors.curp}</p>}
                <button className='login-buttont' type="button" onClick={handleNext}>Siguiente</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className='heading'>Paso 2: Dirección</h3>
                <input
                  className={`inputs ${errors.zip_code ? 'input-error' : ''}`}
                  type="text"
                  inputMode='numeric'
                  name="zip_code"
                  placeholder='Código Postal (5 dígitos)'
                  value={formData.zip_code}
                  onChange={handleZipCodeChange}
                />
                {errors.zip_code && <p className="error-text">{errors.zip_code}</p>}

                {formData.nombre_municipio && (
                  <div className='info-display-box'>
                    <p>Municipio: {formData.nombre_municipio}</p>
                    <p>Estado: {formData.state}</p>
                  </div>
                )}

                {matchingColonies.length > 0 && (
                  <>
                    <label htmlFor="colonia_mex" className="form-label">Colonia:</label>
                    <select
                      id="colonia_mex"
                      className={`inputs ${errors.colonia_mex ? 'input-error' : ''}`}
                      name="colonia_mex"
                      value={formData.colonia_mex}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una colonia...</option>
                      {matchingColonies.map((colonia, index) => (
                        <option key={index} value={colonia}>
                          {colonia}
                        </option>
                      ))}
                    </select>
                    {errors.colonia_mex && <p className="error-text">{errors.colonia_mex}</p>}
                  </>
                )}

                <input
                  className={`inputs ${errors.street ? 'input-error' : ''}`}
                  type="text"
                  name="street"
                  placeholder='Calle y Número Ext./Int.'
                  value={formData.street}
                  onChange={handleChange}
                />
                {errors.street && <p className="error-text">{errors.street}</p>}

                <button className='login-buttont' type="button" onClick={handleBack}>Atrás</button>
                <button className='login-buttont' type="button" onClick={handleNext}>Siguiente</button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className='heading'>Paso 3: Datos de Contacto</h3>
                <input className={`inputs ${errors.email ? 'input-error' : ''}`} type="email" name="email" placeholder='Email' value={formData.email} onChange={handleChange} />
                {errors.email && <p className="error-text">{errors.email}</p>}
                <input className={`inputs ${errors.phone_number ? 'input-error' : ''}`} type="tel" inputMode='tel' name="phone_number" placeholder='Teléfono (10 dígitos)' value={formData.phone_number} onChange={handleChange} maxLength="10" />
                {errors.phone_number && <p className="error-text">{errors.phone_number}</p>}
                <input className='inputs' type="text" name="facebook" placeholder='Usuario Facebook (opcional)' value={formData.facebook} onChange={handleChange} />
                <input className='inputs' type="text" name="instagram" placeholder='Usuario Instagram (opcional)' value={formData.instagram} onChange={handleChange} />
                <input className='inputs' type="text" name="x" placeholder='Usuario X / Twitter (opcional)' value={formData.x} onChange={handleChange} />
                <button className='login-buttont' type="button" onClick={handleBack}>Atrás</button>
                <button className='login-buttont' type="button" onClick={handleNext}>Siguiente</button>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className='heading'>Paso 4: Datos Clínicos (Opcional)</h3>
                <input className={`inputs ${errors.blood_type ? 'input-error' : ''}`} type="text" name="blood_type" placeholder='Tipo de sangre (Ej: O+, AB-)' value={formData.blood_type} onChange={handleChange} />
                {errors.blood_type && <p className="error-text">{errors.blood_type}</p>}
                <input className={`inputs ${errors.allergy ? 'input-error' : ''}`} type="text" name="allergy" placeholder='Alergias (o "Ninguna")' value={formData.allergy} onChange={handleChange} />
                {errors.allergy && <p className="error-text">{errors.allergy}</p>}
                <input className={`inputs ${errors.disease ? 'input-error' : ''}`} type="text" name="disease" placeholder='Enfermedades Crónicas (o "Ninguna")' value={formData.disease} onChange={handleChange} />
                {errors.disease && <p className="error-text">{errors.disease}</p>}
                <button className='login-buttont' type="button" onClick={handleBack}>Atrás</button>
                <button className='login-buttont' type="button" onClick={handleNext}>Siguiente</button>
              </div>
            )}

            {step === 5 && (
              <div>
                <h3 className='heading'>Paso 5: Finalizar Registro</h3>
                <input className={`inputs ${errors.password ? 'input-error' : ''}`} type="password" name="password" placeholder='Crear contraseña (mín. 8 caracteres)' value={formData.password} onChange={handleChange} />
                {errors.password && <p className="error-text">{errors.password}</p>}

                <div className="recaptcha-container">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={onCaptchaChange}
                  />
                  {errors.recaptcha && <p className="error-text">{errors.recaptcha}</p>}
                </div>

                <button className='login-buttont' type="button" onClick={handleBack}>Atrás</button>
                <button
                  type="button"
                  className="login-buttont"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registrando...' : 'Registrarse'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Register;