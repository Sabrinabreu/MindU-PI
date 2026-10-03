import React, { useState, useMemo } from 'react';

const PLANOS_OPCOES = ['Essencial', 'Pro', 'Corporativo', 'Ainda não sei'];

const INITIAL_FORM_STATE = {
  // Etapa 1: Dados da Empresa
  razaoSocial: '',
  nomeFantasia: '',
  inscricaoEstadual: '',
  cnpj: '',
  responsavel: '',

  // Etapa 2: Endereço e Contato
  cep: '',
  cidade: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  estado: '',
  email: '',
  telefone: '',
  plano: '',
  senha: '',
};

export function CadastroEmpresarial({ onBack }) {
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const camposEtapas = useMemo(() => ({
    1: ['razaoSocial', 'nomeFantasia', 'inscricaoEstadual', 'cnpj', 'responsavel'],
    2: ['cep', 'cidade', 'logradouro', 'numero', 'complemento', 'bairro', 'estado', 'email', 'telefone', 'plano', 'senha'],
  }), []);

  const totalCamposEtapaAtual = camposEtapas[etapa].length;
  const isSingleColumn = totalCamposEtapaAtual <= 6;
  const gridClass = isSingleColumn ? 'cols-1' : 'cols-2';

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

  const handleNextStep = (e) => {
    e.preventDefault();
    const formElement = e.target.closest('form');
    if (formElement.checkValidity()) {
      setEtapa(2);
    } else {
      formElement.reportValidity();
    }
  };

  const handleBackStep = () => {
    if (etapa === 2) {
      setEtapa(1);
    } else {
      onBack();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastro Empresarial Enviado:', form);
    // TODO: Integração com API
  };

  return (
    <form className={`cadastro-form glass-card ${gridClass}`} onSubmit={handleSubmit}>
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

      <div className={`form-grid ${gridClass}`}>
        {/* ================= ETAPA 1 ================= */}
        {etapa === 1 && (
          <>
            <div className="form-field">
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
                placeholder="Ex: 123.456.789.012"
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

            <button
              type="button"
              className="btn-gradient"
              onClick={handleNextStep}
            >
              Continuar
            </button>
          </>
        )}

        {/* ================= ETAPA 2 (cols 2) ================= */}
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
                      required
                    />
                    {planoNome}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-field full">
              <label htmlFor="senha">Senha *</label>
              <input
                id="senha"
                className="glass-input"
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                autoComplete="new-password"
                required
              />
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