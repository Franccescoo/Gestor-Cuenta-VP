# 🚀 Guía de Despliegue - Prestige Club Backend

Esta guía te ayudará a desplegar el backend de Prestige Club en Google Cloud Run usando Artifact Registry.

## 📋 Prerequisitos

1. **Google Cloud SDK** instalado y configurado
2. **Docker** instalado
3. **Proyecto de Google Cloud** creado
4. **Base de datos PostgreSQL** configurada
5. **Credenciales de servicio** configuradas

## 🔧 Configuración Inicial

### 1. Configurar gcloud
```bash
# Autenticarse
gcloud auth login

# Configurar proyecto
gcloud config set project YOUR_PROJECT_ID

# Configurar región por defecto
gcloud config set run/region us-central1
```

### 2. Habilitar APIs necesarias
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## 🏗️ Despliegue Automático

### Opción 1: Script Automático (Recomendado)
```bash
# Hacer ejecutable el script
chmod +x deploy.sh

# Ejecutar despliegue
./deploy.sh YOUR_PROJECT_ID us-central1 gestor-clientes
```

### Opción 2: Despliegue Manual

#### Paso 1: Compilar la aplicación
```bash
./mvnw clean package -DskipTests
```

#### Paso 2: Construir y subir imagen Docker
```bash
# Construir imagen
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/prestige-club-repo/gestor-clientes:latest .

# Subir a Artifact Registry
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/prestige-club-repo/gestor-clientes:latest
```

#### Paso 3: Desplegar a Cloud Run
```bash
gcloud run deploy gestor-clientes \
    --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/prestige-club-repo/gestor-clientes:latest \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --port 8081 \
    --memory 2Gi \
    --cpu 2
```

## 🔐 Configuración de Secretos

### 1. Crear secretos para variables sensibles
```bash
# Password de base de datos
echo "tu_db_password" | gcloud secrets create db-password --data-file=-

# JWT Secret
echo "tu-super-secret-jwt-key" | gcloud secrets create jwt-secret --data-file=-

# Password de email
echo "tu_email_password" | gcloud secrets create email-password --data-file=-
```

### 2. Conceder permisos a Cloud Run
```bash
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding db-password \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding jwt-secret \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding email-password \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

## 🌐 Configuración de Variables de Entorno

Después del despliegue, configura las variables de entorno en Cloud Run:

```bash
gcloud run services update gestor-clientes \
    --region us-central1 \
    --set-env-vars \
        SPRING_DATASOURCE_URL="jdbc:postgresql://tu-db-host:5432/prestige_club",\
        SPRING_DATASOURCE_USERNAME="prestige_user",\
        SPRING_MAIL_USERNAME="tu-email@gmail.com",\
        SPRING_PROFILES_ACTIVE="prod"
```

## 🔄 Actualización del Frontend

Una vez desplegado, actualiza el archivo `environment.prod.ts` del frontend:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://gestor-clientes-xxxxx-uc.a.run.app/api',
  filesBase: 'https://gestor-clientes-xxxxx-uc.a.run.app',
  // ... resto de configuración
};
```

## 📊 Monitoreo y Logs

### Ver logs en tiempo real
```bash
gcloud logs tail --follow --filter="resource.type=cloud_run_revision AND resource.labels.service_name=gestor-clientes"
```

### Ver métricas
```bash
# Abrir Cloud Console
gcloud run services describe gestor-clientes --region=us-central1
```

## 🛠️ Comandos Útiles

### Actualizar servicio
```bash
gcloud run deploy gestor-clientes \
    --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/prestige-club-repo/gestor-clientes:latest \
    --region us-central1
```

### Ver información del servicio
```bash
gcloud run services describe gestor-clientes --region=us-central1
```

### Eliminar servicio
```bash
gcloud run services delete gestor-clientes --region=us-central1
```

## 🔍 Troubleshooting

### Problemas comunes:

1. **Error de autenticación**: Verificar que gcloud esté autenticado
2. **Error de permisos**: Verificar roles de IAM
3. **Error de base de datos**: Verificar conexión y credenciales
4. **Error de memoria**: Aumentar límites de memoria en Cloud Run

### Logs de debugging:
```bash
gcloud logs read --filter="resource.type=cloud_run_revision AND resource.labels.service_name=gestor-clientes" --limit=50
```

## 📞 Soporte

Si encuentras problemas, revisa:
1. Logs de Cloud Run
2. Logs de Cloud Build
3. Configuración de red y firewall
4. Variables de entorno y secretos

