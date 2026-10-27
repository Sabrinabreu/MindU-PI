import React, { useState } from 'react';
import { getUsuario } from '../api';
import { Calendar } from '../components/calendar';
import '../css/agenda.css';

const MOCK_AGENDAMENTOS = [
  {
    id: 1,
    data: '2026-10-15',
    hora: '09:00',
    profissionalId: 'mock-prof-1',
    profissionalNome: 'Dr. Roberto',
    clienteId: 'mock-cli-1',
    pacienteNome: 'Maria Silva',
    modalidade: 'ONLINE'
  },
  {
    id: 2,
    data: '2026-10-15',
    hora: '14:00',
    profissionalId: 'mock-prof-1',
    profissionalNome: 'Dr. Roberto',
    clienteId: 'mock-cli-2',
    pacienteNome: 'João Paulo',
    modalidade: 'PRESENCIAL'
  },
  {
    id: 3,
    data: '2026-10-20',
    hora: '10:30',
    profissionalId: 'mock-prof-2',
    profissionalNome: 'Dra. Camila',
    clienteId: 'mock-cli-1',
    pacienteNome: 'Maria Silva',
    modalidade: 'ONLINE'
  },
  {
    id: 4,
    data: '2026-10-28',
    hora: '08:00',
    profissionalId: 'mock-prof-1',
    profissionalNome: 'Dr. Roberto',
    clienteId: 'mock-cli-3',
    pacienteNome: 'Ana Clara',
    modalidade: 'ONLINE'
  },
];

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function Agenda() {
  const usuario = getUsuario() || { id: 'mock-cli-1', nome: 'Usuário Teste', tipo: 'BENEFICIARIO' };
  const isProfissional = usuario.tipo === 'PROFISSIONAL';
  
  const [diaSelecionado, setDiaSelecionado] = useState(new Date());

  // FILTRO (ID logado bate com o ID do profissional ou do cliente)
  const meusAgendamentos = MOCK_AGENDAMENTOS.filter((agendamento) => {
    if (isProfissional) {
      return agendamento.profissionalId === usuario.id;
    } else {
      return agendamento.clienteId === usuario.id;
    }
  });

  const agendamentosAgrupados = meusAgendamentos.reduce((acc, agendamento) => {
    const data = agendamento.data;
    if (!acc[data]) acc[data] = [];
    acc[data].push(agendamento);
    return acc;
  }, {});

  const formatarDataChave = (data) => {
    if (!data) return '';
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const eventosDoDiaSelecionado = agendamentosAgrupados[formatarDataChave(diaSelecionado)] || [];

  return (
    <div className="agenda-page">
      
      {/* === COLUNA ESQUERDA (PAINEL) === */}
      <aside className="agenda-painel glass-card">
        <div className="agenda-perfil">
          <h2>Olá, {usuario.nome.split(' ')[0]}</h2>
          <p>
            {isProfissional 
              ? 'Gerencie sua agenda de atendimentos' 
              : 'Acompanhe suas sessões de terapia'}
          </p>
        </div>

        <div className="agenda-detalhes-dia">
          <h3>
            Agenda de {diaSelecionado.getDate()} de {NOMES_MESES[diaSelecionado.getMonth()]}
          </h3>
          
          <div className="agenda-lista-eventos">
            {eventosDoDiaSelecionado.length === 0 ? (
              <div className="agenda-vazio">
                <span className="material-symbols-outlined">free_cancellation</span>
                <p>Nenhum evento para este dia.</p>
              </div>
            ) : (
              eventosDoDiaSelecionado.map((evt) => (
                <div key={evt.id} className="agenda-evento">
                  <span className="evento-hora">{evt.hora}</span>
                  <div className="evento-info">
                    <strong>
                      {isProfissional ? `Paciente: ${evt.pacienteNome}` : evt.profissionalNome}
                    </strong>
                    <span>Sessão {evt.modalidade}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button className="btn-agenda-acao">
          <span className="material-symbols-outlined">add</span>
          {isProfissional ? 'Nova Disponibilidade' : 'Agendar Sessão'}
        </button>
      </aside>

      {/* === COLUNA DIREITA (CALENDÁRIO) === */}
      <Calendar 
        dataSelecionada={diaSelecionado} 
        onSelectData={setDiaSelecionado} 
        eventos={agendamentosAgrupados}
      />

    </div>
  );
}