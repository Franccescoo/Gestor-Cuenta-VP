#!/bin/bash

# Script para construir y subir usando gcloud builds submit
# Usa tu método preferido con cloudbuild.yaml

echo "🔨 Construyendo y subiendo con Cloud Build..."

# Variables
PROJECT_ID="prestige-club-2025"
REGION="us-central1"
REPOSITORY="prestige-club-repo"
SERVICE_NAME="gestor-clientes"

echo "📋 Configuración:"
echo "  - Proyecto: $PROJECT_ID"
echo "  - Región: $REGION"
echo "  - Repositorio: $REPOSITORY"
echo "  - Servicio: $SERVICE_NAME"

# Ejecutar Cloud Build
echo "🚀 Ejecutando gcloud builds submit..."
gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=$REGION,_REPOSITORY=$REPOSITORY,_SERVICE_NAME=$SERVICE_NAME --region=$REGION

echo "✅ Build completado!"
echo "📦 Imagen disponible en: $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:latest"
echo ""
echo "🚀 Para desplegar en Cloud Run:"
echo "   gcloud run deploy $SERVICE_NAME \\"
echo "     --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:latest \\"
echo "     --platform managed \\"
echo "     --region $REGION \\"
echo "     --allow-unauthenticated \\"
echo "     --port 8080 \\"
echo "     --memory 2Gi \\"
echo "     --cpu 2 \\"
echo "     --min-instances 1 \\"
echo "     --max-instances 10 \\"
echo "     --timeout 300"
