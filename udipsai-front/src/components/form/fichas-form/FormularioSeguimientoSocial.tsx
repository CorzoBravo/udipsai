import React, { useEffect, useState } from "react";
import InputField from "../input/InputField";
import TextArea from "../input/TextArea";
import Button from "../../ui/button/Button";
import { toast } from "react-toastify";
import api from "../../../api/api";
import { fichasService } from "../../../services/fichas";
import { Calendar, User, Target, Users, Activity, MessageSquare } from "lucide-react";

interface FormularioSeguimientoSocialProps {
  pacienteId: number;
  fichaId?: number; // Opcional, si existe entra en modo edición
  onSuccess?: () => void;
}

const FormularioSeguimientoSocial: React.FC<FormularioSeguimientoSocialProps> = ({
  pacienteId,
  fichaId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Solución 1: Inicializar todos los campos con valores definidos (evita el error de uncontrolled input)
  const [formData, setFormData] = useState({
    pacienteId: pacienteId || 0,
    areaAcompanamiento: "",
    numeroSeguimiento: 1,
    objetivo: "",
    fecha: new Date().toISOString().split("T")[0],
    participantes: "",
    actividades: "",
    observaciones: "",
    firmaVisitadorUrl: "",
    firmaUsuarioUrl: "",
  });

  // 1. Cargar datos si estamos en modo edición
  useEffect(() => {
    if (fichaId) {
      const cargarDatosFicha = async () => {
        try {
          setFetching(true);
          const response = await api.get(`/api/seguimientos-sociales/${fichaId}`);
          const data = response.data;
          
          // Solución 2: Sanitizar los datos del API para que no entren nulos al estado
          setFormData({
            pacienteId: data.pacienteId || pacienteId,
            areaAcompanamiento: data.areaAcompanamiento || "",
            numeroSeguimiento: data.numeroSeguimiento || 1,
            objetivo: data.objetivo || "",
            fecha: data.fecha ? data.fecha.split("T")[0] : new Date().toISOString().split("T")[0],
            participantes: data.participantes || "",
            actividades: data.actividades || "",
            observaciones: data.observaciones || "",
            firmaVisitadorUrl: data.firmaVisitadorUrl || "",
            firmaUsuarioUrl: data.firmaUsuarioUrl || "",
          });
        } catch (error) {
          console.error("Error al cargar la ficha:", error);
          toast.error("No se pudieron cargar los datos de la ficha");
        } finally {
          setFetching(false);
        }
      };
      cargarDatosFicha();
    }
  }, [fichaId, pacienteId]);

  // Solución 3: Asegurar que el valor del input nunca sea undefined al escribir
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value === undefined || value === null ? "" : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (fichaId) {
        // Actualizar ficha existente
        await fichasService.actualizarSeguimientoSocial(fichaId, formData);
        toast.success("Ficha de seguimiento actualizada correctamente");
      } else {
        // Crear nueva ficha
        await fichasService.crearSeguimientoSocial(formData);
        toast.success("Ficha de seguimiento guardada exitosamente");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al procesar la ficha:", error);
      toast.error("Hubo un error al guardar la información");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
    >
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {fichaId ? "Editar" : "Nueva"} Ficha de Seguimiento Social
        </h2>
        <p className="text-gray-500 text-sm">Complete los detalles del acompañamiento realizado.</p>
      </div>

      {/* Fila 1: Área, Número y Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative">
          <InputField
            label="Área de Acompañamiento"
            name="areaAcompanamiento"
            value={formData.areaAcompanamiento}
            onChange={handleChange}
            placeholder="Ej. Trabajo Social"
            required
          />
        </div>
        <InputField
          type="number"
          label="N° de Seguimiento"
          name="numeroSeguimiento"
          value={formData.numeroSeguimiento.toString()}
          onChange={handleChange}
          required
        />
        <InputField
          type="date"
          label="Fecha"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
      </div>

      {/* Objetivo */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-600 font-medium text-sm mb-1">
          <Target size={16} /> Objetivo
        </div>
        <TextArea
          name="objetivo"
          value={formData.objetivo}
          onChange={handleChange}
          placeholder="Escriba el objetivo del seguimiento..."
          rows={2}
        />
      </div>

      {/* Participantes y Actividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-600 font-medium text-sm mb-1">
            <Users size={16} /> Participantes
          </div>
          <TextArea
            name="participantes"
            value={formData.participantes}
            onChange={handleChange}
            placeholder="Nombres de las personas presentes..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-600 font-medium text-sm mb-1">
            <Activity size={16} /> Actividades Realizadas
          </div>
          <TextArea
            name="actividades"
            value={formData.actividades}
            onChange={handleChange}
            placeholder="Describa las acciones tomadas..."
            rows={3}
          />
        </div>
      </div>

      {/* Observaciones */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-brand-600 font-medium text-sm mb-1">
          <MessageSquare size={16} /> Observaciones Generales
        </div>
        <TextArea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Detalles adicionales o notas importantes..."
          rows={3}
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : fichaId ? "Actualizar Ficha" : "Guardar Ficha"}
        </Button>
      </div>
    </form>
  );
};

export default FormularioSeguimientoSocial;