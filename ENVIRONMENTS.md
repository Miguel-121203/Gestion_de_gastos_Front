# 🌍 Configuración de Ambientes

Este proyecto está configurado para trabajar con **4 ambientes diferentes**: Local, Dev, QA y Production.

## 📋 Configuración de Puertos por Ambiente

### MS_EXPENSE (Gastos)
| Ambiente   | Puerto |
|------------|--------|
| Local      | 8082   |
| Dev        | 8082   |
| QA         | 8081   |
| Production | 8080   |

### MS_INCOME (Ingresos)
| Ambiente   | Puerto |
|------------|--------|
| Local      | 8102   |
| Dev        | 8102   |
| QA         | 8101   |
| Production | 8100   |

### MS_CATEGORIES (Categorías)
| Ambiente   | Puerto |
|------------|--------|
| Local      | 8112   |
| Dev        | 8112   |
| QA         | 8111   |
| Production | 8110   |

### MS_USER (Autenticación)
| Ambiente   | Puerto |
|------------|--------|
| Local      | 8202   |
| Dev        | 8202   |
| QA         | 8201   |
| Production | 8200   |

---

## 🚀 Comandos para Ejecutar Cada Ambiente

### 1️⃣ **Local (ambiente por defecto)**
```bash
ng serve
# o
npm start
```
**URL:** `http://localhost:4200`

**Servicios backend esperados en:**
- Gastos: `http://localhost:8082/api/v1/expenses`
- Ingresos: `http://localhost:8102/api/v1/incomes`
- Categorías: `http://localhost:8112/api/v1/categories`
- Auth: `http://localhost:8202/api/v1/auth`

---

### 2️⃣ **Development**
```bash
ng serve --configuration=development
# o
npm run start:dev
```
**URL:** `http://localhost:4200`

**Servicios backend esperados en:**
- Gastos: `http://localhost:8082/api/v1/expenses`
- Ingresos: `http://localhost:8102/api/v1/incomes`
- Categorías: `http://localhost:8112/api/v1/categories`
- Auth: `http://localhost:8202/api/v1/auth`

---

### 3️⃣ **QA (Quality Assurance)**
```bash
ng serve --configuration=qa
# o
npm run start:qa
```
**URL:** `http://localhost:4200`

**Servicios backend esperados en:**
- Gastos: `http://localhost:8081/api/v1/expenses`
- Ingresos: `http://localhost:8101/api/v1/incomes`
- Categorías: `http://localhost:8111/api/v1/categories`
- Auth: `http://localhost:8201/api/v1/auth`

---

### 4️⃣ **Production**
```bash
ng serve --configuration=production
# o para build
ng build --configuration=production
```
**URL (después de build):** Depende del servidor donde se despliegue

**Servicios backend esperados en:**
- Gastos: `http://localhost:8080/api/v1/expenses`
- Ingresos: `http://localhost:8100/api/v1/incomes`
- Categorías: `http://localhost:8110/api/v1/categories`
- Auth: `http://localhost:8200/api/v1/auth`

---

## 📦 Builds por Ambiente

### Build para Development
```bash
ng build --configuration=development
```

### Build para QA
```bash
ng build --configuration=qa
```

### Build para Production
```bash
ng build --configuration=production
# o simplemente
ng build
```

Los archivos compilados se generan en la carpeta `dist/`

---

## 🔧 Agregar Scripts al package.json

Puedes agregar estos scripts a tu `package.json` para facilitar el uso:

```json
{
  "scripts": {
    "start": "ng serve",
    "start:dev": "ng serve --configuration=development",
    "start:qa": "ng serve --configuration=qa",
    "start:prod": "ng serve --configuration=production",
    "build": "ng build --configuration=production",
    "build:dev": "ng build --configuration=development",
    "build:qa": "ng build --configuration=qa",
    "build:prod": "ng build --configuration=production"
  }
}
```

---

## 📁 Estructura de Archivos de Configuración

```
src/
└── environments/
    ├── environment.ts               # Local (por defecto)
    ├── environment.development.ts   # Development
    ├── environment.qa.ts            # QA
    └── environment.production.ts    # Production
```

Cada archivo contiene:
```typescript
export const environment = {
  production: boolean,
  envName: string,
  apiUrls: {
    expenses: string,
    incomes: string,
    categories: string,
    auth: string
  }
};
```

---

## ✅ Verificar el Ambiente Actual

Para saber en qué ambiente estás corriendo, abre la consola del navegador y ejecuta:

```javascript
console.log('Ambiente:', environment.envName);
console.log('URLs:', environment.apiUrls);
```

---

## 🔐 Consideraciones de Seguridad

⚠️ **IMPORTANTE:** Las URLs actuales están configuradas con `localhost`. Antes de desplegar a QA o Production, debes:

1. Cambiar `localhost` por las IPs/dominios reales de tus servidores
2. Configurar HTTPS en producción
3. Actualizar los archivos de environment correspondientes

### Ejemplo para Production:
```typescript
export const environment = {
  production: true,
  envName: 'production',
  apiUrls: {
    expenses: 'https://api.tudominio.com:8080/api/v1',
    incomes: 'https://api.tudominio.com:8100/api/v1',
    categories: 'https://api.tudominio.com:8110/api/v1',
    auth: 'https://api.tudominio.com:8200/api/v1/auth'
  }
};
```

---

## 🧪 Testing

Para ejecutar tests con un ambiente específico:

```bash
ng test --configuration=qa
```

---

## 📝 Notas

- Por defecto, `ng serve` usa el ambiente **local**
- `ng build` sin configuración usa **production**
- Los cambios en los archivos de environment requieren reiniciar el servidor de desarrollo
- Asegúrate de que los microservicios backend estén corriendo en los puertos configurados antes de iniciar el frontend

---

## 🆘 Troubleshooting

### Error: "Cannot connect to backend"
1. Verifica que los microservicios estén corriendo en los puertos correctos
2. Revisa el ambiente que estás usando: `environment.envName`
3. Comprueba la configuración en el archivo de environment correspondiente

### Los cambios en environment no se aplican
1. Detén el servidor: `Ctrl + C`
2. Reinicia: `ng serve --configuration=<ambiente>`
3. Limpia caché si es necesario: `rm -rf .angular/cache`

---

¡Todo listo! 🎉 Ahora puedes trabajar con diferentes ambientes fácilmente.
