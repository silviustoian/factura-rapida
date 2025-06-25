import { useState } from "react";

function App() {
  // Form clasic
  const [clientName, setClientName] = useState("");
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState({
    name: "",
    quantity: 1,
    price: 0,
  });

  // AI parsing
  const [rawText, setRawText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const [error, setError] = useState("");

  // Adaugă serviciu în listă (form clasic)
  const handleAddService = () => {
    if (!currentService.name || currentService.quantity <= 0 || currentService.price <= 0) {
      setError("Completează toate câmpurile serviciului corect.");
      return;
    }
    setServices([...services, currentService]);
    setCurrentService({ name: "", quantity: 1, price: 0 });
    setError("");
  };

  // Generează factura cu form clasic
  const handleGenerateClassic = async () => {
    setError("");
    if (!clientName || services.length === 0) {
      setError("Completează numele clientului și adaugă cel puțin un serviciu.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clientName, services }),
      });

      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "factura.pdf";
      link.click();
    } catch (err) {
      setError("Eroare la generarea facturii.");
    }
  };

  // Generează factura cu AI parsing
  const handleAIParsing = async () => {
    setError("");
    if (!rawText.trim()) {
      setError("Te rog introdu un text valid.");
      return;
    }

    setLoadingAI(true);

    try {
      const response = await fetch("http://localhost:4000/parse-with-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });

      if (!response.ok) throw new Error("Eroare la parsarea textului.");

      const { parsed } = await response.json();

      if (!parsed?.name || !parsed?.services) {
        setError("Nu am putut extrage corect datele din text.");
        setLoadingAI(false);
        return;
      }

      const facturaResponse = await fetch("http://localhost:4000/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.name,
          clientEmail: parsed.email || "",
          services: parsed.services,
        }),
      });

      if (!facturaResponse.ok) throw new Error("Eroare la generarea facturii.");

      const blob = await facturaResponse.blob();
      const fileURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "factura.pdf";
      link.click();

      setRawText("");
    } catch (err) {
      setError(err.message || "Eroare la procesare.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Factură Rapidă</h1>

        {/* FORM CLASIC */}
        <h2 className="text-lg font-semibold mb-2">Formular Clasic</h2>
        <label className="block text-sm font-medium mb-1">Nume client</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="ex: Ion Popescu"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            value={currentService.name}
            onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
            className="border border-gray-300 rounded px-4 py-2"
            placeholder="Serviciu"
          />
          <input
            type="number"
            value={currentService.quantity}
            onChange={(e) => setCurrentService({ ...currentService, quantity: Number(e.target.value) })}
            className="border border-gray-300 rounded px-4 py-2"
            placeholder="Cant."
          />
          <input
            type="number"
            value={currentService.price}
            onChange={(e) => setCurrentService({ ...currentService, price: Number(e.target.value) })}
            className="border border-gray-300 rounded px-4 py-2"
            placeholder="Preț RON"
          />
        </div>

        <button
          onClick={handleAddService}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6"
        >
          Adaugă serviciu
        </button>

        {services.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Servicii adăugate:</h3>
            <ul className="text-sm space-y-1">
              {services.map((s, idx) => (
                <li key={idx}>
                  {idx + 1}. {s.name} – {s.quantity} x {s.price} RON
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleGenerateClassic}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-12"
        >
          Generează factura PDF
        </button>

        <hr className="my-6" />

        {/* AI PARSING */}
        <h2 className="font-semibold mb-2">🧠 Factură cu AI (text liber)</h2>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="ex: Ion Popescu, email ion.popescu@mail.com, 3 ore consultanță la 200 RON"
          rows={5}
        />

        <button
          onClick={handleAIParsing}
          disabled={loadingAI}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loadingAI ? "Se generează..." : "Generează factură cu AI"}
        </button>

        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default App;
