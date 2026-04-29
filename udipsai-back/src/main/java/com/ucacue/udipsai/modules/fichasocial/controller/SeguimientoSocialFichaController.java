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

    // PUT: http://localhost:8081/api/seguimientos-sociales/1 (Actualizar)
    @PutMapping("/{id}")
    public ResponseEntity<SeguimientoSocialFichaDTO> actualizarSeguimiento(@PathVariable Integer id, @RequestBody SeguimientoSocialFichaRequest request) {
        SeguimientoSocialFichaDTO actualizado = seguimientoService.actualizarSeguimiento(id, request);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE: http://localhost:8081/api/seguimientos-sociales/1 (Eliminar)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSeguimiento(@PathVariable Integer id) {
        seguimientoService.eliminarSeguimiento(id);
        return ResponseEntity.noContent().build();
    }
}