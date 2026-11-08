import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar } from '../components/calendar';
import { api } from '../api';
import '../css/agendarConsulta.css';

export function AgendarConsulta() {
  const location = useLocation();
  const navigate = useNavigate();
  const profissional = location.state?.profissional;

  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataSelecionada || !profissional) return;

    const fetchHorarios = async () => {
      setLoading(true);
      try {
        const dataFormatada = dataSelecionada.toISOString().split('T')[0];
        const res = await api(`/v1/profissionais/${profissional.id}/horarios-disponiveis`, {
          method: 'POST',
          body: { data: dataFormatada }
        });
        
        const horariosFormatados = res.map(isoString => {
          const hora = isoString.split('T')[1].substring(0, 5);
          return { iso: isoString, hora };
        });
        
        setHorariosDisponiveis(horariosFormatados);
        setHorarioSelecionado(null);
      } catch (err) {
        alert('Erro ao buscar horários: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHorarios();
  }, [dataSelecionada, profissional]);

  const handleConfirmar = async () => {
    if (!dataSelecionada || !horarioSelecionado) return alert('Selecione dia e horário.');
    
    try {
      await api('/v1/agendamentos', {
        method: 'POST',
        body: {
          profissionalId: profissional.id,
          dataHora: horarioSelecionado.iso,
          modalidade: 'VIRTUAL'
        }
      });
      alert('Consulta agendada com sucesso!');
      navigate('/agenda');
    } catch (err) {
      alert('Erro ao agendar: ' + err.message);
    }
  };

  if (!profissional) return <div>Profissional não encontrado.</div>;

  return (
    <div className="agendar-page">
      <aside className="agendar-sidebar glass-card">
        <div className="agendar-prof-top">
          <div className="avatar-text-grande" style={{ width: 80, height: 80, margin: '0 auto' }}>{profissional.nome.charAt(0)}</div>
          <h2>{profissional.nome}</h2>
          <span className="agendar-prof-area">{profissional.tipo}</span>
        </div>
        <div className="agendar-prof-detalhes">
          <h4>Especializações</h4>
          <div className="agendar-prof-tags">
            {profissional.tags?.map(e => <span key={e}>{e}</span>)}
          </div>
          <h4>Sobre</h4>
          <p>{profissional.bio || 'Sem biografia.'}</p>
        </div>
      </aside>

      <main className="agendar-main">
        <div className="agendar-header">
          <h1>Agendar Consulta</h1>
          <p>Escolha o melhor dia e horário para você.</p>
        </div>

        <div className="agendar-content">
          <div className="agendar-passo">
            <h3><span>1</span> Selecione o dia</h3>
            <Calendar dataSelecionada={dataSelecionada} onSelectData={setDataSelecionada} eventos={{}} />
          </div>

          <div className="agendar-passo">
            <h3><span className={!dataSelecionada ? 'inativo' : ''}>2</span> Selecione o horário</h3>
            <p className="subtitle">{dataSelecionada ? `Horários para ${dataSelecionada.toLocaleDateString()}` : 'Selecione um dia primeiro.'}</p>

            {loading ? (
              <p>Buscando horários...</p>
            ) : dataSelecionada ? (
              horariosDisponiveis.length > 0 ? (
                <div className="horarios-grid">
                  {horariosDisponiveis.map(h => (
                    <button key={h.hora} className={`btn-horario ${horarioSelecionado?.hora === h.hora ? 'active' : ''}`} onClick={() => setHorarioSelecionado(h)}>
                      {h.hora}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="aviso-vazio"><span className="material-symbols-outlined">event_busy</span><p>Não há horários disponíveis.</p></div>
              )
            ) : null}
          </div>

          <div className="agendar-confirmacao">
            <div className="resumo">
              {dataSelecionada && horarioSelecionado ? (
                <><span className="material-symbols-outlined text-success">check_circle</span>
                <p><strong>{dataSelecionada.toLocaleDateString('pt-BR')}</strong> às <strong>{horarioSelecionado.hora}</strong></p></>
              ) : <p>Selecione a data e o horário.</p>}
            </div>
            <button className="btn-confirmar" disabled={!dataSelecionada || !horarioSelecionado} onClick={handleConfirmar}>
              Confirmar Agendamento
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}