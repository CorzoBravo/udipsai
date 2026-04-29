package com.ucacue.udipsai.modules.fichasocial.Service;

import com.ucacue.udipsai.modules.fichasocial.domain.SeguimientoSocialFicha;
import com.ucacue.udipsai.modules.fichasocial.dto.SeguimientoSocialFichaDTO;
import com.ucacue.udipsai.modules.fichasocial.dto.SeguimientoSocialFichaRequest;
import com.ucacue.udipsai.modules.fichasocial.repository.SeguimientoSocialFichaRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeguimientoSocialFichaService {

    private final SeguimientoSocialFichaRepository seguimientoRepository;
    private final PacienteRepository pacienteRepository;

    // 1. Crear un nuevo seguimiento 
    // (Este no lleva readOnly porque sí modifica la base de datos)
    @Transactional
    public SeguimientoSocialFichaDTO crearSeguimiento(SeguimientoSocialFichaRequest request) {
        // Buscamos que el paciente exista
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + request.getPacienteId()));

        SeguimientoSocialFicha seguimiento = new SeguimientoSocialFicha();
        seguimiento.setPaciente(paciente);
     
        seguimiento.setAreaAcompanamiento(request.getAreaAcompanamiento());
        seguimiento.setNumeroSeguimiento(request.getNumeroSeguimiento());
        seguimiento.setFecha(request.getFecha());
   
        seguimiento.setNombreVisitador(request.getNombreVisitador());
        seguimiento.setApellidoVisitador(request.getApellidoVisitador());
        seguimiento.setDireccionVisita(request.getDireccionVisita());
        
        // Contenido técnico
        seguimiento.setObjetivo(request.getObjetivo());
        seguimiento.setParticipantes(request.getParticipantes());
        seguimiento.setActividades(request.getActividades());
        seguimiento.setObservaciones(request.getObservaciones());
       
        seguimiento.setLugarFirma(request.getLugarFirma());
        seguimiento.setNombreRepresentante(request.getNombreRepresentante());
        seguimiento.setRolEscuela(request.getRolEscuela());
        seguimiento.setNombrePersonalEscuela(request.getNombrePersonalEscuela());
        seguimiento.setEspecificarOtro(request.getEspecificarOtro());

        seguimiento.setActivo(true);

        seguimiento = seguimientoRepository.save(seguimiento);
        return mapToDTO(seguimiento);
    }

    // 2. Listar absolutamente todos los seguimientos (NUEVO) 
    @Transactional(readOnly = true)
    public List<SeguimientoSocialFichaDTO> listarTodos() {
        return seguimientoRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // 3. Listar seguimientos por paciente 
    @Transactional(readOnly = true)
    public List<SeguimientoSocialFichaDTO> listarPorPaciente(Integer pacienteId) {
        return seguimientoRepository.findByPacienteIdAndActivoTrue(pacienteId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    //  4. Obtener seguimiento por ID 
    @Transactional(readOnly = true)
    public SeguimientoSocialFichaDTO obtenerPorId(Integer id) {
        SeguimientoSocialFicha entity = seguimientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seguimiento no encontrado"));
        return mapToDTO(entity);
    }

    // --- Función auxiliar: Convertir Entidad a DTO ---
    private SeguimientoSocialFichaDTO mapToDTO(SeguimientoSocialFicha entity) {
        SeguimientoSocialFichaDTO dto = new SeguimientoSocialFichaDTO();
        dto.setId(entity.getId());
        dto.setPacienteId(entity.getPaciente().getId());
        dto.setPacienteNombre(entity.getPaciente().getNombresApellidos());
        dto.setPacienteCedula(entity.getPaciente().getCedula());
        
        dto.setAreaAcompanamiento(entity.getAreaAcompanamiento());
        dto.setNumeroSeguimiento(entity.getNumeroSeguimiento());
        dto.setFecha(entity.getFecha());
        
        // Campos de Visitador y Ubicación
        dto.setNombreVisitador(entity.getNombreVisitador());
        dto.setApellidoVisitador(entity.getApellidoVisitador());
        dto.setDireccionVisita(entity.getDireccionVisita());
        
        // Contenido técnico
        dto.setObjetivo(entity.getObjetivo());
        dto.setParticipantes(entity.getParticipantes());
        dto.setActividades(entity.getActividades());
        dto.setObservaciones(entity.getObservaciones());
        
        // Campos de Firma 
        dto.setLugarFirma(entity.getLugarFirma());
        dto.setNombreRepresentante(entity.getNombreRepresentante());
        dto.setRolEscuela(entity.getRolEscuela());
        dto.setNombrePersonalEscuela(entity.getNombrePersonalEscuela());
        dto.setEspecificarOtro(entity.getEspecificarOtro());
        
        dto.setActivo(entity.getActivo());
        
        return dto;
    }
}