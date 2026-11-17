import React, { useState, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import { api } from '../../api';

const INITIAL_FORM_STATE = {
  razaoSocial: '', nomeFantasia: '', inscricaoEstadual: '', cnpj: '',
  responsavel: '', email: '', telefone: '', cep: '', cidade: '',
  logradouro: '', numero: '', complemento: '', bairro: '', estado: '',
  planoId: '', senha: '',
};

const CAMPOS_POR_ETAPA = {
  1: ['razaoSocial', 'nomeFantasia', 'inscricaoEstadual', 'cnpj', 'responsavel', 'email', 'telefone'],
  2: ['cep', 'cidade', 'logradouro', 'numero', 'bairro', 'estado'],
};

export function CadastroEmpresarial({ onBack }) {
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [planos, setPlanos] = useState([]);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    api('/v1/planos').then(setPlanos).catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // FILTRO: Apenas letras (com acentos), números e espaços onde faz sentido
    if (['razaoSocial', 'nomeFantasia', 'responsavel'].includes(name)) {
      finalValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''); // Só letras e espaço
    }
    if (['bairro', 'cidade'].includes(name)) {
      finalValue = value.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, ''); // Letras, números e espaço
    }
    if (['numero', 'complemento'].includes(name)) {
      finalValue = value.replace(/[^a-zA-Z0-9À-ÿ\s,-]/g, ''); // Alphanumérico e pontuação
    }
    if (name === 'estado') {
      finalValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 2); // Aceita APENAS letras, converte para MAIÚSCULO e limita a 2 caracteres
    }
    if (name === 'email') {
      finalValue = value.toLowerCase().trim(); // Força minúsculo e remove espaços
    }

    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleMaskedChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepBlur = async (e) => {
    const cepLimpo = e.target.value.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    setBuscandoCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) return alert('CEP não encontrado.');
      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      }));
    } catch (err) { console.error(err); } finally { setBuscandoCep(false); }
  };

  const validarEtapa = () => {
    const campos = CAMPOS_POR_ETAPA[etapa];
    const invalidos = campos.filter((c) => {
      if (c === 'inscricaoEstadual' || c === 'complemento') return false;
      return !form[c] || !form[c].trim();
    });

    if (invalidos.length > 0) {
      const first = document.getElementById(invalidos[0]);
      first?.focus();
      first?.reportValidity?.();
      return false;
    }
    return true;
  };

  const handleNextStep = (e) => { e.preventDefault(); if (validarEtapa()) setEtapa(2); };
  const handleBackStep = () => { if (etapa === 2) setEtapa(1); else onBack(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.planoId) return setErro('Selecione um plano de interesse.');
    setLoading(true);
    try {
      await api('/v1/empresas', { method: 'POST', body: form });
      setSucesso(true);
    } catch (err) { setErro(err.message); } finally { setLoading(false); }
  };

  if (sucesso) {
    return (
      <div className="cadastro-form glass-card cols-1">
        <div className="sucesso-box">
          <span className="material-symbols-outlined sucesso-icon">check_circle</span>
          <h2>Empresa cadastrada!</h2>
          <p className="form-subtitle">Sua empresa está pronta. Faça login para continuar.</p>
          <button type="button" className="btn-gradient" onClick={() => (window.location.href = '/login')}>Ir para o login</button>
        </div>
      </div>
    );
  }

  return (
    <form className="cadastro-form glass-card" onSubmit={handleSubmit}>
      <button type="button" className="btn-voltar" onClick={handleBackStep}><span className="material-symbols-outlined">arrow_back</span> Voltar</button>
      <h2>Cadastro Empresarial</h2>
      <p className="form-subtitle">{etapa === 1 ? 'Informe os dados da empresa.' : 'Preencha o endereço e escolha o plano.'}</p>

      <div className="step-indicator">
        {Array.from({ length: 2 }, (_, i) => (
          <span key={i} className={`step-dot ${etapa === i + 1 ? 'active' : ''} ${etapa > i + 1 ? 'done' : ''}`} />
        ))}
      </div>

      <div className="form-grid cols-2">
        {etapa === 1 && (
          <>
            <div className="form-field full">
              <label>Razão social *</label>
              <input className="glass-input" type="text" name="razaoSocial" value={form.razaoSocial} onChange={handleChange} placeholder="Ex: TechNova Soluções LTDA" maxLength={80} required />
            </div>
            <div className="form-field">
              <label>Nome fantasia *</label>
              <input className="glass-input" type="text" name="nomeFantasia" value={form.nomeFantasia} onChange={handleChange} placeholder="Ex: TechNova" maxLength={50} required />
            </div>
            <div className="form-field">
              <label>CNPJ *</label>
              <IMaskInput className="glass-input" mask="00.000.000/0000-00" value={form.cnpj} onAccept={(v) => handleMaskedChange('cnpj', v)} placeholder="00.000.000/0000-00" required />
            </div>
            <div className="form-field">
              <label>Inscrição estadual</label>
              <input className="glass-input" type="text" name="inscricaoEstadual" value={form.inscricaoEstadual} onChange={handleChange} placeholder="Opcional" maxLength={20} />
            </div>
            <div className="form-field">
              <label>Responsável *</label>
              <input className="glass-input" type="text" name="responsavel" value={form.responsavel} onChange={handleChange} placeholder="Ex: Carlos Mendes" maxLength={60} required />
            </div>
            <div className="form-field">
              <label>E-mail *</label>
              <input className="glass-input" type="email" name="email" value={form.email} onChange={handleChange} autoCapitalize="none" placeholder="contato@empresa.com.br" maxLength={100} required />
            </div>
            <div className="form-field">
              <label>Telefone *</label>
              <IMaskInput className="glass-input" mask="(00) 00000-0000" value={form.telefone} onAccept={(v) => handleMaskedChange('telefone', v)} placeholder="(00) 00000-0000" required />
            </div>
          </>
        )}

        {etapa === 2 && (
          <>
            <div className="form-field">
              <label>CEP *</label>
              <IMaskInput className="glass-input" mask="00000-000" value={form.cep} onAccept={(v) => handleMaskedChange('cep', v)} placeholder="00000-000" onBlur={handleCepBlur} required />
            </div>
            <div className="form-field">
              <label>Número *</label>
              <IMaskInput className="glass-input" mask="00000" value={form.numero} onAccept={(v) => handleMaskedChange('numero', v)} placeholder="123" required />
            </div>
            <div className="form-field full">
              <label>Logradouro *</label>
              <input className="glass-input" type="text" name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Rua, Avenida..." maxLength={80} required />
            </div>
            <div className="form-field full">
              <label>Complemento</label>
              <input className="glass-input" type="text" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Sala, andar..." maxLength={40} />
            </div>
            <div className="form-field full">
              <label>Bairro *</label>
              <input className="glass-input" type="text" name="bairro" value={form.bairro} onChange={handleChange} maxLength={50} required />
            </div>
            <div className="form-field">
              <label>Cidade *</label>
              <input className="glass-input" type="text" name="cidade" value={form.cidade} onChange={handleChange} maxLength={50} required />
            </div>
            <div className="form-field">
              <label>UF *</label>
              <input className="glass-input" type="text" name="estado" value={form.estado} onChange={handleChange} placeholder="SP" maxLength={2} required />
            </div>
            <div className="form-field full">
              <label>Plano *</label>
              <div className="planos-opcoes">
                {planos.map((p) => (
                  <label key={p.id} className={`plano-chip glass-chip ${form.planoId === p.id ? 'active' : ''}`}>
                    <input type="radio" name="planoId" value={p.id} checked={form.planoId === p.id} onChange={handleChange} />
                    {p.nome}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-field full">
              <label>Senha *</label>
              <div className="input-with-icon">
                <input className="glass-input" type={showPassword ? 'text' : 'password'} name="senha" value={form.senha} onChange={handleChange} minLength={8} maxLength={50} required />
                <button type="button" className="toggle-password" onClick={() => setShowPassword((v) => !v)}><span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span></button>
              </div>
            </div>
            {erro && <p className="form-erro" style={{gridColumn: '1/-1'}}>{erro}</p>}
          </>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        {etapa === 1 && <button type="button" className="btn-gradient full" onClick={handleNextStep}>Continuar</button>}
        {etapa === 2 && <button type="submit" className="btn-gradient full" disabled={loading}>{loading ? 'Enviando...' : 'Criar minha empresa'}</button>}
      </div>
    </form>
  );
}