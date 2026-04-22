package com.ucacue.udipsai.modules.fichasocial.dto;

import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaDTO;
import com.ucacue.udipsai.modules.fichasocial.domain.components.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class FichaSocioeconomicaDTO {
    private Integer id;
    private PacienteFichaDTO paciente;
    private EspecialistaDTO especialista;
    private Boolean activo;
    private Date fechaElaboracion;
    
    // --- Componentes @Embeddable ---
    private RiesgosSociales riesgosSociales;
    private VulnerabilidadDetalle vulnerabilidad;
    private DinamicaFamiliar dinamicaFamiliar;
    private ViviendaHabitabilidad vivienda;
    private SituacionSalud salud;
    private DesgloseEconomico desgloseEconomico;
    private SituacionEconomica situacionEconomica;
    
    // --- Campos de Texto y Listas ---
    private String conclusiones;
    private String recomendaciones;
    private String responsable;
    private List<FamiliarDTO> familiares;
}