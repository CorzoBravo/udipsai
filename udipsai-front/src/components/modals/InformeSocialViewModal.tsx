import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { toast } from "react-toastify";
import { fichasService, pacientesService } from "../../services";
import Button from "../ui/button/Button";
import { FileDown, FileText } from "lucide-react";

interface InformeSocialViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
}

export const InformeSocialViewModal: React.FC<
  InformeSocialViewModalProps
> = ({ isOpen, onClose, pacienteId }) => {
  const [informe, setInforme] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [genogramaPreview, setGenogramaPreview] = useState<string | null>(null);
  const [ecomapaPreview, setEcomapaPreview] = useState<string | null>(null);
  const [pacienteFull, setPacienteFull] = useState<any>(null);

  useEffect(() => {
    if (isOpen && pacienteId) {
      cargarFicha();
    }
  }, [isOpen, pacienteId]);

  const cargarFicha = async () => {
    try {
      setLoading(true);
      setGenogramaPreview(null);
      setEcomapaPreview(null);
      setPacienteFull(null);

      const res =
        await fichasService.obtenerInformeSocial(
          pacienteId
        );

      setInforme(res);

      if (res?.paciente?.id) {
        try {
          const patientDetails = await pacientesService.obtenerPorId(res.paciente.id);
          setPacienteFull(patientDetails);
        } catch (e) {
          console.error("Error loading patient details:", e);
        }
      }

      if (res?.genogramaUrl) {
        try {
          const gUrl = await fichasService.obtenerGenogramaInformeSocial(pacienteId);
          setGenogramaPreview(gUrl);
        } catch (e) {
          console.error("Error loading genograma:", e);
        }
      }

      if (res?.ecomapaUrl) {
        try {
          const eUrl = await fichasService.obtenerEcomapaInformeSocial(pacienteId);
          setEcomapaPreview(eUrl);
        } catch (e) {
          console.error("Error loading ecomapa:", e);
        }
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Error al cargar informe social"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);

      toast.info("Generando PDF...");

      const blob =
        await fichasService.exportarPdfInformeSocial(
          pacienteId
        );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `informe_social_${pacienteId}.pdf`
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        "PDF descargado correctamente"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Error al exportar PDF"
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[1000px] p-6"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Informe Social
          </h3>

          <p className="text-gray-500">
            Paciente ID: {pacienteId}
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="mt-3 flex items-center gap-2"
          >
            <FileDown size={16} />

            {isExporting
              ? "Generando..."
              : "Reporte PDF"}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">
          Cargando...
        </p>
      ) : !informe ? (
        <p className="text-center text-gray-500">
          No existe informe social
        </p>
      ) : (
        <div className="space-y-8">
          {/* GENERAL INFO & PATIENT INFO COMBINED AS IN THE PDF HEADER */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              Datos Generales del Informe y del Paciente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Nombres y Apellidos:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{informe.paciente?.nombresApellidos || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Lugar y Fecha de Nacimiento:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {pacienteFull?.lugarNacimiento || "—"} / {pacienteFull?.fechaNacimiento || "—"}
                </span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Edad:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {pacienteFull?.fechaNacimiento
                    ? `${new Date().getFullYear() - new Date(pacienteFull.fechaNacimiento).getFullYear()} años`
                    : "—"}
                </span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Cédula / Pasaporte:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{informe.paciente?.cedula || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Estado Civil:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{pacienteFull?.estadoCivil || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Nacionalidad:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{pacienteFull?.nacionalidad || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Sexo:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{pacienteFull?.sexo || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Tipo de Discapacidad:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {pacienteFull?.tieneDiscapacidad ? pacienteFull.tipoDiscapacidad : "Ninguna"}
                </span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Porcentaje de Discapacidad:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {pacienteFull?.tieneDiscapacidad && pacienteFull.porcentajeDiscapacidad !== undefined
                    ? `${pacienteFull.porcentajeDiscapacidad}%`
                    : "—"}
                </span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Institución Educativa:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{pacienteFull?.institucionEducativa?.nombre || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Nivel Educativo:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{pacienteFull?.nivelEducativo || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Año que Cursa:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{pacienteFull?.anioEducacion || "—"}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Lugar de Residencia:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{pacienteFull?.domicilio || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">N° de Ficha:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{informe.numFicha || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Fecha de Elaboración:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {informe.fechaElaboracion
                    ? new Date(informe.fechaElaboracion).toLocaleDateString("es-ES")
                    : "—"}
                </span>
              </div>
            </div>
          </section>

          {/* INFORMANT INFO */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              Datos del Informante y su Relación con el Paciente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Persona que Proporciona la Información:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{informe.informanteNombre || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Parentesco:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{informe.informanteParentesco || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Cédula / Pasaporte:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{informe.informanteCedula || "—"}</span>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Teléfono:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{informe.informanteTelefono || "—"}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400">Correo Electrónico:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{informe.informanteCorreo || "—"}</span>
              </div>
            </div>
          </section>

          {/* 1. DATOS DE IDENTIFICACIÓN */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              1. DATOS DE IDENTIFICACIÓN
            </h4>
            {informe.familiares && informe.familiares.length > 0 ? (
              <div className="overflow-x-auto border rounded-xl dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-white/[0.02]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase dark:text-gray-400">Nombres</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase dark:text-gray-400">Parentesco</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase dark:text-gray-400">Estado Civil</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase dark:text-gray-400">Edad</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase dark:text-gray-400">Ingresos</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase dark:text-gray-400">Instrucción</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase dark:text-gray-400">Ocupación</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase dark:text-gray-400">Cédula</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase dark:text-gray-400">Teléfono</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase dark:text-gray-400">Correo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
                    {informe.familiares.map((familiar: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{familiar.nombres || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{familiar.parentesco || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{familiar.estadoCivil || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{familiar.edad || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{familiar.ingresos !== undefined ? `$${familiar.ingresos}` : "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{familiar.instruccion || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{familiar.ocupacion || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{familiar.cedula || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{familiar.telefono || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{familiar.correo || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay familiares registrados</p>
            )}
          </section>

          {/* 2. CONFORMACIÓN FAMILIAR */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              2. CONFORMACIÓN FAMILIAR
            </h4>
            <div className="space-y-4">
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400 mb-1">Tipo de Familia:</span>
                <div className="flex flex-wrap gap-2">
                  {["Nuclear", "Extensa", "Monoparental", "Otros"].map((tipo) => (
                    <span
                      key={tipo}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${informe.tipoFamilia === tipo
                          ? "bg-brand-50 border-brand-300 text-brand-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                          : "bg-gray-50 border-gray-200 text-gray-400 dark:bg-white/[0.01] dark:border-gray-800 dark:text-gray-600"
                        }`}
                    >
                      {tipo} {tipo === "Otros" && informe.tipoFamiliaEspecificar ? `(${informe.tipoFamiliaEspecificar})` : ""}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold block text-sm text-gray-500 dark:text-gray-400 mb-1">Descripción de la Dinámica Familiar:</span>
                <p className="text-gray-950 dark:text-gray-50 whitespace-pre-wrap leading-relaxed">{informe.descripcionDinamicaFamiliar || "—"}</p>
              </div>
            </div>
          </section>

          {/* 3. GENOGRAMA */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              3. GENOGRAMA
            </h4>
            <div className="space-y-2">
              {genogramaPreview ? (
                <div className="max-w-xl mx-auto">
                  {informe.genogramaUrl?.toLowerCase().endsWith(".pdf") ? (
                    <div className="flex flex-col items-center gap-2 py-6 border rounded-lg bg-gray-50 dark:bg-white/5">
                      <FileText size={32} className="text-red-500" />
                      <span className="text-xs text-gray-500">Documento PDF</span>
                      <a
                        href={genogramaPreview}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-600 hover:underline mt-1 font-medium"
                      >
                        Abrir / Descargar PDF
                      </a>
                    </div>
                  ) : (
                    <img
                      src={genogramaPreview}
                      alt="Genograma"
                      className="w-full rounded-lg border shadow-sm max-h-[300px] object-contain"
                    />
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No se ha cargado genograma</p>
              )}
            </div>
          </section>

          {/* 4. SITUACIÓN ECONÓMICA */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              4. SITUACIÓN ECONÓMICA
            </h4>
            <p className="text-gray-955 dark:text-gray-50 whitespace-pre-wrap leading-relaxed">
              {informe.situacionEconomica || "—"}
            </p>
          </section>

          {/* 5. SITUACIÓN DE HABITABILIDAD O VIVIENDA */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              5. SITUACIÓN DE HABITABILIDAD O VIVIENDA
            </h4>
            <p className="text-gray-955 dark:text-gray-50 whitespace-pre-wrap leading-relaxed">
              {informe.situacionHabitabilidad || "—"}
            </p>
          </section>

          {/* 6. SITUACIÓN LABORAL */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              6. SITUACIÓN LABORAL
            </h4>
            <p className="text-gray-955 dark:text-gray-50 whitespace-pre-wrap leading-relaxed">
              {informe.situacionLaboral || "—"}
            </p>
          </section>

          {/* 7. SITUACIÓN SOCIAL: RELACIÓN CON EL ENTORNO */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              7. SITUACIÓN SOCIAL: RELACIÓN CON EL ENTORNO
            </h4>
            <p className="text-gray-955 dark:text-gray-50 whitespace-pre-wrap leading-relaxed">
              {informe.situacionEntorno || "—"}
            </p>
          </section>

          {/* 8. SITUACIÓN EDUCATIVO – CULTURAL */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              8. SITUACIÓN EDUCATIVO – CULTURAL
            </h4>
            <p className="text-gray-955 dark:text-gray-50 whitespace-pre-wrap leading-relaxed">
              {informe.situacionEducativoCultural || "—"}
            </p>
          </section>

          {/* 9. SITUACIÓN DE SALUD FISICA Y PSICOLOGICA */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              9. SITUACIÓN DE SALUD FISICA Y PSICOLOGICA
            </h4>
            <p className="text-gray-955 dark:text-gray-50 whitespace-pre-wrap leading-relaxed">
              {informe.situacionSalud || "—"}
            </p>
          </section>

          {/* 10. SITUACIÓN LEGAL */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              10. SITUACIÓN LEGAL (en caso de existir)
            </h4>
            <p className="text-gray-955 dark:text-gray-50 whitespace-pre-wrap leading-relaxed">
              {informe.situacionLegal || "—"}
            </p>
          </section>

          {/* 11. ECOMAPA */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              11. ECOMAPA
            </h4>
            <div className="space-y-2">
              {ecomapaPreview ? (
                <div className="max-w-xl mx-auto">
                  {informe.ecomapaUrl?.toLowerCase().endsWith(".pdf") ? (
                    <div className="flex flex-col items-center gap-2 py-6 border rounded-lg bg-gray-50 dark:bg-white/5">
                      <FileText size={32} className="text-red-500" />
                      <span className="text-xs text-gray-500">Documento PDF</span>
                      <a
                        href={ecomapaPreview}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-600 hover:underline mt-1 font-medium"
                      >
                        Abrir / Descargar PDF
                      </a>
                    </div>
                  ) : (
                    <img
                      src={ecomapaPreview}
                      alt="Ecomapa"
                      className="w-full rounded-lg border shadow-sm max-h-[300px] object-contain"
                    />
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No se ha cargado ecomapa</p>
              )}
            </div>
          </section>

          {/* 12. VALORACIÓN PROFESIONAL */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              12. VALORACIÓN PROFESIONAL
            </h4>
            <p className="text-gray-955 dark:text-gray-50 whitespace-pre-wrap leading-relaxed">
              {informe.valoracionProfesional || "—"}
            </p>
          </section>

          {/* 13. RECOMENDACIONES */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              13. RECOMENDACIONES
            </h4>
            <p className="text-gray-955 dark:text-gray-50 whitespace-pre-wrap leading-relaxed">
              {informe.recomendaciones || "—"}
            </p>
          </section>

          {/* 14. PROFESIONALES RESPONSABLES */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2 text-lg text-gray-800 dark:text-gray-100">
              14. PROFESIONALES RESPONSABLES
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="border rounded-xl p-4 text-center bg-gray-50/50 dark:bg-white/[0.01]">
                <span className="font-semibold block text-xs uppercase text-gray-500 dark:text-gray-400 mb-6">Elaborado Por</span>
                <span className="text-gray-900 dark:text-gray-100 font-bold border-t pt-2 block max-w-[200px] mx-auto border-gray-300 dark:border-gray-700">
                  {informe.elaboradoPor || "Profesional de Trabajo Social"}
                </span>
                <span className="text-xs text-gray-500 block mt-1">Especialista / Pasante</span>
              </div>
              <div className="border rounded-xl p-4 text-center bg-gray-50/50 dark:bg-white/[0.01]">
                <span className="font-semibold block text-xs uppercase text-gray-500 dark:text-gray-400 mb-6">Profesional Responsable</span>
                <span className="text-gray-900 dark:text-gray-100 font-bold border-t pt-2 block max-w-[200px] mx-auto border-gray-300 dark:border-gray-700">
                  Lcda. Gabriela Jara S., Mgs.
                </span>
                <span className="text-xs text-gray-500 block mt-1 font-semibold uppercase">Coordinadora de la UDIPSAI</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
};

export default InformeSocialViewModal;