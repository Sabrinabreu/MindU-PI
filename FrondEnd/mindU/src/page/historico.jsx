import React, { useState, useEffect } from 'react';
import { getUsuario, api } from '../api';
import '../css/historico.css';

const TABS = [
  { id: 'AGENDADA', label: 'Agendadas' },
  { id: 'REALIZADA', label: 'Realizadas' },
  { id: 'CANCELADA', label: 'Canceladas' },
];

export function Historico() {
  const usuario = getUsuario();
  const isProfissional = usuario?.tipo === 'PROFISSIONAL';
  
  const [abaAtiva, setAbaAtiva] = useState('AGENDADA');
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarConsultas = async () => {
    try {
      // 👇 Escolhe a rota baseada no tipo de usuário
      const endpoint = isProfissional 
        ? '/v1/agendamentos/minha-agenda' 
        : '/v1/agendamentos/meus';
        
      const res = await api(endpoint);
      
      const formatadas = res.map(ag => {
        const dataObj = new Date(ag.dataHora);
        
        let statusVisual = 'AGENDADA';
        if (ag.status === 'REALIZADO') statusVisual = 'REALIZADA';
        if (ag.status === 'CANCELADO') statusVisual = 'CANCELADA';

        // 👇 Define quem é a "outra pessoa" na consulta
        const nomeExibicao = isProfissional ? ag.clienteNome : ag.profissionalNome;
        const papelExibicao = isProfissional ? 'Paciente' : 'Profissional';

        return {
          id: ag.id,
          data: dataObj.toLocaleDateString('pt-BR'),
          hora: dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          nomeExibicao,
          papelExibicao,
          modalidade: ag.modalidade === 'VIRTUAL' ? 'ONLINE' : ag.modalidade,
          status: statusVisual,
          statusOriginal: ag.status,
        };
      });
      
      setConsultas(formatadas);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarConsultas();
  }, [isProfissional]);

  const handleCancelar = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) return;
    try {
      await api(`/v1/agendamentos/${id}/cancelamento`, { method: 'PATCH' });
      setConsultas(prev => prev.map(c => 
        c.id === id ? { ...c, status: 'CANCELADA', statusOriginal: 'CANCELADO' } : c
      ));
      alert('Consulta cancelada com sucesso.');
    } catch (err) {
      alert('Erro ao cancelar: ' + err.message);
    }
  };

  const consultasFiltradas = consultas.filter(c => c.status === abaAtiva);

  if (loading) {
    return (
      <div className="historico-page">
        <div className="loading">
          <span className="material-symbols-outlined girando">progress_activity</span>
          <p>Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="historico-page">
      <div className="historico-header">
        <h1>{isProfissional ? 'Meus Atendimentos' : 'Histórico de Consultas'}</h1>
        <p>{isProfissional ? 'Gerencie os atendimentos com seus pacientes.' : 'Acompanhe suas sessões passadas e futuras.'}</p>
      </div>

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
                <div className="avatar-iniciais">
                  {consulta.nomeExibicao.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{consulta.nomeExibicao}</h3>
                  <span>{consulta.papelExibicao} • Sessão {consulta.modalidade}</span>
                </div>
              </div>

              <div className="hist-data">
                <span className="material-symbols-outlined">calendar_today</span>
                <div>
                  <strong>{consulta.data}</strong>
                  <span>às {consulta.hora}</span>
                </div>
              </div>

              <div className="hist-actions">
                {consulta.status === 'AGENDADA' && (
                  <>
                    {/* Se for beneficiário, ele pode cancelar. Se for profissional, ele pode cancelar também (backend permite) */}
                    <button className="btn-outline" onClick={() => handleCancelar(consulta.id)}>
                      Cancelar
                    </button>
                    
                    {/* Botão de entrar na sala (se for online) */}
                    {consulta.modalidade === 'ONLINE' && (
                       <button className="btn-primary">
                         {isProfissional ? 'Iniciar Atendimento' : 'Entrar na Sala'}
                       </button>
                    )}
                  </>
                )}
                
                {consulta.status === 'REALIZADA' && (
                  <>
                    {!isProfissional && (
                      <>
                        <button className="btn-outline">Baixar Recibo</button>
                        <button className="btn-primary">Avaliar Consulta</button>
                      </>
                    )}
                    {isProfissional && (
                      <button className="btn-outline">Ver Prontuário</button>
                    )}
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