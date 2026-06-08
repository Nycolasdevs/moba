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

Entre na pasta do app:

```bash
cd MobaApp_updated
```

Instale as dependencias:

```bash
npm install
```

Em um terminal, inicie os servidores do `db.json`:

```bash
npm run server
```

Em outro terminal, inicie o app Expo:

```bash
npm start
```

Escaneie o QR code com o app **Expo Go** no celular.

## Funcionalidades

- 🎬 Filmes com dados completos (IMDB, elenco, diretor, classificação etária)
- 🔥 Rows temáticos: Em Alta, Ação, Ficção, Terror, Aventura, Drama
- 🔍 Busca por título, gênero, descrição, diretor e elenco
- 📋 Minha Lista — adicionar/remover com estado global sincronizado entre telas
- 👤 Perfil com contador de lista em tempo real
- ⭐ Modal rico com nota IMDB, estrelas, elenco completo e diretor
