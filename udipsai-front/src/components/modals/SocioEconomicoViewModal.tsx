import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { toast } from "react-toastify";
import { FichaSocioeconomicaState } from "../form/fichas-form/FormularioSocioEconomica";
import { fichasService } from "../../services";
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
      const res = await fichasService.obtenerSocioEconomico(pacienteId);
      setData(res);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar ficha socioeconómica");
    } finally {
      setLoading(false);
    }
  };
  // Función para exportar a PDF

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

  const renderOpciones = (valor: string | undefined, opciones: string[]) => {
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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-6">

      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Ficha Socioeconómica
          </h3>
          <p className="text-gray-500">Paciente ID: {pacienteId}</p>
        </div>
        {/* Exportar PDF */}
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : !data ? (
        <p className="text-center text-gray-500">
          No existe ficha socioeconómica
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6">

          {/* Ficha General */}
          <div className="space-y-4">
            <h4 className="font-bold border-b pb-2">Ficha Socio Economica</h4>
            <p>Fecha de generacion: {data.fechaElaboracion ? new Date(data.fechaElaboracion).toLocaleDateString() : "N/A"}</p>
            <p>N° de ficha: {data.id ?? "N/A"}</p>
            <p>Especialista encargado: {data.especialista?.nombresApellidos ?? "N/A"}</p>
          </div>

          {/* Información del Paciente */}
          <div className="space-y-4">
            <h4 className="font-bold border-b pb-2">Información del Paciente</h4>
            <p>Nombres y Apellidos: {data.paciente?.nombresApellidos ?? "N/A"}</p>
            <p>Fecha de Nacimiento: {data.paciente?.fechaNacimiento || "N/A"}</p>
            <p>Edad: {data.paciente?.edad ?? "N/A"}</p>
            <p>Lugar de nacimiento: {data.paciente?.lugarNacimiento ?? "N/A"}</p>
            <p>Cédula: {data.paciente?.cedula ?? "N/A"}</p>
          </div>

          {/* Conformación Familiar */}
          <div className="space-y-4">
            <h4 className="font-bold border-b pb-2">Conformación Familiar</h4>

            {data.familiares?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-gray-700">

                  {/* HEADER */}
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="p-2 text-left">Relación</th>
                      <th className="p-2 text-left">Nombre y Apellidos</th>
                      <th className="p-2 text-left">Edad</th>
                      <th className="p-2 text-left">Estado Civil</th>
                      <th className="p-2 text-left">Ocupación</th>
                      <th className="p-2 text-left">Parentesco</th>
                      <th className="p-2 text-left">Ingresos Mensuales</th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody>
                    {data.familiares.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{item.relacion}</td>
                        <td className="p-2">{item.nombresApellidos}</td>
                        <td className="p-2">{item.edad}</td>
                        <td className="p-2">{item.estadocivil}</td>
                        <td className="p-2">{item.ocupacion}</td>
                        <td className="p-2">{item.parentesco}</td>
                        <td className="p-2">{item.ingresoMensual}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos familiares</p>
            )}
          </div>

          {/* Problemas familiares */}
          <div className="space-y-4">
            <h4 className="font-bold border-b pb-2">Situación Económica</h4>
            <p>¿Algún miembro de la familia migró al exterior? {data.riesgosFamiliares?.migroExterior ? "Sí" : "No"}</p>
            <p>Lugar: {data.riesgosFamiliares?.lugarMigracion ?? "N/A"}</p>
            <p>Años de Migración: {data.riesgosFamiliares?.tiempoMigracion ?? "N/A"}</p>
            <p>Afectación Familiar: {data.riesgosFamiliares?.afectacionFamiliar ?? "N/A"}</p>
          </div>

          {/*Situacion de vulnerabilidad */}
          <div className="space-y-4">
            <h4 className="font-bold border-b pb-2">Situación de Vulnerabilidad</h4>
            <div className="grid grid-cols-2 gap-4">

              {[
                { label: "Movilidad humana", value: data.vulnerabilidadesDetalle?.movilidadHumana },
                { label: "Enfermedades catastróficas", value: data.vulnerabilidadesDetalle?.enfermedadCatastrofica },
                { label: "Embarazo adolescente", value: data.vulnerabilidadesDetalle?.embarazoAdolescente },
                { label: "Abuso sexual", value: data.vulnerabilidadesDetalle?.abusoSexual },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">

                  <div className={`w-4 h-4 border border-gray-500 flex items-center justify-center`}>
                    {item.value && <div className="w-2 h-2 bg-black"></div>}
                  </div>

                  <span>{item.label}</span>
                </div>
              ))}

            </div>
          </div>

          {/* Dinámica Familiar */}
          <div className="space-y-4">
            <h4 className="font-bold border-b pb-2">Relacion Familiar</h4>
            <p>En caso de conflictos familiares, ¿cómo los resuelven? {data.dinamicaFamiliar?.resolucionConflictos ?? "N/A"}</p>
            <p>¿Quiénes no cumplen con las reglas? {data.dinamicaFamiliar?.quienesIncumplenReglas ?? "N/A"}</p>
            <p>Actividades Compartidas: {data.dinamicaFamiliar?.actividadesCompartidas ?? "N/A"}</p>
            <div>
              <p className="font-medium">
                Relación entre hermanos:
              </p>
              {renderOpciones(
                data.dinamicaFamiliar?.relacionHermanos,
                ["Muy buena", "Buena", "Regular", "Mala", "Hijo único"]
              )}
            </div>
            <div>
              <p className="font-medium">
                Relación padres-hijos:
              </p>
              {renderOpciones(
                data.dinamicaFamiliar?.relacionPadresHijos,
                ["Muy buena", "Buena", "Regular", "Mala"]
              )}
            </div>
            <div>
              <p className="font-medium">
                Comunicación familiar:
              </p>
              {renderOpciones(
                data.dinamicaFamiliar?.comunicacionFamiliar,
                ["Muy buena", "Buena", "Regular", "Mala"]
              )}
            </div>
            <div>
              <p className="font-medium">Tipo de Hogar:</p>
              {renderOpciones(
                data.dinamicaFamiliar?.tipoHogar,
                ["Completo", "Incompleto", "Funcional", "Disfuncional"]
              )}
            </div>
          </div>

          {/* CONDICIONES DE VIVIENDA */}
          <div className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              Condiciones de Vivienda / Habitabilidad
            </h4>

            {/* Tipo de Tenencia */}
            <div>
              <p className="font-medium">Tipo de vivienda:</p>
              {renderOpciones(data.vivienda?.tipoTenencia, [
                "Propia",
                "Arrendada",
                "Prestada",
                "Por servicios",
                "Hipoteca",
                "Otros",
              ])}
            </div>

            {/* Materiales */}
            <div>
              <p className="font-medium">Material de paredes:</p>
              {renderOpciones(data.vivienda?.materialParedes, [
                "Adobe",
                "Ladrillo",
                "Bloque",
                "Madera",
                "Bahareque",
                "Otros",
              ])}
            </div>

            <div>
              <p className="font-medium">Material del piso:</p>
              {renderOpciones(data.vivienda?.materialPiso, [
                "Baldosa",
                "Cemento",
                "Madera",
                "Tierra",
                "Árdex",
                "Otros",
              ])}
            </div>

            <div>
              <p className="font-medium">Material del techo:</p>
              {renderOpciones(data.vivienda?.materialTecho, [
                "Zinc",
                "Teja",
                "Eternit",
                "Loza",
                "Otros",
              ])}
            </div>

            {/* DATOS NUMÉRICOS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border p-4 rounded">
              <div>
                <label className="text-sm text-gray-500">N° Cuartos</label>
                <p className="font-medium">{data.vivienda?.numeroCuartos ?? "N/A"}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">N° Dormitorios</label>
                <p className="font-medium">{data.vivienda?.numeroDormitorios ?? "N/A"}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">N° Camas</label>
                <p className="font-medium">{data.vivienda?.numeroCamas ?? "N/A"}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">N° SS.HH</label>
                <p className="font-medium">{data.vivienda?.numeroSanitarios ?? "N/A"}</p>
              </div>
            </div>

            {/* AGUA */}
            <div>
              <p className="font-medium">Agua:</p>
              {renderOpciones(data.vivienda?.procedenciaAgua, [
                "Potable",
                "Entubada",
                "Acequia",
                "Otros",
              ])}
            </div>

            {/* SERVICIO SANITARIO */}
            <div>
              <p className="font-medium">Servicio Sanitario:</p>
              {renderOpciones(data.vivienda?.tipoSanitario, [
                "SS.HH",
                "Letrina",
                "Pozo séptico",
                "Aire libre",
                "Otros",
              ])}
            </div>

            {/* ELECTRICIDAD */}
            <div>
              <p className="font-medium">Energía eléctrica:</p>
              {renderOpciones(data.vivienda?.detalleElectricidad, [
                "Sí",
                "No",
                "Otros",
              ])}
            </div>
          </div>
          {/* Salud */}
          <div className="space-y-4">
            <h4 className="font-bold border-b pb-2">Salud</h4>

            <div>
              <p className="font-medium">Lugar de atención médica:</p>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <p className="font-semibold">Institución Pública</p>
                <p className="font-semibold">Institución Privada</p>
              </div>

              <div className="space-y-2">
                {[
                  ["Subcentro de Salud", "Médico naturista"],
                  ["Hospital", "Médico particular"],
                  ["Seguro Social", "Seguro privado"],
                  ["Seguro Campesino", "Medicina casera"],
                  ["Otros", "Se auto medica"],
                ].map(([izq, der]) => (
                  <div key={izq} className="grid grid-cols-2 gap-4">
                    <span>
                      ({data.salud?.lugarAtencionMedica === izq ? "X" : " "}) {izq}
                    </span>
                    <span>
                      ({data.salud?.lugarAtencionMedica === der ? "X" : " "}) {der}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p>
              Salud del estudiante: {data.salud?.saludEstudiante ?? "N/A"}
            </p>
            <p>
              Ayudas técnicas: {data.salud?.ayudasTecnicas ?? "N/A"}
            </p>
            <p>
              Problemas de salud familiares:{" "}
              {data.salud?.problemasSaludFamiliares ?? "N/A"}
            </p>
            <p>
              Enfermedades catastróficas familiares:{" "}
              {data.salud?.enfermedadesCatastroficas ?? "N/A"}
            </p>
            <p>
              Discapacidad en familiares:{" "}
              {data.salud?.discapacidadFamiliares ?? "N/A"}
            </p>
          </div>
          {/* Tiempo libre y actividades */}
          <div className="space-y-3">
            <h4 className="font-bold border-b pb-2">
              9. Uso del tiempo libre
            </h4>

            {/* Opciones */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Deporte",
                "Música",
                "TV",
                "Internet",
                "Paseos familiares",
                "Amigos/as",
                "Trabajo infantil",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-500 flex items-center justify-center">
                    {data.situacionEconomica?.actividadesTiempoLibre
                      ?.split(",")
                      .map((v) => v.trim())
                      .includes(item) && (
                        <div className="w-2 h-2 bg-black"></div>
                      )}
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Especificar trabajo infantil */}
            <div>
              <p>
                <span className="font-medium">Especifique (Trabajo infantil):</span>{" "}
                {data.situacionEconomica?.actividadesTiempoLibre?.includes("Trabajo infantil")
                  ? data.situacionEconomica.actividadesTiempoLibre
                    .split(",")
                    .find((v) => v.trim().startsWith("Trabajo infantil:"))
                    ?.split(":")[1]
                    .trim() ?? "N/A"
                  :
                  "________________________________________"}
              </p>
            </div>

            {/* Otros */}
            <div>
              <p>
                <span className="font-medium">Otros:</span>{" "}
                {data.situacionEconomica && !data.situacionEconomica.actividadesTiempoLibre?.includes("Trabajo infantil")
                  ? data.situacionEconomica.actividadesTiempoLibre
                    .split(",")
                    .filter(
                      (v) =>
                        ![
                          "Deporte",
                          "Música",
                          "TV",
                          "Internet",
                          "Paseos familiares",
                          "Amigos/as",
                          "Trabajo infantil",
                        ].includes(v.trim())
                    )
                    .join(", ")
                    .trim() || "N/A"
                  :
                  "________________________________________"}
              </p>
            </div>
          </div>
          {/* Situacion Financiera */}
          <div className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              10. Situación Económica
            </h4>

            {/* TABLA */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Ingresos Mensuales</th>
                    <th className="p-2 text-left">Egresos Mensuales</th>
                    <th className="p-2 text-left">Condición Económica</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="p-2">Padre: {data.desgloseEconomico?.ingresoPadre ?? 0}</td>
                    <td className="p-2">Alimentación: {data.desgloseEconomico?.egresoAlimentacion ?? 0}</td>
                    <td className="p-2">
                      ({data.situacionEconomica.condicionEconomica === "MUY_BUENA" ? "X" : " "}) Muy buena
                    </td>
                  </tr>

                  <tr className="border-t">
                    <td className="p-2">Madre: {data.desgloseEconomico?.ingresoMadre ?? 0}</td>
                    <td className="p-2">Arriendo: {data.desgloseEconomico?.egresoArriendo ?? 0}</td>
                    <td className="p-2">
                      ({data.situacionEconomica.condicionEconomica === "BUENA" ? "X" : " "}) Buena
                    </td>
                  </tr>

                  <tr className="border-t">
                    <td className="p-2">Familiares: {data.desgloseEconomico?.ingresoFamiliares ?? 0}</td>
                    <td className="p-2">Servicios básicos: {data.desgloseEconomico?.egresoServiciosBasicos ?? 0}</td>
                    <td className="p-2">
                      ({data.situacionEconomica.condicionEconomica === "REGULAR" ? "X" : " "}) Regular
                    </td>
                  </tr>

                  <tr className="border-t">
                    <td className="p-2">Otros: {data.desgloseEconomico?.ingresoOtros ?? 0}</td>
                    <td className="p-2">Salud: {data.desgloseEconomico?.egresoSalud ?? 0}</td>
                    <td className="p-2">
                      ({data.situacionEconomica.condicionEconomica === "MALA" ? "X" : " "}) Mala
                    </td>
                  </tr>

                  <tr className="border-t">
                    <td className="p-2"></td>
                    <td className="p-2">Educación: {data.desgloseEconomico?.egresoEducacion ?? 0}</td>
                    <td></td>
                  </tr>

                  <tr className="border-t">
                    <td className="p-2"></td>
                    <td className="p-2">Préstamos: {data.desgloseEconomico?.egresoPrestamos ?? 0}</td>
                    <td></td>
                  </tr>

                  <tr className="border-t">
                    <td className="p-2"></td>
                    <td className="p-2">Otros: {data.desgloseEconomico?.egresoOtros ?? 0}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* TOTALES */}
            <div className="grid grid-cols-2 gap-4 border p-4 rounded">
              <div>
                <p className="text-sm text-gray-500">Total Ingresos</p>
                <p className="font-bold">
                  {(
                    (data.desgloseEconomico?.ingresoPadre ?? 0) +
                    (data.desgloseEconomico?.ingresoMadre ?? 0) +
                    (data.desgloseEconomico?.ingresoFamiliares ?? 0) +
                    (data.desgloseEconomico?.ingresoOtros ?? 0)
                  ).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Egresos</p>
                <p className="font-bold">
                  {(
                    (data.desgloseEconomico?.egresoAlimentacion ?? 0) +
                    (data.desgloseEconomico?.egresoArriendo ?? 0) +
                    (data.desgloseEconomico?.egresoServiciosBasicos ?? 0) +
                    (data.desgloseEconomico?.egresoSalud ?? 0) +
                    (data.desgloseEconomico?.egresoEducacion ?? 0) +
                    (data.desgloseEconomico?.egresoPrestamos ?? 0) +
                    (data.desgloseEconomico?.egresoOtros ?? 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Conclusiones y Recomendaciones */}
          <div className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              Conclusiones y Recomendaciones
            </h4>
            <div>
              <p className="font-medium">Conclusiones:</p>
              <p>{data.conclusiones ?? "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Recomendaciones:</p>
              <p>{data.recomendaciones ?? "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
