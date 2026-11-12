import Icon from '../ui/Icon.jsx'

const navigationItems = [
  { label: 'Overview', href: '#overview', icon: 'overview', active: true },
  { label: 'Expenses', href: '#transactions', icon: 'expenses' },
  { label: 'Analytics', href: '#analytics', icon: 'analytics' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <a className="brand" href="#overview" aria-label="Pocketwise home">
          <span className="brand-mark">
            <Icon name="wallet" size={20} />
          </span>
          <span>Pocketwise</span>
        </a>
      </div>

      <p className="nav-label">Workspace</p>
      <nav className="primary-nav" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <a
            key={item.label}
            className={`nav-link${item.active ? ' is-active' : ''}`}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-note">
        <strong>Your money, in focus.</strong>
        A clear view of your spending starts with your first entry.
      </div>
    </aside>
  )
}

export default Sidebar
