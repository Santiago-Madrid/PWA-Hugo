// Servicio de API
const ApiService = {
    async obtenerTodosPython() {
        try {
            mostrarCargando();
            
            const searchRes = await fetch(`${CONFIG.BASE_URL}?s=python&apikey=${CONFIG.API_KEY}`);
            if (!searchRes.ok) throw new Error(`HTTP ${searchRes.status}`);
            
            const searchData = await searchRes.json();
            
            if (searchData.Response === "False") {
                console.warn("OMDb:", searchData.Error);
                return [];
            }

            const items = searchData.Search || [];
            
            // Obtener detalles con límite de concurrencia
            const detalles = await this._obtenerDetallesConLimite(items, 5);
            
            return detalles.filter(item => item !== null);

        } catch (error) {
            console.error("Error al consultar la API:", error);
            return [];
        }
    },

    async _obtenerDetallesConLimite(items, limite) {
        const resultados = [];
        for (let i = 0; i < items.length; i += limite) {
            const batch = items.slice(i, i + limite);
            const batchResultados = await Promise.all(
                batch.map(item => this._obtenerDetalle(item.imdbID))
            );
            resultados.push(...batchResultados);
            // Pequeña pausa para no sobrecargar la API
            if (i + limite < items.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        return resultados;
    },

    async _obtenerDetalle(imdbID) {
        try {
            const detRes = await fetch(
                `${CONFIG.BASE_URL}?i=${imdbID}&plot=full&apikey=${CONFIG.API_KEY}`
            );
            if (!detRes.ok) throw new Error(`HTTP ${detRes.status}`);
            return await detRes.json();
        } catch (error) {
            console.error(`Error obteniendo detalle para ${imdbID}:`, error);
            return null;
        }
    }
};

async function obtenerTodosPython() {
    return ApiService.obtenerTodosPython();
}