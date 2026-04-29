package com.ucacue.udipsai.modules.fichasocial.controller;

import com.ucacue.udipsai.modules.fichasocial.dto.FichaSocioeconomicaDTO;
import com.ucacue.udipsai.modules.fichasocial.dto.FichaSocioeconomicaRequest;
import com.ucacue.udipsai.modules.fichasocial.Service.FichaSocioeconomicaService;
import com.ucacue.udipsai.modules.fichasocial.Service.FichaSocioeconomicaReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController

@RequestMapping("/api/fichas-socioeconomicas")
@CrossOrigin(origins = "*")

public class FichaSocioeconomicaController {

    @Autowired
    private FichaSocioeconomicaService fichaService;

    @Autowired
    private FichaSocioeconomicaReportService reportService;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_SOCIOECONOMICA')") // Permiso específico para listar fichas socioeconómicas
    public ResponseEntity<List<FichaSocioeconomicaDTO>> listar() {
        return ResponseEntity.ok(fichaService.listarFichas());
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasAuthority('PERM_SOCIOECONOMICA')")
    public ResponseEntity<FichaSocioeconomicaDTO> obtenerPorPaciente(@PathVariable Integer pacienteId) {
        FichaSocioeconomicaDTO dto = fichaService.obtenerFichaActivaPorPacienteId(pacienteId);
        return (dto != null) ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping("/crearFicha")
    @PreAuthorize("hasAuthority('PERM_SOCIOECONOMICA_CREAR') and @asignacionSecurity.checkPasanteAcceso(#request.pacienteId)")

    public ResponseEntity<FichaSocioeconomicaDTO> crear(@RequestBody FichaSocioeconomicaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fichaService.crearFicha(request));
    }

    @PutMapping("/socioeconomicas/{id}")
    @PreAuthorize("hasAuthority('PERM_SOCIOECONOMICA_EDITAR')")

    public ResponseEntity<FichaSocioeconomicaDTO> actualizar(@PathVariable Integer id,
            @RequestBody FichaSocioeconomicaRequest request) {
        return ResponseEntity.ok(fichaService.actualizarFicha(id, request));
    }

    @DeleteMapping("/socioeconomicas/{id}")
    @PreAuthorize("hasAuthority('PERM_SOCIOECONOMICA_ELIMINAR')")

    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        fichaService.desactivarFicha(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reporte/excel")
    @PreAuthorize("hasAuthority('PERM_SOCIOECONOMICA')")
    public ResponseEntity<Resource> descargarExcel(@RequestParam(required = false) Integer pacienteId)
            throws IOException {

        ByteArrayInputStream in = reportService.exportarExcel(pacienteId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=ficha_socioeconomica.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))

                .body(new InputStreamResource(in));
    }
}