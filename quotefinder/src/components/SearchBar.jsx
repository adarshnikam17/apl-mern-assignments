import { useState, useEffect } from 'react'

export default function SearchBar({ defaultValue = '', onSearch }) {
  const [value, setValue] = useState(defaultValue)

  // Debounce: fire search 400ms after user stops typing
  useEffect(() => {
    const id = setTimeout(() => onSearch(value.trim()), 400)
    return () => clearTimeout(id)
  }, [value, onSearch])

  return (
    <div className="search">
      <input
        placeholder="Search quotes or authors…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search quotes"
      />
      <button onClick={() => onSearch(value.trim())}>Search</button>
    </div>
  )
}
