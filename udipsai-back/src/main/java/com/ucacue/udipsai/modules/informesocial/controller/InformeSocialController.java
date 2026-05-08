package com.ucacue.udipsai.modules.informesocial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ucacue.udipsai.modules.informesocial.dto.InformeSocialDTO;
import com.ucacue.udipsai.modules.informesocial.dto.InformeSocialRequest;
import com.ucacue.udipsai.modules.informesocial.service.InformeSocialReportService;
import com.ucacue.udipsai.modules.informesocial.service.InformeSocialService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/informes-sociales")
@CrossOrigin(origins = "*")
public class InformeSocialController {

    @Autowired
    private InformeSocialService informeService;

    @Autowired
    private InformeSocialReportService reportService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<InformeSocialDTO>> listar() {
        return ResponseEntity.ok(informeService.listarInformes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InformeSocialDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(informeService.obtenerPorId(id));
    }

    @GetMapping("/paciente/{cedula}")
    public ResponseEntity<InformeSocialDTO> obtenerPorPaciente(@PathVariable String cedula) {
        InformeSocialDTO dto = informeService.obtenerPorPacienteCedula(cedula);
        return (dto != null) ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/crear", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<InformeSocialDTO> crearInforme(
            @RequestPart("informe") String informeJson,
            @RequestPart(value = "genograma", required = false) MultipartFile genograma,
            @RequestPart(value = "ecomapa", required = false) MultipartFile ecomapa) {

        try {
            InformeSocialRequest request = objectMapper.readValue(informeJson, InformeSocialRequest.class);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(informeService.crearInforme(request, genograma, ecomapa));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<InformeSocialDTO> actualizarInforme(
            @PathVariable Integer id,
            @RequestPart("informe") String informeJson,
            @RequestPart(value = "genograma", required = false) MultipartFile genograma,
            @RequestPart(value = "ecomapa", required = false) MultipartFile ecomapa) {

        try {
            InformeSocialRequest request = objectMapper.readValue(informeJson, InformeSocialRequest.class);
            return ResponseEntity.ok(informeService.actualizarInforme(id, request, genograma, ecomapa));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        informeService.eliminarInforme(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reporte/excel")
    public ResponseEntity<Resource> descargarExcel(
            @RequestParam(required = false) String cedula)
            throws IOException {

        ByteArrayInputStream in = reportService.exportarExcel(cedula);

        HttpHeaders headers = new HttpHeaders();
        headers.add(
                "Content-Disposition",
                "attachment; filename=informe_social.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @GetMapping("/reporte/pdf")
    public ResponseEntity<Resource> descargarPdf(
            @RequestParam String cedula)
            throws Exception {

        byte[] pdf = reportService.exportarPdf(cedula);

        HttpHeaders headers = new HttpHeaders();
        headers.add(
                "Content-Disposition",
                "attachment; filename=informe_social.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new ByteArrayResource(pdf));
    }

}