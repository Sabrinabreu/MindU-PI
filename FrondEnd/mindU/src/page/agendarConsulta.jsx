import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar } from '../components/calendar';
import '../css/agendarConsulta.css';

const MOCK_PROFISSIONAL = {
  id: 'prof-1',
  nome: 'Dr. Roberto Rocha',
  tipo: 'Psicólogo',
  especialidades: ['Ansiedade', 'Burnout', 'TCC'],
  foto: 'https://i.pravatar.cc/200?img=11',
  bio: 'Psicólogo clínico com 10 anos de experiência. Especializado em ajudar profissionais a lidarem com estresse e esgotamento no trabalho.',
  linkMaps: 'https://maps.google.com',
  instrucoes: 'Chegar com 15 minutos de antecedência. Trazer documento com foto.'
};

const REGRAS_DISPONIBILIDADE = {
  diasTrabalho: [2, 4],
  horariosDisponiveis: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  horariosOcupados: {
    '2026-10-16': ['09:00', '14:00'],
  }
};

export function AgendarConsulta() {
  const location = useLocation();
  const navigate = useNavigate();
  const profissional = location.state?.profissional || MOCK_PROFISSIONAL;

  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [horariosDisponiveisDia, setHorariosDisponiveisDia] = useState([]);

  // Atualiza os horários
  useEffect(() => {
    if (!dataSelecionada) {
      setHorariosDisponiveisDia([]);
      return;
    }

    const dataChave = dataSelecionada.toISOString().split('T')[0];
    const ocupadosNoDia = REGRAS_DISPONIBILIDADE.horariosOcupados[dataChave] || [];

    const horariosLivres = REGRAS_DISPONIBILIDADE.horariosDisponiveis.filter(
      h => !ocupadosNoDia.includes(h)
    );

    setHorariosDisponiveisDia(horariosLivres);
    setHorarioSelecionado(null);
  }, [dataSelecionada]);

  const handleConfirmar = () => {
    if (!dataSelecionada || !horarioSelecionado) {
      alert('Por favor, selecione um dia e um horário.');
      return;
    }
    
    alert(`Consulta agendada com sucesso!\nData: ${dataSelecionada.toLocaleDateString()}\nHorário: ${horarioSelecionado}`);
    navigate('/agenda');
  };

  return (
    <div className="agendar-page">
      
      {/* === COLUNA ESQUERDA (INFO PROFISSIONAL) === */}
      <aside className="agendar-sidebar glass-card">
        <div className="agendar-prof-top">
          <img src={profissional.foto} alt={profissional.nome} className="agendar-prof-foto" />
          <h2>{profissional.nome}</h2>
          <span className="agendar-prof-area">{profissional.tipo}</span>
        </div>

        <div className="agendar-prof-detalhes">
          <h4>Especializações</h4>
          <div className="agendar-prof-tags">
            {profissional.especialidades.map(e => <span key={e}>{e}</span>)}
          </div>
          
          <h4>Sobre</h4>
          <p>{profissional.bio}</p>

          <h4>Localização</h4>
          <a href={profissional.linkMaps} target="_blank" rel="noreferrer" className="btn-maps">
            <span className="material-symbols-outlined">map</span> Ver no Maps
          </a>
        </div>
      </aside>

      {/* === COLUNA DIREITA (FLUXO DE AGENDAMENTO) === */}
      <main className="agendar-main">
        
        <div className="agendar-header">
          <h1>Agendar Consulta</h1>
          <p>Escolha o melhor dia e horário para você.</p>
        </div>

        <div className="agendar-content">
          {/* Calendário */}
          <div className="agendar-passo">
            <h3><span>1</span> Selecione o dia</h3>
            <p className="subtitle">
              Dias em cinza estão indisponíveis.
            </p>
            <Calendar 
              dataSelecionada={dataSelecionada} 
              onSelectData={setDataSelecionada} 
              eventos={{}} 
              diasBloqueados={[0, 1, 3, 5, 6]}
            />
          </div>

          {/* Horários */}
          <div className="agendar-passo">
            <h3><span className={!dataSelecionada ? 'inativo' : ''}>2</span> Selecione o horário</h3>
            <p className="subtitle">
              {dataSelecionada 
                ? `Horários disponíveis para ${dataSelecionada.toLocaleDateString()}` 
                : 'Selecione um dia primeiro.'}
            </p>

            {dataSelecionada ? (
              horariosDisponiveisDia.length > 0 ? (
                <div className="horarios-grid">
                  {horariosDisponiveisDia.map(hora => (
                    <button
                      key={hora}
                      className={`btn-horario ${horarioSelecionado === hora ? 'active' : ''}`}
                      onClick={() => setHorarioSelecionado(hora)}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="aviso-vazio">
                  <span className="material-symbols-outlined">event_busy</span>
                  <p>Não há horários disponíveis para este dia.</p>
                </div>
              )
            ) : (
              <div className="aviso-vazio">
                <p>Aguardando seleção do dia...</p>
              </div>
            )}
          </div>

          {/* Confirmação */}
          <div className="agendar-confirmacao">
            <div className="resumo">
              {dataSelecionada && horarioSelecionado ? (
                <>
                  <span className="material-symbols-outlined text-success">check_circle</span>
                  <p>
                    <strong>{dataSelecionada.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong> 
                    às <strong>{horarioSelecionado}</strong>
                  </p>
                </>
              ) : (
                <p>Selecione a data e o horário para continuar.</p>
              )}
            </div>
            
            <button 
              className="btn-confirmar" 
              disabled={!dataSelecionada || !horarioSelecionado}
              onClick={handleConfirmar}
            >
              Confirmar Agendamento
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}