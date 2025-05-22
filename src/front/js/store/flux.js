import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';


const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            currencies: [],
            convertedAmount: null,
            error: null,
            weather: null,
            loading: false,
            userLocation: null,
            nearbyPlaces: [],
            contact: [],


            user: {
                isAuthenticated: false,
                token: null,
                role: null,  // Agregar el rol al estado global
            },


        },
        actions: {


            // Use getActions to call a function within a fuction
            getAllUsers: async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("No hay token de autenticación");

                    const response = await fetch(`${process.env.BACKEND_URL}api/users_free`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",

                        }
                    });

                    if (response.status === 401) {
                        // Token inválido o expirado
                        localStorage.removeItem("token");
                        throw new Error("Sesión expirada. Por favor vuelve a iniciar sesión");
                    }

                    if (!response.ok) {
                        throw new Error(error || "Error al obtener usuarios");
                    }

                    return await response.json();
                } catch (error) {
                    console.error("Error en getAllUsers:", error);
                    throw error;
                }
            },


            forgotPassword: async (email) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/forgot-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || "Error al enviar el correo de recuperación");
                    }

                    return { message: data.message, error: null };
                } catch (error) {
                    return { message: null, error: error.message };
                }
            },
            getMapUrl: async (url) => {
                try {
                    console.log("url para ser enviada en getMapUrl action: ", url)// http://localhost:5000/

                    const actions = getActions(); // Para acceder al logout directamente
                
                    const token = localStorage.getItem("token");


                    const response = await fetch(`${process.env.BACKEND_URL}api/get_map_url`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ url: url }),
                    });
                    console.log("el response en seco: ", response)

                    if (response.status === 401) {
                        console.error("El token expiró o no es válido. Cerrando sesión...");
                        actions.logout(); // Logout automático
                        return;
                    }

                    // Verificar si la respuesta fue exitosa
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }

                    // Parsear el JSON de la respuesta
                    const data = await response.json();
                    console.log('Datos del JSON:', data);
                    // Verificar si el JSON contiene la URL
                    if (data.url) {
                        console.log('Datos del JSON:', data.url);
                        return data.url;
                    } else {
                        throw new Error("La URL no vino bien en la respuesta del backend");
                    }
                } catch (e) {
                    console.error('Error en getMapUrl:', e);
                    return null; // Devolver null explícitamente en caso de error
                }
            },
            resetPassword: async (email, resetCode, newPassword) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/reset-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email,
                            reset_code: resetCode,
                            new_password: newPassword,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || "Error al restablecer la contraseña");
                    }

                    return { message: data.message, error: null };
                } catch (error) {
                    return { message: null, error: error.message };
                }
            },
            register: async (dataToSend) => {
                console.log("Datos enviados para registro:", dataToSend);
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "api/signup", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataToSend),
                    });

                    const data = await resp.json();

                    if (!resp.ok) {
                        // Manejar específicamente el error de reCAPTCHA
                        if (data.error_code === "invalid_recaptcha") {
                            throw new Error("La verificación reCAPTCHA falló. Por favor inténtalo de nuevo.");
                        }
                        throw new Error(data.message || 'Error en el registro');
                    }

                    console.log("Registro exitoso:", data);
                    return data;
                } catch (error) {
                    console.error("Error de registro:", error);
                    throw error;
                }
            },


            complaint: async (complaintToSend) => {
                console.log("Datos enviados para queja:", complaintToSend);
                console.log("url de fetch: ", process.env.BACKEND_URL + "api/complaint")
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "api/complaint", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(complaintToSend),
                    });

                    const data = await resp.json(); // Parsear la respuesta JSON

                    if (!resp.ok) {
                        // Si la respuesta no es exitosa, lanzar un error con el mensaje del servidor
                        throw new Error(data.message || 'Error en el registro');
                    }

                    console.log("Registro exitoso:", data);
                    return data; // Devuelve los datos para que puedan ser manejados en el componente
                } catch (error) {
                    console.error("Error de registro:", error);
                    throw error; // Lanza el error para que pueda ser manejado en el componente
                }
            },


            login: async (payload) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "api/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });

                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error(errorData.message || 'Error al iniciar sesión');
                    }

                    const data = await resp.json();
                    const token = data.token;

                    if (!token) {
                        throw new Error('No se recibió un token válido');
                    }

                    const decodedToken = jwtDecode(token);
                    const userRole = decodedToken.role;

                    localStorage.setItem('token', token);
                    localStorage.setItem('userRole', userRole);
                    localStorage.setItem('id', data.id);

                    const store = getStore();
                    setStore({
                        ...store,
                        user: {
                            ...store.user,
                            isAuthenticated: true,
                            token: token,
                            role: userRole,
                        },
                    });

                    // ✅ SweetAlert según el rol
                    Swal.fire({
                        title: '¡Bienvenido!',
                        text: userRole === 'admin' ? 'Has ingresado como administrador.' : 'Has ingresado como usuario.',
                        icon: 'success',
                        confirmButtonText: 'Continuar'
                    });

                    // ✨ Se retorna la info útil al componente Login.jsx
                    return {
                        token: token,
                        id: data.id,
                        role: userRole
                    };
                } catch (error) {
                    console.error("Error al iniciar sesión:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.message || 'Error al iniciar sesión',
                    });
                    return null;
                }
            },


            getSupportedCurrencies: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "api/currency");
                    if (!response.ok) {
                        throw new Error('No se pudo obtener la lista de monedas.');
                    }
                    const data = await response.json();
                    setStore({ currencies: data.monedas_soportadas });
                } catch (error) {
                    setStore({ error: 'No se pudo obtener la lista de monedas.' });
                    console.error('Error al obtener monedas:', error);
                }
            },

            convertCurrency: async (fromCurrency, toCurrency, amount) => {
                if (!fromCurrency || !toCurrency || !amount) {
                    setStore({ error: 'Por favor, completa todos los campos.' });
                    return;
                }

                try {
                    const url = new URL(process.env.BACKEND_URL + "api/exchange");
                    url.searchParams.append('from', fromCurrency);
                    url.searchParams.append('to', toCurrency);
                    url.searchParams.append('amount', amount);

                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Error al realizar la conversión.');
                    }
                    const data = await response.json();
                    setStore({ convertedAmount: data.converted_amount, error: null });
                } catch (error) {
                    setStore({ error: 'Error al realizar la conversión.' });
                    console.error('Error al convertir divisas:', error);
                }
            },
            sendTwilioAlert: async (latitude, longitude) => {
                const user_id = localStorage.getItem('id');
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}api/send-alert`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ latitude, longitude, user_id })
                    });

                    const data = await resp.json();

                    if (!resp.ok) throw new Error(data.error || "Error al enviar alerta");

                    return data; // contiene contacts_notified
                } catch (error) {
                    console.error("Error al enviar alerta de Twilio:", error);
                    throw error;
                }
            },


            getMessage: async () => {
                try {

                    const resp = await fetch(process.env.BACKEND_URL + "api/hello")
                    const data = await resp.json()
                    setStore({ message: data.message })

                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error)
                }
            },

            sendMessage: async (message) => {
                if (!message.trim()) return;

                const store = getStore();
                const newMessage = { user: "Usuario", text: message };
                setStore({ chatMessages: [...store.chatMessages, newMessage] });

                try {
                    const response = await fetch(process.env.BACKEND_URL + "api/chatbot", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        setStore({ chatMessages: [...store.chatMessages, newMessage, { user: "Chatbot", text: data.response }] });
                    } else {
                        console.error("Error en el chatbot:", data.error);
                    }
                } catch (error) {
                    console.error("Error en la conexión con el servidor:", error);
                }

            },
            getWeather: async (latitude, longitude) => {
                const store = getStore();
                setStore({ loading: true, error: null });

                try {
                    const url = `${process.env.BACKEND_URL}api/weather?lat=${latitude}&lon=${longitude}`;
                    console.log("URL de la solicitud:", url);

                    const response = await fetch(url);

                    const responseText = await response.text();
                    console.log("Respuesta del backend:", responseText);

                    if (!response.ok) {
                        throw new Error('No se pudo obtener el clima.');
                    }

                    const data = JSON.parse(responseText);
                    setStore({ weather: data, loading: false });
                } catch (error) {
                    setStore({ error: 'Error al obtener el clima.', loading: false });
                    console.error(error);
                }
            },

            sendEmergencyCoordinates: async (latitude, longitude, user_id) => {
                try {
                    const coordinates = {
                        latitude: latitude,
                        longitude: longitude,
                        id: user_id  // 👈 OJO: ahora es "id", no "user_id"
                    };
            
                    const token = localStorage.getItem("token");
                    const response = await fetch(process.env.BACKEND_URL + "api/emergency", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(coordinates),
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Error al enviar alerta');
                    }
            
                    const data = await response.json();
                    console.log("Respuesta del servidor:", data);
                    return {
                        success: true,
                        location: coordinates
                    };
            
                } catch (error) {
                    console.error("Error en sendEmergencyCoordinates:", error);
            
                    let userMessage = "Error al enviar alerta";
                    if (error.message.includes("Geolocalización no soportada")) {
                        userMessage = "Tu navegador no soporta geolocalización";
                    } else if (error.message.includes("timeout")) {
                        userMessage = "Tiempo de espera agotado al obtener ubicación";
                    } else if (error.message.includes("denied")) {
                        userMessage = "Permiso de ubicación denegado";
                    }
            
                    throw new Error(userMessage);
                }
            },
            

            addContact: async (payload, user_id) => {
                let store = getStore();

                console.log("paquete de contacto", payload)

                try {
                    let response = await fetch(process.env.BACKEND_URL + "api/addcontact", {
                        method: "POST",
                        body: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        throw new Error("No se pudo agregar el contacto");
                    }

                    let data = await response.json();

                    console.log("esta es la data que recibe de respuesta de addcontact", data)
                    setStore({ ...store, contact: { ...store.contact, ...data } });
                    let storeUpdated = getStore();
                    console.log("la concha", storeUpdated.contact)



                    let store = getStore();
                    let updatedContacts = store.contact.map((contact) =>
                        contact.id === id ? data : contact
                    );
                    setStore({ ...store, contact: updatedContacts });
                } catch (error) {
                    console.error("Error en editContact:", error);
                }
            },
            deleteContact: async (id) => {
                try {
                    let response = await fetch(`${process.env.BACKEND_URL}api/deletecontact/${id}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        throw new Error("No se pudo borrar el contacto");
                    }

                    let store = getStore();
                    let updatedContacts = store.contact.filter((contact) => contact.id !== id);
                    setStore({ ...store, contact: updatedContacts });
                } catch (error) {
                    console.error("Error en deleteContact:", error);
                }
            },
            editContact: async (id, payload) => {
                try {
                    let response = await fetch(`${process.env.BACKEND_URL}api/editcontact/${id}`, {
                        method: "PUT",
                        body: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        throw new Error("No se pudo editar el contacto");
                    }

                    let data = await response.json();
                    let store = getStore();
                    let updatedContacts = store.contact.map((contact) =>
                        contact.id === id ? data : contact
                    );
                    setStore({ ...store, contact: updatedContacts });
                } catch (error) {
                    console.error("Error en editContact:", error);
                }
            },
            logout: async () => {
                try {
                    const token = localStorage.getItem("token");

                    if (!token) {
                        throw new Error("No hay sesión activa");
                    }

                    // Opcional: llamar al endpoint de logout del backend
                    await fetch(process.env.BACKEND_URL + "api/logout", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    // Limpiar localStorage
                    localStorage.removeItem("token");
                    localStorage.removeItem("userRole");
                    localStorage.removeItem("id");

                    // Resetear estado global
                    setStore({
                        ...getStore(),
                        user: {
                            isAuthenticated: false,
                            token: null,
                            role: null,
                            email: null
                        }
                    });

                    return { success: true };
                } catch (error) {
                    console.error("Error en logout:", error);
                    throw error;
                }
            },
            viewContacts: async () => {
                let store = getStore();
                try {
                    let user_id = localStorage.getItem('id');
                    let response = await fetch(`${process.env.BACKEND_URL}api/viewcontacts?user_id=${user_id}`);
                    if (!response.ok) {
                        throw new Error("Error al obtener contactos");
                    }
                    let data = await response.json();
                    console.log("Contactos obtenidos:", data);

                    setStore({
                        ...store,
                        contact: data || [],
                    });
                } catch (error) {
                    console.error("Error en viewContacts:", error);
                }
            },

            setUserLocation: (lat, lng) => {
                setStore({ userLocation: { lat, lng } });
            },

            fetchNearbyPlaces: async (textQuery) => {
                const store = getStore();
            
                if (!store.userLocation) {
                    console.error("Ubicación del usuario no disponible");
                    return;
                }
            
                try {
                    const apiKey = process.env.GOOGLE_MAPS_API;
            
                    if (!apiKey) {
                        console.error("Clave API no definida");
                        return;
                    }
            
                    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Goog-Api-Key": apiKey,
                            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.internationalPhoneNumber",
                        },
                        body: JSON.stringify({
                            textQuery: textQuery,  // ← Este es el campo correcto
                            locationBias: {
                                circle: {
                                    center: {
                                        latitude: store.userLocation.lat,
                                        longitude: store.userLocation.lng,
                                    },
                                    radius: 3000
                                }
                            },
                            maxResultCount: 10
                        })
                    });
            
                    const data = await response.json();
                    console.log("Respuesta de la API:", data);
            
                    if (data.places) {
                        setStore({ nearbyPlaces: data.places });
                    } else {
                        console.warn("No se encontraron lugares para:", textQuery);
                        setStore({ nearbyPlaces: [] });
                    }
                } catch (error) {
                    console.error("Error al obtener lugares:", error);
                }
            }
        }            

    };
}
export default getState;
