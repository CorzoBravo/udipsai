import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { toast } from "react-toastify";
import { fichasService } from "../../services";
import Button from "../ui/button/Button";
import { FileDown } from "lucide-react";

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

  useEffect(() => {
    if (isOpen && pacienteId) {
      cargarFicha();
    }
  }, [isOpen, pacienteId]);

  const cargarFicha = async () => {
    try {
      setLoading(true);

      const res =
        await fichasService.obtenerInformeSocial(
          pacienteId
        );

      setInforme(res);
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
          {/* GENERAL */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Información General
            </h4>

            <p>
              Número de ficha:{" "}
              {informe.numFicha || "N/A"}
            </p>

            <p>
              Elaborado por:{" "}
              {informe.elaboradoPor || "N/A"}
            </p>

            <p>
              Fecha elaboración:{" "}
              {informe.fechaElaboracion
                ? new Date(
                    informe.fechaElaboracion
                  ).toLocaleDateString("es-ES")
                : "N/A"}
            </p>
          </section>

          {/* PACIENTE */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Información del Paciente
            </h4>

            <p>
              Nombres y Apellidos:{" "}
              {informe.paciente
                ?.nombresApellidos || "N/A"}
            </p>

            <p>
              Cédula:{" "}
              {informe.paciente?.cedula || "N/A"}
            </p>

            <p>
              Correo:{" "}
              {informe.paciente?.email || "N/A"}
            </p>
          </section>

          {/* DINÁMICA FAMILIAR */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Dinámica Familiar
            </h4>

            <p>
              {informe.descripcionDinamicaFamiliar ||
                "N/A"}
            </p>
          </section>

          {/* SITUACIÓN ECONÓMICA */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Situación Económica
            </h4>

            <p>
              {informe.situacionEconomica ||
                "N/A"}
            </p>
          </section>

          {/* HABITABILIDAD */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Situación Habitabilidad
            </h4>

            <p>
              {informe.situacionHabitabilidad ||
                "N/A"}
            </p>
          </section>

          {/* LABORAL */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Situación Laboral
            </h4>

            <p>
              {informe.situacionLaboral ||
                "N/A"}
            </p>
          </section>

          {/* ENTORNO */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Situación del Entorno
            </h4>

            <p>
              {informe.situacionEntorno ||
                "N/A"}
            </p>
          </section>

          {/* EDUCACIÓN */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Situación Educativa y Cultural
            </h4>

            <p>
              {informe.situacionEducativoCultural ||
                "N/A"}
            </p>
          </section>

          {/* SALUD */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Situación de Salud
            </h4>

            <p>
              {informe.situacionSalud ||
                "N/A"}
            </p>
          </section>

          {/* LEGAL */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Situación Legal
            </h4>

            <p>
              {informe.situacionLegal ||
                "N/A"}
            </p>
          </section>

          {/* VALORACIÓN */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Valoración Profesional
            </h4>

            <p>
              {informe.valoracionProfesional ||
                "N/A"}
            </p>
          </section>

          {/* RECOMENDACIONES */}
          <section className="space-y-2">
            <h4 className="font-bold border-b pb-2">
              Recomendaciones
            </h4>

            <p>
              {informe.recomendaciones ||
                "N/A"}
            </p>
          </section>

          {/* FAMILIARES */}
          <section className="space-y-4">
            <h4 className="font-bold border-b pb-2">
              Familiares
            </h4>

            {informe.familiares &&
            informe.familiares.length > 0 ? (
              <div className="space-y-3">
                {informe.familiares.map(
                  (
                    familiar: any,
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4"
                    >
                      <p>
                        <strong>
                          Nombre:
                        </strong>{" "}
                        {familiar.nombres ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Parentesco:
                        </strong>{" "}
                        {familiar.parentesco ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Edad:
                        </strong>{" "}
                        {familiar.edad ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Ingresos:
                        </strong>{" "}
                        $
                        {familiar.ingresos ||
                          0}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p>
                No hay familiares
                registrados
              </p>
            )}
          </section>

          {/* IMÁGENES */}
          {(informe.genogramaUrl ||
            informe.ecomapaUrl) && (
            <section className="space-y-4">
              <h4 className="font-bold border-b pb-2">
                Documentos Gráficos
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {informe.genogramaUrl && (
                  <div>
                    <p className="mb-2 font-medium">
                      Genograma
                    </p>

                    <img
                      src={
                        informe.genogramaUrl
                      }
                      alt="Genograma"
                      className="w-full rounded-lg border"
                    />
                  </div>
                )}

                {informe.ecomapaUrl && (
                  <div>
                    <p className="mb-2 font-medium">
                      Ecomapa
                    </p>

                    <img
                      src={
                        informe.ecomapaUrl
                      }
                      alt="Ecomapa"
                      className="w-full rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </Modal>
  );
};

export default InformeSocialViewModal;