// Controlador principal
class AppController {
    constructor() {
        console.log("[App] Inicializando...");
        this.pythonData = [];
        this.buttons = this._obtenerBotones();
        this._asignarEventosBotones();
        
        // Cargar datos después de un pequeño delay para asegurar que todo está listo
        setTimeout(() => {
            this._cargarAplicacion();
        }, 100);
    }

    _obtenerBotones() {
        return {
            general: document.getElementById("general-btn"),
            cast: document.getElementById("cast-btn"),
            production: document.getElementById("production-btn"),
            ratings: document.getElementById("ratings-btn"),
            awards: document.getElementById("awards-btn"),
            plot: document.getElementById("plot-btn"),
            clear: document.getElementById("clear-btn")
        };
    }

    _asignarEventosBotones() {
        const btn = this.buttons;
        btn.general.addEventListener("click", () => UIManager.mostrarInformacionGeneral(this.pythonData));
        btn.cast.addEventListener("click", () => UIManager.mostrarReparto(this.pythonData));
        btn.production.addEventListener("click", () => UIManager.mostrarProduccion(this.pythonData));
        btn.ratings.addEventListener("click", () => UIManager.mostrarCalificaciones(this.pythonData));
        btn.awards.addEventListener("click", () => UIManager.mostrarPremios(this.pythonData));
        btn.plot.addEventListener("click", () => UIManager.mostrarSinopsis(this.pythonData));
        btn.clear.addEventListener("click", () => {
            document.getElementById("result-container").innerHTML = `
                <div class="welcome-card">
                    <pre class="ascii-art">  ____        _   _
 |  _ \ _   _| |_| |__   ___  _ __
 | |_) | | | | __| '_ \ / _ \| '_ \
 |  __/| |_| | |_| | | | (_) | | | |
 |_|    \__, |\__|_| |_|\___/|_| |_|
         |___/</pre>
                    <h3>Bienvenido al Python Info Center</h3>
                    <p>Explora <strong>todos</strong> los títulos relacionados con Python en OMDb.</p>
                    <p class="hint"># Selecciona una categoría arriba para comenzar</p>
                </div>
            `;
        });
    }

    async _cargarAplicacion() {
        console.log("[App] Cargando datos de la API...");
        try {
            // Verificar que UIManager existe
            if (typeof UIManager === 'undefined') {
                console.error("[App] UIManager no está definido");
                return;
            }
            
            this.pythonData = await ApiService.obtenerTodosPython();
            console.log(`[App] ${this.pythonData.length} resultados cargados`);
            
            if (this.pythonData.length > 0) {
                // Mostrar automáticamente la información general
                UIManager.mostrarInformacionGeneral(this.pythonData);
            }
        } catch (error) {
            console.error("[App] Error cargando datos:", error);
            const container = document.getElementById("result-container");
            if (container) {
                container.innerHTML = `
                    <div class="error-message" style="color: #ff6b6b; text-align: center; padding: 2rem;">
                        <p>❌ Error al cargar los datos</p>
                        <p style="font-size: 0.8rem; color: #888;">${error.message}</p>
                    </div>
                `;
            }
        }
    }
}

// Iniciar aplicación cuando el DOM esté listo
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        console.log("[App] DOMContentLoaded - iniciando...");
        new AppController();
    });
} else {
    console.log("[App] DOM ya cargado - iniciando...");
    new AppController();
}