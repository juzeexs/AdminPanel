# AdminPanel Pro 🚀

Dashboard admin completo em React com design profissional.

## ✨ Funcionalidades

- 🔐 **Autenticação** — Login com validação e feedback visual
- 🌙 **Dark Mode** — Alternância suave com persistência no localStorage
- 📱 **Responsivo** — Layout adaptável para mobile, tablet e desktop
- ✨ **Animações** — Transições e micro-interações em CSS puro
- 📊 **Gráficos** — Area chart e Donut chart com Recharts
- 🗂️ **Sidebar** — Navegação lateral com menu hambúrguer no mobile
- 📋 **Tabela** — Pedidos recentes com badges de status

## 🛠️ Stack

- **React 18** + **Vite**
- **CSS Modules** (sem Tailwind, sem Styled Components)
- **Recharts** — gráficos
- **Lucide React** — ícones
- **Google Fonts** — Syne + DM Sans

## 🚀 Como rodar

```bash
npm install
npm run dev
```

## 🔑 Credenciais de demo

| Email | Senha |
|-------|-------|
| admin@panel.com | admin123 |
| jose@senai.br | jose123 |

## 📁 Estrutura

```
src/
├── components/
│   ├── Login/       # Tela de autenticação
│   ├── Sidebar/     # Navegação lateral
│   ├── Header/      # Barra superior
│   ├── Cards/       # Stat cards
│   ├── Charts/      # Gráficos Recharts
│   └── Table/       # Tabela de pedidos
├── context/
│   ├── AuthContext  # Estado de autenticação
│   └── ThemeContext # Dark/light mode
├── pages/
│   ├── Dashboard    # Página principal
│   └── Placeholder  # Demais seções
└── styles/
    └── global.css   # Variáveis CSS e reset
```
