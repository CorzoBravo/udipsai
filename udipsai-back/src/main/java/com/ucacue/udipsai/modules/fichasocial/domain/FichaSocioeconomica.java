package com.ucacue.udipsai.modules.fichasocial.domain;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.fichasocial.domain.components.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "fichas_socioeconomicas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FichaSocioeconomica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_numero_ficha")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", referencedColumnName = "id")
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialista_id", referencedColumnName = "id")
    private Especialista especialista;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_elaboracion")
    private Date fechaElaboracion;

    // --- Componentes @Embeddable (Mapeo de Secciones del Documento) ---

    @Embedded
    private RiesgosSociales riesgosSociales;

    @Embedded
    private VulnerabilidadDetalle vulnerabilidad;

    @Embedded
    private DinamicaFamiliar dinamicaFamiliar;

    @Embedded
    private ViviendaHabitabilidad vivienda;

    @Embedded
    private SituacionSalud salud;

    @Embedded
    private DesgloseEconomico desgloseEconomico;

    @Embedded
    private SituacionEconomica situacionEconomica;

    // --- Campos de Cierre y Reporte ---

    @Column(name = "conclusiones_finales", columnDefinition = "TEXT")
    private String conclusiones;

    @Column(name = "recomendaciones_finales", columnDefinition = "TEXT")
    private String recomendaciones;

    @Column(name = "nombre_responsable_registro")
    private String responsable;

    // --- Relación de Detalle (Tabla de Conformación Familiar) ---

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FichaSocioFamiliar> familiares = new ArrayList<>();

}