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
    onValidate?: (isValid: boolean, errors: string[]) => void;
}

const validateRelacionFamiliar = (
    data: RelacionFamiliarProps["data"]
): string[] => {

    const errors: string[] = [];

    if (!data.resolucionConflictos?.trim()) {
        errors.push("Resolución de conflictos es requerida");
    }

    if (
        !data.cumplenReglas &&
        !data.quienesIncumplenReglas?.trim()
    ) {
        errors.push("Quiénes no cumplen las reglas es requerido");
    }

    if (!data.relacionHermanos?.trim()) {
        errors.push("Relación entre hermanos es requerida");
    }

    if (!data.relacionPadresHijos?.trim()) {
        errors.push("Relación entre padres e hijos es requerida");
    }

    if (!data.comunicacionFamiliar?.trim()) {
        errors.push("Comunicación familiar es requerida");
    }

    if (!data.tipoHogar?.trim()) {
        errors.push("Tipo de hogar es requerido");
    }

    return errors;
};

const RelacionFamiliar: React.FC<RelacionFamiliarProps> = ({
    data,
    onChange,
    onValidate,
}) => {

    const lastValidationRef = React.useRef("");

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

                <Switch
                    label="¿Se respeta la opinión de los miembros?"
                    checked={data.opinionfamiliar}
                    onChange={(checked) =>
                        onChange("opinionfamiliar", checked)
                    }
                />

                <Switch
                    label="¿La familia es unida ante problemas?"
                    checked={data.unionfamiliar}
                    onChange={(checked) =>
                        onChange("unionfamiliar", checked)
                    }
                />

                <div className="md:col-span-2">
                    <Label>¿Cómo resuelven conflictos?</Label>

                    <Input
                        value={data.resolucionConflictos}
                        onChange={(e: any) =>
                            onChange(
                                "resolucionConflictos",
                                e.target.value
                            )
                        }
                    />
                </div>

                <Switch
                    label="¿Cumplen las reglas del hogar?"
                    checked={data.cumplenReglas}
                    onChange={(checked) =>
                        onChange("cumplenReglas", checked)
                    }
                />

                {!data.cumplenReglas && (
                    <div className="md:col-span-2">

                        <Label>
                            ¿Quiénes no cumplen las reglas?
                        </Label>

                        <Input
                            value={data.quienesIncumplenReglas}
                            onChange={(e: any) =>
                                onChange(
                                    "quienesIncumplenReglas",
                                    e.target.value
                                )
                            }
                        />

                    </div>
                )}

                <Switch
                    label="¿Realizan actividades familiares?"
                    checked={data.tieneActividadesFamiliares}
                    onChange={(checked) =>
                        onChange(
                            "tieneActividadesFamiliares",
                            checked
                        )
                    }
                />

                {data.tieneActividadesFamiliares && (
                    <div className="md:col-span-2">

                        <Label>
                            ¿Qué actividades realizan?
                        </Label>

                        <Input
                            value={data.actividadesCompartidas}
                            onChange={(e: any) =>
                                onChange(
                                    "actividadesCompartidas",
                                    e.target.value
                                )
                            }
                        />

                    </div>
                )}

            </div>

        </div>
    );
};

export default RelacionFamiliar;