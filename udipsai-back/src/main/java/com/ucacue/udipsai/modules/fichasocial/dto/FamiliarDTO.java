package com.ucacue.udipsai.modules.fichasocial.dto;

import lombok.Data;

@Data
public class FamiliarDTO {
    private String relacion;
    private String nombresApellidos;
    private Integer edad;
    private String estadoCivil;
    private String instruccion;
    private String ocupacion;
    private Double ingresoMensual;
    private Boolean problemas_salud;
    private String descripProblemasSaludFamiliar;
    private Boolean enfermedad_catastrofica;
    private String descripEnfermedadCatastrofica;
    private Boolean discapacidad;
    private String descripDiscapacidad;
}