import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { toast } from "react-toastify";
import { FileText, Calendar, Info, CheckCircle, Edit, ArrowLeft, Eye } from "lucide-react"; 
import { fichasService } from "../../services";
import FormularioSeguimientoSocial, { SeguimientoSocialState } from "../form/fichas-form/FormularioSeguimientoSocial";

// 1. Añadimos la propiedad 'modo' a la interfaz
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
  
  // 2. Estado para controlar si mostramos la lista o el formulario de edición
  const [fichaAEditar, setFichaAEditar] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && pacienteId) {
      cargarFichas();
      setFichaAEditar(null); // Resetea la vista al abrir el modal
    }
  }, [isOpen, pacienteId, modo]);

  const cargarFichas = async () => {
    try {
      setLoading(true);
      const res = await fichasService.obtenerSeguimientoSocial(pacienteId!);
      setSeguimientos(res);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar el historial de seguimiento social");
      setSeguimientos([]); 
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
      
      {/* ===== VISTA 1: FORMULARIO DE EDICIÓN ===== */}
      {/* Solo se muestra si hay una ficha seleccionada Y estamos en modo edición */}
      {fichaAEditar && modo === "editar" ? (
        <div className="bg-gray-50 dark:bg-gray-900 flex flex-col max-h-[85vh]">
          {/* Barra superior para regresar a la lista */}
          <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center shadow-sm z-10">
            <button 
              onClick={() => setFichaAEditar(null)}
              className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold transition-colors"
            >
              <ArrowLeft size={18} />
              Cancelar Edición y Volver a la Lista
            </button>
          </div>
          
          <div className="overflow-y-auto p-4">
            <FormularioSeguimientoSocial 
              pacienteId={pacienteId!} 
              fichaId={fichaAEditar} 
              onSuccess={() => {
                setFichaAEditar(null); 
                cargarFichas(); // Recarga la lista para mostrar los cambios
              }} 
            />
          </div>
        </div>
      ) : (
        /* ===== VISTA 2: LISTA DE HISTORIAL ===== */
        <>
          {/* Cabecera dinámica según el modo */}
          <div className={modo === "editar" ? "bg-blue-600 p-6 text-white" : "bg-brand-600 p-6 text-white"}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {modo === "editar" ? <Edit size={24} /> : <Eye size={24} />}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {modo === "editar" ? "Seleccionar Seguimiento para Editar" : "Historial de Seguimiento"}
                </h3>
                <p className="text-white/80 text-sm">
                  {modo === "editar" ? "Haga clic en 'Modificar' en la ficha que desea actualizar." : "Registros detallados de las visitas y acompañamientos."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-4 ${modo === 'editar' ? 'border-blue-200 border-t-blue-600' : 'border-brand-200 border-t-brand-600'}`}></div>
                <p className="text-gray-500">Cargando registros...</p>
              </div>
            ) : seguimientos.length > 0 ? (
              <div className="space-y-6">
                {seguimientos.map((seg, index) => (
                  <div key={seg.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden transition-colors ${modo === 'editar' ? 'border-blue-100 hover:border-blue-300' : 'border-gray-100'}`}>
                    
                    <div className={`px-4 py-3 border-b flex justify-between items-center flex-wrap gap-2 ${modo === 'editar' ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                      <div className={`flex items-center gap-2 font-bold ${modo === 'editar' ? 'text-blue-700' : 'text-brand-600'}`}>
                        <CheckCircle size={18} />
                        <span>Seguimiento N° {index + 1}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar size={14} />
                          {seg.fecha ? new Date(seg.fecha).toLocaleDateString() : 'Sin fecha'}
                        </div>
                        
                        {/* 3. CONDICIONAL: Solo muestra el botón si el modo es "editar" */}
                        {modo === "editar" && (
                          <button
                            onClick={() => setFichaAEditar(seg.id!)}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-semibold transition-colors shadow-sm"
                          >
                            <Edit size={14} />
                            Modificar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={`p-4 grid grid-cols-1 md:grid-cols-2 gap-6 ${modo === 'editar' ? 'opacity-75' : ''}`}>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Área de Acompañamiento</label>
                          <p className="text-gray-700 dark:text-gray-200 font-medium">{seg.areaAcompanamiento || "N/A"}</p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Objetivo</label>
                          <p className="text-gray-600 dark:text-gray-300 text-sm italic">
                            {seg.objetivo ? `"${seg.objetivo}"` : "Sin objetivo registrado"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Participantes</label>
                          <p className="text-gray-700 dark:text-gray-200 text-sm">{seg.participantes || "No especificados"}</p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Actividades</label>
                          <p className="text-gray-700 dark:text-gray-200 text-sm">{seg.actividades || "No especificadas"}</p>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <label className="flex items-center gap-2 text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">
                          <Info size={14} /> Observaciones
                        </label>
                        <p className="text-gray-700 text-sm">{seg.observaciones || "Sin observaciones adicionales"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No hay registros de seguimiento para este paciente.</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};