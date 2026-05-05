import React from "react";

interface InformacionPacienteFormProps {
    data: {
        id: number;
        nombresApellidos: string;
        fechaNacimiento: string;
        lugarNacimiento: string;
        edad: number;
        cedula: string;
    };
    onChange: (field: string, value: any) => void;
}

const InformacionPacienteForm: React.FC<InformacionPacienteFormProps> = ({ data }) => {
    return (
        <div className="space-y-4">
            {/* Fila 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre Completo
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.nombresApellidos || "—"}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cédula
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.cedula || "—"}
                    </p>
                </div>
            </div>

            {/* Fila 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fecha de Nacimiento
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.fechaNacimiento || "—"}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Edad
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.edad || "—"} años
                    </p>
                </div>
            </div>

            {/* Fila 3 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lugar de Nacimiento
                </label>
                <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                    {data.lugarNacimiento || "—"}
                </p>
            </div>
        </div>
    );
};

export default InformacionPacienteForm;