import React from 'react';
import '../css/footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Coluna 1 — Marca */}
        <div className="footer-col footer-brand">
          <h3 className="footer-logo">MindU</h3>
          <p className="footer-tagline">
            Cuidando da saúde mental de quem faz sua empresa acontecer.
          </p>

          <div className="footer-social">
            <a href="#" aria-label="Instagram" className="footer-social-link">
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
            <a href="#" aria-label="LinkedIn" className="footer-social-link">
              <span className="material-symbols-outlined">work</span>
            </a>
            <a href="#" aria-label="YouTube" className="footer-social-link">
              <span className="material-symbols-outlined">play_circle</span>
            </a>
            <a href="#" aria-label="WhatsApp" className="footer-social-link">
              <span className="material-symbols-outlined">chat</span>
            </a>
          </div>
        </div>

        {/* Coluna 2 — Navegação */}
        <div className="footer-col">
          <h4>Navegação</h4>
          <ul>
            <li><a href="#inicio">Início</a></li>
            <li><a href="#sobre">Quem Somos</a></li>
            <li><a href="#porque-mindu">Benefícios</a></li>
            <li><a href="#depoimentos">Depoimentos</a></li>
            <li><a href="#planos">Planos</a></li>
          </ul>
        </div>

        {/* Coluna 3 — Serviços */}
        <div className="footer-col">
          <h4>Serviços</h4>
          <ul>
            <li><a href="#planos">Terapia Online</a></li>
            <li><a href="#planos">Terapia Presencial</a></li>
            <li><a href="#planos">Workshops Corporativos</a></li>
            <li><a href="#planos">Consultoria para RH</a></li>
            <li><a href="#planos">Atendimento Emergencial</a></li>
          </ul>
        </div>

        {/* Coluna 4 — Contato */}
        <div className="footer-col">
          <h4>Contato</h4>
          <ul className="footer-contact">
            <li>
              <span className="material-symbols-outlined">mail</span>
              contato@mindu.com.br
            </li>
            <li>
              <span className="material-symbols-outlined">call</span>
              (11) 4000-0000
            </li>
            <li>
              <span className="material-symbols-outlined">location_on</span>
              São Paulo, SP — Brasil
            </li>
          </ul>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="footer-bottom">
        <p>© {currentYear} MindU. Todos os direitos reservados.</p>
        <div className="footer-bottom-links">
          <a href="#">Política de Privacidade</a>
          <span>•</span>
          <a href="#">Termos de Uso</a>
        </div>
      </div>
    </footer>
  );
}