
import "./App.css";
import { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    const parts = inputText.split(",").map((p) => p.trim());

    if (parts.length !== 3) {
      setError(
        "Te rog introdu: nume, sumă, serviciu. Ex: Ion Popescu, 450 RON, Web design"
      );
      setParsedData(null);
      return;
    }

    const [name, rawAmount, service] = parts;
    const amount = parseFloat(rawAmount.replace(/[^\d.-]/g, ""));

    if (isNaN(amount)) {
      setError("Nu am putut extrage suma. Asigură-te că este un număr valid.");
      setParsedData(null);
      return;
    }

    const parsed = { name, amount, service };
    setParsedData(parsed);

    try {
      const response = await fetch("http://localhost:4000/generate-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const data = await response.json();
      console.log("Răspuns de la server:", data);

      if (data.success) {
        alert("Factura a fost generată (simulat).");
      } else {
        setError("Serverul a răspuns, dar ceva n-a mers corect.");
      }
    } catch (err) {
      console.error("Eroare la fetch:", err);
      setError("A apărut o eroare la trimiterea datelor către server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Factură Rapidă</h1>

        <input
          type="text"
          placeholder="ex: Ion Popescu, 450 RON, Web design"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Generează Factura
        </button>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

        {parsedData && (
          <div className="mt-6 text-sm text-gray-700 space-y-1">
            <p>
              <strong>Nume:</strong> {parsedData.name}
            </p>
            <p>
              <strong>Suma:</strong> {parsedData.amount} RON
            </p>
            <p>
              <strong>Serviciu:</strong> {parsedData.service}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
