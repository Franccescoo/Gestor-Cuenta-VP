# Solución al Error de Despliegue en Cloud Run

## Problema Identificado
El backend `gestor-clientes` no podía desplegarse en Google Cloud Run debido a un error de configuración de puerto:
```
The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout.
```

## Causas del Problema

1. **Inconsistencia de puertos**: La aplicación estaba configurada para usar el puerto 8081 en desarrollo, pero Cloud Run esperaba el puerto 8080.

2. **Configuración de variables de entorno**: Las variables de entorno en Cloud Run no estaban correctamente configuradas.

3. **Falta de configuración de health checks**: Los endpoints de health check no estaban permitidos en la configuración de seguridad.

## Soluciones Implementadas

### 1. ✅ Corrección del Puerto
- **Archivo**: `src/main/resources/application.properties`
- **Cambio**: `server.port=8081` → `server.port=8080`
- **Razón**: Unificar el puerto para desarrollo y producción

### 2. ✅ Mejora del Dockerfile
- **Archivo**: `Dockerfile`
- **Mejoras**:
  - Usuario no-root para seguridad
  - Configuración JVM optimizada para Cloud Run
  - Health check integrado
  - Variables de entorno para JVM

### 3. ✅ Corrección de Variables de Entorno
- **Archivo**: `cloudrun-deploy.yaml`
- **Cambios**:
  - Variables de base de datos corregidas
  - Configuración de email actualizada
  - Puerto del servidor explícitamente configurado

### 4. ✅ Configuración de Health Checks
- **Archivo**: `src/main/java/com/gestor/GestorClientes/config/SecurityConfig.java`
- **Cambio**: Agregado acceso público a `/actuator/health` y `/actuator/info`
- **Razón**: Permitir que Cloud Run verifique el estado de la aplicación

## Archivos Modificados

1. `src/main/resources/application.properties`
2. `Dockerfile`
3. `cloudrun-deploy.yaml`
4. `src/main/java/com/gestor/GestorClientes/config/SecurityConfig.java`

## Scripts de Construcción y Subida

Se crearon scripts para construir y subir la imagen a Artifact Registry:

### Para Linux/Mac:
```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

### Para Windows (PowerShell):
```powershell
.\build-and-push.ps1
```

### Script de Despliegue Completo (Opcional):
```bash
chmod +x deploy-fix.sh
./deploy-fix.sh
```

## Verificación del Despliegue

Después del despliegue, verificar:

1. **Health Check**: `https://tu-servicio.run.app/actuator/health`
2. **Logs**: `gcloud run logs tail gestor-clientes --region=southamerica-east1`
3. **Estado del servicio**: Verificar en Google Cloud Console

## Configuración de Base de Datos

**Importante**: Asegúrate de que las variables de entorno de la base de datos estén configuradas correctamente en Google Cloud Secret Manager:

- `db-password`: Contraseña de la base de datos
- `jwt-secret`: Secreto JWT
- `email-password`: Contraseña del email

## Próximos Pasos

1. Ejecutar el script de despliegue
2. Verificar que el servicio esté funcionando
3. Probar los endpoints principales
4. Monitorear los logs para detectar posibles problemas

## Troubleshooting

Si el problema persiste:

1. Verificar logs: `gcloud run logs tail gestor-clientes --region=southamerica-east1`
2. Verificar configuración de red y firewall
3. Verificar que la base de datos esté accesible desde Cloud Run
4. Verificar que los secretos estén configurados correctamente
