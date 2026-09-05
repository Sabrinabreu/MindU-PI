import React from 'react';
import '../css/cardPlanos.css';

export function SessaoPlanos() {
  const plans = [
    {
        name: 'Essencial',
        price: 'R$ 19',
        period: '/colaborador /mês',
        description: 'Ideal para pequenas empresas que querem iniciar o cuidado com a saúde mental do time.',
        features: ['Até 20 colaboradores',
            'Sessões de terapia online quinzenais', 
            'Relatórios analíticos de bem-estar para o RH (anonimizados)', 
            'Workshops trimestrais de gestão de estresse'],
        isPopular: false,
        buttonText: 'Assinar Essencial',
    },
    {
        name: 'Pro',
        price: 'R$ 29',
        period: '/colaborador /mês',
        description: 'A escolha mais completa para promover o bem-estar contínuo e retenção de talentos.',
        features: ['Até 100 colaboradores',
            'Tudo do plano Essencial',
            'Sessões de terapia presenciais ou online (semanais)', 
            'Acesso a Inteligencia Artifical especializada',
            'Atendimento psicológico emergencial'],
        isPopular: true,
        buttonText: 'Assinar Pro',
    },
    {
        name: 'Corporativo',
        price: 'Sob Consulta',
        period: '',
        description: 'Solução personalizada sob medida para médias e grandes corporações.',
        features: ['Acima de 100 colaboradores (Usuários Ilimitados)',
            'Tudo do plano Pro',
            'Workshops mensais e palestras com especialistas',
            'Atendimento dedicado 24/7'],
        isPopular: false,
        buttonText: 'Solicitar Proposta Customizada',
    },
  ];

  return (
    <section className="plans-section" id="planos">
      <div className="plans-header">
        <h2>Nossos Planos</h2>
        <p>Escolha a opção ideal para impulsionar suas metas</p>
      </div>

      <div className="plans-container">
        {plans.map((plan, index) => (
          <div key={index} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
            {plan.isPopular && <span className="badge">Mais Popular</span>}
            
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="price">{plan.price}</span>
              <span className="period">{plan.period}</span>
            </div>
            <p className="plan-description">{plan.description}</p>

            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>

            <a href="#assinar" className={plan.isPopular ? 'btn-primary' : 'btn-plan'}>
              {plan.buttonText}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}