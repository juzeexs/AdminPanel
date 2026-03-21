import styles from './Placeholder.module.css';

const ICONS = {
  analytics: '📊',
  notifications: '🔔',
  users: '👥',
  orders: '🛒',
  reports: '📄',
  settings: '⚙️',
};

const LABELS = {
  analytics: 'Analytics',
  notifications: 'Notificações',
  users: 'Usuários',
  orders: 'Pedidos',
  reports: 'Relatórios',
  settings: 'Configurações',
};

export default function Placeholder({ page }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.icon}>{ICONS[page] || '📁'}</div>
        <h2 className={styles.title}>{LABELS[page] || page}</h2>
        <p className={styles.desc}>
          Esta seção está em desenvolvimento.<br />
          Implemente sua lógica aqui!
        </p>
        <div className={styles.badge}>Em breve</div>
      </div>
    </div>
  );
}
