import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, salvarSessao } from '../api';
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
    
    try {
      const resLogin = await api('/v1/auth/login', { method: 'POST', body: form });
      localStorage.setItem('mindu_token', resLogin.token);
      const me = await api('/v1/auth/me');

      salvarSessao({ 
        token: resLogin.token, 
        tipo: me.tipo || resLogin.tipo,
        id: me.id, 
        nome: me.nome,
        foto: ''
      });

      // ===== VERIFICAÇÃO DE PERFIL INCOMPLETO =====
      let perfilIncompleto = false;

      if (me.tipo === 'BENEFICIARIO') {
        const c = await api('/v1/clientes/me');
        // Beneficiário precisa de data de nascimento, nome da mãe ou gênero preenchidos
        if (!c.cns || !c.dataNascimento || !c.nomeMae || !c.genero) {
          perfilIncompleto = true;
        }
      } 
      else if (me.tipo === 'PROFISSIONAL') {
        const p = await api('/v1/profissionais/conta/perfil');
        // Profissional precisa de tipo, bio e tags preenchidos
        if (!p.tipo || !p.bio || !p.tags || p.tags.length === 0) {
          perfilIncompleto = true;
        }
      }

      if (perfilIncompleto) {
        localStorage.setItem('mindu_perfil_incompleto', 'true');
        navigate('/perfil');
      } else {
        localStorage.removeItem('mindu_perfil_incompleto');
        if (me.tipo === 'EMPRESA') navigate('/dashboard');
        else if (me.tipo === 'ADMIN') navigate('/admin/empresas');
        else navigate('/perfil');
      }
      
    } catch (err) {
      localStorage.removeItem('mindu_token');
      setErro(err.message);
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
          <p className="form-subtitle">Acesse sua conta MindU para continuar.</p>

          <div className="form-grid">
            <div className="form-field full">
              <label>E-mail *</label>
              <input className="glass-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" required />
            </div>

            <div className="form-field full">
              <label>Senha *</label>
              <div className="input-with-icon">
                <input className="glass-input" type={showPassword ? 'text' : 'password'} name="senha" value={form.senha} onChange={handleChange} placeholder="Sua senha" required />
                <button type="button" className="toggle-password" onClick={() => setShowPassword((v) => !v)}>
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
          </div>

          {erro && <p className="form-erro">{erro}</p>}

          <button type="submit" className="btn-gradient full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="login-cadastro-link">Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
        </form>
      </div>
    </div>
  );
}