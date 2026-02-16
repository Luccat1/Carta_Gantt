 # Sistema de Gantt Automatizado en Google Sheets

Este sistema te permite gestionar cronogramas de proyectos de forma sencilla, generando vistas de Gantt visuales y automáticas a partir de una lista simple de tareas.

## 🚀 Cómo Empezar

### 1. El Menú "Gantt ⚙️"
Todo el control del sistema está en el menú superior llamado **"Gantt ⚙️"**. Si no lo ves al abrir el archivo, espera unos segundos o recarga la página.

### 2. Hojas Principales
El sistema utiliza hojas clave. No les cambies el nombre para evitar errores.
*   **CONFIG**: Aquí defines el **Año** y **Mes** que quieres visualizar.
*   **PROJECTS**: Catálogo de proyectos activos (ID, Nombre, Owner, Fechas).
*   **TASKS**: Aquí escribes tus tareas (es tu base de datos principal). Referencia a proyectos de la hoja PROJECTS.
*   **ISSUES**: Hoja de errores generada por el validador. **NO escribas nada manualmente**.
*   **GANTT_VIEW**: Hoja del gráfico. **NO escribas nada manualmente**. Esta hoja se borra y se regenera automáticamente.
*   **TIMELINE_DATA**: Datos estructurados para Gráficos de Tiempo nativos de Google. **NO editar**.
*   **DASHBOARD**: Resumen de KPIs, estados y salud de proyectos. Se actualiza automáticamente.
*   **VIEWS**: Vistas filtradas (por Proyecto/Responsable). Generadas bajo demanda desde el menú.
*   **APPSHEET_CONFIG**: Metadatos para configurar AppSheet.
*   **INSTRUCCIONES**: Guía paso a paso para conectar con AppSheet.
*   **LOOKUPS**: Hoja auxiliar para cálculos internos.

---

## 🛠️ Paso a Paso: Tu Flujo de Trabajo

### Paso 1: Configurar Proyectos
Ve a la hoja **PROJECTS**:
*   Define tus proyectos con un ID único y un Nombre. Esto alimentará los desplegables en TASKS.

### Paso 2: Configurar la Fecha Visual
Ve a la hoja **CONFIG**:
*   Celda **B1**: Escribe el **Año** (ej. 2026).
*   Celda **B2**: Escribe el número del **Mes** (1-12).

### Paso 3: Generar la Estructura de Tiempo
En el menú superior, selecciona:
`Gantt ⚙️` > `Generar calendario`

### Paso 4: Cargar tus Tareas
Ve a la hoja **TASKS** y completa la información.
*   **Proyecto**: Selecciona un proyecto del desplegable (basado en la hoja PROJECTS).
*   **ID**: Se recomienda dejar que el sistema lo gestione o usar IDs únicos.
*   **Tarea**: Nombre de la actividad.
*   **Inicio/Fin**: Fechas (dd/mm/aaaa).
*   **Estado**: Selecciona del desplegable.

### Paso 5: Visualizar el Gantt
Menu: `Gantt ⚙️` > `Refrescar vista Gantt`

---

## 🛡️ Herramientas de Calidad

### Validar Datos
En el menú: `Gantt ⚙️` > `Validar datos`
El sistema revisará **PROJECTS** y **TASKS** buscando:
*   IDs duplicados.
*   Fechas ilógicas (Inicio > Fin).
*   Tareas sin proyecto o con proyectos que no existen.
*   Estados inválidos.
Los errores se listan en la hoja **ISSUES**.

### Gestionar Proyectos
`Gantt ⚙️` > `Gestionar proyectos` permite ver un resumen rápido de los proyectos registrados.

### Cierre de Año (Rollover)
`Gantt ⚙️` > `Rollover anual` archiva tareas pasadas y avanza el calendario.

---

---

## 📱 Integración con AppSheet

Este sistema está preparado para conectarse con **AppSheet**, permitiéndote gestionar tus tareas desde el móvil.

*   **Tablas Clave**: `TASKS` (tareas) y `PROJECTS` (proyectos).
*   **Acciones Remotas**: Puedes disparar funciones (como refrescar el Gantt) escribiendo en la columna `_Acción` de la hoja `TASKS`.
*   **Configuración**: Ve a la hoja **INSTRUCCIONES** dentro del archivo para la guía paso a paso.

---

## ❓ Preguntas Frecuentes

**¿Puedo pintar celdas en GANTT_VIEW?**
No te lo recomiendo. Cada vez que uses "Refrescar vista Gantt", esa hoja se borra por completo y se crea de nuevo. Si quieres colores, estos deben venir programados en el sistema automatizado.

**No me aparece el menú Gantt**
Asegúrate de tener permisos de edición en el archivo. Si acabas de abrirlo, espera unos segundos a que carguen los scripts.

**Me dio un error**
Si borraste hojas por accidente, usa:
`Gantt ⚙️` > `Inicializar / reparar estructura`
Esto volverá a crear las hojas y cabeceras que falten.
