# GLOMP! — Plan maestro completo (para Codex)

Escrito para: Codex, ejecutando el proyecto de principio a fin. Este plan desglosa los hitos de `AGENTS.md` §6 en tareas concretas. Si hay conflicto, gana `AGENTS.md` (incluida §11).

Reglas de oro: un hito por sesión · al final de cada tarea `node tools/build.js && node tools/check.js` · un commit por tarea (`modulo: mensaje`) · no se cierra un hito sin que una persona lo juegue · si algo exige el editor y no es scaffoldeable, se anota en `docs/EDITOR_TODO.md` y se sigue.

## Calendario (3 semanas)

| Semana | Hitos |
|---|---|
| Pre | Humano crea `reference/empty.json` (30 min) |
| 1 | H0 Andamio · H0.5 Shell UI · H1 Sensación · H2 Eat it Eat them · H3 Partida |
| 2 | H4 POM + Crazy · H5 Personalización/tienda |
| 3 | H6 Buffet · H7 Guerra (se corta si H5 no cerró) · H8 Congelación (últimos 3 días) |

Orden de corte si aprieta: Guerra → Buffet → Crazy. Mínimo viable de demo: Eat it Eat them + POM + Crazy con partida completa y tienda.

## Mapa de dependencias

```
H0 → H0.5 → H1 → H2 → H3 → H4 → H5 → H6 → H7 → H8
                   └──────────┘ (H3 ya puede usar solo EatEm)
```
Assets: cada hito pide solo los suyos (columna "Assets").

---

## H0 — Andamio (medio día)

Tareas
1. `docs/GDEVELOP_NOTES.md`: esquema real leído de `reference/empty.json` (versión del formato, forma de un evento `BuiltinCommonInstructions::JsCode`, listas de objetos/escenas/recursos/instancias/capas/comportamientos). Si el esquema no es el esperado: PARAR y avisar.
2. `tools/build.js`: localiza `// GLOMP:INJECT scene=<X>`, sustituye por el contenido compuesto de los `src/*.js` indicados para esa escena, idempotente, backup `game.json.bak.<timestamp>`.
3. `tools/check.js`: JSON válido, todas las escenas esperadas presentes, exactamente un JsCode por escena con marcador, referencias de recursos existentes en `assets/`, estructura comparada con `reference/empty.json`.
4. `tools/scaffold.js`: genera/actualiza en `game.json` escenas, objetos, recursos, capas e instancias a partir de `tools/project.manifest.json` (nunca toca eventos salvo crear el JsCode con marcador).
5. `src/config.js` (todo §5.1 + el resto de números de balance de §5.6 y §5.7 desde el principio), `src/boot.js` (namespace `GLOMP`, carga de guardado, lectura de mandos).
6. Prueba de mandos: `navigator.getGamepads()` con log de conectados; ajustar `maxPlayers` y anotar en NOTES.
7. `tools/gen_assets.js` + `assets/manifest.json` + `tools/chroma.js` (recorte de fondo `#FF00FF`).
8. Bundling: como GDevelop no importa módulos, `build.js` concatena `src/**/*.js` en un único bloque (orden: config, i18n, save, input, player, food, match, hud, ui, shop, minigames) por escena, protegido con `if (!GLOMP.__loaded)` para evitar redefinir.

Aceptación: `build && check` pasa; GDevelop abre sin avisos; consola imprime nº de mandos.

---

## H0.5 — Shell de UI estilo Brawl (2-3 días)

Flujo de pantallas

```
Boot → Menu ─┬→ Lobby → Customize → (Ruleta) → partida
             ├→ Shop
             ├→ Settings
             └→ Salir/Créditos
```

Escenas y contenido

| Escena | Contenido |
|---|---|
| `Boot` | Carga, logo, init de `GLOMP`, ir a `Menu` |
| `Menu` | Fondo animado, logo GLOMP!, botones JUGAR / TIENDA / AJUSTES / SALIR, slimes decorativos rebotando, contador de Glomps |
| `Lobby` | 6 tarjetas de jugador (vacía "Pulsa A", ocupada con slime + nombre + icono de marcador, estado LISTO), botón EMPEZAR cuando ≥2 listos, indicador de nº de mandos, teclado para J1/J2 |
| `Customize` | Slime grande al centro, 5 pestañas de capas, rejilla de piezas con candado/precio, vista previa inmediata, botones EQUIPAR / COMPRAR |
| `Shop` | Escaparate 6 rotativos + catálogo completo, saldo, confirmación de compra |
| `Settings` | Volumen música/efectos, pantalla completa, remapeo de teclado (J1/J2), `maxPlayers` (2-6), idioma (es), reset de guardado con confirmación |
| `Results`/`Reparto` | Podio de la ronda, rebanadas ganadas, Glomps ganados |
| `Pause` | Overlay: continuar / ajustes / salir al menú |

Módulos
- `src/ui.js`: foco (grafo de navegación arriba/abajo/izq/der), botones con estados (normal/foco/pulsado/deshabilitado), `focus`, `activate`, `back`, transiciones por `dt`, pila de pantallas.
- `src/i18n.js`: todas las cadenas en español.
- `src/input.js`: abstracción de acciones (`move`, `action`, `confirm`, `back`, `aim`) por jugador con mando y teclado; mapeo configurable desde Settings; hot-plug (conexión/desconexión → bot toma el control, §5.4).

Assets (Nano Banana): logo, fondo menú, fondo lobby, botones (3 colores × normal/foco/pulsado), paneles, tarjetas de jugador, candados, iconos de marcador (6), icono Glomp, flechas, toggles/sliders, iconos de ajustes.

Aceptación: se navega todo el shell solo con mando y solo con teclado; B vuelve; sin foco perdido; se ve igual a 30 y 144 fps.

---

## H1 — Que moverse y comer se sienta rico (semana 1)

- `src/player.js`: Jugador único (§5.2), movimiento por vector normalizado con aceleración/fricción suaves, `scale`/`speed` desde fórmulas de config, estados (`normal`, `dashing`, `stunned`, `immune`, `stuck`, `dead`).
- Squash & stretch: estiramiento en la dirección de movimiento proporcional a la velocidad, aplastamiento al frenar/girar, "gulp" al comer (pulso de escala 120 ms), todo con acumuladores de `dt`.
- `src/food.js`: tabla §5.3 completa, spawn en puntos libres, recogida por distancia al centro.
- Capas del slime: cuerpo tintado + cara + accesorio + partículas + rastro dibujados sobre el mismo transform.
- Prueba en escena `Sandbox` (arena vacía con comida).
- Assets: slime base (idle/move/eat), 8 comidas, partículas de migajas, suelo de prueba.

Aceptación: una persona mueve, come, crece y dice que se siente bien. Sin esto no se sigue.

---

## H2 — Eat it, Eat them (semana 1)

Tareas, en este orden:
1. Arena con tamaño por nº de jugadores, muros del borde, 3-4 arbustos (ocultan escala <1.6).
2. Spawn en el borde + 3 s de inmunidad (parpadeo suave).
3. Devorar (×1.3, 0.3 s cubriendo, 50 % masa, resto como bocaditos), regla de "el primero que cubre", rebote suave si tamaños casi iguales.
4. Reaparición a los 2 s con 30 % masa (mín. 5) + 3 s inmunidad.
5. Auras rojo/verde.
6. Bots grises (4 en escena, +5 masa, respawn 10 s, movimiento al azar sin atascarse).
7. Salsa desde 45 s (12 % cada 25 s, −4 masa/s, −30 % vel, nunca elimina a masa 0).
8. Chispazo (+60 % vel 0.8 s, coste 3, cooldown 1.5 s, migajas).
9. HUD: tarjetas laterales, cronómetro 2:30, frase de aviso.
10. Fin: gana el de más masa; desempate por orden de llegada a esa masa.

Assets: mapa(s) del tema (candy primero), arbustos, salsa (tile + borde animado), aura (2 anillos), slime gris de bot, tarjeta HUD.

Aceptación: 2 personas juegan 2:30 y cada una devora o es devorada ≥2 veces.

---

## H3 — La partida existe (semana 1)

- `src/match.js`: máquina de estados Menu → Lobby → Personalizar → Ruleta → Instrucción 5 s (saltable) → Minijuego → Reparto → Ruleta…; rebanadas (2/1/0), empates, desempate de ronda, primero a 5; ruleta con filtro por nº de jugadores y sin repetir; gira sola a los 3 s.
- Pantalla de resultados finales con podio y Glomps.
- `src/save.js`: `localStorage` con versión de esquema y try/catch; Glomps, compras, equipado, primera partida del día.
- Economía §5.7 incluyendo ×1.5 con ≥4 personas y garantía de >0 Glomps.
- Assets: ruleta (rueda + puntero + iconos de los 5 minijuegos), podio, rebanada (pizza/tarta), confeti.

Aceptación: partida completa a 5 rebanadas con solo Eat it Eat them, 4 personas, sin errores.

---

## H4 — Bubble POM! + Crazy Ingredients (semana 2)

POM (`src/minigames/pom.js`)
- Generador de bombas con las 3 clases + Misteriosa (anillo punteado de zona máxima), frecuencia por tramos, máx. 10 simultáneas.
- Garantías: aviso ≥0.8 s sobre jugador, ≤60 % del suelo cubierto, ruta libre ≥120 px (comprobación por rejilla/flood-fill antes de colocar cada bomba; si falla, se descarta o se desplaza).
- Charco 2 s (−50 %), banana 15 s, reducción de arena al 50 % desde 0:50, empate a 1:15.
- Acción: sin efecto (intencional).

Crazy (`src/minigames/crazy.js`)
- Suelo con comida revuelta (máx. 40, +1 cada 3 s), pedido anunciado 1 s antes, ✓ al tocar, eliminación al llegar a 0, embudo de tiempos/tipos, halo dorado, nunca dentro de obstáculo, empate por centro más cercano.
- Antibloqueo: tras 3 pedidos sin caídas, máx. (vivos−1) unidades del pedido.
- Termina cuando queda uno.

Assets: bombas (3 tipos + misteriosa), zonas de aviso (círculo/óvalos), explosión, charco, banana, 14 tipos de comida para Crazy, halo dorado, ✓, calavera/fantasma de eliminado.

Aceptación: `tools/selftest.js` corre 50 rondas de POM verificando las 3 garantías y Crazy dispara el antibloqueo y siempre termina.

---

## H5 — Personalización y tienda (semana 2)

- `src/shop.js`: catálogo de 31 piezas con precio (color 40, cara 30, accesorio 60, partículas 80, rastro 100, set 180), escaparate rotativo diario, compra, set completo.
- Pantalla Customize/Shop (del H0.5) conectada a `save.js`.
- Vista previa inmediata sobre el slime; ninguna pieza afecta hitbox ni valores de config (invariante 6 en selftest).
- Icono de marcador siempre visible sobre cada slime.
- Se arranca con cuerpo + 3 caras; el resto bloqueado.
- Assets (los 31): 8 cuerpos (paleta del sample), 6 caras, 10 accesorios (chef, copa/bigote, gafas estrella, bandana ninja, bruja/mago, pirata, vaquero, casco, corona, auriculares gamer), 4 partículas, 3 rastros, miniaturas de catálogo.

Aceptación: comprar accesorio, equipar, cerrar navegador, reabrir, sigue puesto.

---

## H6 — Buffet Blitz (semana 3)

- Reutiliza arena, comida, devorar-no (aquí no hay devorar), HUD.
- Spawn: bocadito 1.2/s (máx. 60), plato cada 3 s (máx. 10), Manjar a los 10 s y cada 20 s lejos del líder, 1.0 s encima, cancelado si te empujan.
- Corona al líder.
- Zampada: 180 px/0.18 s, cooldown 3 s, empuja 120 px, aturde 0.6 s, suelta 5 % (mín. 2, máx. 12), inmunidad 1.5 s, se detiene contra pared.
- Última comilona 100-120 s (×2 valor y aparición, bordes dorados), banana, antiatasco en pared, desempate por Manjares.
- Assets: plato, Manjar, corona, borde dorado, efecto de zampada, mapa cooking.

Aceptación: 3-6 jugadores, ronda completa, el líder cambia al menos una vez.

---

## H7 — Guerra de Comida (semana 3, solo si H5 cerrado)

- Apuntado (palanca derecha / ratón / teclado J2 por 8 direcciones con asistencia 8°), flecha de 40 px, cadencia 0.35 s.
- Proyectiles: tomate 700 px/s, chicle 500 px/s + charco 3 s, sandía 400 px/s en arco con área 90 px (35/20), choque entre proyectiles, salpicadura en muro.
- Inventario 3 huecos (lechuga/banana ocupan hueco), 6-8 cajas, 1 comida/4 s/caja con reparto 45/20/20/10/5, cajas dan doble lechuga al más débil.
- Vida 100 con barra, inmunidad 0.6 s, retroceso 80 px, cuerpo a cuerpo sin daño.
- Zona: cierra desde 30 s hasta 40 %, −15 de vida cada 2.5 s fuera.
- Fin: último en pie o más vida a 2:00; empates comparten.
- Assets: tomate, chicle, sandía, lechuga, banana, cajas, flecha de apuntado, barra de vida, borde de zona, salpicaduras, mapa slime.

Aceptación: ronda de 2:00 con 2 personas y otra con 4; nadie queda inactivo >5 s.

---

## H8 — Congelación (últimos 3 días)

Cero funciones nuevas.
- Barrido de errores con `selftest.js` a 2 y 6 jugadores (invariantes 1-7 de `AGENTS.md` §7).
- Audio: música de menú y partida, efectos de comer, devorar, bomba, ✓, disparo, UI (humano o fuente con licencia; anotar en EDITOR_TODO).
- Feedback visual: partículas de impacto, números flotantes, screen shake suave, tutoriales de 5 s por modo.
- Rendimiento: 6 jugadores + 40 objetos a 60 fps en navegador medio.
- Export web probado en el navegador de otra persona (Chrome y Firefox), con mandos reales.
- Pruebas de diversión con gente de fuera (10 segundos, revancha ≥70 %, último puesto, mando ajeno).
- README de ejecución y créditos.

---

## Presupuesto de assets por categoría

| Categoría | Cantidad aprox. | Modelo |
|---|---|---|
| Hero (banner, logo, fondos menú/lobby) | 4 | Pro |
| Mapas completos + tiles | 3 mapas + ~30 tiles | Pro (mapas) / 2 (tiles) |
| Slime base + animaciones | ~12 frames | 2 |
| Cuerpos/caras/accesorios/partículas/rastros | 31 | 2 |
| Comidas | 8 + 14 de Crazy | 2 |
| Obstáculos/bombas/efectos | ~25 | 2 |
| UI (botones, paneles, iconos) | ~50 | 2 |
Total ≈ 190 imágenes; generar por hito, con muestra visual aprobada antes de lanzar el lote.

## Checklist de invariantes (selftest)
1. Peligro con ≥0.8 s de aviso · 2. Nadie sin acción >5 s · 3. POM con ruta libre ≥120 px · 4. Crazy siempre termina · 5. Ninguna partida da 0 Glomps · 6. Tienda no altera `GLOMP.config` · 7. Todo funciona con 2 y 6 jugadores.

## Riesgos y respuestas
- `game.json` scaffoldeado se rompe al abrir → comparar con `reference/empty.json`, no avanzar.
- GDevelop solo detecta 4 mandos → `maxPlayers = 4`, anotar, no rediseñar.
- Estilo de imágenes inconsistente → referencias fijas de `samples/` + prompt base + aprobación por muestra.
- Calendario → cortar por Guerra, luego Buffet.
