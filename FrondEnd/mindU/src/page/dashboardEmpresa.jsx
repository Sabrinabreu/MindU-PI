import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/dashboardEmpresa.css';


const MOCK_EMPRESA = {
  nome: 'Bradesco S.A.',
  gerente: 'Carlos Amaral',
  gerenteFoto: 'https://i.pravatar.cc/150?img=11',
  gerenteCargo: 'Gerente Financeiro',
  plano: 'Plano Básico',
  vencimento: '22/04/2027',
  vagasTotais: 100,
  cadastrados: 56,
  pendentes: 10,
  convitesPendentes: 34
};

const MOCK_BENEFICIARIOS = [
  { id: 1, nome: 'Carlos Amaral', foto: 'https://i.pravatar.cc/150?img=11', status: 'PENDENTE' },
  { id: 2, nome: 'Maria Silva', foto: 'https://i.pravatar.cc/150?img=45', status: 'ATIVO' },
  { id: 3, nome: 'João Paulo', foto: 'https://i.pravatar.cc/150?img=12', status: 'ATIVO' },
];

export function DashboardEmpresa() {
  const navigate = useNavigate();

  // Cálculos do gráfico (transforma em porcentagem)
  const total = MOCK_EMPRESA.vagasTotais;
  const pctCadastrados = Math.round((MOCK_EMPRESA.cadastrados / total) * 100);
  const pctPendentes = Math.round((MOCK_EMPRESA.pendentes / total) * 100);
  const pctDisponiveis = 100 - pctCadastrados - pctPendentes;

  return (
    <div className="dash-empresa-page">
      
      {/* ================= COLUNA 1 (ESQUERDA) ================= */}
      <aside className="dash-col-esquerda">
        <div className="dash-alerta-convites">
          <h2>{MOCK_EMPRESA.convitesPendentes} funcionários</h2>
          <p>com convite pendente!</p>
        </div>

        <div className="dash-manager-card">
          <img src={MOCK_EMPRESA.gerenteFoto} alt={MOCK_EMPRESA.gerente} />
          <div>
            <strong>{MOCK_EMPRESA.gerente}</strong>
            <span>{MOCK_EMPRESA.gerenteCargo}</span>
          </div>
        </div>
      </aside>

      {/* ================= COLUNA 2 (CENTRO - MÉTRICAS) ================= */}
      <main className="dash-col-centro">
        <div className="dash-card glass-card">
          <h3>Status do plano</h3>
          
          <div className="dash-grafico-container">
            <div 
              className="dash-donut" 
              style={{
                background: `conic-gradient(
                  #6366f1 0% ${pctCadastrados}%, 
                  #312e81 ${pctCadastrados}% ${pctCadastrados + pctPendentes}%, 
                  #e5e7eb ${pctCadastrados + pctPendentes}% 100%
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
                  <strong>{pctCadastrados}%</strong>
                  <p>Beneficiários cadastrados</p>
                </div>
              </div>
              <div className="legenda-item">
                <span className="dot dot-escuro"></span>
                <div>
                  <strong>{pctPendentes}%</strong>
                  <p>Cadastro pendente</p>
                </div>
              </div>
              <div className="legenda-item">
                <span className="dot dot-cinza"></span>
                <div>
                  <strong>{pctDisponiveis}%</strong>
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

      {/* ================= COLUNA 3 (DIREITA - PERFIL) ================= */}
      <aside className="dash-col-direita">
        <div className="dash-perfil-top">
          <h3>Meu perfil</h3>
          <div className="dash-logo-placeholder">
            <span className="material-symbols-outlined">corporate_fare</span>
          </div>
          <h2>{MOCK_EMPRESA.nome}</h2>
          <span className="dash-plano-tag">{MOCK_EMPRESA.plano}</span>
          <p className="dash-vencimento">Vencimento em {MOCK_EMPRESA.vencimento}</p>
          <button className="btn-text">Mais detalhes</button>
        </div>

        <div className="dash-beneficiarios">
          <div className="dash-benef-header">
            <h3>Beneficiários</h3>
            <div className="dash-benef-actions">
              <button title="Baixar lista"><span className="material-symbols-outlined">download</span></button>
              <button title="Adicionar"><span className="material-symbols-outlined">add</span></button>
            </div>
          </div>

          <div className="dash-benef-lista">
            {MOCK_BENEFICIARIOS.map(benef => (
              <div key={benef.id} className="dash-benef-item">
                <img src={benef.foto} alt={benef.nome} />
                <div className="dash-benef-info">
                  <strong>{benef.nome}</strong>
                  <span>Colaborador</span>
                </div>
                {benef.status === 'PENDENTE' && (
                  <span className="tag-pendente">Pendente</span>
                )}
              </div>
            ))}
          </div>

          <button className="btn-ver-todos" onClick={() => navigate('/colaboradores')}>
            Ver todos
          </button>
        </div>
      </aside>

    </div>
  );
}