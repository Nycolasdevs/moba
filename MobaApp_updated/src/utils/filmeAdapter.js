const GENRE_COLORS = {
  Ação: ['#3a0808', '#1a0a0a'],
  Drama: ['#1a1a2e', '#16213e'],
  'Ficção Científica': ['#0d1b3e', '#1b2a4e'],
  Terror: ['#1a0a1a', '#2d0a0a'],
  Comédia: ['#1a2e1a', '#0a1a0a'],
  Romance: ['#2e1a2e', '#1a0a2e'],
};

export function adaptFilme(filme) {
  const generos = Array.isArray(filme.genero)
    ? filme.genero
    : [filme.genero].filter(Boolean);

  return {
    ...filme,
    title: filme.titulo,
    genre: generos,
    year: filme.ano,
    rating: filme.rating || '95%',
    desc:
      filme.desc ||
      `${filme.titulo} (${filme.ano}) — ${generos.join(', ')}.`,
    duration: filme.duration || '2h 00min',
    ageRating: filme.ageRating || '14+',
    colors: filme.colors || GENRE_COLORS[generos[0]] || ['#2a2a2a', '#141414'],
    emoji: filme.emoji || '🎬',
    imdb: filme.imdb || '8.0',
    cast: filme.cast || [],
    director: filme.director || '',
    featured: Boolean(filme.featured),
  };
}

export function buildRows(filmes) {
  const adapted = filmes.map(adaptFilme);
  if (adapted.length === 0) return [];

  return [
    {
      id: 'trending',
      label: '🔥 Em Alta Agora',
      movies: adapted.slice(0, 6),
    },
    {
      id: 'acao',
      label: '💥 Ação',
      movies: adapted.filter((m) => m.genre.includes('Ação')),
    },
    {
      id: 'drama',
      label: '🎭 Drama',
      movies: adapted.filter((m) => m.genre.includes('Drama')),
    },
    {
      id: 'ficcao',
      label: '🚀 Ficção Científica',
      movies: adapted.filter((m) => m.genre.includes('Ficção Científica')),
    },
    {
      id: 'comedia',
      label: '😂 Comédia',
      movies: adapted.filter((m) => m.genre.includes('Comédia')),
    },
    {
      id: 'all',
      label: '📺 Catálogo Completo',
      movies: adapted,
    },
  ].filter((row) => row.movies.length > 0);
}

export const MOVIE_GENRES = [
  'Ação',
  'Drama',
  'Ficção Científica',
  'Terror',
  'Comédia',
  'Romance',
];

export const GENRES = ['Todos', ...MOVIE_GENRES];
