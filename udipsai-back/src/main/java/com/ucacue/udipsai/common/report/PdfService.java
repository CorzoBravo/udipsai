package com.ucacue.udipsai.common.report;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Map;

@Service
public class PdfService {

    @Autowired
    private TemplateEngine templateEngine;

    public byte[] generatePdfFromHtml(String templateName, Map<String, Object> data) throws Exception {
        // Load the logo dynamically and encode as base64 to avoid context-relative resource path failures in Thymeleaf PDF generation.
        try {
            ClassPathResource logoResource = new ClassPathResource("static/images/logo/logoudipsai.png");
            if (logoResource.exists()) {
                byte[] logoBytes = StreamUtils.copyToByteArray(logoResource.getInputStream());
                String base64Logo = Base64.getEncoder().encodeToString(logoBytes);
                data.put("logoUri", "data:image/png;base64," + base64Logo);
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not load logo image for PDF rendering: " + e.getMessage());
        }

        Context context = new Context();
        context.setVariables(data);

        String htmlContent = templateEngine.process(templateName, context);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, "/");
            builder.toStream(outputStream);
            builder.run();
            return outputStream.toByteArray();
        }
    }
}
