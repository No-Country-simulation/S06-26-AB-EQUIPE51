import React from 'react'
import { CandidatoCard } from '../PainelPrincipalComponents/CandidatoCard'

const ShortlistIndex = ({ candidatos = [] }) => {
  return (
    <div className="sl-wrap">
      <div className="sl-header">
        <h2 className="sl-title">Melhores matches</h2>
        <button className="sl-btn-all">Ver todos</button>
      </div>

      {candidatos.map(c => (
        <CandidatoCard key={c.id} candidato={c} />
      ))}

      <footer className="sl-footer">
        <a href="/matches">Ver todos os matches →</a>
      </footer>
    </div>
  )
}

export default ShortlistIndex
