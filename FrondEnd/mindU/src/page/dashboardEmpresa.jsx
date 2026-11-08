import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getIniciais } from '../api';
import '../css/dashboardEmpresa.css';

export function DashboardEmpresa() {
  const navigate = useNavigate();
  
  const [empresa, setEmpresa] = useState(null);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [animacao, setAnimacao] = useState(0);
  const [showModalPlano, setShowModalPlano] = useState(false);
  const [colaboradorAberto, setColaboradorAberto] = useState(null);

  useEffect(() => {
    Promise.all([
      api('/v1/empresas/me'),
      api('/v1/clientes')
    ]).then(([resEmpresa, resClientes]) => {
      setEmpresa(resEmpresa);
      setBeneficiarios(resClientes);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Animação do Gráfico
  useEffect(() => {
    let start = null;
    const duration = 1000;
    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const timeProgress = Math.min(progress / duration, 1);
      setAnimacao(easeOutCubic(timeProgress));
      if (timeProgress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  if (loading || !empresa) return <div className="loading"><span className="material-symbols-outlined girando">progress_activity</span><p>Carregando…</p></div>;

  const total = empresa.matriculasUsadas + empresa.matriculasDisponiveis;
  const cadastrados = beneficiarios.filter(b => b.status === 'APROVADO').length;
  const pendentes = beneficiarios.filter(b => b.status === 'AGUARDANDO_APROVACAO').length;
  
  // 👇 Filtra a lista apenas de quem precisa de aprovação
  const usuariosPendentes = beneficiarios.filter(b => b.status === 'AGUARDANDO_APROVACAO');

  const pctCadastrados = total > 0 ? Math.round((cadastrados / total) * 100) : 0;
  const pctPendentes = total > 0 ? Math.round((pendentes / total) * 100) : 0;

  const pctAnimado1 = Math.round(pctCadastrados * animacao);
  const pctAnimado2 = Math.round((pctCadastrados + pctPendentes) * animacao);

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8,Nome,Email,Status\n" + 
      beneficiarios.map(b => `${b.nome},${b.email},${b.status}`).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "colaboradores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dash-empresa-page">
      
      {/* ================= COLUNA 1 (ESQUERDA - PENDENTES) ================= */}
      <aside className="dash-col-esquerda">
        <div className="dash-alerta-convites">
          <h2>{usuariosPendentes.length} pendentes</h2>
          <p>aguardando sua aprovação!</p>
        </div>

        <div className="dash-pending-list">
          {usuariosPendentes.length > 0 ? (
            usuariosPendentes.slice(0, 4).map(user => (
              <div key={user.id} className="dash-pending-item">
                <div className="avatar-iniciais">{getIniciais(user.nome)}</div>
                <div className="dash-pending-info">
                  <strong>{user.nome}</strong>
                  <span>{user.email}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="dash-empty-pending">
              <span className="material-symbols-outlined">check_circle</span>
              <p>Tudo em dia!<br/>Nenhum cadastro pendente.</p>
            </div>
          )}
        </div>

        {usuariosPendentes.length > 0 && (
          <button className="btn-outline-light" onClick={() => navigate('/colaboradores')}>
            Revisar todos
          </button>
        )}
      </aside>

      {/* ================= COLUNA 2 (CENTRO - GRÁFICO) ================= */}
      <main className="dash-col-centro">
        <div className="dash-card glass-card">
          <h3>Status do plano</h3>
          <div className="dash-grafico-container">
            <div className="dash-donut" style={{
                background: `conic-gradient(
                  var(--accent-action) 0% ${pctAnimado1}%, 
                  var(--chart-secondary) ${pctAnimado1}% ${pctAnimado2}%, 
                  var(--chart-tertiary) ${pctAnimado2}% 100%
                )`
              }}>
              <div className="dash-donut-buraco"></div>
            </div>
            <div className="dash-legenda">
              <div className="legenda-item">
                <span className="dot dot-azul"></span>
                <div><strong>{Math.round(pctCadastrados * animacao)}%</strong><p>Beneficiários ativos</p></div>
              </div>
              <div className="legenda-item">
                <span className="dot dot-escuro"></span>
                <div><strong>{Math.round(pctPendentes * animacao)}%</strong><p>Cadastro pendente</p></div>
              </div>
              <div className="legenda-item">
                <span className="dot dot-cinza"></span>
                <div><strong>{Math.round((100 - pctCadastrados - pctPendentes) * animacao)}%</strong><p>Vagas disponíveis</p></div>
              </div>
            </div>
          </div>
        </div>
        <div className="dash-alerta-roxa">
          <h4>Newsletter</h4>
          <p>AVISO: Nosso site ficará indisponível no dia 13, das 2h às 4h, para uma manutenção programada.</p>
          <span>Agradecemos a compreensão!</span>
        </div>
      </main>

      {/* ================= COLUNA 3 (DIREITA - PERFIL) ================= */}
      <aside className="dash-col-direita">
        <div className="dash-perfil-top">
          <h3>Meu perfil</h3>
          <div className="dash-logo-placeholder"><span className="material-symbols-outlined">corporate_fare</span></div>
          <h2>{empresa.nomeFantasia}</h2>
          <span className="dash-plano-tag">{empresa.plano}</span>
          <button className="btn-text" onClick={() => setShowModalPlano(true)}>Mais detalhes</button>
        </div>

        <div className="dash-beneficiarios">
          <div className="dash-benef-header">
            <h3>Últimos Cadastros</h3>
            <div className="dash-benef-actions">
              <button title="Baixar lista" onClick={handleDownload}><span className="material-symbols-outlined">download</span></button>
            </div>
          </div>
          <div className="dash-benef-lista">
            {beneficiarios.slice(0, 3).map(benef => (
              <div key={benef.id} className="dash-benef-wrapper">
                <div className={`dash-benef-item ${colaboradorAberto === benef.id ? 'active' : ''}`} onClick={() => setColaboradorAberto(colaboradorAberto === benef.id ? null : benef.id)}>
                  <div className="avatar-iniciais">{getIniciais(benef.nome)}</div>
                  <div className="dash-benef-info">
                    <strong>{benef.nome}</strong>
                    <span>{benef.email}</span>
                  </div>
                  {benef.status === 'AGUARDANDO_APROVACAO' && <span className="tag-pendente">Pendente</span>}
                </div>
                {colaboradorAberto === benef.id && (
                  <div className="dash-benef-contato">
                    <div className="contato-linha"><span className="material-symbols-outlined">call</span><span>{benef.telefone || 'Não informado'}</span></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => navigate('/colaboradores')}>Ver todos</button>
        </div>
      </aside>

      {showModalPlano && (
        <div className="dash-modal-overlay" onClick={() => setShowModalPlano(false)}>
          <div className="dash-modal glass-card" onClick={e => e.stopPropagation()}>
            <span className="material-symbols-outlined fechar-modal" onClick={() => setShowModalPlano(false)}>close</span>
            <h2>Detalhes do Plano</h2>
            <div className="modal-linha"><strong>Plano:</strong> {empresa.plano}</div>
            <div className="modal-linha"><strong>Total de vagas:</strong> {total}</div>
            <div className="modal-linha"><strong>Vagas em uso:</strong> {empresa.matriculasUsadas}</div>
            <div className="modal-linha"><strong>Vagas disponíveis:</strong> {empresa.matriculasDisponiveis}</div>
            <button className="btn-primary" onClick={() => setShowModalPlano(false)}>Entendi</button>
          </div>
        </div>
      )}
    </div>
  );
}