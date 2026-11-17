import React, { useState, useEffect } from 'react';
import { api, getIniciais } from '../api';
import '../css/adminClientes.css';

const STATUS_CLIENTE = {
  AGUARDANDO_APROVACAO: { label: 'Aguardando aprovação', classe: 'aguardando' },
  APROVADO: { label: 'Aprovado', classe: 'aprovado' },
  REJEITADO: { label: 'Rejeitado', classe: 'rejeitado' },
};

const STATUS_EXCLUSAO = {
  PENDENTE: { label: 'Pendente', classe: 'pendente' },
  EM_ANALISE: { label: 'Em análise', classe: 'analise' },
  CONCLUIDA: { label: 'Concluída', classe: 'concluida' },
  RECUSADA: { label: 'Recusada', classe: 'recusada' },
};

const TIPO_CONTA_LABEL = {
  CLIENTE: 'Beneficiário',
  PROFISSIONAL: 'Profissional',
  EMPRESA: 'Empresa',
};

export function AdminClientes() {
  const [abaAtiva, setAbaAtiva] = useState('BENEFICIARIOS');

  // Beneficiários
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState({});
  const [filtroStatusCliente, setFiltroStatusCliente] = useState('TODOS');
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [processando, setProcessando] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);

  // Exclusões
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [filtroStatusExclusao, setFiltroStatusExclusao] = useState('PENDENTE');
  const [loadingExclusoes, setLoadingExclusoes] = useState(true);

  const carregarClientes = async () => {
    setLoadingClientes(true);
    try {
      const [clientesRes, empresasRes] = await Promise.all([
        api('/v1/admin/clientes'),
        api('/v1/admin/empresas'),
      ]);
      const mapEmpresas = {};
      empresasRes.forEach((e) => { mapEmpresas[e.id] = e.nomeFantasia; });
      setEmpresas(mapEmpresas);
      setClientes(clientesRes);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
    } finally {
      setLoadingClientes(false);
    }
  };

  const carregarExclusoes = async () => {
    setLoadingExclusoes(true);
    try {
      const res = await api('/v1/admin/solicitacoes-exclusao');
      setSolicitacoes(res);
    } catch (err) {
      console.error('Erro ao carregar exclusões:', err);
    } finally {
      setLoadingExclusoes(false);
    }
  };

  useEffect(() => {
    carregarClientes();
    carregarExclusoes();
  }, []);

  const desativarCliente = async () => {
    if (!confirmacao) return;
    setProcessando(confirmacao.id);
    try {
      await api(`/v1/admin/clientes/${confirmacao.id}`, { method: 'DELETE' });
      setClientes((prev) => prev.filter((c) => c.id !== confirmacao.id));
      setConfirmacao(null);
    } catch (err) {
      alert('Erro: ' + err.message);
    } finally {
      setProcessando(null);
    }
  };

  const atualizarSolicitacao = async (solicitacao, novoStatus) => {
    setProcessando(solicitacao.id);
    try {
      const res = await api(`/v1/admin/solicitacoes-exclusao/${solicitacao.id}`, {
        method: 'PATCH',
        body: { status: novoStatus },
      });
      setSolicitacoes((prev) => prev.map((s) => (s.id === solicitacao.id ? res : s)));
    } catch (err) {
      alert('Erro: ' + err.message);
    } finally {
      setProcessando(null);
    }
  };

  const clientesFiltrados =
    filtroStatusCliente === 'TODOS'
      ? clientes
      : clientes.filter((c) => c.status === filtroStatusCliente);

  const exclusoesFiltradas =
    filtroStatusExclusao === 'TODOS'
      ? solicitacoes
      : solicitacoes.filter((s) => s.status === filtroStatusExclusao);

  const countsExclusao = {
    TODOS: solicitacoes.length,
    PENDENTE: solicitacoes.filter((s) => s.status === 'PENDENTE').length,
    EM_ANALISE: solicitacoes.filter((s) => s.status === 'EM_ANALISE').length,
    CONCLUIDA: solicitacoes.filter((s) => s.status === 'CONCLUIDA').length,
    RECUSADA: solicitacoes.filter((s) => s.status === 'RECUSADA').length,
  };

  const formatarData = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="admin-cli-page">
      <div className="admin-cli-header">
        <h1>Beneficiários & Exclusões</h1>
        <p>Gerencie os colaboradores vinculados e as solicitações de exclusão de conta.</p>
      </div>

      <div className="admin-cli-tabs">
        <button
          className={`admin-cli-tab ${abaAtiva === 'BENEFICIARIOS' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('BENEFICIARIOS')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>group</span>
          Beneficiários
          <span className="admin-cli-tab-count">{clientes.length}</span>
        </button>
        <button
          className={`admin-cli-tab ${abaAtiva === 'EXCLUSOES' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('EXCLUSOES')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete_sweep</span>
          Solicitações de Exclusão
          {countsExclusao.PENDENTE > 0 && (
            <span className="admin-cli-tab-badge">{countsExclusao.PENDENTE}</span>
          )}
        </button>
      </div>

      {abaAtiva === 'BENEFICIARIOS' && (
        <>
          <div className="admin-cli-filtros">
            <label>Filtrar por status</label>
            <div className="admin-cli-filtros-chips">
              {['TODOS', 'AGUARDANDO_APROVACAO', 'APROVADO', 'REJEITADO'].map((s) => (
                <button
                  key={s}
                  className={`admin-cli-filtro-chip ${filtroStatusCliente === s ? 'active' : ''}`}
                  onClick={() => setFiltroStatusCliente(s)}
                >
                  {s === 'TODOS' ? 'Todos' : STATUS_CLIENTE[s].label}
                </button>
              ))}
            </div>
          </div>

          {loadingClientes ? (
            <div className="admin-cli-loading">
              <span className="material-symbols-outlined girando">progress_activity</span>
              <p>Carregando beneficiários...</p>
            </div>
          ) : (
            <div className="admin-cli-grid">
              {clientesFiltrados.length === 0 ? (
                <div className="admin-cli-vazio">
                  <span className="material-symbols-outlined">group_off</span>
                  <p>Nenhum beneficiário encontrado.</p>
                </div>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <div key={cliente.id} className="admin-cli-card">
                    <div className="admin-cli-card-top">
                      <div className="admin-cli-avatar">{getIniciais(cliente.nome)}</div>
                      <div className="admin-cli-info">
                        <h3>{cliente.nome}</h3>
                        <div className="admin-cli-email">{cliente.email}</div>
                        <div className="admin-cli-meta">
                          <span className={`admin-cli-badge status-${STATUS_CLIENTE[cliente.status]?.classe}`}>
                            {STATUS_CLIENTE[cliente.status]?.label || cliente.status}
                          </span>
                          {cliente.empresaId && (
                            <span className="admin-cli-badge empresa">
                              {empresas[cliente.empresaId] || 'Empresa'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {cliente.telefone && (
                      <div className="admin-cli-info-linha">
                        <span className="material-symbols-outlined">call</span>
                        {cliente.telefone}
                      </div>
                    )}

                    <div className="admin-cli-dado-protegido">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
                      Dados clínicos protegidos (LGPD)
                    </div>

                    <div className="admin-cli-actions">
                      <button
                        className="btn-desativar"
                        onClick={() => setConfirmacao(cliente)}
                        disabled={processando === cliente.id}
                      >
                        {processando === cliente.id ? 'Processando...' : 'Desativar conta'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {abaAtiva === 'EXCLUSOES' && (
        <>
          <div className="admin-cli-filtros">
            <label>Filtrar por status</label>
            <div className="admin-cli-filtros-chips">
              {['PENDENTE', 'EM_ANALISE', 'CONCLUIDA', 'RECUSADA', 'TODOS'].map((s) => (
                <button
                  key={s}
                  className={`admin-cli-filtro-chip ${filtroStatusExclusao === s ? 'active' : ''}`}
                  onClick={() => setFiltroStatusExclusao(s)}
                >
                  {s === 'TODOS' ? 'Todos' : STATUS_EXCLUSAO[s].label}
                  <span className="chip-count">{countsExclusao[s] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          {loadingExclusoes ? (
            <div className="admin-cli-loading">
              <span className="material-symbols-outlined girando">progress_activity</span>
              <p>Carregando solicitações...</p>
            </div>
          ) : (
            <div className="admin-cli-grid">
              {exclusoesFiltradas.length === 0 ? (
                <div className="admin-cli-vazio">
                  <span className="material-symbols-outlined">check_circle</span>
                  <p>Nenhuma solicitação nesta categoria.</p>
                </div>
              ) : (
                exclusoesFiltradas.map((sol) => (
                  <div key={sol.id} className="admin-cli-card">
                    <div className="admin-cli-card-top">
                      <div className="admin-cli-avatar icon-only">
                        <span className="material-symbols-outlined">person_remove</span>
                      </div>
                      <div className="admin-cli-info">
                        <h3>{sol.email}</h3>
                        <div className="admin-cli-meta">
                          <span className={`admin-cli-badge status-${STATUS_EXCLUSAO[sol.status]?.classe}`}>
                            {STATUS_EXCLUSAO[sol.status]?.label || sol.status}
                          </span>
                          <span className="admin-cli-badge tipo">
                            {TIPO_CONTA_LABEL[sol.tipoConta] || sol.tipoConta}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="admin-cli-info-linha">
                      <span className="material-symbols-outlined">schedule</span>
                      Solicitada em {formatarData(sol.solicitadaEm)}
                    </div>

                    {sol.status === 'PENDENTE' && (
                      <div className="admin-cli-aviso">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>warning</span>
                        O usuário já está com o acesso bloqueado desde a solicitação.
                      </div>
                    )}

                    <div className="admin-cli-actions">
                      {sol.status === 'PENDENTE' && (
                        <>
                          <button
                            className="btn-analisar"
                            onClick={() => atualizarSolicitacao(sol, 'EM_ANALISE')}
                            disabled={processando === sol.id}
                          >
                            Marcar em análise
                          </button>
                          <button
                            className="btn-concluir"
                            onClick={() => atualizarSolicitacao(sol, 'CONCLUIDA')}
                            disabled={processando === sol.id}
                          >
                            Concluir
                          </button>
                          <button
                            className="btn-recusar"
                            onClick={() => atualizarSolicitacao(sol, 'RECUSADA')}
                            disabled={processando === sol.id}
                          >
                            Recusar
                          </button>
                        </>
                      )}
                      {sol.status === 'EM_ANALISE' && (
                        <>
                          <button
                            className="btn-concluir"
                            onClick={() => atualizarSolicitacao(sol, 'CONCLUIDA')}
                            disabled={processando === sol.id}
                          >
                            Concluir exclusão
                          </button>
                          <button
                            className="btn-recusar"
                            onClick={() => atualizarSolicitacao(sol, 'RECUSADA')}
                            disabled={processando === sol.id}
                          >
                            Recusar (reativar conta)
                          </button>
                        </>
                      )}
                      {(sol.status === 'CONCLUIDA' || sol.status === 'RECUSADA') && (
                        <span className="admin-cli-finalizado">
                          {sol.status === 'CONCLUIDA'
                            ? 'Exclusão concluída'
                            : 'Solicitação recusada — conta reativada'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {confirmacao && (
        <div
          className="admin-cli-modal-backdrop"
          onClick={() => !processando && setConfirmacao(null)}
        >
          <div className="admin-cli-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Desativar conta?</h3>
            <p>
              Você está desativando a conta de <strong>{confirmacao.nome}</strong>. O usuário
              perderá acesso imediatamente (soft delete — os dados permanecem no banco).
            </p>
            <div className="admin-cli-modal-actions">
              <button
                className="btn-outline"
                onClick={() => setConfirmacao(null)}
                disabled={!!processando}
              >
                Cancelar
              </button>
              <button
                className="btn-desativar"
                onClick={desativarCliente}
                disabled={!!processando}
              >
                {processando ? 'Processando...' : 'Sim, desativar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}