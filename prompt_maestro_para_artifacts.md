Copia y pega exactamente el siguiente bloque de texto en Claude (Artifacts):

```markdown
Actúa como un Desarrollador Frontend Senior y Diseñador UX especializado en plataformas cívicas de análisis de datos y transparencia gubernamental. 

Crea un MVP completo, interactivo y completamente funcional en un solo archivo React (.jsx) utilizando Tailwind CSS, Lucide React y Recharts para una plataforma ciudadana llamada **"Termómetro Cívico MX"**.

La plataforma permite evaluar objetivamente el desempeño histórico de Presidentes de México (desde Ernesto Zedillo hasta Claudia Sheinbaum) y Gobernadores estatales seleccionables, midiendo exclusivamente si cada eje clave MEJORÓ (▲ verde) o EMPEORÓ (▼ rojo) entre el inicio y el fin de su gestión, basándose en datos públicos oficiales de México.

### 1. REQUISITOS DE NAVEGACIÓN Y ESTRUCTURA:
- **Selector de Nivel:** Pestañas superiores para alternar entre "Presidencia de la República" y "Gobernadores Estatales".
- **Selector de Entidad Federativa:**
  - Selector desplegable y Grid interactivo representativo de los 32 estados de México con buscador rápido y filtro por región o partido gobernante actual.
  - Al seleccionar un estado o la Presidencia, se carga la cronología de mandatarios correspondiente.
- **Línea de Tiempo Interactiva (Timeline):**
  - Una barra temporal horizontal deslizable o navegable con chips/nodos por cada periodo de mandato histórico.
  - Para Presidencia: Ernesto Zedillo (1994-2000), Vicente Fox (2000-2006), Felipe Calderón (2006-2012), Enrique Peña Nieto (2012-2018), Andrés Manuel López Obrador (2018-2024), y Claudia Sheinbaum (2024-Presente).
  - Para Estados: Incluir datos completos de ejemplo histórico para estados clave (ej. CDMX, Estado de México, Jalisco, Nuevo León, Veracruz, Puebla) y selector para el resto con estados iniciales configurados.
  - Al hacer clic en un mandatario en la línea de tiempo, se actualiza dinámicamente todo el dashboard.

### 2. FICHA DEL MANDATARIO Y SCORE GENERAL:
- **Header del Perfil:**
  - Nombre completo, cargo, periodo exacto (fechas de inicio y conclusión o "En curso").
  - Siglas y distintivo de color del partido político (PRI, PAN, MORENA, MC, PRD, Independiente, etc.).
  - Avatar o silueta institucional estilizada.
- **Termómetro / Score General de Balance:**
  - Calificación resumida del balance neto: ej. "+3 Ejes con Mejora | -1 Eje con Deterioro" o un índice ponderado cívico de 0 a 100 o escala neta (% de mejora acumulada).
  - Distintivo visual claro: "Balance Positivo", "Balance Mixto", "Balance Negativo" o "Gestión en curso (datos preliminares)".

### 3. DESGLOSE ANALÍTICO POR 4 EJES CLAVE (CARD POR CADA EJE):
Cada eje debe mostrar claramente:
1. **Seguridad Pública:**
   - Métrica: Tasa anualizada de homicidios dolosos por cada 100k hab.
   - Fuente: SESNSP (Secretariado Ejecutivo del SNSP).
   - Valor inicial (T0) vs. Valor final (T1) -> Delta porcentual (% cambio) con badge verde si bajó o rojo si subió.
2. **Economía y Empleo:**
   - Métricas: Crecimiento promedio anual del PIB/ITAEE (%) y generación de puestos formales registrados ante el IMSS.
   - Fuente: INEGI (Banco de Información Económica) / IMSS.
   - T0 vs T1 y comparativa de desempeño.
3. **Pobreza y Bienestar Social:**
   - Métricas: Porcentaje de población en situación de pobreza multidimensional o rezago social.
   - Fuente: CONEVAL (Medición multidimensional de la pobreza).
   - T0 vs T1 y variación de puntos porcentuales.
4. **Disciplina Financiera y Percepción de Corrupción:**
   - Métricas: Deuda pública estatal o federal respecto a participaciones/PIB (SHCP) y Tasa de prevalencia de corrupción por cada 100k hab en trámites (ENCIG - INEGI).
   - T0 vs T1 y balance de solvencia.

### 4. VISUALIZACIÓN DE DATOS (GRÁFICOS):
- Incorporar gráficos interactivos con `Recharts` (LineChart o BarChart) que muestren la evolución anual durante el sexenio/periodo del mandatario activo, contrastando la trayectoria con el punto de partida (T0 con ventana de inercia de 6 meses).
- Tooltips explicativos al pasar el cursor sobre los datos.

### 5. MODAL / SECCIÓN DE METODOLOGÍA Y FUENTES OFICIALES:
- Botón visible **"Metodología y Fuentes"**:
  - Explicación de la **Ventana de Inercia de 6 meses** (por qué los primeros 180 días se consideran herencia de la administración anterior para no penalizar/premiar de inmediato).
  - Enlaces salientes y referencias exactas a portales oficiales de datos abiertos:
    - *SESNSP (Datos Abiertos de Incidencia Delictiva)*
    - *INEGI (BIE - Banco de Información Económica y ENCIG)*
    - *CONEVAL (Evolución de Pobreza)*
    - *SHCP (Registro Público Único de Financiamientos y Deuda)*

### 6. DISEÑO Y DETALLES TÉCNICOS:
- **Estilo Visual:** Look cívico, neutral, moderno y analítico (inspirado en plataformas como DataMéxico, Pew Research o Our World in Data).
- **Tipografía y Contraste:** Uso equilibrado de grises oscuros, tipografía sans-serif limpia, bordes sutiles y tarjetas elevadas.
- **Componentes y Tooltips:** Filtro de búsqueda, tarjetas colapsables de detalles, botones de descarga o compartición simbólica, y tabs responsivos.
- Código 100% libre de errores, estructurado en un único componente exportable por defecto (`export default function TermometroCivico() { ... }`).
```
```