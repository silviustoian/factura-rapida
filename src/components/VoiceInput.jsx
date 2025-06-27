import React, { useState, useRef } from "react";

const VoiceInput = ({ onTextReady }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const API = process.env.REACT_APP_API_URL;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "voice.webm", { type: "audio/webm" });

        const formData = new FormData();
        formData.append("audio", file);

        try {
          const res = await fetch(`${API}/voice-to-text-clean`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.cleaned && onTextReady) {
            onTextReady(data.cleaned);
          }
        } catch (err) {
          console.error("Eroare voice-to-text-clean:", err);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      alert("Permite accesul la microfon.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
      className={`py-2 px-4 rounded font-medium transition ${
        recording ? "bg-red-600 text-white" : "bg-gray-800 text-white"
      }`}
    >
      {recording ? "🎙️ Ascultă..." : "🎤 Ține apăsat și vorbește"}
    </button>
  );
};

export default VoiceInput;
