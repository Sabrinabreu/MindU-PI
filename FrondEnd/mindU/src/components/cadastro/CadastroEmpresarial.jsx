import React, { useState } from 'react';

export function CadastroEmpresarial({ onBack }) {
  const [form, setForm] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    inscricaoEstadual: '',
    cnpj: '',
    responsavel: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    email: '',
    telefone: '',
    plano: '',
    senha: '',
  });

  const [buscandoCep, setBuscandoCep] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Busca endereço pelo CEP (ViaCEP)
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setBuscandoCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastro Empresarial:', form);
    // TODO: enviar para API
  };

  return (
    <form className="cadastro-form" onSubmit={handleSubmit}>
      <button type="button" className="btn-voltar" onClick={onBack}>
        <span className="material-symbols-outlined">arrow_back</span>
        Voltar
      </button>

      <h2>Cadastro Empresarial</h2>
      <p className="form-subtitle">
        Vamos montar uma proposta sob medida para o seu time.
      </p>

      <div className="form-grid">
        {/* ===== Dados da empresa ===== */}
        <div className="form-field full">
          <label>Razão social *</label>
          <input
            type="text"
            name="razaoSocial"
            value={form.razaoSocial}
            onChange={handleChange}
            placeholder="Ex: TechNova Soluções LTDA"
            required
          />
        </div>

        <div className="form-field">
          <label>Nome fantasia *</label>
          <input
            type="text"
            name="nomeFantasia"
            value={form.nomeFantasia}
            onChange={handleChange}
            placeholder="Ex: TechNova"
            required
          />
        </div>

        <div className="form-field">
          <label>Inscrição estadual</label>
          <input
            type="text"
            name="inscricaoEstadual"
            value={form.inscricaoEstadual}
            onChange={handleChange}
            placeholder="Ex: 123.456.789.012"
          />
        </div>

        <div className="form-field">
          <label>CNPJ *</label>
          <input
            type="text"
            name="cnpj"
            value={form.cnpj}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
            required
          />
        </div>

        <div className="form-field">
          <label>Responsável *</label>
          <input
            type="text"
            name="responsavel"
            value={form.responsavel}
            onChange={handleChange}
            placeholder="Ex: Carlos Mendes"
            required
          />
        </div>

        {/* ===== Endereço ===== */}
        <div className="form-field">
          <label>CEP *</label>
          <input
            type="text"
            name="cep"
            value={form.cep}
            onChange={handleChange}
            onBlur={handleCepBlur}
            placeholder="00000-000"
            maxLength={9}
            required
          />
          {buscandoCep && <small>Buscando endereço...</small>}
        </div>

        <div className="form-field">
          <label>Cidade *</label>
          <input
            type="text"
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field full">
          <label>Logradouro *</label>
          <input
            type="text"
            name="logradouro"
            value={form.logradouro}
            onChange={handleChange}
            placeholder="Rua, Avenida..."
            required
          />
        </div>

        <div className="form-field">
          <label>Número *</label>
          <input
            type="text"
            name="numero"
            value={form.numero}
            onChange={handleChange}
            placeholder="Ex: 123"
            required
          />
        </div>

        <div className="form-field">
          <label>Complemento</label>
          <input
            type="text"
            name="complemento"
            value={form.complemento}
            onChange={handleChange}
            placeholder="Sala, andar..."
          />
        </div>

        <div className="form-field">
          <label>Bairro *</label>
          <input
            type="text"
            name="bairro"
            value={form.bairro}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Estado *</label>
          <input
            type="text"
            name="estado"
            value={form.estado}
            onChange={handleChange}
            placeholder="SP"
            maxLength={2}
            required
          />
        </div>

        {/* ===== Contato ===== */}
        <div className="form-field">
          <label>E-mail *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="contato@empresa.com.br"
            required
          />
        </div>

        <div className="form-field">
          <label>Telefone *</label>
          <input
            type="tel"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="(11) 4000-0000"
            required
          />
        </div>

        {/* ===== Plano ===== */}
        <div className="form-field full">
          <label>Plano de interesse *</label>
          <div className="planos-opcoes">
            {['Essencial', 'Pro', 'Corporativo', 'Ainda não sei'].map((p) => (
              <label
                key={p}
                className={`plano-chip ${form.plano === p ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="plano"
                  value={p}
                  checked={form.plano === p}
                  onChange={handleChange}
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        {/* ===== Senha ===== */}
        <div className="form-field full">
          <label>Senha de acesso *</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn-submit">
        Solicitar proposta
      </button>
    </form>
  );
}