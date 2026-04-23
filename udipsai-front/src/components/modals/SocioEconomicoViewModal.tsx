import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { FileDown } from "lucide-react";
import { toast } from "react-toastify";

import { SocioEconomicoService, FichaSocioeconomica } from "../../services/socioeconomico";
interface SocioEconomicoViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
}

export const SocioEconomicoViewModal: React.FC<SocioEconomicoViewModalProps> = ({
  isOpen,
  onClose,
  pacienteId,
}) => {
  const [data, setData] = useState<FichaSocioeconomica | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {

    if (isOpen && pacienteId) {
      cargarFicha();
    }
    console.log("Modal abierto:", isOpen);
    console.log("Paciente ID:", pacienteId);
  }, [isOpen, pacienteId]);

  const cargarFicha = async () => {
    try {
      setLoading(true);
      const res = await SocioEconomicoService.obtenerPorPaciente(pacienteId);
      setData(res);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar ficha socioeconómica");
    } finally {
      setLoading(false);
    }
  };
  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      toast.info("Generando PDF...");

      // Ajusta endpoint si existe en tu backend
      const blob = await fetch(
        `${import.meta.env.VITE_API_URL}/api/fichas-socioeconomicas/${pacienteId}/pdf`,
        {
          headers: {
            Authorization: localStorage.getItem("accessToken")
              ? `Bearer ${localStorage.getItem("accessToken")}`
              : "",
          },
        }
      ).then((res) => res.blob());

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ficha_socioeconomica_${pacienteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF generado");
    } catch (error) {
      console.error(error);
      toast.error("Error al generar PDF");
    } finally {
      setIsExporting(false);
    }
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

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPdf}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <FileDown size={16} />
          {isExporting ? "Generando..." : "Exportar PDF"}
        </Button>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : !data ? (
        <p className="text-center text-gray-500">
          No existe ficha socioeconómica
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* COLUMNA 1 */}
          <div className="space-y-4">
            <div>
              <label className="label">Situación Económica</label>
              <p className="value">{data.situacionEconomica || "N/A"}</p>
            </div>

            <div>
              <label className="label">Ingresos</label>
              <p className="value">{data.ingresos ?? "N/A"}</p>
            </div>

            <div>
              <label className="label">Egresos</label>
              <p className="value">{data.egresos ?? "N/A"}</p>
            </div>

            <div>
              <label className="label">Conclusión</label>
              <p className="value">{data.conclusion || "N/A"}</p>
            </div>

            <div>
              <label className="label">Recomendaciones</label>
              <p className="value">
                {data.recomendaciones || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
