import React, { useState } from 'react';
import { CadastroBeneficiario } from '../components/cadastro/CadastroBeneficiario';
import { CadastroEmpresarial } from '../components/cadastro/CadastroEmpresarial';
import { CadastroProfissional } from '../components/cadastro/CadastroProfissional';
import '../css/cadastro.css';

export function Cadastro() {
  const [tipo, setTipo] = useState(null);

  const tipos = [
    {
      id: 'beneficiario',
      icon: 'person',
      titulo: 'Sou Beneficiário',
      descricao: 'Colaborador de uma empresa parceira MindU.',
    },
    {
      id: 'empresarial',
      icon: 'apartment',
      titulo: 'Sou Empresa',
      descricao: 'Quero levar a MindU para o meu time.',
    },
    {
      id: 'profissional',
      icon: 'medical_services',
      titulo: 'Sou Profissional',
      descricao: 'Psicólogo(a) ou psiquiatra parceiro.',
    },
  ];

  const renderForm = () => {
    switch (tipo) {
      case 'beneficiario':
        return <CadastroBeneficiario onBack={() => setTipo(null)} />;
      case 'empresarial':
        return <CadastroEmpresarial onBack={() => setTipo(null)} />;
      case 'profissional':
        return <CadastroProfissional onBack={() => setTipo(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-bg"/>

      <div className="cadastro-content">
        {!tipo ? (
          <>
            <div className="cadastro-header">
              <h1>Crie sua conta na MindU</h1>
              <p>Escolha o tipo de cadastro que melhor se encaixa com você.</p>
            </div>

            <div className="cadastro-tipos">
              {tipos.map((t) => (
                <button key={t.id} className="tipo-card glass-card" onClick={() => setTipo(t.id)}>
                  <span className="material-symbols-outlined glass-icon">
                    {t.icon}
                  </span>
                  <h3>{t.titulo}</h3>
                  <p>{t.descricao}</p>
                </button>
              ))}
            </div>

            <p className="cadastro-login-link">
              Já tem uma conta? <a href="/login">Fazer login</a>
            </p>
          </>
        ) : (
          renderForm()
        )}
      </div>
    </div>
  );
}