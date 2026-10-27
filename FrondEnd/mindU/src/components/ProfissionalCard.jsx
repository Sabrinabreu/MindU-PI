import React from 'react';

export function ProfissionalCard({ profissional, onAgendar }) {
  return (
    <div className="prof-card glass-card">
      <div className="prof-card-top">
        <img src={profissional.foto} alt={profissional.nome} className="prof-foto" />
        
        <div className="prof-info">
          <h3>{profissional.nome}</h3>
          <span className="prof-area">{profissional.tipo}</span>
          
          <div className="prof-tags">
            {profissional.especialidades.map((esp, index) => (
              <span key={index} className="prof-tag">{esp}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="prof-bio">{profissional.bio}</p>

      <div className="prof-card-footer">
        <div className="prof-modalidades">
          {profissional.modalidade === 'ONLINE' || profissional.modalidade === 'AMBOS' ? (
            <span className="modalidade-icon" title="Atende Online">
              <span className="material-symbols-outlined">devices</span>
            </span>
          ) : null}
          {profissional.modalidade === 'PRESENCIAL' || profissional.modalidade === 'AMBOS' ? (
            <span className="modalidade-icon" title="Atende Presencialmente">
              <span className="material-symbols-outlined">location_on</span>
            </span>
          ) : null}
        </div>

        <button 
          className="btn-agendar" 
          onClick={() => onAgendar(profissional)}
        >
          Agendar Consulta
        </button>
      </div>
    </div>
  );
}