#!/bin/bash

# Script de despliegue corregido para GestorClientes
# Este script soluciona los problemas de puerto y configuración

set -e

echo "🚀 Iniciando despliegue corregido de GestorClientes..."

# Variables
PROJECT_ID="prestige-club-2025"
REGION="southamerica-east1"
REPOSITORY="prestige-club-repo"
SERVICE_NAME="gestor-clientes"

echo "📋 Configuración:"
echo "  - Proyecto: $PROJECT_ID"
echo "  - Región: $REGION"
echo "  - Repositorio: $REPOSITORY"
echo "  - Servicio: $SERVICE_NAME"

# 1. Limpiar y compilar
echo "🔨 Compilando aplicación..."
./mvnw clean package -DskipTests

# 2. Construir imagen Docker
echo "🐳 Construyendo imagen Docker..."
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:latest .

# 3. Autenticar con Google Cloud
echo "🔐 Autenticando con Google Cloud..."
gcloud auth configure-docker $REGION-docker.pkg.dev

# 4. Subir imagen
echo "📤 Subiendo imagen al Artifact Registry..."
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:latest

# 5. Desplegar en Cloud Run
echo "☁️ Desplegando en Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 10 \
  --timeout 300 \
  --set-env-vars SPRING_PROFILES_ACTIVE=prod \
  --set-env-vars SERVER_PORT=8080

echo "✅ Despliegue completado!"
echo "🌐 URL del servicio: https://$SERVICE_NAME-$(gcloud config get-value project).$REGION.run.app"
echo "🔍 Para ver logs: gcloud run logs tail $SERVICE_NAME --region=$REGION"
