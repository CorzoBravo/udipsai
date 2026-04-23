package com.ucacue.udipsai.modules.fichasocial.dto;
import lombok.Data;
import java.util.Date;

@Data
public class SeguimientoSocialFichaDTO {
    private Integer id;
    private Integer pacienteId;
    private String pacienteNombre; // Para mostrar el nombre del paciente en la respuesta
    private String areaAcompanamiento;
    private Integer numeroSeguimiento;
    private String objetivo;
    private Date fecha;
    private String participantes;
    private String actividades;
    private String observaciones;
    private String firmaVisitadorUrl;
    private String firmaUsuarioUrl;
    private Boolean activo;
}