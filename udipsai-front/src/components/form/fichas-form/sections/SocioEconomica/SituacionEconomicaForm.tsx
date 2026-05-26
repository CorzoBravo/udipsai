import React, { useEffect, useRef } from "react";

interface SituacionEconomicaFormProps {
    data: {
        totalIngresos: number;
        totalEgresos: number;
        condicionEconomica: string;
    };

    desglose: {
        egresoAlimentacion: number;
        egresoArriendo: number;
        egresoServiciosBasicos: number;
        egresoSalud: number;
        egresoEducacion: number;
        egresoPrestamos: number;
        egresoOtros: number;
    };
    familiares: {
        nombresApellidos: string;
        relacion: string;
        ingresoMensual: number;
    }[];
    onChangeDesglose: (field: string, value: number) => void;
    onChange: (field: string, value: any) => void;
    onValidate?: (isValid: boolean, errors: string[]) => void;
}

const validateSituacionEconomica = (data: SituacionEconomicaFormProps["data"]): string[] => {
    const errors: string[] = [];
    if (!data.condicionEconomica || data.condicionEconomica.trim() === "") {
        errors.push("Condición económica es requerida");
    }
    return errors;
};

const SituacionEconomicaForm: React.FC<SituacionEconomicaFormProps> = ({
    data,
    desglose,
    familiares,
    onChangeDesglose,
    onChange,
    onValidate,
}) => {
    const lastValidationRef = useRef("");

    useEffect(() => {
        const errors = validateSituacionEconomica(data);
        const serialized = JSON.stringify(errors);
        if (serialized !== lastValidationRef.current) {
            lastValidationRef.current = serialized;
            onValidate?.(errors.length === 0, errors);
        }
    }, [data, onValidate]);

    const calcularTotalIngresos = (familiares: any[]) => {
        return familiares.reduce((acc, fam) => {
            return acc + Number(fam.ingresoMensual || 0);
        }, 0);
    };
    const totalIngresos = calcularTotalIngresos(familiares);

    const calcularTotalEgresos = (d: any) => {
        return (
            Number(d.egresoAlimentacion || 0) +
            Number(d.egresoArriendo || 0) +
            Number(d.egresoServiciosBasicos || 0) +
            Number(d.egresoSalud || 0) +
            Number(d.egresoEducacion || 0) +
            Number(d.egresoPrestamos || 0) +
            Number(d.egresoOtros || 0)
        );
    };
    const totalEgresos = calcularTotalEgresos(desglose);

    // Sync totals to parent when they change
    useEffect(() => {
        if (data.totalIngresos !== totalIngresos) {
            onChange("totalIngresos", totalIngresos);
        }
    }, [totalIngresos, data.totalIngresos]);

    useEffect(() => {
        if (data.totalEgresos !== totalEgresos) {
            onChange("totalEgresos", totalEgresos);
        }
    }, [totalEgresos, data.totalEgresos]);

    return (
        <div className="space-y-6">
            {/* ================= INGRESOS ================= */}
            <div className="space-y-3">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
                    Ingresos por Familiar
                </h3>

                {familiares.length === 0 ? (
                    <p className="text-gray-500">No hay familiares registrados</p>
                ) : (
                    familiares.map((f, index) => (
                        <div
                            key={index}
                            className="flex justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                            <span>
                                {f.relacion} - {f.nombresApellidos}
                            </span>
                            <span>${f.ingresoMensual || 0}</span>
                        </div>
                    ))
                )}
                <div className="mt-4">
                    <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
                        Total Ingresos
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg font-semibold">
                        ${totalIngresos || 0}
                    </p>
                </div>
            </div>

            {/* ================= EGRESOS ================= */}
            <div className="space-y-3">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
                    Egresos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">
                            Alimentación
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={desglose.egresoAlimentacion ?? 0}
                            onChange={(e) =>
                                onChangeDesglose("egresoAlimentacion", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">
                            Arriendo
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={desglose.egresoArriendo ?? 0}
                            onChange={(e) =>
                                onChangeDesglose("egresoArriendo", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">
                            Servicios Básicos (Agua, Luz)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={desglose.egresoServiciosBasicos ?? 0}
                            onChange={(e) =>
                                onChangeDesglose("egresoServiciosBasicos", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">
                            Salud
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={desglose.egresoSalud ?? 0}
                            onChange={(e) =>
                                onChangeDesglose("egresoSalud", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">
                            Educación
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={desglose.egresoEducacion ?? 0}
                            onChange={(e) =>
                                onChangeDesglose("egresoEducacion", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">
                            Préstamos
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={desglose.egresoPrestamos ?? 0}
                            onChange={(e) =>
                                onChangeDesglose("egresoPrestamos", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300">
                            Otros
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={desglose.egresoOtros ?? 0}
                            onChange={(e) =>
                                onChangeDesglose("egresoOtros", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                </div>

                {/* Total egresos */}
                <div className="mt-4">
                    <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
                        Total Egresos
                    </label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg font-semibold">
                        ${totalEgresos || 0}
                    </p>
                </div>
            </div>

            {/* ================= CONDICIÓN ================= */}
            <div>
                <label className="block text-sm mb-2 text-gray-600 dark:text-gray-300">
                    Condición Económica
                </label>
                <select
                    value={data.condicionEconomica || ""}
                    onChange={(e) => onChange("condicionEconomica", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
                >
                    <option value="">Seleccione</option>
                    <option value="Muy buena">Muy buena</option>
                    <option value="Buena">Buena</option>
                    <option value="Regular">Regular</option>
                    <option value="Mala">Mala</option>
                </select>
            </div>
        </div>
    );
};

export default SituacionEconomicaForm;