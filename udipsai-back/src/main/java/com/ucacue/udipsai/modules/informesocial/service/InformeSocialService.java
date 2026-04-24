package com.ucacue.udipsai.modules.informesocial.service;

import com.ucacue.udipsai.infrastructure.storage.StorageService;
import com.ucacue.udipsai.modules.informesocial.domain.InformeSocial;
import com.ucacue.udipsai.modules.informesocial.domain.InformeSocialFamiliar;
import com.ucacue.udipsai.modules.informesocial.dto.InformeSocialDTO;
import com.ucacue.udipsai.modules.informesocial.dto.InformeSocialRequest;
import com.ucacue.udipsai.modules.informesocial.repository.InformeSocialRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;

@Service
public class InformeSocialService {

    @Autowired private InformeSocialRepository informeRepository;
    @Autowired private PacienteRepository pacienteRepository;
    @Autowired private StorageService storageService;

    @Transactional
    public InformeSocialDTO crearInforme(InformeSocialRequest request, MultipartFile genograma, MultipartFile ecomapa) {
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        InformeSocial informe = new InformeSocial();
        informe.setPaciente(paciente);
        informe.setNumFicha(request.getNumFicha());
        informe.setFechaElaboracion(new java.util.Date());

        // Procesamiento de imágenes con StorageService
        if (genograma != null && !genograma.isEmpty()) {
            informe.setGenogramaUrl(storageService.store(genograma));
        }
        if (ecomapa != null && !ecomapa.isEmpty()) {
            informe.setEcomapaUrl(storageService.store(ecomapa));
        }

        // Mapeo de bloques de texto
        informe.setSituacionEconomica(request.getSituacionEconomica());
        informe.setSituacionHabitabilidad(request.getSituacionHabitabilidad());
        informe.setValoracionProfesional(request.getValoracionProfesional());
        informe.setRecomendaciones(request.getRecomendaciones());
        informe.setElaboradoPor(request.getElaboradoPor());

        // Persistencia en cascada de familiares
        if (request.getFamiliares() != null) {
            informe.setFamiliares(request.getFamiliares().stream().map(fDto -> {
                InformeSocialFamiliar familiar = new InformeSocialFamiliar();
                familiar.setNombres(fDto.getNombres());
                familiar.setParentesco(fDto.getParentesco());
                familiar.setIngresos(fDto.getIngresos());
                familiar.setInforme(informe);
                return familiar;
            }).collect(Collectors.toList()));
        }

        return convertirADTO(informeRepository.save(informe));
    }

    private InformeSocialDTO convertirADTO(InformeSocial entity) {
        // Lógica de conversión a DTO incluyendo URLs de StorageService
        return new InformeSocialDTO(); 
    }
}