import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioSocioEconomico from "../../../components/form/fichas-form/FormularioSocioEconomico";

export default function EditarSocioEconomico() {
  return (
    <>
      <PageMeta
        title="Editar Ficha Socioeconómica | Udipsai"
        description="Editar ficha socioeconómica existente"
      />
      <PageBreadcrumb
        pageTitle="Editar Ficha Socioeconómica"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Editar Ficha Socioeconómica" },
        ]}
      />
      <div className="grid grid-cols-1 gap-6">
        <FormularioSocioEconomico isEdit={true} />
      </div>
    </>
  );
}