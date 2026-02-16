# 📄 Manual de Hojas — Sistema de Gantt

Este documento detalla el propósito de cada hoja del sistema, cómo interactuar con ellas y qué modificaciones son seguras.

---

## 🏗️ Hojas de Entrada (Datos que tú controlas)

### 1. **CONFIG**
*   **Propósito**: Controla el "zoom" temporal del gráfico GANTT_VIEW.
*   **Campos**: 
    *   **Año**: El año que quieres visualizar.
    *   **Mes**: Mes de inicio (1-12).
    *   **MesFin**: Mes de término (si quieres ver varios meses a la vez).
*   **Modificaciones**: 
    *   ✅ **Seguro**: Cambiar los valores en la columna B.
    *   ❌ **No Seguro**: Cambiar las etiquetas en la columna A o cambiar el nombre de la hoja.

### 2. **PROJECTS**
*   **Propósito**: Tu catálogo maestro de proyectos. Cada tarea en el sistema debe pertenecer a uno de estos.
*   **Campos Clave**: 
    *   **ProyectoID**: ID único (se genera solo si lo dejas vacío).
    *   **Nombre**: Nombre del proyecto (se usa para vincular con las tareas).
    *   **Color**: Código hexadecimal (ej. #ff0000) que define el color de las barras en el Gantt.
*   **Modificaciones**: 
    *   ✅ **Seguro**: Agregar nuevas filas, añadir columnas al final (ej. "Presupuesto", "Cliente").
    *   ❌ **No Seguro**: Borrar las columnas originales o renombrar la hoja.

### 3. **TASKS**
*   **Propósito**: Tu base de datos de actividades. Es la fuente de verdad del sistema.
*   **Campos Clave**:
    *   **Proyecto**: Seleccionable vía desplegable (conectado a PROJECTS).
    *   **ID**: ID único de tarea (automatizado).
    *   **Inicio / Fin**: Fechas de la actividad.
    *   **Estado**: Controla el ciclo de vida (No iniciado, En curso, etc.).
    *   **_Acción**: Columna especial para AppSheet (Refrescar, Estados, Dashboard).
*   **Modificaciones**: 
    *   ✅ **Seguro**: Insertar filas entre tareas existentes, añadir columnas personalizadas al final.
    *   ❌ **No Seguro**: Mover o borrar columnas base. Borrar los IDs de tarea (aunque el sistema los volverá a crear).

### 4. **TEMPLATES**
*   **Propósito**: Define grupos de tareas "modelo" para clonarlas rápidamente a nuevos proyectos.
*   **Modificaciones**: 
    *   ✅ **Seguro**: Crear tus propias plantillas añadiendo filas con un nombre de plantilla nuevo.
    *   ❌ **No Seguro**: Cambiar los nombres de las cabeceras.

---

## 🖥️ Hojas de Visualización (Solo Lectura)
*Estas hojas se borran y regeneran por código. No guardes datos manuales aquí.*

### 5. **GANTT_VIEW**
*   El gráfico de barras principal. Se actualiza con "Refrescar vista Gantt".
*   **Nota**: No intentes dar formato manual; el script lo sobreescribirá.

### 6. **DASHBOARD**
*   Resumen visual de KPIs y salud. Se actualiza con "Refrescar Dashboard".
*   Muestra tareas vencidas y progreso por proyecto.

### 7. **TIMELINE_DATA**
*   Estructura intermedia para alimentar el gráfico de "Cronograma" nativo de Google Sheets (Insertar > Gráfico > Gráfico de tiempo).

### 8. **VIEWS**
*   Aquí aterrizan los resultados de los filtros porProyecto o porResponsable.

---

## ⚙️ Hojas de Sistema (Mantenimiento)

### 9. **LOOKUPS**
*   Mapeos internos de fechas y posiciones. Prohibido editar.

### 10. **ISSUES**
*   Aquí el comando "Validar datos" escribe los errores encontrados. Si esta hoja está vacía, tus datos están sanos.

### 11. **APPSHEET_CONFIG** e **INSTRUCCIONES**
*   Contienen metadatos y la guía para conectar tu móvil. Solo lectura.

---

## 🆘 ¿Cómo reparar si algo se rompe?
Si accidentalmente borras una columna o una hoja completa, no entres en pánico. Ve al menú superior:
**`Gantt ⚙️` > `Inicializar / reparar estructura`**
El script reconstruirá todo lo que falte respetando tus datos existentes.
