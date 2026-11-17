import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar } from '../components/calendar';
import { api, getFotoUrl, getIniciais } from '../api';
import '../css/agendarConsulta.css';

const formatarDataLocal = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const DIAS_JS_PARA_NOME = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];

export function AgendarConsulta() {
  const location = useLocation();
  const navigate = useNavigate();
  const profissional = location.state?.profissional;

  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const [detalhes, setDetalhes] = useState(null);
  const [modalidadesDisponiveis, setModalidadesDisponiveis] = useState([]);
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState(null);
  const [diasBloqueados, setDiasBloqueados] = useState([]);
  const [fotoErro, setFotoErro] = useState(false);

  useEffect(() => {
    if (!profissional) return;
    api(`/v1/profissionais/${profissional.id}`)
      .then((d) => {
        setDetalhes(d);
        const mods = [...new Set((d.locais || []).map((l) => l.modalidade))];
        setModalidadesDisponiveis(mods);
        setModalidadeSelecionada(mods[0] || null);

        const diasAtende = [...new Set((d.disponibilidadeSemanal || []).map((x) => x.diaSemana))];
        const bloqueados = [0, 1, 2, 3, 4, 5, 6].filter(
          (dia) => !diasAtende.includes(DIAS_JS_PARA_NOME[dia])
        );
        setDiasBloqueados(bloqueados);
      })
      .catch((err) => {
        console.error('Erro ao buscar detalhes:', err);
        setModalidadesDisponiveis(['VIRTUAL']);
        setModalidadeSelecionada('VIRTUAL');
        setDiasBloqueados([]);
      });
  }, [profissional]);

  useEffect(() => {
    if (!dataSelecionada || !profissional) return;

    const fetchHorarios = async () => {
      setLoading(true);
      try {
        const dataFormatada = formatarDataLocal(dataSelecionada);
        const res = await api(`/v1/profissionais/${profissional.id}/horarios-disponiveis`, {
          method: 'POST',
          body: { data: dataFormatada },
        });

        const horariosFormatados = res.map((iso) => {
          const hora = iso.split('T')[1].substring(0, 5);
          return { iso, hora };
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
    if (!dataSelecionada || !horarioSelecionado || !modalidadeSelecionada) {
      return alert('Selecione modalidade, dia e horário.');
    }
    if (confirmando) return;

    setConfirmando(true);
    try {
      await api('/v1/agendamentos', {
        method: 'POST',
        body: {
          profissionalId: profissional.id,
          dataHora: horarioSelecionado.iso,
          modalidade: modalidadeSelecionada,
        },
      });
      alert('Consulta agendada com sucesso!');
      navigate('/agenda');
    } catch (err) {
      alert('Erro ao agendar: ' + err.message);
    } finally {
      setConfirmando(false);
    }
  };

  if (!profissional) return <div>Profissional não encontrado.</div>;

  return (
    <div className="agendar-page">
      <aside className="agendar-sidebar glass-card">
        <div className="agendar-prof-top">
          <div style={{ width: 80, height: 80, margin: '0 auto 0.5rem' }}>
            {!fotoErro ? (
              <img
                src={getFotoUrl(profissional.id)}
                alt={profissional.nome}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--accent)',
                }}
                onError={() => setFotoErro(true)}
              />
            ) : (
              <div className="avatar-text-grande" style={{ width: 80, height: 80 }}>
                {getIniciais(profissional.nome)}
              </div>
            )}
          </div>
          <h2>{profissional.nome}</h2>
          <span className="agendar-prof-area">{profissional.tipo}</span>
        </div>
        <div className="agendar-prof-detalhes">
          <h4>Especializações</h4>
          <div className="agendar-prof-tags">
            {(detalhes?.tags || profissional.tags || []).map((e) => (
              <span key={e}>{e}</span>
            ))}
          </div>
          <h4>Sobre</h4>
          <p>{detalhes?.bio || profissional.bio || 'Sem biografia.'}</p>
        </div>
      </aside>

      <main className="agendar-main">
        <div className="agendar-header">
          <h1>Agendar Consulta</h1>
          <p>Escolha o melhor dia e horário para você.</p>
        </div>

        <div className="agendar-content">
          <div className="agendar-passo">
            <h3><span>1</span> Selecione a modalidade</h3>
            <p className="subtitle">Como você prefere ser atendido?</p>
            {modalidadesDisponiveis.length === 0 ? (
              <p>Carregando modalidades...</p>
            ) : (
              <div className="horarios-grid">
                {modalidadesDisponiveis.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`btn-horario ${modalidadeSelecionada === m ? 'active' : ''}`}
                    onClick={() => setModalidadeSelecionada(m)}
                  >
                    {m === 'VIRTUAL' ? 'Online' : m === 'PRESENCIAL' ? 'Presencial' : m}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="agendar-passo">
            <h3><span>2</span> Selecione o dia</h3>
            <Calendar
              dataSelecionada={dataSelecionada}
              onSelectData={setDataSelecionada}
              eventos={{}}
              diasBloqueados={diasBloqueados}
            />
          </div>

          <div className="agendar-passo">
            <h3><span className={!dataSelecionada ? 'inativo' : ''}>3</span> Selecione o horário</h3>
            <p className="subtitle">
              {dataSelecionada
                ? `Horários para ${dataSelecionada.toLocaleDateString('pt-BR')}`
                : 'Selecione um dia primeiro.'}
            </p>

            {loading ? (
              <p>Buscando horários...</p>
            ) : dataSelecionada ? (
              horariosDisponiveis.length > 0 ? (
                <div className="horarios-grid">
                  {horariosDisponiveis.map((h) => (
                    <button
                      key={h.hora}
                      className={`btn-horario ${horarioSelecionado?.hora === h.hora ? 'active' : ''}`}
                      onClick={() => setHorarioSelecionado(h)}
                    >
                      {h.hora}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="aviso-vazio">
                  <span className="material-symbols-outlined">event_busy</span>
                  <p>Não há horários disponíveis.</p>
                </div>
              )
            ) : null}
          </div>

          <div className="agendar-confirmacao">
            <div className="resumo">
              {dataSelecionada && horarioSelecionado ? (
                <>
                  <span className="material-symbols-outlined text-success">check_circle</span>
                  <p>
                    <strong>{dataSelecionada.toLocaleDateString('pt-BR')}</strong> às{' '}
                    <strong>{horarioSelecionado.hora}</strong>
                  </p>
                </>
              ) : (
                <p>Selecione a data e o horário.</p>
              )}
            </div>
            <button
              className="btn-confirmar"
              disabled={!dataSelecionada || !horarioSelecionado || !modalidadeSelecionada || confirmando}
              onClick={handleConfirmar}
            >
              {confirmando ? 'Confirmando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}