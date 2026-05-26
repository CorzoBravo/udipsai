import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import FormularioInformeSocial from "../../../components/form/fichas-form/FormularioInformeSocial";

export default function EditarInformeSocial() {
  return (
    <>
      <PageMeta
        title="Editar Informe Social | Udipsai"
        description="Editar informe social existente"
      />
      <PageBreadcrumb
        pageTitle="Editar Informe Social"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Fichas", path: "/fichas" },
          { label: "Editar Informe Social" },
        ]}
      />
      <FormularioInformeSocial />
    </>
  );
}
