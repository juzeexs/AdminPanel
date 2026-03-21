import { useState } from “react”;
import {
ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
} from “recharts”;
import “./App.css”;

const DATA = {
“7d”: {
metrics: [
{ label: “Receita total”,     value: “R$ 48.200”,  delta: “+12,4%”, up: true  },
{ label: “Novos clientes”,    value: “312”,        delta: “+8,1%”,  up: true  },
{ label: “Taxa de conversão”, value: “4,7%”,       delta: “-0,3%”,  up: false },
{ label: “Ticket médio”,      value: “R$ 154”,     delta: “+5,2%”,  up: true  },
],
chart: [
{ label: “Seg”, revenue: 6200, target: 6000 },
{ label: “Ter”, revenue: 7400, target: 7000 },
{ label: “Qua”, revenue: 5800, target: 7000 },
{ label: “Qui”, revenue: 8100, target: 7500 },
{ label: “Sex”, revenue: 7200, target: 7000 },
{ label: “Sáb”, revenue: 6900, target: 7000 },
{ label: “Dom”, revenue: 6600, target: 7000 },
],
},
“30d”: {
metrics: [
{ label: “Receita total”,     value: “R$ 184.600”, delta: “+18,7%”, up: true },
{ label: “Novos clientes”,    value: “1.240”,      delta: “+22,3%”, up: true },
{ label: “Taxa de conversão”, value: “5,1%”,       delta: “+0,6%”,  up: true },
{ label: “Ticket médio”,      value: “R$ 149”,     delta: “+3,8%”,  up: true },
],
chart: [
{ label: “1”,  revenue: 38000, target: 40000 },
{ label: “4”,  revenue: 42000, target: 40000 },
{ label: “7”,  revenue: 31000, target: 40000 },
{ label: “10”, revenue: 52000, target: 50000 },
{ label: “13”, revenue: 44000, target: 50000 },
{ label: “16”, revenue: 48000, target: 50000 },
{ label: “19”, revenue: 55000, target: 55000 },
{ label: “22”, revenue: 43000, target: 55000 },
{ label: “25”, revenue: 61000, target: 55000 },
{ label: “27”, revenue: 57000, target: 60000 },
{ label: “28”, revenue: 49000, target: 60000 },
{ label: “30”, revenue: 66000, target: 60000 },
],
},
“90d”: {
metrics: [
{ label: “Receita total”,     value: “R$ 512.800”, delta: “+31,2%”, up: true  },
{ label: “Novos clientes”,    value: “3.870”,      delta: “+28,5%”, up: true  },
{ label: “Taxa de conversão”, value: “5,4%”,       delta: “+1,1%”,  up: true  },
{ label: “Ticket médio”,      value: “R$ 132”,     delta: “-2,1%”,  up: false },
],
chart: [
{ label: “Jan”, revenue: 120000, target: 130000 },
{ label: “”,    revenue: 138000, target: 140000 },
{ label: “”,    revenue: 155000, target: 150000 },
{ label: “Fev”, revenue: 162000, target: 160000 },
{ label: “”,    revenue: 175000, target: 170000 },
{ label: “”,    revenue: 185000, target: 180000 },
{ label: “Mar”, revenue: 195000, target: 190000 },
{ label: “”,    revenue: 205000, target: 200000 },
{ label: “”,    revenue: 215000, target: 210000 },
{ label: “Abr”, revenue: 230000, target: 220000 },
{ label: “”,    revenue: 242000, target: 230000 },
{ label: “”,    revenue: 256000, target: 240000 },
],
},
};

const DONUT_DATA = [
{ name: “Eletrônicos”, value: 38, color: “#378ADD” },
{ name: “Moda”,        value: 27, color: “#1D9E75” },
{ name: “Casa”,        value: 21, color: “#D85A30” },
{ name: “Esporte”,     value: 14, color: “#BA7517” },
];

const ORDERS = [
{ name: “Ana Souza”,     value: “R$ 1.240”, status: “Pago”,     cls: “ok”   },
{ name: “Carlos Lima”,   value: “R$ 890”,   status: “Pendente”, cls: “warn” },
{ name: “Beatriz Costa”, value: “R$ 2.100”, status: “Pago”,     cls: “ok”   },
{ name: “Rafael Alves”,  value: “R$ 540”,   status: “Análise”,  cls: “info” },
{ name: “Juliana Melo”,  value: “R$ 1.780”, status: “Pago”,     cls: “ok”   },
];

const CHANNELS = [
{ name: “Orgânico”, pct: 41, color: “#378ADD” },
{ name: “Pago”,     pct: 28, color: “#1D9E75” },
{ name: “Social”,   pct: 18, color: “#D85A30” },
{ name: “E-mail”,   pct:  9, color: “#BA7517” },
{ name: “Direto”,   pct:  4, color: “#888780” },
];

const fmtY = (v) => “R$” + (v >= 1000 ? (v / 1000).toFixed(0) + “k” : v);

const CustomTooltip = ({ active, payload, label }) => {
if (!active || !payload?.length) return null;
return (
<div style={{ background: “#fff”, border: “0.5px solid #e5e4de”, borderRadius: 8, padding: “8px 12px”, fontSize: 12 }}>
<p style={{ color: “#888780”, marginBottom: 4 }}>{label}</p>
{payload.map((p) => (
<p key={p.name} style={{ color: p.color ?? p.stroke, margin: “2px 0” }}>
{p.name}: {typeof p.value === “number” && p.value >= 1000 ? fmtY(p.value) : p.value}
</p>
))}
</div>
);
};

function MetricCard({ label, value, delta, up }) {
return (
<div className="metric-card">
<div className="metric-label">{label}</div>
<div className="metric-value">{value}</div>
<div className={`metric-delta ${up ? "up" : "down"}`}>
{up ? “▲” : “▼”} {delta} vs período anterior
</div>
</div>
);
}

function RevenueChart({ data }) {
return (
<div className="chart-wrap">
<ResponsiveContainer width="100%" height="100%">
<ComposedChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
<CartesianGrid vertical={false} stroke="rgba(136,135,128,0.15)" />
<XAxis dataKey=“label” tick={{ fontSize: 10, fill: “#888780” }} axisLine={false} tickLine={false} />
<YAxis tickFormatter={fmtY} tick={{ fontSize: 10, fill: “#888780” }} axisLine={false} tickLine={false} />
<Tooltip content={<CustomTooltip />} />
<Bar dataKey=“revenue” name=“Receita” fill=”#378ADD” radius={[4, 4, 0, 0]} />
<Line dataKey="target" name="Meta" type="monotone" stroke="#1D9E75" strokeWidth={2} dot={false} />
</ComposedChart>
</ResponsiveContainer>
</div>
);
}

function DonutChart() {
return (
<div className="chart-wrap">
<ResponsiveContainer width="100%" height="100%">
<PieChart>
<Pie
data={DONUT_DATA}
cx="50%"
cy="50%"
innerRadius="55%"
outerRadius="80%"
dataKey="value"
paddingAngle={2}
>
{DONUT_DATA.map((entry) => (
<Cell key={entry.name} fill={entry.color} />
))}
</Pie>
<Tooltip formatter={(v) => v + “%”} />
</PieChart>
</ResponsiveContainer>
</div>
);
}

export default function App() {
const [period, setPeriod] = useState(“30d”);
const { metrics, chart } = DATA[period];

return (
<div className="dash">

```
  <div className="dash-header">
    <div className="dash-heading">
      <h1 className="dash-title">Painel de desempenho</h1>
      <p className="dash-sub">Atualizado agora mesmo — março 2026</p>
    </div>
    <div className="dash-controls">
      <span className="badge-live">Ao vivo</span>
      <div className="period-btns">
        {["7d", "30d", "90d"].map((p) => (
          <button
            key={p}
            className={`period-btn ${period === p ? "active" : ""}`}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  </div>

  <div className="metrics-grid">
    {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
  </div>

  <div className="charts-row">
    <div className="card">
      <div className="card-title">Receita mensal</div>
      <div className="chart-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: "#378ADD" }} />Receita</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "#1D9E75" }} />Meta</span>
      </div>
      <RevenueChart data={chart} />
    </div>
    <div className="card">
      <div className="card-title">Categorias</div>
      <DonutChart />
      <div className="donut-legend">
        {DONUT_DATA.map(({ name, color, value }) => (
          <span key={name} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />{name} {value}%
          </span>
        ))}
      </div>
    </div>
  </div>

  <div className="bottom-row">
    <div className="card">
      <div className="card-title">Pedidos recentes</div>
      <div className="table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th className="th-left">Cliente</th>
              <th className="th-left">Valor</th>
              <th className="th-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.name}>
                <td className="td">{o.name}</td>
                <td className="td">{o.value}</td>
                <td className="td td-right">
                  <span className={`status-badge status-${o.cls}`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="card">
      <div className="card-title">Origem de tráfego</div>
      {CHANNELS.map((c) => (
        <div key={c.name} className="channel-row">
          <span className="channel-name">{c.name}</span>
          <div className="bar-bg">
            <div className="bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
          </div>
          <span className="channel-pct">{c.pct}%</span>
        </div>
      ))}
    </div>
  </div>

</div>
```

);
}