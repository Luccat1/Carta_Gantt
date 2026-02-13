# Sistema de Gantt Automatizado en Google Sheets

Este sistema te permite gestionar cronogramas de proyectos de forma sencilla, generando vistas de Gantt visuales y automáticas a partir de una lista simple de tareas.

## 🚀 Cómo Empezar

### 1. El Menú "Gantt ⚙️"
Todo el control del sistema está en el menú superior llamado **"Gantt ⚙️"**. Si no lo ves al abrir el archivo, espera unos segundos o recarga la página.

### 2. Hojas Principales
El sistema utiliza 4 hojas clave. No les cambies el nombre para evitar errores.
*   **CONFIG**: Aquí defines el **Año** y **Mes** que quieres visualizar.
*   **TASKS**: Aquí escribes tus tareas (es tu base de datos).
*   **GANTT_VIEW**: Aquí **NO escribas nada manualmente**. Esta hoja se borra y se regenera automáticamente para mostrar el gráfico.
*   **LOOKUPS**: Hoja auxiliar para cálculos internos (normalmente no necesitas tocarla).

---

## 🛠️ Paso a Paso: Tu Flujo de Trabajo

### Paso 1: Configurar la Fecha
Ve a la hoja **CONFIG**:
*   Celda **B1**: Escribe el **Año** (ej. 2026).
*   Celda **B2**: Escribe el número del **Mes** (1 para Enero, 12 para Diciembre).

### Paso 2: Generar la Estructura de Tiempo
En el menú superior, selecciona:
`Gantt ⚙️` > `Generar calendario`

> *Esto actualizará las semanas del mes seleccionado en el sistema.*

### Paso 3: Cargar tus Tareas
Ve a la hoja **TASKS** y completa la información.
Las columnas más importantes para el gráfico son:
*   **Tarea**: Nombre de la actividad.
*   **Inicio**: Fecha de inicio (dd/mm/aaaa).
*   **Fin**: Fecha de fin (dd/mm/aaaa).

> **Ojo:** Asegúrate de que la fecha de Inicio sea anterior o igual a la fecha de Fin.

### Paso 4: Visualizar el Gantt
Cuando hayas cargado o modificado tareas, ve al menú:
`Gantt ⚙️` > `Refrescar vista Gantt`

El sistema borrará la hoja **GANTT_VIEW** y la volverá a dibujar con:
*   Tus tareas actualizadas.
*   Las columnas de las semanas correspondientes.
*   **Barras Azules** marcando la duración de cada tarea.

---

## 🛡️ Herramientas de Seguridad

### Validar Datos
Si crees que hay errores (ej. fechas al revés), usa:
`Gantt ⚙️` > `Validar datos`
El sistema revisará todas las filas y te avisará si encuentra fechas inválidas o ilógicas (Inicio > Fin).

### Cierre de Año (Rollover)
Cuando termine el año y quieras limpiar el archivo:
`Gantt ⚙️` > `Rollover anual`
1.  El sistema guardará todas las tareas del año viejo en una hoja de archivo (ej. `ARCHIVE_2025`).
2.  Mantendrá en `TASKS` solo las tareas futuras.
3.  Avanzará el año en `CONFIG` automáticamente.

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
