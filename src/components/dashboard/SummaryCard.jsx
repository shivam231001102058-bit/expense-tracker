import Icon from '../ui/Icon.jsx'

function SummaryCard({ label, value, note, icon, tone }) {
  return (
    <article className="summary-card">
      <div className="summary-card-header">
        <span className="summary-card-label">{label}</span>
        <span className={`summary-icon ${tone}`}>
          <Icon name={icon} />
        </span>
      </div>
      <div className="summary-card-value" title={value}>
        {value}
      </div>
      <p className="summary-card-note">{note}</p>
    </article>
  )
}

export default SummaryCard
