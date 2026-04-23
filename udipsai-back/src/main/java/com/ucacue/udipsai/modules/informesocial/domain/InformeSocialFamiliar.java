package com.ucacue.udipsai.modules.informesocial.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "informe_social_familiares")
@Data
public class InformeSocialFamiliar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombres;
    private String parentesco;
    private String estadoCivil;
    private Integer edad;
    private Double ingresos;
    private String instruccion;
    private String ocupacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "informe_id")
    private InformeSocial informe;
}