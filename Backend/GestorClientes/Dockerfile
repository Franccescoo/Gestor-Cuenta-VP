FROM eclipse-temurin:17-jre
LABEL authors="franccescoartuso"

# Copia tu JAR (ajusta el nombre si es necesario)
COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app.jar"]
