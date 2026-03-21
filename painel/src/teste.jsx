import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import {
  dadosVendas,
  dadosCategorias,
  dadosBarras,
  dadosTabela,
} from "./dados";
import "./App.css";

Chart.register(...registerables);

/* ── Paleta de cores para os gráficos ── */
const CORES = ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#f43f5e"];

const NAV_ITEMS = [
  { icon: "📊", label: "Dashboard",   ativo: true  },
  { icon: "📦", label: "Produtos",    ativo: false },
  { icon: "👥", label: "Clientes",    ativo: false },
  { icon: "🧾", label: "Pedidos",     ativo: false },
  { icon: "📈", label: "Relatórios",  ativo: false },
  { icon: "⚙️", label: "Configurações", ativo: false },
];

const CARDS = [
  { icon: "💰", titulo: "Receita Total",   valor: "R$ 31.360", sub: "+12% este mês",   cor: "var(--card1)" },
  { icon: "🛒", titulo: "Pedidos",         valor: "1.284",     sub: "+8% este mês",    cor: "var(--card2)" },
  { icon: "👤", titulo: "Novos Clientes",  valor: "384",       sub: "+5% este mês",    cor: "var(--card3)" },
  { icon: "⭐", titulo: "Satisfação",      valor: "94,7%",     sub: "Média avaliações", cor: "var(--card4)" },
];

const TEMAS = [
  { cor: "#7c3aed", nome: "violet" },
  { cor: "#2563eb", nome: "blue"   },
  { cor: "#059669", nome: "green"  },
  { cor: "#dc2626", nome: "red"    },
];

/* ══════════════════════════════════════
   GRÁFICO DE LINHA — Vendas x Lucros
══════════════════════════════════════ */
function GraficoLinha({ dark }) {
  const ref = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    if (chart.current) chart.current.destroy();
    const labels = dadosVendas.map((d) => d.nome);
    chart.current = new Chart(ref.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Vendas",
            data: dadosVendas.map((d) => d.vendas),
            borderColor: "#7c3aed",
            backgroundColor: "rgba(124,58,237,0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#7c3aed",
          },
          {
            label: "Lucros",
            data: dadosVendas.map((d) => d.lucros),
            borderColor: "#10b981",
            backgroundColor: "rgba(16,185,129,0.08)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#10b981",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: dark ? "#94a3b8" : "#64748b", font: { size: 12 } } },
        },
        scales: {
          x: { ticks: { color: dark ? "#94a3b8" : "#64748b" }, grid: { color: dark ? "#2d3f55" : "#e2e8f0" } },
          y: {
            ticks: { color: dark ? "#94a3b8" : "#64748b", callback: (v) => "R$" + (v / 1000).toFixed(0) + "k" },
            grid: { color: dark ? "#2d3f55" : "#e2e8f0" },
          },
        },
      },
    });
    return () => chart.current?.destroy();
  }, [dark]);

  return <div style={{ position: "relative", height: 260 }}><canvas ref={ref} /></div>;
}

/* ══════════════════════════════════════
   GRÁFICO DE ROSCA — Categorias
══════════════════════════════════════ */
function GraficoRosca({ dark }) {
  const ref = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    if (chart.current) chart.current.destroy();
    chart.current = new Chart(ref.current, {
      type: "doughnut",
      data: {
        labels: dadosCategorias.map((d) => d.name),
        datasets: [{ data: dadosCategorias.map((d) => d.value), backgroundColor: CORES, borderWidth: 0, hoverOffset: 8 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: dark ? "#94a3b8" : "#64748b", font: { size: 12 }, padding: 16 },
          },
        },
      },
    });
    return () => chart.current?.destroy();
  }, [dark]);

  return <div style={{ position: "relative", height: 260 }}><canvas ref={ref} /></div>;
}

/* ══════════════════════════════════════
   GRÁFICO DE BARRAS — Metas x Realizado
══════════════════════════════════════ */
function GraficoBarras({ dark }) {
  const ref = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    if (chart.current) chart.current.destroy();
    chart.current = new Chart(ref.current, {
      type: "bar",
      data: {
        labels: dadosBarras.map((d) => d.trimestre),
        datasets: [
          { label: "Meta",      data: dadosBarras.map((d) => d.meta),      backgroundColor: "rgba(124,58,237,0.25)", borderRadius: 6 },
          { label: "Realizado", data: dadosBarras.map((d) => d.realizado),  backgroundColor: "#7c3aed",               borderRadius: 6 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: dark ? "#94a3b8" : "#64748b", font: { size: 12 } } },
        },
        scales: {
          x: { ticks: { color: dark ? "#94a3b8" : "#64748b" }, grid: { display: false } },
          y: {
            ticks: { color: dark ? "#94a3b8" : "#64748b", callback: (v) => "R$" + (v / 1000).toFixed(0) + "k" },
            grid: { color: dark ? "#2d3f55" : "#e2e8f0" },
          },
        },
      },
    });
    return () => chart.current?.destroy();
  }, [dark]);

  return <div style={{ position: "relative", height: 220 }}><canvas ref={ref} /></div>;
}

/* ══════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════ */
export default function Teste() {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [temaAtivo, setTemaAtivo] = useState("violet");

  /* Fecha sidebar ao clicar no overlay */
  const fecharSidebar = () => setSidebarOpen(false);

  const statusBadge = (s) => {
    const map = {
      Pago:      "badge badge-pago",
      Pendente:  "badge badge-pendente",
      Cancelado: "badge badge-cancelado",
      Enviado:   "badge badge-enviado",
    };
    return map[s] || "badge";
  };

  return (
    <div className={`dashboard-root ${dark ? "dark" : "light"}`}>

      {/* ── Overlay mobile ── */}
      {sidebarOpen && <div className="overlay" onClick={fecharSidebar} />}

      {/* ════════════ SIDEBAR ════════════ */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">AdminPro</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href="#" className={`nav-item ${item.ativo ? "ativo" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Administrador</span>
          </div>
        </div>
      </aside>

      {/* ════════════ MAIN ════════════ */}
      <div className="main-content">

        {/* ── Topbar ── */}
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>

          <div className="topbar-title">
            <h1>Painel de Desempenho</h1>
            <p>Bem-vindo de volta, Admin · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>

          <div className="topbar-actions">
            {/* Seletor de tema */}
            <div className="theme-picker">
              {TEMAS.map((t) => (
                <button
                  key={t.nome}
                  className={`theme-btn ${temaAtivo === t.nome ? "ativo" : ""}`}
                  style={{ background: t.cor }}
                  onClick={() => setTemaAtivo(t.nome)}
                  title={t.nome}
                />
              ))}
            </div>

            {/* Toggle dark */}
            <button className="dark-toggle" onClick={() => setDark(!dark)} title="Alternar tema">
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="dashboard-body">

          {/* CARDS */}
          <section className="section">
            <div className="section-title">Visão Geral</div>
            <div className="cards-grid">
              {CARDS.map((c) => (
                <div key={c.titulo} className="card" style={{ borderLeftColor: c.cor }}>
                  <div className="card-icon" style={{ background: c.cor + "22" }}>{c.icon}</div>
                  <div className="card-body">
                    <span className="card-titulo">{c.titulo}</span>
                    <span className="card-valor">{c.valor}</span>
                    <span className="card-sub">{c.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* GRÁFICOS LINHA + ROSCA */}
          <section className="section">
            <div className="section-title">Desempenho de Vendas</div>
            <div className="charts-grid-main">
              <div className="chart-box">
                <h3>Vendas vs Lucros (mensal)</h3>
                <GraficoLinha dark={dark} />
              </div>
              <div className="chart-box">
                <h3>Categorias</h3>
                <GraficoRosca dark={dark} />
              </div>
            </div>
          </section>

          {/* GRÁFICO BARRAS */}
          <section className="section">
            <div className="section-title">Metas por Trimestre</div>
            <div className="chart-box">
              <h3>Meta vs Realizado</h3>
              <GraficoBarras dark={dark} />
            </div>
          </section>

          {/* TABELA */}
          <section className="section">
            <div className="section-title">Pedidos Recentes</div>
            <div className="table-box">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#ID</th>
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
                        <td className="text-muted">{row.produto}</td>
                        <td><strong>R$ {row.valor.toLocaleString("pt-BR")}</strong></td>
                        <td><span className={statusBadge(row.status)}>{row.status}</span></td>
                        <td className="text-muted">{row.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}