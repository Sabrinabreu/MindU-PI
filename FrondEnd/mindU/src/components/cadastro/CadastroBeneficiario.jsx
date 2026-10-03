import React, { useState, useMemo } from 'react';

const EMPRESAS_OPCOES = [
  { value: 'technova', label: 'TechNova' },
  { value: 'orbegroup', label: 'Grupo Orbe' },
  { value: 'finantech', label: 'FinanTech' },
  { value: 'logione', label: 'LogiOne' },
  { value: 'educamais', label: 'EducaMais' },
];

const INITIAL_FORM_STATE = {
  nome: '',
  emailCorporativo: '',
  empresa: '',
  matricula: '',
  senha: '',
};

export function CadastroBeneficiario({ onBack }) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const totalCampos = useMemo(() => Object.keys(form).length, [form]);
  const isSingleColumn = totalCampos <= 6;
  const gridClass = isSingleColumn ? 'cols-1' : 'cols-2';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastro Beneficiário:', form);
    // TODO: Integração com API
  };

  return (
    <form className={`cadastro-form glass-card ${gridClass}`} onSubmit={handleSubmit}>
      <button 
        type="button" 
        className="btn-voltar" 
        onClick={onBack}
        aria-label="Voltar para a página anterior"
      >
        <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        Voltar
      </button>

      <h2>Cadastro de Beneficiário</h2>
      <p className="form-subtitle">
        Preencha seus dados para acessar o convênio da sua empresa.
      </p>

      <div className={`form-grid ${gridClass}`}>
        <div className="form-field">
          <label htmlFor="nome">Nome completo *</label>
          <input
            id="nome"
            className="glass-input"
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: Ana Beatriz Silva"
            autoComplete="name"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="emailCorporativo">E-mail corporativo *</label>
          <input
            id="emailCorporativo"
            className="glass-input"
            type="email"
            name="emailCorporativo"
            value={form.emailCorporativo}
            onChange={handleChange}
            placeholder="seu.nome@empresa.com.br"
            autoComplete="email"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="empresa">Empresa vinculada *</label>
          <select
            id="empresa"
            className="glass-input"
            name="empresa"
            value={form.empresa}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecione sua empresa</option>
            {EMPRESAS_OPCOES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="matricula">Matrícula *</label>
          <input
            id="matricula"
            className="glass-input"
            type="text"
            name="matricula"
            value={form.matricula}
            onChange={handleChange}
            placeholder="Ex: 12345"
            aria-describedby="matricula-help"
            required
          />
          <small id="matricula-help">Encontre sua matrícula no crachá ou com o RH.</small>
        </div>

        <div className="form-field">
          <label htmlFor="senha">Senha *</label>
          <input
            id="senha"
            className="glass-input"
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            autoComplete="new-password"
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