package com.ucacue.udipsai.modules.fichasocial.Service;

import com.ucacue.udipsai.modules.fichasocial.domain.SeguimientoSocialFicha;
import com.ucacue.udipsai.modules.fichasocial.dto.SeguimientoSocialFichaDTO;
import com.ucacue.udipsai.modules.fichasocial.dto.SeguimientoSocialFichaRequest;
import com.ucacue.udipsai.modules.fichasocial.repository.SeguimientoSocialFichaRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeguimientoSocialFichaService {

    private final SeguimientoSocialFichaRepository seguimientoRepository;
    private final PacienteRepository pacienteRepository;

    // --- 1. Crear un nuevo seguimiento ---
    public SeguimientoSocialFichaDTO crearSeguimiento(SeguimientoSocialFichaRequest request) {
        // Buscamos que el paciente exista
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + request.getPacienteId()));

        SeguimientoSocialFicha seguimiento = new SeguimientoSocialFicha();
        seguimiento.setPaciente(paciente);
        seguimiento.setAreaAcompanamiento(request.getAreaAcompanamiento());
        seguimiento.setNumeroSeguimiento(request.getNumeroSeguimiento());
        seguimiento.setObjetivo(request.getObjetivo());
        seguimiento.setFecha(request.getFecha());
        seguimiento.setParticipantes(request.getParticipantes());
        seguimiento.setActividades(request.getActividades());
        seguimiento.setObservaciones(request.getObservaciones());
        seguimiento.setFirmaVisitadorUrl(request.getFirmaVisitadorUrl());
        seguimiento.setFirmaUsuarioUrl(request.getFirmaUsuarioUrl());

        seguimiento = seguimientoRepository.save(seguimiento);
        return mapToDTO(seguimiento);
    }

    // --- 2. Listar seguimientos de un paciente ---
    public List<SeguimientoSocialFichaDTO> listarPorPaciente(Integer pacienteId) {
        return seguimientoRepository.findByPacienteIdAndActivoTrue(pacienteId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
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
        
        dto.setAreaAcompanamiento(entity.getAreaAcompanamiento());
        dto.setNumeroSeguimiento(entity.getNumeroSeguimiento());
        dto.setObjetivo(entity.getObjetivo());
        dto.setFecha(entity.getFecha());
        dto.setParticipantes(entity.getParticipantes());
        dto.setActividades(entity.getActividades());
        dto.setObservaciones(entity.getObservaciones());
        dto.setFirmaVisitadorUrl(entity.getFirmaVisitadorUrl());
        dto.setFirmaUsuarioUrl(entity.getFirmaUsuarioUrl());
        dto.setActivo(entity.getActivo());
        
        return dto;
    }
}