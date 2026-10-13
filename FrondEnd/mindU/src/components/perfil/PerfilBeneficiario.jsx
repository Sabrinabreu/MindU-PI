import React, { useState } from 'react';
import { api } from '../../api';

export function PerfilBeneficiario({ dadosIniciais, modo, onDone, onCancel }) {
  const [form, setForm] = useState({
    cns: dadosIniciais?.cns || '',
    dataNascimento: dadosIniciais?.dataNascimento || '',
    nomeMae: dadosIniciais?.nomeMae || '',
    genero: dadosIniciais?.genero || '',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await api(`/v1/clientes/${dadosIniciais.id}/dados-sensiveis`, {
        method: 'PATCH',
        body: form,
      });
      onDone?.();
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const titulo = modo === 'onboarding' ? 'Complete seus dados' : 'Meu Perfil';
  const subtitulo =
    modo === 'onboarding'
      ? 'Essas informações são sigilosas e ajudam nossos profissionais a te atender melhor.'
      : 'Mantenha seus dados atualizados.';
  const textoBotao = modo === 'onboarding' ? 'Finalizar cadastro' : 'Salvar alterações';

  return (
    <form className="perfil-form" onSubmit={handleSubmit}>
      <div className="perfil-form-header">
        <h2>{titulo}</h2>
        <p>{subtitulo}</p>
      </div>

      <div className="perfil-form-grid cols-1">
        <div className="perfil-field full">
          <label htmlFor="cns">CNS (Cartão Nacional de Saúde) *</label>
          <input
            id="cns"
            type="text"
            name="cns"
            value={form.cns}
            onChange={handleChange}
            placeholder="000 0000 0000 0000"
            maxLength={15}
            required
          />
        </div>

        <div className="perfil-field">
          <label htmlFor="dataNascimento">Data de nascimento *</label>
          <input
            id="dataNascimento"
            type="date"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="perfil-field">
          <label htmlFor="genero">Gênero *</label>
          <select
            id="genero"
            name="genero"
            value={form.genero}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecione</option>
            <option value="FEMININO">Feminino</option>
            <option value="MASCULINO">Masculino</option>
            <option value="OUTRO">Outro</option>
            <option value="PREFIRO_NAO_INFORMAR">Prefiro não informar</option>
          </select>
        </div>

        <div className="perfil-field full">
          <label htmlFor="nomeMae">Nome completo da mãe *</label>
          <input
            id="nomeMae"
            type="text"
            name="nomeMae"
            value={form.nomeMae}
            onChange={handleChange}
            placeholder="Ex: Ana Silva"
            required
          />
        </div>
      </div>

      {erro && <p className="perfil-erro">{erro}</p>}

      <div className="perfil-actions">
        <button
          type="button"
          className="perfil-btn-cancelar"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button type="submit" className="perfil-btn-salvar" disabled={loading}>
          {loading ? 'Salvando...' : textoBotao}
        </button>
      </div>
    </form>
  );
}