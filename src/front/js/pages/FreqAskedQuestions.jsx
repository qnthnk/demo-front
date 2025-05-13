import { Link } from 'react-router-dom';

import React, { useState } from 'react';
import "../../styles/home.css";
import { FaInfo } from "react-icons/fa";

const faqs = [
  { question: "Transporte", answer: "Datos sobre rutas de camiones y sitios de taxi seguros." },
  { 
    question: "Números de emergencia", 
    answer: (
      <>
        Cruz Verde<br />
        Teléfono: 8283-0112, 8243-4669<br />
        Dirección: Júarez Poniente s/n, entre Hidalgo y Dra. Kena Moreno, Col. La Cruz, García, N.L., C.P. 66008<br /><br />

        Bomberos<br />
        Teléfono: 8342-0053/54/55<br />
        Dirección: Boulevard Heberto Castillo Km. 13.290, García, N.L. 66000<br /><br />

        Clínica municipal<br />
        Teléfono: 8283-0112<br /><br />

        Policía y Tránsito<br />
        Teléfono: 8124-5000 Exts. 149/151, 5515-1815, 5515-1816 Emergencias<br />
        Dirección: Edificio CECOP - Centro de Comando de Op. Policiales, Blvd. Heberto Castillo No. 2000, Col. Hacienda del Sol, García, N.L. 66000<br /><br />

        Servicios Públicos<br />
        Teléfono: 4737-4080/84<br />
        Dirección: Parque Deportivo y Recreativo Ejército Mexicano, Col. Valle de San José, García, N.L. 66004<br /><br />

        Cruz Roja<br />
        Teléfono: 065<br />
        Dirección: Ave. Maravilla y Ciprés S/N, Col. Los Nogales 2º Sector, García, Nuevo León, CP 66216<br /><br />

        Protección Civil<br />
        Teléfono: 8283-0241<br />
        Dirección: Blvd. Heberto Castillo No. 2000, Colonia Hacienda del Sol, García, Nuevo León<br />
      </>
    )
  },
  { question: "Programas de Gobierno", answer: "Programas y requisitos." },
  { 
    question: "Links", 
    answer: <a href="https://www.gob.mx/mujeres" target="_blank" rel="noopener noreferrer">https://www.gob.mx/mujeres</a> 
  },
  { question: "Novedades", answer: "Servicios que actualmente están disponibles como albercas o pistas de hielo." },
  { question: "Otros", answer: <>Puedes consultar nuestro <Link to="/chatbot">Chatbot</Link>.</> },
];

const FreqAskedQuestions = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='containerRMCs'>
      <div className='containerHs'>
        <div className='heroContact'>
          <form className="formContact">
            <h2 className='heading'>Entérate</h2>
            <div style={{ overflowY: "auto", maxHeight: "50vh", minWidth: "65vw", textAlign: "center" }}>
              {faqs.map((faq, index) => (
                <div key={index}>
                  <div
                    className='inputContact submit'
                    style={{
                      width: "65vw",
                      backgroundColor: openIndex === index ? "rgb(134, 37, 68)" : "transparent", // Change background color when active
                      color: openIndex === index ? "white" : "rgb(120, 117, 117)", // Change text color when active
                      textAlign: "center", // Center text
                    }}
                    onClick={() => toggleFAQ(index)}
                  >
                    <h5>{faq.question}</h5>
                  </div>

                  <div className={`collapse ${openIndex === index ? 'show' : ''}`}>
                    <div
                      className='inputContacts'
                      style={{
                        width: "65vw",
                        backgroundColor: "white",
                        textAlign: "center", // Center text
                      }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FreqAskedQuestions;