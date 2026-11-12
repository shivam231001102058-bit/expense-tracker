const iconPaths = {
  overview: [
    'M3 3h7v7H3z',
    'M14 3h7v5h-7z',
    'M14 12h7v9h-7z',
    'M3 14h7v7H3z',
  ],
  expenses: ['M4 5h16', 'M4 10h16', 'M4 15h10', 'M4 20h8'],
  analytics: ['M4 19V5', 'M4 19h17', 'm7 15 4-4 3 2 5-6'],
  calendar: [
    'M8 2v4',
    'M16 2v4',
    'M3 10h18',
    'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z',
  ],
  plus: ['M12 5v14', 'M5 12h14'],
  wallet: ['M4 6.5h15a2 2 0 0 1 2 2V19H3V5a2 2 0 0 1 2-2h13', 'M21 12h-5a2 2 0 0 0 0 4h5'],
  income: ['M12 19V5', 'm5 12 7-7 7 7'],
  expense: ['M12 5v14', 'm19 12-7 7-7-7'],
  chart: ['M4 19V5', 'M4 19h17', 'M7 15l4-4 3 3 6-7'],
  pie: ['M12 3v9h9', 'M20.5 13A9 9 0 1 1 11 3.05'],
  receipt: ['M5 3h14v18l-3-2-4 2-4-2-3 2z', 'M9 8h6', 'M9 12h6'],
  trash: [
    'M3 6h18',
    'M8 6V4h8v2',
    'm19 6-1 14H6L5 6',
    'M10 11v5',
    'M14 11v5',
  ],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 10 5 5 5-5', 'M12 15V3'],
}

function Icon({ name, size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {iconPaths[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}

export default Icon
