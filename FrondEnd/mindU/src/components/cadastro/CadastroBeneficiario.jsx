import React, { useState } from 'react';
import { api } from '../../api';

const INITIAL_FORM_STATE = {
  nome: '',
  email: '',
  empresaId: '',
  nomeEmpresa: '',
  matricula: '',
  senha: '',
};

export function CadastroBeneficiario({ onBack }) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buscandoMatricula, setBuscandoMatricula] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Se mudou a matrícula, limpa os dados da empresa
    if (name === 'matricula') {
      setForm(prev => ({ ...prev, empresaId: '', nomeEmpresa: '' }));
    }
  };

  const validarMatricula = async () => {
    if (!form.matricula.trim()) return;
    setBuscandoMatricula(true);
    setErro('');
    
    try {
      const res = await api(`/v1/empresas/validar-matricula?codigo=${form.matricula}`);
      setForm(prev => ({ 
        ...prev, 
        empresaId: res.empresaId, 
        nomeEmpresa: res.nomeFantasia 
      }));
    } catch (err) {
      setErro('Matrícula inválida ou já utilizada.');
      setForm(prev => ({ ...prev, empresaId: '', nomeEmpresa: '' }));
    } finally {
      setBuscandoMatricula(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.empresaId) {
      setErro('Valide a matrícula antes de continuar.');
      return;
    }
    
    setErro('');
    setLoading(true);

    try {
      await api('/v1/clientes', {
        method: 'POST',
        body: {
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          empresaId: form.empresaId,
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
            Seu cadastro foi enviado para o RH da sua empresa. Assim que for aprovado, você poderá acessar.
          </p>
          <button type="button" className="btn-gradient" onClick={() => (window.location.href = '/login')}>
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

      <h2>Cadastro de Beneficiário</h2>
      <p className="form-subtitle">Crie sua conta com a matrícula fornecida pelo RH.</p>

      <div className="form-grid cols-1">
        <div className="form-field full">
          <label>Matrícula *</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              className="glass-input"
              type="text"
              name="matricula"
              value={form.matricula}
              onChange={handleChange}
              onBlur={validarMatricula} // Valida sozinho quando sai do campo
              placeholder="Ex: A1B2C3"
              required
            />
            <button 
              type="button" 
              className="btn-gradient" 
              style={{ padding: '0 20px', width: 'auto' }} 
              onClick={validarMatricula}
              disabled={buscandoMatricula}
            >
              {buscandoMatricula ? '...' : 'Validar'}
            </button>
          </div>
          {form.nomeEmpresa && <small style={{ color: '#4ade80' }}>✓ Empresa: {form.nomeEmpresa}</small>}
          {!form.nomeEmpresa && <small>Digite a matrícula e clique em Validar.</small>}
        </div>

        <div className="form-field full">
          <label>Nome completo *</label>
          <input className="glass-input" type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Ana Beatriz Silva" required />
        </div>

        <div className="form-field full">
          <label>E-mail *</label>
          <input className="glass-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" required />
        </div>

        <div className="form-field full">
          <label>Senha *</label>
          <div className="input-with-icon">
            <input className="glass-input" type={showPassword ? 'text' : 'password'} name="senha" value={form.senha} onChange={handleChange} placeholder="Mínimo 8 caracteres" minLength={8} required />
            <button type="button" className="toggle-password" onClick={() => setShowPassword((v) => !v)}>
              <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>
      </div>

      {erro && <p className="form-erro">{erro}</p>}

      <button type="submit" className="btn-gradient" disabled={loading || !form.empresaId}>
        {loading ? 'Enviando...' : 'Criar minha conta'}
      </button>
    </form>
  );
}