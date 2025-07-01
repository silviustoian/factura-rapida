import { useState } from "react";
import VoiceInput from "../components/VoiceInput";
import API from "../api";

function AiSection({ rawText, setRawText, setPdfBlob, pdfBlob, loading, handleGenerateAI }) {
  const [error, setError] = useState("");
  const [lastClient, setLastClient] = useState(null);
  const [lastServices, setLastServices] = useState([]);
  

  const handleSendEmail = async () => {
    if (!lastClient || !lastServices.length) return;
    try {
      const res = await fetch(`${API}/send-invoice-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: lastClient,
          services: lastServices,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("📤 Factura a fost trimisă cu succes!");
      } else {
        alert("❌ Eroare la trimiterea emailului.");
      }
    } catch (err) {
      console.error("Eroare la email:", err);
      alert("❌ Nu s-a putut trimite emailul.");
    }
  };

  const handleClear = () => {
    setRawText("");
    setPdfBlob(null);
    setLastClient(null);
    setLastServices([]);
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-indigo-500">
      <h2 className="text-xl font-bold text-indigo-600 mb-2">🧠 Factură cu AI</h2>
      <textarea
        rows={5}
        value={rawText}
        onChange={(e) => {
          setRawText(e.target.value);
          if (!e.target.value) setPdfBlob(null);
        }}
        placeholder="Ex: Softvision, CUI 12345678, email x@mail.com, 2 ore consultanță la 200 RON"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2"
      />

      <div className="flex gap-2 mb-4">
        <VoiceInput setRawText={setRawText} setRecording={null} />
        <button
          onClick={handleClear}
          className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          ♻️ Curăță
        </button>
      </div>

      <button
        onClick={handleGenerateAI}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
      >
        Generează Factura cu AI
      </button>

      {pdfBlob && (
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => {
              const url = window.URL.createObjectURL(pdfBlob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "factura.pdf";
              document.body.appendChild(a);
              a.click();
              a.remove();
            }}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            📥 Descarcă factura
          </button>

          <button
            onClick={handleSendEmail}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            📤 Trimite pe email
          </button>
        </div>
      )}

      {error && (
        <p className="text-center text-red-600 text-sm font-medium mt-4">
          {error}
        </p>
      )}
    </section>
  );
}

export default AiSection;