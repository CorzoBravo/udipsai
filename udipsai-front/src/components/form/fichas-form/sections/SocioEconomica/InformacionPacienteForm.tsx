import React from "react";
import Input from "../../../input/InputField";

interface InformacionPacienteFormProps {
    data: {
        id: number;
        nombresApellidos: string;
        fechaNacimiento: string;
        lugarNacimiento: string;
        edad: number;
        cedula: string;
        numeroTelefono?: string;
        numeroCelular?: string;
        domicilio?: string;
        portadorCarnet?: boolean;
        tipoDiscapacidad?: string;
        porcentajeDiscapacidad?: number;
    };
    pacienteInstruccion?: string;
    pacienteOcupacion?: string;
    pacienteEmail?: string;
    responsable?: string;
    familiares?: {
        nombresApellidos: string;
        relacion: string;
    }[];
    onChangePaciente: (field: string, value: any) => void;
    onChange: (field: string, value: any) => void;
}

const InformacionPacienteForm: React.FC<InformacionPacienteFormProps> = ({
    data,
    pacienteInstruccion = "",
    pacienteOcupacion = "",
    pacienteEmail = "",
    responsable = "",
    familiares = [],
    onChangePaciente,
}) => {
    return (
        <div className="space-y-4">
            {/* Fila 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre Completo
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100 font-medium">
                        {data.nombresApellidos || "—"}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cédula
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100 font-medium">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lugar de Nacimiento
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.lugarNacimiento || "—"}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        E-mail
                    </label>
                    <Input
                        value={pacienteEmail}
                        onChange={(e: any) => onChangePaciente("pacienteEmail", e.target.value)}
                        placeholder="ejemplo@correo.com"
                    />
                </div>
            </div>

            {/* Fila 4: Instrucción & Ocupación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Instrucción
                    </label>
                    <Input
                        value={pacienteInstruccion}
                        onChange={(e: any) => onChangePaciente("pacienteInstruccion", e.target.value)}
                        placeholder="Nivel de educación (Ej: Básica, Bachillerato)"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ocupación
                    </label>
                    <Input
                        value={pacienteOcupacion}
                        onChange={(e: any) => onChangePaciente("pacienteOcupacion", e.target.value)}
                        placeholder="Ej: Estudiante"
                    />
                </div>
            </div>

            {/* Fila 5: Teléfonos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número de Teléfono
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.numeroTelefono || "—"}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número de Celular
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.numeroCelular || "—"}
                    </p>
                </div>
            </div>

            {/* Domicilio */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domicilio
                </label>
                <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                    {data.domicilio || "—"}
                </p>
            </div>

            {/* Fila 6: Responsable de la información */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Responsable de la Información (Familiar)
                    </label>
                    <select
                        value={familiares?.some(f => `${f.nombresApellidos} (${f.relacion})` === responsable) ? responsable : ""}
                        onChange={(e) => onChangePaciente("responsable", e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    >
                        <option value="">Seleccionar de la lista de familiares...</option>
                        {familiares?.map((f, i) => (
                            <option key={i} value={`${f.nombresApellidos} (${f.relacion})`}>
                                {f.nombresApellidos} ({f.relacion})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre / Relación del Responsable
                    </label>
                    <Input
                        value={responsable}
                        onChange={(e: any) => onChangePaciente("responsable", e.target.value)}
                        placeholder="Escriba nombre y relación (Ej: Juan Pérez (Padre))"
                    />
                </div>
            </div>

            {/* Discapacidad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Presenta Discapacidad
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.portadorCarnet ? "Sí" : "No"}
                    </p>
                </div>
                {data.portadorCarnet && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tipo de Discapacidad
                            </label>
                            <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                                {data.tipoDiscapacidad || "—"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Porcentaje de Discapacidad
                            </label>
                            <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                                {data.porcentajeDiscapacidad !== undefined ? `${data.porcentajeDiscapacidad}%` : "—"}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InformacionPacienteForm;