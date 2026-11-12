import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CATEGORIES,
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from '../expenses/expenseData.js'
import Icon from '../../components/ui/Icon.jsx'
import {
  getDailyExpenseData,
  getExpenseCategoryData,
  getMonthlyCashFlowData,
} from './analyticsData.js'
const CATEGORY_COLORS = [
  '#6a5be8',
  '#41a6a0',
  '#e99553',
  '#6b8ed6',
  '#d8799d',
  '#78ad72',
  '#aa7ac8',
  '#9da3b2',
]

const CATEGORY_COLOR_MAP = Object.fromEntries(
  CATEGORIES.map((category, index) => [category, CATEGORY_COLORS[index]]),
)

const chartTooltipStyle = {
  border: '1px solid #eceef4',
  borderRadius: '9px',
  boxShadow: '0 6px 20px rgba(36, 41, 64, 0.1)',
  fontSize: '11px',
}

function ChartEmptyState({ icon, message }) {
  return (
    <div className="chart-placeholder analytics-empty-state">
      <div>
        <span className="chart-placeholder-mark">
          <Icon name={icon} size={19} />
        </span>
        <p>{message}</p>
      </div>
    </div>
  )
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${date}T00:00:00`))
}

function CategoryExpensesChart({ data }) {
  if (data.length === 0) {
    return (
      <ChartEmptyState
        icon="pie"
        message="Add an expense to see the category breakdown."
      />
    )
  }

  return (
    <div className="pie-chart-content">
      <div
        className="pie-chart-visual"
        role="img"
        aria-label="Expense totals by category"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={82}
              paddingAngle={2}
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((item) => (
                <Cell
                  key={item.category}
                  fill={CATEGORY_COLOR_MAP[item.category]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value, _name, item) => [
                formatCurrency(Number(value)),
                item.payload.category,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="pie-chart-legend" aria-label="Expense totals by category">
        {data.map((item) => (
          <li className="pie-legend-item" key={item.category}>
            <span
              className="pie-legend-color"
              style={{ backgroundColor: CATEGORY_COLOR_MAP[item.category] }}
            />
            <span className="pie-legend-category" title={item.category}>
              {item.category}
            </span>
            <strong>{formatCurrency(item.value)}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MonthlyCashFlowChart({ data }) {
  if (data.length === 0) {
    return (
      <ChartEmptyState
        icon="chart"
        message="Add income or expenses to compare monthly cash flow."
      />
    )
  }

  return (
    <div className="cash-flow-chart-content">
      <ul className="cash-flow-legend" aria-label="Chart series">
        <li>
          <span className="cash-flow-legend-color income" />
          Income
        </li>
        <li>
          <span className="cash-flow-legend-color expense" />
          Expenses
        </li>
      </ul>
      <div
        className="analytics-chart"
        role="img"
        aria-label="Monthly income and expense comparison"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid
              stroke="#eff0f5"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: '#9297a7', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#e6e8ef' }}
              minTickGap={12}
            />
            <YAxis
              width={62}
              tickFormatter={formatCompactCurrency}
              tick={{ fill: '#9297a7', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={chartTooltipStyle}
              labelStyle={{ color: '#555a6a' }}
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                name,
              ]}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#35a77c"
              radius={[4, 4, 0, 0]}
              maxBarSize={34}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#e99553"
              radius={[4, 4, 0, 0]}
              maxBarSize={34}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function DailyExpenseChart({ data }) {
  if (data.length === 0) {
    return (
      <ChartEmptyState
        icon="analytics"
        message="Add an expense to see your daily spending trend."
      />
    )
  }

  return (
    <div
      className="analytics-chart"
      role="img"
      aria-label="Daily expense trend"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid
            stroke="#eff0f5"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tick={{ fill: '#9297a7', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#e6e8ef' }}
            minTickGap={20}
          />
          <YAxis
            width={62}
            tickFormatter={formatCompactCurrency}
            tick={{ fill: '#9297a7', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={{ color: '#555a6a' }}
            labelFormatter={(date) => formatDate(String(date))}
            formatter={(value) => [
              formatCurrency(Number(value)),
              'Expenses',
            ]}
          />
          <Line
            dataKey="amount"
            name="Expenses"
            type="monotone"
            stroke="#6a5be8"
            strokeWidth={2.5}
            dot={{ fill: '#6a5be8', r: 3 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function AnalyticsOverview({ transactions }) {
  const categoryData = useMemo(
    () => getExpenseCategoryData(transactions),
    [transactions],
  )
  const monthlyData = useMemo(
    () => getMonthlyCashFlowData(transactions),
    [transactions],
  )
  const dailyData = useMemo(
    () => getDailyExpenseData(transactions),
    [transactions],
  )

  return (
    <section className="analytics-grid" id="analytics" aria-label="Analytics">
      <article className="panel analytics-panel">
        <div className="panel-heading">
          <div>
            <h2>Expenses by category</h2>
            <p>Expense totals by category</p>
          </div>
          <span className="panel-kicker">All time</span>
        </div>
        <CategoryExpensesChart data={categoryData} />
      </article>

      <article className="panel analytics-panel">
        <div className="panel-heading">
          <div>
            <h2>Income vs. expenses</h2>
            <p>Compare your cash flow month by month</p>
          </div>
          <span className="panel-kicker">By month</span>
        </div>
        <MonthlyCashFlowChart data={monthlyData} />
      </article>

      <article className="panel analytics-panel daily-chart-panel">
        <div className="panel-heading">
          <div>
            <h2>Daily expense trend</h2>
            <p>Expense totals for each day with spending</p>
          </div>
          <span className="panel-kicker">All time</span>
        </div>
        <DailyExpenseChart data={dailyData} />
      </article>
    </section>
  )
}

export default AnalyticsOverview
