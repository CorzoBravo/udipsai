package com.ucacue.udipsai.modules.fichasocial.dto;

import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InformeSocialDTO {
    private Integer id;
    private PacienteFichaDTO paciente;
    private String numFicha;
    private Date fechaElaboracion;
    
   
    private String genogramaUrl;
    private String ecomapaUrl;

    private String descripcionDinamicaFamiliar;
    private String situacionEconomica;
    private String situacionHabitabilidad;
    private String situacionLaboral;
    private String situacionEntorno;
    private String situacionEducativoCultural;
    private String situacionSalud;
    private String situacionLegal;
    private String valoracionProfesional;
    private String recomendaciones;

    private String elaboradoPor;
    private List<InformeSocialFamiliarDTO> familiares;
}