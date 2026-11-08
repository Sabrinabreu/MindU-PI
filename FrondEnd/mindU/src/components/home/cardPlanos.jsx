import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import '../../css/cardPlanos.css';

// DICIONÁRIO (Preços e Features ficam no front)
const DADOS_MARKETING = {
  'Plano Start': {
    price: 'R$ 19',
    period: '/colaborador /mês',
    description: 'Ideal para pequenas empresas que querem iniciar o cuidado com a saúde mental do time.',
    features: [
      'Até 30 colaboradores',
      'Sessões de terapia online quinzenais',
      'Relatórios analíticos de bem-estar para o RH',
      'Workshops trimestrais de gestão de estresse'
    ],
    isPopular: false,
    buttonText: 'Assinar Start',
  },
  'Plano Essencial': {
    price: 'R$ 29',
    period: '/colaborador /mês',
    description: 'A escolha mais completa para promover o bem-estar contínuo e retenção de talentos.',
    features: [
      'Até 100 colaboradores',
      'Tudo do plano Start',
      'Sessões de terapia presenciais ou online (semanais)',
      'Acesso a Inteligência Artificial especializada',
      'Atendimento psicológico emergencial'
    ],
    isPopular: true,
    buttonText: 'Assinar Essencial',
  },
  'Plano Corporativo': {
    price: 'Sob Consulta',
    period: '',
    description: 'Solução personalizada sob medida para médias e grandes corporações.',
    features: [
      'Acima de 100 colaboradores (Usuários Ilimitados)',
      'Tudo do plano Essencial',
      'Workshops mensais e palestras com especialistas',
      'Atendimento dedicado 24/7'
    ],
    isPopular: false,
    buttonText: 'Solicitar Proposta',
  },
};

const PLANOS_FALLBACK = [
  { id: '1', nome: 'Plano Start' },
  { id: '2', nome: 'Plano Essencial' },
  { id: '3', nome: 'Plano Corporativo' },
];

export function SessaoPlanos() {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/v1/planos')
      .then((res) => {
        // Se o backend retornar vazio, usa o fallback
        setPlanos(res && res.length > 0 ? res : PLANOS_FALLBACK);
      })
      .catch((err) => {
        console.error('Erro ao buscar planos da API:', err);
        setPlanos(PLANOS_FALLBACK); // fallback em caso de erro
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="sectionIndex" id="planos">
      <div className="sectionHeader">
        <h2>Nossos Planos</h2>
        <p>Escolha a opção ideal para impulsionar suas metas</p>
      </div>

      <div className="plans-container">
        {loading ? (
          <div className="loading" style={{ width: '100%' }}>
            <span className="material-symbols-outlined girando">progress_activity</span>
            <p>Buscando planos...</p>
          </div>
        ) : (
          planos.map((planoBackend) => {
            const dadosVisuais = DADOS_MARKETING[planoBackend.nome];

            // Se o backend tiver um plano que não está no marketing, ignora (ou renderiza um básico)
            if (!dadosVisuais) return null;

            return (
              <div key={planoBackend.id} className={`plan-card ${dadosVisuais.isPopular ? 'popular' : ''}`}>
                {dadosVisuais.isPopular && <span className="badge">Mais Popular</span>}
                
                <h3>{planoBackend.nome}</h3>
                <div className="plan-price">
                  <span className="price">{dadosVisuais.price}</span>
                  <span className="period">{dadosVisuais.period}</span>
                </div>
                <p className="plan-description">{dadosVisuais.description}</p>

                <ul className="plan-features">
                  {dadosVisuais.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>

                <Link to={`/cadastro`} className={'btn-plan'}>
                  {dadosVisuais.buttonText}
                </Link>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}