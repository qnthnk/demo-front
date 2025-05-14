import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const OCRDesdeCamara = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [text, setText] = useState('');
    const [processing, setProcessing] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [datos, setDatos] = useState({});
  
    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: 'environment' }
          },
          audio: false
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      } catch (error) {
        alert("Error accediendo a la cámara: " + error.message);
      }
    };
  
    const capturarFoto = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
  
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const grayscale = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        const adjusted = grayscale > 127 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = adjusted;
      }
      ctx.putImageData(imageData, 0, 0);
    };
  
    const procesarOCR = async () => {
      const canvas = canvasRef.current;
      setProcessing(true);
      try {
        const { data: { text } } = await Tesseract.recognize(canvas, 'spa', {
          logger: m => console.log(m)
        });
        setText(text);
  
        const nombre = text.match(/NOMBRE\s+([A-Z\s]+)/i)?.[1]?.trim();
        const curp = text.match(/CURP\s+([A-Z0-9]+)\s/i)?.[1];
        const domicilio = text.match(/DOMICILIO\s+([A-Z0-9\s.,#\-]+)\s+CLAVE/i)?.[1]?.trim();
        const clave = text.match(/CLAVE DE ELECTOR\s+([A-Z0-9]+)/i)?.[1];
        const seccion = text.match(/SECCION\s+(\d+)/i)?.[1];
        const nacimiento = text.match(/FECHA DE NACIMIENTO\s+(\d{2}\/\d{2}\/\d{4})/i)?.[1];
        const vigencia = text.match(/VIGENCIA\s+(\d{4}\s*-\s*\d{4})/i)?.[1];
  
        setDatos({ nombre, curp, domicilio, clave, seccion, nacimiento, vigencia });
      } catch (err) {
        setText("Error al procesar OCR: " + err.message);
      }
      setProcessing(false);
    };
  
    return (
      <div className="p-4">
        {!streaming ? (
          <canvas ref={canvasRef} style={{ width: '100%', maxHeight: '300px' }} />
        ) : (
          <video ref={videoRef} style={{ width: '100%', maxHeight: '300px' }} />
        )}
        <div className="flex gap-2 my-2">
          <button onClick={iniciarCamara} disabled={streaming} className="bg-blue-600 text-white px-4 py-2 rounded">
            Iniciar cámara
          </button>
          <button
            onClick={() => {
              capturarFoto();
              setStreaming(false);
            }}
            disabled={!streaming}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Capturar
          </button>
          <button onClick={procesarOCR} disabled={processing} className="bg-green-600 text-white px-4 py-2 rounded">
            {processing ? "Procesando..." : "Procesar OCR"}
          </button>
        </div>
        {text && (
          <div className="bg-gray-100 p-2 border rounded text-sm whitespace-pre-wrap">
            <strong>Texto completo:</strong><br />
            {text}
          </div>
        )}
        {Object.keys(datos).length > 0 && (
          <div className="mt-4 bg-white p-4 border rounded shadow">
            <h3 className="font-bold mb-2">Datos extraídos:</h3>
            <p><strong>Nombre:</strong> {datos.nombre}</p>
            <p><strong>CURP:</strong> {datos.curp}</p>
            <p><strong>Domicilio:</strong> {datos.domicilio}</p>
            <p><strong>Clave de Elector:</strong> {datos.clave}</p>
            <p><strong>Sección:</strong> {datos.seccion}</p>
            <p><strong>Nacimiento:</strong> {datos.nacimiento}</p>
            <p><strong>Vigencia:</strong> {datos.vigencia}</p>
          </div>
        )}
      </div>
    );
  }

export default OCRDesdeCamara;
