import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const OCRDesdeCamara = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [texto, setTexto] = useState('');
    const [imagen, setImagen] = useState(null);
    const [procesando, setProcesando] = useState(false);
  
    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: 'environment' }, // Usa cámara trasera
          },
          audio: false,
        });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      } catch (error) {
        alert('Error al acceder a la cámara. Verifica permisos o usa otro dispositivo.');
        console.error(error);
      }
    };
  
    const capturarImagen = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imagenBase64 = canvas.toDataURL('image/jpeg');
      setImagen(imagenBase64);
    };
  
    const recortarCredencial = (imagenBase64) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imagenBase64;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const src = cv.imread(canvas);
  
          let gray = new cv.Mat();
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  
          let blurred = new cv.Mat();
          cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
  
          let edged = new cv.Mat();
          cv.Canny(blurred, edged, 75, 200);
  
          let contours = new cv.MatVector();
          let hierarchy = new cv.Mat();
          cv.findContours(edged, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  
          let maxArea = 0;
          let biggest = null;
  
          for (let i = 0; i < contours.size(); i++) {
            const cnt = contours.get(i);
            const peri = cv.arcLength(cnt, true);
            const approx = new cv.Mat();
            cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
            if (approx.rows === 4) {
              const area = cv.contourArea(cnt);
              if (area > maxArea) {
                maxArea = area;
                biggest = approx;
              }
            }
          }
  
          if (!biggest) {
            reject(new Error('No se detectó una credencial.'));
            return;
          }
  
          const pts = [];
          for (let i = 0; i < 4; i++) {
            pts.push({
              x: biggest.intAt(i, 0),
              y: biggest.intAt(i, 1)
            });
          }
  
          // Ordenar puntos
          pts.sort((a, b) => a.y - b.y);
          const top = pts.slice(0, 2).sort((a, b) => a.x - b.x);
          const bottom = pts.slice(2).sort((a, b) => a.x - b.x);
          const ordered = [top[0], top[1], bottom[1], bottom[0]];
  
          const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, ordered.flatMap(p => [p.x, p.y]));
          const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, 400, 0, 400, 250, 0, 250]);
  
          const M = cv.getPerspectiveTransform(srcTri, dstTri);
          const dst = new cv.Mat();
          const dsize = new cv.Size(400, 250);
          cv.warpPerspective(src, dst, M, dsize);
  
          cv.imshow(canvas, dst);
          const recorteBase64 = canvas.toDataURL('image/jpeg', 1.0);
  
          // Liberar memoria
          src.delete(); gray.delete(); blurred.delete(); edged.delete();
          contours.delete(); hierarchy.delete(); if (biggest) biggest.delete();
          srcTri.delete(); dstTri.delete(); M.delete(); dst.delete();
  
          resolve(recorteBase64);
        };
      });
    };
  
    const procesarOCR = async () => {
      if (!imagen) return;
      setProcesando(true);
      try {
        const imagenRecortada = await recortarCredencial(imagen);
        const result = await Tesseract.recognize(imagenRecortada, 'spa', {
          logger: m => console.log(m)
        });
        setTexto(result.data.text);
      } catch (error) {
        setTexto('Error al procesar OCR: ' + error.message);
      } finally {
        setProcesando(false);
      }
    };
  
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">OCR de Credencial</h1>
        <video ref={videoRef} className="w-full rounded" playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex gap-2 mt-2">
          <button onClick={iniciarCamara} className="px-4 py-2 bg-blue-600 text-white rounded">Iniciar cámara</button>
          <button onClick={capturarImagen} className="px-4 py-2 bg-green-600 text-white rounded">Capturar</button>
          <button onClick={procesarOCR} className="px-4 py-2 bg-purple-600 text-white rounded">Procesar OCR</button>
        </div>
        {imagen && (
          <div className="mt-4">
            <h2 className="font-semibold">Imagen capturada:</h2>
            <img src={imagen} alt="Captura" className="w-full mt-2 rounded border" />
          </div>
        )}
        {procesando && <p className="mt-4 text-yellow-600">Procesando OCR...</p>}
        {texto && (
          <div className="mt-4">
            <h2 className="font-semibold">Texto detectado:</h2>
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{texto}</pre>
          </div>
        )}
      </div>
    );
  };

export default OCRDesdeCamara;
