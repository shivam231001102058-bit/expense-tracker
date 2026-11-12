import { CATEGORIES } from '../expenses/expenseData.js'

export function getExpenseCategoryData(transactions) {
  const totals = new Map()

  for (const transaction of transactions) {
    if (transaction.type !== 'Expense') {
      continue
    }

    totals.set(
      transaction.category,
      (totals.get(transaction.category) ?? 0) + transaction.amount,
    )
  }

  return CATEGORIES.flatMap((category) =>
    totals.has(category)
      ? [{ category, value: totals.get(category) }]
      : [],
  )
}

export function getMonthlyCashFlowData(transactions) {
  const monthlyTotals = new Map()

  for (const transaction of transactions) {
    const monthKey = transaction.date.slice(0, 7)
    const totals = monthlyTotals.get(monthKey) ?? {
      monthKey,
      income: 0,
      expenses: 0,
    }

    if (transaction.type === 'Income') {
      totals.income += transaction.amount
    } else if (transaction.type === 'Expense') {
      totals.expenses += transaction.amount
    }

    monthlyTotals.set(monthKey, totals)
  }

  return [...monthlyTotals.values()]
    .sort((first, second) => first.monthKey.localeCompare(second.monthKey))
    .map(({ monthKey, income, expenses }) => ({
      month: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
      }).format(new Date(`${monthKey}-01T00:00:00`)),
      income,
      expenses,
    }))
}

export function getDailyExpenseData(transactions) {
  const dailyTotals = new Map()

  for (const transaction of transactions) {
    if (transaction.type !== 'Expense') {
      continue
    }

    dailyTotals.set(
      transaction.date,
      (dailyTotals.get(transaction.date) ?? 0) + transaction.amount,
    )
  }

  return [...dailyTotals.entries()]
    .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
    .map(([date, amount]) => ({ date, amount }))
}
