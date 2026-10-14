import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuario } from '../api';
import '../css/perfil.css';

const INITIAL = {
  // GERAL
  nome: '',
  email: '',
  telefone: '',
  foto: '',
  banner: '',


  // Pessoa física
  dataNascimento: '',
  sexo: '',


  // Profissional
  tipo: '',          // PSICOLOGO | PSIQUIATRA | TERAPEUTA
  tags: [],
  fotoCarteirinha: null,


  // Empresa
  razaoSocial: '',
  nomeFantasia: '',
  inscricaoEstadual: '',
  cnpj: '',
  responsavel: '',
  plano: '',


  // Cliente
  empresa: '',
  matricula: '',
  cns: '',
  nomeMae: '',


  // Endereço (todos)
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
};

/* perfis prontos, retirar depois */
const MOCK = {
  PROFISSIONAL: {
    nome: 'Roberto Rocha',
    email: 'roberto@mindu.com.br',
    telefone: '(11) 98765-4321',
    dataNascimento: '1985-05-12',
    sexo: 'MASCULINO',
    tipo: 'PSICOLOGO',
    registro: 'CRP 06/123456',
    modalidade: 'AMBOS',
    bio: 'Psicólogo clínico com 10 anos de experiência em terapia cognitivo-comportamental. Especializado em ansiedade, burnout e desenvolvimento de carreira.',
    tags: ['ansiedade', 'burnout', 'carreira'],
    foto: 'https://i.pravatar.cc/300?img=13',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1400&q=80',
    cep: '09510-100',
    logradouro: 'Av. Goiás',
    numero: '1200',
    bairro: 'Centro',
    cidade: 'São Caetano do Sul',
    estado: 'SP',
  },
  EMPRESA: {
    nome: 'Carlos Mendes',
    email: 'contato@technova.com.br',
    telefone: '(11) 4000-1234',
    razaoSocial: 'TechNova Soluções LTDA',
    nomeFantasia: 'TechNova',
    inscricaoEstadual: '123.456.789.012',
    cnpj: '00.000.000/0001-91',
    responsavel: 'Carlos Mendes',
    plano: 'Pro',
    foto: 'https://i.pravatar.cc/300?img=52',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1400&q=80',
    cep: '09510-100',
    logradouro: 'Av. Goiás',
    numero: '1200',
    complemento: 'Sala 302',
    bairro: 'Centro',
    cidade: 'São Caetano do Sul',
    estado: 'SP',
  },
  BENEFICIARIO: {
    nome: 'Maria Silva',
    email: 'maria.silva@technova.com.br',
    telefone: '(11) 91234-5678',
    empresa: 'TechNova',
    matricula: 'A1B2C3',
    cns: '898 0012 3456 7890',
    dataNascimento: '1995-03-20',
    nomeMae: 'Ana Silva',
    sexo: 'FEMININO',
    foto: 'https://i.pravatar.cc/300?img=45',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1400&q=80',
  },
};

const TAGS_SUGERIDAS = [
  'ansiedade', 'depressao', 'burnout', 'luto', 'relacionamentos',
  'infantil', 'adolescentes', 'borderline', 'psicanalise', 'casais',
  'autismo',
];

const TIPOS_PROFISSIONAL = [
  { value: 'PSICOLOGO', label: 'Psicólogo(a)' },
  { value: 'PSIQUIATRA', label: 'Psiquiatra' },
  { value: 'TERAPEUTA', label: 'Terapeuta' },
];

const MODALIDADES = [
  { value: 'ONLINE', label: 'Online' },
  { value: 'PRESENCIAL', label: 'Presencial' },
  { value: 'AMBOS', label: 'Ambos' },
];

export function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUsuario();
    if (!u) { navigate('/login'); return; }
    setUsuario(u);
    setForm({ ...INITIAL, ...(MOCK[u.tipo] || {}) });
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setForm((p) => ({ ...p, [name]: URL.createObjectURL(files[0]) }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) return;
      setForm((p) => ({
        ...p,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      }));
    } catch (err) { console.error(err); }
  };

  const toggleArrayItem = (campo, valor) => {
    setForm((p) => ({
      ...p,
      [campo]: p[campo].includes(valor)
        ? p[campo].filter((v) => v !== valor)
        : [...p[campo], valor],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.novaSenha && form.novaSenha !== form.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }
    console.log('Salvar perfil:', { tipo: usuario.tipo, form });
  };

  if (loading || !usuario) {
    return (
      <div className="perfil-page">
        <div className="loading">
          <span className="material-symbols-outlined girando">progress_activity</span>
          <p>Carregando…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <form className="perfil-card" onSubmit={handleSubmit}>
        {/* ============ CAPA ============ */}
        <div className="perfil-capa">
          <div
            className="perfil-capa-banner"
            style={{ backgroundImage: `url(${form.banner})` }}
          >
            <div className="perfil-capa-pattern" />
            <label className="perfil-edit-btn" title="Alterar capa">
              <span className="material-symbols-outlined">edit</span>
              <input type="file" accept="image/*" name="banner" onChange={handleChange} hidden />
            </label>
          </div>
          </div>

          

          <div className="perfil-capa-info">
            <div className="perfil-capa-avatar">
              <img src={form.foto} alt={form.nome} />
              {usuario.tipo === 'PROFISSIONAL' && (
                <span className="perfil-verificado" title="Profissional verificado">
                  <span className="material-symbols-outlined">verified</span>
                </span>
              )}
              <label className="perfil-edit-avatar-btn" title="Alterar foto">
                <span className="material-symbols-outlined">photo_camera</span>
                <input type="file" accept="image/*" name="foto" onChange={handleChange} hidden />
              </label>
            </div>
            <div className="perfil-capa-texto">
              <h1>{form.nome || 'Sem nome'}</h1>
              <p className="perfil-legenda">{legendaTipo(usuario.tipo, form)}</p>
            </div>
        </div>


        <div className="perfil-body">
          {usuario.tipo === 'PROFISSIONAL' && (
            <PerfilProfissional
              form={form}
              onChange={handleChange}
              onCepBlur={handleCepBlur}
              toggle={toggleArrayItem}
            />
          )}
          {usuario.tipo === 'EMPRESA' && (
            <PerfilEmpresa form={form} onChange={handleChange} onCepBlur={handleCepBlur} />
          )}
          {usuario.tipo === 'BENEFICIARIO' && (
            <PerfilCliente form={form} onChange={handleChange} />
          )}

          {/* Segurança (todos) */}
          <Secao
            icon="lock"
            iconColor="icon-amarelo"
            titulo="Segurança"
            subtitulo="Alterar senha de acesso"
          >
            <Campo
              label="Senha atual"
              name="senhaAtual"
              type="password"
              value={form.senhaAtual}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <Campo
              label="Nova senha"
              name="novaSenha"
              type="password"
              value={form.novaSenha}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              minLength={8}
            />
            <Campo
              label="Confirmar nova senha"
              name="confirmarSenha"
              type="password"
              value={form.confirmarSenha}
              onChange={handleChange}
              placeholder="Repita a nova senha"
              full
            />
          </Secao>
        </div>

        {/* ============ AÇÕES ============ */}
        <div className="perfil-actions">
          <button type="button" className="btn-cancelar" onClick={() => navigate('/')}>
            Cancelar
          </button>
          <button type="submit" className="btn-salvar btn-gradient">
            <span className="material-symbols-outlined">save</span>
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}

/* Perfis por tipo */

function PerfilProfissional({ form, onChange, onCepBlur, toggle }) {
  return (
    <>
      <Secao icon="person" iconColor="icon-roxo" titulo="Dados pessoais">
        <Campo label="Nome completo *" name="nome" value={form.nome} onChange={onChange} />
        <Campo label="E-mail *" name="email" type="email" value={form.email} onChange={onChange} />
        <Campo label="Data de nascimento *" name="dataNascimento" type="date" value={form.dataNascimento} onChange={onChange} />
        <SelectCampo label="Sexo *" name="sexo" value={form.sexo} onChange={onChange}
          options={[['FEMININO', 'Feminino'], ['MASCULINO', 'Masculino'], ['OUTRO', 'Outro'], ['PREFIRO_NAO_INFORMAR', 'Prefiro não informar']]} />
        <Campo label="Telefone *" name="telefone" value={form.telefone} onChange={onChange} />
        <SelectCampo label="Tipo de profissional *" name="tipo" value={form.tipo} onChange={onChange}
          options={TIPOS_PROFISSIONAL.map((t) => [t.value, t.label])} />
        <Campo label="Registro profissional (CRP/CRM) *" name="registro" value={form.registro} onChange={onChange} placeholder="Ex: CRP 06/123456" />
      </Secao>

      <Secao
        icon="psychology"
        iconColor="icon-azul"
        titulo="Sobre você"
        subtitulo={`${form.bio.length}/300 caracteres`}
      >
        <div className="perfil-field full">
          <label htmlFor="bio">Apresentação</label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={onChange}
            maxLength={300}
            rows={4}
            placeholder="Fale brevemente sobre sua formação, experiência e abordagem terapêutica."
          />
        </div>
      </Secao>

      <Secao
        icon="sell"
        iconColor="icon-rosa"
        titulo="Especialidades"
        subtitulo="Clique para marcar/desmarcar"
      >
        <div className="perfil-tags full">
          {TAGS_SUGERIDAS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`perfil-tag ${form.tags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggle('tags', tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </Secao>

      <Secao
        icon="devices"
        iconColor="icon-verde"
        titulo="Modalidade de atendimento"
        subtitulo="Como você atende seus pacientes"
      >
        <div className="perfil-tags full">
          {MODALIDADES.map((m) => (
            <button
              key={m.value}
              type="button"
              className={`perfil-tag ${form.modalidade === m.value ? 'active' : ''}`}
              onClick={() => onChange({ target: { name: 'modalidade', value: m.value } })}
            >
              {m.label}
            </button>
          ))}
        </div>
      </Secao>

      <Secao
        icon="location_on"
        iconColor="icon-laranja"
        titulo="Endereço de atendimento"
        subtitulo="Opcional se você atende apenas online"
      >
        <EnderecoFields form={form} onChange={onChange} onCepBlur={onCepBlur} />
      </Secao>

      <Secao
        icon="badge"
        iconColor="icon-roxo"
        titulo="Documento profissional"
        subtitulo="Verificação de CRP/CRM"
      >
        <div className="perfil-field full">
          <label className="perfil-upload">
            <input type="file" name="fotoCarteirinha" accept="image/*,.pdf" onChange={onChange} />
            <span className="material-symbols-outlined">cloud_upload</span>
            <span>
              {form.fotoCarteirinha?.name || 'Clique para enviar (JPG, PNG ou PDF)'}
            </span>
          </label>
        </div>
      </Secao>
    </>
  );
}

function PerfilEmpresa({ form, onChange, onCepBlur }) {
  return (
    <>
      <Secao icon="apartment" iconColor="icon-roxo" titulo="Dados da empresa">
        <Campo label="Razão social *" name="razaoSocial" value={form.razaoSocial} onChange={onChange} full />
        <Campo label="Nome fantasia *" name="nomeFantasia" value={form.nomeFantasia} onChange={onChange} />
        <Campo label="Inscrição estadual" name="inscricaoEstadual" value={form.inscricaoEstadual} onChange={onChange} />
        <Campo label="CNPJ *" name="cnpj" value={form.cnpj} onChange={onChange} />
        <Campo label="Responsável *" name="responsavel" value={form.responsavel} onChange={onChange} />
        <Campo label="E-mail *" name="email" type="email" value={form.email} onChange={onChange} />
        <Campo label="Telefone *" name="telefone" value={form.telefone} onChange={onChange} />
        <Campo label="Plano atual" name="plano" value={form.plano} onChange={onChange} readOnly />
      </Secao>

      <Secao icon="location_on" iconColor="icon-laranja" titulo="Endereço da sede">
        <EnderecoFields form={form} onChange={onChange} onCepBlur={onCepBlur} />
      </Secao>
    </>
  );
}

function PerfilCliente({ form, onChange }) {
  const verificado = Boolean(form.cns);
  return (
    <>
      <Secao icon="person" iconColor="icon-roxo" titulo="Dados de vínculo" subtitulo="Fornecidos pela sua empresa">
        <Campo label="Nome completo" name="nome" value={form.nome} onChange={onChange} readOnly />
        <Campo label="E-mail" name="email" value={form.email} onChange={onChange} readOnly />
        <Campo label="Empresa" name="empresa" value={form.empresa} onChange={onChange} readOnly />
        <Campo label="Matrícula" name="matricula" value={form.matricula} onChange={onChange} readOnly />
      </Secao>

      <Secao
        icon={verificado ? 'verified_user' : 'pending'}
        iconColor={verificado ? 'icon-verde' : 'icon-amarelo'}
        titulo="Informações de saúde"
        subtitulo={verificado ? 'Dados verificados' : 'Aguardando verificação'}
      >
        <Campo label="CNS (Cartão Nacional de Saúde)" name="cns" value={form.cns} onChange={onChange} placeholder="000 0000 0000 0000" full />
        <Campo label="Data de nascimento" name="dataNascimento" type="date" value={form.dataNascimento} onChange={onChange} />
        <SelectCampo label="Sexo" name="sexo" value={form.sexo} onChange={onChange}
          options={[['FEMININO', 'Feminino'], ['MASCULINO', 'Masculino'], ['OUTRO', 'Outro'], ['PREFIRO_NAO_INFORMAR', 'Prefiro não informar']]} />
        <Campo label="Nome completo da mãe" name="nomeMae" value={form.nomeMae} onChange={onChange} full />
      </Secao>
    </>
  );
}



/* Componentes reutilizáveis */

function Secao({ icon, iconColor = 'icon-roxo', titulo, subtitulo, children }) {
  return (
    <div className="perfil-secao">
      <div className="perfil-secao-head">
        <div className={`perfil-secao-icon ${iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="perfil-secao-title">
          <h3>{titulo}</h3>
          {subtitulo && <p>{subtitulo}</p>}
        </div>
        <button type="button" className="perfil-secao-edit" aria-label="Editar seção">
          <span className="material-symbols-outlined">edit</span>
        </button>
      </div>
      <div className="perfil-grid">{children}</div>
    </div>
  );
}

function Campo({ label, name, value, onChange, type = 'text', full, readOnly, placeholder, minLength }) {
  return (
    <div className={`perfil-field ${full ? 'full' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        minLength={minLength}
      />
    </div>
  );
}

function SelectCampo({ label, name, value, onChange, options }) {
  return (
    <div className="perfil-field">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} value={value || ''} onChange={onChange}>
        <option value="" disabled>Selecione</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </div>
  );
}

function EnderecoFields({ form, onChange, onCepBlur }) {
  return (
    <>
      <Campo label="CEP" name="cep" value={form.cep} onChange={onChange} onBlur={onCepBlur} placeholder="00000-000" />
      <Campo label="Cidade" name="cidade" value={form.cidade} onChange={onChange} />
      <Campo label="Logradouro" name="logradouro" value={form.logradouro} onChange={onChange} full />
      <Campo label="Número" name="numero" value={form.numero} onChange={onChange} />
      <Campo label="Complemento" name="complemento" value={form.complemento} onChange={onChange} />
      <Campo label="Bairro" name="bairro" value={form.bairro} onChange={onChange} />
      <Campo label="UF" name="estado" value={form.estado} onChange={onChange} placeholder="SP" />
    </>
  );
}

function legendaTipo(tipo, form) {
  if (tipo === 'PROFISSIONAL') {
    return {
      PSICOLOGO: 'Psicólogo(a)',
      PSIQUIATRA: 'Psiquiatra',
      TERAPEUTA: 'Terapeuta',
    }[form.tipo] || 'Profissional';
  }
  if (tipo === 'EMPRESA') return form.nomeFantasia || 'Empresa';
  if (tipo === 'BENEFICIARIO') return form.empresa || 'Beneficiário';
  return '';
}
