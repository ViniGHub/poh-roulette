# POH Roulette

Aplicação React com TypeScript que simula uma roleta interativa. Os usuários podem adicionar itens, salvar/carregar presets, girar a roleta com animação natural e ouvir sons durante a experiência.

## Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Framer Motion** para animações fluidas
- **Lucide React** para ícones modernos
- **Web Audio API** para sons

## Estrutura do Projeto

```
src/
├── components/
│   ├── RouletteWheel.tsx    # Componente principal da roleta
│   ├── ItemManager.tsx      # Gerenciamento de itens
│   ├── SettingsPanel.tsx    # Painel de configurações
│   └── WinnerModal.tsx      # Modal do vencedor
├── hooks/
│   └── useLocalStorage.ts   # Hook para persistência
├── utils/
│   └── audio.ts            # Utilitários de áudio
├── App.tsx                 # Componente principal
├── main.tsx               # Ponto de entrada
└── index.css             # Estilos globais
```

## Como executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação e execução

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

O app estará disponível em `http://localhost:5173`

## Funcionalidades

### Interface Principal
- **Layout lateralizado**: Controles fixos à direita, roleta centralizada
- **Design moderno**: Gradientes, glassmorphism, animações suaves
- **Responsivo**: Funciona em desktop e mobile

### Gerenciamento de Itens
- Adicionar itens pela sidebar
- Remover itens individualmente
- Visualizar cores únicas para cada item
- Limpar todos os itens

### Roleta
- Animação natural com desaceleração (easing cubic out)
- Seleção aleatória garantida
- Pointer fixo no topo para indicar o vencedor
- Canvas responsivo com alta resolução

### Sons
- Som de início ao girar (sweep crescente)
- Ticks durante a rotação (conforme passa pelas divisões)
- Toggle para habilitar/desabilitar áudio

### Configurações
- Ajuste de velocidade da roleta (2-8 segundos)
- Toggle de som
- Configurações persistem no localStorage

### Presets
- Salvar listas de itens com nome personalizado
- Carregar presets salvos
- Persistência no localStorage

### Modal de Resultado
- Animação de entrada suave
- Ícone de troféu
- Mostra o item vencedor com sua cor
- Efeito de confetti (implementação futura)

## Decisões Técnicas

### Canvas vs SVG
Escolhemos Canvas para a roleta por permitir animações mais fluidas e melhor performance com muitos itens.

### Framer Motion
Utilizada para animações de entrada, modal e transições suaves entre estados.

### Web Audio API
Sons gerados programaticamente para manter o projeto self-contained, sem necessidade de arquivos de áudio externos.

### TypeScript
Tipos rigorosos garantem melhor developer experience e menos bugs em runtime.

### Tailwind CSS
Classes utilitárias permitem estilização rápida e consistente, com tema personalizado para cores da aplicação.

## Próximas Melhorias

- [ ] Drag & drop para reordenar itens
- [ ] Import/export de presets via JSON
- [ ] Temas personalizáveis (claro/escuro)
- [ ] Imagens personalizadas nas fatias
- [ ] Histórico de resultados
- [ ] Animação de confetti real
- [ ] PWA (Progressive Web App)
- [ ] Suporte a categorias/grupos de itens
# poh-roulette