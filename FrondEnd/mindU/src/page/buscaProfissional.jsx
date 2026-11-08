import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfissionalCard } from '../components/ProfissionalCard';
import { api } from '../api';
import '../css/buscaProfissional.css';

const FILTROS_TIPO = ['PSICOLOGO', 'PSIQUIATRA', 'TERAPEUTA'];
const FILTROS_ESPECIALIDADE = ['ansiedade', 'depressao', 'burnout', 'relacionamentos', 'TCC', 'TDAH'];

export function BuscaProfissional() {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buscaNome, setBuscaNome] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroModalidade, setFiltroModalidade] = useState('TODOS');
  const [filtroEspecialidades, setFiltroEspecialidades] = useState([]);

  useEffect(() => {
    const fetchProfissionais = async () => {
      setLoading(true);
      try {
        let url = '/v1/profissionais?';
        if (buscaNome) url += `nome=${encodeURIComponent(buscaNome)}&`;
        if (filtroModalidade !== 'TODOS') url += `modalidade=${filtroModalidade}&`;
        if (filtroEspecialidades.length > 0) url += `especialidade=${filtroEspecialidades[0]}&`;

        const res = await api(url);
        
        // Filtro local para o "Tipo" (back não tem esse parâmetro na busca)
        let filtrados = res;
        if (filtroTipo) filtrados = filtrados.filter(p => p.tipo === filtroTipo);
        
        setProfissionais(filtrados);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(fetchProfissionais, 500);
    return () => clearTimeout(timer);
  }, [buscaNome, filtroTipo, filtroModalidade, filtroEspecialidades]);

  const toggleEspecialidade = (esp) => {
    setFiltroEspecialidades(prev => prev.includes(esp) ? prev.filter(e => e !== esp) : [...prev, esp]);
  };

  const limparFiltros = () => {
    setBuscaNome(''); setFiltroTipo(''); setFiltroModalidade('TODOS'); setFiltroEspecialidades([]);
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
              <input type="text" placeholder="Ex: Roberto..." value={buscaNome} onChange={(e) => setBuscaNome(e.target.value)} />
            </div>
          </div>
          <div className="filtro-item">
            <label>Tipo de profissional</label>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="">Todos</option>
              {FILTROS_TIPO.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
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
            <label>Especialidades</label>
            <div className="chips-container">
              {FILTROS_ESPECIALIDADE.map(esp => (
                <button key={esp} type="button" className={`filtro-chip ${filtroEspecialidades.includes(esp) ? 'active' : ''}`} onClick={() => toggleEspecialidade(esp)}>
                  {esp} {filtroEspecialidades.includes(esp) && <span className="material-symbols-outlined" style={{ fontSize: '16px', marginLeft: '4px' }}>close</span>}
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
          profissionais.map(prof => (
            <ProfissionalCard key={prof.id} profissional={{
              ...prof,
              especialidades: prof.tags || [],
              modalidade: prof.tipo === 'PSICOLOGO' ? 'AMBOS' : 'ONLINE', // Fallback visual
              foto: null
            }} onAgendar={handleAgendar} />
          ))
        )}
      </div>
    </div>
  );
}