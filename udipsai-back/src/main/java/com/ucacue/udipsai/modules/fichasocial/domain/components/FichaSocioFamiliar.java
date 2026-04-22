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
}