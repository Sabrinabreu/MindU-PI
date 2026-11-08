import React, { useState, useEffect } from 'react';
import { getUsuario, api } from '../api';
import { Calendar } from '../components/calendar';
import '../css/agenda.css';

const NOMES_MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function Agenda() {
  const usuario = getUsuario();
  const isProfissional = usuario?.tipo === 'PROFISSIONAL';
  
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diaSelecionado, setDiaSelecionado] = useState(new Date());

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const endpoint = isProfissional ? '/v1/agendamentos/minha-agenda' : '/v1/agendamentos/meus';
        const res = await api(endpoint);
        
        const formatados = res.map(ag => {
          const dataObj = new Date(ag.dataHora);
          return {
            id: ag.id,
            data: dataObj.toISOString().split('T')[0], // YYYY-MM-DD
            hora: dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            profissionalNome: ag.profissionalNome,
            pacienteNome: ag.clienteNome,
            modalidade: ag.modalidade === 'VIRTUAL' ? 'ONLINE' : ag.modalidade,
            status: ag.status
          };
        });
        setAgendamentos(formatados);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamentos();
  }, [isProfissional]);

  // Filtra os eventos que acontecem no dia selecionado
  const dataChave = diaSelecionado.toISOString().split('T')[0];
  const eventosDoDia = agendamentos.filter(a => a.data === dataChave);

  const agendamentosAgrupados = agendamentos.reduce((acc, ag) => {
    if (!acc[ag.data]) acc[ag.data] = [];
    acc[ag.data].push(ag);
    return acc;
  }, {});

  if (loading) return <div className="loading"><span className="material-symbols-outlined girando">progress_activity</span><p>Carregando…</p></div>;

  return (
    <div className="agenda-page">
      <aside className="agenda-painel glass-card">
        <div className="agenda-perfil">
          <h2>Olá, {usuario?.nome.split(' ')[0]}</h2>
          <p>{isProfissional ? 'Gerencie seus atendimentos' : 'Acompanhe suas sessões'}</p>
        </div>

        <div className="agenda-detalhes-dia">
          <h3>Agenda de {diaSelecionado.getDate()} de {NOMES_MESES[diaSelecionado.getMonth()]}</h3>
          
          <div className="agenda-lista-eventos">
            {eventosDoDia.length === 0 ? (
              <div className="agenda-vazio">
                <span className="material-symbols-outlined">free_cancellation</span>
                <p>Nenhum evento.</p>
              </div>
            ) : (
              eventosDoDia.map(evt => (
                <div key={evt.id} className="agenda-evento">
                  <span className="evento-hora">{evt.hora}</span>
                  <div className="evento-info">
                    <strong>{isProfissional ? `Paciente: ${evt.pacienteNome}` : evt.profissionalNome}</strong>
                    <span>Sessão {evt.modalidade} ({evt.status})</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      <Calendar dataSelecionada={diaSelecionado} onSelectData={setDiaSelecionado} eventos={agendamentosAgrupados} />
    </div>
  );
}