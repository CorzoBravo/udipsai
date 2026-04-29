import React, { useState } from 'react';

interface Familiar {
  relacion: string;
  nombres: string;
  edad: string;
  estadoCivil: string;
  instruccion: string;
  ocupacion: string;
  ingreso: string;
}

const ConformacionFamiliar: React.FC = () => {
  const [familiares, setFamiliares] = useState<Familiar[]>(
    Array(10).fill({ relacion: '', nombres: '', edad: '', estadoCivil: '', instruccion: '', ocupacion: '', ingreso: '' })
  );

  const handleInputChange = (index: number, field: keyof Familiar, value: string) => {
    const nuevosFamiliares = [...familiares];
    nuevosFamiliares[index] = { ...nuevosFamiliares[index], [field]: value };
    setFamiliares(nuevosFamiliares);
  };

  return (
    <div className="p-4 bg-white shadow-sm border border-gray-200">
      <h2 className="text-lg font-bold mb-2 uppercase text-black">2. CONFORMACIÓN FAMILIAR</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-2 border-black border-collapse">
          <thead>
            <tr className="text-xs font-bold uppercase">
              <th className="border-2 border-black p-1 w-8 text-center">N°</th>
              <th className="border-2 border-black p-1">Relación</th>
              <th className="border-2 border-black p-1">Nombres y Apellidos</th>
              <th className="border-2 border-black p-1 w-12">Edad</th>
              <th className="border-2 border-black p-1">Est. Civil</th>
              <th className="border-2 border-black p-1">Instrucción</th>
              <th className="border-2 border-black p-1">Ocupación</th>
              <th className="border-2 border-black p-1">Ingreso Mensual</th>
            </tr>
          </thead>
          <tbody>
            {familiares.map((familiar, index) => (
              <tr key={index} className="h-8">
                <td className="border-2 border-black text-center text-xs font-bold bg-gray-50">
                  {index + 1}
                </td>
                <td className="border-2 border-black p-0">
                  <input className="w-full h-full p-1 text-xs outline-none" value={familiar.relacion} onChange={(e) => handleInputChange(index, 'relacion', e.target.value)} />
                </td>
                <td className="border-2 border-black p-0">
                  <input className="w-full h-full p-1 text-xs outline-none" value={familiar.nombres} onChange={(e) => handleInputChange(index, 'nombres', e.target.value)} />
                </td>
                <td className="border-2 border-black p-0">
                  <input type="number" className="w-full h-full p-1 text-xs outline-none text-center" value={familiar.edad} onChange={(e) => handleInputChange(index, 'edad', e.target.value)} />
                </td>
                <td className="border-2 border-black p-0">
                  <input className="w-full h-full p-1 text-xs outline-none" value={familiar.estadoCivil} onChange={(e) => handleInputChange(index, 'estadoCivil', e.target.value)} />
                </td>
                <td className="border-2 border-black p-0">
                  <input className="w-full h-full p-1 text-xs outline-none" value={familiar.instruccion} onChange={(e) => handleInputChange(index, 'instruccion', e.target.value)} />
                </td>
                <td className="border-2 border-black p-0">
                  <input className="w-full h-full p-1 text-xs outline-none" value={familiar.ocupacion} onChange={(e) => handleInputChange(index, 'ocupacion', e.target.value)} />
                </td>
                <td className="border-2 border-black p-0">
                  <input className="w-full h-full p-1 text-xs outline-none text-right" placeholder="$" value={familiar.ingreso} onChange={(e) => handleInputChange(index, 'ingreso', e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConformacionFamiliar;