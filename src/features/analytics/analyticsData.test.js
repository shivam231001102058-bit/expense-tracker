import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getDailyExpenseData,
  getExpenseCategoryData,
  getMonthlyCashFlowData,
} from './analyticsData.js'

const transactions = [
  {
    id: 'food-oct',
    title: 'Market',
    amount: 100,
    category: 'Food',
    date: '2026-10-31',
    type: 'Expense',
  },
  {
    id: 'food-nov',
    title: 'Lunch',
    amount: 50,
    category: 'Food',
    date: '2026-11-01',
    type: 'Expense',
  },
  {
    id: 'travel-nov',
    title: 'Bus',
    amount: 25,
    category: 'Travel',
    date: '2026-11-01',
    type: 'Expense',
  },
  {
    id: 'income-nov',
    title: 'Pay',
    amount: 500,
    category: 'Other',
    date: '2026-11-01',
    type: 'Income',
  },
  {
    id: 'income-oct',
    title: 'Pay',
    amount: 1000,
    category: 'Other',
    date: '2026-10-15',
    type: 'Income',
  },
]

test('category totals include expenses only and group the same category', () => {
  assert.deepEqual(getExpenseCategoryData(transactions), [
    { category: 'Food', value: 150 },
    { category: 'Travel', value: 25 },
  ])
})

test('monthly cash flow groups income and expenses by transaction month', () => {
  assert.deepEqual(getMonthlyCashFlowData(transactions), [
    { month: 'Oct 2026', income: 1000, expenses: 100 },
    { month: 'Nov 2026', income: 500, expenses: 75 },
  ])
})

test('daily trend combines same-day expenses and excludes income', () => {
  assert.deepEqual(getDailyExpenseData(transactions), [
    { date: '2026-10-31', amount: 100 },
    { date: '2026-11-01', amount: 75 },
  ])
})

test('all chart aggregations handle empty transactions', () => {
  assert.deepEqual(getExpenseCategoryData([]), [])
  assert.deepEqual(getMonthlyCashFlowData([]), [])
  assert.deepEqual(getDailyExpenseData([]), [])
})
