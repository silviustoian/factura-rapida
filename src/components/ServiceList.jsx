const ServiceList = ({ services }) => {
    if (!services.length) return null;
  
    return (
      <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">
        {services.map((s, i) => (
          <li key={i}>
            {s.name} – {s.quantity} x {s.price} RON
          </li>
        ))}
      </ul>
    );
  };
  
  export default ServiceList;
  