import Icon from '../../components/ui/Icon.jsx'
import { formatDate, formatCurrency } from './expenseData.js'

function ExpenseActivity({
  transactions,
  categoryFilter,
  categories,
  onCategoryFilterChange,
  onDelete,
}) {
  const hasTransactions = transactions.length > 0

  return (
    <section className="panel activity-panel" id="transactions">
      <div className="panel-heading">
        <div>
          <div className="activity-title">
            <h2>Recent transactions</h2>
            <span className="activity-count">{transactions.length}</span>
          </div>
          <p>Your latest income and expense entries</p>
        </div>
        <label className="category-filter">
          <span>Category</span>
          <select
            aria-label="Filter transactions by category"
            value={categoryFilter}
            onChange={(event) => onCategoryFilterChange(event.target.value)}
          >
            <option>All Categories</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>

      {!hasTransactions ? (
        <div className="activity-empty">
          <div>
            <span className="activity-empty-icon">
              <Icon name="receipt" size={18} />
            </span>
            <strong>
              {categoryFilter === 'All Categories'
                ? 'No transactions yet'
                : 'No transactions in this category'}
            </strong>
            <p>
              {categoryFilter === 'All Categories'
                ? 'Add an expense or income to see it here.'
                : 'Choose another category or add a matching transaction.'}
            </p>
          </div>
        </div>
      ) : (
        <ul className="transaction-list">
          {transactions.map((transaction) => (
            <li className="transaction-row" key={transaction.id}>
              <span className="transaction-icon">
                <Icon name="receipt" size={18} />
              </span>
              <div className="transaction-description">
                <strong>{transaction.title}</strong>
                <span>
                  {transaction.category} <span aria-hidden="true">·</span>{' '}
                  {formatDate(transaction.date)}
                </span>
              </div>
              <span
                className={`transaction-type ${transaction.type.toLowerCase()}`}
              >
                {transaction.type}
              </span>
              <strong
                className={`transaction-amount ${transaction.type.toLowerCase()}`}
              >
                {transaction.type === 'Income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </strong>
              <button
                className="delete-transaction"
                type="button"
                aria-label={`Delete ${transaction.title}`}
                onClick={() => onDelete(transaction)}
              >
                <Icon name="trash" size={17} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ExpenseActivity
