import React, { useState, useEffect } from 'react';
import { getUsuario, api } from '../api';
import { JitsiMeeting } from '@jitsi/react-sdk';
import '../css/historico.css';

const TABS = [
  { id: 'AGENDADA', label: 'Agendadas' },
  { id: 'REALIZADA', label: 'Realizadas' },
  { id: 'CANCELADA', label: 'Canceladas' },
];

const PODE_ENTRAR_MINUTOS_ANTES = 15;
const PODE_ENTRAR_MINUTOS_DEPOIS = 60;

export function Historico() {
  const usuario = getUsuario();
  const isProfissional = usuario?.tipo === 'PROFISSIONAL';

  const [abaAtiva, setAbaAtiva] = useState('AGENDADA');
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salaAberta, setSalaAberta] = useState(false);
  const [consultaAtiva, setConsultaAtiva] = useState(null);

  const carregarConsultas = async () => {
    try {
      const endpoint = isProfissional
        ? '/v1/agendamentos/minha-agenda'
        : '/v1/agendamentos/meus';

      const res = await api(endpoint);

      const formatadas = res.map((ag) => {
        const dataObj = new Date(ag.dataHora);
        const passou = dataObj < new Date();

        let statusVisual = 'AGENDADA';
        if (ag.status === 'REALIZADO') statusVisual = 'REALIZADA';
        else if (ag.status === 'CANCELADO') statusVisual = 'CANCELADA';
        else if (ag.status === 'AGENDADO' && passou) statusVisual = 'REALIZADA';

        const nomeExibicao = isProfissional ? ag.clienteNome : ag.profissionalNome;
        const papelExibicao = isProfissional ? 'Paciente' : 'Profissional';

        return {
          id: ag.id,
          isoCompleto: ag.dataHora,
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
      setConsultas((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: 'CANCELADA', statusOriginal: 'CANCELADO' } : c
        )
      );
      alert('Consulta cancelada com sucesso.');
    } catch (err) {
      alert('Erro ao cancelar: ' + err.message);
    }
  };

  const handleEntrarNaSala = (consulta) => {
    if (consulta.modalidade !== 'ONLINE') {
      return alert('Esta consulta é presencial.');
    }

    const agora = new Date();
    const dataConsulta = new Date(consulta.isoCompleto);
    const diffMin = (dataConsulta - agora) / 60000;

    if (diffMin > PODE_ENTRAR_MINUTOS_ANTES) {
      const mins = Math.ceil(diffMin);
      return alert(`A sala abre 15 minutos antes da consulta. Faltam aproximadamente ${mins} minutos.`);
    }
    if (diffMin < -PODE_ENTRAR_MINUTOS_DEPOIS) {
      return alert('O horário desta consulta já passou.');
    }

    setConsultaAtiva(consulta);
    setSalaAberta(true);
  };

  const handleFecharSala = () => {
    setSalaAberta(false);
    setConsultaAtiva(null);
  };

  const consultasFiltradas = consultas.filter((c) => c.status === abaAtiva);

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
        <p>
          {isProfissional
            ? 'Gerencie os atendimentos com seus pacientes.'
            : 'Acompanhe suas sessões passadas e futuras.'}
        </p>
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
                  <span>
                    {consulta.papelExibicao} • Sessão {consulta.modalidade}
                  </span>
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
                    <button className="btn-outline" onClick={() => handleCancelar(consulta.id)}>
                      Cancelar
                    </button>
                    {consulta.modalidade === 'ONLINE' && (
                      <button className="btn-primary" onClick={() => handleEntrarNaSala(consulta)}>
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

      {salaAberta && consultaAtiva && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1200px',
              height: '90vh',
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.8rem 1.2rem',
                backgroundColor: '#2a2a2a',
                color: '#fff',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>
                Consulta com {consultaAtiva.nomeExibicao}
              </span>
              <button
                onClick={handleFecharSala}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                ✕ Fechar
              </button>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <JitsiMeeting
                domain="meet.jit.si"
                roomName={`MindU-${consultaAtiva.id}`}
                configOverwrite={{
                  startWithAudioMuted: true,
                  startWithVideoMuted: false,
                  prejoinPageEnabled: false,
                  disableModeratorIndicator: true,
                }}
                interfaceConfigOverwrite={{
                  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                  SHOW_JITSI_WATERMARK: false,
                  MOBILE_APP_PROMO: false,
                }}
                userInfo={{
                  displayName: usuario.nome || (isProfissional ? 'Profissional' : 'Beneficiário'),
                }}
                onApiReady={() => {}}
                getIFrameRef={(iframeRef) => {
                  iframeRef.style.height = '100%';
                  iframeRef.style.width = '100%';
                  iframeRef.style.border = 'none';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}