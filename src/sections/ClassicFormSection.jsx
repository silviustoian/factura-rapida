import ServiceList from "../components/ServiceList";

const ClassicFormSection = ({
    clientForm,
    setClientForm,
    handleCuiLookup,
    currentService,
    setCurrentService,
    services,
    handleAddService,
    handleClassicSubmit,
    loading,
  }) => {
    return (
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
  
        <ServiceList services={services} />
  
        <button
          onClick={handleClassicSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Generează Factura Clasică
        </button>
      </section>
    );
  };
  
  export default ClassicFormSection;
  