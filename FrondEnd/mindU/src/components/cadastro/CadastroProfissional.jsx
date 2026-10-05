import React, { useState } from 'react';

const INITIAL_FORM_STATE = {
  nome: '',
  email: '',
  dataNascimento: '',
  sexo: '',
  telefone: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  senha: '',
};

const CAMPOS_OBRIGATORIOS = [
  'nome', 'email', 'dataNascimento', 'sexo', 'telefone', 'senha',
];

export function CadastroProfissional({ onBack }) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [preencherEndereco, setPreencherEndereco] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastro Profissional:', form);
    // TODO: Integração com API
  };

  return (
    <form className="cadastro-form glass-card" onSubmit={handleSubmit}>
      <button
        type="button"
        className="btn-voltar"
        onClick={onBack}
        aria-label="Voltar para a página anterior"
      >
        <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        Voltar
      </button>

      <h2>Cadastro de Psicólogo</h2>
      <p className="form-subtitle">
        Junte-se ao time de especialistas que transformam a saúde mental no trabalho.
      </p>

      <div className="form-grid  cols-2">
        <div className="form-field full">
          <label htmlFor="nome">Nome completo *</label>
          <input
            id="nome"
            className="glass-input"
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: Dra. Camila Ribeiro"
            autoComplete="name"
            required
          />
        </div>

        <div className="form-field full">
          <label htmlFor="email">E-mail profissional *</label>
          <input
            id="email"
            className="glass-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="voce@email.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="dataNascimento">Data de nascimento *</label>
          <input
            id="dataNascimento"
            className="glass-input"
            type="date"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="sexo">Sexo *</label>
          <select
            id="sexo"
            className="glass-input"
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecione</option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="outro">Outro</option>
            <option value="prefiro-nao-informar">Prefiro não informar</option>
          </select>
        </div>

        <div className="form-field full">
          <label htmlFor="telefone">Telefone *</label>
          <input
            id="telefone"
            className="glass-input"
            type="tel"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="(11) 90000-0000"
            autoComplete="tel"
            required
          />
        </div>

        {/* ===== Endereço opcional ===== */}
        <div className="form-field full">
          <label className="switch-endereco">
            <input
              type="checkbox"
              checked={preencherEndereco}
              onChange={(e) => setPreencherEndereco(e.target.checked)}
            />
            <span>Vou atender presencialmente (preencher endereço)</span>
          </label>
          <small>Se você atende apenas online, pode pular esta parte.</small>
        </div>

        {preencherEndereco && (
          <>
            <div className="form-field">
              <label htmlFor="cep">CEP</label>
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
              />
              {buscandoCep && <small>Buscando endereço...</small>}
            </div>

            <div className="form-field">
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                className="glass-input"
                type="text"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                autoComplete="address-level2"
              />
            </div>

            <div className="form-field full">
              <label htmlFor="logradouro">Logradouro</label>
              <input
                id="logradouro"
                className="glass-input"
                type="text"
                name="logradouro"
                value={form.logradouro}
                onChange={handleChange}
                placeholder="Rua, Avenida..."
                autoComplete="address-line1"
              />
            </div>

            <div className="form-field">
              <label htmlFor="numero">Número</label>
              <input
                id="numero"
                className="glass-input"
                type="text"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="Ex: 123"
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
              <label htmlFor="bairro">Bairro</label>
              <input
                id="bairro"
                className="glass-input"
                type="text"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="estado">Estado</label>
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
              />
            </div>
          </>
        )}

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
      </div>

      <button type="submit" className="btn-gradient">
        Enviar cadastro para análise
      </button>

      <p className="form-note">
        Após o envio, nossa equipe fará a verificação dos dados em até 3 dias úteis.
      </p>
    </form>
  );
}