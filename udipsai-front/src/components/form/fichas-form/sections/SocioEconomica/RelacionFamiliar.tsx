import React from "react";
import Label from "../../../Label";
import Input from "../../../input/InputField";
import Switch from "../../../switch/Switch";

interface RelacionFamiliarProps {
    data: {
        opinionfamiliar: boolean;
        unionfamiliar: boolean;
        resolucionConflictos: string;

        cumplenReglas: boolean;
        quienesIncumplenReglas: string;

        tieneActividadesFamiliares: boolean;
        actividadesCompartidas: string;

        relacionHermanos: string;
        relacionPadresHijos: string;
        comunicacionFamiliar: string;
        tipoHogar: string;
    };
    onChange: (field: string, value: any) => void;
}

const RelacionFamiliar: React.FC<RelacionFamiliarProps> = ({ data, onChange }) => {
    const opcionesRelacion = [
        { value: "muyBuena", label: "Muy buena" },
        { value: "buena", label: "Buena" },
        { value: "regular", label: "Regular" },
        { value: "mala", label: "Mala" },
    ];

    const opcionesHermanos = [
        ...opcionesRelacion,
        { value: "hijoUnico", label: "Hijo único" },
    ];
    return (
        <div className="space-y-6">

            <Label>Relación Familiar</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Opinión */}
                <Switch
                    label="¿Se respeta la opinión de los miembros?"
                    checked={data.opinionfamiliar}
                    onChange={(checked) => onChange("opinionfamiliar", checked)}
                />

                {/* Unión */}
                <Switch
                    label="¿La familia es unida ante problemas?"
                    checked={data.unionfamiliar}
                    onChange={(checked) => onChange("unionfamiliar", checked)}
                />

                {/* Conflictos */}
                <div className="md:col-span-2">
                    <Label>¿Cómo resuelven conflictos?</Label>
                    <Input
                        value={data.resolucionConflictos}
                        onChange={(e: any) =>
                            onChange("resolucionConflictos", e.target.value)
                        }
                    />
                </div>

                {/* Cumplen reglas */}
                <Switch
                    label="¿Cumplen las reglas del hogar?"
                    checked={data.cumplenReglas}
                    onChange={(checked) => onChange("cumplenReglas", checked)}
                />

                {/* Quiénes no cumplen */}
                {!data.cumplenReglas && (
                    <div className="md:col-span-2">
                        <Label>¿Quiénes no cumplen las reglas?</Label>
                        <Input
                            value={data.quienesIncumplenReglas}
                            onChange={(e: any) =>
                                onChange("quienesIncumplenReglas", e.target.value)
                            }
                        />
                    </div>
                )}

                {/* Actividades familiares */}
                <Switch
                    label="¿Realizan actividades familiares?"
                    checked={data.tieneActividadesFamiliares}
                    onChange={(checked) =>
                        onChange("tieneActividadesFamiliares", checked)
                    }
                />

                {/* Input condicional */}
                {data.tieneActividadesFamiliares && (
                    <div className="md:col-span-2">
                        <Label>¿Qué actividades realizan?</Label>
                        <Input
                            value={data.actividadesCompartidas}
                            onChange={(e: any) =>
                                onChange("actividadesCompartidas", e.target.value)
                            }
                        />
                    </div>
                )}

            </div>
            <div className="md:col-span-2">
                <Label>5.7. Las relaciones entre los/las hermanos/as es:</Label>

                <div className="flex flex-wrap gap-4 mt-2">
                    {opcionesHermanos.map((op) => (
                        <label key={op.value} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="relacionHermanos"
                                value={op.value}
                                checked={data.relacionHermanos === op.value}
                                onChange={(e) =>
                                    onChange("relacionHermanos", e.target.value)
                                }
                            />
                            {op.label}
                        </label>
                    ))}
                </div>
            </div>
            <div className="md:col-span-2">
                <Label>5.8. Las relaciones entre padres e hijos/as es:</Label>

                <div className="flex flex-wrap gap-4 mt-2">
                    {opcionesRelacion.map((op) => (
                        <label key={op.value} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="relacionPadresHijos"
                                value={op.value}
                                checked={data.relacionPadresHijos === op.value}
                                onChange={(e) =>
                                    onChange("relacionPadresHijos", e.target.value)
                                }
                            />
                            {op.label}
                        </label>
                    ))}
                </div>
            </div>
            <div className="md:col-span-2">
                <Label>5.9. La comunicación entre los miembros de la familia es:</Label>

                <div className="flex flex-wrap gap-4 mt-2">
                    {opcionesRelacion.map((op) => (
                        <label key={op.value} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="comunicacionFamiliar"
                                value={op.value}
                                checked={data.comunicacionFamiliar === op.value}
                                onChange={(e) =>
                                    onChange("comunicacionFamiliar", e.target.value)
                                }
                            />
                            {op.label}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelacionFamiliar;