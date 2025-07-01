import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans scroll-smooth">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <img
            className="w-full max-w-20 mx-0 rounded-xl shadow-lg"
            src="https://sdmntprcentralus.oaiusercontent.com/files/00000000-58e8-61f5-b221-872fd6929b94/raw?se=2025-07-01T16%3A05%3A37Z&sp=r&sv=2024-08-04&sr=b&scid=e73fa50a-5aa7-5399-8cf3-500cec0d8158&skoid=04233560-0ad7-493e-8bf0-1347c317d021&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-01T13%3A44%3A23Z&ske=2025-07-02T13%3A44%3A23Z&sks=b&skv=2024-08-04&sig=Wi%2B46EATTOb/BLxsEK5pSiR8nW0PaHDT0XY7GFc6w6g%3D"
            alt="Preview aplicație"
          />

          <nav className="space-x-4 hidden md:flex">
            <a href="#how" className="text-gray-600 hover:text-indigo-600">
              Cum funcționează
            </a>
            <a href="#benefits" className="text-gray-600 hover:text-indigo-600">
              Beneficii
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-indigo-600"
            >
              Testimoniale
            </a>
            <a href="#faq" className="text-gray-600 hover:text-indigo-600">
              FAQ
            </a>
          </nav>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => navigate("/app")}
              className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition"
            >
              Aplicație
            </button>
          </SignedIn>
        </div>
      </header>

      <main className="pt-10">
        {/* Hero Section */}
        <section className="text-center px-6 pt-20 pb-24 bg-gradient-to-b from-indigo-50 to-white">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Emite facturi în 3 secunde.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Transformă vocea sau un text într-o factură PDF completă. Automat.
            Fără bătăi de cap.
          </p>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition">
                🔐 Încearcă gratuit
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <button
              onClick={() => navigate("/app")}
              className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition"
            >
              🚀 Intră în aplicație
            </button>
          </SignedIn>

          <div className="mt-16 animate-fade-in">
            <img
              src="https://res.cloudinary.com/dpf3vc2ug/image/upload/v1719848626/facturai-preview.png"
              alt="Preview factura AI"
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-xl"
            />
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="py-24 px-6 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Cum funcționează?
          </h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div className="transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">
                1. Spui ce ai de facturat
              </h3>
              <p className="text-gray-600">
                "Ion Popescu, 300 RON consultanță" — atât.
              </p>
            </div>
            <div className="transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">
                2. AI-ul completează tot
              </h3>
              <p className="text-gray-600">
                Client, serviciu, cantitate, preț — fără formulare.
              </p>
            </div>
            <div className="transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">
                3. Generezi PDF + trimiți
              </h3>
              <p className="text-gray-600">
                Descarci sau trimiți factura pe email în 1 click.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-24 px-6 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            De ce facturAI?
          </h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div className="transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">
                🧠 Inteligență artificială reală
              </h3>
              <p className="text-gray-600">
                Nu completezi formulare. Doar vorbești sau scrii. AI-ul înțelege
                tot.
              </p>
            </div>
            <div className="transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">
                📥 PDF + Email în 1 click
              </h3>
              <p className="text-gray-600">
                Generezi PDF automat, îl descarci sau îl trimiți instant pe
                email.
              </p>
            </div>
            <div className="transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2">
                📊 Ești mereu în control
              </h3>
              <p className="text-gray-600">
                Vei avea dashboard, istoric, e-Factura, SPV și tot ce ai nevoie.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-gray-50 px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Ce spun utilizatorii noștri
          </h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 animate-fade-in">
              <p className="text-gray-700 italic">
                “Emit 8-10 facturi pe lună și pierd enorm de mult timp. Acum
                termin tot în 2 minute. Minunat.”
              </p>
              <p className="mt-4 font-semibold text-sm text-indigo-600">
                — Vlad, freelancer
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 animate-fade-in delay-150">
              <p className="text-gray-700 italic">
                “Îmi place că înțelege ce zic. Am dictat o factură din trafic și
                era deja pe email.”
              </p>
              <p className="mt-4 font-semibold text-sm text-indigo-600">
                — Ana, consultantă
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 animate-fade-in delay-300">
              <p className="text-gray-700 italic">
                “Simplu, rapid, gratuit. Nu e nimic mai bun dacă vrei să
                facturezi fără stres.”
              </p>
              <p className="mt-4 font-semibold text-sm text-indigo-600">
                — Radu, antreprenor
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Întrebări frecvente
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Este gratuit de folosit?
              </h3>
              <p className="text-gray-600">
                Da, în versiunea actuală poți genera și trimite facturi fără
                costuri.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Funcționează și pe telefon?
              </h3>
              <p className="text-gray-600">
                Da, aplicația este complet optimizată pentru mobil și tablete.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Pot salva clienți și servicii?
              </h3>
              <p className="text-gray-600">
                În curând vei putea salva date frecvente și accesa istoricul tău
                complet.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="text-center py-24 bg-indigo-50">
          <h2 className="text-3xl font-bold mb-4">
            Încearcă facturAI gratuit chiar acum
          </h2>
          <p className="text-gray-600 mb-6">
            Fără configurări. Fără cont bancar. Fără timp pierdut.
          </p>

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
          © 2025 facturAI.ro — Build by{" "}
          <a
            href="https://silviustoian.com"
            className="text-indigo-600 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            &lt;vestruu /&gt;
          </a>{" "}
          with 💙 in Romania
        </footer>
      </main>
    </div>
  );
}

export default Home;
