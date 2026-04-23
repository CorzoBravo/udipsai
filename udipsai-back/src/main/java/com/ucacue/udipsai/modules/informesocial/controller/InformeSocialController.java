package com.ucacue.udipsai.modules.informesocial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ucacue.udipsai.modules.informesocial.domain.InformeSocialDTO;
import com.ucacue.udipsai.modules.informesocial.dto.InformeSocialRequest;
import com.ucacue.udipsai.modules.informesocial.service.InformeSocialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/informes-sociales")
@CrossOrigin(origins = "*")
public class InformeSocialController {

    @Autowired private InformeSocialService informeService;
    @Autowired private ObjectMapper objectMapper;

    @PostMapping(value = "/crear", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<InformeSocialDTO> crearInforme(
            @RequestPart("informe") String informeJson,
            @RequestPart(value = "genograma", required = false) MultipartFile genograma,
            @RequestPart(value = "ecomapa", required = false) MultipartFile ecomapa) {
        
        try {
            // Convertir el String JSON al objeto Request
            InformeSocialRequest request = objectMapper.readValue(informeJson, InformeSocialRequest.class);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(informeService.crearInforme(request, genograma, ecomapa));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/paciente/{cedula}")
    public ResponseEntity<InformeSocialDTO> recuperarDatosParaInforme(@PathVariable String cedula) {
        // Aquí llamarías a la lógica que busca al paciente y su última ficha
        return ResponseEntity.ok().build();
    }
}