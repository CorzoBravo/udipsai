package com.ucacue.udipsai.modules.informesocial.service;

import com.ucacue.udipsai.infrastructure.storage.StorageService;
import com.ucacue.udipsai.modules.informesocial.domain.InformeSocial;
import com.ucacue.udipsai.modules.informesocial.domain.InformeSocialFamiliar;
import com.ucacue.udipsai.modules.informesocial.dto.InformeSocialDTO;
import com.ucacue.udipsai.modules.informesocial.dto.InformeSocialFamiliarDTO;
import com.ucacue.udipsai.modules.informesocial.dto.InformeSocialRequest;
import com.ucacue.udipsai.modules.informesocial.repository.InformeSocialRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
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

        
        if (genograma != null && !genograma.isEmpty()) {
            informe.setGenogramaUrl(storageService.store(genograma));
        }
        if (ecomapa != null && !ecomapa.isEmpty()) {
            informe.setEcomapaUrl(storageService.store(ecomapa));
        }

        informe.setDescripcionDinamicaFamiliar(request.getDescripcionDinamicaFamiliar());
        informe.setSituacionEconomica(request.getSituacionEconomica());
        informe.setSituacionHabitabilidad(request.getSituacionHabitabilidad());
        informe.setSituacionLaboral(request.getSituacionLaboral());
        informe.setSituacionEntorno(request.getSituacionEntorno());
        informe.setSituacionEducativoCultural(request.getSituacionEducativoCultural());
        informe.setSituacionSalud(request.getSituacionSalud());
        informe.setSituacionLegal(request.getSituacionLegal());
        informe.setValoracionProfesional(request.getValoracionProfesional());
        informe.setRecomendaciones(request.getRecomendaciones());
        informe.setElaboradoPor(request.getElaboradoPor());

        
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

    @Transactional(readOnly = true)
    public List<InformeSocialDTO> listarInformes() {
        return informeRepository.findAll().stream()
                .filter(i -> Boolean.TRUE.equals(i.getActivo()))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InformeSocialDTO obtenerPorId(Integer id) {
        InformeSocial informe = informeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Informe social no encontrado"));
        if (!Boolean.TRUE.equals(informe.getActivo())) {
            throw new RuntimeException("El informe social está inactivo");
        }
        return convertirADTO(informe);
    }

    @Transactional(readOnly = true)
    public InformeSocialDTO obtenerPorPacienteCedula(String cedula) {
        Paciente paciente = pacienteRepository.findByCedula(cedula).orElse(null);
        if (paciente == null) {
            return null;
        }
        InformeSocial informe = (InformeSocial) informeRepository.findByPacienteIdAndActivoTrue(paciente.getId());
        return (informe != null) ? convertirADTO(informe) : null;
    }

    @Transactional
    public InformeSocialDTO actualizarInforme(Integer id, InformeSocialRequest request,
            MultipartFile genograma, MultipartFile ecomapa) {
        InformeSocial informe = informeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Informe social no encontrado"));

        if (!Boolean.TRUE.equals(informe.getActivo())) {
            throw new RuntimeException("No se puede editar un informe inactivo");
        }

        if (genograma != null && !genograma.isEmpty()) {
            informe.setGenogramaUrl(storageService.store(genograma));
        }
        if (ecomapa != null && !ecomapa.isEmpty()) {
            informe.setEcomapaUrl(storageService.store(ecomapa));
        }

        informe.setDescripcionDinamicaFamiliar(request.getDescripcionDinamicaFamiliar());
        informe.setSituacionEconomica(request.getSituacionEconomica());
        informe.setSituacionHabitabilidad(request.getSituacionHabitabilidad());
        informe.setSituacionLaboral(request.getSituacionLaboral());
        informe.setSituacionEntorno(request.getSituacionEntorno());
        informe.setSituacionEducativoCultural(request.getSituacionEducativoCultural());
        informe.setSituacionSalud(request.getSituacionSalud());
        informe.setSituacionLegal(request.getSituacionLegal());
        informe.setValoracionProfesional(request.getValoracionProfesional());
        informe.setRecomendaciones(request.getRecomendaciones());
        informe.setElaboradoPor(request.getElaboradoPor());

        if (request.getFamiliares() != null) {
            informe.getFamiliares().clear();
            informe.setFamiliares(request.getFamiliares().stream().map(fDto -> {
                InformeSocialFamiliar familiar = new InformeSocialFamiliar();
                familiar.setNombres(fDto.getNombres());
                familiar.setParentesco(fDto.getParentesco());
                familiar.setEstadoCivil(fDto.getEstadoCivil());
                familiar.setEdad(fDto.getEdad());
                familiar.setIngresos(fDto.getIngresos());
                familiar.setInstruccion(fDto.getInstruccion());
                familiar.setOcupacion(fDto.getOcupacion());
                familiar.setInforme(informe);
                return familiar;
            }).collect(Collectors.toList()));
        }

        return convertirADTO(informeRepository.save(informe));
    }

    @Transactional
    public void eliminarInforme(Integer id) {
        informeRepository.findById(id).ifPresent(informe -> {
            informe.setActivo(false);
            informeRepository.save(informe);
        });
    }

    private InformeSocialDTO convertirADTO(InformeSocial entity) {
        InformeSocialDTO dto = new InformeSocialDTO();
        dto.setId(entity.getId());
        dto.setNumFicha(entity.getNumFicha());
        dto.setFechaElaboracion(entity.getFechaElaboracion());
        dto.setGenogramaUrl(entity.getGenogramaUrl());
        dto.setEcomapaUrl(entity.getEcomapaUrl());
        dto.setDescripcionDinamicaFamiliar(entity.getDescripcionDinamicaFamiliar());
        dto.setSituacionEconomica(entity.getSituacionEconomica());
        dto.setSituacionHabitabilidad(entity.getSituacionHabitabilidad());
        dto.setSituacionLaboral(entity.getSituacionLaboral());
        dto.setSituacionEntorno(entity.getSituacionEntorno());
        dto.setSituacionEducativoCultural(entity.getSituacionEducativoCultural());
        dto.setSituacionSalud(entity.getSituacionSalud());
        dto.setSituacionLegal(entity.getSituacionLegal());
        dto.setValoracionProfesional(entity.getValoracionProfesional());
        dto.setRecomendaciones(entity.getRecomendaciones());
        dto.setElaboradoPor(entity.getElaboradoPor());

        if (entity.getPaciente() != null) {
            dto.setPaciente(new PacienteFichaDTO(
                    entity.getPaciente().getId(),
                    entity.getPaciente().getNombresApellidos(),
                    entity.getPaciente().getCedula()));
        }

        if (entity.getFamiliares() != null) {
            dto.setFamiliares(entity.getFamiliares().stream().map(f -> {
                InformeSocialFamiliarDTO fDto = new InformeSocialFamiliarDTO();
                fDto.setId(f.getId());
                fDto.setNombres(f.getNombres());
                fDto.setParentesco(f.getParentesco());
                fDto.setEstadoCivil(f.getEstadoCivil());
                fDto.setEdad(f.getEdad());
                fDto.setIngresos(f.getIngresos());
                fDto.setInstruccion(f.getInstruccion());
                fDto.setOcupacion(f.getOcupacion());
                return fDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}