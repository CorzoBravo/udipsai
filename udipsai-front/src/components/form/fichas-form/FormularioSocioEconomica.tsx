import { useState, useEffect, useCallback } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";

import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { MessageSquare, User } from "lucide-react";
import { pacientesService, especialistasService, pasantesService } from "../../../services";
import PatientSelector from "../../common/PatientSelector";
import { useAuth } from "../../../context/AuthContext.tsx";


import { fichasService } from "../../../services/fichas";

import InformacionPacienteForm from "./sections/SocioEconomica/InformacionPacienteForm";
import RiesgosFamiliaresForm from "./sections/SocioEconomica/RiesgosFamiliaresForm";
import VulnerabilidadesForm from "./sections/SocioEconomica/VulnerabilidadesForm";
import RelacionFamiliar from "./sections/SocioEconomica/RelacionFamiliar";
import CondicionesViviendaForm from "./sections/SocioEconomica/CondicionesViviendaForm";
import ConformacionFamiliar from "./sections/SocioEconomica/ConformacionFamiliarForm";
import SaludForm from "./sections/SocioEconomica/SaludForm";
import SituacionEconomicaForm from "./sections/SocioEconomica/SituacionEconomicaForm";
import Label from "../Label.tsx";



interface FamiliarSalud {
  problema?: boolean;
  enfermedad?: string;
  catastrofica?: boolean;
  enfermedadCatastrofica?: string;
  discapacidad?: boolean;
  descripDiscapacidad?: string;
}
interface SectionHeaderProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}
export interface FichaSocioeconomicaState {
  id?: number;
  activo: boolean;
  fechaElaboracion: string;

  paciente: {
    id: number;
    nombresApellidos: string;
    fechaNacimiento: string;
    lugarNacimiento: string;
    edad: number;
    cedula: string;
    numeroTelefono?: string;
    numeroCelular?: string;
    institucionEducativa?: { nombre: string; };
    domicilio?: string;
    portadorCarnet?: boolean;
    tipoDiscapacidad?: string;
    porcentajeDiscapacidad?: number;
    estadoCivil?: string;
    nacionalidad?: string;
    sexo?: string;
  };

  especialista: {
    id: number;
    nombresApellidos: string;
  };

  familiares: {
    relacion: string;
    nombresApellidos: string;
    edad: number;
    estadocivil: string;
    instruccion: string;
    ocupacion: string;
    ingresoMensual: number;
    salud?: FamiliarSalud;
  }[];

  riesgosFamiliares: {
    tabaquismo: boolean;
    alcoholismo: boolean;
    drogadiccion: boolean;
    violenciaIntrafamiliar: boolean;
    problemasSociales: string;
    vulnerabilidades: string;
    migroExterior: boolean;
    lugarMigracion: string;
    tiempoMigracion: string;
    afectacionFamiliar: string;
  };

  vulnerabilidadesDetalle: {
    movilidadHumana: boolean;
    enfermedadCatastrofica: boolean;
    embarazoAdolescente: boolean;
    abusoSexual: boolean;
    agresionFisica: boolean;
    agresionPsicologica: boolean;
    lugarAgresion: string;
  };

  dinamicaFamiliar: {
    opinionfamiliar: boolean;
    unionfamiliar: boolean;
    resolucionConflictos: string;
    quienesIncumplenReglas: string;
    actividadesCompartidas: string;
    cumplenReglas: boolean;
    tieneActividadesFamiliares: boolean;
    relacionHermanos: string;
    relacionPadresHijos: string;
    comunicacionFamiliar: string;
    tipoHogar: string;
  };

  vivienda: {
    tipoTenencia: string;
    materialParedes: string;
    materialPiso: string;
    materialTecho: string;
    numeroCuartos: number;
    numeroDormitorios: number;
    numeroCamas: number;
    numeroSanitarios: number;
    tipoSanitario: string;
    procedenciaAgua: string;
    detalleElectricidad: string;
  };

  salud: {
    lugarAtencionMedica: string;
    saludEstudiante: string;
    ayudasTecnicas: string;
  };

  situacionEconomica: {
    totalIngresos: number;
    totalEgresos: number;
    condicionEconomica: string;
    capacidadGastoEvaluacion: string;
    actividadesTiempoLibre: string;
  };

  desgloseEconomico: {
    egresoAlimentacion: number;
    egresoArriendo: number;
    egresoServiciosBasicos: number;
    egresoSalud: number;
    egresoEducacion: number;
    egresoPrestamos: number;
    egresoOtros: number;
  };

  conclusiones: string;
  recomendaciones: string;
}

const getFechaActual = (): string => {
  const today = new Date();
  return today.toISOString();
};

export const initialFichaSocioeconomicaState: FichaSocioeconomicaState = {
  // TODO: Datos faltantes paciente : email, instruccion, ocupacion,tipo hogar, tiempo libre
  activo: true,
  fechaElaboracion: getFechaActual(), // ✅ Fecha actual del sistema
  paciente: {
    id: 0,
    nombresApellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: 0,
    cedula: "",
    numeroTelefono: "",
    numeroCelular: "",
    institucionEducativa: { nombre: "" },
    domicilio: "",
    portadorCarnet: false,
    tipoDiscapacidad: "",
    porcentajeDiscapacidad: 0,
    estadoCivil: "",
    nacionalidad: "",
    sexo: "",
  },
  especialista: {
    id: 0,
    nombresApellidos: "",
  },
  familiares: [],
  riesgosFamiliares: {
    tabaquismo: false,
    alcoholismo: false,
    drogadiccion: false,
    violenciaIntrafamiliar: false,
    problemasSociales: "",
    vulnerabilidades: "",
    migroExterior: false,
    lugarMigracion: "",
    tiempoMigracion: "",
    afectacionFamiliar: "",
  },
  vulnerabilidadesDetalle: {
    movilidadHumana: false,
    enfermedadCatastrofica: false,
    embarazoAdolescente: false,
    abusoSexual: false,
    agresionFisica: false,
    agresionPsicologica: false,
    lugarAgresion: "",
  },
  dinamicaFamiliar: {
    opinionfamiliar: false,
    unionfamiliar: false,
    resolucionConflictos: "",
    quienesIncumplenReglas: "",
    actividadesCompartidas: "",
    cumplenReglas: false,
    tieneActividadesFamiliares: false,
    relacionHermanos: "",
    relacionPadresHijos: "",
    comunicacionFamiliar: "",
    tipoHogar: "",
  },
  vivienda: {
    tipoTenencia: "",
    materialParedes: "",
    materialPiso: "",
    materialTecho: "",
    numeroCuartos: 0,
    numeroDormitorios: 0,
    numeroCamas: 0,
    numeroSanitarios: 0,
    tipoSanitario: "",
    procedenciaAgua: "",
    detalleElectricidad: "",
  },
  salud: {
    lugarAtencionMedica: "",
    saludEstudiante: "",
    ayudasTecnicas: "",
  },
  situacionEconomica: {
    totalIngresos: 0,
    totalEgresos: 0,
    condicionEconomica: "",
    capacidadGastoEvaluacion: "",
    actividadesTiempoLibre: "",
  },
  desgloseEconomico: {
    egresoAlimentacion: 0,
    egresoArriendo: 0,
    egresoServiciosBasicos: 0,
    egresoSalud: 0,
    egresoEducacion: 0,
    egresoPrestamos: 0,
    egresoOtros: 0,
  },
  conclusiones: "",
  recomendaciones: "",
};
const buildRequest = (data: FichaSocioeconomicaState) => {
  return {
    pacienteId: data.paciente.id,
    especialistaId: data.especialista.id,
    fechaElaboracion: data.fechaElaboracion,

    riesgosSociales: {
      tabaquismo: data.riesgosFamiliares.tabaquismo,
      alcoholismo: data.riesgosFamiliares.alcoholismo,
      drogadiccion: data.riesgosFamiliares.drogadiccion,
      violenciaIntrafamiliar: data.riesgosFamiliares.violenciaIntrafamiliar,
      problemasSociales: data.riesgosFamiliares.problemasSociales,
      vulnerabilidades: data.riesgosFamiliares.vulnerabilidades,
      migroExterior: data.riesgosFamiliares.migroExterior,
      lugarMigracion: data.riesgosFamiliares.lugarMigracion,
      tiempoMigracion: data.riesgosFamiliares.tiempoMigracion,
      afectacionFamiliar: data.riesgosFamiliares.afectacionFamiliar,
    },

    vulnerabilidad: {
      movilidadHumana: data.vulnerabilidadesDetalle.movilidadHumana,
      enfermedadCatastrofica: data.vulnerabilidadesDetalle.enfermedadCatastrofica,
      embarazoAdolescente: data.vulnerabilidadesDetalle.embarazoAdolescente,
      abusoSexual: data.vulnerabilidadesDetalle.abusoSexual,
      agresionFisica: data.vulnerabilidadesDetalle.agresionFisica,
      agresionPsicologica: data.vulnerabilidadesDetalle.agresionPsicologica,
      lugarAgresion: data.vulnerabilidadesDetalle.lugarAgresion,
    },

    dinamicaFamiliar: data.dinamicaFamiliar,
    vivienda: data.vivienda,
    salud: data.salud,

    situacionEconomica: {
      totalIngresos: data.situacionEconomica.totalIngresos,
      totalEgresos: data.situacionEconomica.totalEgresos,
      condicionEconomica: data.situacionEconomica.condicionEconomica,
      capacidadGastoEvaluacion: data.situacionEconomica.capacidadGastoEvaluacion,
      actividadesTiempoLibre: data.situacionEconomica.actividadesTiempoLibre,
    },

    desgloseEconomico: data.desgloseEconomico,

    conclusiones: data.conclusiones,
    recomendaciones: data.recomendaciones,
    responsable: data.especialista.nombresApellidos,

    familiares: data.familiares.map((f) => ({
      relacion: f.relacion,
      nombresApellidos: f.nombresApellidos,
      edad: f.edad,
      estadoCivil: f.estadocivil,
      instruccion: f.instruccion,
      ocupacion: f.ocupacion,
      ingresoMensual: f.ingresoMensual,

      problemas_salud: f.salud?.problema || false,
      descripProblemasSaludFamiliar: f.salud?.enfermedad || "",

      enfermedad_catastrofica: f.salud?.catastrofica || false,
      descripEnfermedadCatastrofica: f.salud?.enfermedadCatastrofica || "",

      discapacidad: f.salud?.discapacidad || false,
      descripDiscapacidad: f.salud?.descripDiscapacidad || "",
    })),
  };
};

export default function FormularioFichaSocioeconomica() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  // ✅ OBTENER EL USUARIO AUTENTICADO
  const { userIdentity, userRole } = useAuth();

  const [formData, setFormData] = useState<FichaSocioeconomicaState>(
    initialFichaSocioeconomicaState
  );

  const [loading, setLoading] = useState(false);
  const [especialistaLoading, setEspecialistaLoading] = useState(true); // ✅ Loading para especialista
  const [verInformacionPaciente, setVerInformacionPaciente] = useState(false);
  const [verConformacionFamiliar, setVerConformacionFamiliar] = useState(false);
  const [verRiesgosFamiliares, setVerRiesgosFamiliares] = useState(false);
  const [verVulnerabilidades, setVerVulnerabilidades] = useState(false);
  const [verRelacionFamiliar, setVerRelacionFamiliar] = useState(false);
  const [verVivienda, setVerVivienda] = useState(false);
  const [verSalud, setVerSalud] = useState(false);
  const [verSituacionEconomica, setVerSituacionEconomica] = useState(false);
  const [verConclusiones, setVerConclusiones] = useState(false);

  const [validaciones, setValidaciones] = useState<Record<string, boolean>>({
    conformacionFamiliar: false,
    riesgosFamiliares: false,
    vulnerabilidades: false,
    relacionFamiliar: false,
    condicionesVivienda: false,
    salud: false,
    situacionEconomica: false,
  });
  const [selectedPatient, setSelectedPatient] = useState<{
    id: number;
    nombresApellidos: string;
    cedula: string;
  } | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const isEdit = !!id;

  // ✅ EFECTO PARA OBTENER EL ESPECIALISTA/PASANTE DESDE LA API
  useEffect(() => {
    const loadEspecialista = async () => {
      if (!userIdentity || !userRole) {
        setEspecialistaLoading(false);
        return;
      }

      try {
        setEspecialistaLoading(true);
        let especialistaData = null;

        // Determinar si es especialista o pasante según el rol
        if (userRole === "ROLE_ESPECIALISTA") {
          const result = await especialistasService.filtrar({ search: userIdentity });
          especialistaData = result?.content?.[0];
        } else if (userRole === "ROLE_PASANTE") {
          const result = await pasantesService.filtrar({ search: userIdentity });
          especialistaData = result?.content?.[0];
        }

        if (especialistaData?.id) {
          setFormData((prev) => {

            return {
              ...prev,
              especialista: {
                id: especialistaData.id,
                nombresApellidos: especialistaData.nombresApellidos,
              },
            };
          });
        } else {
          console.warn("No se encontró especialista/pasante para:", userIdentity);
          toast.warn("No se pudo cargar la información del especialista. Intente recargar.");
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

  // ✅ EFECTO PARA CARGAR LA FICHA SI ES EDICIÓN
  useEffect(() => {
    const pacienteIdParam = searchParams.get("pacienteId");
    if (isEdit && id) {
      loadFicha(id);
    } else if (pacienteIdParam) {
      loadPacienteFromUrl(pacienteIdParam);
    } else {
      setShowSelector(true);
    }
  }, [id, isEdit, searchParams]);
  const loadPacienteFromUrl = async (id: string) => {
    try {
      setLoading(true);
      const paciente = await pacientesService.obtenerPorId(id);
      if (paciente) {
        setSelectedPatient(paciente);
        setFormData((prev) => ({
          ...prev,
          paciente: paciente,
        }));
        setShowSelector(false);
      }
    } catch (error) {
      console.error("Error al cargar paciente:", error);
      toast.error("No se pudo cargar el paciente. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const isSectionEmpty = (sectionData: any, initialSectionData: any) => {
    if (!sectionData) return true;

    return Object.keys(initialSectionData).every((key) => {
      const v1 = sectionData[key];
      const v2 = initialSectionData[key];

      const normalize = (v: any) => (v === null || v === undefined ? "" : v);

      return normalize(v1) === normalize(v2);
    });
  };

  const loadFicha = async (fichaiId: string) => {
    try {
      setLoading(true);
      const data = await fichasService.obtenerSocioEconomico(fichaiId);
      const mappedFamiliares = (data.familiares || []).map((f: any) => ({
        ...f,
        salud: {
          problema: f.problemas_salud || false,
          enfermedad: f.descripProblemasSaludFamiliar || "",

          catastrofica: f.enfermedad_catastrofica || false,
          enfermedadCatastrofica: f.descripEnfermedadCatastrofica || "",

          discapacidad: f.discapacidad || false,
          descripDiscapacidad: f.descripDiscapacidad || "",
        }
      }));

      if (data) {
        const loadedData = {
          ...data,
          paciente: data.paciente,
          riesgosFamiliares: data.riesgosSociales,
          vulnerabilidadesDetalle: data.vulnerabilidad,
          familiares: mappedFamiliares,
          situacionEconomica: {
            ...data.situacionEconomica,
            capacidadGastoEvaluacion:
              data.situacionEconomica?.capacidadGastoEvaluacion || "",
          },
        };
        setFormData((prev) => ({
          ...loadedData,
          especialista: prev.especialista,
        }));

        const hasInformacionPaciente = !isSectionEmpty(
          data.paciente,
          initialFichaSocioeconomicaState.paciente
        );
        const hasConformacionFamiliar =
          data.familiares && data.familiares.length > 0;
        const hasRiesgosFamiliares = !isSectionEmpty(
          data.riesgosSociales,
          initialFichaSocioeconomicaState.riesgosFamiliares
        );
        const hasVulnerabilidades = !isSectionEmpty(
          data.vulnerabilidad,
          initialFichaSocioeconomicaState.vulnerabilidadesDetalle
        );
        const hasDinamicaFamiliar = !isSectionEmpty(
          data.dinamicaFamiliar,
          initialFichaSocioeconomicaState.dinamicaFamiliar
        );
        const hasVivienda = !isSectionEmpty(
          data.vivienda,
          initialFichaSocioeconomicaState.vivienda
        );
        const hasSalud = !isSectionEmpty(
          data.salud,
          initialFichaSocioeconomicaState.salud
        );
        const hasSituacionEconomica = !isSectionEmpty(
          data.situacionEconomica,
          initialFichaSocioeconomicaState.situacionEconomica
        );
        const hasConclusiones = !isSectionEmpty(
          data.conclusiones,
          initialFichaSocioeconomicaState.conclusiones
        );

        if (hasInformacionPaciente) setVerInformacionPaciente(true);
        if (hasConformacionFamiliar) setVerConformacionFamiliar(true);
        if (hasRiesgosFamiliares) setVerRiesgosFamiliares(true);
        if (hasVulnerabilidades) setVerVulnerabilidades(true);
        if (hasDinamicaFamiliar) setVerRelacionFamiliar(true);
        if (hasVivienda) setVerVivienda(true);
        if (hasSalud) setVerSalud(true);
        if (hasSituacionEconomica) setVerSituacionEconomica(true);
        if (hasConclusiones) setVerConclusiones(true);

        if (data.paciente) {
          try {
            const paciente = await pacientesService.obtenerPorId(
              data.paciente.id
            );
            setSelectedPatient(paciente);
          } catch (pError) {
            console.warn(
              "No se pudo cargar el paciente asociado a la ficha:",
              pError
            );
          }
        }
      } else {
        toast.error("No se encontró la ficha socioeconómica.");
        navigate("/fichas?tab=socioeconomica");
      }
    } catch (error) {
      console.error("Error al cargar ficha:", error);
      toast.error("Ocurrió un error al cargar la ficha. Intente de nuevo.");
      navigate("/fichas?tab=socioeconomica");
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (
    section: keyof FichaSocioeconomicaState,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };
  const handleValidateConformacionFamiliar = useCallback(
    (isValid: boolean, _errors: string[]) => {
      setValidaciones((prev) => ({
        ...prev,
        conformacionFamiliar: isValid,
      }));
    },
    []
  );
  const handleSubmit = async () => {
    if (!formData.paciente?.id || formData.paciente.id <= 0) {
      toast.error("Debe seleccionar un paciente válido");
      return;
    }

    if (!formData.especialista?.id || formData.especialista.id <= 0) {
      toast.error("No se pudo obtener el especialista válido");
      return;
    }

    // ✅ VALIDAR QUE EL ESPECIALISTA ESTÉ ASIGNADO
    if (!formData.especialista.id) {
      toast.error(
        "No se pudo obtener el especialista. Intente recargar la página."
      );
      return;
    }

    if (!formData.fechaElaboracion) {
      toast.error("Debe establecer la fecha de elaboración");
      return;
    }

    const seccionesRequeridas = [
      { key: "conformacionFamiliar", nombre: "Conformación Familiar", activa: verConformacionFamiliar },
      { key: "riesgosFamiliares", nombre: "Riesgos Familiares", activa: verRiesgosFamiliares },
      { key: "vulnerabilidades", nombre: "Vulnerabilidades", activa: verVulnerabilidades },
      { key: "relacionFamiliar", nombre: "Dinámica Familiar", activa: verRelacionFamiliar },
      { key: "condicionesVivienda", nombre: "Condiciones de Vivienda", activa: verVivienda },
      { key: "salud", nombre: "Salud", activa: verSalud },
      { key: "situacionEconomica", nombre: "Situación Económica", activa: verSituacionEconomica },
    ];

    for (const seccion of seccionesRequeridas) {
      if (seccion.activa && !validaciones[seccion.key]) {
        toast.error(`Complete la sección de ${seccion.nombre}`);
        return;
      }
    }

    if (!formData.conclusiones || formData.conclusiones.trim() === "") {
      toast.error("Las conclusiones son requeridas");
      return;
    }

    if (!formData.recomendaciones || formData.recomendaciones.trim() === "") {
      toast.error("Las recomendaciones son requeridas");
      return;
    }

    try {

      setLoading(true);
      if (isEdit && formData.id) {
        const request = buildRequest(formData);
        await fichasService.actualizarSocioEconomico(formData.id, request);
        toast.success("Ficha actualizada exitosamente");
      } else if (isEdit && !formData.id) {
        toast.error("No se encontró la ficha");
        return;
      } else {
        const request = buildRequest(formData);
        await fichasService.crearSocioEconomico(request);
        toast.success("Ficha creada exitosamente");
      }
      navigate("/fichas?tab=socioeconomica");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Este paciente ya tiene una ficha activa.");
      } else {
        toast.error(
          isEdit
            ? "Error al actualizar la ficha"
            : "Error al crear la ficha"
        );
      }
      console.error("Error saving ficha:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient: any) => {
    setFormData((prev) => ({
      ...prev,
      paciente: {
        ...prev.paciente,
        ...patient,
      },
    }));
    setSelectedPatient(patient);
    setShowSelector(false);
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
        <div className="bg-red-50/20 dark:bg-gray-800 p-4 rounded-3xl flex items-center justify-between border-2 border-brand-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-400 dark:bg-gray-500 rounded-full text-white font-bold dark:text-gray-200">
              <User size={20} />
            </div>

            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-100">
                {selectedPatient.nombresApellidos}
              </h4>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                CI: {selectedPatient.cedula}
              </p>
            </div>
          </div>

          {!isEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSelector(true)}
            >
              Cambiar Paciente
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* INFORMACION PACIENTE */}
        <SectionHeader
          title="Información del Paciente"
          description="Datos personales y demográficos"
          icon={<User size={24} />}
          isOpen={verInformacionPaciente}
          onToggle={() =>
            setVerInformacionPaciente(!verInformacionPaciente)
          }
        />

        {verInformacionPaciente && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Información del Paciente"
              onHeaderClick={() =>
                setVerInformacionPaciente(!verInformacionPaciente)
              }
              bodyDisabled={!verInformacionPaciente}
            >
              <InformacionPacienteForm
                data={formData.paciente}
                onChange={(field, value) =>
                  handleNestedChange("paciente", field, value)
                }
              />
            </ComponentCard>
          </div>
        )}

        {/* CONFORMACION FAMILIAR */}
        <SectionHeader
          title="Conformación Familiar"
          description="Información sobre los miembros de la familia"
          icon={<User size={24} />}
          isOpen={verConformacionFamiliar}
          onToggle={() =>
            setVerConformacionFamiliar(!verConformacionFamiliar)
          }
        />

        {verConformacionFamiliar && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Conformación Familiar"
              onHeaderClick={() =>
                setVerConformacionFamiliar(!verConformacionFamiliar)
              }
              bodyDisabled={!verConformacionFamiliar}
            >
              <ConformacionFamiliar
                data={formData.familiares}
                onChange={(index, field, value) => {
                  setFormData((prev) => {
                    const updated = [...prev.familiares];

                    updated[index] = {
                      ...updated[index],
                      [field]: value,
                    };

                    return {
                      ...prev,
                      familiares: updated,
                    };
                  });
                }}
                onAdd={() => {
                  setFormData((prev) => ({
                    ...prev,
                    familiares: [
                      ...prev.familiares,
                      {
                        relacion: "",
                        nombresApellidos: "",
                        edad: 0,
                        estadocivil: "",
                        instruccion: "",
                        ocupacion: "",
                        ingresoMensual: 0,
                      },
                    ],
                  }));
                }}
                onRemove={(index) => {
                  setFormData((prev) => ({
                    ...prev,
                    familiares: prev.familiares.filter((_, i) => i !== index),
                  }));
                }}
                onValidate={handleValidateConformacionFamiliar}
              />
            </ComponentCard>
          </div>
        )}

        {/* RIESGOS */}
        <SectionHeader
          title="Riesgos Familiares"
          description="Factores de riesgo presentes en el entorno familiar"
          icon={<MessageSquare size={24} />}
          isOpen={verRiesgosFamiliares}
          onToggle={() =>
            setVerRiesgosFamiliares(!verRiesgosFamiliares)
          }
        />

        {verRiesgosFamiliares && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Riesgos Familiares"
              onHeaderClick={() =>
                setVerRiesgosFamiliares(!verRiesgosFamiliares)
              }
              bodyDisabled={!verRiesgosFamiliares}
            >
              <RiesgosFamiliaresForm
                data={
                  formData.riesgosFamiliares ||
                  initialFichaSocioeconomicaState.riesgosFamiliares
                }
                onChange={(field, value) =>
                  handleNestedChange(
                    "riesgosFamiliares",
                    field,
                    value
                  )
                }
                onValidate={(isValid) => {
                  setValidaciones((prev) => ({
                    ...prev,
                    riesgosFamiliares: isValid,
                  }));
                }}
              />
            </ComponentCard>
          </div>
        )}

        {/* VULNERABILIDADES */}
        <SectionHeader
          title="Vulnerabilidades"
          description="Factores de vulnerabilidad presentes en el entorno familiar"
          icon={<MessageSquare size={24} />}
          isOpen={verVulnerabilidades}
          onToggle={() =>
            setVerVulnerabilidades(!verVulnerabilidades)
          }
        />

        {verVulnerabilidades && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Vulnerabilidades"
              onHeaderClick={() =>
                setVerVulnerabilidades(!verVulnerabilidades)
              }
              bodyDisabled={!verVulnerabilidades}
            >
              <VulnerabilidadesForm
                data={formData.vulnerabilidadesDetalle}
                onChange={(field, value) =>
                  handleNestedChange(
                    "vulnerabilidadesDetalle",
                    field,
                    value
                  )
                }
                onValidate={(isValid) => {
                  setValidaciones((prev) => ({
                    ...prev,
                    vulnerabilidades: isValid,
                  }));
                }}
              />
            </ComponentCard>
          </div>
        )}

        {/* DINAMICA */}
        <SectionHeader
          title="Dinámica Familiar"
          description="Relaciones y dinámicas dentro del núcleo familiar"
          icon={<MessageSquare size={24} />}
          isOpen={verRelacionFamiliar}
          onToggle={() =>
            setVerRelacionFamiliar(!verRelacionFamiliar)
          }
        />

        {verRelacionFamiliar && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Dinámica Familiar"
              onHeaderClick={() =>
                setVerRelacionFamiliar(!verRelacionFamiliar)
              }
              bodyDisabled={!verRelacionFamiliar}
            >
              <RelacionFamiliar
                data={formData.dinamicaFamiliar}
                onChange={(field, value) =>
                  handleNestedChange(
                    "dinamicaFamiliar",
                    field,
                    value
                  )
                }
                onValidate={(isValid) => {
                  setValidaciones((prev) => ({
                    ...prev,
                    relacionFamiliar: isValid,
                  }));
                }}
              />
            </ComponentCard>
          </div>
        )}

        {/* VIVIENDA */}
        <SectionHeader
          title="Condiciones de Vivienda"
          description="Información sobre las condiciones habitacionales"
          icon={<MessageSquare size={24} />}
          isOpen={verVivienda}
          onToggle={() => setVerVivienda(!verVivienda)}
        />

        {verVivienda && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Condiciones de Vivienda"
              onHeaderClick={() =>
                setVerVivienda(!verVivienda)
              }
              bodyDisabled={!verVivienda}
            >
              <CondicionesViviendaForm
                data={formData.vivienda}
                onChange={(field, value) =>
                  handleNestedChange("vivienda", field, value)
                }
                onValidate={(isValid) => {
                  setValidaciones((prev) => ({
                    ...prev,
                    condicionesVivienda: isValid,
                  }));
                }}
              />
            </ComponentCard>
          </div>
        )}

        {/* SALUD */}
        <SectionHeader
          title="Salud"
          description="Información sobre la salud del paciente y su familia"
          icon={<MessageSquare size={24} />}
          isOpen={verSalud}
          onToggle={() => setVerSalud(!verSalud)}
        />

        {verSalud && (
          <SaludForm
            data={formData.salud}
            familiares={formData.familiares}
            onChange={(field, value) =>
              handleNestedChange("salud", field, value)
            }
            onChangeFamiliar={(index, field, value) => {
              setFormData((prev) => {
                const updated = [...prev.familiares];

                updated[index] = {
                  ...updated[index],
                  salud: {
                    ...updated[index].salud,
                    [field]: value,
                  },
                };

                return {
                  ...prev,
                  familiares: updated,
                };
              });
            }}
            onValidate={(isValid) => {
              setValidaciones((prev) => ({
                ...prev,
                salud: isValid,
              }));
            }}
          />
        )}

        {/* SITUACION ECONOMICA */}
        <SectionHeader
          title="Situación Económica"
          description="Información sobre ingresos, egresos y condiciones económicas"
          icon={<MessageSquare size={24} />}
          isOpen={verSituacionEconomica}
          onToggle={() =>
            setVerSituacionEconomica(!verSituacionEconomica)
          }
        />
        {verSituacionEconomica && (
          <SituacionEconomicaForm
            data={formData.situacionEconomica}
            desglose={formData.desgloseEconomico}
            familiares={formData.familiares}
            onChange={(field, value) =>
              handleNestedChange("situacionEconomica", field, value)
            }
            onChangeDesglose={(field: string, value: number) =>
              setFormData((prev) => ({
                ...prev,
                desgloseEconomico: {
                  ...prev.desgloseEconomico,
                  [field]: value,
                },
              }))
            }
            onValidate={(isValid) => {
              setValidaciones((prev) => ({
                ...prev,
                situacionEconomica: isValid,
              }));
            }}
          />
        )}

        {/* CONCLUSIONES */}
        <SectionHeader
          title="Conclusiones y Recomendaciones"
          description="Análisis final del caso"
          icon={<MessageSquare size={24} />}
          isOpen={verConclusiones}
          onToggle={() =>
            setVerConclusiones(!verConclusiones)
          }
        />

        {/* BOTONES */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Guardando..."
              : id
                ? "Actualizar Ficha"
                : "Guardar Ficha"}
          </Button>
        </div>
      </div>
    </div>
  );
}