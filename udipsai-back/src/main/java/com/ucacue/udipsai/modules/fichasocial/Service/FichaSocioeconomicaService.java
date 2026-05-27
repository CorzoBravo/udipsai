package com.ucacue.udipsai.modules.fichasocial.Service;

import com.ucacue.udipsai.modules.fichasocial.domain.FichaSocioeconomica;
import com.ucacue.udipsai.modules.fichasocial.domain.components.DesgloseEconomico;
import com.ucacue.udipsai.modules.fichasocial.domain.components.FichaSocioFamiliar;
import com.ucacue.udipsai.modules.fichasocial.dto.FichaSocioeconomicaDTO;
import com.ucacue.udipsai.modules.fichasocial.dto.FichaSocioeconomicaRequest;
import com.ucacue.udipsai.modules.fichasocial.dto.FamiliarDTO;
import com.ucacue.udipsai.modules.fichasocial.repository.FichaSocioeconomicaRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.dto.PacienteFichaDTO;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaDTO;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FichaSocioeconomicaService {

    @Autowired
    private FichaSocioeconomicaRepository fichaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Transactional(readOnly = true)
    public List<FichaSocioeconomicaDTO> listarFichas() {
        log.info("Consultando todas las fichas socioeconómicas activas");
        return fichaRepository.findAll().stream()
                .filter(FichaSocioeconomica::getActivo)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FichaSocioeconomicaDTO obtenerFichaActivaPorPacienteId(Integer pacienteId) {
        log.info("Consultando ficha socioeconómica activa para paciente ID: {}", pacienteId);
        FichaSocioeconomica ficha = fichaRepository.findByPacienteIdAndActivo(pacienteId, true);
        return (ficha != null) ? convertirADTO(ficha) : null;
    }

    @Transactional
    public FichaSocioeconomicaDTO crearFicha(FichaSocioeconomicaRequest request) {
        log.info("Creando ficha socioeconómica para Paciente ID: {}", request.getPacienteId());

        FichaSocioeconomica existing = fichaRepository.findByPacienteIdAndActivo(request.getPacienteId(), true);
        // El siguiente bloque se encarga de inactivar la ficha anterior en caso de que
        // exista
        // esto para mantener un historial de fichas sin perder información.
        if (existing != null) {
            log.info("Archivando ficha anterior del paciente ID: {}", request.getPacienteId());
            existing.setActivo(false);
            fichaRepository.save(existing);
        }

        FichaSocioeconomica ficha = new FichaSocioeconomica();

        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Especialista especialista = especialistaRepository.findById(request.getEspecialistaId())
                .orElseThrow(() -> new RuntimeException("Especialista no encontrado"));

        ficha.setPaciente(paciente);
        ficha.setEspecialista(especialista);
        ficha.setActivo(true);

        mapRequestToEntity(request, ficha);
        procesarFamiliares(request.getFamiliares(), ficha);
        calcularIngresosDesglose(ficha);

        FichaSocioeconomica saved = fichaRepository.save(ficha);
        log.info("Ficha socioeconómica guardada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    @Transactional
    public FichaSocioeconomicaDTO actualizarFicha(Integer id, FichaSocioeconomicaRequest request) {
        log.info("Actualizando ficha socioeconómica ID: {}", id);
        FichaSocioeconomica ficha = fichaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha no encontrada"));

        if (!ficha.getActivo()) {
            throw new RuntimeException("No se puede editar una ficha inactiva");
        }

        mapRequestToEntity(request, ficha);
        procesarFamiliaresConMerge(request.getFamiliares(), ficha);
        calcularIngresosDesglose(ficha);

        FichaSocioeconomica saved = fichaRepository.save(ficha);
        return convertirADTO(saved);
    }

    private void mapRequestToEntity(FichaSocioeconomicaRequest request, FichaSocioeconomica ficha) {
        ficha.setFechaElaboracion(request.getFechaElaboracion());
        ficha.setRiesgosSociales(request.getRiesgosSociales());
        ficha.setVulnerabilidad(request.getVulnerabilidad());
        ficha.setDinamicaFamiliar(request.getDinamicaFamiliar());
        ficha.setVivienda(request.getVivienda());
        ficha.setSalud(request.getSalud());
        ficha.setDesgloseEconomico(request.getDesgloseEconomico());
        ficha.setSituacionEconomica(request.getSituacionEconomica());
        ficha.setPacienteInstruccion(request.getPacienteInstruccion());
        ficha.setPacienteOcupacion(request.getPacienteOcupacion());
        ficha.setPacienteEmail(request.getPacienteEmail());
        ficha.setPacienteNumCarne(request.getPacienteNumCarne());
        ficha.setConclusiones(request.getConclusiones());
        ficha.setRecomendaciones(request.getRecomendaciones());
        ficha.setResponsable(request.getResponsable());
    }

    private void procesarFamiliares(List<FamiliarDTO> familiaresDto, FichaSocioeconomica ficha) {
        if (familiaresDto != null) {
            for (FamiliarDTO fDto : familiaresDto) {
                FichaSocioFamiliar familiar = new FichaSocioFamiliar();
                familiar.setRelacion(fDto.getRelacion());
                familiar.setNombresApellidos(fDto.getNombresApellidos());
                familiar.setEdad(fDto.getEdad());
                familiar.setEstadoCivil(fDto.getEstadoCivil());
                familiar.setInstruccion(fDto.getInstruccion());
                familiar.setOcupacion(fDto.getOcupacion());
                familiar.setIngresoMensual(fDto.getIngresoMensual());

                familiar.setProblemasSaludFamiliar(fDto.getProblemas_salud());
                familiar.setDescripProblemasSaludFamiliar(
                        fDto.getDescripProblemasSaludFamiliar());

                familiar.setEnfermedadCatastrofica(fDto.getEnfermedad_catastrofica());
                familiar.setDescripEnfermedadCatastrofica(
                        fDto.getDescripEnfermedadCatastrofica());

                familiar.setDiscapacidad(fDto.getDiscapacidad());
                familiar.setDescripDiscapacidad(
                        fDto.getDescripDiscapacidad());

                familiar.setFicha(ficha);

                ficha.getFamiliares().add(familiar);
            }
        }
    }

    private void procesarFamiliaresConMerge(List<FamiliarDTO> familiaresDto, FichaSocioeconomica ficha) {
        if (familiaresDto == null) {
            ficha.getFamiliares().clear();
            return;
        }

        java.util.Map<Long, FichaSocioFamiliar> familiarMap = new java.util.HashMap<>();
        for (FichaSocioFamiliar f : ficha.getFamiliares()) {
            if (f.getId() != null) {
                familiarMap.put(f.getId(), f);
            }
        }

        java.util.List<FichaSocioFamiliar> familiaresActualizados = new java.util.ArrayList<>();
        for (FamiliarDTO fDto : familiaresDto) {
            FichaSocioFamiliar familiar;

            if (fDto.getId() != null && familiarMap.containsKey(fDto.getId().longValue())) {
                familiar = familiarMap.get(fDto.getId().longValue());
                familiar.setRelacion(fDto.getRelacion());
                familiar.setNombresApellidos(fDto.getNombresApellidos());
                familiar.setEdad(fDto.getEdad());
                familiar.setEstadoCivil(fDto.getEstadoCivil());
                familiar.setInstruccion(fDto.getInstruccion());
                familiar.setOcupacion(fDto.getOcupacion());
                familiar.setIngresoMensual(fDto.getIngresoMensual());

                familiar.setProblemasSaludFamiliar(fDto.getProblemas_salud());
                familiar.setDescripProblemasSaludFamiliar(fDto.getDescripProblemasSaludFamiliar());

                familiar.setEnfermedadCatastrofica(fDto.getEnfermedad_catastrofica());
                familiar.setDescripEnfermedadCatastrofica(fDto.getDescripEnfermedadCatastrofica());

                familiar.setDiscapacidad(fDto.getDiscapacidad());
                familiar.setDescripDiscapacidad(fDto.getDescripDiscapacidad());
            } else {
                familiar = new FichaSocioFamiliar();
                familiar.setRelacion(fDto.getRelacion());
                familiar.setNombresApellidos(fDto.getNombresApellidos());
                familiar.setEdad(fDto.getEdad());
                familiar.setEstadoCivil(fDto.getEstadoCivil());
                familiar.setInstruccion(fDto.getInstruccion());
                familiar.setOcupacion(fDto.getOcupacion());
                familiar.setIngresoMensual(fDto.getIngresoMensual());

                familiar.setProblemasSaludFamiliar(fDto.getProblemas_salud());
                familiar.setDescripProblemasSaludFamiliar(fDto.getDescripProblemasSaludFamiliar());

                familiar.setEnfermedadCatastrofica(fDto.getEnfermedad_catastrofica());
                familiar.setDescripEnfermedadCatastrofica(fDto.getDescripEnfermedadCatastrofica());

                familiar.setDiscapacidad(fDto.getDiscapacidad());
                familiar.setDescripDiscapacidad(fDto.getDescripDiscapacidad());

                familiar.setFicha(ficha);
            }
            familiaresActualizados.add(familiar);
        }

        ficha.getFamiliares().clear();
        ficha.getFamiliares().addAll(familiaresActualizados);
    }

    private FichaSocioeconomicaDTO convertirADTO(FichaSocioeconomica ficha) {
        FichaSocioeconomicaDTO dto = new FichaSocioeconomicaDTO();
        dto.setId(ficha.getId());
        dto.setActivo(ficha.getActivo());
        dto.setFechaElaboracion(ficha.getFechaElaboracion());

        if (ficha.getPaciente() != null) {
            dto.setPaciente(new PacienteFichaDTO(
                    ficha.getPaciente().getId(),
                    ficha.getPaciente().getNombresApellidos(),
                    ficha.getPaciente().getCedula()));

        }
        if (ficha.getEspecialista() != null) {
            EspecialistaDTO espDto = new EspecialistaDTO();
            espDto.setId(ficha.getEspecialista().getId());
            espDto.setNombresApellidos(ficha.getEspecialista().getNombresApellidos());
            dto.setEspecialista(espDto);
        }
        
        dto.setRiesgosSociales(ficha.getRiesgosSociales());
        dto.setVulnerabilidad(ficha.getVulnerabilidad());
        dto.setDinamicaFamiliar(ficha.getDinamicaFamiliar());
        dto.setVivienda(ficha.getVivienda());
        dto.setSalud(ficha.getSalud());
        dto.setDesgloseEconomico(ficha.getDesgloseEconomico());
        dto.setSituacionEconomica(ficha.getSituacionEconomica());

        dto.setPacienteInstruccion(ficha.getPacienteInstruccion());
        dto.setPacienteOcupacion(ficha.getPacienteOcupacion());
        dto.setPacienteEmail(ficha.getPacienteEmail());
        dto.setPacienteNumCarne(ficha.getPacienteNumCarne());

        dto.setConclusiones(ficha.getConclusiones());
        dto.setRecomendaciones(ficha.getRecomendaciones());
        dto.setResponsable(ficha.getResponsable());

        if (ficha.getFamiliares() != null) {
            dto.setFamiliares(ficha.getFamiliares().stream().map(f -> {
                FamiliarDTO fDto = new FamiliarDTO();
                fDto.setId(f.getId() != null ? f.getId().intValue() : null);
                fDto.setRelacion(f.getRelacion());
                fDto.setNombresApellidos(f.getNombresApellidos());
                fDto.setEdad(f.getEdad());
                fDto.setEstadoCivil(f.getEstadoCivil());
                fDto.setInstruccion(f.getInstruccion());
                fDto.setOcupacion(f.getOcupacion());
                fDto.setIngresoMensual(f.getIngresoMensual());

                fDto.setProblemas_salud(
                        Boolean.TRUE.equals(f.getProblemasSaludFamiliar()));
                fDto.setDescripProblemasSaludFamiliar(
                        f.getDescripProblemasSaludFamiliar());

                fDto.setEnfermedad_catastrofica(
                        Boolean.TRUE.equals(f.getEnfermedadCatastrofica()));
                fDto.setDescripEnfermedadCatastrofica(
                        f.getDescripEnfermedadCatastrofica());

                fDto.setDiscapacidad(
                        Boolean.TRUE.equals(f.getDiscapacidad()));
                fDto.setDescripDiscapacidad(
                        f.getDescripDiscapacidad());

                return fDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }

    private void calcularIngresosDesglose(FichaSocioeconomica ficha) {
        if (ficha.getDesgloseEconomico() == null) {
            ficha.setDesgloseEconomico(new DesgloseEconomico());
        }
        double padre = 0.0;
        double madre = 0.0;
        double otrosFamiliares = 0.0;

        if (ficha.getFamiliares() != null) {
            for (FichaSocioFamiliar familiar : ficha.getFamiliares()) {
                double ingreso = familiar.getIngresoMensual() != null ? familiar.getIngresoMensual() : 0.0;
                String relacion = familiar.getRelacion() != null ? familiar.getRelacion().toLowerCase().trim() : "";
                if (relacion.equals("padre") || relacion.equals("papá") || relacion.equals("papa")) {
                    padre += ingreso;
                } else if (relacion.equals("madre") || relacion.equals("mamá") || relacion.equals("mama")) {
                    madre += ingreso;
                } else {
                    otrosFamiliares += ingreso;
                }
            }
        }

        ficha.getDesgloseEconomico().setIngresoPadre(padre);
        ficha.getDesgloseEconomico().setIngresoMadre(madre);
        ficha.getDesgloseEconomico().setIngresoFamiliares(otrosFamiliares);
        if (ficha.getDesgloseEconomico().getIngresoOtros() == null) {
            ficha.getDesgloseEconomico().setIngresoOtros(0.0);
        }
    }

    @Transactional
    public void desactivarFicha(Integer id) {
        log.info("Desactivando ficha socioeconómica ID: {}", id);
        fichaRepository.findById(id).ifPresent(f -> {
            f.setActivo(false);
            fichaRepository.save(f);
        });
    }
}