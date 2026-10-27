import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfissionalCard } from '../components/ProfissionalCard';
import '../css/buscaProfissional.css';

const MOCK_PROFISSIONAIS = [
  {
    id: 'prof-1',
    nome: 'Dr. Roberto Rocha',
    tipo: 'Psicólogo',
    genero: 'MASCULINO',
    especialidades: ['Ansiedade', 'Burnout', 'TCC'],
    modalidade: 'AMBOS',
    bio: 'Psicólogo clínico com 10 anos de experiência. Especializado em ajudar profissionais a lidarem com estresse e esgotamento no trabalho.',
    foto: 'https://i.pravatar.cc/200?img=11',
  },
  {
    id: 'prof-2',
    nome: 'Dra. Camila Ribeiro',
    tipo: 'Psiquiatra',
    genero: 'FEMININO',
    especialidades: ['Depressão', 'TDAH', 'Adultos'],
    modalidade: 'ONLINE',
    bio: 'Médica psiquiatra focada no tratamento humanizado. Acredito que a saúde mental vai além da medicação, envolvendo o contexto de vida do paciente.',
    foto: 'https://i.pravatar.cc/200?img=5',
  },
  {
    id: 'prof-3',
    nome: 'Dr. Lucas Mendes',
    tipo: 'Terapeuta',
    genero: 'MASCULINO',
    especialidades: ['Relacionamentos', 'Casais', 'Ansiedade'],
    modalidade: 'PRESENCIAL',
    bio: 'Terapeuta de casais com foco em comunicação não-violenta e resolução de conflitos. Atendimento exclusivo em consultório.',
    foto: 'https://i.pravatar.cc/200?img=59',
  }
];

const FILTROS_TIPO = ['Psicólogo', 'Psiquiatra', 'Terapeuta'];
const FILTROS_ESPECIALIDADE = ['Ansiedade', 'Depressão', 'Burnout', 'Relacionamentos', 'TCC', 'TDAH'];

export function BuscaProfissional() {
  const navigate = useNavigate();
  const [buscaNome, setBuscaNome] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('TODOS');
  const [filtroModalidade, setFiltroModalidade] = useState('TODOS');
  const [filtroEspecialidades, setFiltroEspecialidades] = useState([]);

  // Função para marcar/desmarcar especialidade
  const toggleEspecialidade = (esp) => {
    setFiltroEspecialidades(prev => 
      prev.includes(esp) 
        ? prev.filter(e => e !== esp) // Se já tem, remove
        : [...prev, esp]              // Se não tem, adiciona
    );
  };

  const limparFiltros = () => {
    setBuscaNome('');
    setFiltroTipo('');
    setFiltroGenero('TODOS');
    setFiltroModalidade('TODOS');
    setFiltroEspecialidades([]);
  };

  const profissionaisFiltrados = MOCK_PROFISSIONAIS.filter((prof) => {
    // 1. Nome
    const matchNome = prof.nome.toLowerCase().includes(buscaNome.toLowerCase());
    
    // 2. Tipo
    const matchTipo = filtroTipo === '' || prof.tipo === filtroTipo;

    // 3. Gênero
    const matchGenero = filtroGenero === 'TODOS' || prof.genero === filtroGenero;

    // 4. Modalidade
    let matchModalidade = true;
    if (filtroModalidade !== 'TODOS') {
      matchModalidade = prof.modalidade === filtroModalidade || prof.modalidade === 'AMBOS';
    }

    // O profissional precisa ter TODAS as especialidades que o usuário marcou
    const matchEspecialidades = filtroEspecialidades.length === 0 
      ? true 
      : filtroEspecialidades.every(esp => prof.especialidades.includes(esp));

    return matchNome && matchTipo && matchGenero && matchModalidade && matchEspecialidades;
  });

  const handleAgendar = (profissional) => {
    navigate('/agendar', { state: { profissional } });
  };

  return (
    <div className="buscar-page">
      
      {/* === BARRA DE FILTROS === */}
      <div className="buscar-filtros glass-card">
        
        {/* Filtros Básicos */}
        <div className="filtros-linha">
          <div className="filtro-item">
            <label>Buscar por nome</label>
            <div className="input-icon">
              <span className="material-symbols-outlined">search</span>
              <input 
                type="text" 
                placeholder="Ex: Dr. Roberto..." 
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
              />
            </div>
          </div>

          <div className="filtro-item">
            <label>Tipo de profissional</label>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="">Todos</option>
              {FILTROS_TIPO.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="filtro-item">
            <label>Gênero</label>
            <select value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)}>
              <option value="TODOS">Indiferente</option>
              <option value="FEMININO">Feminino</option>
              <option value="MASCULINO">Masculino</option>
            </select>
          </div>

          <div className="filtro-item">
            <label>Modalidade</label>
            <select value={filtroModalidade} onChange={(e) => setFiltroModalidade(e.target.value)}>
              <option value="TODOS">Todas</option>
              <option value="ONLINE">Online</option>
              <option value="PRESENCIAL">Presencial</option>
            </select>
          </div>
        </div>

        {/* Filtros Especialidades */}
        <div className="filtros-linha especialidades-box">
          <div className="filtro-item full">
            <label>Especialidades</label>
            <div className="chips-container">
              {FILTROS_ESPECIALIDADE.map(esp => (
                <button
                  key={esp}
                  type="button"
                  className={`filtro-chip ${filtroEspecialidades.includes(esp) ? 'active' : ''}`}
                  onClick={() => toggleEspecialidade(esp)}
                >
                  {esp}
                  {filtroEspecialidades.includes(esp) && (
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', marginLeft: '4px' }}>close</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(buscaNome || filtroTipo || filtroGenero !== 'TODOS' || filtroModalidade !== 'TODOS' || filtroEspecialidades.length > 0) && (
          <button className="btn-limpar-filtros" onClick={limparFiltros}>
            Limpar Filtros
          </button>
        )}
      </div>

      {/* === RESULTADOS === */}
      <div className="buscar-header">
        <h2>Profissionais disponíveis</h2>
        <span>{profissionaisFiltrados.length} encontrados</span>
      </div>

      <div className="buscar-grid">
        {profissionaisFiltrados.length === 0 ? (
          <div className="buscar-vazio">
            <span className="material-symbols-outlined">search_off</span>
            <p>Nenhum profissional encontrado com esses filtros.</p>
            <button onClick={limparFiltros}>Limpar filtros</button>
          </div>
        ) : (
          profissionaisFiltrados.map(prof => (
            <ProfissionalCard key={prof.id} profissional={prof} onAgendar={handleAgendar} />
          ))
        )}
      </div>
    </div>
  );
}