import React, { useState } from "react";
import './../../styles/Chatbot.css';
import { FaInfo } from "react-icons/fa";

const ChatBot = () => {
    const [GPTResponse, setGPTResponse] = useState("")
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newMessage = { user: "Usuario", text: message };
        console.log("este es el mensaje que se envia", message)
        try {
            const response = await fetch(process.env.BACKEND_URL + "api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "message": message })
            });

            const data = await response.json();
            if (response.ok) {
                setGPTResponse(data.response)
            } else {
                setError(data.error || "Error en el chatbot.");
            }
        } catch (err) {
            setError("Error en la conexión con el servidor.");
        }

        setMessage("");
    };

    return (
        <div className="containerRMCs">
            <div className="containerHs">
                <div className="heroContact">
                    {error && <p className="error">{error}</p>}
                    <label className="formContact" style={{maxWidth:"80vw", minWidth:"50vw", height:"auto"}}>
                    <h2 className="heading">Chatbot</h2>

                        <input
                            type="text"
                            name="text"
                            className="inputContacts"
                            required
                            placeholder="¿Comó puedo ayudarte?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="buttonPearl" style={{ width: "120px", height: "50px", borderRadius: "20px", color: 'white' }} onClick={sendMessage}>Preguntar</button>
                        <h4 className="inputContacts">
                            <strong style={{ display: "block", textAlign: "center" }}>Versión Demo.<br />La información puede estar desactualizada.<br /><br /><br />Powered by chatGPT</strong>
                            <hr />
                            {GPTResponse}
                        </h4>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;