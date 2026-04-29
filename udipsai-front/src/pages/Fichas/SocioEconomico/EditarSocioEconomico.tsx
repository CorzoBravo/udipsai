
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioSocioEconomico from "../../../components/form/fichas-form/FormularioSocioEconomica";

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
          { label: "Editar Ficha Socioeconómica" }
        ]}
      />
      <FormularioSocioEconomico />
    </>
  );
}