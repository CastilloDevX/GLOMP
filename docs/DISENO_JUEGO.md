# GLOMP! — Biblia de diseño (física, color, arte, minijuegos, proceso)

Escrito para: Codex y la persona que prueba el juego. Complementa `AGENTS.md` (manda) y `PLAN_MAESTRO.md` (hitos). Todo número de este documento es un valor inicial y debe vivir en `src/config.js`, nunca en la lógica.

## 1. Menú principal: composición y alta local

La captura del usuario define la jerarquía visual de Brawl Stars: personaje central,
perfil/monedas arriba, accesos a ambos lados y llamada principal abajo. Se aplica
con slimes, comida, paleta y título propios de GLOMP!. No añadir amigos online,
clanes, chat, pase de batalla ni monedas adicionales.

```text
┌ Perfil local ─────── Logo GLOMP! pequeño ─────────── Glomps ┐
│ Tienda                                        Ajustes    │
│ Personalizar     [+]   slime J1   slime J2   [+] Créditos  │
│                      controles / listo                   │
│ Práctica              Modo / ruleta                JUGAR │
└──────────────── fondo menu-village.png ──────────────────┘
```

- El fondo ocupa toda la pantalla 1920×1080. El título no tapa al slime ni al grupo.
- El protagonista es el slime equipado, no un cartel gigante. Pedestales y sombra
  suave sitúan a los participantes en la plaza; animación idle discreta por dt.
- Los `[+]` permanecen a ambos lados del grupo. Ratón, teclado y mando pueden
  enfocarlos y activarlos. Cada plaza ocupada muestra nombre, icono de marcador,
  controles confirmados y estado; ofrece editar o quitar al invitado.
- JUGAR abajo a la derecha; Práctica, para una persona, abajo a la izquierda.
  Tienda y Personalizar conservan su navegación y equipo al regresar.
- El perfil es local y la moneda es Glomps. Un invitado no crea una cuenta.

### Flujo del botón [+]

1. Abrir un modal conservando de fondo el grupo y el origen del foco.
2. Elegir Teclado o un mando conectado no asignado. Sin mandos, mostrar únicamente
   opciones utilizables; nunca confirmar un mando inexistente.
3. Para teclado, elegir uno de los dos perfiles libres: **WASD** o **flechas**.
   Si el anfitrión aún no confirmó controles, debe hacerlo también antes de JUGAR.
4. Mostrar arriba/abajo/izquierda/derecha y la única tecla de Acción. Valores
   iniciales: WASD + E; flechas + Shift derecho. Permitir elegir la Acción,
   comprobando que no colisione con movimientos ni controles ya reservados.
5. Ofrecer una prueba breve: resaltar las direcciones al pulsarlas y reconocer
   Acción. Pedir **CONFIRMAR CONTROLES**; no completar el alta solo por abrir el modal.
6. Confirmar ocupa la plaza y muestra LISTO. Cancelar no reserva teclas ni crea
   jugador; vuelve al `[+]` de origen. Editar conserva el perfil anterior hasta
   confirmar el nuevo. Cambiar controles retira LISTO hasta su confirmación.

Límites de esta entrega:

- Con solo teclado hay como máximo dos participantes, uno por cada perfil. Los
  dos `[+]` crean solicitudes del mismo sistema, no cupos independientes.
- La elección de teclas queda dentro de WASD/flechas y su Acción. El remapeo libre
  de direcciones queda fuera de esta revisión para respetar la petición actual.
- Teclado compartido significa dos perfiles lógicos, no detección de teclados USB.
- Con ambos perfiles ocupados, los `[+]` se deshabilitan con explicación y el
  acceso a editar/quitar sigue disponible. Un tercer humano requiere mandos.
- Para grupos de 3–6 se mantiene la regla anterior de mandos para todos; esta
  entrega no habilita grupos mixtos mayores de dos ni afirma haber probado seis.
- JUGAR requiere al menos dos humanos confirmados y listos. Abrir un modal,
  editar, perder un mando o tener una plaza pendiente deshabilita el inicio.
- La navegación del modal no se convierte en movimiento del slime. Al cerrar o
  cambiar de estado se consumen las pulsaciones que lo abrieron.

El ciclo de producción está centralizado en [PLAN_MAESTRO.md](PLAN_MAESTRO.md).
Los prompts de imágenes pendientes están en [ASSETS_CHATGPT.md](ASSETS_CHATGPT.md).

## 2. Física y movimiento (GDevelop sin motor de física)

Se mantiene física propia, en `player.js`, con círculos y pasos fijos; no se añade el comportamiento Physics de GDevelop. La resolución de pantalla no altera sus unidades.

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

## 3. Full HD, cámara y presentación de cada ronda

### Mundo y pantalla

- Interfaz y canvas objetivo: **1920×1080**. En Full HD 16:9 no hay márgenes
  exteriores, columnas que reduzcan la arena ni partes del mapa fuera de pantalla.
- El mundo también es rectangular 16:9. Configurar anchura y altura por grupo;
  revisar el balance del cambio de superficie. Prohibido deformar un mundo
  cuadrado o escalar X/Y de los personajes de forma distinta para llenar pantalla.
- Zoom de encuadre: `min(viewportWidth / worldWidth, viewportHeight / worldHeight)`.
  En el objetivo 16:9 ambas razones coinciden. En otra proporción mantener todo
  el mapa visible con bandas; no cortar ni estirar.
- Usar dimensiones independientes en colisiones, spawn y peligros. Las imágenes
  de fondo son presentación; no son una fuente automática de hitboxes.
- HUD pequeño y flotante, fuera del centro; reservar sus zonas al colocar comida,
  spawn y avisos. Reducir su opacidad si tapa a un jugador o peligro importante.
- Pantalla completa se activa desde un botón; si no está activada, el juego llena
  el viewport disponible. La imagen no debe prometer llenar el escritorio mientras
  el navegador siga en una ventana menor.
- La cámara es fija durante la acción. Screen shake solo por eventos, máximo
  inicial 6 px y 120 ms, conservando encuadre y posibilidad de reducir movimiento.

### Cinemática → explicación → cuenta → juego

Cada ronda, incluida la primera, presenta **su mapa real** antes de habilitar el
control. Usar capas del mapa, iluminación y un recorrido suave de cámara por dt;
no hace falta generar vídeo ni un PNG por fotograma. Si la presentación mueve la
cámara, debe volver al encuadre completo antes de mostrar el primer número.
En movimiento reducido, sustituir el recorrido por un fundido estático.

La presentación tiene el título del modo, una frase con el objetivo y una línea
con el control. Las ilustraciones promocionales son opcionales y no sustituyen
la vista del mapa que se jugará. Textos de `src/i18n.js`:

| Modo | Objetivo breve | Control que se explica |
|---|---|---|
| Eat it, Eat them | Come, crece y devora. Gana quien tenga más masa | Mover; Acción = Chispazo |
| Bubble POM! | Esquiva las explosiones. Queda el último en pie | Mover; Acción sin efecto |
| Crazy Ingredients | Toca el alimento pedido antes de que termine la cuenta | Mover; Acción sin efecto |
| Buffet Blitz | Come más que nadie. El Manjar vale más | Mover; Acción = Zampada |
| Guerra de Comida | Apunta, lanza comida y sobrevive a la zona | Mover; apuntar; Acción = usar la comida en mano según sus reglas |

Orden obligatorio: explicación breve → **3 → 2 → 1 → GLOMP!** → juego. El anfitrión
puede omitir la explicación con una pulsación nueva de Acción; esto conduce al 3,
no al minijuego. Números y logo se animan por código. El reloj de ronda, movimiento,
colisiones de daño y peligros permanecen congelados hasta terminar la secuencia.
No consumir masa ni munición por la pulsación usada para confirmar u omitir.

### Cierre y ronda automática

Congelar el resultado exactamente una vez al terminar. Mostrar estadísticas de
los 2–6 participantes, puestos compartidos cuando corresponda, rebanadas y Glomps.
Incluir una barra o cuenta de próxima ronda. Al agotarse pasa sola a Ruleta; no
requiere pulsar Continuar. Pausar detiene también este avance.

| Modo | Estadísticas de la ronda |
|---|---|
| Eat it, Eat them | Masa final, devoraciones y veces devorado |
| Bubble POM! | Puesto y tiempo de supervivencia |
| Crazy Ingredients | Puesto, pedidos superados y pedido de eliminación |
| Buffet Blitz | Masa final y Manjares comidos |
| Guerra de Comida | Puesto, vida final y datos de daño/impactos que registre realmente el modo |

Los datos se calculan desde la simulación; no se inventan métricas para llenar la
pantalla. Mantener los controles y jugadores entre rondas. Al llegar a cinco
rebanadas, pasar a resultados de partida y ofrecer revancha; la automatización
no debe continuar una partida ya ganada ni pagar sus premios otra vez.

## 4. Dirección de arte y color

Estilo: gelatina caramelo brillante, contorno grueso suave, saturado pero legible, vista cenital 3/4 ligera (referencia: `samples/`). Las etiquetas, instrucciones y números se dibujan desde i18n. La excepción visual es el logotipo GLOMP! ya aprobado y cualquier título de marca aprobado expresamente.

**Paleta de referencia.** Reutilizar los colores ya definidos en config; corregir solo si la revisión visual lo requiere. No crear una herramienta de extracción como condición para continuar.

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

Arena rectangular 16:9 a pantalla completa; muros perimetrales, distribución simétrica y obstáculos rectangulares alineados a rejilla. Validar distancia y espacio de escape para cada punto de spawn con 2–6 jugadores: la simetría por sí sola no prueba que sean justos. Tres temas comparten geometría; cambia el arte:

| Tema | Muros | Obstáculos | Suelo | Hazard visual |
|---|---|---|---|---|
| Candy | chicle rosa | wafers/chocolate/bastones | damero naranja | charcos de caramelo |
| Cooking | madera + metal | mesas, cajas, sartenes | azulejo crema | salsa |
| Slime | roca musgosa | cristales, setas | verde húmedo | baba |

Cada mapa se entrega como: suelo (1 imagen), tiles de muro/obstáculo reutilizables, 3-4 arbustos, y una descripción JS de colisión compartida en `src/maps/` (rectángulos). Mapa de la ronda al azar entre los 3 (cosmético: no cambia reglas). Puntos de spawn en el borde equidistantes (6 posiciones).

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

- Tarjetas compactas superpuestas en los bordes (hasta 3 por lado): slime, marcador, rebanadas y masa/vida. No estrechan el mapa ni forman paneles laterales exteriores.
- Cronómetro arriba al centro; último tercio: late y rojo, sin parpadeo errático.
- Una sola frase abajo; nueva frase reemplaza a la anterior.
- Audio: música por escena (menú, ruleta, partida, resultados), efectos clave: comer, gulp, devorar, pop de bomba, ✓, disparo, impacto, zampada, compra, navegación UI. Fuentes con licencia libre registradas en `docs/EDITOR_TODO.md`; sin audio generado por la IA de imagen.

## 8. Ejecución y aceptación

El orden de trabajo y las decisiones aún abiertas viven únicamente en
[PLAN_MAESTRO.md](PLAN_MAESTRO.md). Probar cada flujo según
[TESTING.md](TESTING.md); las pruebas con personas pendientes permanecen en
[EDITOR_TODO.md](EDITOR_TODO.md). Una base implementada no necesita volver a
planificarse, pero no se marca aceptada sin su prueba correspondiente.
