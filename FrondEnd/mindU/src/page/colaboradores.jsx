import React, { useState, useEffect } from 'react';
import { api, getIniciais } from '../api';
import '../css/gestao.css';

export function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('TODOS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarColaboradores();
  }, []);

  const carregarColaboradores = async () => {
    try {
      const res = await api('/v1/clientes');
      setColaboradores(res);
    } catch (err) {
      alert('Erro ao carregar colaboradores: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id, aprovado) => {
    try {
      await api(`/v1/clientes/${id}/aprovacao?aprovado=${aprovado}`, { method: 'PATCH' });
      setColaboradores(prev => prev.map(c => 
        c.id === id ? { ...c, status: aprovado ? 'APROVADO' : 'REJEITADO' } : c
      ));
    } catch (err) {
      alert('Erro ao processar: ' + err.message);
    }
  };

  const colaboradoresFiltrados = colaboradores.filter(c => {
    const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase()) || c.email.toLowerCase().includes(busca.toLowerCase());
    let statusVisual = c.status;
    if (statusVisual === 'AGUARDANDO_APROVACAO') statusVisual = 'PENDENTE';
    
    const matchFiltro = filtro === 'TODOS' || statusVisual === filtro;
    return matchBusca && matchFiltro;
  });

  if (loading) return <div className="loading"><span className="material-symbols-outlined girando">progress_activity</span><p>Carregando…</p></div>;

  return (
    <div className="gestao-page">
      <div className="gestao-header">
        <div>
          <h1>Colaboradores</h1>
          <p>Gerencie os funcionários vinculados ao seu plano.</p>
        </div>
      </div>

      <div className="gestao-cards-resumo">
        <div className="resumo-card glass-card">
          <span className="material-symbols-outlined icone azul">group</span>
          <div>
            <h3>{colaboradores.filter(c => c.status === 'APROVADO').length}</h3>
            <p>Ativos</p>
          </div>
        </div>
        <div className="resumo-card glass-card">
          <span className="material-symbols-outlined icone amarelo">pending_actions</span>
          <div>
            <h3>{colaboradores.filter(c => c.status === 'AGUARDANDO_APROVACAO').length}</h3>
            <p>Aguardando Aprovação</p>
          </div>
        </div>
      </div>

      <div className="gestao-filtros glass-card">
        <div className="input-icon">
          <span className="material-symbols-outlined">search</span>
          <input type="text" placeholder="Buscar por nome ou e-mail..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <select value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value="TODOS">Todos os status</option>
          <option value="APROVADO">Ativos</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="REJEITADO">Recusados</option>
        </select>
      </div>

      <div className="gestao-tabela-container glass-card">
        <table className="gestao-tabela">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {colaboradoresFiltrados.map(colab => {
              const isPendente = colab.status === 'AGUARDANDO_APROVACAO';
              const isRejeitado = colab.status === 'REJEITADO';

              return (
                <tr key={colab.id}>
                  <td>
                    <div className="tabela-user">
                      <div className="avatar-iniciais">{getIniciais(colab.nome)}</div>
                      <div>
                        <strong>{colab.nome}</strong>
                        <span>{colab.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${isPendente ? 'pendente' : colab.status.toLowerCase()}`}>
                      {isPendente ? 'Pendente' : colab.status}
                    </span>
                  </td>
                  <td>
                    {/* BOTOES DE AÇÃO */}
                    {isPendente && (
                      <div className="acoes-aprovacao">
                        <button className="btn-icone check" onClick={() => handleAprovar(colab.id, true)} title="Aprovar"><span className="material-symbols-outlined">check</span></button>
                        <button className="btn-icone x" onClick={() => handleAprovar(colab.id, false)} title="Recusar"><span className="material-symbols-outlined">close</span></button>
                      </div>
                    )}

                    {/* Se foi recusado, dá a opção de reconsiderar */}
                    {isRejeitado && (
                      <button 
                        className="btn-outline" 
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} 
                        onClick={() => handleAprovar(colab.id, true)}
                      >
                        Reconsiderar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {colaboradoresFiltrados.length === 0 && <p className="tabela-vazia">Nenhum colaborador encontrado.</p>}
      </div>
    </div>
  );
}