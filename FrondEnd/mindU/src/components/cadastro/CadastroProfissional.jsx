import React, { useState } from 'react';
import { api } from '../../api';

const INITIAL_FORM_STATE = {
  nome: '',
  email: '',
  senha: '',
};

export function CadastroProfissional({ onBack }) {
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
      const fd = new FormData();
      fd.append('nome', form.nome);
      fd.append('email', form.email);
      fd.append('senha', form.senha);

      await api('/v1/profissionais', {
        method: 'POST',
        body: fd,
        isFormData: true,
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
          <span className="material-symbols-outlined sucesso-icon">check_circle</span>
          <h2>Cadastro enviado!</h2>
          <p className="form-subtitle">
            Seu cadastro está em análise. Em até 3 dias úteis nossa equipe aprova
            seu perfil e você recebe um e-mail para completar seus dados e começar
            a atender.
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

      <h2>Cadastro de Psicólogo</h2>
      <p className="form-subtitle">
        Crie sua conta. Depois de aprovado, você completa seu perfil profissional.
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
            placeholder="Ex: Dra. Camila Ribeiro"
            autoComplete="name"
            required
          />
        </div>

        <div className="form-field full">
          <label htmlFor="email">E-mail profissional *</label>
          <input
            id="email"
            className="glass-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="voce@email.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="form-field full">
          <label htmlFor="senha">Senha de acesso *</label>
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
        {loading ? 'Enviando...' : 'Criar conta'}
      </button>
    </form>
  );
}