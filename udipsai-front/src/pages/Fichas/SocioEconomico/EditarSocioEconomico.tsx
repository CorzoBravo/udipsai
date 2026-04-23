import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fichasService } from "../../../services/fichas"; // Asegúrate de ajustar la ruta
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioSocioEconomico from "../../../components/form/fichas-form/FormularioSocioEconomica";

export default function EditarSocioEconomico() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await fichasService.obtenerSocioEconomico(id as string);
        setData(result);
      } catch (error) {
        console.error("Error al cargar la ficha:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 2. Función para manejar la actualización
  const handleUpdate = async (formData: any) => {
    try {
      await fichasService.actualizarSocioEconomico(id as string, formData);
      alert("Ficha actualizada con éxito");
      router.push("/fichas"); // Redirección tras éxito
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Ocurrió un error al guardar los cambios");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <>
      <PageMeta title="Editar Ficha Socioeconómica | Udipsai" description="Editar ficha socioeconómica existente" />
      <PageBreadcrumb
        pageTitle="Editar Ficha Socioeconómica"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Editar Ficha Socioeconómica" },
        ]}
      />
      <div className="grid grid-cols-1 gap-6">
        {/* Pasamos initialData para llenar el form y handleUpdate para el submit */}
        <FormularioSocioEconomico 
            isEdit={true} 
            initialData={data} 
            onSave={handleUpdate} 
        />
      </div>
    </>
  );
}