import React, { useState } from 'react';
import { api } from '../../api';

// ⚠️ Temporário — depois deve vir de GET /v1/empresas/por-matricula
const EMPRESAS_OPCOES = [
  { value: 'uuid-technova', label: 'TechNova' },
  { value: 'uuid-orbegroup', label: 'Grupo Orbe' },
  { value: 'uuid-finantech', label: 'FinanTech' },
  { value: 'uuid-logione', label: 'LogiOne' },
  { value: 'uuid-educamais', label: 'EducaMais' },
];

const INITIAL_FORM_STATE = {
  nome: '',
  email: '',
  empresa: '',
  matricula: '',
  senha: '',
};

export function CadastroBeneficiario({ onBack }) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await api('/v1/clientes', {
        method: 'POST',
        body: {
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          empresaId: form.empresa,
          matricula: form.matricula,
        },
      });
      setSucesso(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="cadastro-form glass-card cols-1">
        <div className="sucesso-box">
          <span className="material-symbols-outlined sucesso-icon">hourglass_top</span>
          <h2>Aguardando aprovação</h2>
          <p className="form-subtitle">
            Seu cadastro foi enviado para o RH da sua empresa. Assim que for
            aprovado, você recebe um e-mail para acessar e completar seus dados.
          </p>
          <button
            type="button"
            className="btn-gradient"
            onClick={() => (window.location.href = '/login')}
          >
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="cadastro-form glass-card cols-1" onSubmit={handleSubmit}>
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
        Crie sua conta com a matrícula fornecida pelo RH da sua empresa.
      </p>

      <div className="form-grid cols-1">
        <div className="form-field full">
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

        <div className="form-field full">
          <label htmlFor="email">E-mail *</label>
          <input
            id="email"
            className="glass-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="form-field full">
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
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="form-field full">
          <label htmlFor="matricula">Matrícula *</label>
          <input
            id="matricula"
            className="glass-input"
            type="text"
            name="matricula"
            value={form.matricula}
            onChange={handleChange}
            placeholder="Ex: A1B2C3"
            required
          />
          <small>Você recebeu essa matrícula do RH da sua empresa.</small>
        </div>

        <div className="form-field full">
          <label htmlFor="senha">Senha *</label>
          <div className="input-with-icon">
            <input
              id="senha"
              className="glass-input"
              type={showPassword ? 'text' : 'password'}
              name="senha"
              value={form.senha}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <span className="material-symbols-outlined">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {erro && <p className="form-erro">{erro}</p>}

      <button type="submit" className="btn-gradient" disabled={loading}>
        {loading ? 'Enviando...' : 'Criar minha conta'}
      </button>
    </form>
  );
}