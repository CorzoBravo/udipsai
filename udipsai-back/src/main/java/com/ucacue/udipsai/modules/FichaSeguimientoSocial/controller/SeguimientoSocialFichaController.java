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

}