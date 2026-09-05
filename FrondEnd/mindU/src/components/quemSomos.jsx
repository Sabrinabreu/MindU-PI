import React from 'react';
import '../css/quemSomos.css';
import SobreImage from '../assets/imgSobre.png'; 

export function About() {
  return (
    <section className="about-section">
      <div className="about-container">
        
        <div className="about-content">
            <h1>Quem somos nós</h1>
            <p>
                A <strong>MindU</strong> é o convênio de saúde mental especializado em conectar empresas a um ambiente de trabalho mais saudável, produtivo e equilibrado.
            </p>
            <p>
                Oferecemos uma solução completa: para a sua empresa, dados estratégicos de bem-estar, consultoria organizacional e redução de absenteísmo. Para seus colaboradores, acesso simplificado à terapia híbrida (presencial e online), além de workshops focados em inteligência emocional e manejo de estresse.
            </p>
            <a href="#planos" className="btn-about">Conheça Nossos Planos Corporativos</a>
        </div>

        <div className="about-image">
            <img src={SobreImage} />
        </div>

      </div>
    </section>
  );
}