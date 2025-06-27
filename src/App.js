import { useRef, useState } from "react";
import VoiceInput from "./components/VoiceInput";
import API from "./api";

function App() {
  const aiSectionRef = useRef();
  const [rawText, setRawText] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    cui: "",
    address: "",
    phone: "",
  });

  const [currentService, setCurrentService] = useState({
    name: "",
    quantity: 1,
    price: 0,
  });

  const [services, setServices] = useState([]);

  const handleGenerateAI = async () => {
    setError("");
    setPdfBlob(null);
    if (!rawText.trim()) return setError("Te rog introdu un text valid.");
    setLoading(true);

    try {
      const parseRes = await fetch(`${API}/parse-client-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });

      const { parsed } = await parseRes.json();

      const genRes = await fetch(`${API}/generate-invoice`, {
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
    if (!pdfBlob) return;
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "factura.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleCuiLookup = async () => {
    const cui = clientForm.cui?.trim();
    if (!cui || cui.length < 6) return;
    try {
      const res = await fetch(
        `https://infocui.ro/system/api/data?key=6baf0bd4dc427d01a92adaeb1d06aeaff156f95d&cui=${cui}`
      );
      const data = await res.json();
      if (data.status === 200 && data.data) {
        const c = data.data;
        setClientForm((prev) => ({
          ...prev,
          name: c.nume || prev.name,
          address: c.adresa || "",
          phone: c.tel || "",
        }));
      }
    } catch (err) {
      console.warn("Eroare la lookup CUI:", err.message);
    }
  };

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

  const handleClassicSubmit = async () => {
    if (!clientForm.name || services.length === 0) {
      setError("Completează datele clientului și cel puțin un serviciu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/generate-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: clientForm, services }),
      });

      const blob = await res.blob();
      setPdfBlob(blob);
    } catch (err) {
      setError("Eroare la generare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-12 max-w-5xl mx-auto">
      {/* === AI Section === */}
      <section className="bg-white p-6 rounded-xl shadow border-l-4 border-indigo-500">
        <h2 className="text-xl font-bold text-indigo-600 mb-2">
          🧠 Factură cu AI
        </h2>
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
          <VoiceInput
            onTextReady={(text) => {
              console.log("📥 Text primit din voice:", text);
              setRawText(text);
            }}
          />

          <button
            onClick={() => {
              setRawText("");
              setPdfBlob(null);
            }}
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
          <button
            onClick={handleDownload}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            📥 Descarcă factura
          </button>
        )}
      </section>

      {/* === Classic Section === */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">📝 Formular Clasic</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="CUI"
            value={clientForm.cui}
            onChange={(e) =>
              setClientForm({ ...clientForm, cui: e.target.value })
            }
            onBlur={handleCuiLookup}
            className="border px-3 py-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Nume"
            value={clientForm.name}
            onChange={(e) =>
              setClientForm({ ...clientForm, name: e.target.value })
            }
            className="border px-3 py-2 rounded text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            value={clientForm.email}
            onChange={(e) =>
              setClientForm({ ...clientForm, email: e.target.value })
            }
            className="border px-3 py-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Telefon"
            value={clientForm.phone}
            onChange={(e) =>
              setClientForm({ ...clientForm, phone: e.target.value })
            }
            className="border px-3 py-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Adresă"
            value={clientForm.address}
            onChange={(e) =>
              setClientForm({ ...clientForm, address: e.target.value })
            }
            className="border px-3 py-2 rounded text-sm col-span-full"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Serviciu"
            value={currentService.name}
            onChange={(e) =>
              setCurrentService({ ...currentService, name: e.target.value })
            }
            className="flex-1 border px-3 py-2 rounded text-sm"
          />
          <input
            type="number"
            placeholder="Cantitate"
            value={currentService.quantity}
            onChange={(e) =>
              setCurrentService({
                ...currentService,
                quantity: Number(e.target.value),
              })
            }
            className="w-24 border px-2 py-2 rounded text-sm"
          />
          <input
            type="number"
            placeholder="Preț"
            value={currentService.price}
            onChange={(e) =>
              setCurrentService({
                ...currentService,
                price: Number(e.target.value),
              })
            }
            className="w-24 border px-2 py-2 rounded text-sm"
          />
          <button
            onClick={handleAddService}
            className="bg-gray-700 text-white px-4 py-2 rounded text-sm"
          >
            Adaugă
          </button>
        </div>

        {services.length > 0 && (
          <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">
            {services.map((s, i) => (
              <li key={i}>
                {s.name} – {s.quantity} x {s.price} RON
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleClassicSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Generează Factura Clasică (test live)
        </button>
      </section>

      {error && <p className="text-center text-red-600 text-sm">{error}</p>}
    </div>
  );
}

export default App;
