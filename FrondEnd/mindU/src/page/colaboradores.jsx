import React, { useState } from 'react';
import { getIniciais } from '../api';
import '../css/gestao.css';

const MOCK_COLABORADORES = [
  { id: 1, nome: 'Maria Silva', email: 'maria.silva@technova.com', data: '10/10/2026', status: 'ATIVO', foto: 'https://i.pravatar.cc/150?img=45' },
  { id: 2, nome: 'João Paulo', email: 'joao.paulo@technova.com', data: '12/10/2026', status: 'ATIVO', foto: null },
  { id: 3, nome: 'Ana Clara', email: 'ana.clara@technova.com', data: '25/10/2026', status: 'PENDENTE', foto: null },
];

export function Colaboradores() {
  const [colaboradores, setColaboradores] = useState(MOCK_COLABORADORES);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('TODOS');

  const handleAprovar = (id) => {
    setColaboradores(prev => prev.map(c => c.id === id ? { ...c, status: 'ATIVO' } : c));
  };

  const handleRecusar = (id) => {
    setColaboradores(prev => prev.map(c => c.id === id ? { ...c, status: 'RECUSADO' } : c));
  };

  const colaboradoresFiltrados = colaboradores.filter(c => {
    const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase()) || c.email.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === 'TODOS' || c.status === filtro;
    return matchBusca && matchFiltro;
  });

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
            <h3>{colaboradores.filter(c => c.status === 'ATIVO').length}</h3>
            <p>Ativos</p>
          </div>
        </div>
        <div className="resumo-card glass-card">
          <span className="material-symbols-outlined icone amarelo">pending_actions</span>
          <div>
            <h3>{colaboradores.filter(c => c.status === 'PENDENTE').length}</h3>
            <p>Aguardando Aprovação</p>
          </div>
        </div>
      </div>

      <div className="gestao-filtros glass-card">
        <div className="input-icon">
          <span className="material-symbols-outlined">search</span>
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..." 
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <select value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value="TODOS">Todos os status</option>
          <option value="ATIVO">Ativos</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="RECUSADO">Recusados</option>
        </select>
      </div>

      <div className="gestao-tabela-container glass-card">
        <table className="gestao-tabela">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Data de Cadastro</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {colaboradoresFiltrados.map(colab => (
              <tr key={colab.id}>
                <td>
                  <div className="tabela-user">
                    {colab.foto ? (
                      <img src={colab.foto} alt={colab.nome} />
                    ) : (
                      <div className="avatar-iniciais">{getIniciais(colab.nome)}</div>
                    )}
                    <div>
                      <strong>{colab.nome}</strong>
                      <span>{colab.email}</span>
                    </div>
                  </div>
                </td>
                <td>{colab.data}</td>
                <td>
                  <span className={`status-badge ${colab.status.toLowerCase()}`}>
                    {colab.status}
                  </span>
                </td>
                <td>
                  {colab.status === 'PENDENTE' && (
                    <div className="acoes-aprovacao">
                      <button className="btn-icone check" onClick={() => handleAprovar(colab.id)} title="Aprovar">
                        <span className="material-symbols-outlined">check</span>
                      </button>
                      <button className="btn-icone x" onClick={() => handleRecusar(colab.id)} title="Recusar">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {colaboradoresFiltrados.length === 0 && (
          <p className="tabela-vazia">Nenhum colaborador encontrado.</p>
        )}
      </div>
    </div>
  );
}