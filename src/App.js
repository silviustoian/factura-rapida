import { useRef, useState } from "react";

function App() {
  const aiSectionRef = useRef();

  // === STATE ===
  const [rawText, setRawText] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [services, setServices] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [currentService, setCurrentService] = useState({
    name: "",
    quantity: 1,
    price: 0,
  });

  // === AI GENERATION ===
  const handleGenerateAI = async () => {
    setError("");
    setPdfBlob(null);
    if (!rawText.trim()) return setError("Te rog introdu un text valid.");
    setLoading(true);

    try {
      const parseRes = await fetch("http://localhost:4000/parse-client-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });

      const { parsed } = await parseRes.json();

      const genRes = await fetch("http://localhost:4000/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: parsed.client,
          services: parsed.services,
        }),
      });

      const blob = await genRes.blob();
      setPdfBlob(blob);
      setRawText("");
    } catch (e) {
      setError("Eroare la AI/generare: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "factura.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Browserul tău nu suportă recunoașterea vocală.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "ro-RO";
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRawText((prev) => (prev ? prev + " " + transcript : transcript));
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Eroare la recunoaștere:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // === CLASIC ===
  const handleAddService = () => {
    if (
      !currentService.name ||
      currentService.quantity <= 0 ||
      currentService.price <= 0
    ) {
      setError("Completează toate câmpurile serviciului corect.");
      return;
    }
    setServices([...services, currentService]);
    setCurrentService({ name: "", quantity: 1, price: 0 });
    setError("");
  };

  const handleGenerateClassic = async () => {
    setError("");
    if (!clientName || services.length === 0) {
      setError("Completează numele clientului și serviciile.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: { name: clientName, email: "" },
          services,
        }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "factura.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setClientName("");
      setServices([]);
    } catch (e) {
      setError("Eroare la generare: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToAI = () => {
    aiSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      {/* === HERO === */}
      <section className="bg-white py-16 px-6 md:px-12 lg:px-24 flex flex-col-reverse lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Factura în 10 secunde.
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Scrii un mesaj. Noi generăm tot. Cu AI. Trimitem și pe email.
          </p>
          <button
            onClick={scrollToAI}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            Încearcă acum
          </button>
        </div>

        {/* === Imagine dreapta desktop === */}
        {/* <div className="hidden lg:block lg:w-1/2">
          <img
            src="https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-f804-620a-a7fa-68da90fe5af4/raw?se=2025-06-25T17%3A48%3A38Z&sp=r&sv=2024-08-04&sr=b&scid=346a5954-d3ee-5b8f-acd3-ba8c2052b9fe&skoid=b32d65cd-c8f1-46fb-90df-c208671889d4&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-25T04%3A29%3A48Z&ske=2025-06-26T04%3A29%3A48Z&sks=b&skv=2024-08-04&sig=ctvEiGZP38NSUaAdRKZTo226XB4X12jbJQIgSo1j/Mg%3D"
            alt="Factura AI"
            className="max-w-full h-auto"
          />
        </div> */}
      </section>

      {/* === CONTENT === */}
      <div
        ref={aiSectionRef}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 py-12"
      >
        {/* === AI Section === */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-indigo-500">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">
            🧠 Factură cu AI
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Scrie un text cu datele clientului și serviciile prestate.
          </p>

          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Ex: Vreau o factură pentru Softvision, CUI 12345678, email x@mail.com, 2 ore consultanță la 200 RON"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
          />
          <button
            onClick={handleVoiceInput}
            className={`mb-3 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 ${
              isListening ? "animate-pulse" : ""
            }`}
          >
            🎤 {isListening ? "Ascult..." : "Vorbește"}
          </button>

          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
          >
            Generează Factura cu AI
          </button>

          {pdfBlob && (
            <button
              onClick={handleDownload}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              📥 Descarcă factura
            </button>
          )}
        </div>

        {/* === Clasic === */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Formular Clasic
          </h2>

          <input
            type="text"
            placeholder="Nume client"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4 text-sm"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              placeholder="Serviciu"
              value={currentService.name}
              onChange={(e) =>
                setCurrentService({ ...currentService, name: e.target.value })
              }
              className="border px-2 py-2 rounded text-sm"
            />
            <input
              type="number"
              min={1}
              value={currentService.quantity}
              onChange={(e) =>
                setCurrentService({
                  ...currentService,
                  quantity: Number(e.target.value),
                })
              }
              className="border px-2 py-2 rounded text-sm"
              placeholder="Cantitate"
            />
            <input
              type="number"
              min={0}
              value={currentService.price}
              onChange={(e) =>
                setCurrentService({
                  ...currentService,
                  price: Number(e.target.value),
                })
              }
              className="border px-2 py-2 rounded text-sm"
              placeholder="Preț RON"
            />
          </div>

          <button
            onClick={handleAddService}
            className="bg-gray-700 text-white px-4 py-2 rounded text-sm mb-3"
          >
            Adaugă serviciu
          </button>

          {services.length > 0 && (
            <ul className="mb-4 list-disc pl-5 text-sm text-gray-600">
              {services.map((s, i) => (
                <li key={i}>
                  {s.name} – {s.quantity} x {s.price} RON
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleGenerateClassic}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Generează Factura Clasică
          </button>
        </div>
      </div>

      {error && (
        <p className="text-center text-red-600 text-sm pb-6">{error}</p>
      )}
    </div>
  );
}

export default App;
