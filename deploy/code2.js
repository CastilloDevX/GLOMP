gdjs.LobbyCode = {};
gdjs.LobbyCode.localVariables = [];
gdjs.LobbyCode.idToCallbackMap = new Map();


gdjs.LobbyCode.userFunc0x8c2c28 = function GDJSInlineCode(runtimeScene) {
"use strict";
// GLOMP:INJECT scene=Lobby
// Generado por tools/build.js. Editar src/, no este evento.
globalThis.GLOMP = globalThis.GLOMP || {};
if (!GLOMP.__loaded) {
// Módulo: src/config.js
// Todos los valores de balance y tiempos viven aquí.
GLOMP.config = {
  maxPlayers: 6,
  arenaSizes: { s: 1400, m: 1700, l: 2000 },
  slicesToWin: 5,
  slices: { first: 2, second: 1 },
  instructionSeconds: 5,
  telegraphSeconds: 0.8,
  rouletteSeconds: 3,
  player: {
    baseSpeed: 320, scalePerMass: 0.012, maxScale: 3.0, speedPenalty: 0.10,
    maxAmmo: 3, initialHealth: 100, maxKeyboardPlayers: 2, inactivityLimit: 5,
  },
  food: {
    bite: { mass: 1, throwable: false },
    plate: { mass: 3, throwable: false },
    feast: { mass: 10, eatSeconds: 1, throwable: false },
    tomato: { mass: 1, damage: 25, speed: 700, throwable: true },
    gum: { mass: 1, damage: 10, speed: 500, puddleSeconds: 3, slowMultiplier: 0.5, throwable: true },
    melon: { mass: 1, damage: 35, edgeDamage: 20, speed: 400, radius: 90, throwable: true },
    lettuce: { heal: 25, throwable: false },
    banana: { speedBoost: 0.25, boostSeconds: 4, throwable: false },
  },
  minigames: {
    eatEm: {
      minPlayers: 2, maxPlayers: 4, duration: 150, initialMass: 0, spawnImmunity: 3,
      eatScaleRatio: 1.3, coverSeconds: 0.3, absorbedMassRatio: 0.5, droppedMassRatio: 0.5,
      respawnSeconds: 2, respawnMassRatio: 0.3, minRespawnMass: 5,
      botCount: 4, botMass: 5, botRespawnSeconds: 10,
      sauceStart: 45, sauceInterval: 25, sauceStep: 0.12, sauceMassPerSecond: 4, sauceSpeedMultiplier: 0.7,
      minBushes: 3, maxBushes: 4, bushScaleLimit: 1.6,
      dashSpeedBoost: 0.6, dashSeconds: 0.8, dashMassCost: 3, dashCooldown: 1.5,
    },
    pom: {
      minPlayers: 2, maxPlayers: 6, duration: 15, fuseSeconds: 15,
      fuseEpsilon: 0.0000001, tagReach: 64, tagArc: 0.1, tagCooldown: 0.45, transferLock: 0.75,
      holderSpeedMultiplier: 1.12, burstSeconds: 0.7,
    },
    crazy: {
      minPlayers: 2, maxPlayers: 6, announcementSeconds: 1, spawnInterval: 3, maxFood: 40, antiStallOrders: 3,
      stages: [{ fromOrder: 1, seconds: 10, types: 6 }, { fromOrder: 4, seconds: 8, types: 9 }, { fromOrder: 7, seconds: 6, types: 12 }, { fromOrder: 10, seconds: 5, types: 14 }],
    },
    buffet: {
      minPlayers: 3, maxPlayers: 6, duration: 120,
      biteRate: 1.2, maxBites: 60, plateInterval: 3, maxPlates: 10,
      firstFeastAt: 10, feastInterval: 20, feastEatSeconds: 1,
      dashDistance: 180, dashSeconds: 0.18, dashCooldown: 3,
      pushDistance: 120, stunSeconds: 0.6, droppedMassRatio: 0.05, minDroppedMass: 2, maxDroppedMass: 12, hitImmunity: 1.5,
      finalFeastAt: 100, finalValueMultiplier: 2, finalSpawnMultiplier: 2,
      bananaBoost: 0.25, bananaSeconds: 4, bananaInterval: 15,
    },
    war: {
      minPlayers: 2, maxPlayers: 6, duration: 120,
      cameraMaxScale: 0.65, shoveReach: 80, shoveCone: 0.25, shoveImpulse: 700, shoveCooldown: 1.1,
      shoveWindup: 0.13, shoveActive: 0.16, shoveLunge: 210, hitImmunity: 0.45,
      fallSeconds: 0.65, edgeTolerance: 0.25,
      firstDrop: 2.5, dropInterval: 3.2, maxDrops: 5, dropNotice: 1.25, dropRadius: 105,
      dropWeights: { banana: 0.28, shield: 0.25, gum: 0.25, melon: 0.22 },
      pickupLifetime: 8, shieldSeconds: 8, speedBoost: 0.25, boostSeconds: 4,
      puddleSeconds: 3, slowMultiplier: 0.55, shockImpulse: 600, shockRadius: 170,
      shrinkStart: 65, shrinkNotice: 3, shrinkSeconds: 40, finalPlatformRatio: 0.65,
      platform: { x: 0.10, y: 0.14, width: 0.80, height: 0.66, radius: 0.065 },
    },
  },
  economy: {
    roundFirst: 4, roundSecond: 2, matchWin: 15, matchComplete: 5, firstDailyMatch: 10,
    groupMinPlayers: 4, groupMultiplier: 1.5,
    prices: { bodyColor: 40, face: 30, accessory: 60, particles: 80, trail: 100, set: 180 },
    rotatingItems: 6, pieces: { bodies: 8, faces: 6, accessories: 10, particles: 4, trails: 3 }, initialFaces: 3,
  },
  diagnostics: { gamepadPollSeconds: 1 },
  input: {
    deadZone: 0.18, responsePower: 1.4, menuAxisThreshold: 0.55,
    confirmButton: 0, backButton: 1, menuRepeatDelay: 0.35, menuRepeatInterval: 0.13,
    keyboard: [
      { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', action: 'KeyE' },
      { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', action: 'ShiftRight' },
    ],
  },
  physics: {
    fixedStep: 1 / 120, maxFrameSeconds: 0.25, baseRadius: 40, foodRadius: 23,
    acceleration: 2400, friction: 3200, lateralRetention: 0.7, separationDamping: 0.6,
    stretchAmount: 0.18, brakeSquash: 0.85, brakeSeconds: 0.09, springK: 180, springC: 14,
    gulpScale: 1.12, gulpSeconds: 0.12, gulpParticles: 4, growLerp: 8,
    knockbackDrag: 4.8,
    immuneOpacity: 0.55, immuneHz: 8, nearlyEqualImpulse: 180, nearlyEqualSeconds: 0.15,
  },
  sandbox: {
    initialFood: 45, maxFood: 60, foodInterval: 0.4, spawnPadding: 110, foodSpacing: 85,
    wallPadding: 55, obstacleGrid: 50, particleSeconds: 0.45, particleSpeed: 130,
    botTurnSeconds: 1.2, cameraMargin: 110, minPlayers: 1,
    spawnAttempts: 100, testSeed: 2026, foodBobPixels: 4, foodBobRate: 2,
  },
  art: {
    bodyColors: [0x7ED321, 0xFF4FA3, 0xFFC933, 0x2FA8FF, 0x8E4DFF, 0xFF8A2B, 0x40DBBA, 0xFFFFFF],
    markerColors: [0xFF4FA3, 0xFFC933, 0x7ED321, 0x2FA8FF, 0x8E4DFF, 0xFF8A2B],
    markerIcons: ['●', '■', '▲', '★', '◆', '⬢'], faces: ['smile', 'cheer', 'grit', 'gasp', 'sleepy', 'cheeky'],
  },
  ui: {
    width: 1920, height: 1080, buttonHeight: 86, toastSeconds: 2.5, bootSeconds: 0.2,
    volumeStep: 0.1, decorationBob: 9, decorationRate: 1.6,
    colors: { chocolate: 0x5A3A24, cream: 0xFFF4DC, ink: 0x36233D, green: 0x7ED321, yellow: 0xFFC933, pink: 0xFF4FA3, blue: 0x2FA8FF, purple: 0x8E4DFF, orange: 0xFF8A2B, red: 0xE8312F, muted: 0xABA9B1, dark: 0x211A35 },
  },
};
// Cartografía normalizada trazada sobre los originales de samples/maps.
GLOMP.config.arena = {
  width: 3200, height: 1800, largeMultiplier: 1, wall: 150,
  spawns: [[0.38,0.48],[0.62,0.52],[0.50,0.34],[0.50,0.66],[0.32,0.62],[0.68,0.38]],
  themes: ['candy','cooking','slimegarden'],
  modeThemes: { eatEm: ['slimegarden','candy'], pom: ['candy','slimegarden'], crazy: ['cooking'], buffet: ['candy','cooking'], war: ['lava'] },
  lavaWidth: 3200, lavaHeight: 1800,
  layouts: {
    candy: { obstacles: [[.20,.25,.075,.065],[.275,.25,.075,.065],[.65,.25,.075,.065],[.725,.25,.075,.065],[.20,.68,.075,.065],[.275,.68,.075,.065],[.65,.68,.075,.065],[.725,.68,.075,.065],[.40,.36,.055,.06],[.545,.58,.055,.06]], circles: [[.5,.5,.045]], bushes: [[.16,.48,.10,.10],[.84,.52,.10,.10],[.42,.79,.10,.10],[.58,.21,.10,.10]] },
    cooking: { obstacles: [[.20,.23,.10,.065],[.20,.295,.06,.10],[.70,.23,.10,.065],[.74,.295,.06,.10],[.20,.705,.10,.065],[.20,.605,.06,.10],[.70,.705,.10,.065],[.74,.605,.06,.10],[.38,.34,.085,.06],[.535,.60,.085,.06]], circles: [[.5,.5,.046]], bushes: [[.15,.50,.09,.10],[.85,.50,.09,.10],[.39,.77,.09,.10],[.61,.23,.09,.10]] },
    slimegarden: { obstacles: [[.21,.25,.085,.075],[.705,.25,.085,.075],[.21,.67,.085,.075],[.705,.67,.085,.075],[.37,.36,.065,.065],[.565,.58,.065,.065]], circles: [[.5,.5,.055]], bushes: [[.15,.48,.11,.12],[.85,.52,.11,.12],[.39,.78,.11,.12],[.61,.22,.11,.12]] },
    lava: { obstacles: [], circles: [], bushes: [] }
  },
  propHeights: { candy: 1098 / 1210, cooking: 948 / 1388, slimegarden: 827 / 1404 },
  centerArt: { width: 2.35, bottom: .5, ratios: { candy: 921 / 1280, cooking: 1117 / 1166, slimegarden: 940 / 1230 } },
};
GLOMP.config.camera = {
  maxScale: 1.05, paddingX: 210, paddingTop: 240, paddingBottom: 150,
  followRate: 4, zoomRate: 3, introZoom: 1.7, introPan: 0.1,
};
GLOMP.config.animation = {
  meshColumns: 9, meshRows: 9, idleRate: 2.8, idleAmount: 0.025,
  moveRate: 13, moveBounce: 0.045, lean: 0.11, faceLag: 0.035, eyeGaze: 0.035,
  blinkPeriod: 4.1, blinkSeconds: 0.16, eyeWidth: 0.075, eyeHeight: 0.105,
  eyeGap: 0.145, eyesY: -0.005, mouthY: 0.135, mouthWidth: 0.19, mouthHeight: 0.13,
  bodyAspect: 704 / 1164, faceDepth: 0.35, eyebrowWidth: 0.12,
};
GLOMP.config.round = {
  maxSeconds: 180, cinematicSeconds: 5, countdownSeconds: 3, launchSeconds: 0.65,
  resultsSeconds: 8, initialFood: 60, foodInterval: 0.45, foodSpacing: 72,
  resultRows: 6, botSteerSeconds: 1.2, maxDrops: 40,
  maxSpeedMultiplier: 2, tiePrecision: 1000, dropOwnerGraceSeconds: 0.45,
};
GLOMP.config.art.foodColors = [0xFFC933,0xF25B67,0x85D55B,0xB88BF2,0xFF9B45,0x60C9EF,0xE4B783,0xED8EBD,0x91C9A2,0xD6A1F0,0xFFDD8C,0x81BEDF,0xDC8C5C,0xB8D873];
GLOMP.config.art.botColor = 0x969DAE;
GLOMP.config.minigames.crazy.duration = GLOMP.config.round.maxSeconds;
GLOMP.config.minigames.crazy.initialFood = 40;
GLOMP.config.minigames.eatEm.maxSauceFraction = 0.38;
GLOMP.config.minigames.eatEm.botRespawnImmunity = 1;
GLOMP.config.minigames.buffet.maxFood = 90;
GLOMP.config.minigames.buffet.feastSpawnAttempts = 12;
GLOMP.config.minigames.buffet.feastRadius = 32;
GLOMP.config.food.gum.radius = 90;

GLOMP.config.animation.cosmetics = { hatWidth: 0.52, hatHeight: 0.24, particleCount: 4, particleRadius: 0.62, particleSize: 0.065, orbitRate: 0.8, trailInterval: 0.09, trailSeconds: 0.65, trailMax: 9, trailSize: 30, trailMinSpeed: 40 };
GLOMP.config.art.sets = [
  {body:'body1',face:'face1',accessory:'accessory0',particles:'particles3',trail:'trail1'},
  {body:'body2',face:'face2',accessory:'accessory1',particles:'particles0',trail:'trail2'},
  {body:'body6',face:'face0',accessory:'accessory5',particles:'particles2',trail:'trail0'},
  {body:'body3',face:'face3',accessory:'accessory9',particles:'particles1',trail:'trail1'},
];

GLOMP.config.art.bodyAsset = 'cartoon-body';
GLOMP.config.ui.cartoon = { cardPageSize: 6, highlightStart: 0.94, highlightEnd: 0.995, bodyShading: 0.2, gloss: 0.92, countdownPop: 0.22, launchPop: 0.15 };
// Las skins completas quedan aplazadas; los sets solo combinan piezas sencillas existentes.

// Tiempos y dimensiones de presentación; no alteran el balance de los modos.
GLOMP.config.ui.polish = { pressOffset: 3, entrySeconds: .65, staggerSeconds: .12, sliceStart: 1.1, sliceSeconds: .36, coinStart: 1.3, coinSeconds: 1.2, confettiSeconds: 4.5, confettiCount: 56, cheerRate: 3.5, cheerHeight: 8 };

GLOMP.config.ui.icons = {
  "shop": "icon-shop",
  "shirt": "icon-shirt",
  "gear": "icon-gear",
  "gamepad": "icon-gamepad",
  "trophy": "icon-trophy",
  "play": "icon-play",
  "coin": "icon-coin",
  "credits": "icon-credits",
  "star": "icon-star",
  "color": "icon-color",
  "face": "icon-face",
  "hat": "icon-hat",
  "particles": "icon-particles",
  "trail": "icon-trail",
  "gift": "icon-gift",
  "clock": "icon-clock",
  "people": "icon-people",
  "back": "icon-back",
  "plus": "icon-plus",
  "close": "icon-close",
  "left": "icon-left",
  "right": "icon-right",
  "check": "icon-check",
  "music": "icon-music",
  "sound": "icon-sound",
  "fullscreen": "icon-fullscreen",
  "keyboard": "icon-keyboard",
  "crown": "icon-crown"
};

// Módulo: src/i18n.js
// Todos los textos visibles, incluidos los diagnósticos del arranque.
GLOMP.i18n = {
  es: {
    playerShort:'J{number}', roomHintPads:'← / →: color · A: listo · Anfitrión: ↑ / ↓ para accesos · A: jugar',

    readyCompact:'✓', confirmCompact:'OK',

    pomBurst:'¡POM!', keyShiftRight:'Shift derecho', keyShiftLeft:'Shift izquierdo', keyArrowUp:'↑', keyArrowDown:'↓', keyArrowLeft:'←', keyArrowRight:'→', keyNumpad:'Num {number}',

    modeBuffet: 'BUFFET BLITZ', ruleBuffet: 'Come más que nadie. La corona señala al líder. Los Manjares requieren un segundo sin empujones.', actionBuffet: 'Acción: Zampada · embiste y roba bocados', modeWar: 'SUMO DE LAVA', ruleWar: 'Empuja a tus rivales a la lava. Caen regalos y peligros: mira las zonas marcadas. Gana el último en pie.', actionWar: 'Acción: empujón · banana: velocidad · escudo: bloquea un golpe', resultBuffet: 'Masa: {value} · Manjares: {feasts}', resultWar: 'Empujones acertados: {value}', health: 'Vida {value}', ammo: 'Mano {count}/3', finalFeast: '¡Última comilona! Valor y aparición ×2',
    room: "SALA LOCAL",
    roomSubtitle: "Elige tu color. Confirma y prepárate para la copa.",
    roomHint: "J1: A / D + {action1} · J2: ← / → + {action2} · W / S: accesos · Enter: jugar",
    addPlayer: "+",
    addTitle: "AÑADIR JUGADOR LOCAL",
    addBody: "Confirma el teclado de esta plaza antes de entrar a la sala.",
    keysPreset: "Mover: {keys}",
    actionPreset: "Acción: {key}",
    confirmControls: "CONFIRMAR CONTROLES",
    changeAction: "CAMBIAR ACCIÓN",
    cancel: "CANCELAR",
    chooseDevice: "Pulsa A en un mando o añade un teclado.",
    selectColor: "ELIGE COLOR",
    confirmColor: "CONFIRMAR COLOR",
    colorHint: "← / → cambia el color",
    playersReady: "{ready}/{count} LISTOS",
    needPlayers: "Añade al menos dos jugadores",
    needReady: "Cada jugador debe confirmar su color",
    cup: "COPA DE BOCADOS",
    cupRule: "{count} rebanadas para ganar · siguiente ronda automática",
    maps: "MAPAS",
    mapCandy: "DULCERÍA",
    mapCooking: "COCINA REVUELTA",
    mapSlimegarden: "JARDÍN DE SLIME",
    roundLabel: "RONDA {number}",
    modeEatEm: "COME Y CRECE",
    modePom: "BUBBLE POM!",
    modeCrazy: "INGREDIENTES LOCOS",
    ruleEatEm: "Come para crecer. Cubre a los pequeños para devorarlos. Gana quien tenga más masa.",
    rulePom: "Pasa el chicle golpeando a otro slime con Acción. La mecha dura 15 segundos y no se reinicia: ¡que explote en otro!",
    ruleCrazy: "Toca el ingrediente dorado antes de que termine el pedido. Quien no lo consiga queda fuera.",
    actionEatEm: "Acción: Chispazo · cuesta 3 de masa",
    actionPom: "Acción: pasar el chicle · acercarse y mirar al rival",
    actionCrazy: "Solo necesitas moverte",
    countdown: "{number}",
    launch: "GLOMP!",
    removePlayer: 'Quitar Jugador {number}',
    rankPlayer: '{place} · Jugador {number}',
    rewardGlomps: '+{coins} Glomps',
    totalGlomps: 'Total: {coins} Glomps',
    sliceRemaining: 'Falta 1 rebanada',
    slicesRemaining: 'Faltan {count} rebanadas',
    goalReached: '¡Meta alcanzada!',
    results: "RESULTADOS DE LA RONDA",
    nextRound: "Siguiente minijuego en {seconds} s",
    finalMatch: "¡COPA COMPLETADA!",
    matchWinner: "Gana {names}",
    sharedWinners: "Victoria compartida: {names}",
    slices: "{count}/{goal}",
    roundReward: "+{slices} rebanadas · +{coins} Glomps",
    resultMass: "Masa: {value} · Devorados: {devoured}",
    resultPom: "Pases acertados: {value}",
    resultCrazy: "Pedidos: {value}",
    resultSurvival: "Tiempo: {value} s",
    request: "BUSCA: {name}",
    requestStarting: "PREPÁRATE: {name}",
    safe: "✓",
    eliminated: "FUERA",
    respawning: "Vuelve en {seconds}",
    bot: "BOT",
    playAgain: "VOLVER A LA SALA",
    practiceBadge: "PRÁCTICA · ESC PARA VOLVER",
    sauceWarning: "¡La Salsa avanza! El centro es seguro.",
    modeTitle: "{mode} · {map}",
    roundTime: "{minutes}:{seconds}",
    crown: "♛",
    profile: "INVITADOS LOCALES",
    readyShort: "LISTO ✓",
    notReadyShort: "CONFIRMAR",
    incoming: "SIGUIENTE MINIJUEGO",
    introFooter: "Observa los obstáculos y las rutas. El movimiento empieza después de la cuenta.",
    noAction: "Acción libre: pulsa una tecla",
    routeHint: "Los pasillos centrales permanecen abiertos",
    food0: "Queso",
    food1: "Tomate",
    food2: "Lechuga",
    food3: "Uva",
    food4: "Zanahoria",
    food5: "Arándano",
    food6: "Pan",
    food7: "Fresa",
    food8: "Manzana",
    food9: "Berenjena",
    food10: "Maíz",
    food11: "Pescado",
    food12: "Galleta",
    food13: "Pera",
    itemName: "{name}",
    earned: "Ganado: {coins} Glomps",
    menuControls: "Enter: jugar · Esc: volver",
    joinInstructions: "Pulsa E, Shift derecho o A para entrar",
    roomColor: "Color: {name}",
    roomLocked: "Color confirmado",
    firstStep: "1 · Elige color",
    secondStep: "2 · Confirma con Acción",
    modePractice: "PRÁCTICA",
    rulePractice: "Come y prueba el movimiento. Esc para volver a la sala.",
    bootTitle: 'GLOMP!',
    bootStatus: 'Cargando · Mandos detectados: {count}',
    bootNoGamepadAPI: 'La API de mandos no está disponible en este navegador.',
    bootHelp: 'Conecta los mandos y pulsa un botón en cada uno.\nSi solo hay teclado, pueden jugar hasta dos personas.',
    gamepadLog: '[GLOMP] Mandos detectados: {count}. Índices: {indices}',
    gamepadUnavailable: '[GLOMP] La API de mandos no está disponible en este navegador.',
    assetError: 'No se pudieron cargar las imágenes. Recarga la página.',

    tagline: 'Come, crece y gana rebanadas',
    localPlayers: 'De 2 a 6 jugadores',
    play: 'JUGAR',
    practice: 'PRÁCTICA',
    customize: 'PERSONALIZAR',
    shop: 'TIENDA',
    settings: 'AJUSTES',
    credits: 'CRÉDITOS',
    back: 'VOLVER',
    start: 'EMPEZAR',
    menuHints: 'Mover: flechas, WASD o cruceta · Aceptar: A, Enter o E · Volver: B o Esc',
    lobbyHints: 'Pulsa A (mando), E (teclado 1) o Shift derecho (teclado 2) para entrar · Vuelve a pulsar para marcar listo',

    lobbyTitle: 'SALA',
    customizeTitle: 'PERSONALIZAR',
    shopTitle: 'TIENDA',
    settingsTitle: 'AJUSTES',
    creditsTitle: 'CRÉDITOS',
    lobbySubtitle: 'Todos los jugadores deben estar listos. Con tres o más personas hacen falta mandos.',
    joinPrompt: 'Pulsa A para unirte',
    slotDisabled: 'Plaza desactivada',
    player: 'Jugador {number}',
    keyboardDevice: 'Teclado {number}',
    gamepadDevice: 'Mando {number}',
    ready: 'LISTO',
    notReady: 'NO LISTO',
    disconnected: 'SIN MANDO',
    lobbyFull: 'La sala está llena.',
    controllersRequired: 'Con tres o más jugadores hacen falta mandos.',
    connectedPads: 'Mandos: {count}',
    toArena: 'IR A LA ARENA',

    coins: '{count} Glomps',
    owned: 'Tuyo',
    price: '{count} Glomps',
    buy: 'COMPRAR',
    buyPrice: 'COMPRAR · {count} Glomps',
    equip: 'EQUIPAR',
    bodyTab: 'COLOR',
    faceTab: 'CARA',
    cosmeticOnly: 'Todo es cosmético: no cambia velocidad, tamaño ni daño.',
    purchaseDone: 'Compra realizada.',
    notEnoughCoins: 'No tienes suficientes Glomps.',
    equipped: 'Equipado.',
    itemLocked: 'Primero hay que comprarlo.',
    color0: 'Lima',
    color1: 'Chicle',
    color2: 'Flan',
    color3: 'Cielo',
    color4: 'Uva',
    color5: 'Zanahoria',
    color6: 'Menta',
    color7: 'Nube',
    cataloguePage:'{page} / {pages}',
    categoryfeatured:'DESTACADOS', categorybody:'COLOR', categoryface:'CARA', categoryaccessory:'SOMBREROS', categoryparticles:'BRILLOS', categorytrail:'RASTROS', categorysets:'SETS', unequip:'QUITAR ADORNO',
    accessory0:'Fiesta', accessory1:'Corona', accessory2:'Chef', accessory3:'Pirata', accessory4:'Lazo', accessory5:'Brote', accessory6:'Gorra', accessory7:'Halo', accessory8:'Margarita', accessory9:'Astro',
    particles0:'Estrellas', particles1:'Corazones', particles2:'Burbujas', particles3:'Confeti', trail0:'Gotas de menta', trail1:'Arcoíris', trail2:'Cometa',
    set0:'Fiesta dulce', set1:'Realeza', set2:'Jardín mágico', set3:'Explorador',
    face0: 'Sonrisa', face1: 'Carcajada', face2: 'Determinado', face3: 'Sorpresa', face4: 'Soñoliento', face5: 'Guiño',
    gumNotice: 'J{number} lleva el chicle · ¡pásalo!', gumHolder: '¡PASA EL CHICLE!', gumSafe: 'HUYE DEL CHICLE',
    pushes: 'Empujones: {count}', shieldActive: 'ESCUDO ACTIVO', lavaRising: '¡La lava sube! Acércate al centro',
    mapLava: 'CALDERA CROCANTE', wardrobe: 'ARMARIO',
    localProfile: 'PARTY LOCAL', fontCredit: 'Tipografía: Lilita One · Juan Montoreano · OFL',

    musicVolume: 'Música: {value}%',
    effectsVolume: 'Efectos: {value}%',
    maxPlayers: 'Jugadores máx.: {count}',
    fullscreen: 'PANTALLA COMPLETA',
    fullscreenDenied: 'El navegador no permitió la pantalla completa.',
    remapKeyboard: 'TECLAS DEL TECLADO',
    resetSave: 'BORRAR PARTIDA GUARDADA',
    confirmReset: 'PULSA OTRA VEZ PARA CONFIRMAR',
    resetConfirm: 'Esto borra Glomps y compras. Pulsa de nuevo para confirmar.',
    saveReset: 'Partida guardada borrada.',
    settingsHints: 'Izquierda y derecha cambian los valores.',
    binding: 'J{player} · {action}: {key}',
    pressNewKey: 'Pulsa la nueva tecla (Esc cancela)',
    keyUsed: 'Esa tecla ya está en uso.',
    up: 'Arriba',
    down: 'Abajo',
    left: 'Izquierda',
    right: 'Derecha',
    action: 'Acción',

    creditsBody: 'GLOMP! · Demo de hackathon · Hecho con GDevelop 5',

    sandboxTitle: 'ARENA DE PRUEBA',
    sandboxObjective: 'Mueve tu slime, come bocaditos y mira cómo crece.',
    sandboxControls: 'Mover: stick, flechas o WASD · Pausa: B o Esc',
    mass: 'Masa {count}',
    scale: 'Escala {value}',
    autoControl: 'Control automático',
    pauseTitle: 'PAUSA',
    resume: 'CONTINUAR',
    restart: 'REINICIAR',
    toMenu: 'IR AL MENÚ',
  },
  text: function (key, values) {
    let text = GLOMP.i18n.es[key] || key;
    Object.keys(values || {}).forEach(function (name) { text = text.split('{' + name + '}').join(String(values[name])); });
    return text;
  },
};

// Módulo: src/art.js
// Arte cartoon activo: base, escenarios 16:9 y piezas con transparencia.
GLOMP.art = {
  "title-glomp": {
    "file": "assets/ui/title-glomp.png",
    "bounds": {
      "x": 63,
      "y": 86,
      "width": 1896,
      "height": 640
    }
  },
  "menu-village": {
    "file": "assets/cartoon/ui/village.png",
    "bounds": null
  },
  "food-bite": {
    "file": "assets/food/bite.png",
    "bounds": {
      "x": 274,
      "y": 299,
      "width": 714,
      "height": 668
    }
  },
  "banner-original": {
    "file": "assets/ui/banner-original.png",
    "bounds": null
  },
  "ui-podium": {
    "file": "assets/cartoon/ui/podium.png",
    "bounds": {
      "x": 226,
      "y": 113,
      "width": 1720,
      "height": 555
    }
  },
  "ui-button": {
    "file": "assets/cartoon/ui/button.png",
    "bounds": {
      "x": 47,
      "y": 64,
      "width": 2078,
      "height": 587
    }
  },
  "ui-ribbon": {
    "file": "assets/cartoon/ui/ribbon.png",
    "bounds": {
      "x": 42,
      "y": 67,
      "width": 2088,
      "height": 577
    }
  },
  "ui-panel": {
    "file": "assets/cartoon/ui/panel.png",
    "bounds": {
      "x": 10,
      "y": 65,
      "width": 2152,
      "height": 572
    }
  },
  "map-lava": {
    "file": "assets/illustrated/maps/lava.png",
    "bounds": null
  },
  "food-ingredient1": {
    "file": "assets/illustrated/food/ingredient1.png",
    "bounds": {
      "x": 69,
      "y": 32,
      "width": 1193,
      "height": 1132
    }
  },
  "food-ingredient2": {
    "file": "assets/illustrated/food/ingredient2.png",
    "bounds": {
      "x": 30,
      "y": 23,
      "width": 1266,
      "height": 1152
    }
  },
  "food-ingredient3": {
    "file": "assets/illustrated/food/ingredient3.png",
    "bounds": {
      "x": 139,
      "y": 51,
      "width": 1112,
      "height": 1109
    }
  },
  "food-ingredient4": {
    "file": "assets/illustrated/food/ingredient4.png",
    "bounds": {
      "x": 174,
      "y": 20,
      "width": 1135,
      "height": 1138
    }
  },
  "food-ingredient5": {
    "file": "assets/illustrated/food/ingredient5.png",
    "bounds": {
      "x": 95,
      "y": 146,
      "width": 1149,
      "height": 938
    }
  },
  "food-ingredient6": {
    "file": "assets/illustrated/food/ingredient6.png",
    "bounds": {
      "x": 148,
      "y": 82,
      "width": 1292,
      "height": 867
    }
  },
  "food-ingredient7": {
    "file": "assets/illustrated/food/ingredient7.png",
    "bounds": {
      "x": 162,
      "y": 38,
      "width": 1077,
      "height": 1095
    }
  },
  "food-ingredient8": {
    "file": "assets/illustrated/food/ingredient8.png",
    "bounds": {
      "x": 147,
      "y": 113,
      "width": 1010,
      "height": 1028
    }
  },
  "food-ingredient9": {
    "file": "assets/illustrated/food/ingredient9.png",
    "bounds": {
      "x": 109,
      "y": 83,
      "width": 1139,
      "height": 1037
    }
  },
  "food-ingredient10": {
    "file": "assets/illustrated/food/ingredient10.png",
    "bounds": {
      "x": 150,
      "y": 23,
      "width": 1148,
      "height": 1138
    }
  },
  "food-ingredient11": {
    "file": "assets/illustrated/food/ingredient11.png",
    "bounds": {
      "x": 130,
      "y": 46,
      "width": 1357,
      "height": 926
    }
  },
  "food-ingredient12": {
    "file": "assets/illustrated/food/ingredient12.png",
    "bounds": {
      "x": 37,
      "y": 47,
      "width": 1208,
      "height": 1132
    }
  },
  "food-ingredient13": {
    "file": "assets/illustrated/food/ingredient13.png",
    "bounds": {
      "x": 184,
      "y": 88,
      "width": 976,
      "height": 1063
    }
  },
  "food-banana": {
    "file": "assets/illustrated/food/banana.png",
    "bounds": {
      "x": 147,
      "y": 34,
      "width": 1295,
      "height": 952
    }
  },
  "food-gum": {
    "file": "assets/illustrated/food/gum.png",
    "bounds": {
      "x": 104,
      "y": 83,
      "width": 1066,
      "height": 1062
    }
  },
  "food-melon": {
    "file": "assets/illustrated/food/melon.png",
    "bounds": {
      "x": 57,
      "y": 59,
      "width": 1200,
      "height": 1090
    }
  },
  "food-plate": {
    "file": "assets/illustrated/food/plate.png",
    "bounds": {
      "x": 155,
      "y": 50,
      "width": 1226,
      "height": 921
    }
  },
  "food-feast": {
    "file": "assets/illustrated/food/feast.png",
    "bounds": {
      "x": 42,
      "y": 79,
      "width": 1272,
      "height": 1011
    }
  },
  "accessory0": {
    "file": "assets/illustrated/accessories/party.png",
    "bounds": {
      "x": 213,
      "y": 57,
      "width": 887,
      "height": 1068
    }
  },
  "accessory1": {
    "file": "assets/illustrated/accessories/crown.png",
    "bounds": {
      "x": 78,
      "y": 83,
      "width": 1380,
      "height": 859
    }
  },
  "accessory2": {
    "file": "assets/illustrated/accessories/chef.png",
    "bounds": {
      "x": 88,
      "y": 139,
      "width": 1141,
      "height": 982
    }
  },
  "accessory3": {
    "file": "assets/illustrated/accessories/pirate.png",
    "bounds": {
      "x": 35,
      "y": 195,
      "width": 1466,
      "height": 577
    }
  },
  "accessory4": {
    "file": "assets/illustrated/accessories/bow.png",
    "bounds": {
      "x": 227,
      "y": 107,
      "width": 1082,
      "height": 813
    }
  },
  "accessory5": {
    "file": "assets/illustrated/accessories/sprout.png",
    "bounds": {
      "x": 136,
      "y": 191,
      "width": 1080,
      "height": 784
    }
  },
  "accessory6": {
    "file": "assets/illustrated/accessories/cap.png",
    "bounds": {
      "x": 74,
      "y": 92,
      "width": 1183,
      "height": 1023
    }
  },
  "accessory7": {
    "file": "assets/illustrated/accessories/halo.png",
    "bounds": {
      "x": 146,
      "y": 271,
      "width": 1244,
      "height": 483
    }
  },
  "accessory8": {
    "file": "assets/illustrated/accessories/flower.png",
    "bounds": {
      "x": 68,
      "y": 53,
      "width": 1185,
      "height": 1094
    }
  },
  "accessory9": {
    "file": "assets/illustrated/accessories/astronaut.png",
    "bounds": {
      "x": 139,
      "y": 108,
      "width": 1259,
      "height": 810
    }
  },
  "particles0": {
    "file": "assets/illustrated/particles/style0.png",
    "bounds": {
      "x": 152,
      "y": 144,
      "width": 965,
      "height": 921
    }
  },
  "particles1": {
    "file": "assets/illustrated/particles/style1.png",
    "bounds": {
      "x": 336,
      "y": 332,
      "width": 648,
      "height": 528
    }
  },
  "particles2": {
    "file": "assets/illustrated/particles/style2.png",
    "bounds": {
      "x": 227,
      "y": 162,
      "width": 858,
      "height": 861
    }
  },
  "particles3": {
    "file": "assets/illustrated/particles/style3.png",
    "bounds": {
      "x": 236,
      "y": 193,
      "width": 859,
      "height": 815
    }
  },
  "trail0": {
    "file": "assets/illustrated/trails/style0.png",
    "bounds": {
      "x": 121,
      "y": 142,
      "width": 1080,
      "height": 905
    }
  },
  "trail1": {
    "file": "assets/illustrated/trails/style1.png",
    "bounds": {
      "x": 113,
      "y": 173,
      "width": 1353,
      "height": 713
    }
  },
  "trail2": {
    "file": "assets/illustrated/trails/style2.png",
    "bounds": {
      "x": 233,
      "y": 166,
      "width": 1110,
      "height": 653
    }
  },
  "map-candy": {
    "file": "assets/cartoon/maps/candy.png",
    "bounds": null
  },
  "map-cooking": {
    "file": "assets/cartoon/maps/cooking.png",
    "bounds": null
  },
  "map-slimegarden": {
    "file": "assets/cartoon/maps/slimegarden.png",
    "bounds": null
  },
  "cartoon-body": {
    "file": "assets/cartoon/slime/body.png",
    "bounds": {
      "x": 189,
      "y": 171,
      "width": 1164,
      "height": 704
    }
  },
  "map-candy-block": {
    "file": "assets/cartoon/props/candy-block.png",
    "bounds": {
      "x": 51,
      "y": 50,
      "width": 1210,
      "height": 1098
    }
  },
  "map-candy-bush": {
    "file": "assets/cartoon/props/candy-bush.png",
    "bounds": {
      "x": 70,
      "y": 172,
      "width": 1413,
      "height": 675
    }
  },
  "map-candy-center": {
    "file": "assets/cartoon/props/candy-center.png",
    "bounds": {
      "x": 85,
      "y": 84,
      "width": 1280,
      "height": 921
    }
  },
  "map-cooking-block": {
    "file": "assets/cartoon/props/cooking-block.png",
    "bounds": {
      "x": 73,
      "y": 51,
      "width": 1388,
      "height": 948
    }
  },
  "map-cooking-bush": {
    "file": "assets/cartoon/props/cooking-bush.png",
    "bounds": {
      "x": 27,
      "y": 161,
      "width": 1484,
      "height": 697
    }
  },
  "map-cooking-center": {
    "file": "assets/cartoon/props/cooking-center.png",
    "bounds": {
      "x": 72,
      "y": 33,
      "width": 1166,
      "height": 1117
    }
  },
  "map-slimegarden-block": {
    "file": "assets/cartoon/props/slimegarden-block.png",
    "bounds": {
      "x": 71,
      "y": 84,
      "width": 1404,
      "height": 827
    }
  },
  "map-slimegarden-bush": {
    "file": "assets/cartoon/props/slimegarden-bush.png",
    "bounds": {
      "x": 44,
      "y": 32,
      "width": 1462,
      "height": 959
    }
  },
  "map-slimegarden-center": {
    "file": "assets/cartoon/props/slimegarden-center.png",
    "bounds": {
      "x": 152,
      "y": 40,
      "width": 1230,
      "height": 940
    }
  },
  "reward-cake": {
    "file": "assets/cartoon/rewards/cake-slice.png",
    "bounds": {
      "x": 62,
      "y": 47,
      "width": 1214,
      "height": 1122
    }
  },
  "icon-shop": {
    "file": "assets/icons/shop.png",
    "bounds": {
      "x": 34,
      "y": 43,
      "width": 1185,
      "height": 1168
    }
  },
  "icon-shirt": {
    "file": "assets/icons/shirt.png",
    "bounds": {
      "x": 48,
      "y": 53,
      "width": 1157,
      "height": 1152
    }
  },
  "icon-gear": {
    "file": "assets/icons/gear.png",
    "bounds": {
      "x": 42,
      "y": 57,
      "width": 1167,
      "height": 1148
    }
  },
  "icon-gamepad": {
    "file": "assets/icons/gamepad.png",
    "bounds": {
      "x": 31,
      "y": 50,
      "width": 1188,
      "height": 1172
    }
  },
  "icon-trophy": {
    "file": "assets/icons/trophy.png",
    "bounds": {
      "x": 31,
      "y": 42,
      "width": 1191,
      "height": 1173
    }
  },
  "icon-play": {
    "file": "assets/icons/play.png",
    "bounds": {
      "x": 31,
      "y": 43,
      "width": 1192,
      "height": 1180
    }
  },
  "icon-coin": {
    "file": "assets/icons/coin.png",
    "bounds": {
      "x": 53,
      "y": 68,
      "width": 1147,
      "height": 1144
    }
  },
  "icon-credits": {
    "file": "assets/icons/credits.png",
    "bounds": {
      "x": 36,
      "y": 45,
      "width": 1183,
      "height": 1173
    }
  },
  "icon-star": {
    "file": "assets/icons/star.png",
    "bounds": {
      "x": 49,
      "y": 55,
      "width": 1156,
      "height": 1153
    }
  },
  "icon-color": {
    "file": "assets/icons/color.png",
    "bounds": {
      "x": 59,
      "y": 79,
      "width": 1135,
      "height": 1136
    }
  },
  "icon-face": {
    "file": "assets/icons/face.png",
    "bounds": {
      "x": 72,
      "y": 88,
      "width": 1107,
      "height": 1089
    }
  },
  "icon-hat": {
    "file": "assets/icons/hat.png",
    "bounds": {
      "x": 35,
      "y": 50,
      "width": 1185,
      "height": 1167
    }
  },
  "icon-particles": {
    "file": "assets/icons/particles.png",
    "bounds": {
      "x": 54,
      "y": 65,
      "width": 1146,
      "height": 1131
    }
  },
  "icon-trail": {
    "file": "assets/icons/trail.png",
    "bounds": {
      "x": 40,
      "y": 52,
      "width": 1174,
      "height": 1152
    }
  },
  "icon-gift": {
    "file": "assets/icons/gift.png",
    "bounds": {
      "x": 50,
      "y": 63,
      "width": 1151,
      "height": 1136
    }
  },
  "icon-clock": {
    "file": "assets/icons/clock.png",
    "bounds": {
      "x": 48,
      "y": 63,
      "width": 1159,
      "height": 1149
    }
  },
  "icon-people": {
    "file": "assets/icons/people.png",
    "bounds": {
      "x": 51,
      "y": 62,
      "width": 1153,
      "height": 1138
    }
  },
  "icon-back": {
    "file": "assets/icons/back.png",
    "bounds": {
      "x": 67,
      "y": 85,
      "width": 1120,
      "height": 1088
    }
  },
  "icon-plus": {
    "file": "assets/icons/plus.png",
    "bounds": {
      "x": 48,
      "y": 61,
      "width": 1158,
      "height": 1135
    }
  },
  "icon-close": {
    "file": "assets/icons/close.png",
    "bounds": {
      "x": 54,
      "y": 63,
      "width": 1144,
      "height": 1131
    }
  },
  "icon-left": {
    "file": "assets/icons/left.png",
    "bounds": {
      "x": 59,
      "y": 69,
      "width": 1135,
      "height": 1125
    }
  },
  "icon-right": {
    "file": "assets/icons/right.png",
    "bounds": {
      "x": 77,
      "y": 91,
      "width": 1100,
      "height": 1100
    }
  },
  "icon-check": {
    "file": "assets/icons/check.png",
    "bounds": {
      "x": 83,
      "y": 97,
      "width": 1087,
      "height": 1076
    }
  },
  "icon-music": {
    "file": "assets/icons/music.png",
    "bounds": {
      "x": 60,
      "y": 79,
      "width": 1132,
      "height": 1127
    }
  },
  "icon-sound": {
    "file": "assets/icons/sound.png",
    "bounds": {
      "x": 50,
      "y": 68,
      "width": 1155,
      "height": 1135
    }
  },
  "icon-fullscreen": {
    "file": "assets/icons/fullscreen.png",
    "bounds": {
      "x": 24,
      "y": 42,
      "width": 1205,
      "height": 1185
    }
  },
  "icon-keyboard": {
    "file": "assets/icons/keyboard.png",
    "bounds": {
      "x": 26,
      "y": 53,
      "width": 1201,
      "height": 1174
    }
  },
  "icon-crown": {
    "file": "assets/icons/crown.png",
    "bounds": {
      "x": 48,
      "y": 67,
      "width": 1159,
      "height": 1138
    }
  }
};

// Módulo: src/save.js
// Un perfil local compartido: compras y saldo; equipo independiente por jugador.
GLOMP.save = {
  data: null,
  storageAvailable: true,
  defaults: function () {
    return {
      version: 1, coins: 0, owned: ['body0', 'face0', 'face1', 'face2'], equipped: {},
      settings: { music: 0.8, effects: 0.8, maxPlayers: GLOMP.config.maxPlayers, keys: GLOMP.config.input.keyboard.map(function (keys) { return Object.assign({}, keys); }) },
    };
  },
  load: function () {
    const defaults = GLOMP.save.defaults();
    let stored;
    try { stored = JSON.parse(localStorage.getItem('glomp.save.v1') || 'null'); } catch (error) { GLOMP.save.storageAvailable = false; }
    if (stored && stored.version === defaults.version) {
      defaults.lastDailyMatch = typeof stored.lastDailyMatch === 'string' ? stored.lastDailyMatch : null;
      defaults.coins = Number.isSafeInteger(stored.coins) && stored.coins >= 0 ? stored.coins : 0;
      defaults.owned = Array.from(new Set(defaults.owned.concat(Array.isArray(stored.owned) ? stored.owned.filter(function (id) { return typeof id === 'string'; }) : [])));
      if (stored.equipped && typeof stored.equipped === 'object') defaults.equipped = stored.equipped;
      const settings = stored.settings || {};
      ['music', 'effects'].forEach(function (key) { if (Number.isFinite(settings[key])) defaults.settings[key] = Math.max(0, Math.min(1, settings[key])); });
      if (Number.isInteger(settings.maxPlayers)) defaults.settings.maxPlayers = Math.max(2, Math.min(GLOMP.config.maxPlayers, settings.maxPlayers));
      if (Array.isArray(settings.keys)) settings.keys.slice(0, GLOMP.config.player.maxKeyboardPlayers).forEach(function (keys, index) {
        Object.keys(defaults.settings.keys[index]).forEach(function (action) { if (typeof keys[action] === 'string' && /^[A-Za-z0-9]+$/.test(keys[action])) defaults.settings.keys[index][action] = keys[action]; });
      });
    }
    GLOMP.save.data = defaults;
    return defaults;
  },
  write: function () {
    try { localStorage.setItem('glomp.save.v1', JSON.stringify(GLOMP.save.data)); return true; }
    catch (error) { GLOMP.save.storageAvailable = false; return false; }
  },
  equipment: function (playerId) {
    const data = GLOMP.save.data;
    const saved = data.equipped[playerId] || {};
    const equipment={body:'body0',face:'face0',accessory:null,particles:null,trail:null};
    Object.keys(equipment).forEach(function(category){if(typeof saved[category]==='string'&&saved[category].startsWith(category)&&data.owned.includes(saved[category]))equipment[category]=saved[category];});
    return equipment;
  },
  reset: function () { GLOMP.save.data = GLOMP.save.defaults(); GLOMP.save.write(); },
};

// Módulo: src/input.js
// Estado y callbacks bajo GLOMP; sin temporizadores del navegador.
GLOMP.input = {
  keys: {}, pendingKeys: {}, previousKeys: {}, edges: {}, pads: [], previousPads: {}, pressedCodes: [], initialized: false,
  navTime: 0, navDirection: '', nav: '', confirm: false, back: false, pointerClick: null,
  bind: function () {
    if (GLOMP.input.initialized || typeof window === 'undefined') return;
    GLOMP.input.initialized = true;
    GLOMP.input.onDown = function (event) {
      GLOMP.input.press(event.code);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(event.code)) event.preventDefault();
    };
    GLOMP.input.onUp = function (event) { GLOMP.input.release(event.code); };
    GLOMP.input.onBlur = function () { GLOMP.input.pointerHeld=null; GLOMP.input.keys = {}; GLOMP.input.previousKeys = {}; GLOMP.input.pendingKeys = {}; };
    window.addEventListener('keydown', GLOMP.input.onDown);
    window.addEventListener('keyup', GLOMP.input.onUp);
    window.addEventListener('blur', GLOMP.input.onBlur);
    // Botones dibujados en PIXI, hit testing DOM: evita rutas de eventos ajenas al renderer de GDevelop.
    GLOMP.input.onPointer = function (event) {
      if(event.type==='pointerup')GLOMP.input.pointerHeld=null;
      const canvas = document.querySelector('canvas'); if (!canvas) return;
      const rect = canvas.getBoundingClientRect(), ui = GLOMP.config.ui;
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      const scale = Math.min(rect.width / ui.width,rect.height / ui.height);
      const x = (event.clientX - rect.left - (rect.width - ui.width * scale) / 2) / scale;
      const y = (event.clientY - rect.top - (rect.height - ui.height * scale) / 2) / scale;
      GLOMP.input.mouse = { x: x, y: y, active: true };
      const button = GLOMP.ui.buttons.slice().reverse().find(function (b) { return b.enabled && Math.abs(x-b.x)<=b.width/2 && Math.abs(y-b.y)<=b.height/2; });
      if(event.type==='pointerdown')GLOMP.input.pointerHeld=button?button.id:null;
      if (button) { GLOMP.ui.focus = button.id; if (event.type === 'pointerup') GLOMP.input.pointerClick = button.id; }
    };
    window.addEventListener('pointerdown',GLOMP.input.onPointer);
    window.addEventListener('pointermove',GLOMP.input.onPointer);
    window.addEventListener('pointerup',GLOMP.input.onPointer);
  },
  press: function (code) {
    if (!GLOMP.input.keys[code]) GLOMP.input.pendingKeys[code] = true;
    GLOMP.input.keys[code] = true;
  },
  release: function (code) { delete GLOMP.input.keys[code]; },
  update: function (dt) {
    const input = GLOMP.input, config = GLOMP.config.input;
    input.edges = Object.assign({},input.pendingKeys); input.pendingKeys = {}; input.pressedCodes = Object.keys(input.edges);
    Object.keys(input.keys).forEach(function (code) { if (!input.previousKeys[code] && !input.edges[code]) { input.edges[code] = true; input.pressedCodes.push(code); } });
    input.previousKeys = Object.assign({}, input.keys);
    let pads = [];
    try { if (typeof navigator !== 'undefined' && navigator.getGamepads) pads = Array.from(navigator.getGamepads() || []).filter(function (pad) { return pad && pad.connected; }); } catch (error) { pads = []; }
    input.pads = pads.map(function (pad) {
      const before = input.previousPads[pad.index] || [];
      const buttons = Array.from(pad.buttons, function (button) { return !!button.pressed; });
      return { index: pad.index, axes: Array.from(pad.axes), buttons: buttons, edges: buttons.map(function (down, index) { return down && !before[index]; }) };
    });
    input.previousPads = {};
    input.pads.forEach(function (pad) { input.previousPads[pad.index] = pad.buttons; });
    input.confirm = !!(input.edges.Enter || input.edges.Space || (GLOMP.save.data ? GLOMP.save.data.settings.keys : config.keyboard).some(function(keys){return input.edges[keys.action];}) || input.pads.some(function (pad) { return pad.edges[config.confirmButton]; }));
    input.back = !!(input.edges.Escape || input.pads.some(function (pad) { return pad.edges[config.backButton]; }));
    let direction = '';
    if (input.keys.ArrowUp || input.keys.KeyW) direction = 'up';
    if (input.keys.ArrowDown || input.keys.KeyS) direction = 'down';
    if (input.keys.ArrowLeft || input.keys.KeyA) direction = 'left';
    if (input.keys.ArrowRight || input.keys.KeyD) direction = 'right';
    input.pads.forEach(function (pad) {
      if (pad.buttons[12] || pad.axes[1] < -config.menuAxisThreshold) direction = 'up';
      if (pad.buttons[13] || pad.axes[1] > config.menuAxisThreshold) direction = 'down';
      if (pad.buttons[14] || pad.axes[0] < -config.menuAxisThreshold) direction = 'left';
      if (pad.buttons[15] || pad.axes[0] > config.menuAxisThreshold) direction = 'right';
    });
    input.nav = '';
    if (direction !== input.navDirection) { input.navTime = 0; input.navDirection = direction; input.nav = direction; }
    else if (direction) {
      input.navTime += dt;
      if (input.navTime >= config.menuRepeatDelay) { input.nav = direction; input.navTime -= config.menuRepeatInterval; }
    }
  },
  label: function (code) {
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Numpad')) return GLOMP.i18n.text('keyNumpad',{number:code.slice(6)});
    return GLOMP.i18n.es['key' + code] || code;
  },
  axis: function (x, y) {
    const length = Math.hypot(x, y), config = GLOMP.config.input;
    if (length <= config.deadZone) return { x: 0, y: 0 };
    const strength = Math.pow(Math.min(1, (length - config.deadZone) / (1 - config.deadZone)), config.responsePower);
    return { x: x / length * strength, y: y / length * strength };
  },
  read: function (source) {
    const input = GLOMP.input;
    if (source.kind === 'keyboard') {
      const keys = GLOMP.save.data.settings.keys[source.index];
      let x = (input.keys[keys.right] ? 1 : 0) - (input.keys[keys.left] ? 1 : 0);
      let y = (input.keys[keys.down] ? 1 : 0) - (input.keys[keys.up] ? 1 : 0);
      const length = Math.hypot(x, y);
      if (length > 1) { x /= length; y /= length; }
      return { x: x, y: y, action: !!input.edges[keys.action], held: !!input.keys[keys.action], connected: true };
    }
    const pad = input.pads.find(function (pad) { return pad.index === source.index; });
    if (!pad) return { x: 0, y: 0, action: false, held: false, connected: false };
    return Object.assign(input.axis(pad.axes[0] || 0, pad.axes[1] || 0), { aimX: Math.abs(pad.axes[2] || 0) > GLOMP.config.input.deadZone ? pad.axes[2] : 0, aimY: Math.abs(pad.axes[3] || 0) > GLOMP.config.input.deadZone ? pad.axes[3] : 0, action: !!pad.edges[GLOMP.config.input.confirmButton], held: !!pad.buttons[GLOMP.config.input.confirmButton], connected: true });
  },
  joining: function () {
    const sources = [];
    GLOMP.save.data.settings.keys.forEach(function (keys, index) { if (GLOMP.input.edges[keys.action]) sources.push({ kind: 'keyboard', index: index }); });
    GLOMP.input.pads.forEach(function (pad) { if (pad.edges[GLOMP.config.input.confirmButton]) sources.push({ kind: 'gamepad', index: pad.index }); });
    return sources;
  },
};

// Módulo: src/view.js
// Dibujo mediante el renderizador incluido en GDevelop; sin otro bucle de juego.
GLOMP.view = {
  assets: {}, textures: {}, ready: false, error: false,
  attach: function (scene) {
    const view = { root: new PIXI.Container(), graphics: new PIXI.Graphics(), items: {}, scene: scene };
    view.root.eventMode = 'none'; view.root.interactiveChildren = false; view.root.sortableChildren = true; view.graphics.zIndex = 100; view.root.addChild(view.graphics);
    scene.getLayer('').getRenderer().getRendererObject().addChild(view.root);
    scene.__glompView = view;
    return view;
  },
  load: function (scene) {
    const manager = scene.getGame().getImageManager();
    GLOMP.view.ready = false; GLOMP.view.error = false;
    const fonts=scene.getGame().getFontManager();
    const fontPromise=fonts.loadResource('assets/fonts/LilitaOne-Regular.ttf').then(function(){
      GLOMP.view.fontFamily=fonts.getFontFamily('assets/fonts/LilitaOne-Regular.ttf');
      return document.fonts.load('32px "'+GLOMP.view.fontFamily+'"');
    });
    Promise.all([fontPromise].concat(Object.keys(GLOMP.art).map(function (id) {
      const asset = GLOMP.art[id];
      return manager.loadResource(asset.file).then(function () {
        const texture = manager.getPIXITexture(asset.file);
        if (!texture.valid || texture.width <= 1) throw new Error('Recurso no disponible: ' + id);
        if (asset.pixel) texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        GLOMP.view.textures[id] = asset.bounds ? new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(asset.bounds.x, asset.bounds.y, asset.bounds.width, asset.bounds.height)) : texture;
      });
    }))).then(function () { GLOMP.view.ready = true; }).catch(function (error) { GLOMP.view.error = true; console.error(GLOMP.i18n.text('assetError'),error); });
  },
  begin: function (scene) {
    const view = scene.__glompView;
    view.graphics.clear(); view.overlayZ = 0; view.panelIndex=0;
    Object.keys(view.items).forEach(function (key) { view.items[key].visible = false; });
    const game = scene.getGame(), config = GLOMP.config.ui;
    const scale = Math.min(game.getGameResolutionWidth() / config.width, game.getGameResolutionHeight() / config.height);
    view.root.scale.set(scale);
    view.root.position.set((game.getGameResolutionWidth() - config.width * scale) / 2, (game.getGameResolutionHeight() - config.height * scale) / 2);
    return view;
  },
  item: function (view, key, factory) {
    if (!view.items[key]) { view.items[key] = factory(); view.root.addChild(view.items[key]); }
    view.items[key].visible = true;
    return view.items[key];
  },
  text: function (view, key, text, x, y, size, color, options) {
    options = options || {};
    const item = GLOMP.view.item(view, 'text:' + key, function () { return new PIXI.Text('', { fontFamily: GLOMP.view.fontFamily || 'Lilita One, DejaVu Sans, sans-serif', fontWeight: '900', lineJoin: 'round' }); });
    if (item.text !== String(text)) item.text = String(text);
    item.style.fontSize = size; item.style.fill = color;
    item.style.stroke = options.stroke || GLOMP.config.ui.colors.chocolate;
    item.style.strokeThickness = options.outline || 0;
    item.style.align = options.align || 'left';
    item.style.fontWeight = options.weight || '400';
    item.style.fontFamily = options.body ? 'DejaVu Sans, sans-serif' : (GLOMP.view.fontFamily || 'Lilita One, DejaVu Sans, sans-serif');
    item.style.wordWrap = !!options.wrap; item.style.wordWrapWidth = options.wrap || GLOMP.config.ui.width;
    item.anchor.set(options.center ? 0.5 : 0, options.middle ? 0.5 : 0);
    item.zIndex = (view.overlayZ || 0) + (options.z === undefined ? 120 : options.z);
    item.position.set(x, y); item.alpha = options.alpha === undefined ? 1 : options.alpha;
    return item;
  },
  image: function (view, key, id, x, y, width, height, options) {
    if (!GLOMP.view.textures[id]) return null;
    options = options || {};
    const sprite = GLOMP.view.item(view, 'image:' + key, function () { const item = new PIXI.Sprite(); item.anchor.set(0.5); return item; });
    sprite.texture = GLOMP.view.textures[id];
    const scale = Math.min(width / sprite.texture.width, height / sprite.texture.height);
    sprite.scale.set(scale * (options.scaleX || 1), scale * (options.scaleY || 1));
    sprite.position.set(x, y); sprite.rotation = options.rotation || 0; sprite.tint = options.tint === undefined ? 0xffffff : options.tint;
    sprite.alpha = options.alpha === undefined ? 1 : options.alpha;
    sprite.zIndex = (view.overlayZ || 0) + (options.z === undefined ? (id === 'menu-village' ? 0 : 30) : options.z);
    if (options.fill) sprite.scale.set(width / sprite.texture.width, height / sprite.texture.height);
    return sprite;
  },
  panel: function(view,x,y,width,height,color,radius,alpha) {
    const key='panel:'+(view.panelIndex++);
    if(GLOMP.view.textures['ui-panel'])GLOMP.view.nine(view,key,'ui-panel',x,y,width,height,0xffffff,alpha,105);
    else view.graphics.beginFill(color,alpha===undefined?1:alpha).drawRoundedRect(x,y,width,height,radius||20).endFill();
  },
  hit: function(view,id,x,y,width,height,enabled) {
    GLOMP.ui.buttons.push({id:id,x:x+width/2,y:y+height/2,width:width,height:height,enabled:enabled!==false});
  },
  mix: function(color,target,amount) {
    const channel=function(shift){return Math.round((color>>shift&255)*(1-amount)+(target>>shift&255)*amount);};
    return channel(16)<<16|channel(8)<<8|channel(0);
  },
  surfaceTexture: function(width,height,color,focused) {
    const d=GLOMP.view;d.skinCache=d.skinCache||{};
    const key=[Math.round(width),Math.round(height),color,focused].join(':');if(d.skinCache[key])return d.skinCache[key];
    const canvas=document.createElement('canvas');canvas.width=Math.ceil(width);canvas.height=Math.ceil(height);
    const board=width>1000&&height>400;
    const g=canvas.getContext('2d'),edge=Math.max(1,Math.min(4,height/18)),radius=Math.min(height/2,width/2,36);
    const hex=function(n){return '#'+n.toString(16).padStart(6,'0');};
    const path=function(inset,offset){const x=inset,y=inset+offset,w=width-inset*2,h=height-inset*2-offset,r=Math.max(1,Math.min(radius-inset,h/2,w/2));g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();};
    path(0,0);g.fillStyle='#092B63';g.fill();
    path(edge,0);g.fillStyle=focused?'#FFE974':'#D9F7FF';g.fill();
    path(edge*1.65,0);g.fillStyle='#0D417D';g.fill();
    path(edge*2.3,0);const gradient=g.createLinearGradient(0,0,0,height);gradient.addColorStop(0,hex(d.mix(color,0xFFFFFF,board?.08:.38)));gradient.addColorStop(.38,hex(d.mix(color,0xFFFFFF,board?0:.08)));gradient.addColorStop(1,hex(d.mix(color,0x082951,.32)));g.fillStyle=gradient;g.fill();
    g.save();path(edge*2.4,0);g.clip();g.beginPath();g.ellipse(width*.47,-height*.18,width*.7,height*.63,0,0,Math.PI*2);g.fillStyle=board?'rgba(255,255,255,.025)':'rgba(255,255,255,.16)';g.fill();g.restore();
    d.skinCache[key]=PIXI.Texture.from(canvas);return d.skinCache[key];
  },
  surface: function(view,key,x,y,width,height,color,focused,z) {
    const item=GLOMP.view.item(view,'surface:'+key,function(){return new PIXI.Sprite();});
    item.texture=GLOMP.view.surfaceTexture(width,height,color,!!focused);item.position.set(x,y);item.width=width;item.height=height;
    item.zIndex=(view.overlayZ||0)+(z===undefined?150:z);item.alpha=1;return item;
  },
  button: function(view,id,label,x,y,width,color,enabled,height,icon) {
    const d=GLOMP.view,c=GLOMP.config.ui.colors,ui=GLOMP.ui;height=height||GLOMP.config.ui.buttonHeight;
    d.hit(view,id,x,y,width,height,enabled);
    const active=enabled!==false,focused=active&&ui.focus===id;
    const pressed=active&&GLOMP.input.pointerHeld===id,offset=pressed?GLOMP.config.ui.polish.pressOffset:0;
    const symbols=id==='addLeft'||id==='addRight'?'plus':id.startsWith('remove:')?'close':id.startsWith('left:')||id==='prevPlayer'||id==='pagePrev'?'left':id.startsWith('right:')||id==='nextPlayer'||id==='pageNext'?'right':null;
    if(symbols){
      const size=Math.min(width,height)-(pressed?GLOMP.config.ui.polish.pressOffset*2:0);
      const mark=GLOMP.icons.draw(view,'button:'+id,symbols,x+width/2,y+height/2+offset,size,153);if(mark)mark.alpha=active?1:.42;
      if(focused)d.graphics(view,'buttonFocus:'+id,154).lineStyle(3,0xFFE76B,.9).drawRoundedRect(x+1,y+1,width-2,height-2,Math.min(width,height)*.27).lineStyle(0);
      return;
    }
    const skin=d.surface(view,'button:'+id,x,y+offset,width,height-offset,active?color:d.mix(color,0x7788A2,.8),focused,150);
    skin.alpha=active?1:.85;
    const icons={shop:'shop',customize:'shirt',settings:'gear',credits:'credits',practice:'gamepad',play:'play',buy:'coin',equip:'check',back:'back',returnRoom:'gamepad',resume:'play',exit:'back',music:'music',effects:'sound',maxPlayers:'people',fullscreen:'fullscreen',controls:'keyboard',changeAction:'keyboard',confirmControls:'check',cancel:'close',unequip:'close'};
    icon=icon||icons[id];if(id.startsWith('key:'))icon='keyboard';
    if(id.startsWith('category:')) {
      icon={featured:'star',body:'color',face:'face',accessory:'hat',particles:'particles',trail:'trail',sets:'gift'}[id.slice(9)];
      const mark=GLOMP.icons.draw(view,'button:'+id,icon,x+width/2,y+height*.32+offset,Math.min(52,height*.54),153);if(mark)mark.alpha=active?1:.65;
      const text=d.text(view,'button:'+id,label,x+width/2,y+height*.79+offset,20,0xFFFFFF,{center:true,middle:true,z:154,outline:3,stroke:0x123B88});
      if(text.width>width-14)text.style.fontSize=Math.max(14,Math.floor(20*(width-14)/text.width));return;
    }
    const hasIcon=icon&&width>=132,iconSize=Math.min(height*.80,84),left=hasIcon?height*.94:12;
    if(hasIcon){const mark=GLOMP.icons.draw(view,'button:'+id,icon,x+height*.52,y+height/2+offset,iconSize,153);if(mark)mark.alpha=active?1:.65;}
    const font=Math.min(width<132?44:38,height*.42),available=width-left-12;
    const text=d.text(view,'button:'+id,label,x+left+available/2,y+height/2+offset,font,0xFFFFFF,{center:true,middle:true,z:154,outline:Math.min(4,height*.05),stroke:0x123B88});
    if(text.width>available)text.style.fontSize=Math.max(12,Math.floor(font*available/text.width));text.alpha=active?1:.8;
  },
  graphics: function (view,key,z) {
    const g = GLOMP.view.item(view,'graphics:' + key,function () { return new PIXI.Graphics(); });
    g.clear(); g.zIndex = (view.overlayZ || 0) + z; return g;
  },
  nine: function(view,key,id,x,y,width,height,tint,alpha,z) {
    const texture=GLOMP.view.textures[id];if(!texture)return null;
    const border=Math.min(texture.width,texture.height)*0.32;
    const item=GLOMP.view.item(view,'nine:'+key,function(){return new PIXI.NineSlicePlane(texture,border,border,border,border);});
    item.position.set(x,y);item.width=width;item.height=height;item.tint=tint===undefined?0xffffff:tint;
    item.alpha=alpha===undefined?1:alpha;item.zIndex=(view.overlayZ||0)+(z===undefined?110:z);return item;
  },
  title: function(view,key,label,x,y,size,color,options) {
    options=options||{};
    const item=GLOMP.view.item(view,'title:'+key,function(){const root=new PIXI.Container();root.inner=new PIXI.Text('');root.addChild(root.inner);return root;});
    const text=item.inner;
    text.style={fontFamily:GLOMP.view.fontFamily,fontSize:size,fontWeight:'400',lineJoin:'round',fill:color,align:'center',stroke:0x102D6D,strokeThickness:options.stroke||6,dropShadow:true,dropShadowColor:0x051B48,dropShadowDistance:2,dropShadowBlur:0,dropShadowAlpha:.7};
    text.text=String(label);text.anchor.set(.5,options.middle?.5:0);
    const fit=Math.min(1,options.maxWidth?options.maxWidth/text.width:1,options.maxHeight?options.maxHeight/text.height:1);
    if(fit<1)text.style.fontSize=Math.max(12,Math.floor(size*fit));
    item.position.set(x,y);item.scale.set(options.scale||1);item.rotation=0;item.alpha=options.alpha===undefined?1:options.alpha;
    item.zIndex=(view.overlayZ||0)+(options.z===undefined?122:options.z);return item;
  },
  heading: function(view,key,label,x,y,width,size) {
    const ribbon=GLOMP.view.image(view,'ribbon:'+key,'ui-ribbon',x,y+size*.65,width,size*2.7,{fill:true,z:111});
    const height=ribbon?ribbon.height:size*2.7;
    return GLOMP.view.title(view,key,label,x,y+size*.65,size,0xFFFFFF,{z:112,middle:true,stroke:6,maxWidth:(ribbon?ribbon.width:width)*.72,maxHeight:height*.48});
  },
  slime: function(view,key,x,y,size,bodyIndex,faceIndex,sx,sy,alpha,z,player,equipment) {
    return GLOMP.rig.draw(view,key,x,y,size,bodyIndex,faceIndex,alpha,z,player,equipment);
  },
};

// Módulo: src/icons.js
// Iconos generados individualmente. La geometría de estrella solo se usa como decoración.
GLOMP.icons = {
  star: function(g,x,y,outer,inner,points) {
    const coordinates=[];
    for(let i=0;i<points*2;i++){const a=-Math.PI/2+i*Math.PI/points,r=i%2?inner:outer;coordinates.push(x+Math.cos(a)*r,y+Math.sin(a)*r);}
    g.drawPolygon(coordinates);
  },
  draw: function(view,key,type,x,y,size,z) {
    return GLOMP.view.image(view,'icon:'+key,GLOMP.config.ui.icons[type],x,y,size,size,{z:z===undefined?153:z});
  },
};

// Módulo: src/rig.js
// Un cuerpo de gelatina y una cara cartoon articulada; el color nunca toca ojos ni sonrisa.
GLOMP.rig = {
  pose: function(player,time,faceIndex) {
    const c=GLOMP.config.animation,speed=player?Math.min(1,Math.hypot(player.vx,player.vy)/(player.speed||1)):0;
    const vx=player?player.vx/(player.speed||1):0,vy=player?player.vy/(player.speed||1):0;
    const phase=time*c.moveRate+(player?player.playerId:faceIndex||0),breath=Math.sin(time*c.idleRate)*c.idleAmount;
    const bounce=Math.sin(phase)*c.moveBounce*speed;
    const gulp=player?Math.sin(player.gulp/GLOMP.config.physics.gulpSeconds*Math.PI)*(GLOMP.config.physics.gulpScale-1):0;
    const blinkTime=(time+(player?player.playerId:faceIndex||0))%c.blinkPeriod;
    const blink=blinkTime<c.blinkSeconds?Math.max(0.08,Math.abs(blinkTime/c.blinkSeconds*2-1)):1;
    let mouth=player?.expression&&player.expression!=='smile'?player.expression:GLOMP.config.art.faces[faceIndex||0];
    if(player?.gulp>0)mouth='gasp';else if(player?.gesture>0)mouth='grit';
    return {vx:vx,vy:vy,speed:speed,breath:breath,bounce:bounce,gulp:gulp,blink:blink,mouth:mouth};
  },
  vertex: function(u,v,pose) {
    const c=GLOMP.config.animation,top=1-v,stretch=pose.breath+pose.bounce+pose.gulp;
    return {x:(u-0.5)*(1-stretch*0.55)+pose.vx*c.lean*top*top,
      y:(v-0.5)*(1+stretch)-Math.abs(pose.bounce)*top+pose.vy*c.lean*top*top};
  },
  face: function(parts,size,pose,faceIndex) {
    const c=GLOMP.config.animation,ink=0x101F48;
    const anchor=GLOMP.rig.vertex(.5,.52,pose),faceX=(anchor.x-pose.vx*c.faceLag)*size;
    const faceY=(pose.bounce+pose.vy*c.faceLag)*size,gazeX=pose.vx*c.eyeGaze*size,gazeY=pose.vy*c.eyeGaze*size;
    const happy=pose.mouth==='cheer',sleepy=faceIndex===4,wink=faceIndex===5;
    const cheeks=parts.cheeks;cheeks.clear().beginFill(0xFF9AA9,.6).drawEllipse(faceX-size*.235,faceY+size*.09,size*.045,size*.025).drawEllipse(faceX+size*.235,faceY+size*.09,size*.045,size*.025).endFill();
    [parts.left,parts.right].forEach(function(eye,index){
      const width=size*c.eyeWidth,height=size*c.eyeHeight*(sleepy?.65:1),closed=happy||(wink&&index===1);
      eye.clear();eye.position.set(faceX+(index?1:-1)*size*c.eyeGap+gazeX,faceY+size*c.eyesY+gazeY);
      if(closed)eye.lineStyle({width:size*.017,color:ink,cap:'round'}).moveTo(-width*.55,height*.1).quadraticCurveTo(0,-height*.55,width*.55,height*.1).lineStyle(0);
      else {
        eye.beginFill(ink).drawEllipse(0,0,width/2,height*pose.blink/2).endFill();
        if(pose.blink>.3)eye.beginFill(0xFFFFFF).drawCircle(-width*.17,-height*.21,width*.14).endFill();
      }
    });
    const mouth=parts.mouth,w=size*c.mouthWidth,h=size*c.mouthHeight*(happy?1.15:1);
    mouth.clear();mouth.position.set(faceX+gazeX*.4,faceY+size*c.mouthY);
    if(pose.mouth==='grit')mouth.lineStyle({width:size*.012,color:ink,cap:'round'}).moveTo(-w*.42,-h*.05).quadraticCurveTo(-w*.2,h*.25,0,0).quadraticCurveTo(w*.2,h*.25,w*.42,-h*.05).lineStyle(0);
    else if(pose.mouth==='gasp')mouth.beginFill(0x41203D).drawEllipse(0,0,w*.30,h*.53).endFill().beginFill(0xFF82A5).drawEllipse(0,h*.24,w*.17,h*.16).endFill();
    else {
      mouth.beginFill(0x4C203C).moveTo(-w/2,-h*.38).quadraticCurveTo(0,-h*.06,w/2,-h*.38).bezierCurveTo(w*.44,h*.50,-w*.44,h*.50,-w/2,-h*.38).endFill();
      mouth.beginFill(0xFF7DA1).drawEllipse(0,h*.17,w*.27,h*.19).endFill();
    }
    parts.brows.clear();
    if(pose.mouth==='grit')[-1,1].forEach(function(side){
      const bx=faceX+side*size*c.eyeGap;parts.brows.lineStyle({width:size*.012,color:ink,cap:'round'}).moveTo(bx-side*size*.045,faceY-size*.09).lineTo(bx+side*size*.045,faceY-size*.13).lineStyle(0);
    });
  },
  draw: function(view,key,x,y,size,bodyIndex,faceIndex,alpha,z,player,equipment) {
    const d=GLOMP.view,c=GLOMP.config.animation,texture=d.textures[GLOMP.config.art.bodyAsset]||d.textures['slime-base-chatgpt-v1'];
    if(!texture)return null;
    const root=d.item(view,'rig:'+key,function(){
      const container=new PIXI.Container(),body=new PIXI.SimplePlane(texture,c.meshColumns,c.meshRows);
      const left=new PIXI.Graphics(),right=new PIXI.Graphics(),mouth=new PIXI.Graphics(),brows=new PIXI.Graphics(),cheeks=new PIXI.Graphics();
      const sparkles=new PIXI.Container(),hat=new PIXI.Sprite();hat.anchor.set(.5,.8);
      const color=GLOMP.config.ui.cartoon;
      const filter=new PIXI.Filter(undefined,'varying vec2 vTextureCoord; uniform sampler2D uSampler; uniform vec3 bodyColor; uniform float highlightStart; uniform float highlightEnd; uniform float gloss; uniform float bodyShading; void main(void){vec4 p=texture2D(uSampler,vTextureCoord);vec3 rgb=p.rgb/max(p.a,0.001);float l=dot(rgb,vec3(0.2126,0.7152,0.0722));float shine=smoothstep(highlightStart,highlightEnd,l)*gloss;vec3 shaded=bodyColor*(bodyShading+(1.0-bodyShading)*l);vec3 outColor=mix(shaded,vec3(1.0),shine);gl_FragColor=vec4(outColor*p.a,p.a);}',{bodyColor:[1,1,1],highlightStart:color.highlightStart,highlightEnd:color.highlightEnd,gloss:color.gloss,bodyShading:color.bodyShading});
      body.filters=[filter];
      container.addChild(sparkles,body,cheeks,left,right,mouth,brows,hat);container.parts={body:body,left:left,right:right,mouth:mouth,brows:brows,cheeks:cheeks,hat:hat,sparkles:sparkles,filter:filter};return container;
    });
    const time=player?player.animationTime:GLOMP.ui.elapsed,pose=GLOMP.rig.pose(player,time,faceIndex);
    const p=root.parts,height=size*c.bodyAspect;
    root.position.set(x,y);root.zIndex=(view.overlayZ||0)+(z===undefined?110:z);root.alpha=alpha===undefined?1:alpha;
    const color=bodyIndex===-1?GLOMP.config.art.botColor:GLOMP.config.art.bodyColors[bodyIndex]===undefined?GLOMP.config.art.bodyColors[0]:GLOMP.config.art.bodyColors[bodyIndex];
    p.body.tint=0xFFFFFF;p.filter.uniforms.bodyColor=[(color>>16&255)/255,(color>>8&255)/255,(color&255)/255];
    const buffer=p.body.geometry.getBuffer('aVertexPosition'),vertices=buffer.data;
    for(let row=0;row<c.meshRows;row++)for(let col=0;col<c.meshColumns;col++) {
      const offset=(row*c.meshColumns+col)*2,point=GLOMP.rig.vertex(col/(c.meshColumns-1),row/(c.meshRows-1),pose);
      vertices[offset]=point.x*size;vertices[offset+1]=point.y*height;
    }
    buffer.update();GLOMP.rig.face(p,size,pose,faceIndex);
    const gear=equipment||player||{},cos=c.cosmetics;
    p.hat.visible=!!(gear.accessory&&d.textures[gear.accessory]);
    if(p.hat.visible) {
      p.hat.texture=d.textures[gear.accessory];p.hat.anchor.set(.5,.8);
      const scale=Math.min(size*cos.hatWidth/p.hat.texture.width,size*cos.hatHeight/p.hat.texture.height);
      p.hat.scale.set(scale);const mount=GLOMP.rig.vertex(.5,.08,pose);p.hat.position.set(mount.x*size,mount.y*height);
      p.hat.rotation=pose.vx*c.lean;p.hat.tint=0xFFFFFF;
    }
    while(p.sparkles.children.length<cos.particleCount){const star=new PIXI.Sprite();star.anchor.set(.5);p.sparkles.addChild(star);}
    p.sparkles.children.forEach(function(star,index){
      star.visible=!!(gear.particles&&d.textures[gear.particles]);
      if(star.visible){star.texture=d.textures[gear.particles];const angle=time*cos.orbitRate+index/cos.particleCount*Math.PI*2;star.position.set(Math.cos(angle)*size*cos.particleRadius,Math.sin(angle)*height*cos.particleRadius);star.width=size*cos.particleSize;star.height=size*cos.particleSize;star.alpha=.5+Math.sin(angle)*.3;star.rotation=angle;}
    });
    root.pose=pose;return root;
  },
};

// Módulo: src/player.js
// Simulación de círculos independiente de GDevelop y del aspecto equipado.
GLOMP.player = {
  create: function (playerId, source, x, y) {
    const equipment = GLOMP.save.equipment(playerId);
    return {
      playerId: playerId, source: source, x: x, y: y, vx: 0, vy: 0,
      bodyColor: equipment.body, face: equipment.face, accessory: equipment.accessory, particles: equipment.particles, trail: equipment.trail, trailPoints: [], trailElapsed: 0,
      slices: 0, mass: 0, scale: 1, visualScale: 1, health: GLOMP.config.player.initialHealth,
      ammo: [], actionCooldown: 0, state: 'normal', alive: true, gulp: 0,
      knockX: 0, knockY: 0, facingX: 1, facingY: 0, animationTime: 0, expression: 'smile', stretch: 1, stretchVelocity: 0, brake: 0, previousSpeed: 0, bot: false,
    };
  },
  refresh: function (player) {
    const config = GLOMP.config.player;
    player.scale = Math.min(config.maxScale, 1 + config.scalePerMass * player.mass);
    player.speed = config.baseSpeed * (1 - config.speedPenalty * (player.scale - 1));
    player.radius = GLOMP.config.physics.baseRadius * player.scale;
  },
  step: function (player, control, dt, arena) {
    if (!player.alive) return;
    const config = GLOMP.config.physics;
    GLOMP.player.refresh(player);
    const multiplier = player.speedMultiplier === undefined ? 1 : player.speedMultiplier;
    let targetX = control.x * player.speed * multiplier, targetY = control.y * player.speed * multiplier;
    if (player.state === 'stunned' || player.state === 'stuck') { targetX = 0; targetY = 0; }
    const before = Math.hypot(player.vx, player.vy);
    const changing = targetX * player.vx + targetY * player.vy < 0;
    if (changing && before > 0) {
      const length = Math.hypot(targetX, targetY);
      if (length) {
        const nx = targetX / length, ny = targetY / length;
        const along = player.vx * nx + player.vy * ny;
        player.vx = along * nx + (player.vx - along * nx) * config.lateralRetention;
        player.vy = along * ny + (player.vy - along * ny) * config.lateralRetention;
      }
    }
    const dx = targetX - player.vx, dy = targetY - player.vy;
    const difference = Math.hypot(dx, dy), acceleration = (targetX || targetY) ? config.acceleration : config.friction;
    const fraction = difference ? Math.min(1, acceleration * dt / difference) : 0;
    player.vx += dx * fraction; player.vy += dy * fraction;
    const heading = Math.hypot(control.x || 0, control.y || 0);
    if (heading) { player.facingX = control.x / heading; player.facingY = control.y / heading; }
    player.animationTime += dt;
    const visual=GLOMP.config.animation.cosmetics;
    player.trailPoints.forEach(function(point){point.life-=dt;});player.trailPoints=player.trailPoints.filter(function(point){return point.life>0;});
    player.trailElapsed+=dt;
    if(player.trail&&player.trailElapsed>=visual.trailInterval&&before>visual.trailMinSpeed) {
      player.trailElapsed%=visual.trailInterval;player.trailPoints.push({x:player.x,y:player.y,life:visual.trailSeconds});
      if(player.trailPoints.length>visual.trailMax)player.trailPoints.shift();
    }
    player.x += (player.vx + player.knockX) * dt; player.y += (player.vy + player.knockY) * dt;
    const drag = Math.exp(-config.knockbackDrag * dt);
    player.knockX *= drag; player.knockY *= drag;
    GLOMP.player.resolveBounds(player, arena);
    arena.obstacles.forEach(function (rectangle) { GLOMP.player.resolveRectangle(player, rectangle); });
    (arena.circles || []).forEach(function (circle) { GLOMP.player.resolveCircle(player, circle); });
    const speed = Math.hypot(player.vx, player.vy);
    if (before > 0 && speed === 0) player.brake = config.brakeSeconds;
    player.brake = Math.max(0, player.brake - dt);
    const directional = player.speed ? (Math.abs(player.vx) - Math.abs(player.vy)) / player.speed : 0;
    const targetStretch = player.brake ? config.brakeSquash : 1 + config.stretchAmount * directional;
    player.stretchVelocity += ((targetStretch - player.stretch) * config.springK - player.stretchVelocity * config.springC) * dt;
    player.stretch += player.stretchVelocity * dt;
    player.visualScale += (player.scale - player.visualScale) * (1 - Math.exp(-config.growLerp * dt));
    player.gulp = Math.max(0, player.gulp - dt);
    player.gesture = Math.max(0,(player.gesture || 0)-dt);
    player.actionCooldown = Math.max(0, player.actionCooldown - dt);
    player.previousSpeed = speed;
  },
  resolveBounds: function (player, arena) {
    if (arena.unbounded) return;
    const margin = (arena.wall === undefined ? GLOMP.config.sandbox.wallPadding : arena.wall) + player.radius;
    const width = arena.width || arena.size, height = arena.height || arena.size;
    if (player.x < margin) { player.x = margin; player.vx = Math.max(0, player.vx); }
    if (player.x > width - margin) { player.x = width - margin; player.vx = Math.min(0, player.vx); }
    if (player.y < margin) { player.y = margin; player.vy = Math.max(0, player.vy); }
    if (player.y > height - margin) { player.y = height - margin; player.vy = Math.min(0, player.vy); }
  },
  resolveRectangle: function (player, rectangle) {
    const x = Math.max(rectangle.x, Math.min(rectangle.x + rectangle.width, player.x));
    const y = Math.max(rectangle.y, Math.min(rectangle.y + rectangle.height, player.y));
    const dx = player.x - x, dy = player.y - y, distance = Math.hypot(dx, dy);
    if (distance >= player.radius) return;
    let nx, ny, penetration;
    if (distance) { nx = dx / distance; ny = dy / distance; penetration = player.radius - distance; }
    else {
      const sides = [
        { distance: player.x - rectangle.x, nx: -1, ny: 0 },
        { distance: rectangle.x + rectangle.width - player.x, nx: 1, ny: 0 },
        { distance: player.y - rectangle.y, nx: 0, ny: -1 },
        { distance: rectangle.y + rectangle.height - player.y, nx: 0, ny: 1 },
      ].sort(function (a, b) { return a.distance - b.distance; });
      nx = sides[0].nx; ny = sides[0].ny; penetration = sides[0].distance + player.radius;
    }
    player.x += nx * penetration; player.y += ny * penetration;
    const normalVelocity = player.vx * nx + player.vy * ny;
    if (normalVelocity < 0) { player.vx -= normalVelocity * nx; player.vy -= normalVelocity * ny; }
  },
  impulse: function (player, x, y, strength) {
    const length = Math.hypot(x,y) || 1;
    player.knockX += x / length * strength; player.knockY += y / length * strength;
  },
  resolveCircle: function (player, circle) {
    const dx = player.x-circle.x, dy = player.y-circle.y, distance = Math.hypot(dx,dy);
    const overlap = player.radius + circle.radius - distance;
    if (overlap > 0) { const nx = distance ? dx/distance : 1, ny = distance ? dy/distance : 0; player.x += nx*overlap; player.y += ny*overlap; }
  },
  separate: function (players, arena) {
    for (let i = 0; i < players.length; i++) for (let j = i + 1; j < players.length; j++) {
      const a = players[i], b = players[j];
      if (!a.alive || !b.alive) continue;
      const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy);
      const overlap = a.radius + b.radius - distance;
      if (overlap <= 0) continue;
      const nx = distance ? dx / distance : 1, ny = distance ? dy / distance : 0;
      const correction = overlap * GLOMP.config.physics.separationDamping;
      const aShare = b.scale / (a.scale + b.scale), bShare = 1 - aShare;
      a.x -= nx * correction * aShare; a.y -= ny * correction * aShare;
      b.x += nx * correction * bShare; b.y += ny * correction * bShare;
      GLOMP.player.resolveBounds(a, arena); GLOMP.player.resolveBounds(b, arena);
      [a,b].forEach(function(p){ arena.obstacles.forEach(function(r){GLOMP.player.resolveRectangle(p,r);}); (arena.circles || []).forEach(function(r){GLOMP.player.resolveCircle(p,r);}); });
    }
  },
  eat: function (player, mass) {
    player.mass += mass; player.gulp = GLOMP.config.physics.gulpSeconds;
    GLOMP.player.refresh(player);
  },
};

// Módulo: src/food.js
// Una tabla común y un único tipo de entidad, diferenciado por type.
GLOMP.food = {
  random: function (world) {
    let state = world.rng >>> 0; state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    world.rng = state >>> 0; return world.rng / 4294967296;
  },
  spawn: function (world, type) {
    const config = GLOMP.config.sandbox;
    if (world.food.length >= (world.maxFood || config.maxFood)) return false;
    for (let attempt = 0; attempt < config.spawnAttempts; attempt++) {
      const x = config.spawnPadding + GLOMP.food.random(world) * ((world.width || world.size) - config.spawnPadding * 2);
      const y = config.spawnPadding + GLOMP.food.random(world) * ((world.height || world.size) - config.spawnPadding * 2);
      if (world.food.some(function (food) { return Math.hypot(food.x - x, food.y - y) < (world.foodSpacing || config.foodSpacing); })) continue;
      if (GLOMP.maps && !GLOMP.maps.pickupFree(world,x,y,GLOMP.config.physics.foodRadius)) continue;
      world.food.push({ id: world.nextFoodId++, type: type, x: x, y: y }); return true;
    }
    return false;
  },
  collect: function (world) {
    const remaining = [];
    world.food.forEach(function (food) {
      let winner = null, closest = Infinity;
      world.players.forEach(function (player) {
        if (!player.alive) return;
        const distance = Math.hypot(food.x - player.x, food.y - player.y);
        if (distance > player.radius + GLOMP.config.physics.foodRadius) return;
        if (distance < closest || (distance === closest && winner && player.playerId < winner.playerId)) { winner = player; closest = distance; }
      });
      if (!winner) { remaining.push(food); return; }
      GLOMP.player.eat(winner, GLOMP.config.food[food.type].mass || 0);
      for (let index = 0; index < GLOMP.config.physics.gulpParticles; index++) {
        const angle = index * Math.PI * 2 / GLOMP.config.physics.gulpParticles;
        world.particles.push({ x: food.x, y: food.y, vx: Math.cos(angle) * GLOMP.config.sandbox.particleSpeed, vy: Math.sin(angle) * GLOMP.config.sandbox.particleSpeed, life: GLOMP.config.sandbox.particleSeconds });
      }
    });
    world.food = remaining;
  },
};

// Módulo: src/maps.js
// Escenarios panorámicos por piezas y colisiones definidas con sus huellas normalizadas.
GLOMP.maps = {
  create: function (participants, theme, seed) {
    const c = GLOMP.config.arena, lava = theme === 'lava';
    const world = { width: lava ? c.lavaWidth : c.width, height: lava ? c.lavaHeight : c.height,
      size: lava ? c.lavaWidth : c.width, wall: c.wall, unbounded: lava,
      theme: theme, players: [], obstacles: [], circles: [], bushes: [], food: [], particles: [], bombs: [], puddles: [],
      elapsed: 0, accumulator: 0, foodElapsed: 0, rng: seed || GLOMP.config.sandbox.testSeed, nextFoodId: 0,
      foodSpacing: GLOMP.config.round.foodSpacing, over: false, notice: '', mode: '', eliminated: 0 };
    const layout = c.layouts[theme];
    layout.obstacles.forEach(function (r,index) { world.obstacles.push({id:index,x:r[0]*world.width,y:r[1]*world.height,width:r[2]*world.width,height:r[3]*world.height}); });
    layout.circles.forEach(function (r) { world.circles.push({x:r[0]*world.width,y:r[1]*world.height,radius:r[2]*world.width}); });
    layout.bushes.forEach(function (r,index) { world.bushes.push({id:index,x:r[0]*world.width,y:r[1]*world.height,width:r[2]*world.width,height:r[3]*world.height}); });
    participants.forEach(function (participant, index) {
      const point = c.spawns[index], player = GLOMP.player.create(index, participant.source, point[0] * world.width, point[1] * world.height);
      player.bodyColor = 'body' + (participant.color === undefined ? index % GLOMP.config.art.bodyColors.length : participant.color);
      player.stats = { eaten: 0, devoured: 0, deaths: 0, dodged: 0, orders: 0, feasts: 0, passes: 0, pushes: 0, shields: 0 };
      player.immune = 0; player.respawn = 0; player.dash = 0; player.boost = 0; player.safe = false;
      GLOMP.player.refresh(player); world.players.push(player);
      GLOMP.maps.place(world,player,point[0]*world.width,point[1]*world.height);
    });
    return world;
  },
  free: function (world, x, y, radius) {
    if (x < world.wall + radius || x > world.width - world.wall - radius || y < world.wall + radius || y > world.height - world.wall - radius) return false;
    if ((world.circles || []).some(function(c){return Math.hypot(x-c.x,y-c.y)<radius+c.radius;})) return false;
    return !world.obstacles.some(function (r) { return x + radius > r.x && x - radius < r.x + r.width && y + radius > r.y && y - radius < r.y + r.height; });
  },
  pickupFree: function(world,x,y,radius) {
    if(!GLOMP.maps.free(world,x,y,radius))return false;
    const ratio=GLOMP.config.arena.propHeights[world.theme]||1,art=GLOMP.config.arena.centerArt;
    if((world.circles||[]).some(function(c){const width=c.radius*art.width,height=width*art.ratios[world.theme],bottom=c.y+c.radius*art.bottom;return x+radius>c.x-width/2&&x-radius<c.x+width/2&&y+radius>bottom-height&&y-radius<bottom;}))return false;
    return !world.obstacles.some(function(r){const overhang=Math.max(0,r.width*ratio-r.height);return x+radius>r.x&&x-radius<r.x+r.width&&y+radius>r.y-overhang&&y-radius<r.y+r.height;});
  },
  respawn: function (world, player) {
    const points = GLOMP.config.arena.spawns;
    const p = points[Math.floor(GLOMP.food.random(world)*points.length)];
    GLOMP.maps.place(world,player,p[0]*world.width,p[1]*world.height);
    player.vx = 0; player.vy = 0; player.trailPoints=[];player.knockX = 0; player.knockY = 0; player.alive = true;
  },
  place: function(world,player,x,y) {
    const step = GLOMP.config.sandbox.obstacleGrid;
    for(let ring=0;ring<Math.ceil(Math.max(world.width,world.height)/step);ring++) {
      const count = Math.max(1,Math.ceil(Math.PI*2*ring));
      for(let i=0;i<count;i++) {
        const a=i/count*Math.PI*2,px=x+Math.cos(a)*ring*step,py=y+Math.sin(a)*ring*step;
        if(GLOMP.maps.free(world,px,py,player.radius)&&!world.players.some(function(q){return q!==player&&q.alive&&Math.hypot(q.x-px,q.y-py)<q.radius+player.radius;})) {player.x=px;player.y=py;return;}
      }
    }
    throw new Error('El mapa no tiene un punto libre para reaparecer.');
  },
  eliminate: function (world, player) {
    if (!player.alive) return;
    player.alive = false; player.trailPoints=[]; player.eliminatedAt = world.elapsed; player.stats.deaths++; world.eliminated++;
  },
  alive: function (world) { return world.players.filter(function (p) { return p.alive && !p.npc; }); },
  drop: function (world, player, amount) {
    const count = Math.min(GLOMP.config.round.maxDrops, Math.floor(amount));
    for (let i = 0; i < count && world.food.length < GLOMP.config.sandbox.maxFood; i++) {
      const angle = GLOMP.food.random(world) * Math.PI * 2, radius = player.radius + GLOMP.config.physics.foodRadius;
      const x = player.x + Math.cos(angle) * radius, y = player.y + Math.sin(angle) * radius;
      if (GLOMP.maps.free(world, x, y, GLOMP.config.physics.foodRadius)) world.food.push({ id: world.nextFoodId++, type: 'bite', x: x, y: y, blockedPlayerId: player.playerId, collectAfter: world.elapsed + GLOMP.config.round.dropOwnerGraceSeconds });
    }
  },
  move: function (world, dt, controls) {
    world.players.forEach(function (player, index) {
      player.immune = Math.max(0, player.immune - dt); player.boost = Math.max(0, player.boost - dt);
      const control = controls[index] || { connected: false };
      player.bot = player.npc || !control.connected;
      let chosen = control;
      if (player.bot) {
        // El mando desconectado conserva su plaza y sus puntos; el bot gris es solo sustituto.
        const angle = Math.floor(world.elapsed / GLOMP.config.round.botSteerSeconds) + index;
        chosen = { x: Math.cos(angle), y: Math.sin(angle) };
      }
      if(!player.alive)player.trailPoints=[];
      GLOMP.player.step(player, chosen, dt, world);
    });
  },
  nearest: function (world, food, predicate) {
    let winner = null, distance = Infinity;
    world.players.forEach(function (p) {
      if (!p.alive || (food.blockedPlayerId === p.playerId && world.elapsed < food.collectAfter) || (predicate && !predicate(p))) return;
      const d = Math.hypot(p.x - food.x, p.y - food.y);
      if (d <= p.radius + GLOMP.config.physics.foodRadius && (d < distance || (d === distance && p.playerId < winner.playerId))) { winner = p; distance = d; }
    });
    return winner;
  },
};

// Módulo: src/camera.js
// Cámara compartida: encuadra exclusivamente a los humanos vivos, con margen para el HUD.
GLOMP.camera = {
  target: function(w) {
    const c=GLOMP.config.camera,u=GLOMP.config.ui;
    const players=GLOMP.maps.alive(w);
    if(!players.length)return {cx:w.width/2,cy:w.height/2,scale:Math.min(u.width/w.width,u.height/w.height)};
    const minX=Math.min.apply(null,players.map(function(p){return p.x-p.radius;})),maxX=Math.max.apply(null,players.map(function(p){return p.x+p.radius;}));
    const minY=Math.min.apply(null,players.map(function(p){return p.y-p.radius;})),maxY=Math.max.apply(null,players.map(function(p){return p.y+p.radius;}));
    const fit=Math.min(u.width/w.width,u.height/w.height);
    const scale=Math.max(fit,Math.min(w.mode==='war'?GLOMP.config.minigames.war.cameraMaxScale:c.maxScale,(u.width-c.paddingX*2)/(maxX-minX||1),(u.height-c.paddingTop-c.paddingBottom)/(maxY-minY||1)));
    return {cx:(minX+maxX)/2,cy:(minY+maxY)/2,scale:scale};
  },
  update: function(w,dt) {
    const c=GLOMP.config.camera,target=GLOMP.camera.target(w);
    if(!w.camera){w.camera=Object.assign({},target);return;}
    const a=1-Math.exp(-c.followRate*dt),z=1-Math.exp(-c.zoomRate*dt);
    w.camera.cx+=(target.cx-w.camera.cx)*a;w.camera.cy+=(target.cy-w.camera.cy)*a;
    w.camera.scale=Math.min(target.scale,w.camera.scale+(target.scale-w.camera.scale)*z);
    // La suavidad nunca puede sacar del encuadre a un jugador recién separado del grupo.
    const u=GLOMP.config.ui,players=GLOMP.maps.alive(w);
    players.forEach(function(p){
      const halfX=(u.width/2-c.paddingX)/w.camera.scale,halfY=(u.height-c.paddingTop-c.paddingBottom)/2/w.camera.scale;
      w.camera.cx=Math.max(p.x+p.radius-halfX,Math.min(p.x-p.radius+halfX,w.camera.cx));
      w.camera.cy=Math.max(p.y+p.radius-halfY,Math.min(p.y-p.radius+halfY,w.camera.cy));
    });
  },
  get: function(m) {
    const w=m.world,u=GLOMP.config.ui,c=GLOMP.config.camera;
    const fit=Math.min(u.width/w.width,u.height/w.height);
    if(m.phase==='intro') {
      const t=Math.min(1,m.phaseElapsed/GLOMP.config.round.cinematicSeconds),ease=t*t*(3-2*t);
      const scale=fit*(c.introZoom+(1-c.introZoom)*ease);
      return GLOMP.camera.limit({scale:scale,x:(u.width-w.width*scale)/2+Math.sin(t*Math.PI*2)*u.width*c.introPan*(1-t),y:(u.height-w.height*scale)/2},w);
    }
    const camera=w.camera||GLOMP.camera.target(w),scale=camera.scale;
    const target={scale:scale,x:u.width/2-camera.cx*scale,y:(u.height+c.paddingTop-c.paddingBottom)/2-camera.cy*scale};
    if(m.phase==='countdown') {
      const t=Math.min(1,m.phaseElapsed/GLOMP.config.round.countdownSeconds),a=t*t*(3-2*t);
      return GLOMP.camera.limit({scale:fit+(scale-fit)*a,x:(u.width-w.width*fit)/2*(1-a)+target.x*a,y:(u.height-w.height*fit)/2*(1-a)+target.y*a},w);
    }
    return GLOMP.camera.limit(target,w);
  },
  limit: function(frame,w) {
    const u=GLOMP.config.ui,scale=frame.scale;
    frame.x=w.width*scale>=u.width?Math.max(u.width-w.width*scale,Math.min(0,frame.x)):(u.width-w.width*scale)/2;
    frame.y=w.height*scale>=u.height?Math.max(u.height-w.height*scale,Math.min(0,frame.y)):(u.height-w.height*scale)/2;
    return frame;
  },
};

// Módulo: src/minigames/eat_em.js
// Crecimiento, cobertura acumulada, reaparición y Salsa; nunca elimina por masa cero.
GLOMP.minigames = GLOMP.minigames || {};
GLOMP.minigames.eatEm = {
  start: function (w) {
    const c = GLOMP.config.minigames.eatEm;
    w.cover = {}; w.botElapsed = 0;
    w.players.forEach(function (p) { p.immune = c.spawnImmunity; });
    for (let i = 0; i < c.botCount; i++) GLOMP.minigames.eatEm.addBot(w);
    for (let i = 0; i < GLOMP.config.round.initialFood; i++) GLOMP.food.spawn(w, 'bite');
  },
  addBot: function (w) {
    const c = GLOMP.config.minigames.eatEm, id = w.players.length;
    const p = GLOMP.player.create(id, { kind: 'npc', index: id }, w.width / 2, w.height / 2);
    p.npc = true; p.bot = true; p.mass = c.botMass; p.stats = { eaten: 0, devoured: 0, deaths: 0 }; p.immune = c.botRespawnImmunity; p.boost = 0; p.dash = 0;
    GLOMP.player.refresh(p); GLOMP.maps.respawn(w, p); w.players.push(p);
  },
  step: function (w, dt, controls) {
    const mode = GLOMP.minigames.eatEm, c = GLOMP.config.minigames.eatEm;
    w.sauce = w.elapsed < c.sauceStart ? 0 : Math.min(c.maxSauceFraction, c.sauceStep * (1 + Math.floor((w.elapsed - c.sauceStart) / c.sauceInterval)));
    w.players.forEach(function (p, index) {
      if (!p.alive) {
        if (!p.npc) { p.respawn -= dt; if (p.respawn <= 0) { p.mass = Math.max(c.minRespawnMass, p.mass * c.respawnMassRatio); GLOMP.player.refresh(p); GLOMP.maps.respawn(w, p); p.immune = c.spawnImmunity; } }
        return;
      }
      const control = controls[index] || {};
      if (control.action && p.mass >= c.dashMassCost && p.actionCooldown <= 0) { p.mass -= c.dashMassCost; p.dash = c.dashSeconds; p.actionCooldown = c.dashCooldown; GLOMP.maps.drop(w, p, c.dashMassCost); }
      p.dash = Math.max(0, (p.dash || 0) - dt);
      const inSauce = p.x < w.width * w.sauce || p.x > w.width * (1 - w.sauce) || p.y < w.height * w.sauce || p.y > w.height * (1 - w.sauce);
      p.speedMultiplier = (p.dash > 0 ? 1 + c.dashSpeedBoost : 1) * (inSauce ? c.sauceSpeedMultiplier : 1);
      if (inSauce) p.mass = Math.max(0, p.mass - c.sauceMassPerSecond * dt);
    });
    GLOMP.maps.move(w, dt, controls);
    const remaining = [];
    w.food.forEach(function (food) { const p = GLOMP.maps.nearest(w, food); if (p) { GLOMP.player.eat(p, GLOMP.config.food[food.type].mass || 0); p.stats.eaten++; } else remaining.push(food); });
    w.food = remaining;
    const covers = {};
    w.players.forEach(function (prey) {
      if (!prey.alive || prey.immune > 0) return;
      const eligible = w.players.filter(function (predator) { return predator !== prey && predator.alive && predator.scale >= prey.scale * c.eatScaleRatio && Math.hypot(predator.x - prey.x, predator.y - prey.y) + prey.radius <= predator.radius; });
      // Conserva al primer atacante que consiguió cubrirlo; el empate inicial se resuelve por id.
      eligible.sort(function (a, b) { return (w.cover[prey.playerId + ':' + b.playerId] || 0) - (w.cover[prey.playerId + ':' + a.playerId] || 0) || a.playerId - b.playerId; });
      if (!eligible.length) return;
      const predator = eligible[0], key = prey.playerId + ':' + predator.playerId;
      covers[key] = (w.cover[key] || 0) + dt;
      if (covers[key] >= c.coverSeconds) {
        GLOMP.player.eat(predator, prey.mass * c.absorbedMassRatio); predator.stats.devoured++;
        GLOMP.maps.drop(w, prey, prey.mass * c.droppedMassRatio);
        prey.alive = false; prey.respawn = c.respawnSeconds; prey.stats.deaths++; delete covers[key];
      }
    });
    w.cover = covers;
    // Solo se separan tamaños que no pueden devorarse; separar todos impediría cubrir a la presa.
    for (let i = 0; i < w.players.length; i++) for (let j = i + 1; j < w.players.length; j++) {
      const a = w.players[i], b = w.players[j];
      if (Math.max(a.scale, b.scale) < Math.min(a.scale, b.scale) * c.eatScaleRatio) GLOMP.player.separate([a,b], w);
    }
    w.botElapsed += dt;
    if (w.botElapsed >= c.botRespawnSeconds) {
      w.botElapsed %= c.botRespawnSeconds;
      const dead = w.players.filter(function (p) { return p.npc && !p.alive; });
      dead.forEach(function (p) { p.mass = c.botMass; GLOMP.player.refresh(p); GLOMP.maps.respawn(w, p); p.immune = c.botRespawnImmunity; });
    }
    w.foodElapsed += dt;
    while (w.foodElapsed >= GLOMP.config.round.foodInterval) { w.foodElapsed -= GLOMP.config.round.foodInterval; GLOMP.food.spawn(w, 'bite'); }
  },
  score: function (p) { return p.mass; },
};

// Módulo: src/minigames/pom.js
// Quema la papa: la mecha es global; pasar el chicle nunca vuelve a poner el reloj a cero.
GLOMP.minigames.pom = {
  start: function(w) {
    const alive=GLOMP.maps.alive(w), c=GLOMP.config.minigames.pom;
    w.holder=alive[Math.floor(GLOMP.food.random(w)*alive.length)].playerId;
    w.fuse=c.fuseSeconds; w.transferLock=0; w.transfers=[]; w.burst=null;
  },
  step: function(w,dt,controls) {
    if(w.over)return;
    const c=GLOMP.config.minigames.pom;
    w.transferLock=Math.max(0,w.transferLock-dt);
    w.players.forEach(function(p){p.speedMultiplier=p.playerId===w.holder?c.holderSpeedMultiplier:1;p.expression=p.playerId===w.holder?'gasp':'grit';});
    GLOMP.maps.move(w,dt,controls);
    const holder=w.players.find(function(p){return p.playerId===w.holder;});
    if(holder&&holder.alive&&controls[holder.playerId]?.action&&holder.actionCooldown<=0) {
      holder.actionCooldown=c.tagCooldown; holder.gesture=c.tagCooldown;
      if(w.transferLock<=0) {
        const targets=GLOMP.maps.alive(w).filter(function(p){
          if(p===holder)return false;
          const dx=p.x-holder.x,dy=p.y-holder.y,d=Math.hypot(dx,dy);
          return d<=holder.radius+p.radius+c.tagReach&&(!d||(dx*holder.facingX+dy*holder.facingY)/d>=c.tagArc);
        }).sort(function(a,b){return Math.hypot(a.x-holder.x,a.y-holder.y)-Math.hypot(b.x-holder.x,b.y-holder.y)||a.playerId-b.playerId;});
        if(targets.length) {
          const target=targets[0];w.holder=target.playerId;w.transferLock=c.transferLock;holder.stats.passes++;
          w.transfers.push({from:holder.playerId,to:target.playerId,at:w.elapsed,fuse:w.fuse});
          target.gulp=GLOMP.config.physics.gulpSeconds;target.expression='gasp';
        }
      }
    }
    GLOMP.player.separate(w.players,w);
    w.fuse=Math.max(0,w.fuse-dt);
    if(w.fuse<=c.fuseEpsilon) {
      w.fuse=0;
      const victim=w.players.find(function(p){return p.playerId===w.holder;});
      w.burst={x:victim.x,y:victim.y,at:w.elapsed};GLOMP.maps.eliminate(w,victim);w.over=true;
    }
  },
  score: function(p){return p.alive?1:0;},
};

// Módulo: src/minigames/crazy.js
// Un pedido consume cada pieza una sola vez; el presupuesto antibloqueo no se repone al recoger.
GLOMP.minigames.crazy = {
  start: function (w) { w.order = 0; w.stall = 0; w.orderElapsed = 0; w.spawnElapsed = 0; w.maxFood = GLOMP.config.minigames.crazy.maxFood; GLOMP.minigames.crazy.next(w); },
  next: function (w) {
    const c = GLOMP.config.minigames.crazy;
    w.order++; w.orderElapsed = 0;
    w.stage = c.stages.filter(function (s) { return w.order >= s.fromOrder; }).slice(-1)[0];
    w.requested = Math.floor(GLOMP.food.random(w) * w.stage.types);
    w.orderAlive = GLOMP.maps.alive(w).length;
    w.limited = w.stall >= c.antiStallOrders;
    w.supply = w.limited ? Math.max(0, w.orderAlive - 1) : w.orderAlive;
    w.players.forEach(function (p) { p.safe = false; }); w.food = [];
    for (let i = 0; i < w.supply; i++) GLOMP.minigames.crazy.spawn(w, w.requested);
    for (let i = w.food.length; i < c.initialFood; i++) {
      let type = Math.floor(GLOMP.food.random(w) * (w.stage.types - 1)); if (type >= w.requested) type++;
      GLOMP.minigames.crazy.spawn(w, type);
    }
  },
  spawn: function (w, type) {
    if (!GLOMP.food.spawn(w,'bite')) return false;
    w.food[w.food.length - 1].ingredient = type; return true;
  },
  step: function (w, dt, controls) {
    const c = GLOMP.config.minigames.crazy, m = GLOMP.minigames.crazy;
    w.players.forEach(function (p) { p.speedMultiplier = 1; });
    GLOMP.maps.move(w, dt, controls); GLOMP.player.separate(w.players, w);
    w.orderElapsed += dt;
    // El anuncio no consume el reloj ni permite asegurar la comida antes de tiempo.
    if (w.orderElapsed >= c.announcementSeconds) {
      w.food = w.food.filter(function (f) {
        if (f.ingredient !== w.requested) return true;
        const winner = GLOMP.maps.nearest(w, f, function (p) { return !p.safe && !p.npc; });
        if (!winner) return true;
        winner.safe = true; winner.stats.orders++; return false;
      });
    }
    w.spawnElapsed += dt;
    if (w.spawnElapsed >= c.spawnInterval) {
      w.spawnElapsed %= c.spawnInterval;
      let type = Math.floor(GLOMP.food.random(w) * (w.stage.types - 1)); if (type >= w.requested) type++;
      m.spawn(w,type); // Nunca repone el alimento pedido: se conserva el presupuesto completo del pedido.
    }
    if (w.orderElapsed >= c.announcementSeconds + w.stage.seconds) {
      const failed = GLOMP.maps.alive(w).filter(function (p) { return !p.safe; });
      failed.forEach(function (p) { GLOMP.maps.eliminate(w,p); });
      w.stall = failed.length ? 0 : w.stall + 1;
      if (GLOMP.maps.alive(w).length <= 1) w.over = true; else m.next(w);
    }
  },
  score: function (p,w) { return p.alive ? w.elapsed + GLOMP.config.physics.fixedStep : p.eliminatedAt || 0; },
};

// Módulo: src/minigames/buffet.js
// Reutiliza el cuerpo y la comida; el liderazgo y el Manjar hacen visible la disputa.
GLOMP.minigames.buffet = {
  start: function (w) {
    const c=GLOMP.config.minigames.buffet;
    w.maxFood=c.maxFood;w.biteElapsed=0;w.plateElapsed=0;w.feastElapsed=-c.firstFeastAt;w.nextFeast=c.firstFeastAt;w.bananaElapsed=0;
    for(let i=0;i<GLOMP.config.round.initialFood;i++)GLOMP.food.spawn(w,'bite');
  },
  feast: function (w) {
    const c=GLOMP.config.minigames.buffet;
    const leader=w.players.slice().sort(function(a,b){return b.mass-a.mass;})[0];let best=null;
    for(let i=0;i<c.feastSpawnAttempts;i++){
      if(!GLOMP.food.spawn(w,'feast'))break;
      const food=w.food.pop(),distance=Math.hypot(food.x-leader.x,food.y-leader.y);
      if(!best||distance>best.distance)best={food:food,distance:distance};
    }
    if(best)w.food.push(best.food);
  },
  step: function (w,dt,controls) {
    const c=GLOMP.config.minigames.buffet;w.finalFeast=w.elapsed>=c.finalFeastAt;
    w.players.forEach(function(p,index){
      const control=controls[index]||{};
      if(control.x||control.y){p.directionX=control.x;p.directionY=control.y;}
      if(control.action&&p.actionCooldown<=0&&p.state!=='stunned'){
        p.dash=c.dashSeconds;p.actionCooldown=c.dashCooldown;p.hitTargets=[];
        const dx=p.directionX===undefined?1:p.directionX,dy=p.directionY||0,length=Math.hypot(dx,dy)||1;p.dashX=dx/length;p.dashY=dy/length;
      }
      p.dash=Math.max(0,(p.dash||0)-dt);p.stun=Math.max(0,(p.stun||0)-dt);p.state=p.stun>0?'stunned':p.dash>0?'dashing':'normal';
      p.speedMultiplier=p.dash>0?c.dashDistance/c.dashSeconds/p.speed:p.boost>0?1+c.bananaBoost:1;
    });
    const movement=controls.map(function(control,index){const p=w.players[index];return p.dash>0?Object.assign({},control,{x:p.dashX,y:p.dashY}):control;});
    GLOMP.maps.move(w,dt,movement);
    w.players.forEach(function(a){
      if(a.dash<=0)return;
      w.players.forEach(function(b){
        if(a===b||b.immune>0||a.hitTargets.includes(b.playerId)||Math.hypot(a.x-b.x,a.y-b.y)>a.radius+b.radius)return;
        a.hitTargets.push(b.playerId);b.immune=c.hitImmunity;b.stun=c.stunSeconds;b.feastTime=0;
        const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
        b.x+=dx/d*c.pushDistance;b.y+=dy/d*c.pushDistance;GLOMP.player.resolveBounds(b,w);w.obstacles.forEach(function(r){GLOMP.player.resolveRectangle(b,r);});
        const lost=Math.min(b.mass,Math.max(c.minDroppedMass,Math.min(c.maxDroppedMass,b.mass*c.droppedMassRatio)));
        b.mass-=lost;GLOMP.maps.drop(w,b,lost);
      });
    });
    GLOMP.player.separate(w.players,w);
    const remaining=[];
    w.food.forEach(function(f){
      const p=GLOMP.maps.nearest(w,f);if(!p){remaining.push(f);return;}
      if(f.type==='feast'){
        if(p.feastId!==f.id){p.feastId=f.id;p.feastTime=0;}
        p.feastTouched=true;if(p.stun>0){p.feastTime=0;remaining.push(f);return;}p.feastTime+=dt;
        if(p.feastTime<c.feastEatSeconds||p.stun>0){remaining.push(f);return;}
        p.stats.feasts++;
      }
      if(f.type==='banana')p.boost=c.bananaSeconds;
      else GLOMP.player.eat(p,GLOMP.config.food[f.type].mass*(w.finalFeast?c.finalValueMultiplier:1));
      p.stats.eaten++;
    });
    w.food=remaining;w.players.forEach(function(p){if(!p.feastTouched)p.feastTime=0;p.feastTouched=false;});
    const frequency=w.finalFeast?c.finalSpawnMultiplier:1;
    w.biteElapsed+=dt*frequency;w.plateElapsed+=dt*frequency;w.bananaElapsed+=dt;
    while(w.biteElapsed>=1/c.biteRate){w.biteElapsed-=1/c.biteRate;if(w.food.filter(function(f){return f.type==='bite';}).length<c.maxBites)GLOMP.food.spawn(w,'bite');}
    while(w.plateElapsed>=c.plateInterval){w.plateElapsed-=c.plateInterval;if(w.food.filter(function(f){return f.type==='plate';}).length<c.maxPlates)GLOMP.food.spawn(w,'plate');}
    if(w.elapsed>=w.nextFeast){GLOMP.minigames.buffet.feast(w);w.nextFeast+=c.feastInterval;}
    if(w.bananaElapsed>=c.bananaInterval){w.bananaElapsed%=c.bananaInterval;GLOMP.food.spawn(w,'banana');}
    const leaders=w.players.slice().sort(function(a,b){return b.mass-a.mass||b.stats.feasts-a.stats.feasts;});w.leader=leaders[0].playerId;
  },
  score: function(p){return p.mass;},
};

// Módulo: src/minigames/war.js
// Sumo de lava. Mover y empujar; todos comparten los mismos impulsos y efectos.
GLOMP.minigames.war = {
  start: function(w) {
    const c=GLOMP.config.minigames.war;
    w.unbounded=true;w.drops=[];w.dropHistory=[];w.shocks=[];w.nextDrop=0;w.dropElapsed=-c.firstDrop+c.dropInterval;
    w.platformScale=1;
    w.players.forEach(function(p){p.shield=0;p.shove=0;p.shoveHits=[];p.gesture=0;p.fall=0;});
  },
  platform: function(w) {
    const c=GLOMP.config.minigames.war, p=c.platform;
    const progress=Math.max(0,Math.min(1,(w.elapsed-c.shrinkStart-c.shrinkNotice)/c.shrinkSeconds));
    const ratio=1-progress*(1-c.finalPlatformRatio);
    const width=w.width*p.width*ratio,height=w.height*p.height*ratio;
    return {x:w.width/2-width/2,y:w.height*(p.y+p.height/2)-height/2,width:width,height:height,radius:w.width*p.radius*ratio};
  },
  inside: function(w,x,y,inset) {
    const r=GLOMP.minigames.war.platform(w),radius=Math.max(0,r.radius-inset);
    const dx=Math.max(0,Math.abs(x-(r.x+r.width/2))-(r.width/2-r.radius));
    const dy=Math.max(0,Math.abs(y-(r.y+r.height/2))-(r.height/2-r.radius));
    return Math.abs(x-(r.x+r.width/2))<=r.width/2-inset&&Math.abs(y-(r.y+r.height/2))<=r.height/2-inset&&dx*dx+dy*dy<=radius*radius;
  },
  spawn: function(w) {
    const c=GLOMP.config.minigames.war,m=GLOMP.minigames.war;
    if(w.drops.length>=c.maxDrops)return false;
    const weights=c.dropWeights;let roll=GLOMP.food.random(w)*Object.values(weights).reduce(function(a,b){return a+b;},0),type=Object.keys(weights)[0];
    for(const key of Object.keys(weights)){roll-=weights[key];if(roll<=0){type=key;break;}}
    const platform=m.platform(w);
    for(let i=0;i<GLOMP.config.sandbox.spawnAttempts;i++) {
      const x=platform.x+GLOMP.food.random(w)*platform.width,y=platform.y+GLOMP.food.random(w)*platform.height;
      if(!m.inside(w,x,y,c.dropRadius)||w.drops.some(function(d){return Math.hypot(d.x-x,d.y-y)<c.dropRadius*2;}))continue;
      const notice=Math.max(GLOMP.config.telegraphSeconds,c.dropNotice);
      w.drops.push({id:w.nextDrop++,type:type,x:x,y:y,age:0,notice:notice,landed:false,life:c.pickupLifetime});
      w.dropHistory.push({type:type,notice:notice,x:x,y:y,announcedAt:w.elapsed});return true;
    }
    return false;
  },
  shock: function(w,x,y,strength,owner) {
    const c=GLOMP.config.minigames.war;
    w.shocks.push({x:x,y:y,life:GLOMP.config.sandbox.particleSeconds});
    w.players.forEach(function(p){
      const distance=Math.hypot(p.x-x,p.y-y);
      if(!p.alive||distance>c.shockRadius||p.immune>0)return;
      if(p.shield>0){p.shield=0;p.immune=c.hitImmunity;return;}
      GLOMP.player.impulse(p,p.x-x,p.y-y,strength);p.lastPusher=owner;p.immune=c.hitImmunity;
    });
  },
  step: function(w,dt,controls) {
    if(w.over)return;
    const c=GLOMP.config.minigames.war,m=GLOMP.minigames.war;
    w.players.forEach(function(p,index){
      p.fall=Math.max(0,p.fall-dt);p.shield=Math.max(0,p.shield-dt);
      const sticky=w.puddles.some(function(b){return Math.hypot(p.x-b.x,p.y-b.y)<b.rx;});
      p.speedMultiplier=(p.boost>0?1+c.speedBoost:1)*(sticky?c.slowMultiplier:1);
      p.expression=p.shove>0?'grit':sticky?'gasp':'smile';
      if(p.alive&&controls[index]?.action&&p.actionCooldown<=0) {
        p.shove=c.shoveWindup+c.shoveActive;p.actionCooldown=c.shoveCooldown;p.shoveHits=[];
        const control=controls[index],length=Math.hypot(control.x||0,control.y||0);
        p.shoveX=length?control.x/length:p.facingX;p.shoveY=length?control.y/length:p.facingY;p.gesture=p.shove;
      }
      if(p.shove>0) {
        const before=p.shove;p.shove=Math.max(0,p.shove-dt);
        if(before>c.shoveActive&&p.shove<=c.shoveActive)GLOMP.player.impulse(p,p.shoveX,p.shoveY,c.shoveLunge);
      }
    });
    GLOMP.maps.move(w,dt,controls);
    w.players.forEach(function(p){
      if(!p.alive||p.shove<=0||p.shove>c.shoveActive)return;
      w.players.forEach(function(q){
        if(q===p||!q.alive||q.immune>0||p.shoveHits.includes(q.playerId))return;
        const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy);
        if(d>p.radius+q.radius+c.shoveReach||(d&&(dx*p.shoveX+dy*p.shoveY)/d<c.shoveCone))return;
        p.shoveHits.push(q.playerId);q.immune=c.hitImmunity;
        if(q.shield>0){q.shield=0;return;}
        GLOMP.player.impulse(q,p.shoveX,p.shoveY,c.shoveImpulse);q.lastPusher=p.playerId;p.stats.pushes++;
      });
    });
    GLOMP.player.separate(w.players,w);
    w.dropElapsed+=dt;
    if(w.dropElapsed>=c.dropInterval){w.dropElapsed%=c.dropInterval;m.spawn(w);}
    w.drops=w.drops.filter(function(d){
      d.age+=dt;
      if(!d.landed&&d.age>=d.notice) {
        d.landed=true;d.landedAt=w.elapsed;
        if(d.type==='gum'){w.puddles.push({x:d.x,y:d.y,rx:c.dropRadius,ry:c.dropRadius,life:c.puddleSeconds});return false;}
        if(d.type==='melon'){m.shock(w,d.x,d.y,c.shockImpulse,null);return false;}
      }
      if(!d.landed)return true;
      d.life-=dt;
      const p=GLOMP.maps.nearest(w,d);
      if(p){if(d.type==='banana')p.boost=c.boostSeconds;else{p.shield=c.shieldSeconds;p.stats.shields++;}p.gulp=GLOMP.config.physics.gulpSeconds;return false;}
      return d.life>0&&m.inside(w,d.x,d.y,0);
    });
    w.puddles.forEach(function(p){p.life-=dt;});w.puddles=w.puddles.filter(function(p){return p.life>0;});
    w.shocks.forEach(function(p){p.life-=dt;});w.shocks=w.shocks.filter(function(p){return p.life>0;});
    w.players.forEach(function(p){
      if(p.alive&&!m.inside(w,p.x,p.y,p.radius*c.edgeTolerance)) {p.fall=c.fallSeconds;p.expression='gasp';GLOMP.maps.eliminate(w,p);}
    });
    if(GLOMP.maps.alive(w).length<=1)w.over=true;
  },
  score: function(p,w){return p.alive?GLOMP.config.round.maxSeconds+GLOMP.config.physics.fixedStep:p.eliminatedAt||0;},
};

// Módulo: src/match.js
// Partida completa: ninguna escena de sala despacha al patio de práctica.
GLOMP.match = {
  current: null,
  compatible: function (count) {
    return ['eatEm','pom','crazy','buffet','war'].filter(function (id) { const c = GLOMP.config.minigames[id]; return count >= c.minPlayers && count <= c.maxPlayers; });
  },
  create: function (participants, seed) {
    const m = { participants: participants.map(function (p,index) { return { playerId: index, source: Object.assign({},p.source), color: p.color === undefined ? index : p.color, slices: 0, coins: 0 }; }),
      rng: seed || GLOMP.config.sandbox.testSeed, round: 0, previous: null, phase: 'intro', phaseElapsed: 0, paused: false, rows: [], winners: [], completePaid: false };
    GLOMP.match.next(m); return m;
  },
  next: function (m) {
    const options = GLOMP.match.compatible(m.participants.length).filter(function (id) { return id !== m.previous; });
    if (!options.length) throw new Error('No hay dos minijuegos compatibles para alternar.');
    const mode = options[Math.floor(GLOMP.food.random(m) * options.length)];
    m.round++; m.previous = mode; m.phase = 'intro'; m.phaseElapsed = 0; m.rows = []; m.roundPaid = false; m.endingElapsed=0;
    let themes = GLOMP.config.arena.modeThemes[mode];
    if(themes.length>1)themes=themes.filter(function(t){return t!==m.previousTheme;});
    const theme=themes[Math.floor(GLOMP.food.random(m)*themes.length)];m.previousTheme=theme;
    m.world = GLOMP.maps.create(m.participants, theme, Math.floor(GLOMP.food.random(m) * 4294967296));
    m.world.mode = mode; m.world.round = m.round;
    GLOMP.minigames[mode].start(m.world);
    GLOMP.camera.update(m.world,0);
    m.world.players.forEach(function (p) { if (!p.npc) p.slices = m.participants[p.playerId].slices; });
  },
  rank: function (w) {
    const mode = GLOMP.minigames[w.mode], precision = GLOMP.config.round.tiePrecision;
    const rows = w.players.filter(function (p) { return !p.npc; }).map(function (p) { return { player: p, score: Math.round(mode.score(p,w) * precision) / precision }; });
    rows.sort(function (a,b) { return b.score - a.score || (w.mode === 'buffet' ? b.player.stats.feasts - a.player.stats.feasts : 0) || a.player.playerId - b.player.playerId; });
    rows.forEach(function (row,index) { row.place = index && row.score === rows[index-1].score && (w.mode !== 'buffet' || row.player.stats.feasts === rows[index-1].player.stats.feasts) ? rows[index-1].place : index + 1; });
    return rows;
  },
  finishRound: function (m) {
    if (m.roundPaid) return;
    m.roundPaid = true; m.rows = GLOMP.match.rank(m.world);
    const c = GLOMP.config, multiplier = m.participants.length >= c.economy.groupMinPlayers ? c.economy.groupMultiplier : 1;
    m.rows.forEach(function (row) {
      const p = m.participants[row.player.playerId];
      row.slices = row.place === 1 ? c.slices.first : row.place === 2 ? c.slices.second : 0;
      row.coins = Math.round((row.place === 1 ? c.economy.roundFirst : row.place === 2 ? c.economy.roundSecond : 0) * multiplier);
      p.slices += row.slices; p.coins += row.coins;
      GLOMP.save.data.coins += row.coins;
    });
    const eligible = m.rows.filter(function (r) { return m.participants[r.player.playerId].slices >= c.slicesToWin; });
    if (eligible.length) {
      const place = eligible[0].place;
      m.winners = eligible.filter(function (r) { return r.place === place; }).map(function (r) { return r.player.playerId; });
      GLOMP.match.payComplete(m);
    }
    GLOMP.save.write(); m.phase = 'results'; m.phaseElapsed = 0; m.resultsElapsed = 0;
  },
  payComplete: function (m) {
    if (m.completePaid) return;
    m.completePaid = true;
    const c = GLOMP.config.economy, multiplier = m.participants.length >= c.groupMinPlayers ? c.groupMultiplier : 1;
    m.participants.forEach(function (p) { const reward = Math.round((c.matchComplete + (m.winners.includes(p.playerId) ? c.matchWin : 0)) * multiplier); p.coins += reward; GLOMP.save.data.coins += reward; });
    const today = new Date().toLocaleDateString('en-CA');
    if (GLOMP.save.data.lastDailyMatch !== today) { GLOMP.save.data.coins += Math.round(c.firstDailyMatch * multiplier); GLOMP.save.data.lastDailyMatch = today; }
  },
  advance: function (m, dt, controls) {
    if (!Number.isFinite(dt) || dt < 0 || m.paused || m.phase === 'final') return;
    const c = GLOMP.config.round;
    dt = Math.min(dt, GLOMP.config.physics.maxFrameSeconds); m.phaseElapsed += dt;
    if (m.phase === 'intro' && m.phaseElapsed >= c.cinematicSeconds) { m.phase = 'countdown'; m.phaseElapsed = 0; }
    else if (m.phase === 'countdown' && m.phaseElapsed >= c.countdownSeconds) { m.phase = 'launch'; m.phaseElapsed = 0; }
    else if (m.phase === 'launch' && m.phaseElapsed >= c.launchSeconds) { m.phase = 'playing'; m.phaseElapsed = 0; m.world.accumulator = 0; }
    else if (m.phase === 'results' && m.phaseElapsed >= c.resultsSeconds) {
      if (m.winners.length) { m.phase = 'final'; m.phaseElapsed = 0; }
      else GLOMP.match.next(m);
    } else if (m.phase === 'playing') {
      const w = m.world, step = GLOMP.config.physics.fixedStep;
      w.pendingActions = w.pendingActions || [];
      controls.forEach(function (control,index) { w.pendingActions[index] = w.pendingActions[index] || !!control.action; });
      w.accumulator += dt;
      let first = true;
      while (w.accumulator + Number.EPSILON >= step && !w.over) {
        const sampled = controls.map(function (control,index) { return Object.assign({}, control, { action: first && w.pendingActions[index] }); });
        w.elapsed += step; GLOMP.minigames[w.mode].step(w,step,sampled);
        w.accumulator = Math.max(0,w.accumulator - step);
        if (first) w.pendingActions.fill(false); first = false;
        if (w.elapsed + Number.EPSILON >= Math.min(c.maxSeconds,GLOMP.config.minigames[w.mode].duration)) w.over = true;
      }
      if(w.over) {
        const feedback=w.mode==='pom'?GLOMP.config.minigames.pom.burstSeconds:w.mode==='war'?GLOMP.config.minigames.war.fallSeconds:0;
        m.endingElapsed+=dt;
        if(w.mode==='war')w.players.forEach(function(p){p.fall=Math.max(0,p.fall-dt);});
        if(m.endingElapsed>=feedback)GLOMP.match.finishRound(m);
      }
    }
    GLOMP.camera.update(m.world,dt);
  },
  onStart: function (scene) {
    if (!GLOMP.ui.canStart()) { GLOMP.ui.go(scene,'Menu'); return; }
    GLOMP.match.current = GLOMP.match.create(GLOMP.ui.lobby,Date.now() >>> 0);
    GLOMP.ui.scene = scene; GLOMP.ui.focus = 'resume'; GLOMP.ui.buttons = [];
    GLOMP.input.bind(); GLOMP.view.attach(scene); GLOMP.hud.render(scene,GLOMP.match.current);
  },
  onTick: function (scene,dt) {
    if (!Number.isFinite(dt) || dt < 0) return;
    const m = GLOMP.match.current, input = GLOMP.input, ui = GLOMP.ui;
    if (!m) return;
    ui.elapsed+=dt;input.update(dt);
    if(!m.paused&&(m.phase==='results'||m.phase==='final'))m.resultsElapsed=(m.resultsElapsed||0)+dt;
    if (input.back && m.phase !== 'final') { m.paused = !m.paused; ui.focus = 'resume'; }
    if (m.paused || m.phase === 'final') {
      if (input.nav) ui.moveFocus(input.nav);
      const id = input.pointerClick || (input.confirm ? ui.focus : null); input.pointerClick = null;
      if (id === 'resume') m.paused = false;
      if (id === 'exit' || id === 'returnRoom') { ui.lobby.forEach(function (p) { p.ready = false; }); ui.go(scene,'Menu'); return; }
    } else {
      input.pointerClick = null;
      const controls = m.world.players.map(function (p) { return p.npc ? { connected: false } : input.read(p.source); });
      GLOMP.match.advance(m,dt,controls);
    }
    GLOMP.hud.render(scene,m);
  },
};

// Módulo: src/results.js
// Presentación del reparto: solo lee los premios ya acreditados por match.
GLOMP.results = {
  progress: function(time,start,duration) { return Math.max(0,Math.min(1,(time-start)/duration)); },
  ease: function(value) { return 1-Math.pow(1-value,3); },
  columns: function(count) {
    const width=Math.min(620,1580/count);
    return Array.from({length:count},function(_,index){return {x:960+(index-(count-1)/2)*width,width:width};});
  },
  rows: function(m) {
    if(m.phase!=='final')return m.rows;
    return m.rows.slice().sort(function(a,b){return Number(m.winners.includes(b.player.playerId))-Number(m.winners.includes(a.player.playerId))||m.participants[b.player.playerId].slices-m.participants[a.player.playerId].slices||a.place-b.place;}).map(function(row,index){return Object.assign({},row,{displayPlace:m.winners.includes(row.player.playerId)?1:index+1});});
  },
  sample: function(m,row,index,time) {
    const c=GLOMP.config.ui.polish,p=m.participants[row.player.playerId],goal=GLOMP.config.slicesToWin;
    const before=Math.max(0,p.slices-row.slices),earned=GLOMP.results.progress(time,c.sliceStart+index*c.staggerSeconds,c.sliceSeconds*Math.max(1,row.slices));
    const visible=Math.min(goal,before+Math.floor(row.slices*earned+Number.EPSILON));
    const coins=m.phase==='final'?p.coins:row.coins;
    return {entry:GLOMP.results.ease(GLOMP.results.progress(time,index*c.staggerSeconds,c.entrySeconds)),slices:visible,goal:goal,
      displayedSlices:before+Math.floor(row.slices*earned+Number.EPSILON),coins:Math.round(coins*GLOMP.results.ease(GLOMP.results.progress(time,c.coinStart+index*c.staggerSeconds,c.coinSeconds))),remaining:Math.max(0,goal-p.slices)};
  },
  statistic: function(m,row) {
    const p=row.player,key={eatEm:'resultMass',pom:'resultPom',crazy:'resultCrazy',buffet:'resultBuffet',war:'resultWar'}[m.world.mode];
    return GLOMP.i18n.text(key,{value:Math.floor(['eatEm','buffet'].includes(m.world.mode)?p.mass:m.world.mode==='pom'?p.stats.passes:m.world.mode==='war'?p.stats.pushes:p.stats.orders),devoured:p.stats.devoured,feasts:p.stats.feasts,eaten:p.stats.eaten});
  },
  podium: function(view,key,x,y,width,height,color) {
    const d=GLOMP.view,g=d.graphics(view,'podium:'+key,111),edge=width*.12;
    g.beginFill(0x071B55,.3).drawEllipse(x,y+height+14,width*.56,edge).endFill();
    g.lineStyle(4,0x0C3479).beginFill(d.mix(color,0x061F5C,.30)).drawRoundedRect(x-width/2,y,width,height,18).endFill();
    for(let i=0;i<16;i++){const amount=.12+Math.sin(i/15*Math.PI)*.40;g.lineStyle(0).beginFill(d.mix(color,0xFFFFFF,amount)).drawRect(x-width/2+3+i*(width-6)/16,y+4,(width-6)/16+1,height-8).endFill();}
    g.beginFill(d.mix(color,0x14235E,.15)).drawEllipse(x,y+height-3,width/2-2,edge*.43).endFill();
    g.lineStyle(4,0xFFF5C3).beginFill(d.mix(color,0xFFFFFF,.40)).drawEllipse(x,y,width/2,edge).endFill();
    g.lineStyle(2,d.mix(color,0xFFFFFF,.8)).beginFill(color).drawEllipse(x,y-3,width*.43,edge*.68).endFill().lineStyle(0);
  },
  render: function(view,m) {
    const d=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.polish,final=m.phase==='final',time=m.resultsElapsed||0;
    const background=d.image(view,'resultsBackground','map-'+m.world.theme,960,540,1980,1120,{fill:true,z:0});
    if(background&&!background.filters){const Blur=PIXI.BlurFilter||(PIXI.filters&&PIXI.filters.BlurFilter);if(Blur)background.filters=[new Blur(7,3)];}
    d.graphics(view,'resultsShade',90).beginFill(0x0A173F,.52).drawRect(0,0,1920,1080).endFill();
    view.overlayZ=100;
    const entry=GLOMP.results.ease(GLOMP.results.progress(time,0,c.entrySeconds)),offset=(1-entry)*60;
    d.surface(view,'resultsBoard',140,170+offset,1640,795,0x06459F,false,101).alpha=entry;
    const decor=d.graphics(view,'resultsDecor',102);
    for(let i=0;i<16;i++){decor.beginFill(0x74D8FF,.07*entry);GLOMP.icons.star(decor,225+(i%8)*210,310+Math.floor(i/8)*390,28,14,5);decor.endFill();}
    d.heading(view,'resultsTitle',t(final?'finalMatch':'results'),960,100+offset,1420,64);
    GLOMP.icons.draw(view,'resultsCrest','star',960,68+offset,78,115);
    const rows=GLOMP.results.rows(m),columns=GLOMP.results.columns(rows.length),compact=rows.length>3;
    rows.forEach(function(row,index){
      const p=m.participants[row.player.playerId],sample=GLOMP.results.sample(m,row,index,time),column=columns[index],x=column.x;
      const place=row.displayPlace||row.place,gold=place===1,color=gold?0xFFBF23:place===2?0xB8CEEF:place===3?0xDD9372:0x799FEC;
      const podiumWidth=Math.min(470,column.width*.88),rise=(1-sample.entry)*125;
      const top=(compact?730:680)+Math.min(place-1,1)*(compact?12:28)+rise;
      const size=Math.min(compact?215:300,column.width*.82),bounce=gold?Math.sin(time*c.cheerRate)*c.cheerHeight*sample.entry:Math.sin(time*c.cheerRate+index)*c.cheerHeight*.35;
      GLOMP.results.podium(view,'result'+index,x,top,podiumWidth,840-top+rise,color);
      const avatar=d.slime(view,'resultSlime'+index,x,top-10-size*GLOMP.config.animation.bodyAspect/2-bounce,size,Number(row.player.bodyColor.slice(4)),gold?1:Number(row.player.face.slice(4)),1,1,sample.entry,113,null,row.player);
      if(avatar)avatar.scale.set(1+(1-sample.entry)*.10);
      const cakeWidth=compact?78:110,cakeHeight=cakeWidth*.94,step=compact?22:26,cakeBottom=(compact?558:432)+Math.min(place-1,4)*(compact?8:18)+rise;
      const platter=d.graphics(view,'cakePlatter'+index,114);platter.lineStyle(3,0xFFFFD7).beginFill(color).drawEllipse(x,cakeBottom+6,cakeWidth*.66,12).endFill().lineStyle(0);
      for(let slice=0;slice<sample.slices;slice++){
        const start=c.sliceStart+index*c.staggerSeconds+Math.max(0,slice-(p.slices-row.slices))*c.sliceSeconds;
        const pop=1+Math.sin(GLOMP.results.progress(time,start,c.sliceSeconds)*Math.PI)*.12;
        d.image(view,'cake'+index+':'+slice,'reward-cake',x,cakeBottom-cakeHeight/2-slice*step,cakeWidth*pop,cakeHeight*pop,{z:116+slice});
      }
      d.surface(view,'resultScore'+index,x+cakeWidth*.6,cakeBottom-135,compact?100:140,64,color,false,122);
      d.title(view,'resultSlice'+index,t('slices',{count:sample.displayedSlices,goal:sample.goal}),x+cakeWidth*.6+(compact?50:70),cakeBottom-104,compact?30:38,0xFFFFFF,{middle:true,maxWidth:compact?85:125,maxHeight:48,z:123});
      const badge=GLOMP.icons.draw(view,'rank'+index,'star',x,(compact?780:760)+rise,compact?60:78,124);if(badge)badge.tint=0xFFFFFF;
      d.title(view,'rank'+index,String(place),x,(compact?782:762)+rise,compact?29:35,0xFFFFFF,{middle:true,z:125,stroke:4});
      const labelWidth=Math.min(470,column.width*.91);
      d.surface(view,'resultName'+index,x-labelWidth/2,852,labelWidth,68,gold?0xA7620C:0x58309E,false,126);
      d.title(view,'resultName'+index,t('rankPlayer',{place:place,number:p.playerId+1}),x,873,compact?26:35,0xFFFFFF,{middle:true,z:127,maxWidth:labelWidth-22,maxHeight:40,stroke:4});
      const stats=d.text(view,'resultStat'+index,GLOMP.results.statistic(m,row),x,906,compact?16:21,0xDAF4FF,{center:true,middle:true,z:128,outline:2,stroke:0x103B8C});if(stats.width>labelWidth-18)stats.style.fontSize=Math.floor(stats.style.fontSize*(labelWidth-18)/stats.width);
      const coinY=829,coinSize=compact?42:55,maxTextWidth=Math.min(compact?170:260,column.width*.64);
      const reward=d.title(view,'resultEarn'+index,t(final?'totalGlomps':'rewardGlomps',{coins:sample.coins}),x,coinY+rise,compact?21:29,0xFFFFFF,{middle:true,z:124,maxWidth:maxTextWidth,maxHeight:48,stroke:4});
      const textWidth=reward.inner.width,rewardWidth=coinSize+12+textWidth;
      reward.x=x-rewardWidth/2+coinSize+12+textWidth/2;
      GLOMP.icons.draw(view,'rewardCoin'+index,'coin',x-rewardWidth/2+coinSize/2,coinY+rise,coinSize,123);
      d.text(view,'resultRemaining'+index,t(sample.remaining===1?'sliceRemaining':sample.remaining?'slicesRemaining':'goalReached',{count:sample.remaining}),x,943,compact?18:23,gold?0xFFDF73:0xD7EEFF,{center:true,middle:true,z:123,outline:3,stroke:0x103B8C});
    });
    const confetti=d.graphics(view,'resultsConfetti',129);
    for(let i=0;i<c.confettiCount;i++){
      const age=time-i/c.confettiCount*c.entrySeconds;if(age<0||age>c.confettiSeconds)continue;
      const alpha=Math.min(1,(c.confettiSeconds-age)*2),x=190+(i*137%1540)+Math.sin(age*2+i)*35,y=180+age*135+(i*43%130);
      confetti.beginFill([0xFFE05B,0xFF7DCA,0x8DEEFF,0xFFFFFF][i%4],alpha).drawPolygon([x,y,x+8*Math.cos(age*5+i),y+4,x+6,y+15,x-2,y+10]).endFill();
    }
    if(final){
      if(!GLOMP.ui.buttons.some(function(b){return b.id===GLOMP.ui.focus;}))GLOMP.ui.focus='returnRoom';
      d.button(view,'returnRoom',t('playAgain'),680,990,560,0xFFC92F,true,78);
    } else {
      const remaining=Math.max(0,Math.ceil(GLOMP.config.round.resultsSeconds-m.phaseElapsed));
      d.surface(view,'nextRound',580,990,760,78,0x0775C7,false,130);GLOMP.icons.draw(view,'nextRoundClock','clock',634,1028,54,133);
      d.title(view,'nextRound',t('nextRound',{seconds:remaining}),985,1029,31,0xFFFFFF,{middle:true,z:134,maxWidth:620,maxHeight:51});
      const bar=d.graphics(view,'nextRoundProgress',132);bar.beginFill(0x7EECFF).drawRoundedRect(620,1060,680*Math.max(0,1-m.phaseElapsed/GLOMP.config.round.resultsSeconds),4,2).endFill();
    }
    view.overlayZ=0;
  },
};

// Módulo: src/hud.js
// HUD en coordenadas de pantalla; el escenario usa la cámara compartida del grupo.
GLOMP.hud = {
  camera: function(m) { return GLOMP.camera.get(m); },
  world: function(view,m) {
    const d=GLOMP.view,w=m.world,camera=GLOMP.camera.get(m),s=camera.scale;
    const x=function(n){return camera.x+n*s;},y=function(n){return camera.y+n*s;};
    const ambient=d.image(view,'ambient','map-'+w.theme,960,540,1920,1080,{fill:true,z:0,tint:0x635775});
    if(ambient)ambient.alpha=0.35;
    d.image(view,'map','map-'+w.theme,x(w.width/2),y(w.height/2),w.width*s,w.height*s,{fill:true,z:2});
    const ground=d.graphics(view,'ground',3),rings=d.graphics(view,'rings',6),effects=d.graphics(view,'effects',55);
    if(w.theme!=='lava') {
      const block='map-'+w.theme+'-block';
      w.obstacles.forEach(function(r,index){
        const texture=d.textures[block];if(!texture)return;
        const height=r.width*texture.height/texture.width;
        ground.beginFill(0x30253E,.22).drawEllipse(x(r.x+r.width/2),y(r.y+r.height),r.width*s*.5,r.height*s*.34).endFill();
        d.image(view,'block'+index,block,x(r.x+r.width/2),y(r.y+r.height-height/2),r.width*s,height*s,{fill:true,z:20+(r.y+r.height)/w.height*10});
      });
      (w.circles||[]).forEach(function(circle,index){
        const id='map-'+w.theme+'-center',texture=d.textures[id];if(!texture)return;
        const art=GLOMP.config.arena.centerArt,width=circle.radius*art.width,height=width*texture.height/texture.width;
        d.image(view,'center'+index,id,x(circle.x),y(circle.y+circle.radius*art.bottom-height/2),width*s,height*s,{fill:true,z:20+(circle.y+circle.radius*art.bottom)/w.height*10});
      });
      w.bushes.forEach(function(b,index){
        const occupied=w.players.some(function(p){return p.alive&&Math.abs(p.x-b.x)<b.width/2&&Math.abs(p.y-b.y)<b.height/2;});
        d.image(view,'bush'+index,'map-'+w.theme+'-bush',x(b.x),y(b.y),b.width*s,b.height*s,{z:20+(b.y+b.height/3)/w.height*10,alpha:occupied?.45:1});
      });
    }

    if(w.mode==='eatEm'&&w.sauce) {
      const bx=w.width*w.sauce,by=w.height*w.sauce;
      ground.beginFill(0xDF4E53,0.52).drawRect(x(0),y(0),w.width*s,by*s).drawRect(x(0),y(w.height-by),w.width*s,by*s).drawRect(x(0),y(by),bx*s,(w.height-by*2)*s).drawRect(x(w.width-bx),y(by),bx*s,(w.height-by*2)*s).endFill();
    }
    if(w.mode==='war') {
      const platform=GLOMP.minigames.war.platform(w),original=GLOMP.config.minigames.war.platform;
      if(w.elapsed>GLOMP.config.minigames.war.shrinkStart) {
        const g=d.graphics(view,'risingLava',4);
        g.beginFill(0xFF6515,0.82).drawRect(x(w.width*original.x),y(w.height*original.y),w.width*original.width*s,(platform.y-w.height*original.y)*s).drawRect(x(w.width*original.x),y(platform.y+platform.height),w.width*original.width*s,(w.height*(original.y+original.height)-platform.y-platform.height)*s).drawRect(x(w.width*original.x),y(platform.y),(platform.x-w.width*original.x)*s,platform.height*s).drawRect(x(platform.x+platform.width),y(platform.y),(w.width*(original.x+original.width)-platform.x-platform.width)*s,platform.height*s).endFill();
        g.lineStyle(5,0xFFE8A8,0.85).drawRoundedRect(x(platform.x),y(platform.y),platform.width*s,platform.height*s,platform.radius*s).lineStyle(0);
      }
      w.drops.forEach(function(drop){
        const progress=Math.min(1,drop.age/drop.notice),bad=['gum','melon'].includes(drop.type),color=bad?0xFF6F67:0x7DFFD2;
        ground.lineStyle(3,color,0.95).beginFill(color,0.12).drawCircle(x(drop.x),y(drop.y),GLOMP.config.minigames.war.dropRadius*s).endFill().lineStyle(0);
        ground.beginFill(0x241F37,0.25).drawEllipse(x(drop.x),y(drop.y),30*s*(0.4+progress),12*s).endFill();
        const py=y(drop.y)-(drop.landed?0:(1-progress)*320*s);
        if(drop.type==='shield') {
          const a=d.graphics(view,'shieldDrop'+drop.id,40);a.lineStyle(5,0xDAFFFF).beginFill(0x3BCDBF).drawPolygon([x(drop.x)-23*s,py-24*s,x(drop.x)+23*s,py-24*s,x(drop.x)+19*s,py+10*s,x(drop.x),py+30*s,x(drop.x)-19*s,py+10*s]).endFill().lineStyle(0);
        } else d.image(view,'falling'+drop.id,'food-'+drop.type,x(drop.x),py,58*s,58*s,{z:40,rotation:drop.landed?0:(1-progress)*Math.PI});
      });
      w.shocks.forEach(function(q){const progress=1-q.life/GLOMP.config.sandbox.particleSeconds;effects.lineStyle(7,0xFFF0A9,1-progress).drawCircle(x(q.x),y(q.y),GLOMP.config.minigames.war.shockRadius*s*progress).lineStyle(0);});
    }
    w.puddles.forEach(function(p){ground.lineStyle(3,0xFFE1F7,0.7).beginFill(0xD964C3,0.65).drawEllipse(x(p.x),y(p.y),p.rx*s,p.ry*s*0.6).endFill().lineStyle(0);});
    w.food.forEach(function(f){
      const golden=w.mode==='crazy'&&f.ingredient===w.requested;
      const size=GLOMP.config.physics.foodRadius*2*s*(f.type==='feast'?1.8:f.type==='plate'?1.4:1);
      if(golden||f.type==='feast')ground.lineStyle(3,0xFFF1A2).beginFill(0xFFD65A,0.22).drawCircle(x(f.x),y(f.y),size*0.8).endFill().lineStyle(0);
      const id=f.ingredient===undefined?'food-'+f.type:f.ingredient===0?'food-bite':'food-ingredient'+f.ingredient;
      ground.beginFill(0x39243F,0.2).drawEllipse(x(f.x),y(f.y)+size*0.4,size*0.35,size*0.13).endFill();
      d.image(view,'pickup'+f.id,id,x(f.x),y(f.y)+Math.sin(w.elapsed*GLOMP.config.sandbox.foodBobRate+f.id)*GLOMP.config.sandbox.foodBobPixels*s,size,size,{z:8});
    });
    (w.particles||[]).forEach(function(p){ground.beginFill(0xFFE298,p.life/GLOMP.config.sandbox.particleSeconds).drawCircle(x(p.x),y(p.y),5*s).endFill();});
    w.players.forEach(function(p,index){
      (p.trailPoints||[]).forEach(function(point,n){if(p.trail)d.image(view,'trail'+index+':'+n,p.trail,x(point.x),y(point.y),GLOMP.config.animation.cosmetics.trailSize*s,GLOMP.config.animation.cosmetics.trailSize*s,{alpha:point.life/GLOMP.config.animation.cosmetics.trailSeconds,z:5});});
      if(!p.alive&&!(p.fall>0))return;
      const falling=p.fall>0?p.fall/GLOMP.config.minigames.war.fallSeconds:1;
      const size=GLOMP.config.physics.baseRadius*2*p.visualScale*s*falling;
      const hidden=w.mode==='eatEm'&&p.scale<GLOMP.config.minigames.eatEm.bushScaleLimit&&w.bushes.some(function(b){return Math.abs(p.x-b.x)<b.width/2&&Math.abs(p.y-b.y)<b.height/2;});
      ground.beginFill(0x1B1A34,0.26*falling).drawEllipse(x(p.x),y(p.y)+size*0.32,size*0.45,size*0.15).endFill();
      if(!p.npc)rings.lineStyle(3,GLOMP.config.art.markerColors[p.playerId],0.8).drawEllipse(x(p.x),y(p.y)+size*0.3,p.radius*s,p.radius*s*0.35).lineStyle(0);
      if(w.mode==='eatEm') {
        const ratio=GLOMP.config.minigames.eatEm.eatScaleRatio;
        const prey=w.players.filter(function(q){return !q.npc&&q!==p&&q.alive&&p.scale>=q.scale*ratio;});
        const threats=w.players.filter(function(q){return !q.npc&&q!==p&&q.alive&&q.scale>=p.scale*ratio;});
        if(prey.length||threats.length) {
          const danger=prey.length>0,color=danger?0xFF5D63:0x8DEA5A;
          rings.lineStyle(3,color,0.9).drawCircle(x(p.x),y(p.y),(p.radius+10)*s).lineStyle(0);
          d.text(view,'aura'+index,(danger?'→ ':'← ')+(danger?prey:threats).map(function(q){return GLOMP.config.art.markerIcons[q.playerId];}).join(' '),x(p.x),y(p.y)+size*0.55,16,color,{center:true,outline:3,z:44});
        }
      }
      const face=Number((p.face||'face0').slice(4));
      d.slime(view,'slime'+index,x(p.x),y(p.y),size,p.bot?-1:Number(p.bodyColor.slice(4)),face,1,1,(hidden?0.42:1)*falling,20+p.y/w.height*10,p);
      if(p.immune>0||p.shield>0)rings.lineStyle(p.shield>0?5:2,p.shield>0?0x8CFFFF:0xFFF4DC,0.85).drawCircle(x(p.x),y(p.y),p.radius*s+6).lineStyle(0);
      if(p.gesture>0) {
        const radius=(p.radius+GLOMP.config.minigames.war.shoveReach)*s;
        effects.lineStyle(6,0xFFF5C9,0.7).arc(x(p.x),y(p.y),radius,Math.atan2(p.facingY,p.facingX)-0.6,Math.atan2(p.facingY,p.facingX)+0.6).lineStyle(0);
      }
      if(w.mode==='buffet'&&p.playerId===w.leader)GLOMP.icons.draw(view,'leader','crown',x(p.x),y(p.y)-size*.6-28,46,44);
      if(!p.npc&&p.alive) {
        d.text(view,'worldName'+index,GLOMP.config.art.markerIcons[p.playerId]+' '+GLOMP.i18n.text('playerShort',{number:p.playerId+1}),x(p.x),y(p.y)-size*(p.accessory?0.8:0.52)-22,Math.max(17,22*s),0xFFFFFF,{center:true,outline:4,z:42});
        if(p.safe)GLOMP.icons.draw(view,'safe'+index,'check',x(p.x),y(p.y)-size*.7-25,38,43);
      }
      if(w.mode==='pom'&&p.playerId===w.holder&&p.alive) {
        const remaining=w.fuse/GLOMP.config.minigames.pom.fuseSeconds;
        effects.lineStyle(6,0xFF84D4,0.85).arc(x(p.x),y(p.y),p.radius*s+13,-Math.PI/2,-Math.PI/2+Math.PI*2*remaining).lineStyle(0);
        d.image(view,'carriedGum','food-gum',x(p.x)+size*0.32,y(p.y)-size*0.28,Math.max(28,size*0.55),Math.max(28,size*0.55),{z:43});
      }
    });
    if(w.burst) {
      const burst=Math.min(1,(m.endingElapsed||0)/GLOMP.config.minigames.pom.burstSeconds);
      effects.lineStyle(10,0xFFACE5,1-burst).beginFill(0xF876CF,(1-burst)*0.6).drawCircle(x(w.burst.x),y(w.burst.y),GLOMP.config.minigames.war.shockRadius*s*burst).endFill().lineStyle(0);
      d.text(view,'burst',GLOMP.i18n.text('pomBurst'),x(w.burst.x),y(w.burst.y),60,0xFFF3D3,{center:true,middle:true,outline:6,z:60});
    }
  },
  cards: function(view,m) {
    const d=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.colors,w=m.world,camera=GLOMP.camera.get(m);
    w.players.filter(function(p){return !p.npc;}).forEach(function(p,index){
      const right=index%2===1,x=right?1540:22,y=18+Math.floor(index/2)*116,width=358,height=104;
      const behind=w.players.some(function(q){const px=q.x*camera.scale+camera.x,py=q.y*camera.scale+camera.y,r=q.radius*camera.scale;return q.alive&&px+r>x&&px-r<x+width&&py+r>y&&py-r<y+height;});
      const alpha=behind?.38:.97;
      d.panel(view,x,y,width,height,c.blue,35,alpha);
      const avatarX=right?x+305:x+51,textX=right?x+28:x+100;
      d.graphics(view,'portraitFrame'+index,108).lineStyle(4,0xA9F8FF,alpha).beginFill(0x064CAA,alpha).drawCircle(avatarX,y+51,44).endFill().lineStyle(0);
      d.slime(view,'avatar'+index,avatarX,y+53,74,Number(p.bodyColor.slice(4)),Number(p.face.slice(4)),1,1,(p.alive?1:.5)*alpha,110,p);
      d.text(view,'cardName'+index,GLOMP.config.art.markerIcons[index]+' '+t('player',{number:index+1}),textX,y+12,26,0xFFFFFF,{outline:4,stroke:0x103B8C,alpha:alpha});
      d.text(view,'cardSlices'+index,t('slices',{count:m.participants[index].slices,goal:GLOMP.config.slicesToWin}),right?x+230:x+312,y+15,22,c.yellow,{center:true,outline:3,stroke:0x103B8C,alpha:alpha});
      let label=['eatEm','buffet','practice'].includes(w.mode)?t('mass',{count:Math.floor(p.mass)}):p.alive?(w.mode==='crazy'&&p.safe?t('safe'):t('ready')):t('eliminated');
      if(w.mode==='war'&&p.alive)label=t(p.shield>0?'shieldActive':'pushes',{count:p.stats.pushes});
      if(w.mode==='pom'&&p.alive)label=t(p.playerId===w.holder?'gumHolder':'gumSafe');
      if(p.bot)label=t('autoControl');if(p.respawn>0&&!p.alive)label=t('respawning',{seconds:Math.ceil(p.respawn)});
      const status=d.text(view,'cardStat'+index,label,textX,y+49,24,p.alive?c.yellow:0xFF9DA8,{outline:3,stroke:0x103B8C,alpha:alpha});
      if(status.width>236)status.style.fontSize=Math.floor(24*236/status.width);
      const bar=['eatEm','buffet'].includes(w.mode)?Math.min(1,p.scale/GLOMP.config.player.maxScale):w.mode==='war'?Math.max(0,1-p.actionCooldown/GLOMP.config.minigames.war.shoveCooldown):p.alive?1:0;
      view.graphics.beginFill(0x133A83,alpha).drawRoundedRect(textX,y+84,210,7,3).endFill().beginFill(GLOMP.config.art.markerColors[index],alpha).drawRoundedRect(textX,y+84,210*bar,7,3).endFill();
    });
  },
  results: function(view,m) { GLOMP.results.render(view,m); },
  render: function (scene,m) {
    const draw = GLOMP.view, view = draw.begin(scene), c = GLOMP.config.ui.colors, t = GLOMP.i18n.text, w = m.world;
    GLOMP.ui.buttons = [];
    if(m.phase==='results'||m.phase==='final'){GLOMP.hud.results(view,m);if(m.paused)GLOMP.hud.pause(view);return;}
    GLOMP.hud.world(view,m); GLOMP.hud.cards(view,m);
    const duration = Math.min(GLOMP.config.round.maxSeconds,(GLOMP.config.minigames[w.mode] || {}).duration || GLOMP.config.round.maxSeconds), remaining = Math.max(0,Math.ceil(w.mode==='pom'?w.fuse:duration-w.elapsed));
    draw.panel(view,790,14,340,112,c.blue,48,.98);GLOMP.icons.draw(view,'clock','clock',843,69,65,124);
    const timer = draw.title(view,'timer',t('roundTime',{minutes:Math.floor(remaining / 60),seconds:String(remaining % 60).padStart(2,'0')}),987,27,68,remaining<duration/3?0xFF6B85:0xFFFFFF,{outline:12,stroke:7});
    timer.scale.set(remaining < duration / 3 ? 1 + Math.sin(w.elapsed * 5) * 0.035 : 1);
    if(w.mode==='pom'&&m.phase==='playing') {
      draw.panel(view,630,118,660,62,c.dark,15,0.9);
      draw.text(view,'holder',t('gumNotice',{number:w.holder+1}),960,130,29,c.pink,{center:true});
    }
    if(w.mode==='war'&&m.phase==='playing'&&w.elapsed>=GLOMP.config.minigames.war.shrinkStart)draw.text(view,'notice',t('lavaRising'),960,1020,25,c.cream,{center:true,outline:4});
    if (w.mode === 'crazy' && m.phase === 'playing') {
      draw.panel(view,620,116,680,60,c.dark,12,0.92);
      draw.text(view,'order',t(w.orderElapsed < GLOMP.config.minigames.crazy.announcementSeconds ? 'requestStarting' : 'request',{name:t('food' + w.requested)}) + ' · ' + Math.max(0,Math.ceil(w.stage.seconds + GLOMP.config.minigames.crazy.announcementSeconds - w.orderElapsed)),960,127,29,c.yellow,{center:true});
    }
    if(m.phase==='intro') {
      const intro=draw.graphics(view,'introShade',90);intro.lineStyle(4,0x6DE7FF).beginFill(0x083684,.91).drawRoundedRect(38,772,1844,280,44).endFill().lineStyle(0);
      const cap=w.mode.charAt(0).toUpperCase()+w.mode.slice(1);
      draw.text(view,'introRound',t('roundLabel',{number:m.round})+' · '+t('map'+w.theme.charAt(0).toUpperCase()+w.theme.slice(1)),960,789,24,c.yellow,{center:true,outline:3,stroke:0x103B8C});
      draw.title(view,'introTitle',t('mode'+cap),960,824,65,0xFFFFFF,{z:122,outline:13,stroke:7});
      draw.text(view,'introRule',t('rule'+cap),960,908,27,0xFFFFFF,{center:true,wrap:1740,outline:3,stroke:0x103B8C});
      const banner=draw.graphics(view,'introAction',115);banner.beginFill(0xFFD52E).drawRoundedRect(420,985,1080,52,26).endFill();
      draw.text(view,'introAction',t('action'+cap),960,994,24,0x0C2C63,{center:true});
    }
    if(m.phase==='countdown'||m.phase==='launch') {
      draw.graphics(view,'countShade',90).beginFill(c.dark,.13).drawRect(0,0,1920,1080).endFill();
      const launch=m.phase==='launch',progress=launch?m.phaseElapsed/GLOMP.config.round.launchSeconds:m.phaseElapsed%1;
      const pop=1+Math.sin(Math.min(1,progress)*Math.PI)*(launch?GLOMP.config.ui.cartoon.launchPop:GLOMP.config.ui.cartoon.countdownPop);
      const title=draw.title(view,'countdown',launch?t('launch'):t('countdown',{number:Math.max(1,Math.ceil(GLOMP.config.round.countdownSeconds-m.phaseElapsed))}),960,487,launch?155:195,launch?0xFFD92E:0xFFFFFF,{middle:true,scale:pop,outline:20,stroke:11,z:125});
      title.rotation=launch?Math.sin(progress*Math.PI)*-.035:0;
      if(launch)for(let i=0;i<8;i++){const a=i*Math.PI/4;GLOMP.icons.draw(view,'launchStar'+i,'star',960+Math.cos(a)*(240+progress*190),487+Math.sin(a)*(130+progress*90),30*(1-progress)+12,121);}
    }
    if (w.mode === 'eatEm' && w.sauce && m.phase === 'playing') draw.text(view,'notice',t('sauceWarning'),960,1020,23,c.cream,{center:true,outline:4});
    if (w.finalFeast && m.phase === 'playing') draw.text(view,'notice',t('finalFeast'),960,1020,26,c.yellow,{center:true,outline:4});
    if (w.mode === 'practice') draw.text(view,'practice',t('practiceBadge'),960,1015,25,c.cream,{center:true,outline:4});
    if(m.paused)GLOMP.hud.pause(view);
  },
  pause: function(view) {
    const draw=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.colors;
    GLOMP.ui.buttons=[];draw.graphics(view,'pauseShade',400).beginFill(c.dark,.94).drawRect(0,0,1920,1080).endFill();view.overlayZ=300;
    draw.title(view,'pause',t('pauseTitle'),960,330,72,c.yellow,{middle:true});
    draw.button(view,'resume',t('resume'),700,460,520,c.green);draw.button(view,'exit',t('playAgain'),700,590,520,c.blue);view.overlayZ=0;
  },
};

// Módulo: src/shop.js
// Catálogo exclusivamente visual. Equipar nunca toca física ni balance.
GLOMP.shop = {
  catalogue: function() {
    const c=GLOMP.config,e=c.economy;
    const items=c.art.bodyColors.map(function(color,index){return {id:'body'+index,category:'body',index:index,color:color,price:index?e.prices.bodyColor:0,nameKey:'color'+index};});
    c.art.faces.forEach(function(asset,index){items.push({id:'face'+index,category:'face',index:index,asset:asset,price:index<e.initialFaces?0:e.prices.face,nameKey:'face'+index});});
    ['accessory','particles','trail'].forEach(function(category){
      for(let index=0;index<e.pieces[category==='accessory'?'accessories':category==='particles'?'particles':'trails'];index++)items.push({id:category+index,category:category,index:index,asset:category+index,price:e.prices[category],nameKey:category+index});
    });
    c.art.sets.forEach(function(set,index){items.push({id:'set'+index,category:'sets',index:index,equipment:set,price:e.prices.set,nameKey:'set'+index});});
    return items;
  },
  featured: function() {
    const items=GLOMP.shop.catalogue(),day=new Date().toLocaleDateString('en-CA');
    let seed=0;for(let i=0;i<day.length;i++)seed=(seed*31+day.charCodeAt(i))>>>0;
    return items.map(function(item,index){return {item:item,order:Math.sin(seed+index)*10000};}).sort(function(a,b){return a.order-b.order;}).slice(0,GLOMP.config.economy.rotatingItems).map(function(row){return row.item;});
  },
  pieces: function(item) {return item.category==='sets'?Object.values(item.equipment).filter(Boolean):[item.id];},
  owned: function(item) {return GLOMP.shop.pieces(item).every(function(id){return GLOMP.save.data.owned.includes(id);});},
  price: function(item) {
    if(item.category!=='sets')return item.price;
    const catalogue=GLOMP.shop.catalogue();
    return Math.min(item.price,GLOMP.shop.pieces(item).reduce(function(total,id){const p=catalogue.find(function(p){return p.id===id;});return total+(GLOMP.save.data.owned.includes(id)?0:p.price);},0));
  },
  preview: function(item,playerId) {
    const equipment=Object.assign({},GLOMP.save.equipment(playerId));
    if(item.category==='sets')Object.assign(equipment,item.equipment);else equipment[item.category]=item.id;
    return equipment;
  },
  buy: function(id) {
    const item=GLOMP.shop.catalogue().find(function(item){return item.id===id;}),data=GLOMP.save.data;
    if(!item||GLOMP.shop.owned(item))return false;
    const price=GLOMP.shop.price(item);if(data.coins<price)return false;
    data.coins-=price;
    GLOMP.shop.pieces(item).forEach(function(piece){if(!data.owned.includes(piece))data.owned.push(piece);});
    GLOMP.save.write();return true;
  },
  equip: function(id,playerId) {
    const item=GLOMP.shop.catalogue().find(function(item){return item.id===id;});
    if(!item||!GLOMP.shop.owned(item))return false;
    GLOMP.save.data.equipped[playerId]=GLOMP.shop.preview(item,playerId);GLOMP.save.write();return true;
  },
  clear: function(category,playerId) {
    if(!['accessory','particles','trail'].includes(category))return false;
    const equipment=Object.assign({},GLOMP.save.equipment(playerId));equipment[category]=null;
    GLOMP.save.data.equipped[playerId]=equipment;GLOMP.save.write();return true;
  },
};

// Módulo: src/ui.js
// La sala es la pantalla principal: cada plaza tiene color y confirmación propios.
GLOMP.ui = {
  scene: null, focus: 'addRight', buttons: [], elapsed: 0, bootElapsed: 0, lobby: [],
  toast: '', toastElapsed: 0, pendingSource: null, capture: null, selectedPlayer: 0, selectedItem: 'body0', category: 'body', shopPage: 0, settingsPage: 'general', resetArmed: false,
  startBoot: function (scene) { GLOMP.input.bind(); GLOMP.view.load(scene); GLOMP.ui.bootElapsed = 0; },
  tickBoot: function (scene,dt) {
    GLOMP.ui.bootElapsed += dt;
    if (!GLOMP.view.error && GLOMP.view.ready && GLOMP.ui.bootElapsed >= GLOMP.config.ui.bootSeconds) GLOMP.ui.go(scene,'Menu');
  },
  go: function (scene,name) { GLOMP.input.pointerClick = null; gdjs.evtTools.runtimeScene.replaceScene(scene,name,false); },
  notify: function (key) { GLOMP.ui.toast = GLOMP.i18n.text(key); GLOMP.ui.toastElapsed = GLOMP.config.ui.toastSeconds; },
  onStart: function (scene) {
    const ui = GLOMP.ui; ui.scene = scene; ui.buttons = []; ui.elapsed = 0; ui.pendingSource = null; ui.capture = null;
    ui.focus = ['Menu','Lobby','Customize'].includes(scene.getName()) ? 'addRight' : 'back';
    if (!GLOMP.save.data) GLOMP.save.load();
    GLOMP.input.bind(); GLOMP.view.attach(scene); ui.render(scene);
  },
  moveFocus: function (direction) {
    const ui = GLOMP.ui, buttons = ui.buttons.filter(function (b) { return b.enabled; });
    const current = buttons.find(function (b) { return b.id === ui.focus; });
    if (!current) { if (buttons.length) ui.focus = buttons[0].id; return; }
    let best = null, score = Infinity;
    buttons.forEach(function (b) {
      const dx = b.x - current.x, dy = b.y - current.y;
      const main = direction === 'left' ? -dx : direction === 'right' ? dx : direction === 'up' ? -dy : dy;
      const cross = ['left','right'].includes(direction) ? Math.abs(dy) : Math.abs(dx);
      const cost = Math.hypot(dx,dy) + cross;
      if (main > 0 && cost < score) { best = b; score = cost; }
    });
    if (best) ui.focus = best.id;
  },
  sameSource: function (a,b) { return a.kind === b.kind && a.index === b.index; },
  join: function (source,confirmed) {
    const ui = GLOMP.ui;
    const existing = ui.lobby.find(function (p) { return ui.sameSource(p.source,source); });
    if (existing) { existing.ready = !existing.ready; existing.colorConfirmed = true; return; }
    if (ui.lobby.length >= GLOMP.save.data.settings.maxPlayers) { ui.notify('lobbyFull'); return; }
    if (ui.lobby.length >= GLOMP.config.player.maxKeyboardPlayers && (source.kind === 'keyboard' || ui.lobby.some(function (p) { return p.source.kind === 'keyboard'; }))) { ui.notify('controllersRequired'); return; }
    if (source.kind === 'keyboard' && !confirmed) { ui.pendingSource = source; ui.focus = 'confirmControls'; return; }
    ui.lobby.push({ playerId: ui.lobby.length, source: Object.assign({},source), color: GLOMP.save.data.equipped[ui.lobby.length]?.body ? Number(GLOMP.save.equipment(ui.lobby.length).body.slice(4)) : ui.lobby.length % GLOMP.config.art.bodyColors.length, colorConfirmed: false, ready: false, previousX: 0 });
    ui.pendingSource = null; ui.focus = 'ready:' + (ui.lobby.length - 1);
  },
  addKeyboard: function () {
    const ui = GLOMP.ui;
    for (let index = 0; index < GLOMP.config.player.maxKeyboardPlayers; index++) {
      if (!ui.lobby.some(function (p) { return p.source.kind === 'keyboard' && p.source.index === index; })) { ui.join({kind:'keyboard',index:index}); return; }
    }
    ui.notify('controllersRequired');
  },
  changeColor: function (player,delta) { player.color = (player.color + delta + GLOMP.config.art.bodyColors.length) % GLOMP.config.art.bodyColors.length; player.ready = false; player.colorConfirmed = false; },
  canStart: function () { return GLOMP.ui.lobby.length >= 2 && GLOMP.ui.lobby.every(function (p) { return p.ready && p.colorConfirmed && GLOMP.input.read(p.source).connected; }); },
  back: function (scene) {
    const ui = GLOMP.ui;
    if (ui.capture) { ui.capture = null; return; }
    if (ui.pendingSource) { ui.pendingSource = null; ui.focus = 'addRight'; return; }
    if (ui.settingsPage === 'keys') { ui.settingsPage = 'general'; return; }
    if (scene.getName() !== 'Menu') ui.go(scene,'Menu');
  },
  onTick: function (scene,dt) {
    if (!Number.isFinite(dt) || dt < 0) return;
    const ui = GLOMP.ui, input = GLOMP.input, room = ['Menu','Lobby','Customize'].includes(scene.getName());
    ui.elapsed += dt; ui.toastElapsed = Math.max(0,ui.toastElapsed - dt); input.update(dt);
    if (input.back) { ui.back(scene); ui.render(scene); return; }
    if (ui.capture) {
      input.pointerClick = null;
      const code = input.pressedCodes[0];
      if (code) {
        const keys = GLOMP.save.data.settings.keys;
        const duplicate = keys.some(function (mapping,index) { return Object.keys(mapping).some(function (action) { return !(index === ui.capture.player && action === ui.capture.action) && mapping[action] === code; }); });
        if (duplicate || ['Enter','Space','Escape'].includes(code)) ui.notify('keyUsed');
        else { keys[ui.capture.player][ui.capture.action] = code; GLOMP.save.write(); ui.capture = null; }
      }
      ui.render(scene); return;
    }
    let id = input.pointerClick; input.pointerClick = null;
    if (ui.pendingSource) {
      if (input.nav) ui.moveFocus(input.nav);
      if (input.confirm) id = ui.focus;
    } else if (room) {
      // Cada dispositivo mueve únicamente el selector de su jugador.
      ui.lobby.forEach(function (p) {
        const control = input.read(p.source), horizontal = control.x < -GLOMP.config.input.menuAxisThreshold ? -1 : control.x > GLOMP.config.input.menuAxisThreshold ? 1 : 0;
        if (horizontal && horizontal !== p.previousX) ui.changeColor(p,horizontal);
        if (horizontal && horizontal !== p.previousX) ui.focus = 'ready:' + p.playerId;
        p.previousX = horizontal;
        const vertical = control.y < -GLOMP.config.input.menuAxisThreshold ? -1 : control.y > GLOMP.config.input.menuAxisThreshold ? 1 : 0;
        if (p.playerId === 0 && vertical && vertical !== p.previousY) {
          const order = ['shop','customize','settings','credits','practice','play'];
          const current = order.indexOf(ui.focus);
          ui.focus = order[(current + vertical + order.length) % order.length];
        }
        p.previousY = vertical;
      });
      const host = ui.lobby[0], navigation = host && ['shop','customize','settings','credits','practice','play'].includes(ui.focus) && input.joining().some(function (source) { return ui.sameSource(source,host.source); });
      if (navigation) id = ui.focus;
      const startWithPad = ui.canStart() && host && host.source.kind === 'gamepad' && input.joining().some(function (source) { return ui.sameSource(source,host.source); });
      if (startWithPad && !navigation) id = 'play';
      input.joining().forEach(function (source) { if (!(host && (navigation || startWithPad) && ui.sameSource(source,host.source))) ui.join(source); });
      if (input.edges.Enter && ui.canStart()) id = 'play';
      else if ((input.edges.Enter || input.edges.Space) && !ui.lobby.length) id = ui.focus;
      // El mando usa A para confirmar su color; Enter es el inicio explícito del anfitrión.

      if (!ui.lobby.length && input.nav) ui.moveFocus(input.nav);
    } else {
      if (input.nav && scene.getName() === 'Settings' && ['music','effects','maxPlayers'].includes(ui.focus) && ['left','right'].includes(input.nav)) ui.adjustSetting(ui.focus,input.nav === 'right' ? 1 : -1);
      else if (input.nav) ui.moveFocus(input.nav);
      if (input.confirm) id = ui.focus;
    }
    if (id) {
      const button = ui.buttons.find(function (b) { return b.id === id && b.enabled; });
      if (button) ui.activate(scene,id);
    }
    ui.render(scene);
  },
  adjustSetting: function (id,delta) {
    const s = GLOMP.save.data.settings;
    s[id] = id === 'maxPlayers' ? Math.max(2,GLOMP.ui.lobby.length,Math.min(GLOMP.config.maxPlayers,s[id] + delta)) : Math.max(0,Math.min(1,Math.round((s[id] + delta * GLOMP.config.ui.volumeStep) * 100) / 100));
    if (id === 'effects' && GLOMP.ui.scene) GLOMP.ui.scene.getGame().getSoundManager().setGlobalVolume(s.effects * 100);
    GLOMP.save.write();
  },
  activate: function (scene,id) {
    const ui = GLOMP.ui;
    if (id === 'cancel') { ui.pendingSource = null; ui.focus = 'addRight'; return; }
    if (id === 'confirmControls' && ui.pendingSource) {
      const source = ui.pendingSource, keys = GLOMP.save.data.settings.keys[source.index], preset = GLOMP.config.input.keyboard[source.index];
      ['up','down','left','right'].forEach(function (action) { keys[action] = preset[action]; });
      GLOMP.save.write(); ui.join(source,true); return;
    }
    if (id === 'changeAction' && ui.pendingSource) { ui.capture = {player:ui.pendingSource.index,action:'action'}; return; }
    if (id === 'back') { ui.back(scene); return; }
    if (id === 'addLeft' || id === 'addRight') { ui.addKeyboard(); return; }
    if (id === 'play') { if (ui.canStart()) ui.go(scene,'Arena'); else ui.notify(ui.lobby.length < 2 ? 'needPlayers' : 'needReady'); return; }
    if (id.startsWith('left:') || id.startsWith('right:')) { const p = ui.lobby[Number(id.split(':')[1])]; if (p) ui.changeColor(p,id.startsWith('left') ? -1 : 1); return; }
    if (id.startsWith('ready:')) { const p = ui.lobby[Number(id.split(':')[1])]; if (p) { p.colorConfirmed = true; p.ready = !p.ready; } return; }
    if (id.startsWith('remove:')) { ui.lobby.splice(Number(id.split(':')[1]),1); ui.lobby.forEach(function (p,i) { p.playerId = i; p.ready = false; }); return; }
    if (id === 'practice') { GLOMP.sandbox.practice = true; ui.go(scene,'Sandbox'); return; }
    if(id==='customize'){ui.shopPage=0;ui.category='face';ui.selectedItem=GLOMP.save.equipment(ui.selectedPlayer).face;ui.go(scene,'Shop');return;}
    if (id === 'shop') { ui.shopPage=0;ui.category='featured';ui.selectedItem=GLOMP.shop.featured()[0].id;ui.go(scene,'Shop'); return; }
    if (id === 'settings') { ui.settingsPage = 'general'; ui.go(scene,'Settings'); return; }
    if (id === 'credits') { ui.go(scene,'Credits'); return; }
    if(GLOMP.shop.catalogue().some(function(e){return e.id===id;}))ui.selectedItem=id;
    if(id.startsWith('category:')){ui.shopPage=0;ui.category=id.slice(9);const list=ui.category==='featured'?GLOMP.shop.featured():GLOMP.shop.catalogue().filter(function(e){return e.category===ui.category;});ui.selectedItem=list[0].id;}
    if(id==='unequip')GLOMP.shop.clear(ui.category,ui.selectedPlayer);
    if(id==='buy'){const bought=GLOMP.shop.buy(ui.selectedItem);ui.notify(bought?'purchaseDone':'notEnoughCoins');if(bought)ui.focus='equip';}
    if(id==='equip') {
      const equipped=GLOMP.shop.equip(ui.selectedItem,ui.selectedPlayer);ui.notify(equipped?'equipped':'itemLocked');
      if(equipped&&ui.lobby[ui.selectedPlayer]) {
        const item=GLOMP.shop.catalogue().find(function(e){return e.id===ui.selectedItem;});
        if(['body','sets'].includes(item.category)){const p=ui.lobby[ui.selectedPlayer];p.color=Number(GLOMP.save.equipment(ui.selectedPlayer).body.slice(4));p.ready=false;p.colorConfirmed=false;}
      }
    }
    if(id==='nextPlayer'||id==='prevPlayer'){const count=Math.max(1,ui.lobby.length);ui.selectedPlayer=(ui.selectedPlayer+(id==='nextPlayer'?1:-1)+count)%count;}
    if(id==='pageNext'||id==='pagePrev') {
      const list=ui.shopList(),size=GLOMP.config.ui.cartoon.cardPageSize,pages=Math.ceil(list.length/size);
      ui.shopPage=(ui.shopPage+(id==='pageNext'?1:-1)+pages)%pages;ui.selectedItem=list[ui.shopPage*size].id;
    }
    if (['music','effects','maxPlayers'].includes(id)) ui.adjustSetting(id,1);
    if (id === 'controls') { ui.settingsPage = 'keys'; ui.focus = 'key:0:action'; }
    if (id.startsWith('key:')) { const parts = id.split(':'); ui.capture = {player:Number(parts[1]),action:parts[2]}; }
    if (id === 'fullscreen' && typeof document !== 'undefined') {
      const operation = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      if (operation && operation.catch) operation.catch(function () { ui.notify('fullscreenDenied'); });
    }
  },
  renderRoom: function(view) {
    const ui=GLOMP.ui,d=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.colors;
    d.panel(view,365,28,685,120,c.blue,35,.97);
    d.text(view,'profile',t('profile'),535,49,26,0xFFFFFF,{outline:4,stroke:0x103B8C});
    d.title(view,'room',t('localProfile'),770,109,43,c.yellow,{middle:true,stroke:5,maxWidth:470,maxHeight:49});
    d.image(view,'brand','title-glomp',247,85,490,164,{z:130});
    d.panel(view,1450,43,435,90,c.blue,38,.98);GLOMP.icons.draw(view,'wallet','coin',1504,89,66,125);
    d.title(view,'coins',t('coins',{count:GLOMP.save.data.coins}),1695,89,35,c.yellow,{middle:true,stroke:5,maxWidth:310,maxHeight:54});
    d.panel(view,555,173,810,76,c.blue,35,.78);
    d.text(view,'roomSubtitle',t('roomSubtitle'),960,193,27,0xFFFFFF,{center:true,outline:4,stroke:0x103B8C});
    d.button(view,'shop',t('shop'),28,250,350,c.orange,true,110);
    d.button(view,'customize',t('wardrobe'),28,376,350,c.pink,true,110);
    d.button(view,'settings',t('settings'),28,502,350,c.blue,true,110);
    d.button(view,'credits',t('credits'),1550,250,340,c.purple,true,110);
    d.panel(view,1595,379,290,63,c.dark,30,.92);GLOMP.icons.draw(view,'readyPeople','people',1634,410,40,123);
    d.text(view,'readyCount',t('playersReady',{ready:ui.lobby.filter(function(p){return p.ready;}).length,count:ui.lobby.length||GLOMP.save.data.settings.maxPlayers}),1760,392,27,0xFFFFFF,{center:true,outline:3,stroke:0x103B8C});
    const count=Math.max(1,ui.lobby.length),width=Math.min(480,(count>=4?1120:1260)/count),start=960-(count-1)*width/2;
    if(!ui.lobby.length) {
      const equipment=GLOMP.save.equipment(0),size=485;
      d.image(view,'heroPodium','ui-podium',960,791,590,150,{z:22});
      d.slime(view,'hero',960,740-size*GLOMP.config.animation.bodyAspect/2,size,Number(equipment.body.slice(4)),Number(equipment.face.slice(4)),1,1,1,30,null,equipment);
    }
    ui.lobby.forEach(function(p,index){
      const x=start+index*width,connected=GLOMP.input.read(p.source).connected,size=Math.min(365,width*.82),equipment=GLOMP.save.equipment(p.playerId);
      const headerWidth=Math.min(320,width*.86),headerX=x-headerWidth/2;
      d.surface(view,'playerHeader'+index,headerX,326,headerWidth,62,0x095AAC,false,104);
      const device=t('playerShort',{number:index+1})+' · '+t(p.source.kind==='keyboard'?'keyboardDevice':'gamepadDevice',{number:p.source.index+1});
      const deviceText=d.text(view,'device'+index,device,headerX+(headerWidth-58)/2,357,count>4?18:23,0xFFFFFF,{center:true,middle:true,outline:3,stroke:0x103B8C});
      if(deviceText.width>headerWidth-64)deviceText.style.fontSize=Math.floor(deviceText.style.fontSize*(headerWidth-64)/deviceText.width);
      d.button(view,'remove:'+index,'×',headerX+headerWidth-56,331,52,c.red,true,52);
      if(ui.focus==='remove:'+index)d.text(view,'removeHint'+index,t('removePlayer',{number:index+1}),x,402,count>4?17:21,0xFFFFFF,{center:true,outline:4,stroke:0x103B8C});
      d.image(view,'podium'+index,'ui-podium',x,787,size*1.27,size*.32,{z:22});
      d.slime(view,'roomPlayer'+index,x,740-size*GLOMP.config.animation.bodyAspect/2+Math.sin(ui.elapsed*GLOMP.config.ui.decorationRate+index)*GLOMP.config.ui.decorationBob,size,p.color,Number(equipment.face.slice(4)),1,1,connected?1:.5,30,null,equipment);
      d.text(view,'colorName'+index,t('color'+p.color),x,791,count>4?20:25,0xFFFFFF,{center:true,outline:4,stroke:0x103B8C});
      const bw=Math.min(52,width*.17),left=x-width*.43;
      d.button(view,'left:'+index,'‹',left,833,bw,c.blue,true,55);
      d.button(view,'right:'+index,'›',x+width*.43-bw,833,bw,c.blue,true,55);
      const label=t('playerShort',{number:index+1})+' · '+t(!connected?'disconnected':p.ready?'readyCompact':'confirmCompact');
      d.button(view,'ready:'+index,label,left+bw+6,833,width*.86-bw*2-12,p.ready?c.green:c.yellow,connected,55);
    });
    const canAdd=ui.lobby.length<GLOMP.save.data.settings.maxPlayers,empty=ui.lobby.length===0;
    if(empty) {
      d.image(view,'joinPodiumLeft','ui-podium',500,791,290,87,{z:22});d.image(view,'joinPodiumRight','ui-podium',1420,791,290,87,{z:22});
    }
    d.button(view,'addLeft',t('addPlayer'),empty?438:270,650,empty?124:82,c.blue,canAdd,empty?118:82);
    d.button(view,'addRight',t('addPlayer'),empty?1358:1568,650,empty?124:82,c.blue,canAdd,empty?118:82);
    d.button(view,'practice',t('practice'),28,900,420,c.blue,true,102);
    d.panel(view,470,900,945,102,c.blue,35,.97);GLOMP.icons.draw(view,'cup','trophy',530,948,68,124);
    d.title(view,'cup',t('cup'),950,913,34,0xFFFFFF,{outline:8,stroke:5});
    d.text(view,'cupRule',t('cupRule',{count:GLOMP.config.slicesToWin}),950,960,22,c.yellow,{center:true,outline:3,stroke:0x103B8C});
    d.button(view,'play',t('play'),1440,900,445,c.yellow,ui.canStart(),102);
    const hint=!ui.lobby.length?t('joinInstructions'):t(ui.lobby.every(function(p){return p.source.kind==='gamepad';})?'roomHintPads':'roomHint',{action1:GLOMP.input.label(GLOMP.save.data.settings.keys[0].action),action2:GLOMP.input.label(GLOMP.save.data.settings.keys[1].action)});
    d.graphics(view,'footerHint',103).beginFill(0x17366F,.66).drawRoundedRect(420,1032,1080,39,20).endFill();
    d.text(view,'roomHint',hint,960,1040,18,0xFFFFFF,{center:true,outline:2,stroke:0x103B8C});
    if(ui.pendingSource)ui.renderControls(view);
  },
  renderControls: function (view) {
    const draw = GLOMP.view, ui = GLOMP.ui, t = GLOMP.i18n.text, c = GLOMP.config.ui.colors, source = ui.pendingSource;
    // Los botones de debajo del modal no participan en foco ni en activación.
    ui.buttons = [];
    draw.graphics(view,'controlsShade',190).beginFill(c.dark,0.94).drawRect(0,0,1920,1080).endFill(); view.overlayZ = 100;
    const keys = GLOMP.save.data.settings.keys[source.index], preset = GLOMP.config.input.keyboard[source.index];
    draw.heading(view,'controlTitle',t('addTitle'),960,232,1100,45);
    draw.text(view,'controlPlayer',t('keyboardDevice',{number:source.index + 1}),960,325,32,c.cream,{center:true});
    draw.text(view,'controlKeys',t('keysPreset',{keys:[preset.up,preset.left,preset.down,preset.right].map(function (key) { return GLOMP.input.label(key); }).join(' / ')}),960,412,34,c.cream,{center:true});
    draw.text(view,'controlAction',t('actionPreset',{key:GLOMP.input.label(keys.action)}),960,475,30,c.cream,{center:true});
    draw.button(view,'changeAction',t('changeAction'),650,560,620,c.blue);
    draw.button(view,'confirmControls',t('confirmControls'),650,670,620,c.green);
    draw.button(view,'cancel',t('cancel'),650,780,620,c.red); view.overlayZ = 0;
  },
  shopList: function() {return GLOMP.ui.category==='featured'?GLOMP.shop.featured():GLOMP.shop.catalogue().filter(function(e){return e.category===GLOMP.ui.category;});},
  renderShop: function(view) {
    const ui=GLOMP.ui,d=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.colors;
    const catalogue=GLOMP.shop.catalogue(),item=catalogue.find(function(e){return e.id===ui.selectedItem;})||catalogue[0],equipment=GLOMP.shop.preview(item,ui.selectedPlayer);
    d.panel(view,65,242,550,78,c.blue,30,.96);
    d.text(view,'shopPlayer',t('player',{number:ui.selectedPlayer+1}),340,257,32,0xFFFFFF,{center:true,outline:4,stroke:0x103B8C});
    d.button(view,'prevPlayer','‹',76,251,58,c.orange,ui.lobby.length>1,58);d.button(view,'nextPlayer','›',548,251,58,c.orange,ui.lobby.length>1,58);
    d.image(view,'shopPodium','ui-podium',337,760,560,151,{z:105});
    if(equipment.trail)for(let n=0;n<4;n++)d.image(view,'previewTrail'+n,equipment.trail,105+n*74,745+n*8,45,45,{z:108,alpha:(n+1)/4});
    d.slime(view,'shopPreview',337,695-395*GLOMP.config.animation.bodyAspect/2,395,Number(equipment.body.slice(4)),Number(equipment.face.slice(4)),1,1,1,110,null,equipment);
    d.panel(view,130,804,415,64,c.blue,30,.98);d.text(view,'previewName',t(item.nameKey),337,817,29,0xFFFFFF,{center:true,outline:4,stroke:0x103B8C});
    const categories=['featured','body','face','accessory','particles','trail','sets'];
    categories.forEach(function(category,index){d.button(view,'category:'+category,t('category'+category),682+index*169,229,159,ui.category===category?c.yellow:c.blue,true,96);});
    const list=ui.shopList(),pageSize=GLOMP.config.ui.cartoon.cardPageSize,pages=Math.ceil(list.length/pageSize);
    ui.shopPage=Math.min(ui.shopPage,Math.max(0,pages-1));
    list.slice(ui.shopPage*pageSize,(ui.shopPage+1)*pageSize).forEach(function(e,index){
      const x=696+index%3*398,y=347+Math.floor(index/3)*264,w=374,h=246,selected=ui.selectedItem===e.id;
      d.hit(view,e.id,x,y,w,h,true);
      d.graphics(view,'catalogue'+index,106).lineStyle(6,0x103B8C).beginFill(0x1261CB).drawRoundedRect(x,y,w,h,28).endFill().lineStyle(3,0xD6F8FF).drawRoundedRect(x+4,y+4,w-8,h-8,25).lineStyle(0).beginFill(0x45CEFF,.32).drawRoundedRect(x+10,y+10,w-20,h*.52,20).endFill();
      if(selected||ui.focus===e.id)d.graphics(view,'cardFocus'+index,107).lineStyle(5,0xFFE147).drawRoundedRect(x-3,y-3,w+6,h+6,28).lineStyle(0);
      const preview=GLOMP.shop.preview(e,ui.selectedPlayer);
      d.slime(view,'cardSlime'+index,x+w/2,y+115,151,Number(preview.body.slice(4)),Number(preview.face.slice(4)),1,1,1,110,null,preview);
      d.graphics(view,'cardLabel'+index,113).beginFill(0x0751B4,.96).drawRoundedRect(x+10,y+171,w-20,66,16).endFill();
      d.text(view,'cardName'+index,t(e.nameKey),x+w/2,y+174,26,0xFFFFFF,{center:true,outline:3,stroke:0x103B8C});
      const owned=GLOMP.shop.owned(e);if(!owned)GLOMP.icons.draw(view,'priceCoin'+index,'coin',x+85,y+217,28,124);
      d.text(view,'price'+index,t(owned?'owned':'price',{count:GLOMP.shop.price(e)}),x+w/2+(owned?0:8),y+207,23,owned?0xBEFF93:0xFFFFFF,{center:true,outline:3,stroke:0x103B8C});
    });
    if(pages>1){d.button(view,'pagePrev','‹',1110,883,56,c.blue,true,42);d.button(view,'pageNext','›',1408,883,56,c.blue,true,42);d.text(view,'page',t('cataloguePage',{page:ui.shopPage+1,pages:pages}),1287,889,24,0xFFFFFF,{center:true,outline:3,stroke:0x103B8C});}
    const owned=GLOMP.shop.owned(item);
    d.button(view,owned?'equip':'buy',t(owned?'equip':'buyPrice',{count:GLOMP.shop.price(item)}),740,941,1125,owned?c.green:c.yellow,true,89);
    if(['accessory','particles','trail'].includes(ui.category))d.button(view,'unequip',t('unequip'),130,877,415,c.blue,true,46);
    d.text(view,'cosmetic',t('cosmeticOnly'),1285,1045,19,0xFFFFFF,{center:true,outline:3,stroke:0x103B8C});
  },
  renderSettings: function (view) {
    const ui = GLOMP.ui, draw = GLOMP.view, t = GLOMP.i18n.text, c = GLOMP.config.ui.colors, s = GLOMP.save.data.settings;
    if (ui.settingsPage === 'keys') {
      s.keys.forEach(function (keys,index) {
        draw.text(view,'preset' + index,t('keyboardDevice',{number:index + 1}),530 + index * 850,330,32,c.cream,{center:true});
        draw.text(view,'fixedKeys' + index,t('keysPreset',{keys:[keys.up,keys.left,keys.down,keys.right].map(GLOMP.input.label).join(' / ')}),530 + index * 850,430,25,c.cream,{center:true});
        draw.button(view,'key:' + index + ':action',t('actionPreset',{key:keys.action}),220 + index * 850,540,620,c.blue);
      });
    } else {
      [['music','musicVolume',Math.round(s.music * 100)],['effects','effectsVolume',Math.round(s.effects * 100)],['maxPlayers','maxPlayers',s.maxPlayers]].forEach(function (entry,index) {
        draw.button(view,entry[0],t(entry[1],{value:entry[2],count:entry[2]}),260,300 + index * 145,620,c.blue);
      });
      draw.button(view,'fullscreen',t('fullscreen'),1040,300,620,c.green); draw.button(view,'controls',t('remapKeyboard'),1040,445,620,c.yellow);
      draw.text(view,'settingsHint',t('settingsHints'),960,805,25,c.cream,{center:true});
    }
  },
  render: function (scene) {
    const ui = GLOMP.ui, draw = GLOMP.view, t = GLOMP.i18n.text, c = GLOMP.config.ui.colors, view = draw.begin(scene), name = scene.getName(); ui.buttons = [];
    draw.image(view,'background','menu-village',960,540,1920,1080,{fill:true,z:0});
    if (['Menu','Lobby','Customize'].includes(name)) ui.renderRoom(view);
    else {
      draw.graphics(view,'pageShade',2).beginFill(c.dark,name==='Shop'?0.08:0.6).drawRect(0,0,1920,1080).endFill();
      draw.image(view,'smallBrand','title-glomp',190,87,350,125,{z:125});
      draw.heading(view,'heading',t(name.toLowerCase()+'Title'),960,54,770,62);
      draw.panel(view,1495,51,390,83,c.blue,35,.98);GLOMP.icons.draw(view,'wallet','coin',1538,93,54,124);draw.title(view,'wallet',t('coins',{count:GLOMP.save.data.coins}),1712,93,31,c.yellow,{middle:true,stroke:5,maxWidth:282,maxHeight:52});
      draw.button(view,'back',t('back'),35,930,310,c.red);
      if (name === 'Shop') ui.renderShop(view);
      if (name === 'Settings') ui.renderSettings(view);
      if(name==='Credits'){draw.image(view,'banner','banner-original',1000,520,1200,675,{z:110});draw.text(view,'credits',t('creditsBody'),1000,895,28,c.cream,{center:true});draw.text(view,'fontCredit',t('fontCredit'),1000,950,22,c.cream,{center:true});}
    }
    if (ui.toastElapsed > 0) {
      draw.graphics(view,'toast',300).beginFill(c.cream,0.98).drawRoundedRect(430,150,1060,78,12).endFill();
      draw.text(view,'toast',ui.toast,960,170,25,c.chocolate,{center:true,z:310});
    }
    if (ui.capture) {
      draw.graphics(view,'capture',400).beginFill(c.dark,0.98).drawRoundedRect(400,390,1120,270,16).endFill();
      draw.text(view,'capture',t('pressNewKey'),960,485,36,c.cream,{center:true,z:410});
    }
  },
};

// Módulo: src/sandbox.js
// Práctica explícita. Usa el mismo mapa y el mismo movimiento que la copa, sin premios.
GLOMP.sandbox = {
  practice: true, world: null,
  createWorld: function (participants,seed) {
    const w = GLOMP.maps.create(participants,'candy',seed); w.mode = 'practice';
    for (let i = 0; i < GLOMP.config.round.initialFood; i++) GLOMP.food.spawn(w,'bite');
    GLOMP.camera.update(w,0);return w;
  },
  step: function (w,dt,controls) {
    w.elapsed += dt; GLOMP.maps.move(w,dt,controls); GLOMP.player.separate(w.players,w); GLOMP.food.collect(w);
    w.foodElapsed += dt;
    while (w.foodElapsed >= GLOMP.config.round.foodInterval) { w.foodElapsed -= GLOMP.config.round.foodInterval; GLOMP.food.spawn(w,'bite'); }
    w.particles.forEach(function (p) { p.life -= dt; }); w.particles = w.particles.filter(function (p) { return p.life > 0; });
  },
  advance: function (w,dt,controls) {
    if (!Number.isFinite(dt) || dt < 0) return;
    w.accumulator += Math.min(dt,GLOMP.config.physics.maxFrameSeconds);
    const step = GLOMP.config.physics.fixedStep;
    while (w.accumulator + Number.EPSILON >= step) { GLOMP.sandbox.step(w,step,controls); w.accumulator = Math.max(0,w.accumulator - step); }
    GLOMP.camera.update(w,dt);
  },
  onStart: function (scene) {
    const participants = GLOMP.ui.lobby.length ? GLOMP.ui.lobby : [{source:{kind:'keyboard',index:0},color:Number(GLOMP.save.equipment(0).body.slice(4))}];
    GLOMP.sandbox.world = GLOMP.sandbox.createWorld(participants,Date.now() >>> 0);
    GLOMP.input.bind(); GLOMP.view.attach(scene);
  },
  onTick: function (scene,dt) {
    const input = GLOMP.input,w = GLOMP.sandbox.world;
    GLOMP.ui.elapsed+=dt;input.update(dt); if (input.back) { GLOMP.ui.go(scene,'Menu'); return; }
    GLOMP.sandbox.advance(w,dt,w.players.map(function (p) { return input.read(p.source); }));
    GLOMP.hud.render(scene,{world:w,phase:'playing',phaseElapsed:0,participants:w.players.map(function () { return {slices:0}; }),round:0});
  },
};

// Módulo: src/boot.js
// Namespace compartido; los módulos pendientes se implementan en su hito.
GLOMP.player = GLOMP.player || {};
GLOMP.match = GLOMP.match || {};
GLOMP.minigames = GLOMP.minigames || { eatEm: {}, pom: {}, crazy: {}, buffet: {}, war: {} };
GLOMP.boot = {
  pollElapsed: 0,
  gamepadSignature: null,
  diagnostics: { connectedCount: null, indices: [], apiAvailable: false, sixControllersVerified: false },
  onStart: function (scene) {
    if (typeof document !== 'undefined') document.title = GLOMP.i18n.text('bootTitle');
    if (GLOMP.save && typeof GLOMP.save.load === 'function') GLOMP.save.load();
    GLOMP.boot.pollElapsed = 0;
    GLOMP.boot.gamepadSignature = null;
    GLOMP.boot.scanGamepads(scene);
    if (scene.getGame && GLOMP.ui) GLOMP.ui.startBoot(scene);
  },
  scanGamepads: function (scene) {
    let pads = [], available = false;
    try {
      available = typeof navigator !== 'undefined' && typeof navigator.getGamepads === 'function';
      if (available) pads = Array.from(navigator.getGamepads() || []).filter(function (pad) { return pad && pad.connected; });
    } catch (error) { available = false; }
    const indices = pads.map(function (pad) { return pad.index; });
    const signature = String(available) + ':' + indices.join(',');
    const state = GLOMP.boot.diagnostics;
    state.connectedCount = pads.length; state.indices = indices; state.apiAvailable = available;
    if (signature !== GLOMP.boot.gamepadSignature) {
      GLOMP.boot.gamepadSignature = signature;
      console.info(GLOMP.i18n.text(available ? 'gamepadLog' : 'gamepadUnavailable', { count: pads.length, indices: indices.join(', ') }));
    }
  },
  onTick: function (scene, dt) {
    if (!Number.isFinite(dt) || dt < 0) return;
    GLOMP.boot.pollElapsed += dt;
    if (GLOMP.boot.pollElapsed >= GLOMP.config.diagnostics.gamepadPollSeconds) {
      GLOMP.boot.pollElapsed %= GLOMP.config.diagnostics.gamepadPollSeconds;
      GLOMP.boot.scanGamepads(scene);
    }
    if (scene.getGame && GLOMP.ui) GLOMP.ui.tickBoot(scene, dt);
  },
};
GLOMP.__loaded = true;
}
if (!runtimeScene.__glompReady) { GLOMP.ui.onStart(runtimeScene); runtimeScene.__glompReady = true; }
GLOMP.ui.onTick(runtimeScene, runtimeScene.getTimeManager().getElapsedTime() / 1000);

};
gdjs.LobbyCode.eventsList0 = function(runtimeScene) {

{


gdjs.LobbyCode.userFunc0x8c2c28(runtimeScene);

}


};

gdjs.LobbyCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();


gdjs.LobbyCode.eventsList0(runtimeScene);


return;

}

gdjs['LobbyCode'] = gdjs.LobbyCode;
