import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="text-center px-6 pt-24 pb-16 bg-gradient-to-b from-indigo-50 to-white">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          📄 Facturează automat. În 3 secunde.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Transformă vocea sau un text într-o factură PDF completă, fără bătăi de cap.
        </p>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition">
              🔐 Încearcă acum gratuit
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <button
            onClick={() => navigate("/app")}
            className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition"
          >
            🚀 Mergi la aplicație
          </button>
        </SignedIn>
      </section>

      {/* 3 Steps */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Cum funcționează?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Spui ce ai de facturat</h3>
            <p className="text-gray-600">"Ion Popescu, 300 RON consultanță" — atât.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">2. AI-ul completează tot</h3>
            <p className="text-gray-600">Client, serviciu, cantitate, preț — fără formulare.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">3. Generezi PDF + trimiți</h3>
            <p className="text-gray-600">Descarci sau trimiți factura pe email în 1 click.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="text-center py-20 bg-indigo-50">
        <h2 className="text-3xl font-bold mb-4">E timpul să facturezi mai inteligent ⚡</h2>
        <p className="text-gray-600 mb-6">Încearcă gratuit — fără configurare, fără cont bancar.</p>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition">
              🔐 Conectează-te
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <button
            onClick={() => navigate("/app")}
            className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition"
          >
            👉 Mergi în aplicație
          </button>
        </SignedIn>
      </section>

      <footer className="text-center text-sm text-gray-400 py-10">
        © 2025 facturAI.ro — Build with 💙 in Romania
      </footer>
    </div>
  );
}

export default Home;