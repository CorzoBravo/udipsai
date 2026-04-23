package com.ucacue.udipsai.modules.fichasocial.domain;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "seguimientos_sociales_fichas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeguimientoSocialFicha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    // Relación con la tabla pacientes
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", referencedColumnName = "id", nullable = false)
    private Paciente paciente;

    @Column(name = "area_acompanamiento", length = 255)
    private String areaAcompanamiento;

    @Column(name = "numero_seguimiento")
    private Integer numeroSeguimiento;

    @Column(name = "objetivo", columnDefinition = "TEXT")
    private String objetivo;

    @Column(name = "fecha")
    @Temporal(TemporalType.DATE)
    private Date fecha;

    @Column(name = "participantes", columnDefinition = "TEXT")
    private String participantes;

    @Column(name = "actividades", columnDefinition = "TEXT")
    private String actividades;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "firma_visitador_url", length = 255)
    private String firmaVisitadorUrl;

    @Column(name = "firma_usuario_url", length = 255)
    private String firmaUsuarioUrl;
}