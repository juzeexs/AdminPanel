import { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { dadosVendas, dadosCategorias, dadosBarras, dadosTabela } from './dados';
import './App.css';

const TEMAS = {
  roxo: {
    label: 'Roxo',
    accent: '#7c3aed',
    accentLight: '#ede9fe',
    accentGrad: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    card1: '#7c3aed', card2: '#06b6d4', card3: '#f59e0b', card4: '#10b981',
  },
  azul: {
    label: 'Azul',
    accent: '#2563eb',
    accentLight: '#dbeafe',
    accentGrad: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    card1: '#2563eb', card2: '#0891b2', card3: '#f59e0b', card4: '#10b981',
  },
  verde: {
    label: 'Verde',
    accent: '#059669',
    accentLight: '#d1fae5',
    accentGrad: 'linear-gradient(135deg, #059669, #34d399)',
    card1: '#059669', card2: '#0891b2', card3: '#f59e0b', card4: '#7c3aed',
  },
  rosa: {
    label: 'Rosa',
    accent: '#db2777',
    accentLight: '#fce7f3',
    accentGrad: 'linear-gradient(135deg, #db2777, #f472b6)',
    card1: '#db2777', card2: '#7c3aed', card3: '#f59e0b', card4: '#10b981',
  },
};

const CORES_PIE = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981'];

function ThemeButton({ tema, ativo, onClick }) {
  return (
    <button
      className={`theme-btn ${ativo ? 'ativo' : ''}`}
      style={{ background: TEMAS[tema].accentGrad }}
      onClick={() => onClick(tema)}
      title={TEMAS[tema].label}
    />
  );
}

function StatCard({ titulo, valor, sub, cor, icon }) {
  return (
    <div className="card" style={{ borderLeftColor: cor }}>
      <div className="card-icon" style={{ background: cor + '18', color: cor }}>{icon}</div>
      <div className="card-body">
        <span className="card-titulo">{titulo}</span>
        <span className="card-valor">{valor}</span>
        {sub && <span className="card-sub">{sub}</span>}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>R$ {p.value.toLocaleString('pt-BR')}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [temaSelecionado, setTemaSelecionado] = useState('roxo');
  const [menuAberto, setMenuAberto] = useState(false);
  const tema = TEMAS[temaSelecionado];

  return (
    <div className={`dashboard-root ${darkMode ? 'dark' : 'light'}`}
      style={{
        '--accent': tema.accent,
        '--accent-light': tema.accentLight,
        '--accent-grad': tema.accentGrad,
        '--card1': tema.card1,
        '--card2': tema.card2,
        '--card3': tema.card3,
        '--card4': tema.card4,
      }}>

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuAberto ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">AdminPanel</span>
        </div>
        <nav className="sidebar-nav">
          {[
            { icon: '🏠', label: 'Início' },
            { icon: '📈', label: 'Vendas' },
            { icon: '👥', label: 'Clientes' },
            { icon: '📦', label: 'Produtos' },
            { icon: '📋', label: 'Relatórios' },
            { icon: '⚙️', label: 'Configurações' },
          ].map((item, i) => (
            <a key={i} href="#" className={`nav-item ${i === 0 ? 'ativo' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar">JS</div>
          <div className="user-info">
            <span className="user-name">João Silva</span>
            <span className="user-role">Administrador</span>
          </div>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {menuAberto && <div className="overlay" onClick={() => setMenuAberto(false)} />}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
            <span /><span /><span />
          </button>
          <div className="topbar-title">
            <h1>Painel Administrativo</h1>
            <p>Bem-vindo de volta, João 👋</p>
          </div>
          <div className="topbar-actions">
            {/* SELETOR DE TEMA */}
            <div className="theme-picker">
              {Object.keys(TEMAS).map(t => (
                <ThemeButton key={t} tema={t} ativo={temaSelecionado === t} onClick={setTemaSelecionado} />
              ))}
            </div>
            {/* DARK MODE */}
            <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)} title="Alternar modo">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="dashboard-body">

          {/* CARDS DE RESUMO */}
          <section className="section">
            <h2 className="section-title">Visão Geral</h2>
            <div className="cards-grid">
              <StatCard titulo="Vendas Totais" valor="R$ 45.200" sub="↑ 12% vs. mês anterior" cor="var(--card1)" icon="💰" />
              <StatCard titulo="Novos Leads" valor="+1.240" sub="↑ 8% vs. mês anterior" cor="var(--card2)" icon="🎯" />
              <StatCard titulo="Taxa de Conversão" valor="18%" sub="↓ 2% vs. mês anterior" cor="var(--card3)" icon="📊" />
              <StatCard titulo="Clientes Ativos" valor="3.842" sub="↑ 5% vs. mês anterior" cor="var(--card4)" icon="👥" />
            </div>
          </section>

          {/* GRÁFICOS PRINCIPAIS */}
          <section className="section">
            <h2 className="section-title">Desempenho</h2>
            <div className="charts-grid-main">

              {/* ÁREA */}
              <div className="chart-box wide">
                <h3>Evolução de Vendas e Lucros</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={dadosVendas}>
                    <defs>
                      <linearGradient id="gradVendas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={tema.accent} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={tema.accent} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradLucros" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="nome" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="vendas" name="Vendas" stroke={tema.accent} fill="url(#gradVendas)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="lucros" name="Lucros" stroke="#10b981" fill="url(#gradLucros)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* PIZZA */}
              <div className="chart-box">
                <h3>Vendas por Categoria</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={dadosCategorias} innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">
                      {dadosCategorias.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `R$ ${v}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* GRÁFICO DE BARRAS */}
          <section className="section">
            <h2 className="section-title">Comparativo Trimestral</h2>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dadosBarras} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="trimestre" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="meta" name="Meta" fill="var(--border)" radius={[6,6,0,0]} />
                  <Bar dataKey="realizado" name="Realizado" fill={tema.accent} radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* TABELA DE PEDIDOS */}
          <section className="section">
            <h2 className="section-title">Últimos Pedidos</h2>
            <div className="table-box">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Cliente</th>
                      <th>Produto</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosTabela.map((row) => (
                      <tr key={row.id}>
                        <td><code>#{row.id}</code></td>
                        <td>{row.cliente}</td>
                        <td>{row.produto}</td>
                        <td><strong>R$ {row.valor.toLocaleString('pt-BR')}</strong></td>
                        <td>
                          <span className={`badge badge-${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="text-muted">{row.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}