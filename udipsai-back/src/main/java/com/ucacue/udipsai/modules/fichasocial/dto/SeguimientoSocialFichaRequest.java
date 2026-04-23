package com.ucacue.udipsai.modules.fichasocial.dto;

import lombok.Data;
import java.util.Date;

@Data
public class SeguimientoSocialFichaRequest {
    private Integer pacienteId;
    private String areaAcompanamiento;
    private Integer numeroSeguimiento;
    private String objetivo;
    private Date fecha;
    private String participantes;
    private String actividades;
    private String observaciones;
    private String firmaVisitadorUrl;
    private String firmaUsuarioUrl;
}