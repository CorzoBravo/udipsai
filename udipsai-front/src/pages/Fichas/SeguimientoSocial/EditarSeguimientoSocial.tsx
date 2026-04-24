import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router'; 
import FormularioSeguimientoSocial from '../../../components/form/fichas-form/FormularioSeguimientoSocial';
import PageBreadCrumb from '../../../components/common/PageBreadCrumb';
import { toast } from 'react-toastify';
import api from '../../../api/api';

const EditarSeguimientoSocial: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();s
  const [pacienteId, setPacienteId] = useState<number | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await api.get(`/api/seguimientos-sociales/${id}`);
        setPacienteId(response.data.pacienteId);
      } catch (error) {
        toast.error("Error al cargar los datos de la ficha");
      }
    };
    cargarDatos();
  }, [id]);

  if (!pacienteId) return <div className="p-10">Cargando...</div>;

  return (
    <div>
      <PageBreadCrumb pageTitle="Editar Ficha de Seguimiento Social" />
      <div className="mt-6">
        <FormularioSeguimientoSocial 
          pacienteId={pacienteId} 
          fichaId={Number(id)} // Asegúrate de que tu formulario acepte fichaId para modo edición
          onSuccess={() => navigate('/fichas?tab=seguimiento_social')} 
        />
      </div>
    </div>
  );
};

export default EditarSeguimientoSocial;