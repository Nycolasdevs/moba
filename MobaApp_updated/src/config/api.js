import { Platform } from 'react-native';

const getHost = () => {
  if (Platform.OS === 'android') return '10.0.2.2';
  return 'localhost';
};

/** Servidor do catálogo do usuário (somente leitura + favoritos) */
export const USER_API_URL = `http://${getHost()}:3000`;

/** Servidor do administrador (CRUD completo — reflete no catálogo do usuário) */
export const ADMIN_API_URL = `http://${getHost()}:3001`;
