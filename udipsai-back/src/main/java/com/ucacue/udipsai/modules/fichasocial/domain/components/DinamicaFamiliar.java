package com.ucacue.udipsai.modules.fichasocial.domain.components;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class DinamicaFamiliar {

    @Column(name = "resolucion_conflictos_familiares", columnDefinition = "TEXT")
    private String resolucionConflictos;

    @Column(name = "quienes_incumplen_reglas", columnDefinition = "TEXT")
    private String quienesIncumplenReglas;

    @Column(name = "actividades_hogar_compartidas", columnDefinition = "TEXT")
    private String actividadesCompartidas;

    @Column(name = "relacion_hermanos")
    private String relacionHermanos; 

    @Column(name = "relacion_padres_hijos")
    private String relacionPadresHijos;

    @Column(name = "comunicacion_familiar")
    private String comunicacionFamiliar;

    @Column(name = "tipo_hogar_descripcion")
    private String tipoHogar;
}