import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';

const INITIAL_FORM_STATE = {
  email: '',
  senha: '',
};

export function Login() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Login:', form);
      // TODO: Integração com API
      // await authService.login(form);
      // navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />

      <div className="login-content">
        <form className="login-form glass-card" onSubmit={handleSubmit}>
          <h2>Bem-vindo de volta!</h2>
          <p className="form-subtitle">
            Acesse sua conta MindU para continuar.
          </p>

          <div className="form-grid">
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
              <label htmlFor="senha">Senha *</label>
              <div className="input-with-icon">
                <input
                  id="senha"
                  className="glass-input"
                  type={showPassword ? 'text' : 'password'}
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Sua senha"
                  minLength={8}
                  autoComplete="current-password"
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

            <div className="form-field full login-row-extras">
              <label className="switch-lembrar">
                <input type="checkbox" name="lembrar" />
                <span>Lembrar de mim</span>
              </label>

              <Link to="/recuperar-senha" className="link-esqueci">
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="btn-gradient full"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="login-cadastro-link">
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}