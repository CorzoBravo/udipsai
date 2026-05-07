package com.ucacue.udipsai.modules.informesocial.service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.common.report.PdfService;
import com.ucacue.udipsai.modules.informesocial.dto.InformeSocialDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InformeSocialReportService {

    @Autowired
    private InformeSocialService informeService;

    @Autowired
    private PdfService pdfService;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

    /**
     * EXPORTAR EXCEL
     */
    public ByteArrayInputStream exportarExcel(String cedula)
            throws IOException {

        List<InformeSocialDTO> informes;

        if (cedula != null && !cedula.isEmpty()) {
            InformeSocialDTO informe = informeService.obtenerPorPacienteCedula(cedula);

            informes = (informe != null)
                    ? List.of(informe)
                    : List.of();
        } else {
            informes = informeService.listarInformes();
        }

        String[] headers = {
                "ID",
                "Número Ficha",
                "Paciente",
                "Cédula",
                "Fecha Elaboración",
                "Dinámica Familiar",
                "Situación Económica",
                "Situación Habitabilidad",
                "Situación Laboral",
                "Situación Entorno",
                "Situación Educativo Cultural",
                "Situación Salud",
                "Situación Legal",
                "Valoración Profesional",
                "Recomendaciones",
                "Elaborado Por",
                "Familiares"
        };

        return ExcelGenerator.generateExcel(
                "Informes Sociales",
                headers,
                informes,
                (row, i) -> {

                    int col = 0;

                    row.createCell(col++)
                            .setCellValue(fmt(i.getId()));

                    row.createCell(col++)
                            .setCellValue(fmt(i.getNumFicha()));

                    row.createCell(col++)
                            .setCellValue(
                                    i.getPaciente() != null
                                            ? i.getPaciente()
                                                    .getNombresApellidos()
                                            : "N/A");

                    row.createCell(col++)
                            .setCellValue(
                                    i.getPaciente() != null
                                            ? i.getPaciente()
                                                    .getCedula()
                                            : "N/A");

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getFechaElaboracion()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getDescripcionDinamicaFamiliar()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getSituacionEconomica()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getSituacionHabitabilidad()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getSituacionLaboral()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getSituacionEntorno()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getSituacionEducativoCultural()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getSituacionSalud()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getSituacionLegal()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getValoracionProfesional()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getRecomendaciones()));

                    row.createCell(col++)
                            .setCellValue(
                                    fmt(i.getElaboradoPor()));

                    // Familiares concatenados
                    if (i.getFamiliares() != null &&
                            !i.getFamiliares().isEmpty()) {

                        String familiares = i.getFamiliares()
                                .stream()
                                .map(f -> f.getNombres()
                                        + " ("
                                        + f.getParentesco()
                                        + ")")
                                .reduce(
                                        (a, b) -> a + ", " + b)
                                .orElse("N/A");

                        row.createCell(col++)
                                .setCellValue(familiares);

                    } else {
                        row.createCell(col++)
                                .setCellValue("N/A");
                    }
                });
    }
    public byte[] exportarPdf(String cedula)
            throws Exception {

        InformeSocialDTO informe = informeService.obtenerPorPacienteCedula(cedula);

        if (informe == null) {
            throw new RuntimeException(
                    "No existe informe social para este paciente");
        }

        Map<String, Object> data = new HashMap<>();
        data.put("i", informe);

        return pdfService.generatePdfFromHtml(
                "reportes/informe-social-detalle",
                data);
    }

    private String fmt(Object value) {
        if (value == null) {
            return "N/A";
        }

        if (value instanceof java.util.Date) {
            return dateFormat.format(
                    (java.util.Date) value);
        }

        return value.toString();
    }
}