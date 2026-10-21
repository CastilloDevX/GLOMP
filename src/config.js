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
