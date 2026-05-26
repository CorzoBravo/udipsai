package com.ucacue.udipsai.modules.informesocial.dto;

import lombok.Data;
import java.util.List;

@Data
public class InformeSocialRequest {
    private Integer pacienteId;
    private Integer especialistaId;
    private String numFicha;
    private String tipoFamilia;
    private String tipoFamiliaEspecificar;

    private String pacienteEstadoCivil;
    private String pacienteNacionalidad;
    private String pacienteSexo;

    private String informanteNombre;
    private String informanteParentesco;
    private String informanteCedula;
    private String informanteTelefono;
    private String informanteCorreo;
    
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