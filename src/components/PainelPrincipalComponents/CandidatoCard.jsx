export function CandidatoCard({ candidato }) {
  const { nome, localidade, percentual, label, tags, experiencia, formacao, badge, avatar } = candidato

  return (
    <div className="sl-card">
      <div className="sl-score">
        <span className={`sl-pct pct-${badge.cor}`}>{percentual}%</span>
        <span className="sl-pct-label">{label}</span>
      </div>

      <img src={avatar} alt={nome} className="sl-avatar" />

      <div className="sl-info">
        <div className="sl-name-row">
          <span className="sl-name">{nome}</span>
          <span className="sl-location">📍 {localidade}</span>
        </div>
        <div className="sl-tags">
          {tags.map(t => <span key={t} className="sl-tag">{t}</span>)}
        </div>
        <div className="sl-meta">
          <span>🗂 {experiencia}</span>
          <span>🎓 {formacao}</span>
        </div>
        <div className={`sl-badge badge-${badge.cor}`}>{badge.texto}</div>
      </div>

      <button className="sl-bookmark" aria-label="Salvar">🔖</button>
    </div>
  )
}