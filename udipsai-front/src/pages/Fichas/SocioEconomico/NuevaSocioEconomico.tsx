import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioSocioEconomica from "../../../components/form/fichas-form/FormularioSocioEconomica";

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
        <FormularioSocioEconomica />
      </div>
    </>
  );
}