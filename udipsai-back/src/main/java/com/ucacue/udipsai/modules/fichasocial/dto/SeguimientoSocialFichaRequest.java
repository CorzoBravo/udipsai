package com.ucacue.udipsai.modules.fichasocial.dto;

import lombok.Data;

import java.time.LocalDate;


@Data
public class SeguimientoSocialFichaRequest {
    private Integer pacienteId;
    private String areaAcompanamiento;
    private Integer numeroSeguimiento;
    private LocalDate fecha;
    
    // Campos del Visitador y Ubicación
    private String nombreVisitador;
    private String apellidoVisitador;
    private String direccionVisita;
    
    // Contenido técnico
    private String objetivo;
    private String participantes;
    private String actividades;
    private String observaciones;
    
    
    private String lugarFirma; 
    private String nombreRepresentante;
    private String rolEscuela;
    private String nombrePersonalEscuela;
    private String especificarOtro;
}