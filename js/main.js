// Controlador principal
class AppController {
    constructor() {
        this.pythonData = [];
        this.buttons = this._obtenerBotones();
        this._inicializarEventos();
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

    _inicializarEventos() {
        document.addEventListener("DOMContentLoaded", () => this._cargarAplicacion());
    }

    async _cargarAplicacion() {
        this.pythonData = await ApiService.obtenerTodosPython();
        console.log(`${this.pythonData.length} resultados cargados:`, this.pythonData);

        // Asignar eventos
        this.buttons.general.addEventListener("click", () => UIManager.mostrarInformacionGeneral(this.pythonData));
        this.buttons.cast.addEventListener("click", () => UIManager.mostrarReparto(this.pythonData));
        this.buttons.production.addEventListener("click", () => UIManager.mostrarProduccion(this.pythonData));
        this.buttons.ratings.addEventListener("click", () => UIManager.mostrarCalificaciones(this.pythonData));
        this.buttons.awards.addEventListener("click", () => UIManager.mostrarPremios(this.pythonData));
        this.buttons.plot.addEventListener("click", () => UIManager.mostrarSinopsis(this.pythonData));
        this.buttons.clear.addEventListener("click", () => {
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
}

// Iniciar aplicación
document.addEventListener("DOMContentLoaded", () => {
    const app = new AppController();
});