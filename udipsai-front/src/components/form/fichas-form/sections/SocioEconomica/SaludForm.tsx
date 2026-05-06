import React, { useState, useEffect } from "react";
import Switch from "../../../switch/Switch";
import Input from "../../../input/InputField";
import Label from "../../../Label";

/* =========================
   🔹 TIPOS
=========================*/

interface FamiliarSalud {
    problema?: boolean;
    enfermedad?: string;

    catastrofica?: boolean;
    enfermedadCatastrofica?: string;

    discapacidad?: boolean;
    descripDiscapacidad?: string;
}

interface Familiar {
    relacion: string;
    nombresApellidos: string;
    salud?: FamiliarSalud;
}

interface SaludData {
    lugarAtencionMedica: string;
    saludEstudiante: string;
    ayudasTecnicas: string;
}

interface SaludFormProps {
    data: SaludData;
    onChange: (field: keyof SaludData, value: any) => void;
    familiares: Familiar[];
    onChangeFamiliar: (
        index: number,
        field: keyof FamiliarSalud,
        value: any
    ) => void;
}

/* =========================
   🔹 COMPONENTE
=========================*/

const SaludForm: React.FC<SaludFormProps> = ({
    data,
    onChange,
    familiares,
    onChangeFamiliar,
}) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    /* ================= LUGAR ATENCIÓN ================= */
    const getValues = () =>
        data.lugarAtencionMedica
            ? data.lugarAtencionMedica.split(",").filter(Boolean)
            : [];

    const handleSwitchChange = (label: string, checked: boolean) => {
        let valores = getValues();

        if (checked) {
            if (label === "otros") {
                valores.push("otros:");
            } else if (!valores.includes(label)) {
                valores.push(label);
            }
        } else {
            valores = valores.filter((v) =>
                label === "otros" ? !v.startsWith("otros") : v !== label
            );
        }

        onChange("lugarAtencionMedica", valores.join(","));
    };

    const handleOtrosChange = (text: string) => {
        const valores = getValues().filter((v) => !v.startsWith("otros"));
        onChange("lugarAtencionMedica", [...valores, `otros:${text}`].join(","));
    };

    const isChecked = (label: string) =>
        getValues().some((v) =>
            label === "otros" ? v.startsWith("otros") : v === label
        );

    const incluyeOtros = () =>
        getValues().some((v) => v.startsWith("otros"));

    const getOtrosTexto = () => {
        const item = getValues().find((v) => v.startsWith("otros:"));
        return item ? item.split(":")[1] || "" : "";
    };

    /* ================= SALUD ESTUDIANTE ================= */
    const [activo, setActivo] = useState(false);

    useEffect(() => {
        if (data.saludEstudiante) setActivo(true);
    }, [data.saludEstudiante]);

    const handleToggleEnfermedad = (checked: boolean) => {
        setActivo(checked);
        if (!checked) onChange("saludEstudiante", "");
    };

    /* ================= AYUDAS ================= */
    const getValuesAyudas = () =>
        data.ayudasTecnicas
            ? data.ayudasTecnicas.split(",").filter(Boolean)
            : [];

    const handleAyudasChange = (value: string, checked: boolean) => {
        let valores = getValuesAyudas();

        if (checked) {
            if (value === "otros") {
                valores.push("otros:");
            } else if (!valores.includes(value)) {
                valores.push(value);
            }
        } else {
            valores = valores.filter((v) =>
                value === "otros" ? !v.startsWith("otros") : v !== value
            );
        }

        onChange("ayudasTecnicas", valores.join(","));
    };

    const incluyeOtrosAyudas = () =>
        getValuesAyudas().some((v) => v.startsWith("otros"));

    const getOtrosTextoAyudas = () => {
        const item = getValuesAyudas().find((v) => v.startsWith("otros:"));
        return item ? item.split(":")[1] || "" : "";
    };

    const handleOtrosAyudasChange = (text: string) => {
        const valores = getValuesAyudas().filter((v) => !v.startsWith("otros"));
        onChange("ayudasTecnicas", [...valores, `otros:${text}`].join(","));
    };

    /* ================= RENDER ================= */

    return (
        <div className="space-y-4">
            <Label>Lugar de Atención Médica</Label>

            <div className="grid grid-cols-2 gap-2">
                {[
                    "Institución Pública",
                    "Institución Privada",
                    "Subcentro de Salud",
                    "Médico naturista",
                    "Hospital",
                    "Médico particular",
                    "Seguro Social",
                    "Seguro privado",
                    "Seguro campesino",
                    "Medicina casera",
                    "Se automedica",
                    "otros",
                ].map((label) => (
                    <Switch
                        key={label}
                        label={label === "otros" ? "Otros" : label}
                        checked={isChecked(label)}
                        onChange={(v) => handleSwitchChange(label, v)}
                    />
                ))}
            </div>

            {incluyeOtros() && (
                <div>
                    <Label>Especifique otros</Label>
                    <Input
                        value={getOtrosTexto()}
                        onChange={(e: any) => handleOtrosChange(e.target.value)}
                    />
                </div>
            )}

            {/* SALUD ESTUDIANTE */}
            <Label>Problemas de Salud del Estudiante</Label>

            <Switch
                label="Presenta problemas"
                checked={activo}
                onChange={handleToggleEnfermedad}
            />

            {activo && (
                <Input
                    value={data.saludEstudiante}
                    onChange={(e: any) =>
                        onChange("saludEstudiante", e.target.value)
                    }
                />
            )}

            {/* AYUDAS */}
            <Label>Ayudas Técnicas</Label>

            <div className="grid grid-cols-2 gap-2">
                {["audifonos", "lentes", "jaws", "silla", "otros"].map((a) => (
                    <Switch
                        key={a}
                        label={a}
                        checked={getValuesAyudas().includes(a)}
                        onChange={(v) => handleAyudasChange(a, v)}
                    />
                ))}
            </div>

            {incluyeOtrosAyudas() && (
                <Input
                    value={getOtrosTextoAyudas()}
                    onChange={(e: any) =>
                        handleOtrosAyudasChange(e.target.value)
                    }
                />
            )}

            {/* ================= FAMILIARES ================= */}
            <Label>Salud de Familiares</Label>
            {familiares.map((fam, index) => {
                const isOpen = openIndex === index;

                return (
                    <div
                        key={index}
                        className="rounded-2xl transition-all duration-300"
                    >
                        <div
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className={`flex justify-between items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-500
                            ${isOpen
                                    ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.01]"
                                    : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:border-gray-300"
                                }`}
                        >
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                                {fam.relacion} - {fam.nombresApellidos}
                            </h3>
                        </div>

                        {isOpen && (
                            <div className="mt-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-6 animate-in slide-in-from-top-2 duration-300">


                                {/* ================= PROBLEMA DE SALUD ================= */}
                                <div>
                                    <Switch
                                        label="Problema de salud"
                                        checked={fam.salud?.problema || false}
                                        onChange={(v) =>
                                            onChangeFamiliar(index, "problema", v)
                                        }
                                    />

                                    {fam.salud?.problema && (
                                        <div className="mt-2">
                                            <Label>Tipo de enfermedad</Label>
                                            <Input
                                                placeholder="Ej: diabetes, hipertensión..."
                                                value={fam.salud?.enfermedad || ""}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    onChangeFamiliar(index, "enfermedad", e.target.value)
                                                }
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* ================= ENFERMEDAD CATASTRÓFICA ================= */}
                                <div>
                                    <Switch
                                        label="Enfermedad catastrófica"
                                        checked={fam.salud?.catastrofica || false}
                                        onChange={(v) =>
                                            onChangeFamiliar(index, "catastrofica", v)
                                        }
                                    />

                                    {fam.salud?.catastrofica && (
                                        <div className="mt-2">
                                            <Label>Especifique enfermedad</Label>
                                            <Input
                                                placeholder="Ej: cáncer, insuficiencia renal..."
                                                value={fam.salud?.enfermedadCatastrofica || ""}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    onChangeFamiliar(
                                                        index,
                                                        "enfermedadCatastrofica",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* ================= DISCAPACIDAD ================= */}
                                <div>
                                    <Switch
                                        label="Discapacidad"
                                        checked={fam.salud?.discapacidad || false}
                                        onChange={(v) =>
                                            onChangeFamiliar(index, "discapacidad", v)
                                        }
                                    />

                                    {fam.salud?.discapacidad && (
                                        <div className="mt-2">

                                            <Input
                                                placeholder="Tipo discapacidad"
                                                value={fam.salud?.descripDiscapacidad?.split("|")[0]?.trim() || ""}
                                                onChange={(e: any) => {
                                                    const actual = fam.salud?.descripDiscapacidad || "";
                                                    const parts = actual.split("|");

                                                    const porcentaje = parts[1] || "";
                                                    const carnet = parts[2] || "";

                                                    const nueva = `${e.target.value} | ${porcentaje} | ${carnet}`;
                                                    onChangeFamiliar(index, "descripDiscapacidad", nueva);
                                                }}
                                            />

                                            <Input
                                                type="number"
                                                placeholder="Porcentaje"
                                                value={fam.salud?.descripDiscapacidad?.split("|")[1]?.replace("%", "").trim() || ""}
                                                onChange={(e: any) => {
                                                    const actual = fam.salud?.descripDiscapacidad || "";
                                                    const parts = actual.split("|");

                                                    const tipo = parts[0] || "";
                                                    const carnet = parts[2] || "";

                                                    const nueva = `${tipo} | ${e.target.value}% | ${carnet}`;
                                                    onChangeFamiliar(index, "descripDiscapacidad", nueva);
                                                }}
                                            />

                                            <Input
                                                placeholder="N° Carnet"
                                                value={fam.salud?.descripDiscapacidad?.split("|")[2]?.replace("Carnet:", "").trim() || ""}
                                                onChange={(e: any) => {
                                                    const actual = fam.salud?.descripDiscapacidad || "";
                                                    const parts = actual.split("|");

                                                    const tipo = parts[0] || "";
                                                    const porcentaje = parts[1] || "";

                                                    const nueva = `${tipo} | ${porcentaje} | Carnet: ${e.target.value}`;
                                                    onChangeFamiliar(index, "descripDiscapacidad", nueva);
                                                }}
                                            />

                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SaludForm;