import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import "../../styles/ContactList.css";
import { FaInfo } from "react-icons/fa";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const faqs = [
    {
        question: "Demografía",
        charts: [
            {
                labels: ['0-11', '12-17', '18-25', '26-35', '36-50', '51-60', '60+'],
                datasets: [
                    {
                        label: 'Edad (años)',
                        data: [20, 32, 56, 45, 23, 12, 8],
                        backgroundColor: 'rgba(169, 44, 71, 0.6)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            },
            {
                labels: ['Nuevo León', 'Estado de México', 'Tamaulipas', 'Coahuila', 'Veracruz'],
                datasets: [
                    {
                        label: 'Entidad de Nacimiento',
                        data: [50, 20, 15, 10, 5],
                        backgroundColor: 'rgba(206, 33, 50, 0.69)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            }
        ]
    },
    {
        question: "Salud",
        charts: [
            {
                labels: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
                datasets: [
                    {
                        label: 'Tipo de Sangre',
                        data: [20, 15, 25, 10, 5, 8, 12, 5],
                        backgroundColor: 'rgba(236, 10, 10, 0.6)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            },
            {
                labels: ['polvo','pollen','alimentos','medicamentos','otros'],
                datasets: [
                    {
                        label: 'Alergias',
                        data: [10, 20, 15, 5, 10],
                        backgroundColor: 'rgba(140, 206, 33, 0.69)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            },
            {
                labels: ['diabetes', 'hipertensión', 'cáncer', 'enfermedades cardíacas', 'enfermedades respiratorias'],
                datasets: [
                    {
                        label: 'Enfermedades crónicas',
                        data: [48, 52, 20, 15, 10],
                        backgroundColor: 'rgba(33, 206, 189, 0.69)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            }
        ]
    },
    {
        question: "Medios de contacto",
        charts: [
            {
                labels: ['Facebook', 'Instagram', 'Twitter/X', 'WhatsApp'],
                datasets: [
                    {
                        label: 'Redes Sociales',
                        data: [20, 15, 25, 10],
                        backgroundColor: 'rgba(72, 60, 60, 0.6)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            },
            {
                labels: ['Teléfono', 'Email'],
                datasets: [
                    {
                        label: 'Otros',
                        data: [20, 15],
                        backgroundColor: 'rgba(24, 1, 1, 0.6)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            }
        ]
        
    },
    {
        question: "Geoestadística",
        charts: [
            {
                labels: ['Las Lomas', 'Centro','Mitras Poniente'],
                datasets: [
                    {
                        label: 'Colonias',
                        data: [40, 30, 20],
                        backgroundColor: 'rgba(35, 176, 82, 0.69)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            },
            {
                labels: ['Zona Norte', 'Zona Sur', 'Zona Centro'],
                datasets: [
                    {
                        label: 'Zonas del país',
                        data: [20, 15, 25],
                        backgroundColor: 'rgba(180, 206, 33, 0.69)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            },
            {
                labels: ['Toluca', 'Monterrey', 'Guadalajara'],
                datasets: [
                    {
                        label: 'Municipios',
                        data: [80, 10, 10],
                        backgroundColor: 'rgba(33, 85, 206, 0.69)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            }
        ],
    },
    {
        question: "Electoral",
        charts: [
            {
                labels: ['01', '02', '03'],
                datasets: [
                    {
                        label: 'Distritos Locales',
                        data: [60, 30, 10],
                        backgroundColor: 'rgba(203, 157, 162, 0.69)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            },
            {
                labels: ['07', '08', '09'],
                datasets: [
                    {
                        label: 'Distitos Federales',
                        data: [20, 50, 30],
                        backgroundColor: 'rgba(127, 141, 140, 0.69)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
                ]
            },
            {labels: ['1621', '1622', '1623'],
                datasets: [
                    {
                        label: 'Secciones',
                        data: [60, 30, 10],
                        backgroundColor: 'rgba(35, 140, 129, 0.69)',
                        borderColor: 'rgb(11, 11, 11)',
                        borderWidth: 1,
                    }
        ]
            },
        ]
    }
];

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};

const DashboardAdminSocioDem = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className='containerRMCs' style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className='containerHs' style={{ textAlign: "center" }}>
      <div className='heroContact'>
      <form className="formContact">
                        <h2 className='heading'>Estadísticas de los usuarios</h2>
                        <div style={{ overflowY: "auto", maxHeight: "60vh", minWidth: "65vw", textAlign: "center" }}>
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

                                    {openIndex === index && (
                                        <div
                                            className='inputContacts'
                                            style={{
                                                width: "65vw",
                                                backgroundColor: "white",
                                                textAlign: "center",
                                                padding: "10px",
                                                borderRadius: "8px",
                                                marginBottom: "15px",
                                            }}
                                        >
                                            {faq.charts ? (
    faq.charts.map((chartData, chartIndex) => (
        <div key={chartIndex} style={{ marginBottom: "30px" }}>
            <Bar data={chartData} options={options} />
        </div>
    ))
) : (
    <p>{faq.answer}</p>
)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdminSocioDem;
