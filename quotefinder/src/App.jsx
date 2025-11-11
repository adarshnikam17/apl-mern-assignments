import { useEffect, useState, useCallback } from 'react'
import SearchBar from './components/SearchBar.jsx'
import QuoteCard from './components/QuoteCard.jsx'

const PAGE_SIZE = 10

export default function App() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchQuotes = useCallback(async (q, p) => {
    setLoading(true)
    setError(null)
    try {
      // ✅ Using proxy to bypass CORS/network restrictions
      const proxy = "https://thingproxy.freeboard.io/fetch/";
      const base = "https://api.quotable.io";

      const apiUrl = q
        ? `${base}/search/quotes?query=${encodeURIComponent(q)}&page=${p}&limit=${PAGE_SIZE}`
        : `${base}/quotes?page=${p}&limit=${PAGE_SIZE}`;

      const finalUrl = `${proxy}${apiUrl}`;
      console.log("Fetching:", finalUrl);

      const res = await fetch(finalUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const results = data.results || data;
      setQuotes(results || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch quotes. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes(query, page);
  }, [query, page, fetchQuotes]);

  const onSearch = useCallback((q) => {
    setQuery(q);
    setPage(1);
  }, []);

  return (
    <div className="container">
      <header>
        <h1>QuoteFinder</h1>
        <p className="subtitle">Search inspiring quotes and authors (Public API)</p>
      </header>

      <SearchBar defaultValue="" onSearch={onSearch} />

      {loading && <div className="status">Loading…</div>}
      {error && <div className="status error">{error}</div>}
      {!loading && !error && quotes.length === 0 && (
        <div className="status">No results found.</div>
      )}

      <div className="grid">
        {quotes.map((q, i) => (
          <QuoteCard key={q._id || i} quote={q} />
        ))}
      </div>

      <div className="pager">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          ← Prev
        </button>
        <span>Page {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Next →
        </button>
      </div>

      <footer>
        <small>Built with React + Vite • Uses Quotable API</small>
      </footer>
    </div>
  )
}
