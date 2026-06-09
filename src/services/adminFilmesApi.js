import axios from 'axios';
import { ADMIN_API_URL } from '../config/api';

const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

/** CRUD — servidor do administrador (porta 3001, mesmo db.json) */
export const getFilmes = () => adminApi.get('/filmes');

export const getFilmeById = (id) => adminApi.get(`/filmes/${id}`);

export const createFilme = (filme) =>
  adminApi.post('/filmes', { ...filme, favorito: false });

export const deleteFilme = (id) => adminApi.delete(`/filmes/${id}`);

export const updateFilme = (id, data) => adminApi.patch(`/filmes/${id}`, data);

export default adminApi;
