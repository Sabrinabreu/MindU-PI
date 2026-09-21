import React, { useState, useEffect } from 'react';
import '../css/depoimentos.css';

export function Depoimentos() {
  const testimonials = [
    {
      photo: 'https://i.pravatar.cc/150?img=32',
      name: 'Mariana Alves',
      role: 'Gerente de RH • TechNova',
      rating: 5,
      comment:
        'Depois que a MindU entrou na TechNova, o absenteísmo caiu 32% em seis meses. O time está mais engajado e o RH finalmente tem dados reais para agir.',
    },
    {
      photo: 'https://i.pravatar.cc/150?img=12',
      name: 'Carlos Mendes',
      role: 'CEO • Grupo Orbe',
      rating: 5,
      comment:
        'A consultoria organizacional mudou nossa cultura. Hoje falar sobre saúde mental é natural aqui dentro, e isso reflete diretamente nos resultados.',
    },
    {
      photo: 'https://i.pravatar.cc/150?img=45',
      name: 'Juliana Prado',
      role: 'Colaboradora • FinanTech',
      rating: 5,
      comment:
        'Ter acesso à terapia online pelo trabalho foi um divisor de águas. Consigo cuidar da minha cabeça sem sacrificar minha rotina profissional.',
    },
    {
      photo: 'https://i.pravatar.cc/150?img=68',
      name: 'Rafael Souza',
      role: 'Diretor de Operações • LogiOne',
      rating: 4,
      comment:
        'Os workshops de inteligência emocional transformaram a forma como nossos líderes se comunicam. Recomendo para qualquer empresa que valoriza pessoas.',
    },
    {
      photo: 'https://i.pravatar.cc/150?img=20',
      name: 'Beatriz Lima',
      role: 'Coordenadora • EducaMais',
      rating: 5,
      comment:
        'Atendimento humanizado do começo ao fim. A MindU não é só um convênio, é uma parceira estratégica do nosso bem-estar.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Ajusta quantos cards aparecem conforme o tamanho da tela
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 700) setCardsPerView(1);
      else if (window.innerWidth <= 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  // Garante que o índice não ultrapasse o limite ao redimensionar
  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [cardsPerView, currentIndex, maxIndex]);

  const next = () => setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1));
  const prev = () => setCurrentIndex((i) => (i <= 0 ? maxIndex : i - 1));

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  return (
    <section className="sectionIndex" id="depoimentos">
      <div className="sectionHeader">
        <h2>O que dizem sobre a MindU</h2>
        <p>Histórias reais de empresas e colaboradores que transformaram sua cultura.</p>
      </div>

      <div className="carousel-wrapper">
        <button
          className="carousel-btn prev"
          onClick={prev}
          aria-label="Depoimento anterior"
        >
          ‹
        </button>

        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="testimonial-card"
                style={{ flex: `0 0 ${100 / cardsPerView}%` }}
              >
                <div className="testimonial-rating">{renderStars(t.rating)}</div>

                <p className="testimonial-comment">“{t.comment}”</p>

                <div className="testimonial-author">
                  <img src={t.photo} alt={t.name} className="testimonial-photo" />
                  <div className="testimonial-info">
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel-btn next"
          onClick={next}
          aria-label="Próximo depoimento"
        >
          ›
        </button>
      </div>

      <div className="carousel-dots">
        {Array.from({ length: maxIndex + 1 }, (_, i) => (
          <button
            key={i}
            className={`dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Ir para o slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}