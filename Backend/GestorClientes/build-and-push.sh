#!/bin/bash

# Script para construir y subir imagen a Artifact Registry
# Sin despliegue automático a Cloud Run

set -e

echo "🔨 Construyendo y subiendo imagen a Artifact Registry..."

# Variables
PROJECT_ID="prestige-club-2025"
REGION="southamerica-east1"
REPOSITORY="prestige-club-repo"
SERVICE_NAME="gestor-clientes"
IMAGE_TAG="latest"

echo "📋 Configuración:"
echo "  - Proyecto: $PROJECT_ID"
echo "  - Región: $REGION"
echo "  - Repositorio: $REPOSITORY"
echo "  - Servicio: $SERVICE_NAME"
echo "  - Tag: $IMAGE_TAG"

# 1. Limpiar y compilar
echo "🔨 Compilando aplicación..."
./mvnw clean package -DskipTests

# 2. Construir imagen Docker
echo "🐳 Construyendo imagen Docker..."
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:$IMAGE_TAG .

# 3. Autenticar con Google Cloud
echo "🔐 Autenticando con Google Cloud..."
gcloud auth configure-docker $REGION-docker.pkg.dev

# 4. Subir imagen
echo "📤 Subiendo imagen al Artifact Registry..."
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:$IMAGE_TAG

echo "✅ Imagen construida y subida exitosamente!"
echo "📦 Imagen disponible en: $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:$IMAGE_TAG"
echo ""
echo "🚀 Para desplegar manualmente en Cloud Run:"
echo "   gcloud run deploy $SERVICE_NAME \\"
echo "     --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:$IMAGE_TAG \\"
echo "     --platform managed \\"
echo "     --region $REGION \\"
echo "     --allow-unauthenticated \\"
echo "     --port 8080 \\"
echo "     --memory 2Gi \\"
echo "     --cpu 2 \\"
echo "     --min-instances 1 \\"
echo "     --max-instances 10 \\"
echo "     --timeout 300"
