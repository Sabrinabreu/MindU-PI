import React, { useState } from 'react';
import { api } from '../../api';

const INITIAL_FORM_STATE = { nome: '', email: '', senha: '' };

export function CadastroProfissional({ onBack }) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [fotoCarteirinha, setFotoCarteirinha] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'nome') finalValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    if (name === 'email') {
      finalValue = value.toLowerCase().trim(); // Força minúsculo e remove espaços
    }
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!fotoCarteirinha) {
      return setErro('A foto da carteirinha (CRP/CRM) é obrigatória.');
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('nome', form.nome);
      fd.append('email', form.email);
      fd.append('senha', form.senha);
      fd.append('fotoCarteirinha', fotoCarteirinha);

      await api('/v1/profissionais', { method: 'POST', body: fd, isFormData: true });
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
            Seu cadastro está em análise. Em até 3 dias úteis nossa equipe aprova seu perfil.
          </p>
          <button type="button" className="btn-gradient full" onClick={() => (window.location.href = '/login')}>
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="cadastro-form glass-card cols-1" onSubmit={handleSubmit}>
      <button type="button" className="btn-voltar" onClick={onBack}>
        <span className="material-symbols-outlined">arrow_back</span> Voltar
      </button>

      <h2>Cadastro de Psicólogo</h2>
      <p className="form-subtitle">Crie sua conta. Depois de aprovado, você completará seu perfil profissional.</p>

      <div className="form-grid cols-1">
        <div className="form-field full">
          <label htmlFor="nome">Nome completo *</label>
          <input id="nome" className="glass-input" type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Dra. Camila Ribeiro" autoComplete="name" maxLength={60} required />
        </div>

        <div className="form-field full">
          <label htmlFor="email">E-mail profissional *</label>
          <input id="email" className="glass-input" type="email" name="email" value={form.email} onChange={handleChange} autoCapitalize="none" placeholder="voce@email.com" autoComplete="email" maxLength={100} required />
        </div>

        <div className="form-field full">
          <label htmlFor="senha">Senha de acesso *</label>
          <div className="input-with-icon">
            <input id="senha" className="glass-input" type={showPassword ? 'text' : 'password'} name="senha" value={form.senha} onChange={handleChange} placeholder="Mínimo 8 caracteres" minLength={8} maxLength={50} autoComplete="new-password" required />
            <button type="button" className="toggle-password" onClick={() => setShowPassword((v) => !v)}>
              <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>

        <div className="form-field full">
          <label htmlFor="fotoCarteirinha">Foto da carteirinha (CRP/CRM) *</label>
          <label className="perfil-upload" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 1.2rem', background: 'var(--glass-input-bg)', border: '1.5px solid var(--glass-input-border)', borderRadius: '100px', cursor: 'pointer' }}>
            <input
              id="fotoCarteirinha"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFotoCarteirinha(e.target.files[0])}
              hidden
            />
            <span className="material-symbols-outlined">cloud_upload</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--glass-text)' }}>
              {fotoCarteirinha ? fotoCarteirinha.name : 'Clique para enviar (JPG, PNG ou PDF)'}
            </span>
          </label>
        </div>
      </div>

      {erro && <p className="form-erro">{erro}</p>}

      <button type="submit" className="btn-gradient full" disabled={loading}>
        {loading ? 'Enviando...' : 'Criar conta'}
      </button>
    </form>
  );
}