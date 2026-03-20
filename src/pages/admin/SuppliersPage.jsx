function SuppliersPage() {
  const mock = [
    { id: 1, name: "Lagos Depot", city: "Lagos", contact: "+234701..." },
    { id: 2, name: "Ikeja Fuel", city: "Ikeja", contact: "+234805..." },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">Suppliers</h2>

      <div className="grid gap-4">
        {mock.map((s) => (
          <div key={s.id} className="bg-[#141414] border border-[#343434] p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{s.name}</p>
              <p className="text-[#b2beb5] text-sm">{s.city} • {s.contact}</p>
            </div>
            <div>
              <button className="px-3 py-1 rounded bg-[#343434] text-white hover:bg-[#f2fd7d] hover:text-black transition">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuppliersPage;