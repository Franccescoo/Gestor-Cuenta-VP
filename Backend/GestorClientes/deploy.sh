#!/bin/bash

# Script para desplegar el backend a Cloud Run
# Uso: ./deploy.sh PROJECT_ID REGION SERVICE_NAME

set -e

# Variables
PROJECT_ID=${1:-"regal-creek-454315-j6"}
REGION=${2:-"southamerica-east1"}
SERVICE_NAME=${3:-"gestor-clientes"}
REPOSITORY="prestige-club-repo"

echo "🚀 Iniciando despliegue de Prestige Club Backend"
echo "📋 Configuración:"
echo "   - Project ID: $PROJECT_ID"
echo "   - Region: $REGION"
echo "   - Service: $SERVICE_NAME"
echo "   - Repository: $REPOSITORY"
echo ""

# Verificar que gcloud esté instalado y configurado
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI no está instalado. Por favor instálalo primero."
    exit 1
fi

# Configurar proyecto
echo "🔧 Configurando proyecto..."
gcloud config set project $PROJECT_ID

# Habilitar APIs necesarias
echo "🔌 Habilitando APIs necesarias..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Crear repositorio en Artifact Registry si no existe
echo "📦 Verificando repositorio de Artifact Registry..."
if ! gcloud artifacts repositories describe $REPOSITORY --location=$REGION &> /dev/null; then
    echo "📦 Creando repositorio de Artifact Registry..."
    gcloud artifacts repositories create $REPOSITORY \
        --repository-format=docker \
        --location=$REGION \
        --description="Repository for Prestige Club applications"
else
    echo "✅ Repositorio ya existe"
fi

# Configurar autenticación para Docker
echo "🔐 Configurando autenticación Docker..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Ejecutar Cloud Build
echo "🏗️ Ejecutando build y push..."
gcloud builds submit \
    --config cloudbuild.yaml \
    --substitutions=_PROJECT_ID=$PROJECT_ID,_REGION=$REGION,_REPOSITORY=$REPOSITORY,_SERVICE_NAME=$SERVICE_NAME \
    .

# Desplegar a Cloud Run
echo "🚀 Desplegando a Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${SERVICE_NAME}:latest \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 8081 \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 1 \
    --max-instances 10 \
    --set-env-vars SPRING_PROFILES_ACTIVE=prod,SERVER_PORT=8081

# Obtener URL del servicio
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo ""
echo "✅ Despliegue completado exitosamente!"
echo "🌐 URL del servicio: $SERVICE_URL"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Configurar variables de entorno en Cloud Run"
echo "   2. Crear secretos para passwords y JWT"
echo "   3. Configurar base de datos"
echo "   4. Actualizar frontend con la nueva URL"
echo ""
echo "🔧 Para configurar secretos:"
echo "   gcloud secrets create db-password --data-file=db-password.txt"
echo "   gcloud secrets create jwt-secret --data-file=jwt-secret.txt"
echo "   gcloud secrets create email-password --data-file=email-password.txt"
