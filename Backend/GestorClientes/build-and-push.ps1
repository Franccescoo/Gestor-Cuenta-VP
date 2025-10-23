# Script PowerShell para construir y subir imagen a Artifact Registry
# Sin despliegue automático a Cloud Run

Write-Host "🔨 Construyendo y subiendo imagen a Artifact Registry..." -ForegroundColor Green

# Variables
$PROJECT_ID = "prestige-club-2025"
$REGION = "southamerica-east1"
$REPOSITORY = "prestige-club-repo"
$SERVICE_NAME = "gestor-clientes"
$IMAGE_TAG = "latest"

Write-Host "📋 Configuración:" -ForegroundColor Yellow
Write-Host "  - Proyecto: $PROJECT_ID"
Write-Host "  - Región: $REGION"
Write-Host "  - Repositorio: $REPOSITORY"
Write-Host "  - Servicio: $SERVICE_NAME"
Write-Host "  - Tag: $IMAGE_TAG"

# 1. Limpiar y compilar
Write-Host "🔨 Compilando aplicación..." -ForegroundColor Blue
.\mvnw.cmd clean package -DskipTests

# 2. Construir imagen Docker
Write-Host "🐳 Construyendo imagen Docker..." -ForegroundColor Blue
$IMAGE_NAME = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$SERVICE_NAME`:$IMAGE_TAG"
docker build -t $IMAGE_NAME .

# 3. Autenticar con Google Cloud
Write-Host "🔐 Autenticando con Google Cloud..." -ForegroundColor Blue
gcloud auth configure-docker $REGION-docker.pkg.dev

# 4. Subir imagen
Write-Host "📤 Subiendo imagen al Artifact Registry..." -ForegroundColor Blue
docker push $IMAGE_NAME

Write-Host "✅ Imagen construida y subida exitosamente!" -ForegroundColor Green
Write-Host "📦 Imagen disponible en: $IMAGE_NAME" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Para desplegar manualmente en Cloud Run:" -ForegroundColor Yellow
Write-Host "   gcloud run deploy $SERVICE_NAME \"
Write-Host "     --image $IMAGE_NAME \"
Write-Host "     --platform managed \"
Write-Host "     --region $REGION \"
Write-Host "     --allow-unauthenticated \"
Write-Host "     --port 8080 \"
Write-Host "     --memory 2Gi \"
Write-Host "     --cpu 2 \"
Write-Host "     --min-instances 1 \"
Write-Host "     --max-instances 10 \"
Write-Host "     --timeout 300"
