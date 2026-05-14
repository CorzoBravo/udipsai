package com.ucacue.udipsai.modules.FichaSeguimientoSocial.repository;


import com.ucacue.udipsai.modules.FichaSeguimientoSocial.domain.SeguimientoSocialFicha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeguimientoSocialFichaRepository extends JpaRepository<SeguimientoSocialFicha, Integer> {
    
    // Método para buscar todos los seguimientos activos de un paciente específico
    List<SeguimientoSocialFicha> findByPacienteIdAndActivoTrue(Integer pacienteId);
    
}