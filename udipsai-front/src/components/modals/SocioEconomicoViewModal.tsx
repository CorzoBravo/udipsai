import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { toast } from "react-toastify";
import { fichasService } from "../../services";
import { FichaSocioeconomicaState } from "../form/fichas-form/FormularioSocioEconomica";

interface SocioEconomicoProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
}

export const SocioEconomicoViewModal: React.FC<SocioEconomicoProps> = ({
  isOpen,
  onClose,
  pacienteId,
}) => {
  const [data, setData] = useState<FichaSocioeconomicaState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pacienteId) {
      cargarFicha();
    }
  }, [isOpen, pacienteId]);

  const cargarFicha = async () => {
    try {
      setLoading(true);

      // ⚠️ CAMBIA ESTE MÉTODO SI TIENES UNO POR PACIENTE
      const res = await fichasService.obtenerSocioEconomico(pacienteId);

      const mappedFamiliares = (res.familiares || []).map((f: any) => ({
        ...f,
        salud: {
          problema: f.problemas_salud || false,
          enfermedad: f.descripProblemasSaludFamiliar || "",
          catastrofica: f.enfermedad_catastrofica || false,
          enfermedadCatastrofica:
            f.descripEnfermedadCatastrofica || "",
          discapacidad: f.discapacidad || false,
          descripDiscapacidad: f.descripDiscapacidad || "",
        },
      }));

      const loadedData: FichaSocioeconomicaState = {
        ...res,
        riesgosFamiliares: res.riesgosSociales || {},
        vulnerabilidadesDetalle: res.vulnerabilidad || {},
        familiares: mappedFamiliares,
      };

      setData(loadedData);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar ficha socioeconómica");
    } finally {
      setLoading(false);
    }
  };

  const normalizarValor = (val?: string) => {
    if (!val) return "";

    const map: Record<string, string> = {
      MUY_BUENA: "Muy buena",
      BUENA: "Buena",
      REGULAR: "Regular",
      MALA: "Mala",
      HIJO_UNICO: "Hijo único",
      COMPLETO: "Completo",
      INCOMPLETO: "Incompleto",
      FUNCIONAL: "Funcional",
      DISFUNCIONAL: "Disfuncional",
    };

    return map[val] || val;
  };

  const renderOpciones = (
    valor: string | undefined,
    opciones: string[]
  ) => {
    const valorNormalizado = normalizarValor(valor);

    return (
      <div className="flex flex-wrap gap-4">
        {opciones.map((op) => (
          <span key={op}>
            ({valorNormalizado === op ? "X" : " "}) {op}
          </span>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1000px] p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Ficha Socioeconómica
          </h3>

          <p className="text-gray-500">
            Paciente ID: {pacienteId}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : !data ? (
        <p className="text-center text-gray-500">
          No existe ficha socioeconómica
        </p>
      ) : (
        <div className="space-y-8">

          {/* GENERAL */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Ficha Socioeconómica
            </h4>

            <p>
              Fecha de elaboración:{" "}
              {data.fechaElaboracion
                ? new Date(
                    data.fechaElaboracion
                  ).toLocaleDateString()
                : "N/A"}
            </p>

            <p>N° de ficha: {data.id ?? "N/A"}</p>

            <p>
              Especialista encargado:{" "}
              {data.especialista?.nombresApellidos ?? "N/A"}
            </p>
          </section>

          {/* PACIENTE */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Información del Paciente
            </h4>

            <p>
              Nombres y Apellidos:{" "}
              {data.paciente?.nombresApellidos ?? "N/A"}
            </p>

            <p>
              Fecha de Nacimiento:{" "}
              {data.paciente?.fechaNacimiento ?? "N/A"}
            </p>

            <p>Edad: {data.paciente?.edad ?? "N/A"}</p>

            <p>
              Lugar de nacimiento:{" "}
              {data.paciente?.lugarNacimiento ?? "N/A"}
            </p>

            <p>
              Cédula: {data.paciente?.cedula ?? "N/A"}
            </p>

            <p>
              Teléfono:{" "}
              {data.paciente?.numeroTelefono ?? "N/A"}
            </p>

            <p>
              Celular:{" "}
              {data.paciente?.numeroCelular ?? "N/A"}
            </p>

            <p>
              Domicilio:{" "}
              {data.paciente?.domicilio ?? "N/A"}
            </p>
          </section>

          {/* FAMILIARES */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              Conformación Familiar
            </h4>

            {data.familiares?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="p-2 text-left">Relación</th>
                      <th className="p-2 text-left">
                        Nombres y Apellidos
                      </th>
                      <th className="p-2 text-left">Edad</th>
                      <th className="p-2 text-left">
                        Estado Civil
                      </th>
                      <th className="p-2 text-left">
                        Instrucción
                      </th>
                      <th className="p-2 text-left">
                        Ocupación
                      </th>
                      <th className="p-2 text-left">
                        Ingreso Mensual
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.familiares.map((item, index) => (
                      <tr
                        key={index}
                        className="border-t"
                      >
                        <td className="p-2">
                          {item.relacion}
                        </td>

                        <td className="p-2">
                          {item.nombresApellidos}
                        </td>

                        <td className="p-2">
                          {item.edad}
                        </td>

                        <td className="p-2">
                          {item.estadocivil}
                        </td>

                        <td className="p-2">
                          {item.instruccion}
                        </td>

                        <td className="p-2">
                          {item.ocupacion}
                        </td>

                        <td className="p-2">
                          ${item.ingresoMensual}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No hay familiares registrados</p>
            )}
          </section>

          {/* RIESGOS */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Riesgos Familiares
            </h4>

            <p>
              Tabaquismo:{" "}
              {data.riesgosFamiliares?.tabaquismo
                ? "Sí"
                : "No"}
            </p>

            <p>
              Alcoholismo:{" "}
              {data.riesgosFamiliares?.alcoholismo
                ? "Sí"
                : "No"}
            </p>

            <p>
              Drogadicción:{" "}
              {data.riesgosFamiliares?.drogadiccion
                ? "Sí"
                : "No"}
            </p>

            <p>
              Violencia intrafamiliar:{" "}
              {data.riesgosFamiliares
                ?.violenciaIntrafamiliar
                ? "Sí"
                : "No"}
            </p>

            <p>
              Problemas sociales:{" "}
              {data.riesgosFamiliares
                ?.problemasSociales || "N/A"}
            </p>

            <p>
              Vulnerabilidades:{" "}
              {data.riesgosFamiliares
                ?.vulnerabilidades || "N/A"}
            </p>

            <p>
              Migración exterior:{" "}
              {data.riesgosFamiliares?.migroExterior
                ? "Sí"
                : "No"}
            </p>

            <p>
              Lugar migración:{" "}
              {data.riesgosFamiliares
                ?.lugarMigracion || "N/A"}
            </p>

            <p>
              Tiempo migración:{" "}
              {data.riesgosFamiliares
                ?.tiempoMigracion || "N/A"}
            </p>

            <p>
              Afectación familiar:{" "}
              {data.riesgosFamiliares
                ?.afectacionFamiliar || "N/A"}
            </p>
          </section>

          {/* VULNERABILIDAD */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              Situación de Vulnerabilidad
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Movilidad humana",
                  value:
                    data.vulnerabilidadesDetalle
                      ?.movilidadHumana,
                },
                {
                  label:
                    "Enfermedad catastrófica",
                  value:
                    data.vulnerabilidadesDetalle
                      ?.enfermedadCatastrofica,
                },
                {
                  label:
                    "Embarazo adolescente",
                  value:
                    data.vulnerabilidadesDetalle
                      ?.embarazoAdolescente,
                },
                {
                  label: "Abuso sexual",
                  value:
                    data.vulnerabilidadesDetalle
                      ?.abusoSexual,
                },
                {
                  label: "Agresión física",
                  value:
                    data.vulnerabilidadesDetalle
                      ?.agresionFisica,
                },
                {
                  label:
                    "Agresión psicológica",
                  value:
                    data.vulnerabilidadesDetalle
                      ?.agresionPsicologica,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 border border-gray-500 flex items-center justify-center">
                    {item.value && (
                      <div className="w-2 h-2 bg-black"></div>
                    )}
                  </div>

                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <p>
              Lugar agresión:{" "}
              {data.vulnerabilidadesDetalle
                ?.lugarAgresion || "N/A"}
            </p>
          </section>

          {/* DINÁMICA */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              Dinámica Familiar
            </h4>

            <p>
              Resolución conflictos:{" "}
              {data.dinamicaFamiliar
                ?.resolucionConflictos || "N/A"}
            </p>

            <p>
              Incumplen reglas:{" "}
              {data.dinamicaFamiliar
                ?.quienesIncumplenReglas || "N/A"}
            </p>

            <p>
              Actividades compartidas:{" "}
              {data.dinamicaFamiliar
                ?.actividadesCompartidas || "N/A"}
            </p>

            <div>
              <p className="font-medium">
                Relación hermanos:
              </p>

              {renderOpciones(
                data.dinamicaFamiliar
                  ?.relacionHermanos,
                [
                  "Muy buena",
                  "Buena",
                  "Regular",
                  "Mala",
                  "Hijo único",
                ]
              )}
            </div>

            <div>
              <p className="font-medium">
                Relación padres-hijos:
              </p>

              {renderOpciones(
                data.dinamicaFamiliar
                  ?.relacionPadresHijos,
                [
                  "Muy buena",
                  "Buena",
                  "Regular",
                  "Mala",
                ]
              )}
            </div>

            <div>
              <p className="font-medium">
                Comunicación familiar:
              </p>

              {renderOpciones(
                data.dinamicaFamiliar
                  ?.comunicacionFamiliar,
                [
                  "Muy buena",
                  "Buena",
                  "Regular",
                  "Mala",
                ]
              )}
            </div>
          </section>

          {/* VIVIENDA */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              Vivienda
            </h4>

            <p>
              Tipo tenencia:{" "}
              {data.vivienda?.tipoTenencia ||
                "N/A"}
            </p>

            <p>
              Material paredes:{" "}
              {data.vivienda?.materialParedes ||
                "N/A"}
            </p>

            <p>
              Material piso:{" "}
              {data.vivienda?.materialPiso ||
                "N/A"}
            </p>

            <p>
              Material techo:{" "}
              {data.vivienda?.materialTecho ||
                "N/A"}
            </p>

            <p>
              N° cuartos:{" "}
              {data.vivienda?.numeroCuartos ??
                "N/A"}
            </p>

            <p>
              N° dormitorios:{" "}
              {data.vivienda
                ?.numeroDormitorios ?? "N/A"}
            </p>

            <p>
              N° camas:{" "}
              {data.vivienda?.numeroCamas ??
                "N/A"}
            </p>

            <p>
              N° sanitarios:{" "}
              {data.vivienda
                ?.numeroSanitarios ?? "N/A"}
            </p>
          </section>

          {/* SALUD */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              Salud
            </h4>

            <p>
              Lugar atención médica:{" "}
              {data.salud?.lugarAtencionMedica ||
                "N/A"}
            </p>

            <p>
              Salud estudiante:{" "}
              {data.salud?.saludEstudiante ||
                "N/A"}
            </p>

            <p>
              Ayudas técnicas:{" "}
              {data.salud?.ayudasTecnicas ||
                "N/A"}
            </p>

            <div className="space-y-3">
              <h5 className="font-semibold">
                Salud Familiar
              </h5>

              {data.familiares?.map(
                (familiar, index) => (
                  <div
                    key={index}
                    className="border rounded p-3"
                  >
                    <p className="font-medium">
                      {familiar.nombresApellidos}
                    </p>

                    <p>
                      Problemas salud:{" "}
                      {familiar.salud?.problema
                        ? "Sí"
                        : "No"}
                    </p>

                    <p>
                      Enfermedad:{" "}
                      {familiar.salud
                        ?.enfermedad || "N/A"}
                    </p>

                    <p>
                      Enfermedad catastrófica:{" "}
                      {familiar.salud
                        ?.catastrofica
                        ? "Sí"
                        : "No"}
                    </p>

                    <p>
                      Descripción:{" "}
                      {familiar.salud
                        ?.enfermedadCatastrofica ||
                        "N/A"}
                    </p>

                    <p>
                      Discapacidad:{" "}
                      {familiar.salud
                        ?.discapacidad
                        ? "Sí"
                        : "No"}
                    </p>

                    <p>
                      Descripción discapacidad:{" "}
                      {familiar.salud
                        ?.descripDiscapacidad ||
                        "N/A"}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>

          {/* ECONOMÍA */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              Situación Económica
            </h4>

            <p>
              Total ingresos: $
              {data.situacionEconomica
                ?.totalIngresos ?? 0}
            </p>

            <p>
              Total egresos: $
              {data.situacionEconomica
                ?.totalEgresos ?? 0}
            </p>

            <p>
              Condición económica:{" "}
              {normalizarValor(
                data.situacionEconomica
                  ?.condicionEconomica
              )}
            </p>

            <p>
              Capacidad gasto evaluación:{" "}
              {data.situacionEconomica
                ?.capacidadGastoEvaluacion ||
                "N/A"}
            </p>

            <p>
              Actividades tiempo libre:{" "}
              {data.situacionEconomica
                ?.actividadesTiempoLibre ||
                "N/A"}
            </p>

            <div className="grid grid-cols-2 gap-4 border p-4 rounded">
              <div>
                Alimentación: $
                {data.desgloseEconomico
                  ?.egresoAlimentacion ?? 0}
              </div>

              <div>
                Arriendo: $
                {data.desgloseEconomico
                  ?.egresoArriendo ?? 0}
              </div>

              <div>
                Servicios básicos: $
                {data.desgloseEconomico
                  ?.egresoServiciosBasicos ?? 0}
              </div>

              <div>
                Salud: $
                {data.desgloseEconomico
                  ?.egresoSalud ?? 0}
              </div>

              <div>
                Educación: $
                {data.desgloseEconomico
                  ?.egresoEducacion ?? 0}
              </div>

              <div>
                Préstamos: $
                {data.desgloseEconomico
                  ?.egresoPrestamos ?? 0}
              </div>

              <div>
                Otros: $
                {data.desgloseEconomico
                  ?.egresoOtros ?? 0}
              </div>
            </div>
          </section>

          {/* CONCLUSIONES */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              Conclusiones y Recomendaciones
            </h4>

            <div>
              <p className="font-medium">
                Conclusiones:
              </p>

              <p>
                {data.conclusiones || "N/A"}
              </p>
            </div>

            <div>
              <p className="font-medium">
                Recomendaciones:
              </p>

              <p>
                {data.recomendaciones || "N/A"}
              </p>
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
};