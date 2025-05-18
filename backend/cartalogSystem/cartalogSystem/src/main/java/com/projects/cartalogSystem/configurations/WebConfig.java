package com.projects.cartalogSystem.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
        System.out.println("Static resource path: " + uploadPath);

        registry.addResourceHandler("/CarCatalog/images/**").
                addResourceLocations("file:/C:/Users/Zora/Desktop/Programming/College/cartalog-system/backend/cartalogSystem/cartalogSystem/uploads/");
    }
}
