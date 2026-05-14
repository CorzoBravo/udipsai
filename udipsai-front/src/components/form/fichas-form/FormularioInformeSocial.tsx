import { useState, useEffect, useCallback } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { MessageSquare, User } from "lucide-react";
import { pacientesService, especialistasService, pasantesService } from "../../../services";
import PatientSelector from "../../common/PatientSelector";
import { useAuth } from "../../../context/AuthContext.tsx";


// Secciones
import DinamicaFamiliarForm from "./sections/InformeSocial/DinamicaFamiliarForm";
import SituacionEconomicaInformeForm from "./sections/InformeSocial/SituacionEconomicaForm";
import SituacionHabitabilidadForm from "./sections/InformeSocial/SituacionHabitabilidadForm";
import SituacionLaboralForm from "./sections/InformeSocial/SituacionLaboralForm";
import SituacionEntornoForm from "./sections/InformeSocial/SituacionEntornoForm";
import SituacionEducativoCulturalForm from "./sections/InformeSocial/SituacionEducativoCulturalForm";
import SituacionSaludForm from "./sections/InformeSocial/SituacionSaludForm";
import SituacionLegalForm from "./sections/InformeSocial/SituacionLegalForm";
import ValoracionProfesionalForm from "./sections/InformeSocial/ValoracionProfesionalForm";
import RecomendacionesForm from "./sections/InformeSocial/RecomendacionesForm";
import FamiliaresForm from "./sections/InformeSocial/FamiliaresForm";
import GenogramaEcomapaForm from "./sections/InformeSocial/GenogramaEcomapaForm";

import { informeSocialService } from "../../../services/informeSocial";
import Label from "../Label.tsx";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

interface FamiliarItem {
  id?: number;
  nombres: string;
  parentesco: string;
  edad?: number;
  estadoCivil?: string;
  instruccion?: string;
  ocupacion?: string;
  ingresos?: number;
}

export interface InformeSocialState {
  id?: number;
  paciente: {
    id: number;
    nombresApellidos: string;
    cedula: string;
    fechaNacimiento?: string;
    edad?: number;
  };

  especialista: {
    id: number;
    nombresApellidos: string;
  };

  numFicha: string;
  fechaElaboracion: string;

  descripcionDinamicaFamiliar: string;
  situacionEconomica: string;
  situacionHabitabilidad: string;
  situacionLaboral: string;
  situacionEntorno: string;
  situacionEducativoCultural: string;
  situacionSalud: string;
  situacionLegal: string;
  valoracionProfesional: string;
  recomendaciones: string;
  elaboradoPor: string;

  familiares: FamiliarItem[];

  genogramFile?: File | null;
  ecomapFile?: File | null;
  genogramaUrl?: string;
  ecomapaUrl?: string;
}

const getFechaActual = (): string => {
  const today = new Date();
  return today.toISOString();
};

export const initialInformeSocialState: InformeSocialState = {
  paciente: {
    id: 0,
    nombresApellidos: "",
    cedula: "",
  },
  especialista: {
    id: 0,
    nombresApellidos: "",
  },
  numFicha: "",
  fechaElaboracion: getFechaActual(),
  descripcionDinamicaFamiliar: "",
  situacionEconomica: "",
  situacionHabitabilidad: "",
  situacionLaboral: "",
  situacionEntorno: "",
  situacionEducativoCultural: "",
  situacionSalud: "",
  situacionLegal: "",
  valoracionProfesional: "",
  recomendaciones: "",
  elaboradoPor: "",
  familiares: [],
};

export default function FormularioInformeSocial() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { userIdentity, userRole } = useAuth();

  const [formData, setFormData] = useState<InformeSocialState>(
    initialInformeSocialState
  );

  const [loading, setLoading] = useState(false);
  const [especialistaLoading, setEspecialistaLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: number;
    nombresApellidos: string;
    cedula: string;
  } | null>(null);

  const [secciones, setSecciones] = useState({
    dinamicaFamiliar: false,
    situacionEconomica: false,
    situacionHabitabilidad: false,
    situacionLaboral: false,
    situacionEntorno: false,
    situacionEducativoCultural: false,
    situacionSalud: false,
    situacionLegal: false,
    valoracionProfesional: false,
    recomendaciones: false,
    familiares: false,
    genogramaEcomapa: false,
  });

  const [validaciones, setValidaciones] = useState<Record<string, boolean>>({
    dinamicaFamiliar: false,
    situacionEconomica: false,
    situacionHabitabilidad: false,
    situacionLaboral: false,
    situacionEntorno: false,
    situacionEducativoCultural: false,
    situacionSalud: false,
    situacionLegal: false,
    valoracionProfesional: false,
    recomendaciones: false,
    familiares: false,
  });

  const isEdit = !!id;

  // Cargar especialista
  useEffect(() => {
    const loadEspecialista = async () => {
      if (!userIdentity || !userRole) {
        setEspecialistaLoading(false);
        return;
      }

      try {
        setEspecialistaLoading(true);
        let especialistaData = null;

        if (userRole === "ROLE_ESPECIALISTA") {
          const result = await especialistasService.filtrar({ search: userIdentity });
          especialistaData = result?.content?.[0];
        } else if (userRole === "ROLE_PASANTE") {
          const result = await pasantesService.filtrar({ search: userIdentity });
          especialistaData = result?.content?.[0];
        }

        if (especialistaData?.id) {
          setFormData((prev) => ({
            ...prev,
            especialista: {
              id: especialistaData.id,
              nombresApellidos: especialistaData.nombresApellidos,
            },
            elaboradoPor: especialistaData.nombresApellidos,
          }));
        }
      } catch (error) {
        console.error("Error al cargar especialista:", error);
        toast.error("Error al cargar la información del especialista.");
      } finally {
        setEspecialistaLoading(false);
      }
    };

    loadEspecialista();
  }, [userIdentity, userRole]);

  // Cargar informe si es edición
  useEffect(() => {
    if (isEdit && id) {
      loadInforme(id);
    } else {
      setShowSelector(true);
    }
  }, [id, isEdit]);

  const loadInforme = async (informeId: string) => {
    try {
      setLoading(true);
      const data = await informeSocialService.obtenerPorId(informeId);

      if (data) {
        setFormData((prev) => ({
          ...prev,
          ...data,
          especialista: prev.especialista,
          paciente: data.paciente || prev.paciente,
        }));

        // Marcar secciones como abiertas si tienen datos
        setSecciones({
          dinamicaFamiliar: !!data.descripcionDinamicaFamiliar,
          situacionEconomica: !!data.situacionEconomica,
          situacionHabitabilidad: !!data.situacionHabitabilidad,
          situacionLaboral: !!data.situacionLaboral,
          situacionEntorno: !!data.situacionEntorno,
          situacionEducativoCultural: !!data.situacionEducativoCultural,
          situacionSalud: !!data.situacionSalud,
          situacionLegal: !!data.situacionLegal,
          valoracionProfesional: !!data.valoracionProfesional,
          recomendaciones: !!data.recomendaciones,
          familiares: data.familiares?.length > 0,
          genogramaEcomapa: !!data.genogramaUrl || !!data.ecomapaUrl,
        });

        if (data.paciente) {
          try {
            const paciente = await pacientesService.obtenerPorId(data.paciente.id);
            setSelectedPatient(paciente);
          } catch (error) {
            console.warn("Error cargando paciente:", error);
          }
        }
      } else {
        toast.error("No se encontró el informe social.");
        navigate("/fichas");
      }
    } catch (error) {
      console.error("Error al cargar informe:", error);
      toast.error("Error al cargar el informe. Intente de nuevo.");
      navigate("/fichas");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient: any) => {
    setFormData((prev) => ({
      ...prev,
      paciente: {
        id: patient.id,
        nombresApellidos: patient.nombresApellidos,
        cedula: patient.cedula,
      },
    }));
    setSelectedPatient(patient);
    setShowSelector(false);
  };

  const handleSubmit = async () => {
    if (!formData.paciente?.id || formData.paciente.id <= 0) {
      toast.error("Debe seleccionar un paciente válido");
      return;
    }

    if (!formData.especialista?.id || formData.especialista.id <= 0) {
      toast.error("No se pudo obtener el especialista válido");
      return;
    }

    if (!formData.recomendaciones || formData.recomendaciones.trim() === "") {
      toast.error("Las recomendaciones son requeridas");
      return;
    }

    if (!formData.valoracionProfesional || formData.valoracionProfesional.trim() === "") {
      toast.error("La valoración profesional es requerida");
      return;
    }

    try {
      setLoading(true);

      const formDataMultipart = new FormData();

      const informeRequest = {
        pacienteId: formData.paciente.id,
        numFicha: formData.numFicha,
        descripcionDinamicaFamiliar: formData.descripcionDinamicaFamiliar,
        situacionEconomica: formData.situacionEconomica,
        situacionHabitabilidad: formData.situacionHabitabilidad,
        situacionLaboral: formData.situacionLaboral,
        situacionEntorno: formData.situacionEntorno,
        situacionEducativoCultural: formData.situacionEducativoCultural,
        situacionSalud: formData.situacionSalud,
        situacionLegal: formData.situacionLegal,
        valoracionProfesional: formData.valoracionProfesional,
        recomendaciones: formData.recomendaciones,
        elaboradoPor: formData.elaboradoPor,
        familiares: formData.familiares.map((f) => ({
          nombres: f.nombres,
          parentesco: f.parentesco,
          edad: f.edad,
          estadoCivil: f.estadoCivil,
          instruccion: f.instruccion,
          ocupacion: f.ocupacion,
          ingresos: f.ingresos,
        })),
      };

      formDataMultipart.append("informe", JSON.stringify(informeRequest));

      if (formData.genogramFile) {
        formDataMultipart.append("genograma", formData.genogramFile);
      }

      if (formData.ecomapFile) {
        formDataMultipart.append("ecomapa", formData.ecomapFile);
      }

      if (isEdit && formData.id) {
        await informeSocialService.actualizar(formData.id, formDataMultipart);
        toast.success("Informe actualizado exitosamente");
      } else {
        await informeSocialService.crear(formDataMultipart);
        toast.success("Informe creado exitosamente");
      }

      navigate("/fichas");
    } catch (error: any) {
      console.error("Error saving informe:", error);
      toast.error(isEdit ? "Error al actualizar el informe" : "Error al crear el informe");
    } finally {
      setLoading(false);
    }
  };

  if (showSelector) {
    return (
      <div className="space-y-6">
        <PatientSelector onSelect={handlePatientSelect} />
      </div>
    );
  }
  const SectionHeader = ({
    title,
    description,
    icon,
    isOpen,
    onToggle,
  }: SectionHeaderProps) => {
    return (
      <div
        onClick={onToggle}
        className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${isOpen
          ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
          : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
          }`}
      >
        <div className="flex items-center gap-5">
          <div
            className={`p-4 rounded-2xl transition-all duration-500 ${isOpen
              ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
              : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
              }`}
          >
            {icon}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h3>

            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-6">
      {/* Banner paciente */}
      {selectedPatient && (
        <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-3xl flex items-center justify-between border-2 border-brand-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-400 dark:bg-gray-500 rounded-full text-white font-bold">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {selectedPatient.nombresApellidos}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Cédula: {selectedPatient.cedula}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSelector(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Cambiar
          </button>
        </div>
      )}

      {/* Número de Ficha */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Número de Ficha
        </label>
        <input
          type="text"
          value={formData.numFicha}
          onChange={(e) => setFormData({ ...formData, numFicha: e.target.value })}
          placeholder="Ej: INF-001"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* DINÁMICA FAMILIAR */}
      <SectionHeader
        title="Dinámica Familiar"
        description="Descripción de la dinámica familiar"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.dinamicaFamiliar}
        onToggle={() =>
          setSecciones({
            ...secciones,
            dinamicaFamiliar: !secciones.dinamicaFamiliar,
          })
        }
      />
      {secciones.dinamicaFamiliar && (
        <ComponentCard title="Dinámica Familiar">
          <DinamicaFamiliarForm
            data={formData.descripcionDinamicaFamiliar}
            onChange={(value) =>
              setFormData({ ...formData, descripcionDinamicaFamiliar: value })
            }
            onValidate={(isValid) =>
              setValidaciones({ ...validaciones, dinamicaFamiliar: isValid })
            }
          />
        </ComponentCard>
      )}

      {/* SITUACIÓN ECONÓMICA */}
      <SectionHeader
        title="Situación Económica"
        description="Información sobre la situación económica"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.situacionEconomica}
        onToggle={() =>
          setSecciones({
            ...secciones,
            situacionEconomica: !secciones.situacionEconomica,
          })
        }
      />
      {secciones.situacionEconomica && (
        <ComponentCard title="Situación Económica">
          <SituacionEconomicaInformeForm
            data={formData.situacionEconomica}
            onChange={(value) =>
              setFormData({ ...formData, situacionEconomica: value })
            }
            onValidate={(isValid) =>
              setValidaciones({ ...validaciones, situacionEconomica: isValid })
            }
          />
        </ComponentCard>
      )}

      {/* SITUACIÓN HABITABILIDAD */}
      <SectionHeader
        title="Habitabilidad"
        description="Condiciones de habitabilidad"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.situacionHabitabilidad}
        onToggle={() =>
          setSecciones({
            ...secciones,
            situacionHabitabilidad: !secciones.situacionHabitabilidad,
          })
        }
      />
      {secciones.situacionHabitabilidad && (
        <ComponentCard title="Situación de Habitabilidad">
          <SituacionHabitabilidadForm
            data={formData.situacionHabitabilidad}
            onChange={(value) =>
              setFormData({ ...formData, situacionHabitabilidad: value })
            }
            onValidate={(isValid) =>
              setValidaciones({ ...validaciones, situacionHabitabilidad: isValid })
            }
          />
        </ComponentCard>
      )}

      {/* SITUACIÓN LABORAL */}
      <SectionHeader
        title="Situación Laboral"
        description="Información laboral"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.situacionLaboral}
        onToggle={() =>
          setSecciones({
            ...secciones,
            situacionLaboral: !secciones.situacionLaboral,
          })
        }
      />
      {secciones.situacionLaboral && (
        <ComponentCard title="Situación Laboral">
          <SituacionLaboralForm
            data={formData.situacionLaboral}
            onChange={(value) =>
              setFormData({ ...formData, situacionLaboral: value })
            }
            onValidate={(isValid) =>
              setValidaciones({ ...validaciones, situacionLaboral: isValid })
            }
          />
        </ComponentCard>
      )}

      {/* SITUACIÓN ENTORNO */}
      <SectionHeader
        title="Entorno Social"
        description="Información del entorno social"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.situacionEntorno}
        onToggle={() =>
          setSecciones({
            ...secciones,
            situacionEntorno: !secciones.situacionEntorno,
          })
        }
      />
      {secciones.situacionEntorno && (
        <ComponentCard title="Situación del Entorno">
          <SituacionEntornoForm
            data={formData.situacionEntorno}
            onChange={(value) =>
              setFormData({ ...formData, situacionEntorno: value })
            }
            onValidate={(isValid) =>
              setValidaciones({ ...validaciones, situacionEntorno: isValid })
            }
          />
        </ComponentCard>
      )}

      {/* SITUACIÓN EDUCATIVO CULTURAL */}
      <SectionHeader
        title="Educativo y Cultural"
        description="Información educativa y cultural"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.situacionEducativoCultural}
        onToggle={() =>
          setSecciones({
            ...secciones,
            situacionEducativoCultural: !secciones.situacionEducativoCultural,
          })
        }
      />
      {secciones.situacionEducativoCultural && (
        <ComponentCard title="Situación Educativa y Cultural">
          <SituacionEducativoCulturalForm
            data={formData.situacionEducativoCultural}
            onChange={(value) =>
              setFormData({ ...formData, situacionEducativoCultural: value })
            }
            onValidate={(isValid) =>
              setValidaciones({
                ...validaciones,
                situacionEducativoCultural: isValid,
              })
            }
          />
        </ComponentCard>
      )}

      {/* SITUACIÓN SALUD */}
      <SectionHeader
        title="Salud"
        description="Información de salud"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.situacionSalud}
        onToggle={() =>
          setSecciones({
            ...secciones,
            situacionSalud: !secciones.situacionSalud,
          })
        }
      />
      {secciones.situacionSalud && (
        <ComponentCard title="Situación de Salud">
          <SituacionSaludForm
            data={formData.situacionSalud}
            onChange={(value) =>
              setFormData({ ...formData, situacionSalud: value })
            }
            onValidate={(isValid) =>
              setValidaciones({ ...validaciones, situacionSalud: isValid })
            }
          />
        </ComponentCard>
      )}

      {/* SITUACIÓN LEGAL */}
      <SectionHeader
        title="Situación Legal"
        description="Información legal"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.situacionLegal}
        onToggle={() =>
          setSecciones({
            ...secciones,
            situacionLegal: !secciones.situacionLegal,
          })
        }
      />
      {secciones.situacionLegal && (
        <ComponentCard title="Situación Legal">
          <SituacionLegalForm
            data={formData.situacionLegal}
            onChange={(value) =>
              setFormData({ ...formData, situacionLegal: value })
            }
            onValidate={(isValid) =>
              setValidaciones({ ...validaciones, situacionLegal: isValid })
            }
          />
        </ComponentCard>
      )}

      {/* VALORACIÓN PROFESIONAL */}
      <SectionHeader
        title="Valoración Profesional"
        description="Análisis profesional del caso"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.valoracionProfesional}
        onToggle={() =>
          setSecciones({
            ...secciones,
            valoracionProfesional: !secciones.valoracionProfesional,
          })
        }
      />
      {secciones.valoracionProfesional && (
        <ComponentCard title="Valoración Profesional">
          <ValoracionProfesionalForm
            data={formData.valoracionProfesional}
            onChange={(value) =>
              setFormData({ ...formData, valoracionProfesional: value })
            }
            onValidate={(isValid) =>
              setValidaciones({ ...validaciones, valoracionProfesional: isValid })
            }
          />
        </ComponentCard>
      )}

      {/* RECOMENDACIONES */}
      <SectionHeader
        title="Recomendaciones"
        description="Recomendaciones profesionales"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.recomendaciones}
        onToggle={() =>
          setSecciones({
            ...secciones,
            recomendaciones: !secciones.recomendaciones,
          })
        }
      />
      {secciones.recomendaciones && (
        <ComponentCard title="Recomendaciones">
          <RecomendacionesForm
            data={formData.recomendaciones}
            onChange={(value) =>
              setFormData({ ...formData, recomendaciones: value })
            }
            onValidate={(isValid) =>
              setValidaciones({ ...validaciones, recomendaciones: isValid })
            }
          />
        </ComponentCard>
      )}

      {/* FAMILIARES */}
      <SectionHeader
        title="Miembros Familiares"
        description="Información de familiares"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.familiares}
        onToggle={() =>
          setSecciones({
            ...secciones,
            familiares: !secciones.familiares,
          })
        }
      />
      {secciones.familiares && (
        <ComponentCard title="Miembros Familiares">
          <FamiliaresForm
            data={formData.familiares}
            onChange={(familiares) =>
              setFormData({ ...formData, familiares })
            }
            onValidate={(isValid) =>
              setValidaciones({ ...validaciones, familiares: isValid })
            }
          />
        </ComponentCard>
      )}

      {/* GENOGRAMA Y ECOMAPA */}
      <SectionHeader
        title="Genograma y Ecomapa"
        description="Documentos gráficos"
        icon={<MessageSquare size={24} />}
        isOpen={secciones.genogramaEcomapa}
        onToggle={() =>
          setSecciones({
            ...secciones,
            genogramaEcomapa: !secciones.genogramaEcomapa,
          })
        }
      />
      {secciones.genogramaEcomapa && (
        <ComponentCard title="Genograma y Ecomapa">
          <GenogramaEcomapaForm
            genogramaUrl={formData.genogramaUrl}
            ecomapaUrl={formData.ecomapaUrl}
            onGenogramaChange={(file) =>
              setFormData({ ...formData, genogramFile: file })
            }
            onEcomapaChange={(file) =>
              setFormData({ ...formData, ecomapFile: file })
            }
          />
        </ComponentCard>
      )}

      {/* BOTONES */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Guardando..."
            : id
              ? "Actualizar Informe"
              : "Guardar Informe"}
        </Button>
      </div>
    </div>
  );
}
