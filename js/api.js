// Servicio de API
const ApiService = {
    async obtenerTodosPython() {
        console.log("[API] Iniciando consulta...");
        
        try {
            // Mostrar loading
            const container = document.getElementById("result-container");
            if (container) {
                container.innerHTML = `
                    <div class="loading-state">
                        <div class="spinner"></div>
                        <p>Consultando la API OMDb<span class="dots">...</span></p>
                    </div>
                `;
            }
            
            const url = `${CONFIG.BASE_URL}?s=python&apikey=${CONFIG.API_KEY}`;
            console.log("[API] URL:", url);
            
            const searchRes = await fetch(url);
            console.log("[API] Status:", searchRes.status);
            
            if (!searchRes.ok) throw new Error(`HTTP ${searchRes.status}`);
            
            const searchData = await searchRes.json();
            console.log("[API] Respuesta:", searchData);
            
            if (searchData.Response === "False") {
                console.warn("[API] OMDb Error:", searchData.Error);
                return [];
            }

            const items = searchData.Search || [];
            console.log("[API] Items encontrados:", items.length);
            
            if (items.length === 0) {
                return [];
            }
            
            // Obtener detalles con límite de concurrencia
            const detalles = await this._obtenerDetallesConLimite(items, 5);
            
            return detalles.filter(item => item !== null);

        } catch (error) {
            console.error("[API] Error al consultar:", error);
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
            const url = `${CONFIG.BASE_URL}?i=${imdbID}&plot=full&apikey=${CONFIG.API_KEY}`;
            const detRes = await fetch(url);
            if (!detRes.ok) throw new Error(`HTTP ${detRes.status}`);
            return await detRes.json();
        } catch (error) {
            console.error(`[API] Error obteniendo detalle para ${imdbID}:`, error);
            return null;
        }
    }
};

async function obtenerTodosPython() {
    return ApiService.obtenerTodosPython();
}