import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const OCRDesdeCamara = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [ocrResult, setOcrResult] = useState('');
    const [loading, setLoading] = useState(false);
  
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: 'environment' } // Cámara trasera
          },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert('No se pudo acceder a la cámara trasera. Intenta permitir el acceso en configuración.');
      }
    };
  
    const captureImage = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
      }
    };
  
    const processOCR = async () => {
      if (!capturedImage) return;
      setLoading(true);
      try {
        const result = await Tesseract.recognize(
          capturedImage,
          'spa',
          {
            logger: m => console.log(m)
          }
        );
        const text = result.data.text;
        setOcrResult(text);
      } catch (err) {
        setOcrResult('Error al procesar OCR');
      }
      setLoading(false);
    };
  
    return (
      <div className="p-4 space-y-4">
        <video ref={videoRef} autoPlay playsInline className="w-full max-w-md mx-auto rounded shadow" />
        <div className="flex space-x-2 justify-center">
          <button onClick={startCamera} className="bg-blue-500 text-white px-4 py-2 rounded">Iniciar cámara</button>
          <button onClick={captureImage} className="bg-green-500 text-white px-4 py-2 rounded">Capturar</button>
          <button onClick={processOCR} className="bg-purple-500 text-white px-4 py-2 rounded">Procesar OCR</button>
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
        {capturedImage && (
          <img src={capturedImage} alt="captura" className="w-full max-w-md mx-auto rounded" />
        )}
        {loading ? (
          <p className="text-center text-gray-500">Procesando imagen...</p>
        ) : (
          ocrResult && <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap text-sm">{ocrResult}</pre>
        )}
      </div>
    );
  }

export default OCRDesdeCamara;
