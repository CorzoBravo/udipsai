package com.ucacue.udipsai.modules.fichasocial.repository;

import com.ucacue.udipsai.modules.fichasocial.domain.components.FichaSocioFamiliar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FichaSocioFamiliarRepository extends JpaRepository<FichaSocioFamiliar, Integer> {

    List<FichaSocioFamiliar> findByFichaId(Integer idFicha);
}