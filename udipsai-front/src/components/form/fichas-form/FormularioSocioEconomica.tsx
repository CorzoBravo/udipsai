import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Switch from "../switch/Switch";

import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { MessageSquare, User } from "lucide-react";
import { pacientesService } from "../../../services/pacientes";
import PatientSelector from "../../common/PatientSelector";


import { fichasService } from "../../../services/fichas";

import InformacionPacienteForm from "./sections/SocioEconomica/InformacionPacienteForm";
import RiesgosFamiliaresForm from "./sections/SocioEconomica/RiesgosFamiliaresForm";
import VulnerabilidadesForm from "./sections/SocioEconomica/VulnerabilidadesForm";



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
    parentesco: string;
    ingresoMensual: number;
  }[];

  riesgosFamiliares: {
    //Agregar los campos de tabaquismo, alcoholismo, drogadiccion, violencia intrafamiliar, problemas sociales, vulnerabilidades, migroExterior, lugarMigracion, tiempoMigracion, afectacionFamiliar
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
    resolucionConflictos: string;
    quienesIncumplenReglas: string;
    actividadesCompartidas: string;
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
    tipoSanitario: string; // Agregar DTO
    procedenciaAgua: string;
    detalleElectricidad: string;
  };

  salud: {
    lugarAtencionMedica: string;
    saludEstudiante: string;
    ayudasTecnicas: string;
    problemasSaludFamiliares: string;
    enfermedadesCatastroficas: string;
    discapacidadFamiliares: string;
  };
  situacionEconomica: {
    totalIngresos: number;
    totalEgresos: number;
    condicionEconomica: string;
    capacidadGastoEvaluacion: string;
    actividadesTiempoLibre: string;
  };

  desgloseEconomico: {
    ingresoPadre: number;
    ingresoMadre: number;
    ingresoFamiliares: number;
    ingresoOtros: number;
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

export const initialFichaSocioeconomicaState: FichaSocioeconomicaState = {
  activo: true,
  fechaElaboracion: "",

  paciente: {
    id: 0,
    nombresApellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    edad: 0,
    cedula: "",
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
    resolucionConflictos: "",
    quienesIncumplenReglas: "",
    actividadesCompartidas: "",
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
    problemasSaludFamiliares: "",
    enfermedadesCatastroficas: "",
    discapacidadFamiliares: "",
  },
  situacionEconomica: {
    totalIngresos: 0,
    totalEgresos: 0,
    condicionEconomica: "",
    capacidadGastoEvaluacion: "",
    actividadesTiempoLibre: "",
  },
  desgloseEconomico: {
    ingresoPadre: 0,
    ingresoMadre: 0,
    ingresoFamiliares: 0,
    ingresoOtros: 0,
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

export default function FormularioFichaSocioeconomica() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FichaSocioeconomicaState>(
    initialFichaSocioeconomicaState
  );

  const [loading, setLoading] = useState(false);
  const [verInformacionPaciente, setVerInformacionPaciente] = useState(false);
  const [verConformacionFamiliar, setVerConformacionFamiliar] = useState(false);
  const [verRiesgosFamiliares, setVerRiesgosFamiliares] = useState(false);
  const [verVulnerabilidades, setVerVulnerabilidades] = useState(false);
  const [verRelaacionFamiliar, setVerRelacionFamiliar] = useState(false);
  const [verVivienda, setVerVivienda] = useState(false);
  const [verSalud, setVerSalud] = useState(false);
  const [verSituacionEconomica, setVerSituacionEconomica] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<{
    nombresApellidos: string;
    cedula: string;
  } | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const isEdit = !!id;
  const [searchParams] = useSearchParams();


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
      if (data) {
        const loadedData = {
          ...data,
          paciente: data.paciente,
        };
        setFormData(loadedData);
        // Colocar los campos del formulario
        const hasInformacionPaciente = !isSectionEmpty(data.paciente, initialFichaSocioeconomicaState.paciente);
        const hasConformacionFamiliar = data.familiares && data.familiares.length > 0;
        const hasRiesgosFamiliares = !isSectionEmpty(data.riesgosFamiliares, initialFichaSocioeconomicaState.riesgosFamiliares);
        const hasVulnerabilidades = !isSectionEmpty(data.vulnerabilidadesDetalle, initialFichaSocioeconomicaState.vulnerabilidadesDetalle);
        const hasDinamicaFamiliar = !isSectionEmpty(data.dinamicaFamiliar, initialFichaSocioeconomicaState.dinamicaFamiliar);
        const hasVivienda = !isSectionEmpty(data.vivienda, initialFichaSocioeconomicaState.vivienda);
        const hasSalud = !isSectionEmpty(data.salud, initialFichaSocioeconomicaState.salud);
        const hasSituacionEconomica = !isSectionEmpty(data.situacionEconomica, initialFichaSocioeconomicaState.situacionEconomica);

        if (hasInformacionPaciente) setVerInformacionPaciente(true);
        if (hasConformacionFamiliar) setVerConformacionFamiliar(true);
        if (hasRiesgosFamiliares) setVerRiesgosFamiliares(true);
        if (hasVulnerabilidades) setVerVulnerabilidades(true);
        if (hasDinamicaFamiliar) setVerRelacionFamiliar(true);
        if (hasVivienda) setVerVivienda(true);
        if (hasSalud) setVerSalud(true);
        if (hasSituacionEconomica) setVerSituacionEconomica(true);

        if (data.paciente) {
          try {
            const paciente = await pacientesService.obtenerPorId(data.paciente.id);
            setSelectedPatient(paciente);
          } catch (pError) {
            console.warn("No se pudo cargar el paciente asociado a la ficha:", pError);
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

  // Manejar cambios en objetos anidados
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

  // Guardar (crear o actualizar)
  const handleSubmit = async () => {
    if (!formData.paciente.id) {
      toast.error("Debe seleccionar un paciente");
      return;
    }

    try {
      setLoading(true);
      if (isEdit && formData.id) {
        await fichasService.actualizarSocioEconomico(formData.id, formData);
        toast.success("Ficha actualizada exitosamente");
      } else if (isEdit && !formData.id) {
        toast.error("No se encontró la ficha");
        return;
      } else {
        await fichasService.crearSocioEconomico(formData);
        toast.success("Ficha creada exitosamente");
      }
      navigate("/fichas?tab=socioeconomica");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Este paciente ya tiene una ficha activa.");
      } else {
        toast.error(
          isEdit ? "Error al actualizar la ficha" : "Error al crear la ficha"
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
  }

  if (loading && isEdit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando ficha...
        </p>
      </div>
    );
  }

  if (showSelector) {
    return (
      <div className="space-y-6">
        <PatientSelector
          onSelect={handlePatientSelect}
        />
      </div>
    );
  }

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

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-1cle gap-6">
        <div
          onClick={() => setVerInformacionPaciente(!verInformacionPaciente)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${verInformacionPaciente
            ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
            : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
            }`}
        >
          {/* Cabecera tarjeta */}
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${verInformacionPaciente
                ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
                }`}
            >
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Información del Paciente
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Datos personales y demográficos
              </p>
            </div>

          </div>

          {/* Sección desplegable */}

        </div>
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
        <div
          onClick={() => setVerConformacionFamiliar(!verConformacionFamiliar)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${verConformacionFamiliar
            ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
            : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
            }`}
        >
          {/* Cabecera tarjeta */}
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${verConformacionFamiliar
                ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
                }`}
            >
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Conformación Familiar
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Información sobre los miembros de la familia
              </p>
            </div>

          </div>

          {/* Sección desplegable */}

        </div>
        {verConformacionFamiliar && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Conformación Familiar"
              onHeaderClick={() =>
                setVerConformacionFamiliar(!verConformacionFamiliar)
              }
              bodyDisabled={!verConformacionFamiliar}
            >
              {/* Aquí iría el formulario de conformación familiar, similar a InformacionPacienteForm */}
              <p className="text-gray-500 dark:text-gray-400">
                Formulario de Conformación Familiar (en construcción)
              </p>
            </ComponentCard>
          </div>
        )}

        <div
          onClick={() => setVerRiesgosFamiliares(!verRiesgosFamiliares)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${verRiesgosFamiliares
            ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
            : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
            }`}
        >
          {/* Cabecera tarjeta */}
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${verRiesgosFamiliares
                ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
                }`}
            >
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Riesgos Familiares
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Factores de riesgo presentes en el entorno familiar
              </p>
            </div>
          </div>
          {/* Sección desplegable */}
        </div>
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
                data={formData.riesgosFamiliares}
                onChange={(field, value) =>
                  handleNestedChange("riesgosFamiliares", field, value)
                }
              />
            </ComponentCard>
          </div>
        )}

        <div
          onClick={() => setVerVulnerabilidades(!verVulnerabilidades)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${verVulnerabilidades
            ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
            : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
            }`}
        >
          {/* Cabecera tarjeta */}
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${verVulnerabilidades
                ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
                }`}
            >
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Vulnerabilidades
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Factores de vulnerabilidad presentes en el entorno familiar
              </p>
            </div>
          </div>
          {/* Sección desplegable */}
        </div>
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
                  handleNestedChange("vulnerabilidadesDetalle", field, value)
                }
              />
            </ComponentCard>
          </div>
        )}

        <div
          onClick={() => setVerRelacionFamiliar(!verRelaacionFamiliar)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${verRelaacionFamiliar
            ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
            : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
            }`}
        >
          {/* Cabecera tarjeta */}
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${verRelaacionFamiliar
                ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
                }`}
            >
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Dinámica Familiar
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Relaciones  y dinámicas dentro del núcleo familiar
              </p>
            </div>
          </div>
          {/* Sección desplegable */}
        </div>
        {verRelaacionFamiliar && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Dinámica Familiar"
              onHeaderClick={() =>
                setVerRelacionFamiliar(!verRelaacionFamiliar)
              }
              bodyDisabled={!verRelaacionFamiliar}
            >
              {/* Aquí iría el formulario de dinámica familiar, similar a RiesgosFamiliaresForm */}
              <p className="text-gray-500 dark:text-gray-400">
                Formulario de Dinámica Familiar (en construcción)
              </p>
            </ComponentCard>
          </div>
        )}

        <div
          onClick={() => setVerVivienda(!verVivienda)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${verVivienda
            ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
            : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
            }`}
        >
          {/* Cabecera tarjeta */}
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${verVivienda
                ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
                }`}
            >
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Condiciones de Vivienda
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Información sobre las condiciones habitacionales
              </p>
            </div>
          </div>
          {/* Sección desplegable */}
        </div>
        {verVivienda && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Condiciones de Vivienda"
              onHeaderClick={() => setVerVivienda(!verVivienda)}
              bodyDisabled={!verVivienda}
            >
              {/* Aquí iría el formulario de condiciones de vivienda, similar a RiesgosFamiliaresForm */}
              <p className="text-gray-500 dark:text-gray-400">
                Formulario de Condiciones de Vivienda (en construcción)
              </p>
            </ComponentCard>
          </div>
        )}

        <div
          onClick={() => setVerSalud(!verSalud)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${verSalud
            ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
            : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
            }`}
        >
          {/* Cabecera tarjeta */}
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${verSalud
                ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
                }`}
            >
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Salud
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Información sobre la salud del paciente y su familia
              </p>
            </div>
          </div>
          {/* Sección desplegable */}
        </div>
        {verSalud && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Salud"
              onHeaderClick={() => setVerSalud(!verSalud)}
              bodyDisabled={!verSalud}
            >
              {/* Aquí iría el formulario de salud, similar a RiesgosFamiliaresForm */}
              <p className="text-gray-500 dark:text-gray-400">
                Formulario de Salud (en construcción)
              </p>
            </ComponentCard>
          </div>
        )}

        <div
          onClick={() => setVerSituacionEconomica(!verSituacionEconomica)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${verSituacionEconomica
            ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
            : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
            }`}
        >
          {/* Cabecera tarjeta */}
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${verSituacionEconomica
                ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
                }`}
            >
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Situación Económica
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Información sobre los ingresos, egresos y condiciones económicas
              </p>
            </div>
          </div>
          {/* Sección desplegable */}
        </div>
        {verSituacionEconomica && (
          <div className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ComponentCard
              title="Situación Económica"
              onHeaderClick={() =>
                setVerSituacionEconomica(!verSituacionEconomica)
              }
              bodyDisabled={!verSituacionEconomica}
            >
              {/* Aquí iría el formulario de situación económica, similar a RiesgosFamiliaresForm */}
              <p className="text-gray-500 dark:text-gray-400">
                Formulario de Situación Económica (en construcción)
              </p>
            </ComponentCard>
          </div>
        )}

        {/* Botones (FUERA del grid) */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
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
