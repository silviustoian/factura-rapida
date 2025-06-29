import VoiceInput from "../components/VoiceInput";

const AiSection = ({
  rawText,
  setRawText,
  setPdfBlob,        // ✅ adăugat
  handleGenerateAI,
  pdfBlob,
  handleDownload,
  loading,
}) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow border-l-4 border-indigo-500">
      <h2 className="text-xl font-bold text-indigo-600 mb-2">🧠 Factură cu AI</h2>

      <textarea
        rows={5}
        value={rawText}
        onChange={(e) => {
          setRawText(e.target.value);
          if (!e.target.value) setPdfBlob(null); // ✅ acum va merge
        }}
        placeholder="Ex: Softvision, CUI 12345678, email x@mail.com, 2 ore consultanță la 200 RON"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2"
      />

      <div className="flex gap-2 mb-4">
        <VoiceInput onTextReady={(text) => setRawText(text)} />
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
  );
};

export default AiSection;
