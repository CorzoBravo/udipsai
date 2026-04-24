import React, { useEffect, useState } from "react";
import InputField from "../input/InputField";
import TextArea from "../input/TextArea";
import Label from "../Label"; 
import Button from "../../ui/button/Button";
import { toast } from "react-toastify";
import api from "../../../api/api";
import { fichasService } from "../../../services/fichas";
import { Target, Users, Activity, MessageSquare, MapPin, User, CheckCircle2 } from "lucide-react";

interface FormularioSeguimientoSocialProps {
  pacienteId: number;
  fichaId?: number; 
  onSuccess?: () => void;
}

const FormularioSeguimientoSocial: React.FC<FormularioSeguimientoSocialProps> = ({
  pacienteId,
  fichaId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // ESTADO LIMPIO: Solo los datos de texto para imprimir luego en el PDF
  const [formData, setFormData] = useState({
    pacienteId: pacienteId,
    areaAcompanamiento: "",
    numeroSeguimiento: 1,
    fecha: new Date().toISOString().split("T")[0],
    nombreVisitador: "",
    apellidoVisitador: "",
    direccionVisita: "",
    objetivo: "",
    participantes: "",
    actividades: "",
    observaciones: "",
    lugarFirma: "", 
    nombreRepresentante: "",
    rolEscuela: "",
    nombrePersonalEscuela: "",
    especificarOtro: "",
  });

  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        setFetching(true);
        if (fichaId) {
          const response = await api.get(`/api/seguimientos-sociales/${fichaId}`);
          const data = response.data;
          setFormData({
            ...data,
            pacienteId: data.pacienteId || pacienteId,
            fecha: data.fecha ? data.fecha.split("T")[0] : "",
          });
        } else {
          const todasLasFichas = await fichasService.listarSeguimientoSocial();
          const fichasDelPaciente = todasLasFichas.filter(
            (f: any) => (f.paciente?.id || f.pacienteId) === pacienteId
          );
          if (fichasDelPaciente.length > 0) {
            const maxSeguimiento = Math.max(...fichasDelPaciente.map((f: any) => f.numeroSeguimiento || 0));
            setFormData(prev => ({ ...prev, numeroSeguimiento: maxSeguimiento + 1 }));
          }
        }
      } catch (error) {
        console.error("Error inicializando:", error);
      } finally {
        setFetching(false);
      }
    };
    inicializarDatos();
  }, [fichaId, pacienteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "numeroSeguimiento" ? (value === "" ? 0 : parseInt(value)) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lugarFirma) {
      toast.warn("Debe seleccionar el lugar de la firma al final.");
      return;
    }
    setLoading(true);
    try {
      if (fichaId) {
        await fichasService.actualizarSeguimientoSocial(fichaId, formData);
        toast.success("Ficha actualizada");
      } else {
        await fichasService.crearSeguimientoSocial(formData);
        toast.success("Ficha guardada correctamente");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center animate-pulse text-brand-600">Cargando...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {fichaId ? "Editar" : "Nueva"} Ficha de Seguimiento Social
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <Label>Área de Acompañamiento</Label>
          <InputField name="areaAcompanamiento" value={formData.areaAcompanamiento} onChange={handleChange} placeholder="Ej. Trabajo Social" required />
        </div>
        <div className="space-y-1">
          <Label>Fecha de Visita</Label>
          <InputField type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
        </div>
        <div className="max-w-[140px] space-y-1">
          <Label>N° Seguimiento</Label>
          <InputField type="number" name="numeroSeguimiento" value={formData.numeroSeguimiento.toString()} readOnly hint="Auto" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest">
          <User size={14} /> Información del Visitador
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label>Nombres del Visitador</Label>
            <InputField name="nombreVisitador" value={formData.nombreVisitador} onChange={handleChange} placeholder="Ej. Nombres" required />
          </div>
          <div className="space-y-1">
            <Label>Apellidos del Visitador</Label>
            <InputField name="apellidoVisitador" value={formData.apellidoVisitador} onChange={handleChange} placeholder="Ej. Apellidos" required />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest">
          <MapPin size={14} /> Ubicación de la Visita
        </div>
        <div className="space-y-1">
          <Label>Dirección Completa / Institución</Label>
          <InputField name="direccionVisita" value={formData.direccionVisita} onChange={handleChange} placeholder="Calle, Sector o Nombre de la Institución" required />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Objetivo de la Intervención</Label>
          <TextArea name="objetivo" value={formData.objetivo} onChange={handleChange} placeholder="Propósito..." rows={2} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Personas Participantes</Label>
            <TextArea name="participantes" value={formData.participantes} onChange={handleChange} placeholder="Nombres..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Actividades Realizadas</Label>
            <TextArea name="actividades" value={formData.actividades} onChange={handleChange} placeholder="Detalles..." rows={3} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Observaciones Generales</Label>
          <TextArea name="observaciones" value={formData.observaciones} onChange={handleChange} placeholder="Notas..." rows={3} />
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-6">
        <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest">
          <CheckCircle2 size={14} /> Responsable para imprimir firma
        </div>

        <div className="flex flex-wrap gap-8 p-5 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/[0.05]">
          {["CASA", "ESCUELA", "OTRO"].map((opcion) => (
            <label key={opcion} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="radio" name="lugarFirma" value={opcion} checked={formData.lugarFirma === opcion} onChange={handleChange} className="w-4.5 h-4.5 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-brand-600 capitalize">{opcion.toLowerCase()}</span>
            </label>
          ))}
        </div>

        <div className="transition-all duration-300">
          {formData.lugarFirma === "CASA" && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
              <Label>Nombre del Representante / Familiar</Label>
              <InputField name="nombreRepresentante" value={formData.nombreRepresentante} onChange={handleChange} placeholder="Nombre completo para colocar debajo de la firma" required />
            </div>
          )}

          {formData.lugarFirma === "ESCUELA" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col space-y-1">
                <Label>Rol del Personal</Label>
                <select 
                  name="rolEscuela" 
                  value={formData.rolEscuela} 
                  onChange={handleChange} 
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white dark:bg-gray-900" 
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="DOCENTE">Docente</option>
                  <option value="DIRECTOR">Director/a</option>
                  <option value="PSICOLOGO">Psicólogo/a</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Nombre del Personal Identificado</Label>
                <InputField name="nombrePersonalEscuela" value={formData.nombrePersonalEscuela} onChange={handleChange} placeholder="Nombre completo para el PDF" required />
              </div>
            </div>
          )}

          {formData.lugarFirma === "OTRO" && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
              <Label>Especificar Lugar y Persona</Label>
              <InputField name="especificarOtro" value={formData.especificarOtro} onChange={handleChange} placeholder="Quién firma..." required />
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={loading}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar Ficha"}</Button>
      </div>
    </form>
  );
};

export default FormularioSeguimientoSocial;