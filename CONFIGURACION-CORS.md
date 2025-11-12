# 🌐 Configuración de CORS y Proxy

## 📋 Resumen

El problema de CORS (Cross-Origin Resource Sharing) ocurre cuando el frontend intenta hacer peticiones a microservicios en diferentes puertos. Este documento explica cómo se resolvió.

---

## 🔍 El Problema

- **Frontend**: Corre en `http://localhost:4200` (dev) o en Docker
- **Microservicios**: Corren en puertos diferentes (8082, 8102, 8112, 8202)
- **Navegador**: Bloquea peticiones entre diferentes puertos por seguridad (CORS)

---

## ✅ Soluciones Implementadas

### **1. Desarrollo Local (sin Docker)**

Para desarrollo local usamos el **proxy integrado de Angular**:

#### Archivos:
- `proxy.conf.json` - Configuración del proxy
- `environment.ts` y `environment.development.ts` - URLs relativas (`/api/v1`)

#### Cómo funciona:
1. Frontend corre en `http://localhost:4200`
2. Peticiones a `/api/v1/auth` se redirigen a `http://localhost:8202/api/v1/auth`
3. Peticiones a `/api/v1/expenses` se redirigen a `http://localhost:8082/api/v1/expenses`
4. No hay problema de CORS porque Angular Dev Server actúa como intermediario

#### Comandos:
```bash
# Detener contenedor Docker del frontend (si está corriendo)
docker stop front-dev
docker rm front-dev

# Iniciar desarrollo local con proxy
npm run start:dev
```

---

### **2. Docker / Jenkins Pipeline (QA y Producción)**

Para ambientes con Docker usamos **Nginx como proxy inverso**:

#### Archivos:
- `nginx-dev.conf` - Proxy para puertos de DEV (8082, 8102, 8112, 8202)
- `nginx-qa.conf` - Proxy para puertos de QA (8081, 8101, 8111, 8201)
- `nginx-prod.conf` - Proxy para puertos de PROD (8080, 8100, 8110, 8200)
- `environment.qa.ts` y `environment.production.ts` - URLs relativas

#### Cómo funciona:
1. Frontend corre en contenedor Docker con Nginx
2. Nginx escucha en puerto 80
3. Cuando llega una petición a `/api/v1/auth`, Nginx la redirige a `host.docker.internal:8202`
4. `host.docker.internal` permite al contenedor acceder a servicios en el host

#### Ejemplo de configuración Nginx:
```nginx
location /api/v1/auth {
    proxy_pass http://host.docker.internal:8202/api/v1/auth;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    # ... más headers
}
```

---

## 🚀 Ejecución del Pipeline

Cuando ejecutes el pipeline de Jenkins:

### **Branch DEV:**
1. Jenkins construye con `--build-arg ENV_NAME=development`
2. Dockerfile copia `nginx-dev.conf` → usa puertos 8202, 8082, 8102, 8112
3. Contenedor `front-dev` corre en puerto 4200

### **Branch QA:**
1. Jenkins construye con `--build-arg ENV_NAME=qa`
2. Dockerfile copia `nginx-qa.conf` → usa puertos 8201, 8081, 8101, 8111
3. Contenedor `front-qa` corre en puerto 4201

### **Branch MAIN/MASTER:**
1. Jenkins construye con `--build-arg ENV_NAME=production`
2. Dockerfile copia `nginx-prod.conf` → usa puertos 8200, 8080, 8100, 8110
3. Contenedor `front-prod` corre en puerto 4202

---

## ⚙️ Arquitectura de Puertos

| Ambiente | Frontend | Auth | Expenses | Incomes | Categories |
|----------|----------|------|----------|---------|------------|
| **Local** | 4200 | 8202 | 8082 | 8102 | 8112 |
| **Dev** | 4200 | 8202 | 8082 | 8102 | 8112 |
| **QA** | 4201 | 8201 | 8081 | 8101 | 8111 |
| **Prod** | 4202 | 8200 | 8080 | 8100 | 8110 |

---

## 🔧 Verificación

### Desarrollo Local:
```bash
# 1. Iniciar microservicios en Docker
docker ps  # Verificar que estén corriendo

# 2. Iniciar frontend local
npm run start:dev

# 3. Abrir navegador
http://localhost:4200
```

### Docker (después del pipeline):
```bash
# Verificar contenedor
docker ps | grep front-dev

# Ver logs
docker logs front-dev

# Ver configuración nginx dentro del contenedor
docker exec front-dev cat /etc/nginx/conf.d/default.conf

# Probar endpoint
curl http://localhost:4200/api/v1/auth/login
```

---

## 🐛 Solución de Problemas

### Error: "No se pudo conectar con el servidor"

**Causa**: Los microservicios no están corriendo o no están en los puertos esperados.

**Solución**:
```bash
# Verificar microservicios
docker ps | grep ms

# Verificar logs de microservicios
docker logs msuser-dev
docker logs msexpense-dev
docker logs msincome-dev
docker logs mscategories-dev

# Verificar que responden
curl http://localhost:8202/api/v1/auth/login -d '{"email":"test","password":"test"}' -H "Content-Type: application/json"
```

### Error: "CORS policy blocked"

**Causa**: Configuración de proxy no está funcionando.

**Solución para Local**:
```bash
# Verificar que proxy.conf.json existe
cat proxy.conf.json

# Reiniciar con proxy
npm run start:dev
```

**Solución para Docker**:
```bash
# Verificar nginx config en contenedor
docker exec front-dev cat /etc/nginx/conf.d/default.conf

# Debería mostrar las configuraciones de proxy
# Si no, reconstruir imagen
docker build --build-arg ENV_NAME=development -t gestion-gastos-dev .
```

### Error: "host.docker.internal not found"

**Causa**: En Linux, `host.docker.internal` no está disponible por defecto.

**Solución**:
```bash
# Opción 1: Agregar --add-host al docker run (en Jenkinsfile)
docker run --add-host=host.docker.internal:host-gateway ...

# Opción 2: Usar IP del host
# En nginx-*.conf cambiar host.docker.internal por la IP del host
# Ejemplo: 192.168.1.100:8202
```

---

## 📝 Notas Importantes

1. **Desarrollo Local**: Usa `proxy.conf.json` con Angular Dev Server
2. **Docker**: Usa Nginx como proxy inverso
3. **Rutas Relativas**: Todos los environments usan `/api/v1` (rutas relativas)
4. **host.docker.internal**: Permite acceder al host desde dentro del contenedor
5. **Jenkinsfile**: Pasa `ENV_NAME` correctamente con `--build-arg`

---

## ✅ Checklist para Deployment

- [ ] Microservicios corriendo en puertos correctos
- [ ] Jenkinsfile pasa `ENV_NAME` como build argument
- [ ] Dockerfile copia el nginx correcto según ambiente
- [ ] Environments usan rutas relativas (`/api/v1`)
- [ ] Contenedor frontend puede acceder a `host.docker.internal`
- [ ] Puerto del contenedor mapeado correctamente (4200/4201/4202:80)

---

¡Ahora sí deberías poder ejecutar el pipeline sin problemas de CORS! 🎉
