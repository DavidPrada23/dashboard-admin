import styles from "./KpiCard.module.css";

interface KpiCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

export default function KpiCard({ icon, label, value, color }: KpiCardProps) {
  return (
    <div className={styles.card} style={{ borderTopColor: color || "#3b82f6" }}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <p className={styles.label}>{label}</p>
        <h3 className={styles.value}>{value}</h3>
      </div>
    </div>
  );
}
