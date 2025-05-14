import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const OCRDesdeCamara = () => {
    const [imagen, setImagen] = useState(null);
    const [textoExtraido, setTextoExtraido] = useState('');
    const [datos, setDatos] = useState({});
    const [mensaje, setMensaje] = useState('Apunta la cámara a la credencial...');
    const [procesando, setProcesando] = useState(false);
  
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayRef = useRef(null); // Para dibujar los rectángulos
  
    useEffect(() => {
      iniciarCamara();
    }, []);
  
    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        alert('No se pudo acceder a la cámara');
      }
    };
  
    const capturarImagen = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
  
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL();
      setImagen(dataUrl);
      setMensaje('📷 Imagen capturada');
    };
  
    const procesarOCR = async () => {
      if (!imagen) return;
      setProcesando(true);
      setMensaje('🔍 Procesando texto con OCR...');
  
      const result = await Tesseract.recognize(imagen, 'spa', {
        logger: m => console.log(m)
      });
  
      const texto = result.data.text;
      setTextoExtraido(texto);
      setProcesando(false);
      setMensaje('✅ OCR completado');
  
      extraerCampos(texto);
      dibujarRectangulos(result.data.words);
    };
    const verificarCalidad = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
      
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
        const esNitida = evaluarNitidez(frame);
        const esBienIluminada = evaluarIluminacion(frame);
      
        if (esNitida && esBienIluminada) {
          setMensaje('✅ Imagen óptima, capturando...');
          capturarImagen();  // usa tu función existente
        } else {
          setMensaje('⚠️ Mueve o enfoca mejor la credencial...');
        }
      };
      const evaluarNitidez = (imageData) => {
        let total = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const brillo = 0.299 * r + 0.587 * g + 0.114 * b;
          total += brillo;
        }
        const media = total / (imageData.data.length / 4);
        let sumaCuadrados = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const brillo = 0.299 * r + 0.587 * g + 0.114 * b;
          sumaCuadrados += Math.pow(brillo - media, 2);
        }
        const varianza = sumaCuadrados / (imageData.data.length / 4);
        return varianza > 500; // Ajusta según pruebas
      };
      const evaluarIluminacion = (imageData) => {
        let totalBrillo = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const brillo = 0.299 * r + 0.587 * g + 0.114 * b;
          totalBrillo += brillo;
        }
        const promedio = totalBrillo / (imageData.data.length / 4);
        return promedio > 80 && promedio < 200; // Rango ideal
      };
                  
  
    const extraerCampos = (texto) => {
      const nombreRegex = /NOMBRE\s+([A-ZÑ\s]+)\s+([A-ZÑ\s]+)\s+([A-ZÑ\s]+)/i;
      const curpRegex = /\b([A-Z]{4}\d{6}[A-Z]{6}[0-9A-Z]{2})\b/;
      const domicilioRegex = /DOMICILIO\s+([^\n]+)/i;
      const fechaNacimientoRegex = /(\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}|\d{2}\/\d{2}\/\d{2})/;
      const claveElectorRegex = /CLAVE DE ELECTOR\s+([A-Z0-9]+)/i;
      const seccionRegex = /SECCION\s+(\d{4})/i;
      const vigenciaRegex = /VIGENCIA\s+(\d{4}\s*-\s*\d{4})/i;
  
      const nombreMatch = nombreRegex.exec(texto);
      const nombre = nombreMatch ? `${nombreMatch[1]} ${nombreMatch[2]} ${nombreMatch[3]}` : '';
  
      setDatos({
        nombre,
        curp: curpRegex.exec(texto)?.[1] || '',
        domicilio: domicilioRegex.exec(texto)?.[1] || '',
        fechaNacimiento: fechaNacimientoRegex.exec(texto)?.[1] || '',
        claveElector: claveElectorRegex.exec(texto)?.[1] || '',
        seccion: seccionRegex.exec(texto)?.[1] || '',
        vigencia: vigenciaRegex.exec(texto)?.[1] || '',
      });
    };
  
    const dibujarRectangulos = (palabras) => {
      const canvas = overlayRef.current;
      const imgCanvas = canvasRef.current;
      if (!canvas || !imgCanvas) return;
  
      canvas.width = imgCanvas.width;
      canvas.height = imgCanvas.height;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.font = '12px Arial';
      ctx.fillStyle = 'red';
  
      palabras.forEach(palabra => {
        const { x0, y0, x1, y1, text } = palabra.bbox;
        ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
        ctx.fillText(palabra.text, x0, y0 - 4);
      });
    };
    useEffect(() => {
        const intervalo = setInterval(verificarCalidad, 500);
        return () => clearInterval(intervalo);
      }, []);
      
  
    return (
      <div style={{ padding: '20px' }}>
        <h2>OCR con extracción y campos destacados</h2>
  
        <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
          <video ref={videoRef} autoPlay style={{ width: '100%' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <canvas ref={overlayRef} style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }} />
        </div>
  
        <p><strong>{mensaje}</strong></p>
        <button onClick={capturarImagen}>📸 Capturar Imagen</button>
  
        {imagen && (
          <>
            <h4>Imagen capturada:</h4>
            <img src={imagen} alt="Captura" style={{ width: '100%', maxWidth: 400 }} />
            <button onClick={procesarOCR} disabled={procesando}>
              {procesando ? 'Procesando...' : 'Extraer texto y datos'}
            </button>
          </>
        )}
  
        {textoExtraido && (
          <>
            <h4>Texto extraído:</h4>
            <textarea
              rows={8}
              cols={80}
              value={textoExtraido}
              readOnly
              style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
            />
          </>
        )}
  
        {Object.keys(datos).length > 0 && (
          <>
            <h4>Datos detectados:</h4>
            <ul>
              <li><strong>Nombre:</strong> {datos.nombre}</li>
              <li><strong>CURP:</strong> {datos.curp}</li>
              <li><strong>Domicilio:</strong> {datos.domicilio}</li>
              <li><strong>Fecha de nacimiento:</strong> {datos.fechaNacimiento}</li>
              <li><strong>Clave de elector:</strong> {datos.claveElector}</li>
              <li><strong>Sección:</strong> {datos.seccion}</li>
              <li><strong>Vigencia:</strong> {datos.vigencia}</li>
            </ul>
          </>
        )}
      </div>
    );
  };

export default OCRDesdeCamara;
