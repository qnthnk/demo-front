import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";
import hierarchicalData from '../../../../hierarchical_data.json';
import hierarchical_data_federal from '../../../../hierarchical_data_federal.json';
import "../../styles/ContactList.css";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
// import { MdWidthNormal } from 'react-icons/md';

const MapIne = () => {
    const { actions } = useContext(Context);
    const [modalIsOpen, setModalIsOpen] = useState(false);
const [pdfUrl, setPdfUrl] = useState('');
const handleConfirmDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfUrl.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setModalIsOpen(false); // Cierra el modal después de descargar
};



    // Estados locales
    const [ambito, setAmbito] = useState('');
    const [entidad, setEntidad] = useState('');
    const [distrito, setDistrito] = useState('');
    const [seccion, setSeccion] = useState('');

    // Sistema de selección dinámico
    const [selectedEntidad, setSelectedEntidad] = useState('');
    const [selectedDistrito, setSelectedDistrito] = useState('');
    const [selectedSeccion, setSelectedSeccion] = useState('');


    const entidades =
        ambito === "fed"
            ? Object.keys(hierarchical_data_federal)
            : Object.keys(hierarchicalData);

    const distritos =
        selectedEntidad &&
            (ambito === "fed"
                ? hierarchical_data_federal[selectedEntidad]
                : hierarchicalData[selectedEntidad])
            ? Object.keys(
                ambito === "fed"
                    ? hierarchical_data_federal[selectedEntidad]
                    : hierarchicalData[selectedEntidad]
            )
            : [];

    const secciones =
        selectedDistrito &&
            selectedEntidad &&
            (ambito === "fed"
                ? hierarchical_data_federal[selectedEntidad][selectedDistrito]
                : hierarchicalData[selectedEntidad][selectedDistrito])
            ? ambito === "fed"
                ? hierarchical_data_federal[selectedEntidad][selectedDistrito]
                : hierarchicalData[selectedEntidad][selectedDistrito]
            : [];


    const handleAmbitoChange = (e) => {
        setAmbito(e.target.value); // Guardar ambito (loc o fed)
    };

    const handleEntidadChange = (e) => {
        const value = e.target.value;
        setSelectedEntidad(value); // Actualizar la selección visible
        setEntidad(value); // Guardar en el estado local
        setSelectedDistrito(''); // Reset distritos al cambiar entidad
        setDistrito(''); // Reset distrito en el estado local
        setSelectedSeccion(''); // Reset secciones al cambiar entidad
        setSeccion(''); // Reset seccion en el estado local
    };

    const handleDistritoChange = (e) => {
        const value = e.target.value;
        setSelectedDistrito(value); // Actualizar la selección visible
        setDistrito(value); // Guardar en el estado local
        setSelectedSeccion(''); // Reset secciones al cambiar distrito
        setSeccion(''); // Reset seccion en el estado local
    };

    const handleSeccionChange = (e) => {
        const value = e.target.value;
        setSelectedSeccion(value); // Actualizar la selección visible
        setSeccion(value); // Guardar en el estado local
    };

    const buildUrl = () => {
        const entidadMapping = {
            AGUASCALIENTES: 1,
            "BAJA CALIFORNIA": 2,
            "BAJA CALIFORNIA SUR": 3,
            CAMPECHE: 4,
            "COAHUILA DE ZARAGOZA": 5,
            COLIMA: 6,
            CHIAPAS: 7,
            CHIHUAHUA: 8,
            "CIUDAD DE MEXICO": 9,
            DURANGO: 10,
            GUANAJUATO: 11,
            GUERRERO: 12,
            HIDALGO: 13,
            JALISCO: 14,
            MEXICO: 15,
            "MICHOACAN DE OCAMPO": 16,
            MORELOS: 17,
            NAYARIT: 18,
            "NUEVO LEON": 19,
            OAXACA: 20,
            PUEBLA: 21,
            QUERETARO: 22,
            "QUINTANA ROO": 23,
            "SAN LUIS POTOSI": 24,
            SINALOA: 25,
            SONORA: 26,
            TABASCO: 27,
            TAMAULIPAS: 28,
            TLAXCALA: 29,
            VERACRUZ: 30,
            YUCATAN: 31,
            ZACATECAS: 32,
        };

        const entidadNumero = entidadMapping[entidad] || ''; // Convertir el nombre de la entidad a su número
        console.log('Entidad convertida a número:', entidadNumero); // Debugging

        return `https://cartografia.ine.mx/sige8/api/planosMapas?producto=psi&ambito=${ambito}&corte_mes=dic&corte=2022&entidad=${entidadNumero}&distrito=${distrito}&seccion=${seccion}`;
    };

    const handleDownload = async () => {
        if (!ambito) {
            alert("Te faltan completar el ámbito")
            return;
        }
        if (!entidad) {
            alert("Te faltan completar la entidad")
            return;
        }
        if (!distrito) {
            alert("Te faltan completar el distrito")
            return;
        }
        if (!seccion) {
            alert("Te faltan completar la sección")
            return;
        }
        const url = buildUrl(); // URL inicial
        console.log('URL inicial:', url);

        try {
            const downloadUrl = await actions.getMapUrl(url);
            setPdfUrl(downloadUrl);
            setModalIsOpen(true); // Abre el modal para previsualización
        } catch (error) {
            console.error('Error al obtener el PDF:', error);
            alert('Ocurrió un error al obtener el archivo.');
        }
    };

    const token = localStorage.getItem('token');

    return (
        <div className='containerRMCs' style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setModalIsOpen(false)}
    contentLabel="Previsualización del PDF"
    style={{
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '90%',
        }
    }}
>
    <h2>Previsualización del Plano</h2>
    {pdfUrl && (
        <iframe
            src={pdfUrl}
            title="Vista previa del PDF"
            width="100%"
            height="80%"
            style={{ border: '1px solid #ccc' }}
        />
    )}
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button onClick={handleConfirmDownload}                         className="buttonPearl" style={{width:"120px", height:"50px", borderRadius:"20px", color:'white'}}  >
            Descargar
        </button>
        <button onClick={() => setModalIsOpen(false)}                         className="buttonPearl" style={{width:"120px", height:"50px", borderRadius:"20px", color:'white'}}  >
            Cerrar
        </button>
    </div>
</Modal>

      <div className='containerHs' style={{ textAlign: "center" }}>
      <div className='heroContact'>
      <form className="formContact" style={{ overflowY: 'auto' }}>
                                        <h2 className='heading'>Mapoteca del INE</h2>
                    <div style={{ overflowY: "auto", maxHeight: "60vh", width: "90%", margin: "0 auto" }}>
                        <h4>Ámbito</h4>
                        <select
                            value={ambito}
                            onChange={handleAmbitoChange}
                            className="inputContact"
                            
                        >
                            <option value="">Seleccionar Ámbito</option>
                            <option value="fed">Federal</option>
                            <option value="loc">Local</option>
                        </select>
                    <br />

                    {/* Selección de entidad */}
                    <div className='home-content d-flex flex-column w-60 p-2 bg-dark-subtle'>
                        <h4>Entidad</h4>
                        <select
                            value={selectedEntidad}
                            onChange={handleEntidadChange}
                            className="inputContact"               disabled={!ambito}          >
                            <option value="">Seleccionar Entidad</option>
                            {entidades.map((entidad) => (
                                <option key={entidad} value={entidad}>
                                    {`${entidad}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <br />
                    {/* Selección de distrito */}
                    <div className='home-content d-flex flex-column w-60 p-2 bg-dark-subtle'>
                        <h4>Distrito</h4>
                        <select
                            value={selectedDistrito}
                            onChange={handleDistritoChange}
                            className="inputContact"                            disabled={!selectedEntidad}
                        >
                            <option value="">Seleccionar Distrito</option>
                            {distritos.map((distrito) => (
                                <option key={distrito} value={distrito}>
                                    {`Distrito ${distrito}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <br />
                    {/* Selección de sección */}
                    <div className='home-content d-flex flex-column w-60 p-2 bg-dark-subtle'>
                        <h4>Sección</h4>
                        <select
                            value={selectedSeccion}
                            onChange={handleSeccionChange}
                            className="inputContact"                            disabled={!selectedDistrito}
                        >
                            <option value="">Seleccionar Sección</option>
                            {secciones.map((seccion) => (
                                <option key={seccion} value={seccion}>
                                    {seccion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <br />
                    {/* Botón para descargar */}
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="buttonPearl" style={{width:"120px", height:"50px", borderRadius:"20px", color:'white'}}                    >
                        Descargar
                    </button>
                    </div>

</form>
        </div>
        </div>
        </div>
    );
};

export default MapIne;
