---

## 🚀 Instalación y Ejecución por Ambientes

### **Scripts PowerShell por Ambiente**

El proyecto incluye scripts automatizados para iniciar y detener la aplicación en cada ambiente:

#### **🟢 Ambiente de DESARROLLO (Development)**
Base de datos InMemory (volátil), sin Docker, ideal para desarrollo local.

```powershell
# Iniciar aplicación en modo DESARROLLO
.\start-dev.ps1

# Detener aplicación en modo DESARROLLO
.\stop-dev.ps1
```

**Características:**
- Base de datos: InMemory (se reinicia con cada ejecución)
- Caché: MemoryCache local
- No requiere Docker ni PostgreSQL
- Carga automática de datos de prueba (10 categorías, 500 productos)
- Ideal para desarrollo local y pruebas rápidas

**URLs de Acceso:**
- **API**: http://localhost:5195
- **Swagger**: http://localhost:5195/swagger
- **Frontend SPA**: http://localhost:5173
- **Documentación**: http://localhost:5173/documentation

---

#### **🟡 Ambiente de PRUEBAS (Test)**
Configuración especial para testing, base de datos InMemory, sin Docker.

```powershell
# Iniciar aplicación en modo PRUEBAS
.\start-test.ps1

# Detener aplicación en modo PRUEBAS
.\stop-test.ps1
```

**Características:**
- Base de datos: InMemory con configuración de pruebas
- Caché: MemoryCache local
- Sin dependencias externas
- Configuración optimizada para testing automatizado
- Datos de prueba cargados automáticamente

**URLs de Acceso:**
- **API**: http://localhost:5195
- **Swagger**: http://localhost:5195/swagger
- **Frontend SPA**: http://localhost:5173

---

#### **🔴 Ambiente de PRODUCCIÓN (Production)**
PostgreSQL + Redis en contenedores Docker, configuración robusta y persistente.

```powershell
# Iniciar aplicación en modo PRODUCCIÓN
.\start-prod.ps1

# Detener aplicación en modo PRODUCCIÓN
.\stop-prod.ps1
```

**Características:**
- Base de datos: PostgreSQL en Docker (persistente)
- Caché: Redis en Docker (distribuida)
- Requiere Docker Desktop instalado y en ejecución
- Configuración de producción con alta disponibilidad
- Datos persistentes entre reinicios

**URLs de Acceso:**
- **API**: http://localhost:5195
- **Swagger**: http://localhost:5195/swagger
- **Frontend SPA**: http://localhost:5173

---

### **Cargar Datos de Prueba Manualmente**

Si necesitas cargar o recargar datos de prueba en cualquier ambiente:

```powershell
# Cargar 10 categorías predefinidas
.\load-categories.ps1

# Cargar productos (por defecto 500)
.\load-products.ps1

# Cargar cantidad personalizada de productos
.\load-products.ps1 -Total 1000 -BatchSize 100
```

**Nota:** Los scripts `start-dev.ps1` y `start-test.ps1` cargan datos automáticamente si la base de datos está vacía.

---

### **Credenciales de Prueba (Todos los Ambientes)**

- **Usuario**: `admin`
- **Contraseña**: `admin123`

---

### **Inicio Rápido (Alternativa con start-all.ps1)**

También puedes usar el script genérico que detecta el modo automáticamente:

```powershell
# Iniciar aplicación (modo desarrollo por defecto)
.\start-all.ps1

# Iniciar con Docker (modo producción)
.\start-all.ps1 -WithDocker

# Detener todos los servicios
.\stop-all.ps1
```

---
