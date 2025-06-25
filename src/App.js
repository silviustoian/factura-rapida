import { useState } from "react";

function App() {
  const [clientName, setClientName] = useState("");
  const [services, setServices] = useState([]);
  const [rawText, setRawText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [currentService, setCurrentService] = useState({
    name: "",
    quantity: 1,
    price: 0,
  });
  const [error, setError] = useState("");

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

  const handleGenerate = async () => {
    if (!clientName || services.length === 0) {
      setError(
        "Completează numele clientului și adaugă cel puțin un serviciu."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/generate-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: clientName,
          services,
        }),
      });

      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "factura.pdf";
      link.click();
    } catch (err) {
      console.error("Eroare la generarea facturii:", err);
      setError("Eroare la generarea facturii.");
    }
  };

  const handleAIParsing = async () => {
    setError("");
    if (!rawText.trim()) {
      setError("Te rog introdu un text valid.");
      return;
    }

    setLoadingAI(true);

    try {
      // 1. Trimitem textul la AI (proxy backend)
      const response = await fetch("http://localhost:4000/parse-with-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });

      const { parsed } = await response.json();

      if (!parsed?.name || !parsed?.services) {
        setError("Nu am putut extrage corect datele din text.");
        return;
      }

      // 2. Trimitem JSON-ul rezultat spre generare PDF
      const facturaResponse = await fetch(
        "http://localhost:4000/generate-invoice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: parsed.name,
            services: parsed.services,
          }),
        }
      );

      const blob = await facturaResponse.blob();
      const fileURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "factura.pdf";
      link.click();

      setRawText("");
    } catch (err) {
      console.error("Eroare la AI:", err);
      setError("Eroare la procesarea cu AI.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Factură Rapidă</h1>

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
            onChange={(e) =>
              setCurrentService({ ...currentService, name: e.target.value })
            }
            className="border border-gray-300 rounded px-4 py-2"
            placeholder="Serviciu"
          />
          <input
            type="number"
            value={currentService.quantity}
            onChange={(e) =>
              setCurrentService({
                ...currentService,
                quantity: Number(e.target.value),
              })
            }
            className="border border-gray-300 rounded px-4 py-2"
            placeholder="Cant."
          />
          <input
            type="number"
            value={currentService.price}
            onChange={(e) =>
              setCurrentService({
                ...currentService,
                price: Number(e.target.value),
              })
            }
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
            <h2 className="font-semibold mb-2">Servicii adăugate:</h2>
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
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Generează factura PDF
        </button>

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        <hr className="my-6" />

        <h2 className="font-semibold mb-2">🧠 Factură cu AI (text liber)</h2>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="ex: Ion Popescu, 2 ore consultanță la 150 RON"
        />

        <button
          onClick={handleAIParsing}
          disabled={loadingAI}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 mb-4"
        >
          {loadingAI ? "Se generează..." : "Generează factură cu AI"}
        </button>
      </div>
    </div>
  );
}

export default App;
