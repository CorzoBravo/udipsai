package com.ucacue.udipsai.modules.fichasocial.controller;

import com.ucacue.udipsai.modules.fichasocial.Service.SeguimientoSocialFichaService;
import com.ucacue.udipsai.modules.fichasocial.dto.SeguimientoSocialFichaDTO;
import com.ucacue.udipsai.modules.fichasocial.dto.SeguimientoSocialFichaRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seguimientos-sociales")
// @CrossOrigin(origins = "*") // Descomenta esta línea si tienes problemas de CORS al probar con el frontend local
@RequiredArgsConstructor
public class SeguimientoSocialFichaController {

    private final SeguimientoSocialFichaService seguimientoService;

    // POST: http://localhost:8080/api/seguimientos-sociales
    @PostMapping
    public ResponseEntity<SeguimientoSocialFichaDTO> crearSeguimiento(@RequestBody SeguimientoSocialFichaRequest request) {
        SeguimientoSocialFichaDTO nuevoSeguimiento = seguimientoService.crearSeguimiento(request);
        return new ResponseEntity<>(nuevoSeguimiento, HttpStatus.CREATED);
    }

    // GET: http://localhost:8080/api/seguimientos-sociales/paciente/1
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<SeguimientoSocialFichaDTO>> listarPorPaciente(@PathVariable Integer pacienteId) {
        List<SeguimientoSocialFichaDTO> lista = seguimientoService.listarPorPaciente(pacienteId);
        return ResponseEntity.ok(lista);
    }
    // GET: http://localhost:8080/api/seguimientos-sociales/1
    @GetMapping("/{id}")
    public ResponseEntity<SeguimientoSocialFichaDTO> obtenerPorId(@PathVariable Integer id) {
        // En el Service debemos crear este método también
        return ResponseEntity.ok(seguimientoService.obtenerPorId(id));
    }
}