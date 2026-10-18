# GLOMP! — Biblia de diseño (física, color, arte, minijuegos, proceso)

Escrito para: Codex y la persona que prueba el juego. Complementa `AGENTS.md` (manda) y `PLAN_MAESTRO.md` (hitos). Todo número de este documento es un valor inicial y debe vivir en `src/config.js`, nunca en la lógica.

## 0. Estado actual (tras la sesión de Codex)

- Hecho: H0 en código (build/check/selftest pasan, `game.json` con escena `Boot`, GDevelop 5.6.283 instalado, 1 sprite base blanco aprobado).
- Pendiente humano de H0 (bloquea H0.5): abrir `game.json` en GDevelop sin avisos, Preview, probar mandos, anotar resultado en `docs/GDEVELOP_NOTES.md`.
- Bloqueo de arte: Google AI Studio devuelve 429 (cuota gratuita sin generación de imágenes). Salidas: activar facturación en el proyecto de la clave (recomendado, el lote cuesta unos pocos dólares) o seguir con la imagen de ChatGPT autorizada. Decisión del usuario; no mezclar proveedores dentro de una misma categoría para no romper la coherencia de estilo.

## 1. Proceso de creación (orden de trabajo de cada hito)

Ciclo fijo por hito, siempre igual:

1. **Brief** (5 min): leer la sección del hito aquí y en `PLAN_MAESTRO.md`.
2. **Assets del hito**: generar solo los suyos, 1 muestra por categoría, aprobación visual, luego el lote (`tools/gen_assets.js --milestone N`).
3. **Scaffold**: declarar objetos/escenas/instancias en `tools/project.manifest.json`, `node tools/scaffold.js`.
4. **Lógica**: módulos en `src/`, números en `config.js`, textos en `i18n.js`.
5. **Auto-pruebas**: `node tools/build.js && node tools/check.js && node tools/selftest.js`.
6. **Prueba humana en GDevelop** (Preview): la hace una persona con mandos; resultado en `docs/TESTING.md`.
7. **Cierre**: commit `modulo: mensaje`, hito marcado solo si pasó el paso 6.

Banco de pruebas: escena `Sandbox` (arena vacía, spawn de comida, bots) para afinar sensación antes de montar cada modo.

## 2. Física y movimiento (GDevelop sin motor de física)

No se usa el comportamiento Physics de GDevelop: es impreciso con 6 jugadores y no determinista. Toda la física es propia, en `player.js`, con círculos.

**Colisionadores.** Slime = círculo de radio `r = baseRadius * scale` (baseRadius 40 px). Muros = rectángulos alineados. Comida = círculo pequeño solo para recogida (radio 18 px). Los accesorios nunca cambian `r`.

**Movimiento (pasos fijos).** Integración con paso fijo de 1/120 s acumulado con `dt` (mismo resultado a 30 y 144 fps):
- Velocidad objetivo = `input * speed(scale)` (fórmula de §5.1).
- Aceleración: `accel = 2400 px/s²` hacia el objetivo; fricción de frenado `friction = 3200 px/s²` (se siente "gelatinoso" pero responde).
- Giro brusco: se conserva el 70 % de la velocidad lateral un instante (derrape corto), de ahí el squash.
- Zona muerta de palanca 0.18; curva de respuesta `v = |x|^1.4` para precisión fina.

**Separación entre slimes.** Resolución por penetración suave: se empujan a partes proporcionales a la masa-escala, con amortiguación 0.6. Nunca rebote elástico fuerte (el rebote es solo en Eat it Eat them con tamaños casi iguales: impulso 180 px/s, 0.15 s).

**Muros.** Se desliza por la pared (se anula solo la componente normal). Si crece contra una pared, el motor lo empuja hacia dentro (§5.6 Buffet). Esquinas con radio de resolución para no atascarse.

**Dashes** (Chispazo, Zampada): velocidad fija durante la duración, ignoran fricción, se detienen en pared.

**Squash & stretch (sensación).**
- Estiramiento en dirección de movimiento: `stretch = 1 + 0.18 * (v/vmax)`, aplastamiento perpendicular `1/stretch` (volumen constante).
- Frenado: pulso de aplastamiento 0.85 en la dirección del movimiento, 90 ms, retorno con resorte amortiguado (`k = 180`, `c = 14`).
- Comer ("gulp"): pulso de escala 1.0 → 1.12 → 1.0 en 120 ms + 4 partículas.
- Crecer: la escala sube suavizada (lerp 8/s), nunca salta.
- Inmunidad: parpadeo de opacidad 1.0 ↔ 0.55 a 8 Hz (único parpadeo permitido, comunica estado).

**Proyectiles (Guerra).** Círculos que avanzan por pasos fijos; sandía con arco: altura visual `h = 4·H·t(1−t)` (solo visual, la colisión es 2D).

## 3. Cámara y encuadre

Cámara fija, arena entera visible. Zoom = `min(ancho/ (arena+margen), alto/(arena+margen))`. HUD a los lados sin tapar la arena (tarjetas laterales fuera del cuadrado jugable). Arenas cuadradas 1400/1700/2000 como en los mapas de referencia. Screen shake solo en eventos (devorar, bomba), 6 px máx., 120 ms.

## 4. Dirección de arte y color

Estilo: gelatina caramelo brillante, contorno grueso suave, saturado pero legible, vista cenital 3/4 ligera (referencia: `samples/`). Ningún asset de juego lleva texto incrustado.

**Paleta base (valores iniciales; extraer con `tools/palette.js` desde `samples/` y corregir).**

| Rol | Color | Uso |
|---|---|---|
| Rosa chicle | `#FF4FA3` | marca, J1, Chiclón |
| Amarillo flan | `#FFC933` | J2, Manjar, dorado |
| Verde lima | `#7ED321` | J3, aura "puedes comerlo", lechuga |
| Azul cielo | `#2FA8FF` | J4, Chiclito |
| Morado uva | `#8E4DFF` | J5, Mega POM |
| Naranja zanahoria | `#FF8A2B` | J6, advertencia suave |
| Rojo tomate | `#E8312F` | peligro, aura "te pueden comer", daño |
| Chocolate | `#5A3A24` | contornos de UI, muros |
| Crema | `#FFF4DC` | paneles, texto sobre oscuro |
| Gris bot | `#9AA1AB` | bots y estados neutros |

Reglas: peligro siempre rojo o rojo+blanco; seguro/positivo siempre verde; dorado reservado a lo valioso (Manjar, halo de pedido, última comilona, corona). El color del jugador va también en el icono de marcador (⬤ ■ ▲ ★ ◆ ⬢) para daltonismo; el rojo/verde de auras lleva además forma (anillo continuo vs. punteado).

**Slime en capas (orden de dibujo):** rastro → sombra suave → cuerpo (tinte) → brillo → cara → accesorio → partículas → icono de marcador (siempre encima, tamaño fijo).

**Tipografía/UI.** Bloques redondeados, borde chocolate de 4 px, sombra inferior 6 px, brillo superior. Botones: verde (aceptar), amarillo (secundario), rojo (volver/peligro). Tamaño mínimo de objetivo 96 px (se juega a 2-3 m).

## 5. Mapas (uno por tema, mismo marco)

Arena cuadrada, muros perimetrales gruesos, simetría de 4 ejes (justo con 2-6 jugadores), obstáculos rectangulares alineados a una rejilla de 50 px, objeto central decorativo (la dona del mapa candy). Tres temas, misma geometría base, distinto arte:

| Tema | Muros | Obstáculos | Suelo | Hazard visual |
|---|---|---|---|---|
| Candy | chicle rosa | wafers/chocolate/bastones | damero naranja | charcos de caramelo |
| Cooking | madera + metal | mesas, cajas, sartenes | azulejo crema | salsa |
| Slime | roca musgosa | cristales, setas | verde húmedo | baba |

Cada mapa se entrega como: suelo (1 imagen), tiles de muro/obstáculo reutilizables, 3-4 arbustos, y un JSON de colisión en `src/maps/<tema>.js` (rectángulos). Mapa de la ronda al azar entre los 3 (cosmético: no cambia reglas). Puntos de spawn en el borde equidistantes (6 posiciones).

## 6. Minijuegos: diseño operativo

(Reglas y cifras de `AGENTS.md` §5.6 son la fuente; aquí, cómo se siente, cómo se comunica y cómo se prueba.)

### Eat it, Eat them
- **Lectura inmediata:** el más pequeño huye, el grande persigue; auras (rojo continuo / verde punteado) y el icono de marcador resuelven "¿puedo comerlo?".
- **Cobertura 0.3 s:** barra circular fina llenándose sobre el devorado, el devorador ve el mismo anillo.
- **Devorado:** burbujas y estallido de bocaditos con trayectoria parabólica; el devorador hace gulp grande + 120 ms de hit-stop (solo visual, no detiene la simulación).
- **Salsa:** borde animado que avanza con aviso 3 s antes de cada oleada (frase inferior).
- **Equilibrio objetivo:** la partida tiene ≥ 2 devoraciones por jugador y el último puesto remonta ≥ 20 %. Si no, ajustar `config` (devorar 1.3, reaparición 30 %), no la regla.

### Bubble POM!
- **Lectura:** sombra → aro de aviso que se llena (color por clase) → pop. El aro de aviso nunca baja de 0.8 s sobre un jugador.
- **Generador:** coloca cada bomba solo si pasa tres chequeos sobre una rejilla de 20 px: aviso ≥0.8 s, cobertura ≤60 %, ruta libre ≥120 px (flood-fill con radio de slime). Si falla, se reubica o se omite ese tick.
- **Sensación:** bomba inflándose con latido que se acelera; pop con confeti de chicle; al caer, el jugador eliminado se convierte en espectador fantasma (sin colisión) con contador "puesto N".
- **Arena menguante:** muros de chicle que se cierran con aviso.

### Crazy Ingredients
- **Lectura:** pedido en grande arriba (icono + nombre) con cuenta atrás en anillo; el alimento pedido con halo dorado pulsante lento.
- **Sensación:** al tocarlo, ✓ y "pop" verde; eliminado: se encoge y se desvanece con "plop".
- **Antibloqueo:** contador interno de pedidos sin caídas; al activarse limita unidades del pedido a (vivos − 1) y aparece al menos 1 de más variedad. Se registra en el log del selftest.
- **Pruebas:** simular 1000 rondas con jugadores aleatorios; la ronda siempre termina y siempre cae alguien antes de un máximo de pedidos.

### Buffet Blitz
- **Lectura:** corona sobre el líder, barra de masa en tarjetas; Manjar con columna de luz dorada visible desde lejos y anillo de progreso de 1.0 s.
- **Zampada:** estela corta + onda; golpeado suelta bocaditos con chispas; inmunidad 1.5 s con el parpadeo estándar.
- **Última comilona:** borde dorado, música más rápida, ×2 en HUD.

### Guerra de Comida
- **Lectura:** flecha de 40 px del color del jugador; munición como 3 casillas bajo el slime; barra de vida encima.
- **Costo de decisión:** lechuga y banana ocupan hueco; el HUD lo muestra para que se entienda.
- **Zona:** borde rojo que se cierra con textura de "peligro"; daño por tick con número flotante.
- **Proyectiles:** estela del tipo (rojo/verde/rosa/melón), salpicadura al impactar; chicle deja charco azul-rosa.

## 7. HUD, avisos y audio

- Tarjetas laterales (3 por lado): slime en miniatura, icono de marcador, rebanadas (5 casillas), barra de masa o vida.
- Cronómetro arriba al centro; último tercio: late y rojo, sin parpadeo errático.
- Una sola frase abajo; nueva frase reemplaza a la anterior.
- Audio: música por escena (menú, ruleta, partida, resultados), efectos clave: comer, gulp, devorar, pop de bomba, ✓, disparo, impacto, zampada, compra, navegación UI. Fuentes con licencia libre registradas en `docs/EDITOR_TODO.md`; sin audio generado por la IA de imagen.

## 8. Orden recomendado a partir de ahora

1. **Tú**: cerrar H0 (abrir `game.json`, Preview, mandos) y decidir proveedor de imágenes.
2. **Codex**: H0.5 shell de UI → H1 jugador y sensación (afinar con el Sandbox y las cifras de §2).
3. **Tú**: jugar H1 15 minutos, anotar "se siente bien / mal" y qué.
4. **Codex**: H2 → H3 (partida completa jugable con un modo).
5. Resto según `PLAN_MAESTRO.md`; Guerra se corta primero.
