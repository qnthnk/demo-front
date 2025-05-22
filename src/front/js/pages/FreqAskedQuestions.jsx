import { Link } from 'react-router-dom';
import descarga from '../../img/descarga.webp'; // Ajusta el path
import pension from '../../img/pension.png'; // Ajusta el path
import linea from '../../img/079.jpg'; // Ajusta el path
import abogadas from '../../img/abogadas.png'; // Ajusta el path
import React, { useState } from 'react';
import "../../styles/home.css";
import { FaInfo } from "react-icons/fa";

const faqs = [
  { question: "Comparte tu experiencia", answer: 
    <Link className='wrap' to='/complaint'><strong>Haz click </strong>y comparte tu experiencia para que llegue a más mujeres como tú</Link>
   },
  { question: "Cartilla de Derechos de las Mujeres", answer: 
    <a href="https://www.cartilladerechosdelasmujeres.gob.mx/pdf/Cartilla_de_Derechos_de_las_Mujeres.pdf" target="_blank" rel="noopener noreferrer">
      <strong>Haz click para descargar</strong><img src={descarga} style={{width:"100%"}}/>
      </a>
   },
  { 
    question: "Linea de las Mujeres",
    answer: (
      <>
        <a href="tel:079"><strong>Haz click para llamar</strong>
        <img src={linea} style={{width:"100%"}}/>
        </a>
      </>
    )
  },
  { question: "Pension Mujeres Bienestar", answer: 
    <a href="https://programasparaelbienestar.gob.mx/pension-mujeres-bienestar/" target="_blank" rel="noopener noreferrer">
      <strong>Haz click</strong><img src={pension} style={{width:"100%"}}/>
      </a>
   },
   { question: "Abogadas de las Mujeres", answer: 
    <>
    <h3>Convocatoria</h3>
    <a href="https://www.abogadas.mujeres.gob.mx/PROPUESTA_CONVOCATORIA_ABOGADAS_DE_LAS_MUJERES_vf_22_abril_2025.pdf" target="_blank" rel="noopener noreferrer">
    <strong>Haz click</strong><img src={abogadas} style={{width:"100%"}}/>
      </a>
      </>
   },
   { question: "Mujeres en la Historia", answer: 
    <iframe width="100%" height="315" src="https://www.youtube.com/embed/8YENtBhCpGI?si=EhVcGkhsMFKfAMwC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
   },
   { question: "Síguenos en nuestras redes", answer: 
    <div>
              <a href="https://www.youtube.com/@mujeresgobmx" target="_blank" rel="noopener noreferrer">
        <img src="https://tejedorasdelapatria.mujeres.gob.mx/images/inicio/YouTube.png" alt="Facebook" style={{ height: "25px", marginRight: "15px" }} />
        </a>
        <a href="https://www.facebook.com/mujeresgobmx?mibextid=wwXIfr&rdid=WzGimod3vaIMgGYc&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CKfXjo3P7%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noopener noreferrer">
          <img src="https://tejedorasdelapatria.mujeres.gob.mx/images/inicio/Facebook.png" alt="Facebook" style={{ height: "25px", marginRight: "15px" }} />
        </a>
        <a href="https://www.instagram.com/mujeresgobmx/?igsh=dTB5Y2NkOWl0emNl#" target="_blank" rel="noopener noreferrer">
        <img src="https://tejedorasdelapatria.mujeres.gob.mx/images/inicio/Instagram.png" alt="Facebook" style={{ height: "25px", marginRight: "15px" }} />
        </a>
        <a href="https://www.tiktok.com/@mujeresgobmx?_t=ZM-8vjXdBjyRz4&_r=1" target="_blank" rel="noopener noreferrer">
        <img src="https://tejedorasdelapatria.mujeres.gob.mx/images/inicio/Tik_Tok.png" alt="Facebook" style={{ height:"25px", marginRight: "15px" }} />
        </a>
        <a href="https://x.com/mujeresgobmx?s=21&t=QTmq6tEM-g4imvmuNX9zSQ" target="_blank" rel="noopener noreferrer">
        <img src="https://tejedorasdelapatria.mujeres.gob.mx/images/inicio/X.png" alt="Facebook" style={{ height: "25px", marginRight: "15px" }} />
        </a>
        </div>
   }
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