import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import FormularioSeguimientoSocial from '../../../components/form/fichas-form/FormularioSeguimientoSocial';
import PageBreadCrumb from '../../../components/common/PageBreadCrumb';
import PatientSelector from '../../../components/common/PatientSelector';

const NuevaSeguimientoSocial: React.FC = () => {
  const navigate = useNavigate();
  // Estado para almacenar el paciente seleccionado
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  return (
    <div>
      <PageBreadCrumb pageTitle="Nueva Ficha de Seguimiento Social" />
      <div className="mt-6">
        {!selectedPatient ? (
          /* Muestra el buscador original del proyecto */
          <PatientSelector 
            onSelect={(patient) => setSelectedPatient(patient)} 
          />
        ) : (
          /* Una vez seleccionado, muestra el formulario con el ID real */
          <FormularioSeguimientoSocial 
            pacienteId={selectedPatient.id} 
            onSuccess={() => navigate('/fichas?tab=seguimiento_social')} 
          />
        )}
      </div>
    </div>
  );
};

export default NuevaSeguimientoSocial;