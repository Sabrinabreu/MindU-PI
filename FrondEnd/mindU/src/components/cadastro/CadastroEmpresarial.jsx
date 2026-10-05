import React, { useState } from 'react';

const PLANOS_OPCOES = ['Essencial', 'Pro', 'Corporativo', 'Ainda não sei'];

const INITIAL_FORM_STATE = {
  // Etapa 1
  razaoSocial: '',
  nomeFantasia: '',
  inscricaoEstadual: '',
  cnpj: '',
  responsavel: '',
  email: '',
  telefone: '',
  // Etapa 2
  cep: '',
  cidade: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  estado: '',
  plano: '',
  senha: '',
};

const CAMPOS_POR_ETAPA = {
  1: ['razaoSocial', 'nomeFantasia', 'inscricaoEstadual', 'cnpj', 'responsavel'],
  2: ['cep', 'cidade', 'logradouro', 'numero', 'bairro', 'estado', 'email', 'telefone'],
};

export function CadastroEmpresarial({ onBack }) {
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepBlur = async (e) => {
    const cepLimpo = e.target.value.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    setBuscandoCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        alert('CEP não encontrado.');
        return;
      }

      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      }));
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    } finally {
      setBuscandoCep(false);
    }
  };

  // Valida apenas os campos da etapa atual
  const validarEtapa = () => {
    const campos = CAMPOS_POR_ETAPA[etapa];
    const invalidos = campos.filter((c) => {
      const value = form[c];
      if (c === 'inscricaoEstadual' || c === 'complemento') return false; // opcionais
      return !value || (typeof value === 'string' && !value.trim());
    });

    if (invalidos.length > 0) {
      // Foca no primeiro campo inválido
      const first = document.getElementById(invalidos[0]);
      first?.focus();
      first?.reportValidity?.();
      return false;
    }
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validarEtapa()) setEtapa(2);
  };

  const handleBackStep = () => {
    if (etapa === 2) setEtapa(1);
    else onBack();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.plano) {
      alert('Selecione um plano de interesse.');
      return;
    }
    console.log('Cadastro Empresarial Enviado:', form);
    // TODO: Integração com API
  };

  const totalEtapas = 2;

  return (
    <form className="cadastro-form glass-card" onSubmit={handleSubmit}>
      <button
        type="button"
        className="btn-voltar"
        onClick={handleBackStep}
        aria-label="Voltar para etapa anterior"
      >
        <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        Voltar
      </button>

      <h2>Cadastro Empresarial</h2>
      <p className="form-subtitle">
        {etapa === 1
          ? 'Informe os dados da empresa para iniciar.'
          : 'Preencha o endereço e dados de contato.'}
      </p>

      {/* Indicador de progresso */}
      <div className="step-indicator" aria-label={`Etapa ${etapa} de ${totalEtapas}`}>
        {Array.from({ length: totalEtapas }, (_, i) => (
          <span
            key={i}
            className={`step-dot ${etapa === i + 1 ? 'active' : ''} ${etapa > i + 1 ? 'done' : ''}`}
          />
        ))}
      </div>

      <div className="form-grid cols-2">
        {/* ================= ETAPA 1 ================= */}
        {etapa === 1 && (
          <>
            <div className="form-field full">
              <label htmlFor="razaoSocial">Razão social *</label>
              <input
                id="razaoSocial"
                className="glass-input"
                type="text"
                name="razaoSocial"
                value={form.razaoSocial}
                onChange={handleChange}
                placeholder="Ex: TechNova Soluções LTDA"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="nomeFantasia">Nome fantasia *</label>
              <input
                id="nomeFantasia"
                className="glass-input"
                type="text"
                name="nomeFantasia"
                value={form.nomeFantasia}
                onChange={handleChange}
                placeholder="Ex: TechNova"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="inscricaoEstadual">Inscrição estadual</label>
              <input
                id="inscricaoEstadual"
                className="glass-input"
                type="text"
                name="inscricaoEstadual"
                value={form.inscricaoEstadual}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>

            <div className="form-field">
              <label htmlFor="cnpj">CNPJ *</label>
              <input
                id="cnpj"
                className="glass-input"
                type="text"
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="responsavel">Responsável *</label>
              <input
                id="responsavel"
                className="glass-input"
                type="text"
                name="responsavel"
                value={form.responsavel}
                onChange={handleChange}
                placeholder="Ex: Carlos Mendes"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">E-mail *</label>
              <input
                id="email"
                className="glass-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contato@empresa.com.br"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="telefone">Telefone *</label>
              <input
                id="telefone"
                className="glass-input"
                type="tel"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(11) 4000-0000"
                autoComplete="tel"
                required
              />
            </div>

            <button
              type="button"
              className="btn-gradient full"
              onClick={handleNextStep}
            >
              Continuar
            </button>
          </>
        )}

        {/* ================= ETAPA 2 ================= */}
        {etapa === 2 && (
          <>
            <div className="form-field">
              <label htmlFor="cep">CEP *</label>
              <input
                id="cep"
                className="glass-input"
                type="text"
                name="cep"
                value={form.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength={9}
                autoComplete="postal-code"
                required
              />
              {buscandoCep && <small>Buscando endereço...</small>}
            </div>

            <div className="form-field">
              <label htmlFor="cidade">Cidade *</label>
              <input
                id="cidade"
                className="glass-input"
                type="text"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                autoComplete="address-level2"
                required
              />
            </div>

            <div className="form-field full">
              <label htmlFor="logradouro">Logradouro *</label>
              <input
                id="logradouro"
                className="glass-input"
                type="text"
                name="logradouro"
                value={form.logradouro}
                onChange={handleChange}
                placeholder="Rua, Avenida..."
                autoComplete="address-line1"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="numero">Número *</label>
              <input
                id="numero"
                className="glass-input"
                type="text"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="Ex: 123"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="complemento">Complemento</label>
              <input
                id="complemento"
                className="glass-input"
                type="text"
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
                placeholder="Sala, andar..."
                autoComplete="address-line2"
              />
            </div>

            <div className="form-field">
              <label htmlFor="bairro">Bairro *</label>
              <input
                id="bairro"
                className="glass-input"
                type="text"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="estado">Estado *</label>
              <input
                id="estado"
                className="glass-input"
                type="text"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="SP"
                maxLength={2}
                autoComplete="address-level1"
                required
              />
            </div>


            <div className="form-field full">
              <label>Plano de interesse *</label>
              <div className="planos-opcoes">
                {PLANOS_OPCOES.map((planoNome) => (
                  <label
                    key={planoNome}
                    className={`plano-chip glass-chip ${
                      form.plano === planoNome ? 'active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="plano"
                      value={planoNome}
                      checked={form.plano === planoNome}
                      onChange={handleChange}
                    />
                    {planoNome}
                  </label>
                ))}
              </div>
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

            <button type="submit" className="btn-gradient full">
              Solicitar proposta
            </button>
          </>
        )}
      </div>
    </form>
  );
}