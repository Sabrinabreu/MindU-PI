import React, { useState } from 'react';

export function CadastroProfissional({ onBack }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    dataNascimento: '',
    sexo: '',
    telefone: '',
    // Endereço (opcional — pode atender só online)
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    senha: '',
  });

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [preencherEndereco, setPreencherEndereco] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
    console.log('Cadastro Profissional:', form);
    // TODO: enviar para API
  };

  return (
    <form className="cadastro-form" onSubmit={handleSubmit}>
      <button type="button" className="btn-voltar" onClick={onBack}>
        <span className="material-symbols-outlined">arrow_back</span>
        Voltar
      </button>

      <h2>Cadastro de Psicólogo</h2>
      <p className="form-subtitle">
        Junte-se ao time de especialistas que transformam a saúde mental no trabalho.
      </p>

      <div className="form-grid">
        <div className="form-field full">
          <label>Nome completo *</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: Dra. Camila Ribeiro"
            required
          />
        </div>

        <div className="form-field full">
          <label>E-mail profissional *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="voce@email.com"
            required
          />
        </div>

        <div className="form-field">
          <label>Data de nascimento *</label>
          <input
            type="date"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Sexo *</label>
          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="outro">Outro</option>
            <option value="prefiro-nao-informar">Prefiro não informar</option>
          </select>
        </div>

        <div className="form-field full">
          <label>Telefone *</label>
          <input
            type="tel"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="(11) 90000-0000"
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
          <small>
            Se você atende apenas online, pode pular esta parte.
          </small>
        </div>

        {preencherEndereco && (
          <>
            <div className="form-field">
              <label>CEP</label>
              <input
                type="text"
                name="cep"
                value={form.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength={9}
              />
              {buscandoCep && <small>Buscando endereço...</small>}
            </div>

            <div className="form-field">
              <label>Cidade</label>
              <input
                type="text"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
              />
            </div>

            <div className="form-field full">
              <label>Logradouro</label>
              <input
                type="text"
                name="logradouro"
                value={form.logradouro}
                onChange={handleChange}
                placeholder="Rua, Avenida..."
              />
            </div>

            <div className="form-field">
              <label>Número</label>
              <input
                type="text"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="Ex: 123"
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
              <label>Bairro</label>
              <input
                type="text"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Estado</label>
              <input
                type="text"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </>
        )}

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
        Enviar cadastro para análise
      </button>

      <p className="form-note">
        Após o envio, nossa equipe fará a verificação dos dados em até 3 dias úteis.
      </p>
    </form>
  );
}