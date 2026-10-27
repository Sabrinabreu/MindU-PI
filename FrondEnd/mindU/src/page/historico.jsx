import React, { useState } from 'react';
import '../css/historico.css';

const MOCK_HISTORICO = [
  {
    id: 1,
    data: '2024-06-10',
    hora: '14:00',
    profissionalNome: 'Dr. Roberto Rocha',
    profissionalFoto: 'https://i.pravatar.cc/200?img=11',
    especialidade: 'Psicólogo',
    modalidade: 'ONLINE',
    status: 'AGENDADA', // AGENDADA | REALIZADA | CANCELADA
  },
  {
    id: 2,
    data: '2024-05-20',
    hora: '10:30',
    profissionalNome: 'Dra. Camila Ribeiro',
    profissionalFoto: 'https://i.pravatar.cc/200?img=5',
    especialidade: 'Psiquiatra',
    modalidade: 'ONLINE',
    status: 'REALIZADA',
  },
  {
    id: 3,
    data: '2024-04-15',
    hora: '09:00',
    profissionalNome: 'Dr. Roberto Rocha',
    profissionalFoto: 'https://i.pravatar.cc/200?img=11',
    especialidade: 'Psicólogo',
    modalidade: 'PRESENCIAL',
    status: 'REALIZADA',
  },
  {
    id: 4,
    data: '2024-03-02',
    hora: '16:00',
    profissionalNome: 'Dr. Lucas Mendes',
    profissionalFoto: 'https://i.pravatar.cc/200?img=59',
    especialidade: 'Terapeuta',
    modalidade: 'PRESENCIAL',
    status: 'CANCELADA',
  },
];

const TABS = [
  { id: 'AGENDADA', label: 'Agendadas' },
  { id: 'REALIZADA', label: 'Realizadas' },
  { id: 'CANCELADA', label: 'Canceladas' },
];

export function Historico() {
  const [abaAtiva, setAbaAtiva] = useState('AGENDADA');
  const consultasFiltradas = MOCK_HISTORICO.filter(c => c.status === abaAtiva);

  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="historico-page">
      <div className="historico-header">
        <h1>Histórico de Consultas</h1>
        <p>Acompanhe suas sessões passadas e futuras.</p>
      </div>

      {/* Navegação por Abas */}
      <div className="historico-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${abaAtiva === tab.id ? 'active' : ''}`}
            onClick={() => setAbaAtiva(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="historico-lista">
        {consultasFiltradas.length === 0 ? (
          <div className="historico-vazio">
            <span className="material-symbols-outlined">event_note</span>
            <p>Nenhuma consulta encontrada nesta categoria.</p>
          </div>
        ) : (
          consultasFiltradas.map((consulta) => (
            <div key={consulta.id} className="historico-card glass-card">
              
              <div className="hist-profile">
                <img src={consulta.profissionalFoto} alt={consulta.profissionalNome} />
                <div>
                  <h3>{consulta.profissionalNome}</h3>
                  <span>{consulta.especialidade} • {consulta.modalidade}</span>
                </div>
              </div>

              <div className="hist-data">
                <span className="material-symbols-outlined">calendar_today</span>
                <div>
                  <strong>{formatarData(consulta.data)}</strong>
                  <span>às {consulta.hora}</span>
                </div>
              </div>

              <div className="hist-actions">
                {consulta.status === 'AGENDADA' && (
                  <>
                    <button className="btn-outline">Remarcar</button>
                    <button className="btn-primary">Entrar na Sala</button>
                  </>
                )}
                
                {consulta.status === 'REALIZADA' && (
                  <>
                    <button className="btn-outline">Baixar Recibo</button>
                    <button className="btn-primary">Avaliar Consulta</button>
                  </>
                )}

                {consulta.status === 'CANCELADA' && (
                  <button className="btn-outline" disabled>Cancelada</button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}