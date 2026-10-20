# GLOMP! — Prompt de implementación para agentes de código

> **Cómo usar este archivo**
> Guárdalo en la raíz del repositorio **dos veces**: como `CLAUDE.md` (lo lee Claude Code solo) y como `AGENTS.md` (lo lee Codex solo). Es el contexto permanente del proyecto.
> Para arrancar una sesión, pega el mensaje corto que está al final (§10).
> Todo lo que diga este archivo gana sobre lo que el agente suponga por su cuenta.

---

## 1. Rol y objetivo

Eres el programador principal de **GLOMP!**, un party game 2D local para **2 a 6 jugadores** en el mismo PC, hecho en **GDevelop 5** y exportado a **web (HTML5)**.

El objetivo de las próximas 3 semanas es una **demo jugable para un hackathon**: una partida completa, de principio a fin, sin errores, con entre 3 y 5 minijuegos.

Tu trabajo es escribir la lógica del juego, mantener la arquitectura limpia y **decir cuando algo no se puede hacer** en lugar de inventar una solución a medias.

---

## 2. Restricciones duras (no negociables)

1. **No edites el árbol de eventos de `game.json` a mano.** El formato de eventos de GDevelop es un JSON anidado y frágil. Un error silencioso corrompe el proyecto. Toda la lógica va en archivos `.js` propios (§3).
2. **Nada de dependencias externas.** Sin npm, sin bundlers, sin frameworks. JavaScript plano ES2020 que corre dentro de GDevelop.
3. **No hay red ni multijugador online.** Todo es local, en un solo PC, con mandos.
4. **Dos entradas por jugador: Mover y Acción.** No inventes un tercer botón. La única excepción es apuntar en Guerra de Comida (palanca derecha o ratón).
5. **Todos los slimes son mecánicamente idénticos.** Sin habilidades, sin estadísticas distintas. Si escribes código que hace que un slime se comporte distinto de otro por su apariencia, está mal.
6. **Ningún valor de balance escrito dentro de la lógica.** Todos viven en `src/config.js` (§5.1). Si tienes que escribir un número nuevo en medio del código, primero añádelo a la config.
7. **Nunca pongas la progresión por encima del juego.** Nada comprado en la tienda puede tocar velocidad, tamaño, hitbox, daño ni nada medible.
8. **Si una tarea necesita abrir el editor de GDevelop** (crear objetos, animaciones, colocar instancias en la escena), **no la simules**: escribe las instrucciones exactas en `docs/EDITOR_TODO.md` y sigue con lo que sí puedes hacer.

---

## 3. Arquitectura técnica

### 3.1 El problema y la solución

GDevelop guarda los eventos dentro de `game.json`. Escribirlos a mano es inviable para un agente. Pero GDevelop tiene eventos de tipo **"Código JavaScript"** (`BuiltinCommonInstructions::JsCode`), que ejecutan JS con acceso a `runtimeScene`. Esa es la puerta de entrada.

**El patrón:**

```
src/*.js  (tú escribes aquí)
    │
    │  node tools/build.js
    ▼
game.json  (los eventos JsCode quedan rellenados; nunca lo editas a mano)
    │
    ▼
GDevelop abre el proyecto y corre
```

Cada escena tiene **un solo evento JsCode**, con un marcador en su comentario:

```
// GLOMP:INJECT scene=MG_EatEm
```

`tools/build.js` busca cada marcador en `game.json`, lo reemplaza por el contenido del archivo `.js` correspondiente, y guarda. El script debe ser **idempotente** (correrlo dos veces da el mismo resultado) y debe **hacer una copia de seguridad** de `game.json` antes de escribir.

### 3.2 Namespace global

La escena `Boot` corre primero y define todo:

```js
globalThis.GLOMP = globalThis.GLOMP || {};
GLOMP.config = { /* … */ };
GLOMP.player = { /* … */ };
GLOMP.match  = { /* … */ };
GLOMP.minigames = { eatEm: {}, pom: {}, crazy: {}, buffet: {}, war: {} };
```

Cada escena de minijuego tiene dos ganchos y nada más:

```js
if (!runtimeScene.__glompReady) { GLOMP.minigames.eatEm.onStart(runtimeScene); runtimeScene.__glompReady = true; }
GLOMP.minigames.eatEm.onTick(runtimeScene, runtimeScene.getTimeManager().getElapsedTime() / 1000);
```

Toda la lógica está en los módulos. El evento de la escena es solo un despachador de tres líneas.

### 3.3 Qué hace GDevelop y qué haces tú

| GDevelop (editor, lo hace una persona) | Tú (JavaScript) |
|---|---|
| Objetos, animaciones, hitbox | Toda la lógica de juego |
| Escenas y capas | Spawn, colisiones lógicas, puntuación |
| Instancias colocadas (muros, cajas) | Estados, temporizadores, reglas |
| Recursos (imágenes, audio) | HUD, ruleta, economía, guardado |
| Comportamiento de movimiento top-down | Lectura de mandos y asignación de jugadores |

**Antes de escribir una sola línea**, crea un proyecto vacío en GDevelop, exporta/abre su `game.json` y **confirma la versión del formato y la estructura real** de un evento JsCode. No asumas el esquema de memoria: verifícalo. Documenta lo que encuentres en `docs/GDEVELOP_NOTES.md`.

### 3.4 Estructura de carpetas

```
/glomp
  game.json              ← proyecto de GDevelop (generado/parchado, nunca editado a mano)
  /assets                ← imágenes y audio
  /src
    config.js            ← TODOS los números de balance
    boot.js              ← arranque, namespace, carga de guardado
    input.js             ← mandos y teclado, asignación de jugadores
    player.js            ← objeto Jugador: movimiento, masa, escala, estados
    food.js              ← tabla de alimentos y spawn
    match.js             ← partida, ruleta, rebanadas, Glomps
    hud.js               ← tarjetas laterales, cronómetro, frase de aviso
    save.js              ← localStorage: Glomps, compras, slime equipado
    shop.js              ← tienda y catálogo
    /minigames
      eat_em.js  pom.js  crazy.js  buffet.js  war.js
  /tools
    build.js             ← inyecta src/ en game.json
    check.js             ← valida que game.json sigue siendo JSON válido y abrible
  /docs
    EDITOR_TODO.md       ← lo que una persona debe hacer en el editor
    GDEVELOP_NOTES.md    ← esquema real verificado
    TESTING.md           ← qué probar en cada hito
```

---

## 4. Reglas de código

- **JavaScript plano**, sin clases con herencia profunda. Objetos y funciones puras siempre que se pueda.
- **Nombres en inglés en el código, comentarios y textos de juego en español.** Los strings que ve el jugador van todos en `src/i18n.js`, ninguno incrustado.
- **Prefijos de variables globales de GDevelop:** `CFG_` global, `EE_` Eat it Eat them, `BP_` Bubble POM!, `CI_` Crazy Ingredients, `BB_` Buffet Blitz, `GC_` Guerra de Comida.
- **Nada de `setTimeout` ni `requestAnimationFrame`.** El tiempo se lleva con acumuladores que reciben `dt` en `onTick`. El juego debe comportarse igual a 30 y a 144 fps.
- **Cero estado global mutable fuera de `GLOMP`.** Nada de variables sueltas en `window`.
- **Toda función que reciba un jugador debe funcionar con 2 y con 6.** Nada de código que asuma 4.
- **Un commit por tarea**, mensaje en español, con el módulo tocado al principio: `match: ruleta filtra por nº de jugadores`.
- Después de cada cambio en `src/`, corre `node tools/build.js && node tools/check.js`. Si `check` falla, **no hagas commit**.

---

## 5. Especificación del juego

### 5.1 Configuración global (`src/config.js`)

```js
GLOMP.config = {
  maxPlayers: 6,                 // bajar a 4 si el navegador no detecta 6 mandos
  arenaSizes: { s: 1400, m: 1700, l: 2000 },   // 2 jug / 3-4 / 5-6
  slicesToWin: 5,
  slices: { first: 2, second: 1 },
  instructionSeconds: 5,
  telegraphSeconds: 0.8,         // todo peligro avisa al menos esto
  player: {
    baseSpeed: 260,              // px/s
    scalePerMass: 0.012,
    maxScale: 3.0,
    speedPenalty: 0.10,          // por punto de escala por encima de 1
  },
};
```

`escala = min(maxScale, 1 + scalePerMass * masa)`
`velocidad = baseSpeed * (1 - speedPenalty * (escala - 1))`

### 5.2 Objeto Jugador (uno solo para todos los modos)

Variables: `playerId`, `bodyColor`, `face`, `accessory`, `particles`, `trail`, `slices`, `mass`, `scale`, `health`, `ammo[]` (máx. 3), `actionCooldown`, `state`, `alive`.

Estados: `normal`, `dashing`, `stunned`, `immune`, `stuck`, `dead`.
Los modos que no usan una variable la ignoran: **es más barato tener una vacía que dos objetos distintos**.

### 5.3 Objeto Comida (uno solo, diferenciado por variable `type`)

| type | mass | damage | heal | speedBoost | throwable | notas |
|---|---|---|---|---|---|---|
| `bite` | +1 | — | — | — | no | el bocadito básico |
| `plate` | +3 | — | — | — | no | sale de las mesas |
| `feast` | +10 | — | — | — | no | el Manjar; 1.0 s encima para comerlo |
| `tomato` | +1 | 25 | — | — | sí | 700 px/s, recto |
| `gum` | +1 | 10 | — | — | sí | 500 px/s, charco 3 s −50 % vel. |
| `melon` | +1 | 35 / 20 | — | — | sí | 400 px/s en arco, área 90 px (centro/borde) |
| `lettuce` | — | — | +25 | — | no | se come, cura |
| `banana` | — | — | — | +25 % / 4 s | no | se come, acelera |

Una sola tabla, cinco minijuegos. Añadir un alimento es añadir una fila y una animación, **nunca un objeto nuevo ni eventos nuevos**.

### 5.4 Estructura de la partida (`src/match.js`)

Flujo: `Menu → Lobby (entras pulsando A) → Personalizar → Ruleta → Instrucción 5 s → Minijuego → Reparto → Ruleta → …`

- Gana **el primero en juntar 5 rebanadas**. 1.º = 2 rebanadas, 2.º = 1, el resto 0.
- Empate: comparten posición y ambos reciben las rebanadas de esa posición.
- Si dos llegan a 5 en la misma ronda, gana quien quedó por delante en esa ronda.
- **Ruleta al azar** entre los minijuegos compatibles con el número de jugadores presentes. Si sale uno que no cabe, se descarta y vuelve a girar. **Nunca repite el mismo minijuego dos rondas seguidas.**
- La ruleta gira sola a los 3 s. La instrucción se puede saltar.

| Minijuego | mín | máx | duración |
|---|---|---|---|
| Eat it, Eat them | 2 | 4 | 2:30 |
| Bubble POM! | 2 | 6 | 1:15 |
| Crazy Ingredients | 2 | 6 | ≈1:30 |
| Buffet Blitz | 3 | 6 | 2:00 |
| Guerra de Comida | 2 | 6 | máx. 2:00 |

**Bots:** slimes grises que se mueven al azar. No compiten por rebanadas; sirven de presa en Eat it, Eat them y toman el control si un mando se desconecta. **Nunca** se usan para rellenar una partida de 2 personas.

### 5.5 Entrada (`src/input.js`)

- Teclado, **máximo 2 personas**: J1 `WASD` + `E`; J2 flechas + `Shift` derecho. De 3 a 6 jugadores: mandos obligatorios.
- **Asignación:** el primero que pulsa A en el lobby entra como Jugador 1, y así sucesivamente.
- **Tarea del día 1, antes que nada:** comprobar que GDevelop en navegador detecta 6 mandos simultáneos. Si solo reconoce 4, baja `config.maxPlayers` a 4, anótalo en `docs/GDEVELOP_NOTES.md` y sigue. **No rediseñes nada más por eso.**
- Solo hay un ratón: en Guerra de Comida el J2 de teclado apunta hacia donde se mueve (8 direcciones + ayuda de puntería de 8°). Es peor a propósito; ese modo quiere mandos.

### 5.6 Los cinco minijuegos

Están **en orden de prioridad**. Si el calendario aprieta, se corta por el final.

#### 1) Eat it, Eat them — 2–4 + bots · 2:30 · `src/minigames/eat_em.js`

Come para crecer y devora a los más pequeños. **Gana el que tenga más masa a 0:00** (no "el último vivo": aquí nadie queda fuera).

- Todos empiezan con masa 0 en el borde + 3 s de inmunidad.
- **Devorar:** si eres ≥ **×1.3** la escala de otro y lo cubres **0.3 s**, te lo comes. Ganas el **50 %** de su masa; el resto cae como bocaditos.
- **Al devorado:** reaparece a los **2 s** en el borde con el **30 %** de su masa anterior (mín. 5) + 3 s de inmunidad.
- **Auras:** anillo **rojo** sobre quien te puede comer, **verde** sobre quien puedes comerte. Sin esto el modo es adivinanza; es obligatorio.
- **Bots grises:** 4 en escena, +5 masa, reaparecen cada 10 s si hay menos de 4.
- **Salsa:** desde 45 s avanza desde los bordes 12 % cada 25 s. −4 masa/s y −30 % velocidad. **A masa 0 solo ralentiza: nunca elimina directo.**
- **Arbustos:** 3–4, ocultan a slimes de escala < 1.6.
- **Acción = Chispazo:** +60 % velocidad 0.8 s, cuesta 3 de masa (bloqueado con masa 0), enfr. 1.5 s, deja migajas.
- Escala máx. 3.0: a partir de ahí solo sube la masa del marcador.
- Casos límite: dos grandes sobre el mismo pequeño → se lo come quien lo cubra primero. Tamaños casi iguales → rebote suave, nunca "a medias".

#### 2) Bubble POM! — 2–6 · 1:15 · `src/minigames/pom.js`

Caen bombas de chicle. **Un golpe y estás fuera.** Gana el último en pie.

| Bomba | Zona | Infla | Desde |
|---|---|---|---|
| Chiclito (azul) | círculo r=110 | 1.2 s | 0 s |
| Chiclón (rosa) | óvalo ancho 190×100 | 1.5 s | 20 s |
| Mega POM (morado) | óvalo alto 100×260 | 1.8 s | 35 s |
| Misteriosa | al azar entre las tres | — | 45 s |

- Frecuencia: 1 cada 1.6 s → 1.1 s (20 s) → 0.7 s (45 s). Máx. 10 a la vez.
- **Garantías que el generador debe cumplir, siempre:** aviso ≥ 0.8 s antes del impacto sobre un jugador; nunca más del 60 % del suelo cubierto; **siempre existe una ruta libre de ≥ 120 px**. La Misteriosa muestra con anillo punteado su **zona máxima posible**.
- Charco de chicle 2 s: −50 % velocidad, **no hace daño**.
- Banana: +30 % velocidad 4 s, 1 cada 15 s, aparece en zona peligrosa.
- Desde 0:50 la arena se reduce al 50 % para forzar el final. Si a 1:15 quedan 2+, comparten posición.
- **Acción no hace nada en este modo.** Es intencional. Si en las pruebas la gente lo pulsa por instinto, se añade un Rebote (150 px, enfr. 2.5 s) — pero no lo implementes hasta que alguien lo pida.

#### 3) Crazy Ingredients — 2–6 · ≈1:30 · `src/minigames/crazy.js`

El suelo está cubierto de comida revuelta. Se pide un alimento: **tócalo con el cuerpo** antes de que acabe la cuenta. **Sin botón de acción.**

- Se anuncia el pedido **1 s antes** de arrancar el reloj. Al tocarlo aparece un ✓ sobre tu cabeza y estás a salvo.
- Tocar un alimento equivocado **no hace nada** (no castiga).
- Si la cuenta llega a 0 sin tu ✓, **quedas eliminado** y desapareces del mapa.
- Embudo: pedidos 1–3 → 10 s y 6 tipos · 4–6 → 8 s y 9 tipos · 7–9 → 6 s y 12 tipos · 10+ → 5 s y 14 tipos.
- Spawn: 1 alimento nuevo cada 3 s en un punto libre, máx. 40 en pantalla.
- **Regla antibloqueo (obligatoria):** si pasan **3 pedidos seguidos sin que caiga nadie**, a partir de ahí se garantiza un máximo de **(jugadores vivos − 1)** unidades del alimento pedido. Siempre falta uno.
- El alimento pedido lleva **halo dorado** y nunca aparece dentro de un obstáculo.
- Dos lo tocan a la vez → se lo queda quien tenga el centro más cerca.
- Termina cuando queda uno: **sin límite de tiempo fijo**.

#### 4) Buffet Blitz — 3–6 · 2:00 · `src/minigames/buffet.js`

Come más que nadie. **Gana el más grande a 0:00.**

- Bocadito +1 (1.2/s, máx. 60) · Plato +3 (cada 3 s, máx. 10) · **Manjar +10** (cada 20 s, el 1.º a los 10 s, **nace lejos del líder**, 1.0 s encima; si te empujan se cancela).
- **El líder lleva corona.** Es lo que convierte una carrera en paralelo en un juego social.
- **Acción = Zampada:** 180 px en 0.18 s, enfr. 3 s. Al rival: empuja 120 px, aturde 0.6 s y le hace soltar el **5 %** de su masa (mín. 2, máx. 12) como bocaditos que recoge cualquiera. Inmunidad 1.5 s al recibirla.
- **Última comilona** (de 100 s a 120 s): ×2 valor y ×2 aparición, bordes dorados.
- Banana: +25 % velocidad 4 s, 1 cada 15 s.
- Casos límite: comida simultánea → el centro más cercano. Si creces contra una pared, el motor te empuja hacia dentro (**nunca te atascas**). Zampada contra pared se detiene. Empate → más Manjares comidos.

#### 5) Guerra de Comida — 2–6 · máx. 2:00 · `src/minigames/war.js`

Apunta y lanza comida. La zona se cierra. Gana el último en pie; a 2:00, el de más vida.

- **Vida 100**, barra sobre el slime. Inmunidad 0.6 s tras cada impacto. Retroceso 80 px.
- Munición máx. 3 en mano. 6–8 cajas, 1 comida cada 4 s por caja. Reparto: tomate 45 %, chicle 20 %, sandía 20 %, lechuga 10 %, banana 5 %.
- **Apuntado:** palanca derecha o ratón. Flecha de 40 px delante del slime. Cadencia 0.35 s.
- **El giro del modo:** con 3 huecos en la mano, llevar una lechuga es llevar un tomate menos. **Cada disparo es renunciar a comida.** Si el código hace que guardar comida no tenga coste, el modo pierde su gracia.
- **Zona:** empieza a cerrarse a los 30 s, se detiene al **40 %** de la arena, fuera **−15 de vida cada 2.5 s**.
- Remontada: las cajas cercanas al que tiene menos vida dan lechuga el doble de veces.
- Cuerpo a cuerpo **no hace daño**, solo empujón suave.
- Casos límite: dos proyectiles chocan → se destruyen (la sandía atraviesa). Contra pared → salpicadura decorativa, sin rebote. Ambos a 0 a la vez → empatan posición.

### 5.7 Tienda y economía (`src/shop.js`, `src/save.js`)

Moneda: **Glomps**. Única progresión del juego, **100 % cosmética**.

| Cómo se ganan | Glomps |
|---|---|
| Ganar una ronda (1.º) | +4 |
| Quedar 2.º en una ronda | +2 |
| Ganar la partida | +15 |
| Terminar la partida aunque pierdas | +5 |
| Primera partida del día | +10 |
| Jugar con 4 o más personas | **×1.5 a todo** |

Precios: color 40 · cara 30 · accesorio 60 · partículas 80 · rastro 100 · **set completo 180 (−25 %)**.

Reglas: **perder también paga** (una partida completa nunca da cero). Sin dinero real, sin cajas sorpresa. **Vista previa inmediata** sobre tu slime al seleccionar. Escaparate de 6 artículos rotativos + catálogo completo siempre accesible. Lo comprado se guarda en `localStorage` y no se pierde.

### 5.8 Las 5 capas del slime

`cuerpo (color)` · `cara` · `accesorio` · `partículas` · `rastro`.
Se dibujan sobre el **mismo cuerpo base** y se deforman con él. **Ninguna cambia la hitbox ni nada mecánico.**
Las piezas se compran **sueltas y se mezclan libremente**; los "sets" son solo un atajo de compra.
Sobre cada slime flota su **icono de marcador** (⬤ ■ ▲ ★ ◆ ⬢) con su color: identifica al jugador aunque dos lleven el mismo sombrero, y resuelve el daltonismo.

En la demo: 8 cuerpos, 6 caras, 10 accesorios, 4 partículas, 3 rastros = **31 piezas**. Se sale con el cuerpo y 3 caras; el resto se compra.

### 5.9 HUD (`src/hud.js`)

- **Tarjetas laterales**, hasta 3 por lado: slime, rebanadas y la barra de lo que importe en ese modo (tamaño o vida).
- **Arriba al centro:** cronómetro grande. En el último tercio late y se vuelve rojo.
- **Abajo: una sola frase** de aviso. Nunca dos a la vez.
- La arena cabe **entera en pantalla**: sin scroll, sin cámara que se mueva. El zoom se calcula para encuadrarla.
- **Nada parpadea sin motivo.** Si algo llama la atención es porque algo cambió.

---

## 6. Orden de trabajo

Cada hito termina en algo **jugable**, no en "código avanzado". No empieces un hito sin cerrar el anterior.

### Hito 0 — Andamio (medio día)

`tools/build.js`, `tools/check.js`, `src/config.js`, escena `Boot` con el namespace, y la **prueba de los 6 mandos**.
✅ *Aceptación:* `node tools/build.js && node tools/check.js` pasa, GDevelop abre el proyecto sin avisos, y la consola imprime cuántos mandos detecta.

### Hito 1 — Que moverse y comer se sienta rico (semana 1)

Objeto Jugador con **squash & stretch**, movimiento, comer, crecer, escala y penalización de velocidad.
✅ *Aceptación:* un humano mueve un slime, come, lo ve crecer y **dice que se siente bien**. Esto es el juego entero: si falla aquí, no se arregla después. No sigas sin pasarlo.

### Hito 2 — Eat it, Eat them jugable (semana 1)

Devorar, auras, reaparición, bots grises, Salsa, arbustos, Chispazo.
✅ *Aceptación:* 2 personas juegan una ronda completa de 2:30 y cada una devora o es devorada al menos 2 veces.

### Hito 3 — La partida existe (semana 1)

Lobby, ruleta, rebanadas, reparto, pantalla de resultados, Glomps, guardado.
✅ *Aceptación:* una partida completa a 5 rebanadas con un solo minijuego, de principio a fin, sin errores, con 4 personas.

### Hito 4 — Bubble POM! + Crazy Ingredients (semana 2)

Los dos más baratos. Con ellos la ruleta ya tiene sentido.
✅ *Aceptación:* las garantías del generador de bombas (§5.6) se cumplen en 50 rondas automáticas de prueba, y la regla antibloqueo de Crazy Ingredients dispara correctamente.

### Hito 5 — Personalización y tienda (semana 2)

Capas, pantalla de personalización, tienda, vista previa, `localStorage`.
✅ *Aceptación:* se compra un accesorio, se equipa, se cierra el navegador, se vuelve a abrir y **sigue puesto**.

### Hito 6 — Buffet Blitz (semana 3)

Reutiliza casi todo el núcleo de Eat it, Eat them.

### Hito 7 — Guerra de Comida (semana 3)

**Es la primera que se corta si algo se retrasó.** No la empieces si el hito 5 no está cerrado.

### Hito 8 — Congelación (últimos 3 días)

**Cero funciones nuevas.** Solo errores, audio, feedback y la prueba de export a web en el navegador de otra persona.

---

## 7. Pruebas

Escribe `tools/selftest.js`: corre cada minijuego **sin render**, con jugadores simulados, N rondas, y verifica las invariantes.

Invariantes que **siempre** deben cumplirse, en cualquier modo:

1. Ningún peligro impacta con menos de **0.8 s** de aviso.
2. Ningún jugador queda **sin poder hacer nada más de 5 s seguidos** estando vivo.
3. En Bubble POM! siempre existe una ruta libre de ≥ 120 px.
4. En Crazy Ingredients la ronda **siempre termina** (no hay ciclo infinito).
5. Ninguna partida completa da **0 Glomps**.
6. Ningún artículo de la tienda modifica un valor de `GLOMP.config`.
7. Todo funciona con `maxPlayers` = 2 y = 6.

Y las **pruebas de diversión**, que se corren con gente de fuera del equipo. Si una falla, **se cambia el diseño, no la prueba**:

- **Los 10 segundos:** entiende el objetivo sin que nadie se lo explique.
- **La revancha:** ≥ 70 % pide jugar otra vez.
- **El último puesto:** el que va último remonta ≥ 20 % de las veces.
- **El mando ajeno:** alguien que nunca jugó gana una ronda.

---

## 8. Qué NO hacer

- ❌ No escribas eventos visuales de GDevelop en JSON a mano.
- ❌ No instales dependencias ni añadas un bundler.
- ❌ No añadas habilidades, personajes con estadísticas, ni nada que rompa la simetría entre slimes.
- ❌ No añadas online, matchmaking, cuentas ni nube.
- ❌ No pongas números de balance fuera de `config.js`.
- ❌ No implementes The Last Bite, Food Rush ni Slime Chef: **están cortados del alcance**.
- ❌ No "arregles" el que Acción no haga nada en Bubble POM! y Crazy Ingredients: es una decisión de diseño pendiente de medir.
- ❌ No inventes assets. Si falta una imagen, usa un rectángulo de color y anótalo en `docs/EDITOR_TODO.md`.
- ❌ No marques un hito como terminado si `check.js` falla o si no lo ha jugado una persona.

---

## 9. Cuando te atasques

Di qué está bloqueado, qué intentaste y qué necesitas. **No inventes una solución a medias ni sigas adelante dejando algo roto detrás.** En concreto, para estos tres casos la respuesta correcta es parar y avisar:

- El esquema de `game.json` no coincide con lo documentado en `docs/GDEVELOP_NOTES.md`.
- GDevelop no detecta los mandos necesarios.
- Un hito necesita arte o escenas que solo se pueden hacer desde el editor.

---

## 10. Mensaje de arranque (pégalo para empezar la sesión)

```
Lee CLAUDE.md / AGENTS.md completo antes de hacer nada. Es la especificación de GLOMP!,
un party game local 2-6 jugadores en GDevelop 5.

Empieza por el Hito 0:

1. Crea un proyecto vacío en GDevelop 5, abre su game.json y verifica el esquema real
   de un evento JavaScript (JsCode). Documenta lo que encuentres en docs/GDEVELOP_NOTES.md.
   No asumas el formato de memoria: compruébalo.
2. Escribe tools/build.js (inyecta src/*.js en los eventos JsCode marcados) y
   tools/check.js (valida que game.json sigue siendo válido). build.js debe ser
   idempotente y hacer copia de seguridad antes de escribir.
3. Escribe src/config.js con los valores de la sección 5.1 y src/boot.js con el namespace.
4. Añade una comprobación que imprima en consola cuántos mandos detecta el navegador.

No empieces el Hito 1 hasta que `node tools/build.js && node tools/check.js` pase y
GDevelop abra el proyecto sin avisos. Cuando termines, dime qué encontraste sobre el
esquema de eventos y cuántos mandos detecta, y espera mi confirmación.
```
---

## 11. Enmiendas (aprobadas; prevalecen sobre §2.8, §3.3, §3.4 y §5.8 en caso de conflicto)

1. **Scaffold del proyecto (reemplaza la restricción 2.8).** El agente SÍ genera objetos, escenas, recursos e instancias de `game.json` mediante `tools/scaffold.js`. Sigue prohibido escribir el árbol de eventos: cada escena lleva un único evento JsCode con marcador `// GLOMP:INJECT scene=...`. El esquema se valida contra `reference/empty.json` (proyecto vacío creado una vez por una persona en GDevelop con un evento JsCode). Si `check.js` detecta que la estructura no coincide: parar y avisar (§9).
2. **Skins por capas.** `samples/skins.png` es solo referencia de estilo. Las 31 piezas (§5.8) se generan como PNG sueltos con transparencia sobre un cuerpo base blanco tintable. Los "sets" son combinaciones prehechas.
3. **Hito 0.5 — Shell de UI** (antes del Hito 1): escenas `Menu`, `Lobby` (estilo Brawl: 6 tarjetas, "pulsa A para unirte", listo), `Settings` (volumen, pantalla completa, remapeo de teclado, `maxPlayers`), `Customize/Shop`; navegación por mando y teclado (foco, A = aceptar, B = volver). Código en `src/ui.js` y `src/i18n.js` (este último obligatorio por §4).
4. **Imágenes con Nano Banana (Gemini) vía conector MCP.** Ver `docs/CODEX_RUNBOOK.md`. La clave está en `.env` (`GOOGLE_AI_STUDIO`); nunca se imprime, se pega en prompts ni se commitea. Referencias de estilo: `samples/`.
5. **Audio** no se genera con IA de imagen: placeholders silenciosos anotados en `docs/EDITOR_TODO.md` hasta el Hito 8.

## 12. Dirección aprobada del menú y las rondas (18 de octubre de 2026)

Estas indicaciones del usuario prevalecen sobre el lobby separado, la arena
cuadrada y el HUD situado fuera de la arena descritos arriba. Son requisitos por
implementar; esta sección no declara terminadas las funciones ni sus pruebas.

- El menú sigue la composición de la captura de Brawl Stars aportada por el
  usuario, con identidad propia de GLOMP!: slime central, accesos laterales,
  perfil y moneda arriba, Práctica y JUGAR abajo. Fondo obligatorio:
  `assets/ui/menu-village.png`. Los títulos conservan el estilo aprobado del banner.
- La incorporación local ocurre en el propio menú mediante botones `[+]` a ambos
  lados del grupo. El alta por teclado exige revisar y confirmar controles antes
  de ocupar una plaza. Por ahora solo teclado: máximo dos jugadores, uno con
  `WASD` y otro con flechas. Se confirma también su única tecla de Acción.
- Resolución objetivo de interfaz, canvas y gráficos: 1920×1080. En una pantalla
  Full HD 16:9, el mapa rectangular completo ocupa todo el área de juego, sin
  marco exterior ni deformación. El HUD se superpone de forma compacta en bordes
  reservados. La cámara permanece fija durante el minijuego.
- Cada ronda presenta el mapa mediante una cinemática breve con explicación,
  seguida de `3`, `2`, `1`, `GLOMP!`. La simulación comienza después de esa secuencia.
- Al terminar una ronda aparecen estadísticas y reparto; la siguiente comienza
  automáticamente. Al alcanzar la condición de victoria se muestran los resultados
  de la partida completa, en lugar de iniciar otra ronda de esa misma partida.
- Los planes operativos vigentes son `docs/PLAN_MAESTRO.md`,
  `docs/DISENO_JUEGO.md` y `docs/ASSETS_CHATGPT.md`. El proveedor visual activo es
  ChatGPT, autorizado por el usuario tras los errores de cuota de Google.

## 13. Rework pixel art solicitada por el usuario

Prevalece sobre el arte ilustrado del gameplay y las instrucciones antiguas del
lobby: la sala principal exige color y confirmación por participante; JUGAR abre
Arena, Práctica abre Sandbox. Mapas por piezas inspirados en samples/maps, pixel
art y tres PNG de slime por detalle visible. Gameplay Full HD sin logo persistente,
HUD alternado izquierda/derecha y filas hacia abajo. Presentación del mapa real,
cuenta y GLOMP! antes de simular. Máximo 180 s por ronda, también Crazy; resultados
y siguiente modo distinto automáticamente. Colores de identificación libres en
la sala; no alteran mecánicas. Los hitos siguen pendientes de aceptación humana.

Implementado y pendientes: docs/DISENO_JUEGO.md, docs/PLAN_MAESTRO.md y
docs/ASSETS_CHATGPT.md. No reconstruir funciones ya implementadas por leer una
lista anterior. Las variantes small/medium/large son PNG originales con niveles
de detalle distintos; no afirmar que sus lienzos físicos sean 48/96/192.

## 14. Rework ilustrada y accesos (19 de octubre de 2026)

La última dirección del usuario prevalece sobre §13, la cámara fija y las reglas
antiguas de POM/Guerra. No pixel art: un único cuerpo blanco aprobado, tintado
solo en el cuerpo, con ojos y bocas separados, gestos y deformación de malla hacia
el movimiento. No cambiar silueta al crecer. Mapas originales completos de
samples/maps y nueva arena ilustrada de lava; geometría y colisiones en config.

Cámara compartida aprobada: sigue al grupo y ajusta zoom para mantener visibles a
todos los humanos vivos. Presentación del mapa, cuenta y GLOMP! antes de simular;
reparto y siguiente modo distinto automáticos. Mantener HUD alternado y sin logo
persistente. Bubble POM es quema la papa: portador aleatorio, Acción pasa el chicle,
mecha global 15 s que no se reinicia, explosión del portador termina la ronda.
Guerra conserva el ID war y se presenta como Sumo de lava: Acción empuja, salir
elimina, objetos buenos/malos caen con aviso; no hay disparos ni apuntado.

Completar los accesos reales de sala, Armario/Tienda (31 piezas, sets y mezcla),
ajustes, créditos, práctica, pausa, resultados y regreso. Guardado local por plaza
y cosméticos sin cambios mecánicos. Tipografía local Lilita One con OFL. Ver
DISENO_JUEGO.md para contratos y PLAN_MAESTRO.md solo para pendientes. Mantener
AGENTS.md y CLAUDE.md idénticos. No presentar generación de imágenes, QA simulada
ni apertura del editor como aceptación humana o calidad AAA.
