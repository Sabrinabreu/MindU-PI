import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../css/recuperarSenha.css';

// rota real aqui!!
const ENDPOINT_REDEFINIR = '/v1/auth/redefinir-senha';

export function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ novaSenha: '', confirmarSenha: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (form.novaSenha.length < 8) {
      return setErro('A senha deve ter no mínimo 8 caracteres.');
    }
    if (form.novaSenha !== form.confirmarSenha) {
      return setErro('As senhas não coincidem.');
    }

    setLoading(true);
    try {
      await api(ENDPOINT_REDEFINIR, {
        method: 'POST',
        body: { token, novaSenha: form.novaSenha },
      });
      setSucesso(true);
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      const endpointInexistente =
        err.message.includes('404') ||
        err.message.includes('Failed') ||
        err.message.includes('Erro 4');

      setErro(
        endpointInexistente
          ? 'A redefinição de senha ainda não está disponível no servidor. Tente novamente mais tarde.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="recover-page">
        <div className="recover-bg" />
        <div className="recover-content">
          <div className="recover-form glass-card">
            <div className="recover-error-icon">
              <span className="material-symbols-outlined">link_off</span>
            </div>
            <h2>Link inválido</h2>
            <p className="form-subtitle">
              Este link de recuperação está incompleto ou expirou. Solicite um novo.
            </p>
            <Link to="/recuperar-senha" className="btn-gradient full" style={{ textDecoration: 'none' }}>
              Solicitar novo link
            </Link>
            <Link to="/login" className="recover-tentar-novamente">
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="recover-page">
        <div className="recover-bg" />
        <div className="recover-content">
          <div className="recover-form glass-card">
            <div className="recover-success-icon">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h2>Senha redefinida!</h2>
            <p className="form-subtitle">
              Sua senha foi alterada com sucesso. Redirecionando para o login...
            </p>
            <Link to="/login" className="btn-gradient full" style={{ textDecoration: 'none' }}>
              Ir para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recover-page">
      <div className="recover-bg" />
      <div className="recover-content">
        <div className="recover-form glass-card">
          <div className="recover-icon-wrapper">
            <span className="material-symbols-outlined">lock</span>
          </div>

          <h2>Definir nova senha</h2>
          <p className="form-subtitle">
            Escolha uma senha forte com no mínimo 8 caracteres.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid cols-1">
              <div className="form-field full">
                <label>Nova senha *</label>
                <div className="input-with-icon">
                  <input
                    className="glass-input"
                    type={showPassword ? 'text' : 'password'}
                    name="novaSenha"
                    value={form.novaSenha}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    maxLength={50}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="form-field full">
                <label>Confirmar nova senha *</label>
                <input
                  className="glass-input"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmarSenha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Repita a senha"
                  minLength={8}
                  maxLength={50}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {erro && <p className="form-erro">{erro}</p>}

            <button type="submit" className="btn-gradient full" disabled={loading}>
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>

          <Link to="/login" className="recover-tentar-novamente">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}