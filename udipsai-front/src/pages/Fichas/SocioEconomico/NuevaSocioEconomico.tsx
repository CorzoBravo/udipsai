import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioSocioEconomico from "../../../components/form/fichas-form/FormularioSocioEconomico";

export default function NuevaSocioEconomico() {
  return (
    <>
      <PageMeta
        title="Nueva Ficha Socioeconómica | Udipsai"
        description="Crear una nueva ficha socioeconómica"
      />
      <PageBreadcrumb
        pageTitle="Nueva Ficha Socioeconómica"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Nueva Ficha Socioeconómica" },
        ]}
      />
      <div className="grid grid-cols-1 gap-6">
        <FormularioSocioEconomico />
      </div>
    </>
  );
}