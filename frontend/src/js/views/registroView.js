export function renderRegistroView() {
  return /*html*/`
    <div class="barra-pasos">
      <div class="indicador-paso activo" data-ind="1">1. Básicos</div>
      <div class="indicador-paso" data-ind="2">2. Laborales</div>
      <div class="indicador-paso" data-ind="3">3. Ubicación</div>
      <div class="indicador-paso" data-ind="4">4. Salud</div>
      <div class="indicador-paso" data-ind="5">5. Hijos</div>
      <div class="indicador-paso" data-ind="6">6. Vacaciones</div>
    </div>

    <!-- PASO 1: DATOS BÁSICOS -->
    <section class="paso" data-step="1">
      <h2>Paso 1: Datos Básicos del Trabajador</h2>
      <div class="grid-campos">
        <div class="campo"><label>Nacionalidad *</label><select id="nacionalidad"><option value="V">V</option><option value="E">E</option></select></div>
        <div class="campo"><label>Cédula *</label><input type="text" id="cedula" placeholder="Ej: 12345678" required /></div>
        <div class="campo"><label>Primer Nombre *</label><input type="text" id="nombre_1" placeholder="Ej: Juan" required /></div>
        <div class="campo"><label>Segundo Nombre</label><input type="text" id="nombre_2" placeholder="Ej: Carlos" /></div>
        <div class="campo"><label>Primer Apellido *</label><input type="text" id="apellido_1" placeholder="Ej: Pérez" required /></div>
        <div class="campo"><label>Segundo Apellido</label><input type="text" id="apellido_2" placeholder="Ej: Gómez" /></div>
        <div class="campo"><label>Fecha Nacimiento *</label><input type="date" id="fecha_nacimiento" min="1930-01-01" max="2026-11-16" required /></div>
        <div class="campo"><label>Sexo *</label><select id="sexo"><option value="M">M - Masculino</option><option value="F">F - Femenino</option></select></div>
        <div class="campo"><label>Estado Civil</label><select id="estado_civil"><option value="Soltero/a">Soltero/a</option><option value="Casado/a">Casado/a</option><option value="Divorciado/a">Divorciado/a</option><option value="Viudo/a">Viudo/a</option></select></div>
        <div class="campo">
          <label>Teléfono</label>
          <input type="tel" id="telefono" list="prefijos-telefono" maxlength="11" placeholder="Ej: 04141234567" />
          <datalist id="prefijos-telefono">
            <option value="0414"></option>
            <option value="0424"></option>
            <option value="0412"></option>
            <option value="0422"></option>
            <option value="0416"></option>
            <option value="0426"></option>
          </datalist>
        </div>
        <div class="campo"><label>Correo</label><input type="email" id="correo" placeholder="usuario@dominio.com" /></div>
        <div class="campo"><label>Centro de Votación</label><input type="text" id="centro_votacion" placeholder="Escriba la descripción del centro" /></div>
        <div class="campo"><label>Estatus *</label><select id="id_estatus" data-catalogo="catalogo_estatus"><option value="">Cargando estatus...</option></select></div>
        <div class="campo"><label>Dirección Habitación</label><input type="text" id="direccion_habitacion" placeholder="Escriba una dirección corta" /></div>
        <div class="campo"><label>Observaciones</label><input type="text" id="observaciones" placeholder="Notas u observaciones adicionales" /></div>
      </div>
      <div class="acciones-wizard">
        <span></span>
        <button type="button" class="btn-primario" data-next="2">Siguiente: Laborales &rarr;</button>
      </div>
    </section>

    <!-- PASO 2: DATOS LABORALES -->
    <section class="paso oculto" data-step="2">
      <h2>Paso 2: Datos Laborales</h2>
      <div class="grid-campos">
        <div class="campo"><label>Código RAC *</label><input type="number" id="codigo_rac" placeholder="Ej: 10254" /></div>
        <div class="campo"><label>Carga Horaria *</label><input type="number" id="carga_horaria" placeholder="Ej: 40" /></div>
        <div class="campo"><label>Fecha Ingreso APN</label><input type="date" id="fecha_ingreso_apn" /></div>
        <div class="campo"><label>Fecha Ingreso MPPS</label><input type="date" id="fecha_ingreso_mpps" /></div>
        <div class="campo"><label>Horario *</label><select id="id_horario" data-catalogo="catalogo_horarios"><option value="">Cargando horarios...</option></select></div>
        <div class="campo"><label>Estatus Contrato *</label><select id="id_estatus_contrato" data-catalogo="catalogo_estatus_contrato"><option value="">Cargando contratos...</option></select></div>
        <div class="campo"><label>Cargo *</label><select id="id_cargo" data-catalogo="catalogo_cargo"><option value="">Cargando cargos...</option></select></div>
        <div class="campo"><label>Nivel / Grado *</label><select id="id_nivel_grado" data-catalogo="catalogo_nivel_grado"><option value="">Cargando niveles...</option></select></div>
      </div>
      <div class="acciones-wizard">
        <button type="button" class="btn-azul-claro" data-prev="1">&larr; Anterior</button>
        <button type="button" class="btn-primario" data-next="3">Siguiente: Ubicación &rarr;</button>
      </div>
    </section>

    <!-- PASO 3: UBICACIÓN LABORAL -->
    <section class="paso oculto" data-step="3">
      <h2>Paso 3: Ubicación Laboral</h2>
      <div class="grid-campos">
        <div class="campo"><label>Ubicación Administrativa *</label><select id="id_ubicacion_administrativa" data-catalogo="catalogo_ubicacion_administrativa"><option value="">Cargando ubicaciones...</option></select></div>
        <div class="campo"><label>Ubicación Física *</label><select id="id_ubicacion_fisica" data-catalogo="catalogo_ubicacion_fisica"><option value="">Cargando ubicaciones...</option></select></div>
        <div class="campo"><label>ASIC *</label><select id="id_asic" data-catalogo="catalogo_asic"><option value="">Cargando ASIC...</option></select></div>
        <div class="campo"><label>Red *</label><select id="id_red" data-catalogo="catalogo_red"><option value="">Cargando redes...</option></select></div>
      </div>
      <div class="acciones-wizard">
        <button type="button" class="btn-azul-claro" data-prev="2">&larr; Anterior</button>
        <button type="button" class="btn-primario" data-next="4">Siguiente: Salud &rarr;</button>
      </div>
    </section>

        <!-- PASO 4: SALUD Y DOTACIÓN -->
    <section class="paso oculto" data-step="4">
      <h2>Paso 4: Salud y Dotación</h2>
      <div class="grid-campos">
        <div class="campo"><label>Talla Pantalón</label><input type="text" id="talla_pantalon" placeholder="Ej: 32 o M" /></div>
        <div class="campo"><label>Talla Camisa</label><input type="text" id="talla_camisa" placeholder="Ej: S, M, L, XL" /></div>
        <div class="campo"><label>Talla Zapatos</label><input type="number" id="talla_zapatos" placeholder="Ej: 42" /></div>
        <div class="campo"><label>Patologías</label><input type="text" id="patologias" placeholder="Ej: Ninguna o describa" /></div>
        <div class="campo"><label>Tratamiento</label><input type="text" id="tratamiento" placeholder="Ej: Ninguno o describa" /></div>
      </div>
      <div class="acciones-wizard">
        <button type="button" class="btn-azul-claro" data-prev="3">&larr; Anterior</button>
        <button type="button" class="btn-primario" data-next="5">Siguiente: Hijos &rarr;</button>
      </div>
    </section>

    <!-- PASO 5: HIJOS -->
    <section class="paso oculto" data-step="5">
      <h2>Paso 5: Carga Familiar (Hijos - Opcional / Múltiple)</h2>
      <div class="grid-campos">
        <div class="campo"><label>Primer Nombre</label><input type="text" id="nombre1_hijo" /></div>
        <div class="campo"><label>Segundo Nombre</label><input type="text" id="nombre2_hijo" /></div>
        <div class="campo"><label>Primer Apellido</label><input type="text" id="apellido1_hijo" /></div>
        <div class="campo"><label>Segundo Apellido</label><input type="text" id="apellido2_hijo" /></div>
        <div class="campo"><label>Fecha Nacimiento</label><input type="date" id="fecha_nacimiento_hijo" /></div>
        <div class="campo"><label>Nacionalidad</label><select id="nacionalidad_hijo"><option value="V">V</option><option value="E">E</option></select></div>
        <div class="campo"><label>Cédula (Opcional)</label><input type="text" id="cedula_hijo" /></div>
        <div class="campo"><label>Sexo</label><select id="sexo_hijo"><option value="M">M</option><option value="F">F</option></select></div>
      </div>
      <button type="button" id="btn-agregar-hijo" class="btn-azul-claro">+ Agregar Hijo a la lista</button>
      <div class="tabla-contenedor">
        <table>
          <thead><tr><th>Nombre Completo</th><th>F. Nacimiento</th><th>Cédula</th><th>Sexo</th><th>Acción</th></tr></thead>
          <tbody id="lista-hijos-preview"></tbody>
        </table>
      </div>
      <div class="acciones-wizard">
        <button type="button" class="btn-azul-claro" data-prev="4">&larr; Anterior</button>
        <button type="button" class="btn-primario" data-next="6">Siguiente: Vacaciones &rarr;</button>
      </div>
    </section>

    <!-- PASO 6: VACACIONES -->
    <section class="paso oculto" data-step="6">
      <h2>Paso 6: Vacaciones (Opcional / Múltiple)</h2>
      <div class="grid-campos">
        <div class="campo"><label>Periodos Vencidos</label><input type="text" id="periodos_vencidos" placeholder="Ej: 2024-2025" /></div>
        <div class="campo"><label>Último Disfrutado</label><input type="text" id="ultimo_disfrutado" placeholder="Ej: 2023-2024" /></div>
        <div class="campo"><label>Fecha Asignada Inicio</label><input type="date" id="fecha_asignada_inicio" /></div>
        <div class="campo"><label>Fecha Asignada Fin</label><input type="date" id="fecha_asignada_fin" /></div>
        <div class="campo"><label>Fecha Inicio Disfrutada</label><input type="date" id="fecha_inicio_disfrutada" /></div>
        <div class="campo"><label>Fecha Fin Disfrutada</label><input type="date" id="fecha_fin_disfrutada" /></div>
      </div>
      <button type="button" id="btn-agregar-vacacion" class="btn-azul-claro">+ Agregar Periodo Vacacional</button>
      <div class="tabla-contenedor">
        <table>
          <thead><tr><th>Vencidos</th><th>Último</th><th>Asignada (Ini/Fin)</th><th>Disfrutada (Ini/Fin)</th><th>Acción</th></tr></thead>
          <tbody id="lista-vacaciones-preview"></tbody>
        </table>
      </div>
      <div class="acciones-wizard">
        <button type="button" class="btn-azul-claro" data-prev="5">&larr; Anterior</button>
        <button type="button" id="btn-guardar-todo" class="btn-verde">Guardar Registro Completo</button>
      </div>
    </section>
  `;
}
