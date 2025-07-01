import { useState } from "react";
import AiSection from "./sections/AiSection";
import ClassicFormSection from "./sections/ClassicFormSection";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import PDFPreview from "./components/PDFPreview";
import API from "./api";

function App() {
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
      // 1. Trimitem textul către endpointul AI
      const parseRes = await fetch(`${API}/parse-client-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });

      const { parsed } = await parseRes.json();

      // 2. Capitalizăm denumirile serviciilor
      const servicesWithCapital = parsed.services.map((s) => ({
        ...s,
        name: s.name.charAt(0).toUpperCase() + s.name.slice(1),
      }));

      // 3. Trimitem către endpointul de generare factură
      const genRes = await fetch(`${API}/generate-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: parsed.client,
          services: servicesWithCapital,
        }),
      });

      // 4. Primim PDF-ul
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
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-sans">
      <SignedOut>
        <div className="text-center mt-24">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Conectează-te pentru a folosi aplicația
          </h2>
          <SignInButton mode="modal">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
              🔐 Login
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <header className="flex justify-between items-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            Factura Rapida
          </h1>
          <UserButton afterSignOutUrl="/" />
        </header>

        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              📄 Facturează instant cu AI
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Transformă vocea sau un text într-o factură PDF profesională.
              Rapid, precis și automatizat.
            </p>
          </section>

          <AiSection
            rawText={rawText}
            setRawText={setRawText}
            setPdfBlob={setPdfBlob}
            handleGenerateAI={handleGenerateAI}
            pdfBlob={pdfBlob}
            handleDownload={handleDownload}
            loading={loading}
          />

          <ClassicFormSection
            clientForm={clientForm}
            setClientForm={setClientForm}
            handleCuiLookup={handleCuiLookup}
            currentService={currentService}
            setCurrentService={setCurrentService}
            services={services}
            handleAddService={handleAddService}
            handleClassicSubmit={handleClassicSubmit}
            loading={loading}
          />

          <PDFPreview blob={pdfBlob} />

          {error && (
            <p className="text-center text-red-600 text-sm font-medium">
              {error}
            </p>
          )}

          <footer className="pt-16">
            <p className="text-center text-sm text-gray-400">
              © 2025 Factura Rapida — Build with 💙 in Romania
            </p>
          </footer>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;
