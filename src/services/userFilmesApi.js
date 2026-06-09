import axios from 'axios';
import { USER_API_URL } from '../config/api';

const userApi = axios.create({
  baseURL: USER_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

/** Catálogo — servidor do usuário (porta 3000) */
export const getFilmes = () => userApi.get('/filmes');

export const getFilmeById = (id) => userApi.get(`/filmes/${id}`);

export const getFilmesFavoritos = () => userApi.get('/filmes?favorito=true');

/** Favoritos — PATCH no servidor do usuário (espelhado no admin via mesmo db.json) */
export const toggleFavorito = (id, favorito) =>
  userApi.patch(`/filmes/${id}`, { favorito });

export default userApi;
