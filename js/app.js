// app de busqueda de peliculas

const apiKey = '4bca1acc7fc125e6bd15772c2e0bc964'; //clave de API de TMDb

//Filtros de peliculas
const app = Vue.createApp({
  data() {
    return {
      peliculas: [],
      peliculasPopulares: [],
      consulta: '',
      peliculaSeleccionada: null,
      favoritos: [],
      generoSeleccionado: '',
      generos: [
        { id: 28, name: 'Acción' },
        { id: 12, name: 'Aventura' },
        { id: 16, name: 'Animación' },
        { id: 35, name: 'Comedia' },
        { id: 80, name: 'Crimen' },
        { id: 99, name: 'Documental' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Familiar' },
        { id: 14, name: 'Fantasía' },
        { id: 36, name: 'Historia' },
        { id: 27, name: 'Terror' },
        { id: 10402, name: 'Música' },
        { id: 9648, name: 'Misterio' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Ciencia ficción' },
        { id: 10770, name: 'Película de TV' },
        { id: 53, name: 'Suspenso' },
        { id: 10752, name: 'Bélica' },
        { id: 37, name: 'Western' }
      ],
      mostrarPeliculasPopulares: true,
      mensajeError: '',
      mensajeAlerta: null
    };
  },

  //consultas a la api, mediante fetch
  methods: {
    async buscarPeliculas() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${this.consulta}&language=es-ES&page=1&api_key=${apiKey}`);
        const data = await response.json();
        this.peliculas = data.results;
        this.mostrarPeliculasPopulares = false;
        if (this.peliculas.length === 0) {
          this.mensajeError = 'No se encontraron resultados para tu búsqueda.';
        } else {
          this.mensajeError = '';
        }
      } catch (error) {
        console.error('Error al buscar películas:', error);
        this.mensajeError = 'Ocurrió un error al realizar la búsqueda. Intenta nuevamente.';
      }
    },
    async obtenerPeliculasPopulares() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1&api_key=${apiKey}`);
        const data = await response.json();
        this.peliculasPopulares = data.results;
      } catch (error) {
        console.error('Error al obtener películas populares:', error);
      }
    },
    async obtenerDetallesPelicula(id) {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=es-ES&api_key=${apiKey}`);
        const data = await response.json();
        this.peliculaSeleccionada = data;
      } catch (error) {
        console.error('Error al obtener detalles de la película:', error);
      }
    },
    agregarAFavoritos(pelicula) {
      if (!this.esFavorita(pelicula.id)) {
        this.favoritos.push(pelicula);
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
        this.mostrarAlerta('success', 'Película agregada a favoritos');
      }
    },
    eliminarDeFavoritos(id) {
      this.favoritos = this.favoritos.filter(pelicula => pelicula.id !== id);
      localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
      this.mostrarAlerta('danger', 'Película eliminada de favoritos');
    },
    esFavorita(id) {
      return this.favoritos.some(p => p.id === id);
    },
    cargarFavoritos() {
      const favoritosGuardados = localStorage.getItem('favoritos');
      if (favoritosGuardados) {
        this.favoritos = JSON.parse(favoritosGuardados);
      }
    },
    filtrarPorGenero() {
      if (!this.generoSeleccionado) {
        this.obtenerPeliculasPopulares();
      } else {
        this.buscarPeliculasPorGenero();
      }
    },
    async buscarPeliculasPorGenero() {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${this.generoSeleccionado}&language=es-ES&page=1&api_key=${apiKey}`);
        const data = await response.json();
        this.peliculas = data.results;
        this.mostrarPeliculasPopulares = false;
      } catch (error) {
        console.error('Error al buscar películas por género:', error);
        this.mensajeError = 'Ocurrió un error al realizar la búsqueda por género. Intenta nuevamente.';
      }
    },
    mostrarAlerta(tipo, texto) {
      this.mensajeAlerta = { tipo: `alert-${tipo}`, texto: texto };
      setTimeout(() => {
        this.mensajeAlerta = null;
      }, 3000);
    }    
  },
  created() {
    this.obtenerPeliculasPopulares();
    this.cargarFavoritos();
  }
});

app.mount('#app');




