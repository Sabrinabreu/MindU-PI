import React, { useState } from 'react';
import '../css/gestao.css';

const MOCK_MATRICULAS = [
  { id: 1, codigo: 'A1B2C3', status: 'DISPONIVEL', data: '01/10/2026', usadoPor: null },
  { id: 2, codigo: 'D4E5F6', status: 'UTILIZADA', data: '02/10/2026', usadoPor: 'Maria Silva' },
  { id: 3, codigo: 'G7H8I9', status: 'DISPONIVEL', data: '05/10/2026', usadoPor: null },
];

export function Matriculas() {
  const [matriculas, setMatriculas] = useState(MOCK_MATRICULAS);
  const [copiado, setCopiado] = useState(null);

  const gerarMatriculas = () => {
    const quantidade = parseInt(prompt("Quantas matrículas deseja gerar?", "5"));
    if (!quantidade || quantidade <= 0) return;

    const novas = Array.from({ length: quantidade }).map((_, i) => {
      const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
      return {
        id: Date.now() + i,
        codigo,
        status: 'DISPONIVEL',
        data: new Date().toLocaleDateString('pt-BR'),
        usadoPor: null
      };
    });

    setMatriculas(prev => [...novas, ...prev]);
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
        <button className="btn-primary" onClick={gerarMatriculas}>
          <span className="material-symbols-outlined">add</span>
          Gerar Matrículas
        </button>
      </div>

      <div className="gestao-aviso glass-card">
        <span className="material-symbols-outlined">info</span>
        <p>Copie o código abaixo e envie para o colaborador. No momento do cadastro, ele deve inserir este código e selecionar a sua empresa.</p>
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
                <td>
                  <strong className="codigo-matricula">{mat.codigo}</strong>
                </td>
                <td>{mat.data}</td>
                <td>
                  <span className={`status-badge ${mat.status.toLowerCase()}`}>
                    {mat.status === 'DISPONIVEL' ? 'Disponível' : 'Utilizada'}
                  </span>
                  {mat.usadoPor && <small className="usado-por">por {mat.usadoPor}</small>}
                </td>
                <td>
                  {mat.status === 'DISPONIVEL' && (
                    <button 
                      className="btn-outline btn-copiar" 
                      onClick={() => copiarCodigo(mat.codigo)}
                    >
                      <span className="material-symbols-outlined">
                        {copiado === mat.codigo ? 'check' : 'content_copy'}
                      </span>
                      {copiado === mat.codigo ? 'Copiado!' : 'Copiar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}