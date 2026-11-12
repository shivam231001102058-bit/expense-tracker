import { useEffect, useRef, useState } from 'react'
import Icon from '../../components/ui/Icon.jsx'
import { CATEGORIES, getLocalDate } from './expenseData.js'

function AddExpenseDialog({ onAdd, onClose }) {
  const dialogRef = useRef(null)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(getLocalDate())
  const [type, setType] = useState('Expense')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    dialog.querySelector('input')?.focus()

    return () => {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()

    const numericAmount = Number(amount)
    const nextErrors = {}

    if (!title.trim()) {
      nextErrors.title = 'Enter a title.'
    }
    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = 'Enter an amount greater than zero.'
    }
    if (!CATEGORIES.includes(category)) {
      nextErrors.category = 'Choose a category.'
    }
    if (!date) {
      nextErrors.date = 'Choose a date.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: numericAmount,
      category,
      date,
      type,
    })
  }

  return (
    <dialog
      className="expense-dialog"
      ref={dialogRef}
      aria-labelledby="expense-dialog-title"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onClose()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="dialog-heading">
        <div>
          <h2 id="expense-dialog-title">Add a transaction</h2>
          <p>Keep track of an expense or income.</p>
        </div>
        <button
          className="dialog-close"
          type="button"
          aria-label="Close form"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <form className="expense-form" noValidate onSubmit={handleSubmit}>
        <label className="form-field" htmlFor="transaction-title">
          Title
          <input
            autoFocus
            id="transaction-title"
            type="text"
            autoComplete="off"
            placeholder="e.g. Weekly groceries"
            value={title}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            onChange={(event) => setTitle(event.target.value)}
          />
          {errors.title && (
            <span className="field-error" id="title-error">
              {errors.title}
            </span>
          )}
        </label>

        <label className="form-field" htmlFor="transaction-amount">
          Amount
          <div className="amount-input-wrap">
            <span aria-hidden="true">₹</span>
            <input
              id="transaction-amount"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          {errors.amount && (
            <span className="field-error" id="amount-error">
              {errors.amount}
            </span>
          )}
        </label>

        <div className="form-fields-row">
          <label className="form-field" htmlFor="transaction-category">
            Category
            <select
              id="transaction-category"
              value={category}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'category-error' : undefined}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="field-error" id="category-error">
                {errors.category}
              </span>
            )}
          </label>

          <label className="form-field" htmlFor="transaction-date">
            Date
            <input
              id="transaction-date"
              type="date"
              value={date}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? 'date-error' : undefined}
              onChange={(event) => setDate(event.target.value)}
            />
            {errors.date && (
              <span className="field-error" id="date-error">
                {errors.date}
              </span>
            )}
          </label>
        </div>

        <fieldset className="type-fieldset">
          <legend>Type</legend>
          <div className="type-options">
            {['Expense', 'Income'].map((item) => (
              <label className="type-option" key={item}>
                <input
                  type="radio"
                  name="transaction-type"
                  value={item}
                  checked={type === item}
                  onChange={() => setType(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="dialog-actions">
          <button className="cancel-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-button" type="submit">
            <Icon name="plus" size={16} />
            Add transaction
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default AddExpenseDialog
