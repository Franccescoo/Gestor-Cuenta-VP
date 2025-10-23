FROM eclipse-temurin:17-jre
LABEL authors="franccescoartuso"

# Crear usuario no-root para seguridad
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring

# Copia tu JAR (ajusta el nombre si es necesario)
COPY target/*.jar app.jar

EXPOSE 8080

# Configuración de JVM optimizada para Cloud Run
ENV JAVA_OPTS="-Xmx1g -Xms512m -XX:+UseG1GC -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app.jar"]
