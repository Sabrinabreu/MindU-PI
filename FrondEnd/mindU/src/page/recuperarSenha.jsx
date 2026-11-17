import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import '../css/recuperarSenha.css';

// rota real aqui!!
const ENDPOINT_SOLICITAR = '/v1/auth/recuperar-senha';

export function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await api(ENDPOINT_SOLICITAR, { method: 'POST', body: { email } });
    } catch (err) {
      console.warn('[dev] endpoint de recuperação:', err.message);
    } finally {
      setLoading(false);
      setEnviado(true);
    }
  };

  return (
    <div className="recover-page">
      <div className="recover-bg" />
      <div className="recover-content">
        <div className="recover-form glass-card">
          {!enviado ? (
            <>
              <Link to="/login" className="recover-voltar">
                <span className="material-symbols-outlined">arrow_back</span>
                Voltar ao login
              </Link>

              <div className="recover-icon-wrapper">
                <span className="material-symbols-outlined">lock_reset</span>
              </div>

              <h2>Recuperar senha</h2>
              <p className="form-subtitle">
                Digite seu e-mail cadastrado e enviaremos um link para você redefinir sua senha.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-field full">
                  <label>E-mail *</label>
                  <input
                    className="glass-input"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    required
                  />
                </div>

                {erro && <p className="form-erro">{erro}</p>}

                <button type="submit" className="btn-gradient full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>

              <p className="recover-footer">
                Lembrou a senha? <Link to="/login">Fazer login</Link>
              </p>
            </>
          ) : (
            <>
              <div className="recover-success-icon">
                <span className="material-symbols-outlined">mark_email_read</span>
              </div>

              <h2>Verifique seu e-mail</h2>
              <p className="form-subtitle">
                Se <strong>{email}</strong> estiver cadastrado em nossa plataforma,
                você receberá um e-mail com instruções para redefinir sua senha.
              </p>

              <div className="recover-info-box">
                <span className="material-symbols-outlined">info</span>
                <p>
                  Não recebeu? Verifique sua caixa de spam ou tente novamente em alguns minutos.
                </p>
              </div>

              <Link to="/login" className="btn-gradient full" style={{ textDecoration: 'none' }}>
                Voltar ao login
              </Link>

              <button
                type="button"
                className="recover-tentar-novamente"
                onClick={() => { setEnviado(false); setErro(''); }}
              >
                Tentar com outro e-mail
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}