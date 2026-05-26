package com.ucacue.udipsai.modules.fichasocial.domain.components;

import com.ucacue.udipsai.modules.fichasocial.domain.FichaSocioeconomica;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ficha_socio_familiares")
@Data

public class FichaSocioFamiliar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ficha_id", nullable = false)
    private FichaSocioeconomica ficha;

    private String relacion;
    private String nombresApellidos;
    private Integer edad;
    private String estadoCivil;
    private String instruccion;
    private String ocupacion;
    private Double ingresoMensual;

    @Column(length = 15)
    private String cedula;

    @Column(name = "numero_telefono", length = 20)
    private String numeroTelefono;

    @Column(length = 100)
    private String correoElectronico;

    @Column(name = "problemas_salud_familiar")
    private Boolean problemasSaludFamiliar;

    @Column(name = "descrip_problemas_salud_familiar")
    private String descripProblemasSaludFamiliar;

    @Column(name = "enfermedad_catastrofica")
    private Boolean enfermedadCatastrofica;

    @Column(name = "descrip_enfermedad_catastrofica")
    private String descripEnfermedadCatastrofica;

    @Column(name = "discapacidad")
    private Boolean discapacidad;

    @Column(name = "descrip_discapacidad")
    private String descripDiscapacidad;
}