# 🚀 CI/CD Pipeline - Gestión de Gastos Frontend

## 📋 Resumen

Este proyecto utiliza **Jenkins** para automatizar el proceso de build, test y deploy del frontend Angular en diferentes ambientes.

---

## 🏗️ Arquitectura del Pipeline

```
┌─────────────┐
│  Checkout   │ → Obtiene código del repositorio
└──────┬──────┘
       │
┌──────▼──────────────────┐
│  Set Environment Vars   │ → Detecta rama y configura ambiente
└──────┬──────────────────┘
       │
┌──────▼─────────────┐
│  Build with Docker │ → Construye imagen Docker para el ambiente
└──────┬─────────────┘
       │
┌──────▼────────┐
│    Deploy     │ → Despliega contenedor
└───────────────┘
```

---

## 🌿 Estrategia de Branching

| Rama     | Ambiente   | Puerto | Imagen Docker           |
|----------|------------|--------|-------------------------|
| `dev`    | Development| 4200   | gestion-gastos-dev      |
| `qa`     | QA         | 4201   | gestion-gastos-qa       |
| `main`   | Production | 4202   | gestion-gastos-prod     |

---

## 🐳 Docker Configuration

### Multi-stage Build

El **Dockerfile** utiliza un build multi-stage:

1. **Stage 1 (Builder)**:
   - Usa `node:20-alpine`
   - Instala dependencias con `npm ci`
   - Compila la aplicación Angular según el ambiente (`ENV_NAME`)
   - Genera archivos estáticos en `dist/`

2. **Stage 2 (Production)**:
   - Usa `nginx:alpine`
   - Copia los archivos compilados desde el stage 1
   - Configura nginx para servir la SPA
   - Expone el puerto 80

### Build Arguments

El Dockerfile acepta un argumento `ENV_NAME`:

```bash
docker build --build-arg ENV_NAME=qa -t gestion-gastos-qa .
```

Valores válidos para `ENV_NAME`:
- `development`
- `qa`
- `production`

---

## 🔧 Archivos de Configuración

### 1. `Dockerfile`
- Define el proceso de build multi-stage
- Acepta `ENV_NAME` como build argument
- Instala dependencias y compila Angular
- Configura nginx para servir la aplicación

### 2. `nginx.conf`
- Configuración personalizada de nginx
- Soporte para Angular routing (SPA)
- Headers de seguridad
- Compresión gzip
- Cache de assets estáticos
- Health check endpoint

### 3. `Jenkinsfile`
- Define el pipeline completo
- Detecta automáticamente la rama
- Configura variables de ambiente
- Construye y despliega la aplicación

### 4. `.dockerignore`
- Excluye archivos innecesarios del contexto de Docker
- Reduce el tamaño de la imagen
- Mejora velocidad de build

---

## 🚀 Cómo Funciona

### 1. **Checkout**
```groovy
checkout scm
```
Clona el repositorio desde Git.

### 2. **Set Environment Variables**
```groovy
if (branchName == 'dev') {
    env.PORT = '4200'
    env.ENV_NAME = 'development'
    env.CONTAINER_NAME = 'gestion-gastos-dev'
}
```
Detecta la rama y configura:
- Puerto de exposición
- Nombre del ambiente
- Nombre del contenedor

### 3. **Build with Docker**
```groovy
docker.build(
    "${DOCKER_IMAGE}-${env.ENV_NAME}:${BUILD_NUMBER}",
    "--build-arg ENV_NAME=${env.ENV_NAME} ."
)
```
Construye la imagen Docker:
- Pasa el `ENV_NAME` como build argument
- Taguea con el número de build
- Crea tag `latest` para el ambiente

### 4. **Deploy**
```groovy
deployToEnvironment()
```
Despliega el contenedor:
- Detiene contenedor anterior si existe
- Inicia nuevo contenedor con la imagen recién creada
- Mapea puerto host:contenedor
- Verifica que el servicio esté corriendo
- Ejecuta health check

---

## 📦 Despliegue Manual

### Construir imagen localmente

```bash
# Development
docker build --build-arg ENV_NAME=development -t gestion-gastos-dev:latest .

# QA
docker build --build-arg ENV_NAME=qa -t gestion-gastos-qa:latest .

# Production
docker build --build-arg ENV_NAME=production -t gestion-gastos-prod:latest .
```

### Ejecutar contenedor

```bash
# Development (puerto 4200)
docker run -d \
  --name gestion-gastos-dev \
  --restart unless-stopped \
  -p 4200:80 \
  gestion-gastos-dev:latest

# QA (puerto 4201)
docker run -d \
  --name gestion-gastos-qa \
  --restart unless-stopped \
  -p 4201:80 \
  gestion-gastos-qa:latest

# Production (puerto 4202)
docker run -d \
  --name gestion-gastos-prod \
  --restart unless-stopped \
  -p 4202:80 \
  gestion-gastos-prod:latest
```

### Verificar estado

```bash
# Ver logs
docker logs -f gestion-gastos-dev

# Verificar health
curl http://localhost:4200

# Ver procesos
docker ps | grep gestion-gastos
```

---

## 🔍 Health Checks

### Container Health Check
El Dockerfile incluye un health check:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

### Jenkins Health Check
El pipeline verifica que la aplicación responda:
```bash
curl -f http://localhost:${PORT}
```

---

## 🧹 Limpieza Automática

El pipeline limpia automáticamente imágenes antiguas:
- Mantiene las últimas 5 builds
- Elimina builds más antiguas
- Solo afecta al ambiente actual

```groovy
docker images ${DOCKER_IMAGE}-${env.ENV_NAME} --format '{{.Tag}}' | \
  grep -E '^[0-9]+$' | sort -rn | tail -n +6 | \
  xargs -r -I {} docker rmi ${DOCKER_IMAGE}-${env.ENV_NAME}:{}
```

---

## 🔐 Variables de Ambiente

Las siguientes variables se configuran automáticamente:

| Variable         | Descripción                        | Ejemplo                |
|------------------|------------------------------------|------------------------|
| `BRANCH_NAME`    | Nombre de la rama Git              | `dev`, `qa`, `main`    |
| `ENV_NAME`       | Nombre del ambiente Angular        | `development`, `qa`    |
| `PORT`           | Puerto de exposición               | `4200`, `4201`, `4202` |
| `CONTAINER_NAME` | Nombre del contenedor Docker       | `gestion-gastos-dev`   |
| `BUILD_NUMBER`   | Número de build de Jenkins         | `42`                   |

---

## 📊 Puertos de los Servicios Backend

Según el ambiente, el frontend se conectará a diferentes puertos de backend:

### Development
```
MS_EXPENSE:     8082
MS_INCOME:      8102
MS_CATEGORIES:  8112
MS_USER:        8202
```

### QA
```
MS_EXPENSE:     8081
MS_INCOME:      8101
MS_CATEGORIES:  8111
MS_USER:        8201
```

### Production
```
MS_EXPENSE:     8080
MS_INCOME:      8100
MS_CATEGORIES:  8110
MS_USER:        8200
```

---

## 🛠️ Troubleshooting

### El build falla con "npm ci failed"
**Solución**: Verifica que `package-lock.json` esté sincronizado con `package.json`
```bash
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

### El contenedor no inicia
**Solución**: Revisa los logs
```bash
docker logs gestion-gastos-dev
```

### El health check falla
**Solución**: Verifica que nginx esté sirviendo correctamente
```bash
docker exec gestion-gastos-dev wget -O- http://localhost/
```

### Puerto ya en uso
**Solución**: Detén el contenedor existente
```bash
docker stop gestion-gastos-dev
docker rm gestion-gastos-dev
```

### Imagen muy grande
**Solución**: Verifica `.dockerignore`
```bash
docker images | grep gestion-gastos
```
Tamaño esperado: ~50-80MB (nginx:alpine + archivos estáticos)

---

## 🔄 Flujo de Trabajo Completo

1. **Developer** hace commit a la rama `dev`
2. **Jenkins** detecta el cambio (webhook o polling)
3. **Pipeline** se ejecuta:
   - Clona el código
   - Detecta que es rama `dev`
   - Configura ambiente `development` y puerto `4200`
   - Construye imagen Docker con `ENV_NAME=development`
   - Angular se compila con `environment.development.ts`
   - Detiene contenedor anterior
   - Inicia nuevo contenedor en puerto 4200
   - Verifica health check
4. **Pipeline** reporta éxito
5. **Application** está disponible en `http://localhost:4200`

---

## 📝 Notas Importantes

- ⚠️ El pipeline asume que Jenkins tiene Docker instalado
- ⚠️ Asegúrate de que los puertos estén disponibles antes del deploy
- ⚠️ Los contenedores se reinician automáticamente con `--restart unless-stopped`
- ✅ Multi-stage build reduce el tamaño de la imagen final
- ✅ Nginx sirve los archivos estáticos de manera eficiente
- ✅ Health checks garantizan que la aplicación esté funcionando

---

## 🎯 Mejoras Futuras

- [ ] Agregar stage de tests unitarios
- [ ] Agregar stage de tests e2e
- [ ] Integrar SonarQube para análisis de código
- [ ] Agregar notificaciones (Slack, Email)
- [ ] Implementar Blue-Green deployment
- [ ] Agregar Docker Compose para orchestration local
- [ ] Configurar Docker Registry privado
- [ ] Agregar secrets management (Docker secrets, Vault)

---

¡Pipeline listo para usar! 🚀
