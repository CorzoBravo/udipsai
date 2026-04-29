import React, { useState } from 'react';

interface Familiar {
  parentesco: string;
  nombres: string;
  edad: string;
  estadoCivil: string;
  instruccion: string;
  ocupacion: string;
  ingreso: string;
  observaciones: string;
}

const ConformacionFamiliar: React.FC = () => {
  const [familiares, setFamiliares] = useState<Familiar[]>([
    { parentesco: '', nombres: '', edad: '', estadoCivil: '', instruccion: '', ocupacion: '', ingreso: '', observaciones: '' }
  ]);

  const handleInputChange = (index: number, field: keyof Familiar, value: string) => {
    const nuevosFamiliares = [...familiares];
    nuevosFamiliares[index][field] = value;
    setFamiliares(nuevosFamiliares);
  };

  const agregarFila = () => {
    setFamiliares([
      ...familiares,
      { parentesco: '', nombres: '', edad: '', estadoCivil: '', instruccion: '', ocupacion: '', ingreso: '', observaciones: '' }
    ]);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-800">1. CONFORMACIÓN FAMILIAR</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-sm font-semibold">
              <th className="border border-gray-300 p-2">Parentesco</th>
              <th className="border border-gray-300 p-2">Apellidos y Nombres</th>
              <th className="border border-gray-300 p-2">Edad</th>
              <th className="border border-gray-300 p-2">Estado Civil</th>
              <th className="border border-gray-300 p-2">Instrucción</th>
              <th className="border border-gray-300 p-2">Ocupación</th>
              <th className="border border-gray-300 p-2">Ingreso Mensual</th>
              <th className="border border-gray-300 p-2">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {familiares.map((familiar, index) => (
              <tr key={index} className="hover:bg-gray-50 text-sm">
                <td className="border border-gray-300 p-1">
                  <input className="w-full p-1 outline-none" value={familiar.parentesco} onChange={(e) => handleInputChange(index, 'parentesco', e.target.value)} />
                </td>
                <td className="border border-gray-300 p-1">
                  <input className="w-full p-1 outline-none" value={familiar.nombres} onChange={(e) => handleInputChange(index, 'nombres', e.target.value)} />
                </td>
                <td className="border border-gray-300 p-1">
                  <input type="number" className="w-full p-1 outline-none" value={familiar.edad} onChange={(e) => handleInputChange(index, 'edad', e.target.value)} />
                </td>
                <td className="border border-gray-300 p-1">
                  <input className="w-full p-1 outline-none" value={familiar.estadoCivil} onChange={(e) => handleInputChange(index, 'estadoCivil', e.target.value)} />
                </td>
                <td className="border border-gray-300 p-1">
                  <input className="w-full p-1 outline-none" value={familiar.instruccion} onChange={(e) => handleInputChange(index, 'instruccion', e.target.value)} />
                </td>
                <td className="border border-gray-300 p-1">
                  <input className="w-full p-1 outline-none" value={familiar.ocupacion} onChange={(e) => handleInputChange(index, 'ocupacion', e.target.value)} />
                </td>
                <td className="border border-gray-300 p-1">
                  <input className="w-full p-1 outline-none" placeholder="$" value={familiar.ingreso} onChange={(e) => handleInputChange(index, 'ingreso', e.target.value)} />
                </td>
                <td className="border border-gray-300 p-1">
                  <input className="w-full p-1 outline-none" value={familiar.observaciones} onChange={(e) => handleInputChange(index, 'observaciones', e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={agregarFila}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow-lg transition duration-200"
      >
        + AGREGAR FAMILIAR
      </button>
    </div>
  );
};

export default ConformacionFamiliar;