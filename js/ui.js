// UI Manager
const UIManager = {
    // Helpers
    obtenerValorSeguro(valor) {
        return valor && valor !== "N/A" ? valor : "No disponible";
    },

    obtenerPosterSeguro(poster) {
        // ✅ Si no hay poster, usa un icono existente
        return poster && poster !== "N/A" ? poster : "./icons/icon-192x192.png";
    },

    // Renderizado de tarjetas
    renderizarTarjetas(lista, campoCallback) {
        const resultContainer = document.getElementById("result-container");

        if (!lista || lista.length === 0) {
            resultContainer.innerHTML = `<p class="sin-resultados">No se encontraron resultados.</p>`;
            return;
        }

        const listaValida = lista.filter(item => item !== null);
        
        if (listaValida.length === 0) {
            resultContainer.innerHTML = `<p class="sin-resultados">No se pudieron cargar los datos.</p>`;
            return;
        }

        const tarjetas = listaValida.map(data => campoCallback(data)).join("");
        resultContainer.innerHTML = `<div class="cards-grid">${tarjetas}</div>`;
    },

    // Vistas por categoría - ✅ TODAS con clase "vertical"
    mostrarInformacionGeneral(lista) {
        this.renderizarTarjetas(lista, (data) => `
            <div class="info-card vertical">
                <img class="poster" src="${this.obtenerPosterSeguro(data.Poster)}" alt="${data.Title}">
                <div class="info-content">
                    <h3>${data.Title}</h3>
                    <p><strong>Año:</strong> ${this.obtenerValorSeguro(data.Year)}</p>
                    <p><strong>Tipo:</strong> ${this.obtenerValorSeguro(data.Type)}</p>
                    <p><strong>Género:</strong> ${this.obtenerValorSeguro(data.Genre)}</p>
                    <p><strong>Duración:</strong> ${this.obtenerValorSeguro(data.Runtime)}</p>
                    <p><strong>País:</strong> ${this.obtenerValorSeguro(data.Country)}</p>
                    <p><strong>Idioma:</strong> ${this.obtenerValorSeguro(data.Language)}</p>
                    ${data.totalSeasons ? `<p><strong>Temporadas:</strong> ${data.totalSeasons}</p>` : ""}
                </div>
            </div>
        `);
    },

    mostrarReparto(lista) {
        this.renderizarTarjetas(lista, (data) => `
            <div class="info-card vertical">
                <img class="poster" src="${this.obtenerPosterSeguro(data.Poster)}" alt="${data.Title}">
                <div class="info-content">
                    <h3>${data.Title} <span class="year-badge">${data.Year}</span></h3>
                    <p><strong>Reparto:</strong> ${this.obtenerValorSeguro(data.Actors)}</p>
                </div>
            </div>
        `);
    },

    mostrarProduccion(lista) {
        this.renderizarTarjetas(lista, (data) => `
            <div class="info-card vertical">
                <img class="poster" src="${this.obtenerPosterSeguro(data.Poster)}" alt="${data.Title}">
                <div class="info-content">
                    <h3>${data.Title} <span class="year-badge">${data.Year}</span></h3>
                    <p><strong>Director:</strong> ${this.obtenerValorSeguro(data.Director)}</p>
                    <p><strong>Escritor:</strong> ${this.obtenerValorSeguro(data.Writer)}</p>
                    <p><strong>País:</strong> ${this.obtenerValorSeguro(data.Country)}</p>
                    <p><strong>Idioma:</strong> ${this.obtenerValorSeguro(data.Language)}</p>
                </div>
            </div>
        `);
    },

    mostrarCalificaciones(lista) {
        this.renderizarTarjetas(lista, (data) => {
            const ratingsHTML = (data.Ratings || []).map(r =>
                `<p><strong>${r.Source}:</strong> ${r.Value}</p>`
            ).join("");

            return `
            <div class="info-card vertical">
                <img class="poster" src="${this.obtenerPosterSeguro(data.Poster)}" alt="${data.Title}">
                <div class="info-content">
                    <h3>${data.Title} <span class="year-badge">${data.Year}</span></h3>
                    ${ratingsHTML}
                    <p><strong>IMDb:</strong> ${this.obtenerValorSeguro(data.imdbRating)}</p>
                    <p><strong>Votos:</strong> ${this.obtenerValorSeguro(data.imdbVotes)}</p>
                </div>
            </div>
            `;
        });
    },

    mostrarPremios(lista) {
        this.renderizarTarjetas(lista, (data) => `
            <div class="info-card vertical">
                <img class="poster" src="${this.obtenerPosterSeguro(data.Poster)}" alt="${data.Title}">
                <div class="info-content">
                    <h3>${data.Title} <span class="year-badge">${data.Year}</span></h3>
                    <p>${this.obtenerValorSeguro(data.Awards)}</p>
                </div>
            </div>
        `);
    },

    mostrarSinopsis(lista) {
        this.renderizarTarjetas(lista, (data) => `
            <div class="info-card vertical">
                <img class="poster" src="${this.obtenerPosterSeguro(data.Poster)}" alt="${data.Title}">
                <div class="info-content">
                    <h3>${data.Title} <span class="year-badge">${data.Year}</span></h3>
                    <p>${this.obtenerValorSeguro(data.Plot)}</p>
                </div>
            </div>
        `);
    },

    // Loading state
    mostrarCargando() {
        const resultContainer = document.getElementById("result-container");
        resultContainer.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Consultando la API OMDb<span class="dots">...</span></p>
            </div>
        `;
    }
};

// Para compatibilidad con código existente
const obtenerValorSeguro = UIManager.obtenerValorSeguro.bind(UIManager);
const obtenerPosterSeguro = UIManager.obtenerPosterSeguro.bind(UIManager);
const renderizarTarjetas = UIManager.renderizarTarjetas.bind(UIManager);
const mostrarInformacionGeneral = UIManager.mostrarInformacionGeneral.bind(UIManager);
const mostrarReparto = UIManager.mostrarReparto.bind(UIManager);
const mostrarProduccion = UIManager.mostrarProduccion.bind(UIManager);
const mostrarCalificaciones = UIManager.mostrarCalificaciones.bind(UIManager);
const mostrarPremios = UIManager.mostrarPremios.bind(UIManager);
const mostrarSinopsis = UIManager.mostrarSinopsis.bind(UIManager);
const mostrarCargando = UIManager.mostrarCargando.bind(UIManager);