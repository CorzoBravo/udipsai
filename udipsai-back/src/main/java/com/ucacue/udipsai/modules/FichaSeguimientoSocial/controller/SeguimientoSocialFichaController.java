package com.ucacue.udipsai.modules.FichaSeguimientoSocial.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ucacue.udipsai.modules.FichaSeguimientoSocial.Services.SeguimientoSocialFichaService;
import com.ucacue.udipsai.modules.FichaSeguimientoSocial.dto.SeguimientoSocialFichaDTO;
import com.ucacue.udipsai.modules.FichaSeguimientoSocial.dto.SeguimientoSocialFichaRequest;

import java.util.List;

@RestController
@RequestMapping("/api/seguimientos-sociales")
@CrossOrigin(origins = "*") 
@RequiredArgsConstructor
public class SeguimientoSocialFichaController {

    private final SeguimientoSocialFichaService seguimientoService;

    // POST: http://localhost:8081/api/seguimientos-sociales (Para Guardar)
    @PostMapping
    public ResponseEntity<SeguimientoSocialFichaDTO> crearSeguimiento(@RequestBody SeguimientoSocialFichaRequest request) {
        SeguimientoSocialFichaDTO nuevoSeguimiento = seguimientoService.crearSeguimiento(request);
        return new ResponseEntity<>(nuevoSeguimiento, HttpStatus.CREATED);
    }


    // GET: http://localhost:8081/api/seguimientos-sociales
    @GetMapping
    public ResponseEntity<List<SeguimientoSocialFichaDTO>> listarTodos() {
        List<SeguimientoSocialFichaDTO> lista = seguimientoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    // GET: http://localhost:8081/api/seguimientos-sociales/paciente/1 (Listar por paciente)
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<SeguimientoSocialFichaDTO>> listarPorPaciente(@PathVariable Integer pacienteId) {
        List<SeguimientoSocialFichaDTO> lista = seguimientoService.listarPorPaciente(pacienteId);
        return ResponseEntity.ok(lista);
    }
    
    // GET: http://localhost:8081/api/seguimientos-sociales/1 (Obtener uno solo)
    @GetMapping("/{id}")
    public ResponseEntity<SeguimientoSocialFichaDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(seguimientoService.obtenerPorId(id));
    }
    @PutMapping("/{id}")
public ResponseEntity<SeguimientoSocialFichaDTO> actualizar(@PathVariable Integer id, @RequestBody SeguimientoSocialFichaRequest request) {
    return ResponseEntity.ok(seguimientoService.actualizar(id, request));
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        seguimientoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reporte/pdf")
    public ResponseEntity<org.springframework.core.io.Resource> descargarPdf(@RequestParam Integer id) throws Exception {
        byte[] pdf = seguimientoService.exportarPdf(id);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=seguimiento_social_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .body(new org.springframework.core.io.ByteArrayResource(pdf));
    }

    @GetMapping("/reporte/excel")
    public ResponseEntity<org.springframework.core.io.Resource> descargarExcel(
            @RequestParam(required = false) Integer pacienteId) throws java.io.IOException {

        java.io.ByteArrayInputStream in = seguimientoService.exportarExcel(pacienteId);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=seguimiento_social.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new org.springframework.core.io.InputStreamResource(in));
    }

}