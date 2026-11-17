import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, salvarSessao, limparSessao } from '../api';
import '../css/login.css';

export function Login() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    // ===== 1) LOGIN =====
    let resLogin;
    try {
      resLogin = await api('/v1/auth/login', { method: 'POST', body: form });
      // Salva o token ANTES de chamar /auth/me, porque o /me precisa dele
      localStorage.setItem('mindu_token', resLogin.token);
    } catch (err) {
      setErro(err.message);
      setLoading(false);
      return;
    }

    // ===== 2) CARREGA DADOS BÁSICOS DO USUÁRIO =====
    // Se isso falhar aqui, é sério — desloga e pede pra tentar de novo
    let me;
    try {
      me = await api('/v1/auth/me');
    } catch (err) {
      limparSessao();
      setErro('Não foi possível carregar sua conta. Tente novamente.');
      setLoading(false);
      return;
    }

    const tipoBackend = me.tipo || resLogin.tipo;
    const tipoFrontend = tipoBackend === 'CLIENTE' ? 'BENEFICIARIO' : tipoBackend;

    salvarSessao({
      token: resLogin.token,
      tipo: tipoFrontend,
      id: me.id,
      nome: me.nome,
    });

    // ===== 3) VERIFICA STATUS / COMPLETUDE DO PERFIL =====
    // perfilIncompleto → usuário pode entrar, mas SÓ na tela de perfil
    // bloqueado        → conta não aprovada / rejeitada, precisa de tela própria
    let perfilIncompleto = false;
    let bloqueado = null;

    try {
      if (tipoFrontend === 'BENEFICIARIO') {
        const c = await api('/v1/clientes/me');
        localStorage.setItem('mindu_status_cliente', c.status || '');

        if (c.status === 'APROVADO') {
          try {
            const ds = await api('/v1/clientes/me/dados-sensiveis');
            if (!ds.cns || !ds.dataNascimento || !ds.nomeMae || !ds.genero) {
              perfilIncompleto = true;
            }
          } catch {
            // Endpoint falhou → por precaução, exige preencher
            perfilIncompleto = true;
          }
        } else {
          // AGUARDANDO_APROVACAO ou REJEITADO → conta bloqueada
          bloqueado = c.status;
        }
      } else if (tipoFrontend === 'PROFISSIONAL') {
        const p = await api('/v1/profissionais/conta/perfil');
        localStorage.setItem('mindu_status_profissional', p.status || '');

        if (p.status === 'PENDENTE' || p.status === 'REJEITADO') {
          bloqueado = p.status;
        } else if (!p.tipo || !p.bio || !p.tags || p.tags.length === 0) {
          perfilIncompleto = true;
        }
      }
    } catch (err) {
      console.error('Falha ao verificar perfil:', err);
      // Não desloga — só força o usuário a passar pelo /perfil
      perfilIncompleto = true;
    }

    // ===== 4) REDIRECIONA =====
    if (bloqueado || perfilIncompleto) {
      localStorage.setItem('mindu_perfil_incompleto', 'true');
      navigate('/perfil');
    } else {
      localStorage.removeItem('mindu_perfil_incompleto');
      if (tipoFrontend === 'EMPRESA') navigate('/dashboard');
      else if (tipoFrontend === 'ADMIN') navigate('/admin/empresas');
      else if (tipoFrontend === 'PROFISSIONAL') navigate('/agenda');
      else navigate('/profissionais'); // BENEFICIARIO liberado
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-content">
        <form className="login-form glass-card" onSubmit={handleSubmit}>
          <h2>Bem-vindo de volta!</h2>
          <p className="form-subtitle">Acesse sua conta MindU para continuar.</p>

          <div className="form-grid">
            <div className="form-field full">
              <label>E-mail *</label>
              <input
                className="glass-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-field full">
              <label>Senha *</label>
              <div className="input-with-icon">
                <input
                  className="glass-input"
                  type={showPassword ? 'text' : 'password'}
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Sua senha"
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
          </div>

          {erro && <p className="form-erro">{erro}</p>}

          <button type="submit" className="btn-gradient full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="login-cadastro-link">
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
          <p className="login-esqueci-link">
            <Link to="/recuperar-senha">Esqueci minha senha</Link>
          </p>
        </form>
      </div>
    </div>
  );
}