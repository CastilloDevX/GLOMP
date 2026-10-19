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
    baseSpeed: 260, scalePerMass: 0.012, maxScale: 3.0, speedPenalty: 0.10,
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
      minPlayers: 2, maxPlayers: 6, duration: 75, maxBombs: 10, maxCoverage: 0.6, minRouteWidth: 120,
      bombs: {
        small: { radius: 110, inflateSeconds: 1.2, availableAt: 0 },
        wide: { width: 190, height: 100, inflateSeconds: 1.5, availableAt: 20 },
        tall: { width: 100, height: 260, inflateSeconds: 1.8, availableAt: 35 },
        mystery: { availableAt: 45 },
      },
      frequency: [{ from: 0, interval: 1.6 }, { from: 20, interval: 1.1 }, { from: 45, interval: 0.7 }],
      puddleSeconds: 2, puddleSpeedMultiplier: 0.5,
      bananaBoost: 0.3, bananaSeconds: 4, bananaInterval: 15, shrinkStart: 50, arenaFinalRatio: 0.5,
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
      minPlayers: 2, maxPlayers: 6, duration: 120, health: 100, hitImmunity: 0.6, knockback: 80,
      minCrates: 6, maxCrates: 8, crateInterval: 4,
      foodWeights: { tomato: 0.45, gum: 0.2, melon: 0.2, lettuce: 0.1, banana: 0.05 },
      aimArrowLength: 40, fireInterval: 0.35, keyboardAimDirections: 8, aimAssistDegrees: 8,
      zoneStart: 30, arenaFinalRatio: 0.4, zoneDamage: 15, zoneDamageInterval: 2.5, comebackLettuceMultiplier: 2,
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
    fixedStep: 1 / 120, maxFrameSeconds: 0.25, baseRadius: 40, foodRadius: 18,
    acceleration: 2400, friction: 3200, lateralRetention: 0.7, separationDamping: 0.6,
    stretchAmount: 0.18, brakeSquash: 0.85, brakeSeconds: 0.09, springK: 180, springC: 14,
    gulpScale: 1.12, gulpSeconds: 0.12, gulpParticles: 4, growLerp: 8,
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
    markerIcons: ['●', '■', '▲', '★', '◆', '⬢'], faces: ['face-happy'],
  },
  ui: {
    width: 1920, height: 1080, buttonHeight: 86, toastSeconds: 2.5, bootSeconds: 0.2,
    volumeStep: 0.1, decorationBob: 9, decorationRate: 1.6,
    colors: { chocolate: 0x5A3A24, cream: 0xFFF4DC, ink: 0x36233D, green: 0x7ED321, yellow: 0xFFC933, pink: 0xFF4FA3, blue: 0x2FA8FF, purple: 0x8E4DFF, orange: 0xFF8A2B, red: 0xE8312F, muted: 0xABA9B1, dark: 0x211A35 },
  },
};
// Dirección de la rework: mapa rectangular completo y rondas de hasta tres minutos.
GLOMP.config.arena = {
  width: 1920, height: 1080, largeMultiplier: 1.2, wall: 42,
  floorTile: 256, wallTile: 128, obstacleWidth: 176, obstacleHeight: 86,
  bushWidth: 208, bushHeight: 114, centerSize: 146,
  obstacles: [[0.26,0.30],[0.74,0.30],[0.26,0.70],[0.74,0.70]],
  bushes: [[0.16,0.48],[0.84,0.52],[0.40,0.78],[0.60,0.22]],
  spawns: [[0.16,0.24],[0.84,0.76],[0.84,0.24],[0.16,0.76],[0.50,0.36],[0.50,0.64]],
  themes: ['candy','cooking','slimegarden'],
};
GLOMP.config.round = {
  maxSeconds: 180, cinematicSeconds: 5, countdownSeconds: 3, launchSeconds: 0.65,
  resultsSeconds: 8, initialFood: 42, foodInterval: 0.6, foodSpacing: 62,
  cameraZoom: 1.24, cameraPan: 0.06, endZoom: 1,
  resultRows: 6, botSteerSeconds: 1.2, maxDrops: 40,
  maxSpeedMultiplier: 2, tiePrecision: 1000,
};
GLOMP.config.art.pixelTiers = ['pixel-slime-small','pixel-slime-medium','pixel-slime-large'];
GLOMP.config.art.tierThresholds = [110,210];
GLOMP.config.art.foodColors = [0xFFC933,0xF25B67,0x85D55B,0xB88BF2,0xFF9B45,0x60C9EF,0xE4B783,0xED8EBD,0x91C9A2,0xD6A1F0,0xFFDD8C,0x81BEDF,0xDC8C5C,0xB8D873];
GLOMP.config.minigames.crazy.duration = GLOMP.config.round.maxSeconds;
GLOMP.config.minigames.crazy.initialFood = 32;
GLOMP.config.minigames.pom.spawnAttempts = 120;
GLOMP.config.minigames.pom.shrinkSeconds = 15;
GLOMP.config.minigames.pom.blastSeconds = 0.22;
GLOMP.config.minigames.pom.routeInset = 12;
GLOMP.config.minigames.eatEm.maxSauceFraction = 0.48;
GLOMP.config.minigames.eatEm.botRespawnImmunity = 1;
GLOMP.config.arena.layouts = {
  candy: { obstacles: [[0.22,0.30],[0.33,0.30],[0.78,0.30],[0.22,0.70],[0.67,0.70],[0.78,0.70]], bushes: [[0.17,0.48],[0.83,0.52],[0.42,0.78],[0.58,0.22]] },
  cooking: { obstacles: [[0.24,0.26],[0.35,0.26],[0.76,0.26],[0.24,0.74],[0.65,0.74],[0.76,0.74]], bushes: [[0.14,0.50],[0.86,0.50],[0.36,0.78],[0.64,0.22]] },
  slimegarden: { obstacles: [[0.23,0.28],[0.36,0.28],[0.77,0.28],[0.23,0.72],[0.64,0.72],[0.77,0.72]], bushes: [[0.16,0.48],[0.84,0.52],[0.37,0.78],[0.63,0.22]] },
};
GLOMP.config.minigames.buffet.maxFood = 76;
GLOMP.config.minigames.buffet.feastSpawnAttempts = 12;
GLOMP.config.minigames.buffet.feastRadius = 28;
GLOMP.config.minigames.war.projectileRadius = 12;
GLOMP.config.minigames.war.zoneSeconds = 60;
GLOMP.config.minigames.war.projectileLifetime = 4;
GLOMP.config.minigames.war.impactParticles = 6;
GLOMP.config.minigames.war.crates = [[0.16,0.18],[0.84,0.82],[0.84,0.18],[0.16,0.82],[0.50,0.30],[0.50,0.70],[0.12,0.50],[0.88,0.50]];
GLOMP.config.minigames.war.ammoColors = {tomato:0xFF5E68,gum:0xF6A4E0,melon:0x88D760,lettuce:0xA4E75D,banana:0xFFE76A};
GLOMP.config.round.dropOwnerGraceSeconds = 0.45;
GLOMP.config.food.gum.radius = 90;

GLOMP.config.art.botColor = 0x969DAE;
