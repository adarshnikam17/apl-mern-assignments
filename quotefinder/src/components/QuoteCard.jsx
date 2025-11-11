export default function QuoteCard({ quote }) {
  return (
    <div className="card">
      <p className="content">“{quote.content}”</p>
      <div className="meta">
        <span>— {quote.author}</span>
        {quote.tags?.length ? <span className="tags">{quote.tags.join(', ')}</span> : null}
      </div>
    </div>
  )
}
