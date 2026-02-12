# Guía de Despliegue - Cloud Run (Backend)

## Requisitos previos

1. Tener una cuenta de Google Cloud Platform (GCP)
2. Instalar Google Cloud SDK (gcloud CLI):
   - Descarga desde: https://cloud.google.com/sdk/docs/install

3. Tener una base de datos MongoDB:
   - Opción 1: MongoDB Atlas (recomendado) - https://www.mongodb.com/cloud/atlas
   - Opción 2: Cloud SQL for MongoDB
   - Opción 3: Cualquier servicio de MongoDB en la nube

## Configuración inicial

### 1. Configurar Google Cloud

```bash
# Iniciar sesión
gcloud auth login

# Crear un nuevo proyecto (o usar uno existente)
gcloud projects create pet-adoption-api --name="Pet Adoption API"

# Establecer el proyecto activo
gcloud config set project pet-adoption-api

# Habilitar las APIs necesarias
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 2. Configurar MongoDB Atlas (Recomendado)

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un cluster (tier gratuito disponible)
4. Configura las credenciales de acceso
5. Whitelist la IP: `0.0.0.0/0` (para permitir acceso desde Cloud Run)
6. Copia la URI de conexión (ejemplo: `mongodb+srv://user:pass@cluster.mongodb.net/pet-adoption`)

### 3. Configurar variables de entorno

Crea un archivo `.env.production` (NO lo subas a Git):

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/pet-adoption?retryWrites=true&w=majority
PORT=8080
JWT_SECRET=tu-secreto-super-seguro-aqui
NODE_ENV=production
```

## Despliegue manual

### Opción 1: Desde código fuente (más fácil)

```bash
# Deploy directo desde el código
gcloud run deploy pet-adoption-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGO_URI="tu-mongo-uri",JWT_SECRET="tu-jwt-secret",PORT=8080
```

### Opción 2: Usando Docker (más control)

```bash
# 1. Construir la imagen Docker
docker build -t pet-adoption-api .

# 2. Probar localmente
docker run -p 3000:3000 \
  -e MONGO_URI="tu-mongo-uri" \
  -e JWT_SECRET="tu-secreto" \
  -e PORT=3000 \
  pet-adoption-api

# 3. Etiquetar la imagen para Google Container Registry
docker tag pet-adoption-api gcr.io/pet-adoption-api/backend

# 4. Subir a Container Registry
docker push gcr.io/pet-adoption-api/backend

# 5. Desplegar a Cloud Run
gcloud run deploy pet-adoption-api \
  --image gcr.io/pet-adoption-api/backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGO_URI="tu-mongo-uri",JWT_SECRET="tu-jwt-secret"
```

## Configurar secretos (Más seguro)

En lugar de pasar las variables directamente, usa Secret Manager:

```bash
# 1. Habilitar Secret Manager API
gcloud services enable secretmanager.googleapis.com

# 2. Crear secretos
echo -n "tu-mongo-uri" | gcloud secrets create MONGO_URI --data-file=-
echo -n "tu-jwt-secret" | gcloud secrets create JWT_SECRET --data-file=-

# 3. Desplegar con secretos
gcloud run deploy pet-adoption-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --update-secrets MONGO_URI=MONGO_URI:latest,JWT_SECRET=JWT_SECRET:latest
```

## Actualizar el frontend

Después del deploy, Cloud Run te dará una URL como:
```
https://pet-adoption-api-xxxxx-uc.a.run.app
```

Actualiza `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://pet-adoption-api-xxxxx-uc.a.run.app/api'
};
```

## Configurar CORS

Actualiza `app.js` para permitir peticiones desde tu frontend en Firebase:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://your-project-id.web.app',
    'https://your-project-id.firebaseapp.com'
  ]
}));
```

## Comandos útiles

```bash
# Ver logs
gcloud run services logs read pet-adoption-api --limit=50

# Ver servicios desplegados
gcloud run services list

# Actualizar variables de entorno
gcloud run services update pet-adoption-api \
  --set-env-vars KEY=VALUE

# Eliminar el servicio
gcloud run services delete pet-adoption-api
```

## Costos

Cloud Run cobra solo por el uso real:
- Tier gratuito: 2 millones de peticiones/mes
- Después: ~$0.40 por millón de peticiones
- RAM y CPU: según uso

MongoDB Atlas tier gratuito: 512MB de almacenamiento

## Monitoreo

Puedes ver métricas en:
- Google Cloud Console > Cloud Run > pet-adoption-api
- Logs en Cloud Logging
- Métricas de rendimiento y errores

## Troubleshooting

**Error: Connection timeout to MongoDB**
- Verifica que la IP 0.0.0.0/0 esté en whitelist de MongoDB Atlas

**Error: PORT environment variable**
- Cloud Run requiere que uses la variable PORT (default 8080)
- Actualiza `server.js` para usar `process.env.PORT || 3000`

**Error: Build failed**
- Verifica que el Dockerfile esté correcto
- Asegúrate de tener todas las dependencias en package.json
