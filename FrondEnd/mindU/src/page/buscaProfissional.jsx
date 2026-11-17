import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfissionalCard } from '../components/ProfissionalCard';
import { api, getFotoUrl } from '../api';
import '../css/buscaProfissional.css';

const FILTROS_TIPO = ['PSICOLOGO', 'PSIQUIATRA', 'TERAPEUTA'];
const FILTROS_ESPECIALIDADE = ['Ansiedade', 'Depressao', 'Burnout', 'Relacionamentos', 'TCC', 'TDAH'];

export function BuscaProfissional() {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buscaNome, setBuscaNome] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroModalidade, setFiltroModalidade] = useState('TODOS');
  const [filtroEspecialidade, setFiltroEspecialidade] = useState('');

  useEffect(() => {
    const fetchProfissionais = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (buscaNome) params.set('nome', buscaNome);
        if (filtroModalidade !== 'TODOS') params.set('modalidade', filtroModalidade);
        if (filtroEspecialidade) params.set('especialidade', filtroEspecialidade);

        const res = await api(`/v1/profissionais?${params.toString()}`);

        let filtrados = res;
        if (filtroTipo) filtrados = filtrados.filter((p) => p.tipo === filtroTipo);

        setProfissionais(filtrados);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProfissionais, 500);
    return () => clearTimeout(timer);
  }, [buscaNome, filtroTipo, filtroModalidade, filtroEspecialidade]);

  const toggleEspecialidade = (esp) => {
    setFiltroEspecialidade((prev) => (prev === esp ? '' : esp));
  };

  const limparFiltros = () => {
    setBuscaNome('');
    setFiltroTipo('');
    setFiltroModalidade('TODOS');
    setFiltroEspecialidade('');
  };

  const handleAgendar = (profissional) => {
    navigate('/agendar', { state: { profissional } });
  };

  return (
    <div className="buscar-page">
      <div className="buscar-filtros glass-card">
        <div className="filtros-linha">
          <div className="filtro-item">
            <label>Buscar por nome</label>
            <div className="input-icon">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Ex: Roberto..."
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
              />
            </div>
          </div>
          <div className="filtro-item">
            <label>Tipo de profissional</label>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="">Todos</option>
              {FILTROS_TIPO.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
          <div className="filtro-item">
            <label>Modalidade</label>
            <select value={filtroModalidade} onChange={(e) => setFiltroModalidade(e.target.value)}>
              <option value="TODOS">Todas</option>
              <option value="VIRTUAL">Online</option>
              <option value="PRESENCIAL">Presencial</option>
              <option value="HIBRIDO">Híbrido</option>
            </select>
          </div>
        </div>

        <div className="filtros-linha especialidades-box">
          <div className="filtro-item full">
            <label>Especialidade</label>
            <div className="chips-container">
              {FILTROS_ESPECIALIDADE.map((esp) => (
                <button
                  key={esp}
                  type="button"
                  className={`filtro-chip ${filtroEspecialidade === esp ? 'active' : ''}`}
                  onClick={() => toggleEspecialidade(esp)}
                >
                  {esp}
                  {filtroEspecialidade === esp && (
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', marginLeft: '4px' }}>
                      close
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="buscar-header">
        <h2>Profissionais disponíveis</h2>
        <span>{loading ? 'Buscando...' : `${profissionais.length} encontrados`}</span>
      </div>

      <div className="buscar-grid">
        {!loading && profissionais.length === 0 ? (
          <div className="buscar-vazio">
            <span className="material-symbols-outlined">search_off</span>
            <p>Nenhum profissional encontrado com esses filtros.</p>
            <button onClick={limparFiltros}>Limpar filtros</button>
          </div>
        ) : (
          profissionais.map((prof) => (
            <ProfissionalCard
              key={prof.id}
              profissional={{
                ...prof,
                especialidades: prof.tags || [],
                foto: getFotoUrl(prof.id),
              }}
              onAgendar={handleAgendar}
            />
          ))
        )}
      </div>
    </div>
  );
}