import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Factură Rapidă</h1>
        <input
          type="text"
          placeholder="ex: Ion Popescu, 450 RON, Web design"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Generează Factura
        </button>
      </div>
    </div>
  );
}

export default App;