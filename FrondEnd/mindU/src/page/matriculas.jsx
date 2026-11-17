import React, { useState, useEffect } from 'react';
import { api } from '../api';
import '../css/gestao.css';

export function Matriculas() {
  const [matriculas, setMatriculas] = useState([]);
  const [copiado, setCopiado] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados dos Filtros
  const [buscaCodigo, setBuscaCodigo] = useState('');
  const [buscaNome, setBuscaNome] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantidade, setQuantidade] = useState(5);
  const [gerando, setGerando] = useState(false);

  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        const res = await api('/v1/empresas/me/matriculas');
        setMatriculas(res);
      } catch (err) {
        console.error('Erro ao carregar matrículas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatriculas();
  }, []);

  const abrirModal = () => {
    setQuantidade(5);
    setIsModalOpen(true);
  };

  const fecharModal = () => setIsModalOpen(false);

  const confirmarGeracao = async (e) => {
    e.preventDefault();
    const qtd = parseInt(quantidade);
    if (!qtd || qtd <= 0) return alert('Insira um número válido.');

    setGerando(true);
    try {
      const res = await api(`/v1/empresas/me/matriculas?quantidade=${qtd}`, { method: 'POST' });
      setMatriculas(prev => [...res, ...prev]);
      fecharModal();
    } catch (err) {
      alert('Erro ao gerar: ' + err.message);
    } finally {
      setGerando(false);
    }
  };

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2000);
  };

  // Lógica de Filtragem
  const matriculasFiltradas = matriculas.filter(mat => {
    const matchCodigo = mat.codigo.toLowerCase().includes(buscaCodigo.toLowerCase());
    const matchNome = (mat.clienteNome || '').toLowerCase().includes(buscaNome.toLowerCase());
    
    let matchStatus = true;
    if (filtroStatus === 'DISPONIVEL') matchStatus = !mat.utilizada;
    if (filtroStatus === 'UTILIZADA') matchStatus = mat.utilizada;

    return matchCodigo && matchNome && matchStatus;
  });

  if (loading) return <div className="loading"><span className="material-symbols-outlined girando">progress_activity</span><p>Carregando…</p></div>;

  return (
    <div className="gestao-page">
      <div className="gestao-header">
        <div>
          <h1>Matrículas</h1>
          <p>Gere códigos de acesso para convidar seus colaboradores!</p>
        </div>
        <button className="btn-primary" onClick={abrirModal}>
          <span className="material-symbols-outlined">add</span>
          Gerar Matrículas
        </button>
      </div>

      <div className="gestao-aviso glass-card">
        <span className="material-symbols-outlined">info</span>
        <p>Copie o código abaixo e envie para o colaborador.</p>
      </div>

      {/* FILTROS */}
      <div className="gestao-filtros glass-card">
        <div className="input-icon">
          <span className="material-symbols-outlined">search</span>
          <input 
            type="text" 
            placeholder="Buscar por código..." 
            value={buscaCodigo} 
            onChange={e => setBuscaCodigo(e.target.value)} 
          />
        </div>
        <div className="input-icon">
          <span className="material-symbols-outlined">person</span>
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            value={buscaNome} 
            onChange={e => setBuscaNome(e.target.value)} 
          />
        </div>
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
          <option value="TODOS">Todos os status</option>
          <option value="DISPONIVEL">Disponíveis</option>
          <option value="UTILIZADA">Utilizadas</option>
        </select>
      </div>

      <div className="gestao-tabela-container glass-card">
        <table className="gestao-tabela">
          <thead>
            <tr>
              <th>Código</th>
              <th>Status</th>
              <th>Utilizada por</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {matriculasFiltradas.map(mat => (
              <tr key={mat.id}>
                <td><strong className="codigo-matricula">{mat.codigo}</strong></td>
                <td>
                  <span className={`status-badge ${mat.utilizada ? 'utilizada' : 'disponivel'}`}>
                    {mat.utilizada ? 'Utilizada' : 'Disponível'}
                  </span>
                </td>
                <td>
                  {mat.utilizada ? (mat.clienteNome || 'Carregando...') : '-'}
                </td>
                <td>
                  {!mat.utilizada && (
                    <button className="btn-outline btn-copiar" onClick={() => copiarCodigo(mat.codigo)}>
                      <span className="material-symbols-outlined">{copiado === mat.codigo ? 'check' : 'content_copy'}</span>
                      {copiado === mat.codigo ? 'Copiado!' : 'Copiar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {matriculasFiltradas.length === 0 && <p className="tabela-vazia">Nenhuma matrícula encontrada com esses filtros.</p>}
      </div>

      {/* Modal de Gerar Matrícula */}
      {isModalOpen && (
        <div className="gestao-modal-overlay" onClick={fecharModal}>
          <div className="gestao-modal glass-card" onClick={e => e.stopPropagation()}>
            <span className="material-symbols-outlined fechar-modal" onClick={fecharModal}>close</span>
            <h2>Gerar Matrículas</h2>
            <p style={{ color: 'var(--text-s)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Quantos convites deseja gerar agora?</p>
            <form onSubmit={confirmarGeracao}>
              <div className="form-field full" style={{ marginBottom: '1.5rem' }}>
                <label>Quantidade</label>
                <input type="number" className="glass-input" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} min="1" max="50" required autoFocus />
              </div>
              <div className="gestao-modal-actions">
                <button type="button" className="btn-outline" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={gerando}>{gerando ? 'Gerando...' : 'Confirmar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}