import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createTransactionsCsv,
  getTransactionsCsvFilename,
} from './csvExport.js'

test('CSV includes income and expense fields with numeric amounts and ISO dates', () => {
  const csv = createTransactionsCsv([
    {
      title: 'Lunch',
      amount: 125.5,
      type: 'Expense',
      category: 'Food',
      date: '2026-11-12',
    },
    {
      title: 'Payday',
      amount: 2500,
      type: 'Income',
      category: 'Other',
      date: '2026-11-01',
    },
  ])

  assert.equal(
    csv,
    [
      'Title,Amount,Type,Category,Date',
      'Lunch,125.5,Expense,Food,2026-11-12',
      'Payday,2500,Income,Other,2026-11-01',
    ].join('\r\n'),
  )
})

test('CSV escapes commas, quotation marks, and line breaks', () => {
  const csv = createTransactionsCsv([
    {
      title: 'Lunch, "with friends"\r\nand dessert',
      amount: 25,
      type: 'Expense',
      category: 'Food',
      date: '2026-11-12',
    },
  ])

  assert.equal(
    csv,
    [
      'Title,Amount,Type,Category,Date',
      '"Lunch, ""with friends""\r\nand dessert",25,Expense,Food,2026-11-12',
    ].join('\r\n'),
  )
})

test('empty transactions produce only the CSV header', () => {
  assert.equal(
    createTransactionsCsv([]),
    'Title,Amount,Type,Category,Date',
  )
})

test('CSV filename includes the local date', () => {
  assert.equal(
    getTransactionsCsvFilename(new Date(2026, 10, 12)),
    'expense-tracker-transactions-2026-11-12.csv',
  )
})
