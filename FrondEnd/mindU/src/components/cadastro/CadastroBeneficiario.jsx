import React, { useState } from 'react';

export function CadastroBeneficiario({ onBack }) {
  const [form, setForm] = useState({
    nome: '',
    emailCorporativo: '',
    empresa: '',
    matricula: '',
    senha: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastro Beneficiário:', form);
    // TODO: enviar para API
  };

  return (
    <form className="cadastro-form glass-card" onSubmit={handleSubmit}>
      <button type="button" className="btn-voltar" onClick={onBack}>
        <span className="material-symbols-outlined">arrow_back</span>
        Voltar
      </button>

      <h2>Cadastro de Beneficiário</h2>
      <p className="form-subtitle">
        Preencha seus dados para acessar o convênio da sua empresa.
      </p>

      <div className="form-grid">
        <div className="form-field full">
          <label>Nome completo *</label>
          <input
            className="glass-input"
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: Ana Beatriz Silva"
            required
          />
        </div>

        <div className="form-field full">
          <label>E-mail corporativo *</label>
          <input
            className="glass-input"
            type="email"
            name="emailCorporativo"
            value={form.emailCorporativo}
            onChange={handleChange}
            placeholder="seu.nome@empresa.com.br"
            required
          />
        </div>

        <div className="form-field">
          <label>Empresa vinculada *</label>
          <select
            className="glass-input"
            name="empresa"
            value={form.empresa}
            onChange={handleChange}
            required
          >
            <option value="">Selecione sua empresa</option>
            <option value="technova">TechNova</option>
            <option value="orbegroup">Grupo Orbe</option>
            <option value="finantech">FinanTech</option>
            <option value="logione">LogiOne</option>
            <option value="educamais">EducaMais</option>
          </select>
        </div>

        <div className="form-field">
          <label>Matrícula *</label>
          <input
            className="glass-input"
            type="text"
            name="matricula"
            value={form.matricula}
            onChange={handleChange}
            placeholder="Ex: 12345"
            required
          />
          <small>Encontre sua matrícula no crachá ou com o RH.</small>
        </div>

        <div className="form-field full">
          <label>Senha *</label>
          <input
            className="glass-input"
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn-gradient">
        Criar minha conta
      </button>
    </form>
  );
}