package com.ucacue.udipsai.modules.informesocial.domain;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "informes_sociales")
@Data
public class InformeSocial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @Column(name = "num_ficha")
    private String numFicha;

    @Column(name = "fecha_elaboracion")
    private Date fechaElaboracion;

    @Column(name = "activo")
    private Boolean activo = true;

    // Rutas de imágenes procesadas por StorageService
    private String genogramaUrl;
    private String ecomapaUrl;

    // Secciones de texto extenso del documento
    @Column(columnDefinition = "TEXT")
    private String descripcionDinamicaFamiliar;
    
    @Column(columnDefinition = "TEXT")
    private String situacionEconomica;
    
    @Column(columnDefinition = "TEXT")
    private String situacionHabitabilidad;
    
    @Column(columnDefinition = "TEXT")
    private String situacionLaboral;
    
    @Column(columnDefinition = "TEXT")
    private String situacionEntorno;
    
    @Column(columnDefinition = "TEXT")
    private String situacionEducativoCultural;
    
    @Column(columnDefinition = "TEXT")
    private String situacionSalud;

    @Column(columnDefinition = "TEXT")
    private String situacionLegal;
    
    @Column(columnDefinition = "TEXT")
    private String valoracionProfesional;
    
    @Column(columnDefinition = "TEXT")
    private String recomendaciones;

    private String elaboradoPor;

    @OneToMany(mappedBy = "informe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InformeSocialFamiliar> familiares = new ArrayList<>();
}