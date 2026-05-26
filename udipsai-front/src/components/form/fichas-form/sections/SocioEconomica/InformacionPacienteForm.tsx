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
        institucionEducativa?: {
            nombre: string;
        };
        domicilio?: string;
        portadorCarnet?: boolean;
        tipoDiscapacidad?: string;
        porcentajeDiscapacidad?: number;
        estadoCivil?: string;
        nacionalidad?: string;
        sexo?: string;
    };
    pacienteInstruccion?: string;
    pacienteOcupacion?: string;
    pacienteEmail?: string;
    pacienteNumCarne?: string;
    onChangePaciente: (field: string, value: any) => void;
    onChange: (field: string, value: any) => void;
}

const InformacionPacienteForm: React.FC<InformacionPacienteFormProps> = ({
    data,
    pacienteInstruccion = "",
    pacienteOcupacion = "",
    pacienteEmail = "",
    pacienteNumCarne = "",
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Estado Civil
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.estadoCivil || "—"}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nacionalidad
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.nacionalidad || "—"}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sexo
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.sexo || "—"}
                    </p>
                </div>
            </div>

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

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Institución Educativa
                </label>
                <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                    {data.institucionEducativa?.nombre || "—"}
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domicilio
                </label>
                <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                    {data.domicilio || "—"}
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Portador de Carnet de Discapacidad
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-100">
                        {data.portadorCarnet ? "Sí" : "No"}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        N° Carné de Discapacidad
                    </label>
                    <Input
                        value={pacienteNumCarne}
                        onChange={(e: any) => onChangePaciente("pacienteNumCarne", e.target.value)}
                        placeholder="N° Carné"
                        disabled={!data.portadorCarnet}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
        </div>
    );
};

export default InformacionPacienteForm;