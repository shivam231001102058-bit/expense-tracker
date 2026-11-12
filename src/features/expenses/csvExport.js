import { getLocalDate } from './expenseData.js'

const CSV_HEADERS = ['Title', 'Amount', 'Type', 'Category', 'Date']

function escapeCsvField(value) {
  const field = String(value)

  if (/[",\r\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`
  }

  return field
}

export function createTransactionsCsv(transactions) {
  const rows = [
    CSV_HEADERS,
    ...transactions.map((transaction) => [
      transaction.title,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.date,
    ]),
  ]

  return rows
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\r\n')
}

export function getTransactionsCsvFilename(date = new Date()) {
  return `expense-tracker-transactions-${getLocalDate(date)}.csv`
}
