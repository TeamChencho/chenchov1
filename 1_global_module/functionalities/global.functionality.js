/**
 * Función de números aleatorios
 * @param {Integer} min Número mínimo, SÍ lo incluye
 * @param {Integer} max Número máximo, NO lo incluye
 */
exports.getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}