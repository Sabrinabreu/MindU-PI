import React from 'react';
import '../css/cardBeneficios.css';

export function PorQueMindU() {
  const benefits = [
    {
      icon: 'psychology',
      title: 'Especialistas em Saúde Mental',
      description:
        'Psicólogos e psiquiatras qualificados, com atendimento humanizado e baseado em evidências científicas.',
    },
    {
      icon: 'monitoring',
      title: 'Dados Estratégicos para o RH',
      description:
        'Relatórios anonimizados que revelam o panorama real de bem-estar do time e orientam decisões inteligentes.',
    },
    {
      icon: 'devices',
      title: 'Atendimento Híbrido e Flexível',
      description:
        'Sessões presenciais ou online, no horário que melhor se adapta à rotina do colaborador e da empresa.',
    },
    {
      icon: 'trending_up',
      title: 'Resultados Mensuráveis',
      description:
        'Redução comprovada de absenteísmo, aumento da produtividade e retenção de talentos em empresas parceiras.',
    },
  ];

  return (
    <section className="sectionIndex section-Benef">
      <div className="sectionHeader">
        <h2>Por que escolher a MindU?</h2>
        <p>Benefícios que transformam o ambiente de trabalho e cuidam de quem faz sua empresa acontecer.</p>
      </div>

      <div className="cardBenef-container">
        {benefits.map((benefit, index) => (
          <div key={index} className="cardBenef-card">
            <div className="cardBenef-icon">
              <span className="material-symbols-outlined">{benefit.icon}</span>
            </div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}