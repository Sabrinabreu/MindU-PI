import React, { useState } from 'react';
import { api } from '../../api';

const INITIAL_FORM_STATE = { nome: '', email: '', empresaId: '', nomeEmpresa: '', matricula: '', senha: '' };

export function CadastroBeneficiario({ onBack }) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buscandoMatricula, setBuscandoMatricula] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'nome') finalValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''); 
    if (name === 'matricula') finalValue = value.toUpperCase().substring(0, 10);

    setForm((prev) => ({ ...prev, [name]: finalValue }));
    if (name === 'matricula') setForm(prev => ({ ...prev, empresaId: '', nomeEmpresa: '' }));
  };

  const validarMatricula = async () => {
    if (!form.matricula.trim()) return;
    setBuscandoMatricula(true);
    setErro('');
    try {
      const res = await api(`/v1/empresas/validar-matricula?codigo=${form.matricula}`);
      setForm(prev => ({ ...prev, empresaId: res.empresaId, nomeEmpresa: res.nomeFantasia }));
    } catch (err) {
      setErro('Matrícula inválida ou já utilizada.');
      setForm(prev => ({ ...prev, empresaId: '', nomeEmpresa: '' }));
    } finally { setBuscandoMatricula(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.empresaId) return setErro('Valide a matrícula antes de continuar.');
    setErro('');
    setLoading(true);
    try {
      await api('/v1/clientes', { method: 'POST', body: form });
      setSucesso(true);
    } catch (err) { setErro(err.message); } finally { setLoading(false); }
  };

  if (sucesso) {
    return (
      <div className="cadastro-form glass-card cols-1">
        <div className="sucesso-box">
          <span className="material-symbols-outlined sucesso-icon">hourglass_top</span>
          <h2>Aguardando aprovação</h2>
          <p className="form-subtitle">Seu cadastro foi enviado para o RH da sua empresa.</p>
          <button type="button" className="btn-gradient full" onClick={() => (window.location.href = '/login')}>Ir para o login</button>
        </div>
      </div>
    );
  }

  return (
    <form className="cadastro-form glass-card cols-1" onSubmit={handleSubmit}>
      <button type="button" className="btn-voltar" onClick={onBack}><span className="material-symbols-outlined">arrow_back</span> Voltar</button>
      <h2>Cadastro de Beneficiário</h2>
      <p className="form-subtitle">Crie sua conta com a matrícula fornecida pelo RH.</p>

      <div className="form-grid cols-1">
        <div className="form-field full">
          <label>Matrícula *</label>
          <input 
            className="glass-input" 
            type="text" 
            name="matricula" 
            value={form.matricula} 
            onChange={handleChange} 
            onBlur={validarMatricula} 
            placeholder="Ex: A1B2C3" 
            maxLength={10} 
            required 
          />
          {buscandoMatricula && <small style={{ color: 'var(--text-s)' }}>Validando matrícula...</small>}
          {!buscandoMatricula && form.nomeEmpresa && <small style={{ color: '#4ade80' }}>✓ Empresa: {form.nomeEmpresa}</small>}
        </div>

        <div className="form-field full">
          <label>Nome completo *</label>
          <input className="glass-input" type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Ana Beatriz Silva" maxLength={60} required />
        </div>

        <div className="form-field full">
          <label>E-mail *</label>
          <input className="glass-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" maxLength={100} required />
        </div>

        <div className="form-field full">
          <label>Senha *</label>
          <div className="input-with-icon">
            <input className="glass-input" type={showPassword ? 'text' : 'password'} name="senha" value={form.senha} onChange={handleChange} placeholder="Mínimo 8 caracteres" minLength={8} maxLength={50} required />
            <button type="button" className="toggle-password" onClick={() => setShowPassword((v) => !v)}><span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span></button>
          </div>
        </div>
      </div>

      {erro && <p className="form-erro">{erro}</p>}
      <button type="submit" className="btn-gradient full" disabled={loading || !form.empresaId || buscandoMatricula}>
        {loading ? 'Enviando...' : 'Criar minha conta'}
      </button>
    </form>
  );
}