import React from "react";

interface Familiar {
  relacion: string;
  nombresApellidos: string;
  edad: number;
  estadocivil: string;
  instruccion: string;
  ocupacion: string;
  ingresoMensual: number;
}

interface ConformacionFamiliarProps {
  data: Familiar[];
  onChange: (
    index: number,
    field: keyof Familiar,
    value: string | number
  ) => void;
}

const ConformacionFamiliar: React.FC<ConformacionFamiliarProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="p-4 bg-white shadow-sm">
      <h2 className="text-lg font-bold mb-2 uppercase text-black">
        2. CONFORMACIÓN FAMILIAR
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-2 border-black border-collapse">
          <thead>
            <tr className="text-[10px] font-bold uppercase bg-gray-50">
              <th className="border-2 border-black p-1 w-8 text-center">N°</th>
              <th className="border-2 border-black p-1">RELACIÓN</th>
              <th className="border-2 border-black p-1">
                NOMBRES Y APELLIDOS
              </th>
              <th className="border-2 border-black p-1 w-12 text-center">
                EDAD
              </th>
              <th className="border-2 border-black p-1">EST. CIVIL</th>
              <th className="border-2 border-black p-1">INSTRUCCIÓN</th>
              <th className="border-2 border-black p-1">OCUPACIÓN</th>
              <th className="border-2 border-black p-1 text-center">
                INGRESO MENSUAL
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((familiar, index) => (
              <tr key={index} className="h-8">
                <td className="border-2 border-black text-center text-xs font-bold bg-gray-100">
                  {index + 1}
                </td>

                <td className="border-2 border-black p-0">
                  <input
                    className="w-full p-1 text-xs"
                    value={familiar.relacion || ""}
                    onChange={(e) =>
                      onChange(index, "relacion", e.target.value)
                    }
                  />
                </td>

                <td className="border-2 border-black p-0">
                  <input
                    className="w-full p-1 text-xs"
                    value={familiar.nombresApellidos || ""}
                    onChange={(e) =>
                      onChange(index, "nombresApellidos", e.target.value)
                    }
                  />
                </td>

                <td className="border-2 border-black p-0">
                  <input
                    type="number"
                    className="w-full p-1 text-xs text-center"
                    value={familiar.edad ?? ""}
                    onChange={(e) =>
                      onChange(
                        index,
                        "edad",
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                  />
                </td>

                <td className="border-2 border-black p-0">
                  <input
                    className="w-full p-1 text-xs text-center"
                    value={familiar.estadocivil || ""}
                    onChange={(e) =>
                      onChange(index, "estadocivil", e.target.value)
                    }
                  />
                </td>

                <td className="border-2 border-black p-0">
                  <input
                    className="w-full p-1 text-xs"
                    value={familiar.instruccion || ""}
                    onChange={(e) =>
                      onChange(index, "instruccion", e.target.value)
                    }
                  />
                </td>

                <td className="border-2 border-black p-0">
                  <input
                    className="w-full p-1 text-xs"
                    value={familiar.ocupacion || ""}
                    onChange={(e) =>
                      onChange(index, "ocupacion", e.target.value)
                    }
                  />
                </td>

                <td className="border-2 border-black p-0">
                  <input
                    type="number"
                    className="w-full p-1 text-xs text-right"
                    placeholder="$"
                    value={familiar.ingresoMensual ?? ""}
                    onChange={(e) =>
                      onChange(
                        index,
                        "ingresoMensual",
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
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