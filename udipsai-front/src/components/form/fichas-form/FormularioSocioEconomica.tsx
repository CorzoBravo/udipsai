import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { User } from "lucide-react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Switch from "../switch/Switch";

// Importa tus componentes (asegúrate de que las rutas sean correctas)
import ViviendaHabitabilidadForm from "./sections/SocioEconomica/ViviendaHabitabilidadFrom";

export interface FichaSocioeconomicaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  viviendaHabitabilidad: any; 
  // ... resto de propiedades
}


export default function FormularioFichaSocioeconomica() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // 'id' de la ficha a editar
  
  const [formData, setFormData] = useState<FichaSocioeconomicaState>({
    pacienteId: 0,
    activo: true,
    viviendaHabitabilidad: {},
  });
  
  const [loading] = useState(false);
  const [verVivienda, setVerVivienda] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await fichasService.obtenerSocioEconomico(id);
          setFormData(data);
          // Si los datos existen, activamos la vista automáticamente
          if (data.viviendaHabitabilidad) setVerVivienda(true);
        } catch (error) {
          console.error("Error al cargar ficha:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  // Función para manejar cambios en objetos anidados
const handleNestedChange = (section: keyof FichaSocioeconomicaState, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };

  // 2. Manejar envío (Crear vs Actualizar)
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (id) {
        // Modo Edición
        await fichasService.actualizarSocioEconomico(id, formData);
        alert("Ficha actualizada correctamente");
      } else {
        // Modo Creación
        await fichasService.crearSocioEconomico(formData);
        alert("Ficha creada correctamente");
      }
      navigate("/fichas"); // Redirigir al listado
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Ocurrió un error al guardar. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Vivienda y Habitabilidad"
        action={
          <Switch
            label="Activar sección"
            checked={verVivienda}
            onChange={(v) => setVerVivienda(v)}
          />
        }
        onHeaderClick={() => setVerVivienda(!verVivienda)}
        bodyDisabled={!verVivienda}
      >
        <ViviendaHabitabilidadForm
          data={formData.viviendaHabitabilidad}
          onChange={(f: string, v: any) => 
            handleNestedChange("viviendaHabitabilidad", f, v)
          }
        />
      </ComponentCard>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : (id ? "Actualizar Ficha" : "Guardar Ficha")}
        </Button>
      </div>
    </div>
  );
}