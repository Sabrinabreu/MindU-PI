import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/dashboardEmpresa.css';
import { getIniciais } from '../api';

const MOCK_EMPRESA = {
  nome: 'TechNova Soluções',
  gerente: 'Carlos Mendes',
  gerenteFoto: null,
  gerenteCargo: 'Gerente de RH',
  plano: 'Plano Pro',
  vencimento: '22/04/2027',
  vagasTotais: 100,
  cadastrados: 56,
  pendentes: 10,
  convitesPendentes: 34
};

const MOCK_BENEFICIARIOS = [
  { id: 1, nome: 'Carlos Amaral', foto: null, status: 'PENDENTE', email: 'carlos.amaral@technova.com', telefone: '(11) 98765-4321' },
  { id: 2, nome: 'Maria Silva', foto: 'https://i.pravatar.cc/150?img=45', status: 'ATIVO', email: 'maria.silva@technova.com', telefone: '(11) 91234-5678' },
  { id: 3, nome: 'João Paulo', foto: null, status: 'ATIVO', email: 'joao.paulo@technova.com', telefone: '(11) 97654-3210' },
];

export function DashboardEmpresa() {
  const navigate = useNavigate();
  
  // Estados para interações e animação
  const [animacao, setAnimacao] = useState(0);
  const [showModalPlano, setShowModalPlano] = useState(false);
  const [colaboradorAberto, setColaboradorAberto] = useState(null);

  // Cálculos do gráfico
  const total = MOCK_EMPRESA.vagasTotais;
  const pctCadastrados = Math.round((MOCK_EMPRESA.cadastrados / total) * 100);
  const pctPendentes = Math.round((MOCK_EMPRESA.pendentes / total) * 100);

  // Animação do Gráfico (do 0 até as porcentagens reais)
  useEffect(() => {
    let start = null;
    const duration = 1000;

   const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const timeProgress = Math.min(progress / duration, 1);
      const val = easeOutCubic(timeProgress); 
      
      setAnimacao(val);

      if (timeProgress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const pctAnimado1 = Math.round(pctCadastrados * animacao);
  const pctAnimado2 = Math.round((pctCadastrados + pctPendentes) * animacao);

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8,Nome,Email,Status\n" + 
      MOCK_BENEFICIARIOS.map(b => `${b.nome},${b.email},${b.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "beneficiarios_bradesco.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dash-empresa-page">
      
      {/* ================= COLUNA 1 ================= */}
      <aside className="dash-col-esquerda">
        <div className="dash-alerta-convites">
          <h2>{MOCK_EMPRESA.convitesPendentes} funcionários</h2>
          <p>com convite pendente!</p>
        </div>

        <div className="dash-manager-card">
          {MOCK_EMPRESA.gerenteFoto ? (
            <img src={MOCK_EMPRESA.gerenteFoto} alt={MOCK_EMPRESA.gerente} />
          ) : (
            <div className="avatar-iniciais">{getIniciais(MOCK_EMPRESA.gerente)}</div>
          )}
          <div>
            <strong>{MOCK_EMPRESA.gerente}</strong>
            <span>{MOCK_EMPRESA.gerenteCargo}</span>
          </div>
        </div>
      </aside>

      {/* ================= COLUNA 2 ================= */}
      <main className="dash-col-centro">
        <div className="dash-card glass-card">
          <h3>Status do plano</h3>
          
          <div className="dash-grafico-container">
            {/* Gráfico Antigo com Animação via JS */}
            <div 
              className="dash-donut" 
              style={{
                background: `conic-gradient(
                  var(--accent-action) 0% ${pctAnimado1}%, 
                  var(--chart-secondary) ${pctAnimado1}% ${pctAnimado2}%, 
                  var(--chart-tertiary) ${pctAnimado2}% 100%
                )`
              }}
            >
              <div className="dash-donut-buraco"></div>
            </div>

            {/* Legenda */}
            <div className="dash-legenda">
              <div className="legenda-item">
                <span className="dot dot-azul"></span>
                <div>
                  <strong>{Math.round(pctCadastrados * animacao)}%</strong>
                  <p>Beneficiários ativos</p>
                </div>
              </div>
              <div className="legenda-item">
                <span className="dot dot-escuro"></span>
                <div>
                  <strong>{Math.round(pctPendentes * animacao)}%</strong>
                  <p>Cadastro pendente</p>
                </div>
              </div>
              <div className="legenda-item">
                <span className="dot dot-cinza"></span>
                <div>
                  <strong>{Math.round((100 - pctCadastrados - pctPendentes) * animacao)}%</strong>
                  <p>Vagas disponíveis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-alerta-roxa">
          <h4>Newsletter</h4>
          <p>
            AVISO: Nosso site ficará indisponível no dia 13, das 2h às 4h, para uma
            manutenção programada.
          </p>
          <span>Agradecemos a compreensão!</span>
        </div>
      </main>

      {/* ================= COLUNA 3 ================= */}
      <aside className="dash-col-direita">
        <div className="dash-perfil-top">
          <h3>Meu perfil</h3>
          <div className="dash-logo-placeholder">
            <span className="material-symbols-outlined">corporate_fare</span>
          </div>
          <h2>{MOCK_EMPRESA.nome}</h2>
          <span className="dash-plano-tag">{MOCK_EMPRESA.plano}</span>
          <p className="dash-vencimento">Vencimento em {MOCK_EMPRESA.vencimento}</p>
          <button className="btn-text" onClick={() => setShowModalPlano(true)}>
            Mais detalhes
          </button>
        </div>

        <div className="dash-beneficiarios">
          <div className="dash-benef-header">
            <h3>Beneficiários</h3>
            <div className="dash-benef-actions">
              <button title="Baixar lista" onClick={handleDownload}>
                <span className="material-symbols-outlined">download</span>
              </button>
              <button title="Adicionar" onClick={() => navigate('/colaboradores')}>
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          <div className="dash-benef-lista">
            {MOCK_BENEFICIARIOS.map(benef => (
              <div key={benef.id} className="dash-benef-wrapper">
                <div 
                  className={`dash-benef-item ${colaboradorAberto === benef.id ? 'active' : ''}`}
                  onClick={() => setColaboradorAberto(colaboradorAberto === benef.id ? null : benef.id)}
                >
                  {benef.foto ? (
                    <img src={benef.foto} alt={benef.nome} />
                  ) : (
                    <div className="avatar-iniciais">{getIniciais(benef.nome)}</div>
                  )}
                  <div className="dash-benef-info">
                    <strong>{benef.nome}</strong>
                    <span>Colaborador</span>
                  </div>
                  {benef.status === 'PENDENTE' && (
                    <span className="tag-pendente">Pendente</span>
                  )}
                </div>

                {/* Bloco expandido com contato */}
                {colaboradorAberto === benef.id && (
                  <div className="dash-benef-contato">
                    <div className="contato-linha">
                      <span className="material-symbols-outlined">mail</span>
                      <span>{benef.email}</span>
                    </div>
                    <div className="contato-linha">
                      <span className="material-symbols-outlined">call</span>
                      <span>{benef.telefone}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={() => navigate('/colaboradores')}>
            Ver todos
          </button>
        </div>
      </aside>

      {/* Modal de Detalhes do Plano */}
      {showModalPlano && (
        <div className="dash-modal-overlay" onClick={() => setShowModalPlano(false)}>
          <div className="dash-modal glass-card" onClick={e => e.stopPropagation()}>
            <span className="material-symbols-outlined fechar-modal" onClick={() => setShowModalPlano(false)}>close</span>
            <h2>Detalhes do Plano</h2>
            <div className="modal-linha"><strong>Plano:</strong> {MOCK_EMPRESA.plano}</div>
            <div className="modal-linha"><strong>Vencimento:</strong> {MOCK_EMPRESA.vencimento}</div>
            <div className="modal-linha"><strong>Total de vagas:</strong> {MOCK_EMPRESA.vagasTotais}</div>
            <div className="modal-linha"><strong>Vagas em uso:</strong> {MOCK_EMPRESA.cadastrados + MOCK_EMPRESA.pendentes}</div>
            <div className="modal-linha"><strong>Convites pendentes:</strong> {MOCK_EMPRESA.convitesPendentes}</div>
            <button className="btn-primary" onClick={() => setShowModalPlano(false)}>Entendi</button>
          </div>
        </div>
      )}

    </div>
  );
}