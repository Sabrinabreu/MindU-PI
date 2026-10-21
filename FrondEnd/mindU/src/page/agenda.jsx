import React, { useState } from 'react';
import { getUsuario } from '../api';
import { Calendar } from '../components/calendar';
import '../css/agenda.css';

// Mock de eventos
const MOCK_EVENTOS = {
  '2024-05-15': [
    { id: 1, hora: '09:00', titulo: 'Terapia - Maria Silva', tipo: 'BENEFICIARIO' },
    { id: 2, hora: '14:00', titulo: 'Terapia - João Paulo', tipo: 'BENEFICIARIO' },
  ],
  '2024-05-20': [
    { id: 3, hora: '10:30', titulo: 'Sessão Online - Ana Clara', tipo: 'BENEFICIARIO' },
  ],
  '2024-05-28': [
    { id: 4, hora: '08:00', titulo: 'Workshop de Estresse', tipo: 'EMPRESA' },
  ],
};

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function Agenda() {
  const usuario = getUsuario() || { nome: 'Usuário', tipo: 'BENEFICIARIO' };
  
  // O estado do dia selecionado agora mora aqui na página
  const [diaSelecionado, setDiaSelecionado] = useState(new Date());

  const formatarDataChave = (data) => {
    if (!data) return '';
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const eventosSelecionados = MOCK_EVENTOS[formatarDataChave(diaSelecionado)] || [];

  return (
    <div className="agenda-page">
      
      {/* === COLUNA ESQUERDA (PAINEL) === */}
      <aside className="agenda-painel glass-card">
        <div className="agenda-perfil">
          <h2>Olá, {usuario.nome.split(' ')[0]}</h2>
          <p>Sua agenda de {usuario.tipo === 'PROFISSIONAL' ? 'atendimentos' : 'cuidados'}</p>
        </div>

        <div className="agenda-detalhes-dia">
          <h3>
            {diaSelecionado.getDate()} de {NOMES_MESES[diaSelecionado.getMonth()]}
          </h3>
          
          <div className="agenda-lista-eventos">
            {eventosSelecionados.length === 0 ? (
              <div className="agenda-vazio">
                <span className="material-symbols-outlined">free_cancellation</span>
                <p>Nenhum evento para este dia.</p>
              </div>
            ) : (
              eventosSelecionados.map((evt) => (
                <div key={evt.id} className="agenda-evento">
                  <span className="evento-hora">{evt.hora}</span>
                  <div className="evento-info">
                    <strong>{evt.titulo}</strong>
                    <span>Online</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button className="btn-agenda-acao">
          <span className="material-symbols-outlined">add</span>
          {usuario.tipo === 'PROFISSIONAL' ? 'Nova Disponibilidade' : 'Agendar Sessão'}
        </button>
      </aside>

      {/* === COLUNA DIREITA (CALENDÁRIO) === */}
      <Calendar 
        dataSelecionada={diaSelecionado} 
        onSelectData={setDiaSelecionado} 
        eventos={MOCK_EVENTOS} 
      />

    </div>
  );
}