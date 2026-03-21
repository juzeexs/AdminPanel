import { useState, useCallback, useRef } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
  AreaChart, Area,
} from "recharts";
import "./App.css";
import {
  kpiData, dadosVendas, dadosCategorias, dadosBarras,
  dadosAcumulado, dadosConversao, dadosTicket,
  canais, pedidos, clientes, resumoMes,
} from "./dados.js";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const badgeCls = {
  Pago:      "b-pago",
  Enviado:   "b-enviado",
  Pendente:  "b-pendente",
  Cancelado: "b-cancelado",
  Ativo:     "b-ativo",
  Inativo:   "b-inativo",
};

const fmtBRL = (v) =>
  v >= 1000 ? "R$" + (v / 1000).toFixed(0) + "k" : "R$" + v;

/* ─────────────────────────────────────────
   TOOLTIP CUSTOMIZADO
───────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "8px 12px", fontSize: 12,
      boxShadow: "var(--shadow)",
    }}>
      <p style={{ color: "var(--sub)", marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color ?? p.stroke, margin: "2px 0" }}>
          {p.name}: {typeof p.value === "number" && p.value >= 1000 ? fmtBRL(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   VIEW: DASHBOARD
───────────────────────────────────────── */
function ViewDashboard({ onNavigate }) {
  const [period, setPeriod] = useState("30");
  const kpi = kpiData[period];

  const kpiCards = [
    { label: "Receita Total",   id: "receita",       icon: "💰", kpiColor: "var(--accent)", kpiBg: "var(--accent-glow)", ...kpi.receita },
    { label: "Novos Pedidos",   id: "pedidos",       icon: "🛒", kpiColor: "var(--green)",  kpiBg: "var(--green-bg)",    ...kpi.pedidos },
    { label: "Novos Clientes",  id: "clientes",      icon: "👥", kpiColor: "var(--amber)",  kpiBg: "var(--amber-bg)",    ...kpi.clientes },
    { label: "Cancelamentos",   id: "cancelamentos", icon: "📉", kpiColor: "var(--red)",    kpiBg: "var(--red-bg)",      ...kpi.cancelamentos },
  ];

  return (
    <div className="view">
      {/* KPIs */}
      <div>
        <div className="sec-header" style={{ marginBottom: 14 }}>
          <div className="sec-title">Visão Geral</div>
          <select className="period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </div>
        <div className="kpi-grid">
          {kpiCards.map((k) => (
            <div
              key={k.id}
              className="kpi"
              style={{ "--kpi-color": k.kpiColor, "--kpi-bg": k.kpiBg }}
            >
              <div className="kpi-icon" style={{ background: k.kpiBg }}>{k.icon}</div>
              <div className="kpi-info">
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-val">{k.valor}</div>
                <div className={`kpi-delta ${k.up ? "up" : "down"}`}>
                  {k.up ? "▲" : "▼"} {k.delta} vs anterior
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts principais */}
      <div className="charts-main">
        {/* Vendas vs Lucro */}
        <div className="chart-card">
          <div className="mini-stats">
            <div className="mini-stat"><span className="ms-val">R$ 84k</span><span className="ms-label">Vendas totais</span></div>
            <div className="mini-stat"><span className="ms-val">R$ 31k</span><span className="ms-label">Lucro líquido</span></div>
            <div className="mini-stat"><span className="ms-val">36,8%</span><span className="ms-label">Margem</span></div>
          </div>
          <h3>Vendas vs Lucro</h3>
          <div className="chart-wrap" style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dadosVendas} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="nome" tick={{ fontSize: 11, fill: "var(--sub)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtBRL} tick={{ fontSize: 11, fill: "var(--sub)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="vendas" name="Vendas" fill="rgba(67,24,255,0.75)" radius={[6, 6, 0, 0]} />
                <Line dataKey="lucros" name="Lucro" type="monotone" stroke="#05cd99" strokeWidth={2} dot={{ r: 3, fill: "#05cd99" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categorias donut */}
        <div className="chart-card">
          <h3>Categorias</h3>
          <div className="chart-wrap" style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosCategorias}
                  cx="50%" cy="50%"
                  innerRadius="55%" outerRadius="80%"
                  dataKey="value" paddingAngle={2}
                >
                  {dadosCategorias.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [v, n]}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {dadosCategorias.map((c) => (
              <span key={c.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--sub)" }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: c.color, display: "inline-block" }} />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Charts secundários */}
      <div className="charts-sec">
        {/* Metas trimestrais */}
        <div className="chart-card">
          <h3>Metas Trimestrais</h3>
          <div className="chart-wrap" style={{ height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dadosBarras} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="trimestre" tick={{ fontSize: 11, fill: "var(--sub)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => "R$" + (v / 1000).toFixed(0) + "k"} tick={{ fontSize: 11, fill: "var(--sub)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="meta"      name="Meta"      fill="rgba(67,24,255,0.2)"  radius={[6, 6, 0, 0]} />
                <Bar dataKey="realizado" name="Realizado" fill="rgba(67,24,255,0.85)" radius={[6, 6, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Origem de tráfego */}
        <div className="chart-card">
          <h3>Origem de Tráfego</h3>
          <div className="channels">
            {canais.map((c) => (
              <div key={c.nome} className="channel-row">
                <span className="ch-name">{c.nome}</span>
                <div className="ch-bar">
                  <div className="ch-fill" style={{ width: `${c.pct}%`, background: c.cor }} />
                </div>
                <span className="ch-pct">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela pedidos recentes */}
      <div className="table-card">
        <div className="table-header">
          <div className="sec-title">Pedidos Recentes</div>
          <button className="btn-link" onClick={() => onNavigate("orders")}>Ver todos →</button>
        </div>
        <div className="table-wrap">
          <TabelaPedidos lista={pedidos.slice(0, 4)} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENTE: TABELA DE PEDIDOS (reutilizável)
───────────────────────────────────────── */
function TabelaPedidos({ lista }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Cliente</th><th>Produto</th>
          <th>Valor</th><th>Status</th><th>Data</th>
        </tr>
      </thead>
      <tbody>
        {lista.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "var(--sub)" }}>
              Nenhum pedido encontrado
            </td>
          </tr>
        ) : (
          lista.map((o) => (
            <tr key={o.id}>
              <td className="td-id">#{o.id}</td>
              <td className="td-name">{o.cliente}</td>
              <td className="td-prod">{o.produto}</td>
              <td className="td-val">R$ {o.valor.toLocaleString("pt-BR")}</td>
              <td><span className={`badge ${badgeCls[o.status] || ""}`}>{o.status}</span></td>
              <td style={{ color: "var(--sub)" }}>{o.data}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

/* ─────────────────────────────────────────
   VIEW: PEDIDOS
───────────────────────────────────────── */
function ViewPedidos({ searchQuery }) {
  const [busca, setBusca] = useState(searchQuery || "");
  const [statusFiltro, setStatusFiltro] = useState("");

  const lista = pedidos.filter((p) => {
    const q = busca.toLowerCase().trim();
    return (
      (!statusFiltro || p.status === statusFiltro) &&
      (!q || p.cliente.toLowerCase().includes(q) || p.produto.toLowerCase().includes(q))
    );
  });

  return (
    <div className="view">
      <div className="sec-header">
        <div className="sec-title">Todos os Pedidos</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="search-input"
            placeholder="Buscar cliente ou produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: 220 }}
          />
          <select className="period-select" value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="Pago">Pago</option>
            <option value="Enviado">Enviado</option>
            <option value="Pendente">Pendente</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>
      <div className="table-card">
        <div className="table-wrap">
          <TabelaPedidos lista={lista} />
        </div>
        <div className="table-footer">
          <span>{lista.length} pedido(s) encontrado(s)</span>
          <div className="page-btns">
            {[1, 2, 3].map((n) => (
              <button key={n} className={`page-btn${n === 1 ? " active" : ""}`}>{n}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   VIEW: MÉTRICAS
───────────────────────────────────────── */
function ViewMetricas() {
  return (
    <div className="view">
      <div className="sec-header">
        <div className="sec-title">Métricas Detalhadas</div>
      </div>

      <div className="charts-sec">
        {/* Conversão por mês */}
        <div className="chart-card">
          <h3>Conversão por Mês (%)</h3>
          <div className="chart-wrap" style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosConversao} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "var(--sub)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => v + "%"} tick={{ fontSize: 11, fill: "var(--sub)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area dataKey="pct" name="Conversão" type="monotone" stroke="#4318ff" fill="rgba(67,24,255,0.08)" strokeWidth={2} dot={{ r: 4, fill: "#4318ff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ticket médio */}
        <div className="chart-card">
          <h3>Ticket Médio (R$)</h3>
          <div className="chart-wrap" style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dadosTicket} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "var(--sub)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => "R$" + v} tick={{ fontSize: 11, fill: "var(--sub)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="valor" name="Ticket Médio" fill="rgba(5,205,153,0.75)" radius={[6, 6, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="charts-main">
        {/* Receita acumulada */}
        <div className="chart-card">
          <h3>Receita Acumulada 2025</h3>
          <div className="chart-wrap" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosAcumulado} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "var(--sub)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtBRL} tick={{ fontSize: 11, fill: "var(--sub)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area dataKey="valor" name="Receita" type="monotone" stroke="#4318ff" fill="rgba(67,24,255,0.07)" strokeWidth={2} dot={{ r: 4, fill: "#4318ff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resumo do mês */}
        <div className="chart-card">
          <h3>Resumo do Mês</h3>
          <div className="metric-mini-list">
            {resumoMes.map((m) => (
              <div key={m.label} className="metric-mini" style={{ "--kpi-color": m.color }}>
                <div className="m-icon" style={{ background: m.bg }}>{m.icon}</div>
                <div className="kpi-info">
                  <div className="kpi-label">{m.label}</div>
                  <div className="kpi-val" style={{ fontSize: 17 }}>{m.valor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   VIEW: CLIENTES
───────────────────────────────────────── */
function ViewClientes() {
  const [filtro, setFiltro] = useState("");
  const lista = filtro ? clientes.filter((c) => c.status === filtro) : clientes;

  return (
    <div className="view">
      <div className="sec-header">
        <div className="sec-title">Clientes</div>
        <select className="period-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todos</option>
          <option value="Ativo">Ativos</option>
          <option value="Inativo">Inativos</option>
        </select>
      </div>
      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th><th>E-mail</th><th>Cidade</th>
                <th>Pedidos</th><th>Total</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                <tr key={c.email}>
                  <td className="td-name">{c.nome}</td>
                  <td className="td-prod">{c.email}</td>
                  <td style={{ color: "var(--sub)" }}>{c.cidade}</td>
                  <td style={{ fontWeight: 700, color: "var(--text)" }}>{c.pedidos}</td>
                  <td className="td-val">{c.total}</td>
                  <td><span className={`badge ${badgeCls[c.status] || ""}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>{lista.length} cliente(s)</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   APP PRINCIPAL
───────────────────────────────────────── */
export default function App() {
  const [activeView, setActiveView]   = useState("dash");
  const [dark, setDark]               = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topSearch, setTopSearch]     = useState("");
  const [pendingSearch, setPendingSearch] = useState("");

  const titles = {
    dash:     "Dashboard",
    orders:   "Pedidos",
    metrics:  "Métricas",
    clientes: "Clientes",
  };

  const handleTheme = () => {
    const next = !dark;
    setDark(next);
    document.body.setAttribute("data-theme", next ? "dark" : "");
  };

  const navigate = useCallback((view) => {
    setActiveView(view);
    setSidebarOpen(false);
  }, []);

  const handleTopSearch = (val) => {
    setTopSearch(val);
    if (val.trim()) {
      setPendingSearch(val);
      navigate("orders");
      setTopSearch("");
    }
  };

  const navItems = [
    { id: "dash",     label: "Dashboard", icon: "📊", section: "Principal" },
    { id: "orders",   label: "Pedidos",   icon: "🛒", section: null, badge: 6 },
    { id: "metrics",  label: "Métricas",  icon: "📈", section: "Análise" },
    { id: "clientes", label: "Clientes",  icon: "👥", section: null },
  ];

  // Agrupar por seção
  const sections = [];
  let currentSection = null;
  navItems.forEach((item) => {
    if (item.section && item.section !== currentSection) {
      currentSection = item.section;
      sections.push({ type: "section", label: item.section });
    }
    sections.push({ type: "item", ...item });
  });

  return (
    <>
      {/* Overlay mobile */}
      <div className={`overlay${sidebarOpen ? " show" : ""}`} onClick={() => setSidebarOpen(false)} />

      <div className="app">
        {/* ── SIDEBAR ── */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="sidebar-brand">
            <div className="brand-icon">LA</div>
            <div>
              <div className="brand-name">LiteAdmin</div>
              <div className="brand-tag">Painel de Gestão</div>
            </div>
          </div>

          <div className="sidebar-section">Principal</div>
          <button className={`nav-btn${activeView === "dash" ? " active" : ""}`} onClick={() => navigate("dash")}>
            <span className="nav-icon">📊</span> Dashboard
          </button>
          <button className={`nav-btn${activeView === "orders" ? " active" : ""}`} onClick={() => navigate("orders")}>
            <span className="nav-icon">🛒</span> Pedidos
            <span className="nav-badge">6</span>
          </button>

          <div className="sidebar-section">Análise</div>
          <button className={`nav-btn${activeView === "metrics" ? " active" : ""}`} onClick={() => navigate("metrics")}>
            <span className="nav-icon">📈</span> Métricas
          </button>
          <button className={`nav-btn${activeView === "clientes" ? " active" : ""}`} onClick={() => navigate("clientes")}>
            <span className="nav-icon">👥</span> Clientes
          </button>

          <div className="sidebar-section">Sistema</div>
          <button className="nav-btn" onClick={handleTheme}>
            <span className="nav-icon">{dark ? "☀️" : "🌙"}</span> Alternar Tema
          </button>

          <div className="sidebar-spacer" />

          <div className="sidebar-user">
            <div className="user-av">AD</div>
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-role">Administrador</div>
            </div>
            <button className="user-opts" title="Configurações">⚙️</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          {/* Topbar */}
          <div className="topbar">
            <button className="hamburger" onClick={() => setSidebarOpen((v) => !v)} aria-label="Menu">
              <span /><span /><span />
            </button>
            <div className="page-title">{titles[activeView]}</div>
            <div className="search-wrap">
              <span style={{ color: "var(--sub)", fontSize: 14, flexShrink: 0 }}>🔍</span>
              <input
                type="text"
                placeholder="Buscar..."
                value={topSearch}
                onChange={(e) => setTopSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTopSearch(topSearch)}
              />
            </div>
            <button className="topbar-btn" title="Notificações" onClick={() => alert("3 notificações pendentes")}>
              🔔<span className="notif-dot" />
            </button>
            <button className="topbar-btn" onClick={handleTheme} title="Alternar tema">
              {dark ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Content */}
          <div className="body">
            {activeView === "dash"     && <ViewDashboard onNavigate={navigate} />}
            {activeView === "orders"   && <ViewPedidos searchQuery={pendingSearch} />}
            {activeView === "metrics"  && <ViewMetricas />}
            {activeView === "clientes" && <ViewClientes />}
          </div>
        </div>
      </div>
    </>
  );
}