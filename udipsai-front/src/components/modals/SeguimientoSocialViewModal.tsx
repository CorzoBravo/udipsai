import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { toast } from "react-toastify";
import api from "../../api/api";
import { FileText, Calendar, User, MapPin, Info, CheckCircle2, CheckCircle } from "lucide-react"; 
import Badge from "../ui/badge/Badge";

interface SeguimientoSocialViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number | null;
}

export const SeguimientoSocialViewModal: React.FC<SeguimientoSocialViewModalProps> = ({
  isOpen,
  onClose,
  pacienteId,
}) => {
  const [seguimientos, setSeguimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pacienteId) {
      const cargarSeguimientos = async () => {
        try {
          setLoading(true);
          // Usamos el endpoint que creamos en el back para listar por paciente
          const response = await api.get(`/api/seguimientos-sociales/paciente/${pacienteId}`);
          setSeguimientos(response.data);
        } catch (error) {
          console.error("Error al cargar seguimientos:", error);
          toast.error("No se pudieron cargar los seguimientos sociales");
        } finally {
          setLoading(false);
        }
      };
      cargarSeguimientos();
    }
  }, [isOpen, pacienteId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] p-0 overflow-hidden">
      {/* Cabecera del Modal */}
      <div className="bg-brand-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Historial de Seguimiento Social</h3>
            <p className="text-brand-100 text-sm">Registros detallados de las visitas y acompañamientos</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Cargando registros...</p>
          </div>
        ) : seguimientos.length > 0 ? (
          <div className="space-y-6">
            {seguimientos.map((seg, index) => (
              <div key={seg.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Header del Registro */}
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold">
                    <CheckCircle size={18} />
                    <span>Seguimiento N° {seg.numeroSeguimiento}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={14} />
                    {new Date(seg.fecha).toLocaleDateString()}
                  </div>
                </div>

                {/* Contenido del Registro */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Área de Acompañamiento</label>
                      <p className="text-gray-700 dark:text-gray-200 font-medium">{seg.areaAcompanamiento}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Objetivo</label>
                      <p className="text-gray-600 dark:text-gray-300 text-sm italic">"{seg.objetivo}"</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Participantes</label>
                      <p className="text-gray-700 dark:text-gray-200 text-sm">{seg.participantes}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Actividades</label>
                      <p className="text-gray-700 dark:text-gray-200 text-sm">{seg.actividades}</p>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                    <label className="flex items-center gap-2 text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-1">
                      <Info size={14} /> Observaciones
                    </label>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{seg.observaciones}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No hay registros de seguimiento para este paciente.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end bg-white dark:bg-gray-900">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};