import React, { useState } from 'react';

interface Familiar {
  relacion: string;
  nombresYApellidos: string;
  edad: string;
  estCivil: string;
  instruccion: string;
  ocupacion: string;
  ingresoMensual: string;
}

const ConformacionFamiliar: React.FC = () => {
 
  const [familiares, setFamiliares] = useState<Familiar[]>(
    Array(10).fill({
      relacion: '',
      nombresYApellidos: '',
      edad: '',
      estCivil: '',
      instruccion: '',
      ocupacion: '',
      ingresoMensual: ''
    })
  );

  const handleInputChange = (index: number, field: keyof Familiar, value: string) => {
    const nuevosFamiliares = [...familiares];
    nuevosFamiliares[index] = { ...nuevosFamiliares[index], [field]: value };
    setFamiliares(nuevosFamiliares);
  };

  return (
    <div className="p-4 bg-white shadow-sm">
      <h2 className="text-lg font-bold mb-2 uppercase text-black">2. CONFORMACIÓN FAMILIAR</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-2 border-black border-collapse">
          <thead>
            <tr className="text-[10px] font-bold uppercase bg-gray-50">
              <th className="border-2 border-black p-1 w-8 text-center">N°</th>
              <th className="border-2 border-black p-1">RELACIÓN</th>
              <th className="border-2 border-black p-1">NOMBRES Y APELLIDOS</th>
              <th className="border-2 border-black p-1 w-12 text-center">EDAD</th>
              <th className="border-2 border-black p-1">EST. CIVIL</th>
              <th className="border-2 border-black p-1">INSTRUCCIÓN</th>
              <th className="border-2 border-black p-1">OCUPACIÓN</th>
              <th className="border-2 border-black p-1 text-center">INGRESO MENSUAL</th>
            </tr>
          </thead>
          <tbody>
            {familiares.map((familiar, index) => (
              <tr key={index} className="h-8">
                <td className="border-2 border-black text-center text-xs font-bold bg-gray-100 w-8">
                  {index + 1}
                </td>
                <td className="border-2 border-black p-0">
                  <input 
                    className="w-full h-full p-1 text-xs outline-none" 
                    value={familiar.relacion} 
                    onChange={(e) => handleInputChange(index, 'relacion', e.target.value)} 
                  />
                </td>
                <td className="border-2 border-black p-0">
                  <input 
                    className="w-full h-full p-1 text-xs outline-none" 
                    value={familiar.nombresYApellidos} 
                    onChange={(e) => handleInputChange(index, 'nombresYApellidos', e.target.value)} 
                  />
                </td>
                <td className="border-2 border-black p-0">
                  <input 
                    type="number" 
                    className="w-full h-full p-1 text-xs outline-none text-center" 
                    value={familiar.edad} 
                    onChange={(e) => handleInputChange(index, 'edad', e.target.value)} 
                  />
                </td>
                <td className="border-2 border-black p-0">
                  <input 
                    className="w-full h-full p-1 text-xs outline-none text-center" 
                    value={familiar.estCivil} 
                    onChange={(e) => handleInputChange(index, 'estCivil', e.target.value)} 
                  />
                </td>
                <td className="border-2 border-black p-0">
                  <input 
                    className="w-full h-full p-1 text-xs outline-none" 
                    value={familiar.instruccion} 
                    onChange={(e) => handleInputChange(index, 'instruccion', e.target.value)} 
                  />
                </td>
                <td className="border-2 border-black p-0">
                  <input 
                    className="w-full h-full p-1 text-xs outline-none" 
                    value={familiar.ocupacion} 
                    onChange={(e) => handleInputChange(index, 'ocupacion', e.target.value)} 
                  />
                </td>
                <td className="border-2 border-black p-0">
                  <input 
                    className="w-full h-full p-1 text-xs outline-none text-right" 
                    placeholder="$"
                    value={familiar.ingresoMensual} 
                    onChange={(e) => handleInputChange(index, 'ingresoMensual', e.target.value)} 
                  />
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