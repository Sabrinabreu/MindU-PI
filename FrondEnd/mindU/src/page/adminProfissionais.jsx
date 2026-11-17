import React, { useState, useEffect } from 'react';
import { api, BASE_URL, getIniciais } from '../api';
import '../css/adminProfissionais.css';

const TABS = [
  { id: 'PENDENTE', label: 'Pendentes' },
  { id: 'APROVADO', label: 'Aprovados' },
  { id: 'REJEITADO', label: 'Rejeitados' },
  { id: 'TODOS', label: 'Todos' },
];

const TIPO_LABEL = {
  PSICOLOGO: 'Psicólogo(a)',
  PSIQUIATRA: 'Psiquiatra',
  TERAPEUTA: 'Terapeuta',
};

const STATUS_LABEL = {
  PENDENTE: 'Aguardando análise',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
};

export function AdminProfissionais() {
  const [abaAtiva, setAbaAtiva] = useState('PENDENTE');
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);
  const [preview, setPreview] = useState(null);
  const [counts, setCounts] = useState({ PENDENTE: 0, APROVADO: 0, REJEITADO: 0, TODOS: 0 });

  const carregarLista = async () => {
    setLoading(true);
    try {
      const query = abaAtiva === 'TODOS' ? '' : `?status=${abaAtiva}`;
      const res = await api(`/v1/admin/profissionais${query}`);
      setProfissionais(res);
    } catch (err) {
      console.error(err);
      setProfissionais([]);
    } finally {
      setLoading(false);
    }
  };

  const recarregarCounts = async () => {
    try {
      const [pend, aprov, rej] = await Promise.all([
        api('/v1/admin/profissionais?status=PENDENTE'),
        api('/v1/admin/profissionais?status=APROVADO'),
        api('/v1/admin/profissionais?status=REJEITADO'),
      ]);
      setCounts({
        PENDENTE: pend.length,
        APROVADO: aprov.length,
        REJEITADO: rej.length,
        TODOS: pend.length + aprov.length + rej.length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    recarregarCounts();
  }, []);

  useEffect(() => {
    carregarLista();
  }, [abaAtiva]);

  const executarAcao = async () => {
    if (!confirmacao) return;
    const { prof, aprovar } = confirmacao;
    setProcessando(prof.id);
    try {
      await api(`/v1/profissionais/${prof.id}/aprovacao?aprovado=${aprovar}`, { method: 'PATCH' });
      setConfirmacao(null);
      await carregarLista();
      await recarregarCounts();
    } catch (err) {
      alert('Erro: ' + err.message);
    } finally {
      setProcessando(null);
    }
  };

  const abrirPreview = async (prof) => {
    setPreview({ prof, loading: true });
    try {
      const res = await fetch(`${BASE_URL}/v1/admin/profissionais/${prof.id}/carteirinha`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('mindu_token')}` },
      });
      if (!res.ok) {
        setPreview({
          prof,
          erro: 'Não foi possível carregar a carteirinha. Verifique se o profissional enviou o arquivo corretamente.',
        });
        return;
      }
      const blob = await res.blob();
      setPreview({ prof, url: URL.createObjectURL(blob) });
    } catch (err) {
      setPreview({ prof, erro: 'Erro de rede ao carregar a carteirinha.' });
    }
  };

  const fecharPreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const tempoRestante = (prazoIso) => {
    if (!prazoIso) return null;
    const diff = new Date(prazoIso) - new Date();
    if (diff <= 0) return { classe: 'expirado', icone: 'error', texto: 'Prazo expirado' };
    const horas = Math.floor(diff / 3600000);
    const minutos = Math.floor((diff % 3600000) / 60000);
    if (horas < 24) return { classe: 'urgente', icone: 'timer', texto: `${horas}h ${minutos}m restantes` };
    const dias = Math.floor(horas / 24);
    return {
      classe: 'ok',
      icone: 'schedule',
      texto: `${dias} dia${dias > 1 ? 's' : ''} restante${dias > 1 ? 's' : ''}`,
    };
  };

  const formatarData = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="admin-prof-page">
      <div className="admin-prof-header">
        <h1>Verificação de Profissionais</h1>
        <p>Analise a carteirinha (CRP/CRM) e aprove ou rejeite o cadastro.</p>
      </div>

      <div className="admin-prof-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-prof-tab ${abaAtiva === tab.id ? 'active' : ''}`}
            onClick={() => setAbaAtiva(tab.id)}
          >
            {tab.label}
            <span className="admin-prof-tab-count">{counts[tab.id] ?? 0}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-prof-loading">
          <span className="material-symbols-outlined girando">progress_activity</span>
          <p>Carregando profissionais...</p>
        </div>
      ) : (
        <div className="admin-prof-grid">
          {profissionais.length === 0 ? (
            <div className="admin-prof-vazio">
              <span className="material-symbols-outlined">verified_user</span>
              <p>Nenhum profissional nesta categoria.</p>
            </div>
          ) : (
            profissionais.map((prof) => {
              const prazo = tempoRestante(prof.prazoVerificacaoAte);
              const processandoEste = processando === prof.id;
              return (
                <AdminCard
                  key={prof.id}
                  prof={prof}
                  prazo={prazo}
                  processandoEste={processandoEste}
                  onPreview={abrirPreview}
                  onConfirmar={setConfirmacao}
                />
              );
            })
          )}
        </div>
      )}

      {confirmacao && (
        <div
          className="admin-prof-modal-backdrop"
          onClick={() => !processando && setConfirmacao(null)}
        >
          <div className="admin-prof-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{confirmacao.aprovar ? 'Aprovar' : 'Rejeitar'} profissional?</h3>
            <p>
              {confirmacao.aprovar ? (
                <>
                  Você está aprovando <strong>{confirmacao.prof.nome}</strong>. O profissional passará
                  a aparecer na busca e poderá receber agendamentos.
                </>
              ) : (
                <>
                  Você está rejeitando <strong>{confirmacao.prof.nome}</strong>. Ele precisará reenviar
                  a carteirinha para ser aprovado.
                </>
              )}
            </p>
            <div className="admin-prof-modal-actions">
              <button
                className="btn-outline"
                onClick={() => setConfirmacao(null)}
                disabled={!!processando}
              >
                Cancelar
              </button>
              <button
                className={confirmacao.aprovar ? 'btn-aprovar' : 'btn-rejeitar'}
                onClick={executarAcao}
                disabled={!!processando}
              >
                {processando ? 'Processando...' : confirmacao.aprovar ? 'Sim, aprovar' : 'Sim, rejeitar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {preview && (
        <div className="admin-prof-modal-backdrop" onClick={fecharPreview}>
          <div className="admin-prof-modal-preview" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Carteirinha — {preview.prof.nome}</h3>
              <button className="btn-outline" onClick={fecharPreview}>Fechar</button>
            </div>
            {preview.loading ? (
              <div className="admin-prof-preview-erro">
                <span className="material-symbols-outlined girando" style={{ fontSize: '2rem', display: 'block' }}>
                  progress_activity
                </span>
                <p>Carregando...</p>
              </div>
            ) : preview.erro ? (
              <div className="admin-prof-preview-erro">
                <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>
                  info
                </span>
                <p>{preview.erro}</p>
              </div>
            ) : (
              <img src={preview.url} alt="Carteirinha" className="admin-prof-preview-img" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCard({ prof, prazo, processandoEste, onPreview, onConfirmar }) {
  const [fotoErro, setFotoErro] = useState(false);

  return (
    <div className="admin-prof-card">
      <div className="admin-prof-card-top">
        {!fotoErro ? (
          <img
            src={`${BASE_URL}/v1/admin/profissionais/${prof.id}/foto`}
            alt={prof.nome}
            className="admin-prof-avatar"
            style={{ objectFit: 'cover' }}
            onError={() => setFotoErro(true)}
          />
        ) : (
          <div className="admin-prof-avatar">{getIniciais(prof.nome)}</div>
        )}
        <div className="admin-prof-info">
          <h3>{prof.nome}</h3>
          <div className="admin-prof-email">{prof.email}</div>
          <div className="admin-prof-meta">
            <span className="admin-prof-badge tipo">{TIPO_LABEL[prof.tipo] || prof.tipo}</span>
            <span className={`admin-prof-badge status-${(prof.status || '').toLowerCase()}`}>
              {STATUS_LABEL[prof.status] || prof.status}
            </span>
          </div>
        </div>
      </div>

      {prof.tags?.length > 0 && (
        <div className="admin-prof-tags">
          {prof.tags.map((t) => (
            <span key={t} className="admin-prof-tag">{t}</span>
          ))}
        </div>
      )}

      <div className="admin-prof-info-linha">
        <span className="material-symbols-outlined">upload_file</span>
        Carteirinha enviada em {formatarData(prof.carteirinhaEnviadaEm)}
      </div>

      {prazo && prof.status === 'PENDENTE' && (
        <div className={`admin-prof-prazo ${prazo.classe}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            {prazo.icone}
          </span>
          {prazo.texto}
        </div>
      )}

      <div className="admin-prof-actions">
        <button className="btn-ver-carteirinha" onClick={() => onPreview(prof)}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
          Carteirinha
        </button>

        {prof.status === 'PENDENTE' && (
          <>
            <button
              className="btn-rejeitar"
              onClick={() => onConfirmar({ prof, aprovar: false })}
              disabled={processandoEste}
            >
              Rejeitar
            </button>
            <button
              className="btn-aprovar"
              onClick={() => onConfirmar({ prof, aprovar: true })}
              disabled={processandoEste}
            >
              {processandoEste ? 'Processando...' : 'Aprovar'}
            </button>
          </>
        )}

        {prof.status === 'APROVADO' && (
          <button
            className="btn-rejeitar"
            onClick={() => onConfirmar({ prof, aprovar: false })}
            disabled={processandoEste}
          >
            Revogar acesso
          </button>
        )}

        {prof.status === 'REJEITADO' && (
          <span style={{ fontSize: '0.82rem', color: 'var(--text-s)', padding: '0.5rem', alignSelf: 'center' }}>
            Aguardando reenvio
          </span>
        )}
      </div>
    </div>
  );
}

function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}