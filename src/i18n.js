// Todos los textos visibles, incluidos los diagnósticos del arranque.
GLOMP.i18n = {
  es: {
    bootTitle: 'GLOMP!',
    bootStatus: 'Base del proyecto lista · Mandos detectados: {count}',
    bootNoGamepadAPI: 'La API de mandos no está disponible en este navegador.',
    bootHelp: 'Hito 0 · Prueba de mandos\n\nConecta los mandos y pulsa un botón en cada uno.\nPara confirmar seis jugadores, prueba los seis a la vez.\n\nEl menú y los minijuegos se construyen en los siguientes hitos.',
    gamepadLog: '[GLOMP] Mandos detectados: {count}. Índices: {indices}',
    gamepadUnavailable: '[GLOMP] La API de mandos no está disponible en este navegador.',
  },
  text: function (key, values) {
    let text = GLOMP.i18n.es[key] || key;
    Object.keys(values || {}).forEach(function (name) { text = text.split('{' + name + '}').join(String(values[name])); });
    return text;
  },
};
