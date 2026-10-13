import React, { useState } from 'react';
import { api } from '../../api';

const TIPOS = [
  { value: 'PSICOLOGO', label: 'Psicólogo(a)' },
  { value: 'PSIQUIATRA', label: 'Psiquiatra' },
  { value: 'TERAPEUTA', label: 'Terapeuta' },
];

const TAGS_SUGERIDAS = [
  'ansiedade', 'depressao', 'burnout', 'luto', 'relacionamentos',
  'infantil', 'adolescentes', 'TCC', 'psicanalise', 'casais',
];

export function PerfilProfissional({ dadosIniciais, modo, onDone, onCancel }) {
  const [form, setForm] = useState({
    tipo: dadosIniciais?.tipo || '',
    tags: dadosIniciais?.tags || [],
    fotoCarteirinha: null,
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!form.tipo) return setErro('Selecione o tipo de profissional.');
    if (form.tags.length === 0) return setErro('Selecione pelo menos uma especialidade.');

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('tipo', form.tipo);
      form.tags.forEach((t) => fd.append('tags', t));
      if (form.fotoCarteirinha) fd.append('fotoCarteirinha', form.fotoCarteirinha);

      await api(`/v1/profissionais/${dadosIniciais.id}/perfil`, {
        method: 'PATCH',
        body: fd,
        isFormData: true,
      });

      onDone?.();
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const titulo = modo === 'onboarding' ? 'Complete seu perfil' : 'Meu Perfil';
  const subtitulo =
    modo === 'onboarding'
      ? 'Esses dados aparecem para os beneficiários quando eles buscam um profissional.'
      : 'Atualize suas informações quando precisar.';
  const textoBotao = modo === 'onboarding' ? 'Finalizar cadastro' : 'Salvar alterações';

  return (
    <form className="perfil-form" onSubmit={handleSubmit}>
      <div className="perfil-form-header">
        <h2>{titulo}</h2>
        <p>{subtitulo}</p>
      </div>

      <div className="perfil-form-grid">
        <div className="perfil-field full">
          <label htmlFor="tipo">Tipo de profissional *</label>
          <select
            id="tipo"
            value={form.tipo}
            onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
            required
          >
            <option value="" disabled>Selecione</option>
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="perfil-field full">
          <label>Especialidades *</label>
          <div className="perfil-tags">
            {TAGS_SUGERIDAS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`perfil-tag ${form.tags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="perfil-field full">
          <label htmlFor="fotoCarteirinha">Foto da carteirinha (CRP/CRM) *</label>
          <label className="perfil-upload">
            <input
              id="fotoCarteirinha"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                setForm((p) => ({ ...p, fotoCarteirinha: e.target.files[0] }))
              }
            />
            <span className="material-symbols-outlined">cloud_upload</span>
            <span>
              {form.fotoCarteirinha
                ? form.fotoCarteirinha.name
                : dadosIniciais?.fotoCarteirinha
                  ? 'Clique para substituir a atual'
                  : 'Clique para enviar (JPG, PNG ou PDF)'}
            </span>
          </label>
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