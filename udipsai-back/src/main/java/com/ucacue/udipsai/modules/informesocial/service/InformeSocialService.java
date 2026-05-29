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
import com.ucacue.udipsai.modules.familiar.domain.Familiar;
import com.ucacue.udipsai.modules.familiar.dto.FamiliarDTO;
import com.ucacue.udipsai.modules.familiar.dto.FamiliarRequest;
import com.ucacue.udipsai.modules.familiar.service.FamiliarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.ucacue.udipsai.modules.fichasocial.domain.FichaSocioeconomica;
import com.ucacue.udipsai.modules.fichasocial.repository.FichaSocioeconomicaRepository;

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
    private FamiliarService familiarService;

    @Transactional
    public InformeSocialDTO crearInforme(InformeSocialRequest request, MultipartFile genograma, MultipartFile ecomapa) {
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(paciente.getId(), true);
        if (ficha == null) {
            throw new RuntimeException("No existe ficha socioeconómica activa. Cree una ficha primero en el módulo de fichas socioeconómicas");
        }

        InformeSocial informe = new InformeSocial();
        informe.setPaciente(paciente);
        informe.setNumFicha(request.getNumFicha());
        informe.setFechaElaboracion(new java.util.Date());

        informe.setTipoFamilia(request.getTipoFamilia());
        informe.setTipoFamiliaEspecificar(request.getTipoFamiliaEspecificar());

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

        InformeSocial saved = informeRepository.save(informe);

        if (request.getInformante() != null) {
            procesarInformante(request.getInformante(), paciente.getId(), saved.getId().longValue());
        }

        return convertirADTO(saved, ficha);
    }

    private void procesarInformante(FamiliarDTO fDto, Integer pacienteId, Long informeId) {
        FamiliarRequest fReq = new FamiliarRequest();
        fReq.setRelacion(fDto.getRelacion());
        fReq.setNombresApellidos(fDto.getNombresApellidos());
        fReq.setEdad(fDto.getEdad());
        fReq.setEstadoCivil(fDto.getEstadoCivil());
        fReq.setInstruccion(fDto.getInstruccion());
        fReq.setOcupacion(fDto.getOcupacion());
        fReq.setIngresoMensual(fDto.getIngresoMensual());
        fReq.setCedula(fDto.getCedula());
        fReq.setNumeroTelefono(fDto.getNumeroTelefono());
        fReq.setCorreoElectronico(fDto.getCorreoElectronico());
        fReq.setProblemasSalud(fDto.getProblemasSalud());
        fReq.setDescripProblemasSalud(fDto.getDescripProblemasSalud());
        fReq.setEnfermedadCatastrofica(fDto.getEnfermedadCatastrofica());
        fReq.setDescripEnfermedadCatastrofica(fDto.getDescripEnfermedadCatastrofica());
        fReq.setDiscapacidad(fDto.getDiscapacidad());
        fReq.setDescripDiscapacidad(fDto.getDescripDiscapacidad());

        FamiliarDTO guardado;
        if (fDto.getId() != null) {
            guardado = familiarService.actualizarFamiliar(fDto.getId().longValue(), fReq);
        } else {
            guardado = familiarService.crearFamiliar(pacienteId, fReq);
        }

       
        Familiar informanteActual = familiarService.obtenerInformante(informeId);
        if (informanteActual == null || !informanteActual.getId().equals(guardado.getId())) {
            familiarService.vincularFamiliarAInforme(guardado.getId(), informeId, true);
        }
    }

    @Transactional(readOnly = true)
    public List<InformeSocialDTO> listarInformes() {
        return informeRepository.findAll().stream()
                .filter(i -> Boolean.TRUE.equals(i.getActivo()))
                .map(i -> {
                    FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(i.getPaciente().getId(), true);
                    return convertirADTO(i, ficha);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InformeSocialDTO obtenerPorId(Integer id) {
        InformeSocial informe = informeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Informe social no encontrado"));
        if (!Boolean.TRUE.equals(informe.getActivo())) {
            throw new RuntimeException("El informe social está inactivo");
        }
        FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(informe.getPaciente().getId(), true);
        return convertirADTO(informe, ficha);
    }

    @Transactional(readOnly = true)
    public InformeSocialDTO obtenerPorPacienteCedula(String cedula) {
        Paciente paciente = pacienteRepository.findByCedula(cedula).orElse(null);
        if (paciente == null) {
            return null;
        }
        List<InformeSocial> informes = informeRepository.findByPacienteIdAndActivoTrue(paciente.getId());
        InformeSocial informe = !informes.isEmpty() ? informes.get(0) : null;
        if (informe != null) {
            FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(paciente.getId(), true);
            return convertirADTO(informe, ficha);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public InformeSocialDTO obtenerPorPacienteId(Integer pacienteId) {
        List<InformeSocial> informes = informeRepository.findByPacienteIdAndActivoTrue(pacienteId);
        InformeSocial informe = !informes.isEmpty() ? informes.get(0) : null;
        if (informe != null) {
            FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(pacienteId, true);
            return convertirADTO(informe, ficha);
        }
        return null;
    }

    @Transactional
    public InformeSocialDTO actualizarInforme(Integer id, InformeSocialRequest request,
            MultipartFile genograma, MultipartFile ecomapa) {
        InformeSocial informe = informeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Informe social no encontrado"));

        if (!Boolean.TRUE.equals(informe.getActivo())) {
            throw new RuntimeException("No se puede editar un informe inactivo");
        }

        FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(informe.getPaciente().getId(), true);
        if (ficha == null) {
            throw new RuntimeException("No existe ficha socioeconómica activa para este paciente");
        }

        if (genograma != null && !genograma.isEmpty()) {
            informe.setGenogramaUrl(storageService.store(genograma));
        }
        if (ecomapa != null && !ecomapa.isEmpty()) {
            informe.setEcomapaUrl(storageService.store(ecomapa));
        }

        informe.setTipoFamilia(request.getTipoFamilia());
        informe.setTipoFamiliaEspecificar(request.getTipoFamiliaEspecificar());

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

        InformeSocial saved = informeRepository.save(informe);

        if (request.getInformante() != null) {
            procesarInformante(request.getInformante(), informe.getPaciente().getId(), saved.getId().longValue());
        }

        return convertirADTO(saved, ficha);
    }

    @Transactional
    public void eliminarInforme(Integer id) {
        informeRepository.findById(id).ifPresent(informe -> {
            informe.setActivo(false);
            informeRepository.save(informe);
        });
    }

    @Transactional
    public InformeSocialDTO actualizarFamiliarEspecifico(Integer informeId, Integer familiarId, InformeSocialFamiliarDTO familiarDTO) {
        InformeSocial informe = informeRepository.findById(informeId)
                .orElseThrow(() -> new RuntimeException("Informe social no encontrado"));

        if (!Boolean.TRUE.equals(informe.getActivo())) {
            throw new RuntimeException("No se puede editar un informe inactivo");
        }

        Familiar familiar = familiarService.obtenerFamiliarPorId(familiarId.longValue())
                .orElseThrow(() -> new RuntimeException("Familiar no encontrado"));

        FamiliarRequest fReq = new FamiliarRequest();
        fReq.setRelacion(familiar.getRelacion());
        fReq.setNombresApellidos(familiar.getNombresApellidos());
        fReq.setEdad(familiar.getEdad());
        fReq.setEstadoCivil(familiar.getEstadoCivil());
        fReq.setInstruccion(familiar.getInstruccion());
        fReq.setOcupacion(familiar.getOcupacion());
        fReq.setIngresoMensual(familiar.getIngresoMensual());
        fReq.setProblemasSalud(familiar.getProblemasSalud());
        fReq.setDescripProblemasSalud(familiar.getDescripProblemasSalud());
        fReq.setEnfermedadCatastrofica(familiar.getEnfermedadCatastrofica());
        fReq.setDescripEnfermedadCatastrofica(familiar.getDescripEnfermedadCatastrofica());
        fReq.setDiscapacidad(familiar.getDiscapacidad());
        fReq.setDescripDiscapacidad(familiar.getDescripDiscapacidad());
        
        fReq.setCedula(familiarDTO.getCedula());
        fReq.setNumeroTelefono(familiarDTO.getTelefono());
        fReq.setCorreoElectronico(familiarDTO.getCorreo());

        familiarService.actualizarFamiliar(familiarId.longValue(), fReq);

        FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(informe.getPaciente().getId(), true);
        return convertirADTO(informe, ficha);
    }

    private InformeSocialDTO convertirADTO(InformeSocial entity, FichaSocioeconomica ficha) {
        InformeSocialDTO dto = new InformeSocialDTO();
        dto.setId(entity.getId());
        dto.setNumFicha(entity.getNumFicha());
        dto.setFechaElaboracion(entity.getFechaElaboracion());
        dto.setGenogramaUrl(entity.getGenogramaUrl());
        dto.setEcomapaUrl(entity.getEcomapaUrl());

        dto.setTipoFamilia(entity.getTipoFamilia());
        dto.setTipoFamiliaEspecificar(entity.getTipoFamiliaEspecificar());

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

        Familiar informante = familiarService.obtenerInformante(entity.getId().longValue());
        if (informante != null) {
            FamiliarDTO fDto = new FamiliarDTO();
            fDto.setId(informante.getId());
            fDto.setPacienteId(informante.getPaciente().getId());
            fDto.setRelacion(informante.getRelacion());
            fDto.setNombresApellidos(informante.getNombresApellidos());
            fDto.setEdad(informante.getEdad());
            fDto.setEstadoCivil(informante.getEstadoCivil());
            fDto.setInstruccion(informante.getInstruccion());
            fDto.setOcupacion(informante.getOcupacion());
            fDto.setIngresoMensual(informante.getIngresoMensual());
            fDto.setCedula(informante.getCedula());
            fDto.setNumeroTelefono(informante.getNumeroTelefono());
            fDto.setCorreoElectronico(informante.getCorreoElectronico());
            fDto.setProblemasSalud(informante.getProblemasSalud());
            fDto.setDescripProblemasSalud(informante.getDescripProblemasSalud());
            fDto.setEnfermedadCatastrofica(informante.getEnfermedadCatastrofica());
            fDto.setDescripEnfermedadCatastrofica(informante.getDescripEnfermedadCatastrofica());
            fDto.setDiscapacidad(informante.getDiscapacidad());
            fDto.setDescripDiscapacidad(informante.getDescripDiscapacidad());
            fDto.setActivo(informante.getActivo());
            dto.setInformante(fDto);
        }

        if (entity.getPaciente() != null) {
            dto.setPaciente(new PacienteFichaDTO(
                    entity.getPaciente().getId(),
                    entity.getPaciente().getNombresApellidos(),
                    entity.getPaciente().getCedula()));
        }

        if (entity.getPaciente() != null && ficha != null) {
            List<Familiar> fichaFamiliares = familiarService.obtenerFamiliaresPorEntidad("FICHA", ficha.getId().longValue());
            if (fichaFamiliares != null) {
                dto.setFamiliares(fichaFamiliares.stream().map(f -> {
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