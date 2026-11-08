import React, { useState } from 'react';
import { api } from '../api';
import '../css/gestao.css';

export function Matriculas() {
  const [matriculas, setMatriculas] = useState([]);
  const [copiado, setCopiado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantidade, setQuantidade] = useState(5);

  const abrirModal = () => {
    setQuantidade(5);
    setIsModalOpen(true);
  };

  const fecharModal = () => setIsModalOpen(false);

  const confirmarGeracao = async (e) => {
    e.preventDefault();
    const qtd = parseInt(quantidade);
    
    if (!qtd || qtd <= 0) {
      return alert('Por favor, insira um número válido maior que zero.');
    }

    setLoading(true);
    try {
      const res = await api(`/v1/empresas/me/matriculas?quantidade=${qtd}`, { method: 'POST' });
      const novas = res.map(m => ({ ...m, data: new Date().toLocaleDateString('pt-BR') }));
      setMatriculas(prev => [...novas, ...prev]);
      
      fecharModal();
    } catch (err) {
      alert('Erro ao gerar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2000);
  };

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
        <p>Copie o código abaixo e envie para o colaborador. No momento do cadastro, ele deve inserir este código.</p>
      </div>

      <div className="gestao-tabela-container glass-card">
        <table className="gestao-tabela">
          <thead>
            <tr>
              <th>Código</th>
              <th>Gerada em</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {matriculas.map(mat => (
              <tr key={mat.id}>
                <td><strong className="codigo-matricula">{mat.codigo}</strong></td>
                <td>{mat.data}</td>
                <td>
                  <span className={`status-badge ${mat.utilizada ? 'utilizada' : 'disponivel'}`}>
                    {mat.utilizada ? 'Utilizada' : 'Disponível'}
                  </span>
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
        {matriculas.length === 0 && <p className="tabela-vazia">Nenhuma matrícula gerada nesta sessão.</p>}
      </div>

      {/* MODAL DE GERAR MATRÍCULAS */}
      {isModalOpen && (
        <div className="gestao-modal-overlay" onClick={fecharModal}>
          <div className="gestao-modal glass-card" onClick={e => e.stopPropagation()}>
            <span className="material-symbols-outlined fechar-modal" onClick={fecharModal}>close</span>
            
            <h2>Gerar Matrículas</h2>
            <p style={{ color: 'var(--text-s)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Quantos convites você deseja gerar agora? (Lembre-se de verificar as vagas restantes no seu plano).
            </p>

            <form onSubmit={confirmarGeracao}>
              <div className="form-field full" style={{ marginBottom: '1.5rem' }}>
                <label>Quantidade</label>
                <input
                  type="number"
                  className="glass-input"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  min="1"
                  max="50"
                  required
                  autoFocus
                />
              </div>

              <div className="gestao-modal-actions">
                <button type="button" className="btn-outline" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Gerando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}