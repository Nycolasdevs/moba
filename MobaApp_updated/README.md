# MOBA App

App de streaming estilo Netflix feito com React Native + Expo.

## Tecnologias

- React Native 0.76
- Expo ~52
- React Navigation (Bottom Tabs)
- Expo Linear Gradient
- Context API para estado global da lista

## Estrutura

```
src/
├── components/
│   ├── HeroSection.js     # Banner principal da home
│   ├── MovieCard.js       # Card do filme
│   ├── MovieModal.js      # Modal de detalhes (IMDB, elenco, diretor)
│   ├── MovieRow.js        # Linha horizontal de filmes
│   └── SearchBar.js       # Barra de busca
├── context/
│   └── ListContext.js     # Estado global de "Minha Lista"
├── data/
│   └── movies.js          # Catálogo completo + rows
├── navigation/
│   └── TabNavigator.js    # Navegação por abas
├── screens/
│   ├── HomeScreen.js      # Tela inicial com hero + rows
│   ├── SearchScreen.js    # Busca por título, gênero, diretor, elenco
│   ├── MyListScreen.js    # Minha lista (sincronizada globalmente)
│   └── ProfileScreen.js   # Perfil, planos, configurações
└── theme/
    └── index.js           # Cores, fontes, espaçamentos
```

## Como rodar

```bash
npm install
npx expo start
```

Escaneie o QR code com o app **Expo Go** no celular.

## Funcionalidades

- 🎬 16 filmes com dados completos (IMDB, elenco, diretor, classificação etária)
- 🔥 Rows temáticos: Em Alta, Ação, Ficção, Terror, Aventura, Drama
- 🔍 Busca por título, gênero, descrição, diretor e elenco
- 📋 Minha Lista — adicionar/remover com estado global sincronizado entre telas
- 👤 Perfil com contador de lista em tempo real
- ⭐ Modal rico com nota IMDB, estrelas, elenco completo e diretor
