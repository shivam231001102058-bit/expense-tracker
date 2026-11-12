import Icon from '../ui/Icon.jsx'

function Topbar({
  currentMonth,
  onAddExpense,
  onExportCsv,
  canExport,
  exportMessage,
}) {
  return (
    <header className="topbar">
      <div className="page-heading">
        <h1>Overview</h1>
        <p>Here&apos;s a snapshot of your finances.</p>
      </div>

      <div className="topbar-actions">
        <div className="month-pill" aria-label={`Current month: ${currentMonth}`}>
          <Icon name="calendar" size={16} />
          <span>{currentMonth}</span>
        </div>
        <div className="topbar-button-group">
          <button
            className="add-expense-button"
            type="button"
            onClick={onAddExpense}
          >
            <Icon name="plus" size={16} />
            <span>Add expense</span>
          </button>
          <button
            className="export-csv-button"
            type="button"
            onClick={onExportCsv}
            disabled={!canExport}
            title={!canExport ? 'Add a transaction before exporting.' : undefined}
          >
            <Icon name="download" size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      {exportMessage && (
        <p className="export-feedback" role="status" aria-live="polite">
          {exportMessage}
        </p>
      )}
    </header>
  )
}

export default Topbar
