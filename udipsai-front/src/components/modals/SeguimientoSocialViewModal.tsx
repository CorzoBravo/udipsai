import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { toast } from "react-toastify";
import { FileText, Calendar, Info, CheckCircle, Edit, ArrowLeft, Eye } from "lucide-react"; 
import { fichasService } from "../../services";
import FormularioSeguimientoSocial, { SeguimientoSocialState } from "../form/fichas-form/FormularioSeguimientoSocial";

interface SeguimientoSocialViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number | null;
  modo: "ver" | "editar"; 
}

export const SeguimientoSocialViewModal: React.FC<SeguimientoSocialViewModalProps> = ({
  isOpen,
  onClose,
  pacienteId,
  modo,
}) => {
  const [seguimientos, setSeguimientos] = useState<SeguimientoSocialState[]>([]);
  const [loading, setLoading] = useState(false);
  const [fichaAEditar, setFichaAEditar] = useState<number | null>(null);

 
  useEffect(() => {
    if (isOpen && pacienteId) {
      cargarFichas();
    }
  
    if (!isOpen) {
      setFichaAEditar(null);
    }
  }, [isOpen, pacienteId, modo]);

  const cargarFichas = async () => {
    try {
      setLoading(true);
      const res = await fichasService.obtenerSeguimientoSocial(pacienteId!);
      setSeguimientos(res);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar el historial actualizado");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFichaAEditar(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[900px] p-0 overflow-hidden">
      
      {/* VISTA DE EDICIÓN */}
      {fichaAEditar && modo === "editar" ? (
        <div className="bg-gray-50 dark:bg-gray-900 flex flex-col max-h-[85vh]">
          <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center shadow-sm z-10">
            <button 
              onClick={() => setFichaAEditar(null)}
              className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold transition-colors"
            >
              <ArrowLeft size={18} />
              Volver al historial
            </button>
          </div>
          
          <div className="overflow-y-auto p-4">
            <FormularioSeguimientoSocial 
              pacienteId={pacienteId!} 
              fichaId={fichaAEditar} 
              onSuccess={() => {
                // CORRECCIÓN CLAVE:
                // 1. Quitamos la ficha seleccionada para volver a la lista
                setFichaAEditar(null); 
                // 2. Volvemos a pedir los datos al servidor para ver los cambios
                cargarFichas(); 
                toast.info("Historial actualizado");
              }} 
            />
          </div>
        </div>
      ) : (
        /* VISTA DE LISTA (HISTORIAL) */
        <>
          <div className={modo === "editar" ? "bg-blue-600 p-6 text-white" : "bg-brand-600 p-6 text-white"}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {modo === "editar" ? <Edit size={24} /> : <Eye size={24} />}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {modo === "editar" ? "Seleccionar para Editar" : "Historial de Seguimiento"}
                </h3>
                <p className="text-white/80 text-sm">Registros del sistema UDIPSAI</p>
              </div>
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Sincronizando datos...</p>
              </div>
            ) : seguimientos.length > 0 ? (
              <div className="space-y-6">
                {seguimientos.map((seg, index) => (
                  <div key={seg.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-700/30">
                      <div className="flex items-center gap-2 font-bold text-brand-600">
                        <CheckCircle size={18} />
                        <span>Seguimiento N° {index + 1}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Calendar size={14} />
                          {seg.fecha ? new Date(seg.fecha).toLocaleDateString() : 'S/F'}
                        </span>
                        
                        {modo === "editar" && (
                          <button
                            onClick={() => setFichaAEditar(seg.id!)}
                            className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-semibold transition-colors"
                          >
                            Modificar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Área:</p>
                        <p className="text-gray-700 dark:text-gray-200 mb-3">{seg.areaAcompanamiento}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Objetivo:</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm italic">"{seg.objetivo}"</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>No hay seguimientos registrados.</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
            <button onClick={handleCloseModal} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
              Cerrar
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};