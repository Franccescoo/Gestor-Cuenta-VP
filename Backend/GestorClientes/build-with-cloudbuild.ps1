# Script para construir y subir usando gcloud builds submit
# Usa tu método preferido con cloudbuild.yaml

Write-Host "🔨 Construyendo y subiendo con Cloud Build..." -ForegroundColor Green

# Variables
$PROJECT_ID = "prestige-club-2025"
$REGION = "us-central1"
$REPOSITORY = "prestige-club-repo"
$SERVICE_NAME = "gestor-clientes"

Write-Host "📋 Configuración:" -ForegroundColor Yellow
Write-Host "  - Proyecto: $PROJECT_ID"
Write-Host "  - Región: $REGION"
Write-Host "  - Repositorio: $REPOSITORY"
Write-Host "  - Servicio: $SERVICE_NAME"

# Ejecutar Cloud Build
Write-Host "🚀 Ejecutando gcloud builds submit..." -ForegroundColor Blue
gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=$REGION,_REPOSITORY=$REPOSITORY,_SERVICE_NAME=$SERVICE_NAME --region=$REGION

Write-Host "✅ Build completado!" -ForegroundColor Green
Write-Host "📦 Imagen disponible en: $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:latest" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Para desplegar en Cloud Run:" -ForegroundColor Yellow
Write-Host "   gcloud run deploy $SERVICE_NAME \"
Write-Host "     --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME:latest \"
Write-Host "     --platform managed \"
Write-Host "     --region $REGION \"
Write-Host "     --allow-unauthenticated \"
Write-Host "     --port 8080 \"
Write-Host "     --memory 2Gi \"
Write-Host "     --cpu 2 \"
Write-Host "     --min-instances 1 \"
Write-Host "     --max-instances 10 \"
Write-Host "     --timeout 300"
