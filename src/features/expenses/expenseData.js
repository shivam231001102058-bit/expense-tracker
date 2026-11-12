export const STORAGE_KEY = 'pocketwise-transactions'

export const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Education',
  'Health',
  'Entertainment',
  'Other',
]

const VALID_TYPES = ['Expense', 'Income']

function isValidTransaction(transaction) {
  const parsedDate =
    typeof transaction?.date === 'string'
      ? new Date(`${transaction.date}T00:00:00Z`)
      : null
  const hasValidDate =
    parsedDate !== null &&
    Number.isFinite(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === transaction.date

  return (
    transaction !== null &&
    typeof transaction === 'object' &&
    typeof transaction.id === 'string' &&
    typeof transaction.title === 'string' &&
    transaction.title.trim().length > 0 &&
    typeof transaction.amount === 'number' &&
    Number.isFinite(transaction.amount) &&
    transaction.amount > 0 &&
    CATEGORIES.includes(transaction.category) &&
    hasValidDate &&
    VALID_TYPES.includes(transaction.type)
  )
}

export function loadTransactions() {
  try {
    const savedTransactions = window.localStorage.getItem(STORAGE_KEY)

    if (!savedTransactions) {
      return []
    }

    const parsedTransactions = JSON.parse(savedTransactions)

    if (
      !Array.isArray(parsedTransactions) ||
      !parsedTransactions.every(isValidTransaction)
    ) {
      return []
    }

    return parsedTransactions
  } catch {
    return []
  }
}

export function getCurrentMonth(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function getLocalDate(date = new Date()) {
  return `${getCurrentMonth(date)}-${String(date.getDate()).padStart(2, '0')}`
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

export function formatCompactCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}
