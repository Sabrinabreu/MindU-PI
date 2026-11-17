import React, { useState } from 'react';
import { getIniciais } from '../api';

export function ProfissionalCard({ profissional, onAgendar }) {
  const [fotoQuebrada, setFotoQuebrada] = useState(false);
  const mostrarFoto = profissional.foto && !fotoQuebrada;

  return (
    <div className="prof-card glass-card">
      <div className="prof-card-top">
        {mostrarFoto ? (
          <img
            src={profissional.foto}
            alt={profissional.nome}
            className="prof-foto"
            onError={() => setFotoQuebrada(true)}
          />
        ) : (
          <div
            className="prof-foto avatar-text"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}
          >
            {getIniciais(profissional.nome)}
          </div>
        )}

        <div className="prof-info">
          <h3>{profissional.nome}</h3>
          <span className="prof-area">{formatarTipo(profissional.tipo)}</span>

          <div className="prof-tags">
            {(profissional.especialidades || []).map((esp, index) => (
              <span key={index} className="prof-tag">{esp}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="prof-bio">{profissional.bio || 'Sem biografia.'}</p>

      <div className="prof-card-footer">
        <div className="prof-modalidades">
          {(profissional.modalidades || []).includes('VIRTUAL') && (
            <span className="modalidade-icon" title="Atende Online">
              <span className="material-symbols-outlined">devices</span>
            </span>
          )}
          {(profissional.modalidades || []).includes('PRESENCIAL') && (
            <span className="modalidade-icon" title="Atende Presencialmente">
              <span className="material-symbols-outlined">location_on</span>
            </span>
          )}
        </div>

        <button className="btn-agendar" onClick={() => onAgendar(profissional)}>
          Agendar Consulta
        </button>
      </div>
    </div>
  );
}

function formatarTipo(tipo) {
  return {
    PSICOLOGO: 'Psicólogo(a)',
    PSIQUIATRA: 'Psiquiatra',
    TERAPEUTA: 'Terapeuta',
  }[tipo] || tipo || 'Profissional';
}