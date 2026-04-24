import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Switch from "../switch/Switch";
import ViviendaHabitabilidadForm from "./sections/SocioEconomica/ViviendaHabitabilidadFrom";

import { fichasService } from "../../../services/fichas";

export interface FichaSocioeconomicaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  viviendaHabitabilidad: any;
}

export default function FormularioFichaSocioeconomica() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const idNumber = id ? Number(id) : null;

  const [formData, setFormData] = useState<FichaSocioeconomicaState>({
    pacienteId: 0,
    activo: true,
    viviendaHabitabilidad: {},
  });

  const [loading, setLoading] = useState(false);
  const [verVivienda, setVerVivienda] = useState(false);

  useEffect(() => {
    if (idNumber) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await fichasService.obtenerSocioEconomico(idNumber);
          setFormData(data);

          if (data.viviendaHabitabilidad) {
            setVerVivienda(true);
          }
        } catch (error) {
          console.error("Error al cargar ficha:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [idNumber]);

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
    try {
      setLoading(true);

      if (idNumber) {
        await fichasService.actualizarSocioEconomico(idNumber, formData);
        alert("Ficha actualizada correctamente");
      } else {
        await fichasService.crearSocioEconomico(formData);
        alert("Ficha creada correctamente");
      }

      navigate("/fichas");
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
          onChange={(field: string, value: any) =>
            handleNestedChange("viviendaHabitabilidad", field, value)
          }
        />
      </ComponentCard>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancelar
        </Button>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Guardando..."
            : idNumber
              ? "Actualizar Ficha"
              : "Guardar Ficha"}
        </Button>
      </div>
    </div>
  );
}