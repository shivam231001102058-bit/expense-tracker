import { lazy, Suspense, useMemo, useState } from 'react'
import Sidebar from './components/layout/Sidebar.jsx'
import Topbar from './components/layout/Topbar.jsx'
import SummaryCard from './components/dashboard/SummaryCard.jsx'
import AddExpenseDialog from './features/expenses/AddExpenseDialog.jsx'
import ExpenseActivity from './features/expenses/ExpenseActivity.jsx'
import {
  createTransactionsCsv,
  getTransactionsCsvFilename,
} from './features/expenses/csvExport.js'
import {
  CATEGORIES,
  formatCurrency,
  getCurrentMonth,
  loadTransactions,
  STORAGE_KEY,
} from './features/expenses/expenseData.js'
import './App.css'

const AnalyticsOverview = lazy(
  () => import('./features/analytics/AnalyticsOverview.jsx'),
)

const currentMonth = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
}).format(new Date())

function App() {
  const [transactions, setTransactions] = useState(loadTransactions)
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [storageError, setStorageError] = useState('')
  const [exportMessage, setExportMessage] = useState('')

  function saveTransactions(nextTransactions) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTransactions))
      setStorageError('')
    } catch {
      setStorageError('Your changes could not be saved in this browser.')
    }
  }

  const filteredTransactions = useMemo(
    () =>
      categoryFilter === 'All Categories'
        ? transactions
        : transactions.filter(
            (transaction) => transaction.category === categoryFilter,
          ),
    [categoryFilter, transactions],
  )

  const summaryItems = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'Income')
      .reduce((total, transaction) => total + transaction.amount, 0)
    const expenses = transactions
      .filter((transaction) => transaction.type === 'Expense')
      .reduce((total, transaction) => total + transaction.amount, 0)
    const monthExpenses = transactions
      .filter(
        (transaction) =>
          transaction.type === 'Expense' &&
          transaction.date.startsWith(getCurrentMonth()),
      )
      .reduce((total, transaction) => total + transaction.amount, 0)

    return [
      {
        label: 'Total balance',
        value: formatCurrency(income - expenses),
        note: 'All-time income minus expenses',
        icon: 'wallet',
        tone: 'violet',
      },
      {
        label: 'Total income',
        value: formatCurrency(income),
        note: 'Across all transactions',
        icon: 'income',
        tone: 'green',
      },
      {
        label: 'Total expenses',
        value: formatCurrency(expenses),
        note: 'Across all transactions',
        icon: 'expense',
        tone: 'orange',
      },
      {
        label: 'Monthly expenses',
        value: formatCurrency(monthExpenses),
        note: `Expenses in ${currentMonth}`,
        icon: 'expense',
        tone: 'orange',
      },
    ]
  }, [transactions])

  function addTransaction(transaction) {
    const updatedTransactions = [transaction, ...transactions]
    setTransactions(updatedTransactions)
    saveTransactions(updatedTransactions)
    setIsAddFormOpen(false)
  }

  function deleteTransaction(transaction) {
    const confirmed = window.confirm(
      `Delete "${transaction.title}"? This action cannot be undone.`,
    )

    if (confirmed) {
      const updatedTransactions = transactions.filter(
        (item) => item.id !== transaction.id,
      )
      setTransactions(updatedTransactions)
      saveTransactions(updatedTransactions)
    }
  }

  function exportTransactions() {
    if (transactions.length === 0) {
      return
    }

    let downloadUrl
    let downloadLink

    try {
      const csv = createTransactionsCsv(transactions)
      const filename = getTransactionsCsvFilename()
      const file = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      downloadUrl = URL.createObjectURL(file)
      downloadLink = document.createElement('a')
      downloadLink.href = downloadUrl
      downloadLink.download = filename
      downloadLink.hidden = true
      document.body.appendChild(downloadLink)
      downloadLink.click()
      setExportMessage(`CSV download started: ${filename}`)
    } catch {
      setExportMessage('CSV export could not be started. Please try again.')
    } finally {
      downloadLink?.remove()

      if (downloadUrl) {
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)
      }
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content" id="overview">
        <div className="content-wrap">
          <Topbar
            currentMonth={currentMonth}
            onAddExpense={() => setIsAddFormOpen(true)}
            onExportCsv={exportTransactions}
            canExport={transactions.length > 0}
            exportMessage={exportMessage}
          />

          <section className="summary-grid" aria-label="Monthly summary">
            {summaryItems.map((item) => (
              <SummaryCard key={item.label} {...item} />
            ))}
          </section>

          <Suspense
            fallback={
              <section
                className="analytics-grid analytics-loading"
                id="analytics"
                aria-label="Analytics"
                role="status"
              >
                Loading charts...
              </section>
            }
          >
            <AnalyticsOverview transactions={transactions} />
          </Suspense>
          <ExpenseActivity
            transactions={filteredTransactions}
            categoryFilter={categoryFilter}
            categories={CATEGORIES}
            onCategoryFilterChange={setCategoryFilter}
            onDelete={deleteTransaction}
          />

          <footer className="page-footer">
            <span>Expense Tracker</span>
            <span>Simple, thoughtful money tracking.</span>
          </footer>
        </div>
      </main>
      {isAddFormOpen && (
        <AddExpenseDialog
          onAdd={addTransaction}
          onClose={() => setIsAddFormOpen(false)}
        />
      )}
      {storageError && (
        <p className="storage-error" role="status">
          {storageError}
        </p>
      )}
    </div>
  )
}

export default App
