import React from "react";

interface SituacionEconomicaFormProps {
    data: {
        totalIngresos: number;
        totalEgresos: number;
        condicionEconomica: string;
        capacidadGastoEvaluacion: string;
        actividadesTiempoLibre: string;
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
}

const SituacionEconomicaForm: React.FC<SituacionEconomicaFormProps> = ({
    data,
    desglose,
    familiares,
    onChangeDesglose,
    onChange,
}) => {

    const calcularTotalIngresos = (familiares: any[]) => {
        const total = familiares.reduce((acc, fam) => {
            return acc + Number(fam.ingresoMensual || 0);
        }, 0);

        return total;
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
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
                    Uso de tiempo libre
                </h3>

                {(() => {

                    // =========================
                    // RECUPERAR DATOS
                    // =========================
                    let actividadesSeleccionadas: string[] = [];

                    try {
                        actividadesSeleccionadas = data.actividadesTiempoLibre
                            ? JSON.parse(data.actividadesTiempoLibre)
                            : [];
                    } catch {
                        actividadesSeleccionadas = [];
                    }

                    // =========================
                    // ACTIVIDADES NORMALES
                    // =========================
                    const actividadesBase = [
                        "Deporte",
                        "Música",
                        "TV",
                        "Internet",
                        "Paseos familiares",
                        "Amigos/as",
                    ];

                    // =========================
                    // TOGGLE NORMAL
                    // =========================
                    const toggleActividad = (value: string) => {
                        let nuevas = [...actividadesSeleccionadas];

                        if (nuevas.includes(value)) {
                            nuevas = nuevas.filter((a) => a !== value);
                        } else {
                            nuevas.push(value);
                        }

                        onChange(
                            "actividadesTiempoLibre",
                            JSON.stringify(nuevas)
                        );
                    };

                    // =========================
                    // TOGGLE ESPECIAL
                    // =========================
                    const toggleEspecial = (
                        prefijo: string,
                        checked: boolean
                    ) => {

                        let nuevas = actividadesSeleccionadas.filter(
                            (a) => !a.startsWith(prefijo)
                        );

                        if (checked) {
                            nuevas.push(`${prefijo}`);
                        }

                        onChange(
                            "actividadesTiempoLibre",
                            JSON.stringify(nuevas)
                        );
                    };

                    // =========================
                    // ACTUALIZAR TEXTO
                    // =========================
                    const actualizarTextoEspecial = (
                        prefijo: string,
                        valor: string
                    ) => {

                        let nuevas = actividadesSeleccionadas.filter(
                            (a) => !a.startsWith(prefijo)
                        );

                        nuevas.push(`${prefijo}${valor}`);

                        onChange(
                            "actividadesTiempoLibre",
                            JSON.stringify(nuevas)
                        );
                    };

                    return (
                        <div className="space-y-4">

                            {/* CHECKBOXES */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                                {actividadesBase.map((item) => (
                                    <label
                                        key={item}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={actividadesSeleccionadas.includes(item)}
                                            onChange={() => toggleActividad(item)}
                                        />

                                        {item}
                                    </label>
                                ))}

                                {/* Trabajo infantil */}
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={actividadesSeleccionadas.some((a) =>
                                            a.startsWith("Trabajo infantil:")
                                        )}
                                        onChange={(e) =>
                                            toggleEspecial(
                                                "Trabajo infantil:",
                                                e.target.checked
                                            )
                                        }
                                    />

                                    Trabajo infantil
                                </label>

                                {/* Otros */}
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={actividadesSeleccionadas.some((a) =>
                                            a.startsWith("Otros:")
                                        )}
                                        onChange={(e) =>
                                            toggleEspecial(
                                                "Otros:",
                                                e.target.checked
                                            )
                                        }
                                    />

                                    Otros
                                </label>
                            </div>

                            {/* INPUT TRABAJO INFANTIL */}
                            {actividadesSeleccionadas.some((a) =>
                                a.startsWith("Trabajo infantil:")
                            ) && (
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Especifique trabajo infantil
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                actividadesSeleccionadas
                                                    .find((a) =>
                                                        a.startsWith("Trabajo infantil:")
                                                    )
                                                    ?.replace("Trabajo infantil:", "") || ""
                                            }
                                            onChange={(e) =>
                                                actualizarTextoEspecial(
                                                    "Trabajo infantil:",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                                        />
                                    </div>
                                )}

                            {/* INPUT OTROS */}
                            {actividadesSeleccionadas.some((a) =>
                                a.startsWith("Otros:")
                            ) && (
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Especifique otros
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                actividadesSeleccionadas
                                                    .find((a) =>
                                                        a.startsWith("Otros:")
                                                    )
                                                    ?.replace("Otros:", "") || ""
                                            }
                                            onChange={(e) =>
                                                actualizarTextoEspecial(
                                                    "Otros:",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                                        />
                                    </div>
                                )}
                        </div>
                    );
                })()}
            </div>
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
                            Servicios Básicos
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

            {/* ================= RESULTADO ================= */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

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

                <div className="space-y-3 md:grid-cols-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        ¿Hasta cuánto podría gastar en una evaluación psicopedagógica?
                    </label>

                    {[
                        { label: "3$ por sesión", value: "3" },
                        { label: "5$ por sesión", value: "5" },
                        { label: "10$ por sesión", value: "10" },
                        { label: "15$ por sesión", value: "15" },
                        { label: "No puedo cubrir los gastos", value: "NO" },
                    ].map((op) => (
                        <label key={op.value} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="capacidadGasto"
                                value={op.value}
                                checked={data.capacidadGastoEvaluacion?.startsWith(op.value)}
                                onChange={() =>
                                    onChange("capacidadGastoEvaluacion", op.label) // 👈 guardas el texto completo
                                }
                            />
                            {op.label}
                        </label>
                    ))}

                    {/* Otros */}
                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="capacidadGasto"
                            value="OTRO"
                            checked={data.capacidadGastoEvaluacion?.startsWith("OTRO")}
                            onChange={() => onChange("capacidadGastoEvaluacion", "OTRO")}
                        />
                        <span>Otros:</span>

                        <input
                            type="text"
                            placeholder="Especifique..."
                            disabled={!data.capacidadGastoEvaluacion?.startsWith("OTRO")}
                            onChange={(e) =>
                                onChange("capacidadGastoEvaluacion", "OTRO: " + e.target.value)
                            }
                            className="px-2 py-1 border rounded"
                        />
                    </div>
                </div>

            </div>

        </div>
    );
};

export default SituacionEconomicaForm;