package com.ucacue.udipsai.modules.informesocial.service;

import com.ucacue.udipsai.infrastructure.storage.StorageService;
import com.ucacue.udipsai.modules.informesocial.domain.InformeSocial;
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
import com.ucacue.udipsai.modules.fichasocial.domain.FichaSocioeconomica;
import com.ucacue.udipsai.modules.fichasocial.domain.components.FichaSocioFamiliar;
import com.ucacue.udipsai.modules.fichasocial.repository.FichaSocioeconomicaRepository;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InformeSocialService {

    @Autowired
    private InformeSocialRepository informeRepository;
    @Autowired
    private PacienteRepository pacienteRepository;
    @Autowired
    private StorageService storageService;
    @Autowired
    private FichaSocioeconomicaRepository fichaRepository;
    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Transactional
    public InformeSocialDTO crearInforme(InformeSocialRequest request, MultipartFile genograma, MultipartFile ecomapa) {
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        InformeSocial informe = new InformeSocial();
        informe.setPaciente(paciente);
        informe.setNumFicha(request.getNumFicha());
        informe.setFechaElaboracion(new java.util.Date());

        informe.setTipoFamilia(request.getTipoFamilia());
        informe.setTipoFamiliaEspecificar(request.getTipoFamiliaEspecificar());

        informe.setInformanteNombre(request.getInformanteNombre());
        informe.setInformanteParentesco(request.getInformanteParentesco());
        informe.setInformanteCedula(request.getInformanteCedula());
        informe.setInformanteTelefono(request.getInformanteTelefono());
        informe.setInformanteCorreo(request.getInformanteCorreo());

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

        FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(paciente.getId(), true);
        if (ficha == null) {
            ficha = new FichaSocioeconomica();
            ficha.setPaciente(paciente);
            ficha.setActivo(true);
            ficha.setFechaElaboracion(new java.util.Date());
            if (request.getEspecialistaId() != null) {
                com.ucacue.udipsai.modules.especialistas.domain.Especialista esp = especialistaRepository
                        .findById(request.getEspecialistaId()).orElse(null);
                ficha.setEspecialista(esp);
            }
            ficha = fichaRepository.save(ficha);
        }

        if (request.getFamiliares() != null) {
            ficha.getFamiliares().clear();
            for (com.ucacue.udipsai.modules.informesocial.dto.InformeSocialFamiliarDTO fDto : request.getFamiliares()) {
                FichaSocioFamiliar familiar = new FichaSocioFamiliar();
                familiar.setRelacion(fDto.getParentesco());
                familiar.setNombresApellidos(fDto.getNombres());
                familiar.setEdad(fDto.getEdad());
                familiar.setEstadoCivil(fDto.getEstadoCivil());
                familiar.setInstruccion(fDto.getInstruccion());
                familiar.setOcupacion(fDto.getOcupacion());
                familiar.setIngresoMensual(fDto.getIngresos());
                familiar.setCedula(fDto.getCedula());
                familiar.setNumeroTelefono(fDto.getTelefono());
                familiar.setCorreoElectronico(fDto.getCorreo());
                familiar.setFicha(ficha);
                familiar.setFicha(ficha);
                ficha.getFamiliares().add(familiar);
            }
            fichaRepository.save(ficha);
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
        List<InformeSocial> informes = informeRepository.findByPacienteIdAndActivoTrue(paciente.getId());
        InformeSocial informe = !informes.isEmpty() ? informes.get(0) : null;
        return (informe != null) ? convertirADTO(informe) : null;
    }

    @Transactional(readOnly = true)
    public InformeSocialDTO obtenerPorPacienteId(Integer pacienteId) {
        List<InformeSocial> informes = informeRepository.findByPacienteIdAndActivoTrue(pacienteId);
        InformeSocial informe = !informes.isEmpty() ? informes.get(0) : null;
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

        informe.setTipoFamilia(request.getTipoFamilia());
        informe.setTipoFamiliaEspecificar(request.getTipoFamiliaEspecificar());

        informe.setInformanteNombre(request.getInformanteNombre());
        informe.setInformanteParentesco(request.getInformanteParentesco());
        informe.setInformanteCedula(request.getInformanteCedula());
        informe.setInformanteTelefono(request.getInformanteTelefono());
        informe.setInformanteCorreo(request.getInformanteCorreo());

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

        FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(informe.getPaciente().getId(), true);
        if (ficha == null) {
            ficha = new FichaSocioeconomica();
            ficha.setPaciente(informe.getPaciente());
            ficha.setActivo(true);
            ficha.setFechaElaboracion(new java.util.Date());
            if (request.getEspecialistaId() != null) {
                com.ucacue.udipsai.modules.especialistas.domain.Especialista esp = especialistaRepository
                        .findById(request.getEspecialistaId()).orElse(null);
                ficha.setEspecialista(esp);
            }
            ficha = fichaRepository.save(ficha);
        }

        if (request.getFamiliares() != null) {
            ficha.getFamiliares().clear();
            for (com.ucacue.udipsai.modules.informesocial.dto.InformeSocialFamiliarDTO fDto : request.getFamiliares()) {
                FichaSocioFamiliar familiar = new FichaSocioFamiliar();
                familiar.setRelacion(fDto.getParentesco());
                familiar.setNombresApellidos(fDto.getNombres());
                familiar.setIngresoMensual(fDto.getIngresos());
                familiar.setCedula(fDto.getCedula());
                familiar.setNumeroTelefono(fDto.getTelefono());
                familiar.setCorreoElectronico(fDto.getCorreo());
                familiar.setFicha(ficha);
                familiar.setEstadoCivil(fDto.getEstadoCivil());
                familiar.setInstruccion(fDto.getInstruccion());
                familiar.setOcupacion(fDto.getOcupacion());
                familiar.setIngresoMensual(fDto.getIngresos());
                familiar.setFicha(ficha);
                ficha.getFamiliares().add(familiar);
            }
            fichaRepository.save(ficha);
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

        dto.setTipoFamilia(entity.getTipoFamilia());
        dto.setTipoFamiliaEspecificar(entity.getTipoFamiliaEspecificar());

        dto.setInformanteNombre(entity.getInformanteNombre());
        dto.setInformanteParentesco(entity.getInformanteParentesco());
        dto.setInformanteCedula(entity.getInformanteCedula());
        dto.setInformanteTelefono(entity.getInformanteTelefono());
        dto.setInformanteCorreo(entity.getInformanteCorreo());

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

        if (entity.getPaciente() != null) {
            FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(entity.getPaciente().getId(), true);
            if (ficha != null && ficha.getFamiliares() != null) {
                dto.setFamiliares(ficha.getFamiliares().stream().map(f -> {
                    InformeSocialFamiliarDTO fDto = new InformeSocialFamiliarDTO();
                    fDto.setId(f.getId() != null ? f.getId().intValue() : null);
                    fDto.setNombres(f.getNombresApellidos());
                    fDto.setParentesco(f.getRelacion());
                    fDto.setEstadoCivil(f.getEstadoCivil());
                    fDto.setEdad(f.getEdad());
                    fDto.setIngresos(f.getIngresoMensual());
                    fDto.setInstruccion(f.getInstruccion());
                    fDto.setOcupacion(f.getOcupacion());
                    fDto.setCedula(f.getCedula());
                    fDto.setTelefono(f.getNumeroTelefono());
                    fDto.setCorreo(f.getCorreoElectronico());
                    return fDto;
                }).collect(Collectors.toList()));
            } else {
                dto.setFamiliares(List.of());
            }
        } else {
            dto.setFamiliares(List.of());
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public org.springframework.core.io.Resource cargarGenogramaComoRecurso(Integer pacienteId) {
        List<InformeSocial> informes = informeRepository.findByPacienteIdAndActivoTrue(pacienteId);
        if (!informes.isEmpty() && informes.get(0).getGenogramaUrl() != null) {
            return storageService.loadAsResource(informes.get(0).getGenogramaUrl());
        }
        return null;
    }

    @Transactional(readOnly = true)
    public org.springframework.core.io.Resource cargarEcomapaComoRecurso(Integer pacienteId) {
        List<InformeSocial> informes = informeRepository.findByPacienteIdAndActivoTrue(pacienteId);
        if (!informes.isEmpty() && informes.get(0).getEcomapaUrl() != null) {
            return storageService.loadAsResource(informes.get(0).getEcomapaUrl());
        }
        return null;
    }
}