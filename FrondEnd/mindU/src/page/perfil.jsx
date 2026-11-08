import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuario, getIniciais, api } from '../api';
import '../css/perfil.css';

const INITIAL = {
  nome: '', email: '', telefone: '', foto: '', banner: '',
  dataNascimento: '', sexo: '', tipo: '', tags: [], bio: '', modalidade: '',
  fotoCarteirinha: null, razaoSocial: '', nomeFantasia: '', inscricaoEstadual: '',
  cnpj: '', responsavel: '', plano: '', empresa: '', matricula: '', cns: '', nomeMae: '',
  cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  senhaAtual: '', novaSenha: '', confirmarSenha: '',
  status: '', 
  locais: [], 
  disponibilidade: [] 
};

const TAGS_SUGERIDAS = ['ansiedade', 'depressao', 'burnout', 'luto', 'relacionamentos', 'infantil', 'adolescentes', 'borderline', 'psicanalise', 'casais', 'autismo'];
const TIPOS_PROFISSIONAL = [{ value: 'PSICOLOGO', label: 'Psicólogo(a)' }, { value: 'PSIQUIATRA', label: 'Psiquiatra' }, { value: 'TERAPEUTA', label: 'Terapeuta' }];
const DIAS_SEMANA = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];

export function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Estados temporários para adicionar Local e Disponibilidade (Profissional)
  const [novoLocal, setNovoLocal] = useState({ modalidade: 'VIRTUAL' });
  const [novaDispo, setNovaDispo] = useState({ diaSemana: 'SEGUNDA', horaInicio: '08:00', horaFim: '12:00' });

  useEffect(() => {
    const u = getUsuario();
    if (!u) { navigate('/login'); return; }
    setUsuario(u);

    const isBloqueado = localStorage.getItem('mindu_perfil_incompleto') === 'true';
    setIsOnboarding(isBloqueado);

    const fetchPerfil = async () => {
      try {
        let endpoint = '/v1/clientes/me';
        if (u.tipo === 'EMPRESA') endpoint = '/v1/empresas/me';
        if (u.tipo === 'PROFISSIONAL') endpoint = '/v1/profissionais/conta/perfil';

        const dados = await api(endpoint);
        
        setForm({
          ...INITIAL,
          ...dados,
          nome: dados.nome || dados.nomeFantasia || dados.razaoSocial,
          cns: dados.cns || '', 
          dataNascimento: dados.dataNascimento || '',
          nomeMae: dados.nomeMae || '', 
          sexo: dados.genero || dados.sexo || '',
          status: dados.status || '',
          locais: dados.locaisAtendimento || [],
          disponibilidade: dados.disponibilidades || []
        });
      } catch (err) {
        console.error('Erro ao buscar perfil', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleArrayItem = (campo, valor) => {
    setForm((p) => ({ ...p, [campo]: p[campo].includes(valor) ? p[campo].filter((v) => v !== valor) : [...p[campo], valor] }));
  };

  // --- FUNÇÕES DO PROFISSIONAL ---
  const handleAddLocal = () => {
    if (novoLocal.modalidade === 'PRESENCIAL' && (!novoLocal.cep || !novoLocal.cidade)) {
      return alert('Para atendimento presencial, preencha o CEP e a Cidade.');
    }
    setForm(p => ({ ...p, locais: [...p.locais, novoLocal] }));
    setNovoLocal({ modalidade: 'VIRTUAL' });
  };

  const handleAddDispo = () => {
    setForm(p => ({ ...p, disponibilidade: [...p.disponibilidade, novaDispo] }));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    
    try {
      if (form.novaSenha) {
        if (form.novaSenha !== form.confirmarSenha) throw new Error('As senhas não coincidem.');
        await api('/v1/auth/senha', { method: 'PUT', body: { senhaAtual: form.senhaAtual, novaSenha: form.novaSenha } });
      }

      if (usuario.tipo === 'BENEFICIARIO') {
        await api('/v1/clientes/me', {
          method: 'PATCH',
          body: { nome: form.nome, email: form.email, telefone: form.telefone, cep: form.cep, logradouro: form.logradouro, numero: form.numero, bairro: form.bairro, cidade: form.cidade, estado: form.estado }
        });
        
        if (form.status === 'APROVADO' && form.cns) {
           await api('/v1/clientes/me/dados-sensiveis', {
             method: 'PATCH',
             body: { cns: form.cns, dataNascimento: form.dataNascimento, nomeMae: form.nomeMae, genero: form.sexo }
           });
        }
      } 
      else if (usuario.tipo === 'PROFISSIONAL') {
        await api(`/v1/profissionais/${usuario.id}`, {
          method: 'PATCH',
          body: { nome: form.nome, email: form.email, telefone: form.telefone, bio: form.bio, tipo: form.tipo, tags: form.tags }
        });

        for (const local of form.locais) {
          if (!local.id) { 
             await api(`/v1/profissionais/${usuario.id}/locais`, { method: 'POST', body: local });
          }
        }

        if (form.disponibilidade.length > 0) {
           await api(`/v1/profissionais/${usuario.id}/disponibilidade`, { method: 'PUT', body: form.disponibilidade });
        }
      }

      localStorage.removeItem('mindu_perfil_incompleto');
      alert('Perfil atualizado com sucesso!');
      
      if (isOnboarding) {
        navigate('/agenda'); 
      }
      
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSalvando(false);
    }
  };

  if (loading || !usuario) {
    return <div className="perfil-page"><div className="loading"><span className="material-symbols-outlined girando">progress_activity</span><p>Carregando…</p></div></div>;
  }

  return (
    <div className="perfil-page">
      <form className="perfil-card" onSubmit={handleSubmit}>
        
        {isOnboarding && (
          <div style={{ background: '#fef08a', color: '#854d0e', padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
            ⚠️ Complete seu perfil para liberar o acesso total à plataforma!
          </div>
        )}

        <div className="perfil-capa">
          <div className="perfil-capa-banner" style={{ backgroundImage: `url(${form.banner})` }}><div className="perfil-capa-pattern" /></div>
        </div>

        <div className="perfil-capa-info">
          <div className="perfil-capa-avatar">
            {form.foto ? <img src={form.foto} alt={form.nome} /> : <div className="avatar-text-grande">{getIniciais(form.nome)}</div>}
          </div>
          <div className="perfil-capa-texto">
            <h1>{form.nome || 'Sem nome'}</h1>
            <p className="perfil-legenda">{legendaTipo(usuario.tipo, form)}</p>
          </div>
        </div>

        <div className="perfil-body">
          {usuario.tipo === 'PROFISSIONAL' && (
             <PerfilProfissional 
               form={form} onChange={handleChange} toggle={toggleArrayItem} 
               novoLocal={novoLocal} setNovoLocal={setNovoLocal} handleAddLocal={handleAddLocal}
               novaDispo={novaDispo} setNovaDispo={setNovaDispo} handleAddDispo={handleAddDispo}
             />
          )}
          {usuario.tipo === 'EMPRESA' && <PerfilEmpresa form={form} onChange={handleChange} />}
          
          {usuario.tipo === 'BENEFICIARIO' && <PerfilCliente form={form} onChange={handleChange} />}

          <Secao icon="lock" iconColor="icon-amarelo" titulo="Segurança" subtitulo="Alterar senha (opcional agora)">
            <Campo label="Senha atual" name="senhaAtual" type="password" value={form.senhaAtual} onChange={handleChange} />
            <Campo label="Nova senha" name="novaSenha" type="password" value={form.novaSenha} onChange={handleChange} />
            <Campo label="Confirmar nova senha" name="confirmarSenha" type="password" value={form.confirmarSenha} onChange={handleChange} full />
          </Secao>
        </div>

        <div className="perfil-actions">
          <button type="button" className="btn-cancelar" onClick={() => navigate('/')}>Cancelar</button>
          <button type="submit" className="btn-salvar btn-gradient" disabled={salvando}>
            <span className="material-symbols-outlined">save</span>
            {salvando ? 'Salvando...' : (isOnboarding ? 'Salvar e Liberar Acesso' : 'Salvar alterações')}
          </button>
        </div>
      </form>
    </div>
  );
}

function PerfilProfissional({ form, onChange, toggle, novoLocal, setNovoLocal, handleAddLocal, novaDispo, setNovaDispo, handleAddDispo }) {
  return (
    <>
      <Secao icon="person" iconColor="icon-roxo" titulo="Dados Pessoais *">
        <Campo label="Nome *" name="nome" value={form.nome} onChange={onChange} />
        <Campo label="E-mail *" name="email" type="email" value={form.email} onChange={onChange} />
        <Campo label="Telefone *" name="telefone" value={form.telefone} onChange={onChange} />
        <SelectCampo label="Tipo de profissional *" name="tipo" value={form.tipo} onChange={onChange} options={TIPOS_PROFISSIONAL.map((t) => [t.value, t.label])} />
      </Secao>
      
      <Secao icon="psychology" iconColor="icon-azul" titulo="Sobre você *">
        <div className="perfil-field full">
          <label>Apresentação (Bio) *</label>
          <textarea name="bio" value={form.bio} onChange={onChange} maxLength={300} rows={4} required />
        </div>
      </Secao>

      <Secao icon="sell" iconColor="icon-rosa" titulo="Especialidades *">
        <div className="perfil-tags full">
          {TAGS_SUGERIDAS.map((tag) => (
            <button key={tag} type="button" className={`perfil-tag ${form.tags.includes(tag) ? 'active' : ''}`} onClick={() => toggle('tags', tag)}>{tag}</button>
          ))}
        </div>
      </Secao>

      <Secao icon="location_on" iconColor="icon-verde" titulo="Locais de Atendimento *" subtitulo="Onde você atende?">
        <div className="perfil-field full">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <select value={novoLocal.modalidade} onChange={(e) => setNovoLocal({ ...novoLocal, modalidade: e.target.value })}>
              <option value="VIRTUAL">Online</option>
              <option value="PRESENCIAL">Presencial</option>
            </select>
            {novoLocal.modalidade === 'PRESENCIAL' && (
               <input className="glass-input" placeholder="CEP" value={novoLocal.cep || ''} onChange={e => setNovoLocal({...novoLocal, cep: e.target.value})} />
            )}
            <button type="button" className="btn-outline" onClick={handleAddLocal}>Adicionar</button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {form.locais.map((l, i) => (
              <li key={i} style={{ padding: '5px', background: 'var(--bg)', marginBottom: '5px', borderRadius: '5px' }}>
                ✓ Atendimento {l.modalidade === 'VIRTUAL' ? 'Online' : 'Presencial'}
              </li>
            ))}
          </ul>
        </div>
      </Secao>

      <Secao icon="schedule" iconColor="icon-laranja" titulo="Disponibilidade *" subtitulo="Quando você atende?">
        <div className="perfil-field full">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <select value={novaDispo.diaSemana} onChange={(e) => setNovaDispo({ ...novaDispo, diaSemana: e.target.value })}>
              {DIAS_SEMANA.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="time" value={novaDispo.horaInicio} onChange={e => setNovaDispo({...novaDispo, horaInicio: e.target.value})} />
            <input type="time" value={novaDispo.horaFim} onChange={e => setNovaDispo({...novaDispo, horaFim: e.target.value})} />
            <button type="button" className="btn-outline" onClick={handleAddDispo}>Adicionar</button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {form.disponibilidade.map((d, i) => (
              <li key={i} style={{ padding: '5px', background: 'var(--bg)', marginBottom: '5px', borderRadius: '5px' }}>
                ✓ {d.diaSemana} das {d.horaInicio} às {d.horaFim}
              </li>
            ))}
          </ul>
        </div>
      </Secao>
    </>
  );
}

function PerfilEmpresa({ form, onChange }) {
  return (
    <>
      <Secao icon="apartment" iconColor="icon-roxo" titulo="Dados da empresa">
        <Campo label="Razão social" name="razaoSocial" value={form.razaoSocial} readOnly />
        <Campo label="Nome fantasia" name="nomeFantasia" value={form.nomeFantasia} onChange={onChange} />
        <Campo label="CNPJ" name="cnpj" value={form.cnpj} readOnly />
        <Campo label="Responsável (RH)" name="responsavel" value={form.responsavel} onChange={onChange} />
        <Campo label="E-mail corporativo" name="email" type="email" value={form.email} onChange={onChange} />
        <Campo label="Telefone comercial" name="telefone" value={form.telefone} onChange={onChange} />
        <Campo label="Plano atual" name="plano" value={form.plano} readOnly />
      </Secao>
      <Secao icon="location_on" iconColor="icon-laranja" titulo="Endereço da sede">
        <Campo label="CEP" name="cep" value={form.cep} onChange={onChange} />
        <Campo label="Cidade" name="cidade" value={form.cidade} onChange={onChange} />
        <Campo label="Logradouro" name="logradouro" value={form.logradouro} onChange={onChange} full />
        <Campo label="Número" name="numero" value={form.numero} onChange={onChange} />
        <Campo label="Complemento" name="complemento" value={form.complemento} onChange={onChange} />
        <Campo label="Bairro" name="bairro" value={form.bairro} onChange={onChange} />
        <Campo label="UF" name="estado" value={form.estado} onChange={onChange} placeholder="SP" />
      </Secao>
    </>
  );
}

function PerfilCliente({ form, onChange }) {
  const isAprovado = form.status === 'APROVADO';
  const isRejeitado = form.status === 'REJEITADO';

  return (
    <>
      <Secao icon="person" iconColor="icon-roxo" titulo="Seus Dados Pessoais">
        <Campo label="Nome completo *" name="nome" value={form.nome} onChange={onChange} />
        <Campo label="E-mail *" name="email" value={form.email} readOnly />
        <Campo label="Telefone" name="telefone" value={form.telefone} onChange={onChange} />
      </Secao>

      {/* AVISO DE REJEITADO */}
      {isRejeitado ? (
        <Secao icon="cancel" iconColor="icon-rosa" titulo="Cadastro Recusado">
          <p style={{ padding: '1rem', color: '#b91c1c', background: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca' }}>
            Seu cadastro foi recusado pelo RH da sua empresa. Entre em contato com o departamento pessoal para mais informações.
          </p>
        </Secao>
      ) : (
        <Secao 
          icon={isAprovado ? "verified_user" : "pending"} 
          iconColor={isAprovado ? 'icon-verde' : 'icon-amarelo'} 
          titulo="Informações de Saúde *" 
          subtitulo={isAprovado ? 'Dados obrigatórios para agendar' : 'Aguardando aprovação do RH'}
        >
          {isAprovado ? (
            <>
              <Campo label="CNS (SUS) *" name="cns" value={form.cns} onChange={onChange} placeholder="000 0000 0000 0000" full />
              <Campo label="Data de Nascimento *" name="dataNascimento" type="date" value={form.dataNascimento} onChange={onChange} />
              <SelectCampo label="Gênero *" name="sexo" value={form.sexo} onChange={onChange} options={[['FEMININO', 'Feminino'], ['MASCULINO', 'Masculino'], ['OUTRO', 'Outro']]} />
              <Campo label="Nome completo da Mãe *" name="nomeMae" value={form.nomeMae} onChange={onChange} full />
            </>
          ) : (
            <p style={{ padding: '1rem', color: 'var(--text-s)' }}>Você poderá preencher os dados médicos assim que o RH da sua empresa aprovar seu cadastro.</p>
          )}
        </Secao>
      )}

      <Secao icon="location_on" iconColor="icon-laranja" titulo="Endereço">
        <Campo label="CEP" name="cep" value={form.cep} onChange={onChange} />
        <Campo label="Cidade" name="cidade" value={form.cidade} onChange={onChange} />
        <Campo label="Logradouro" name="logradouro" value={form.logradouro} onChange={onChange} full />
        <Campo label="Número" name="numero" value={form.numero} onChange={onChange} />
        <Campo label="Bairro" name="bairro" value={form.bairro} onChange={onChange} />
        <Campo label="UF" name="estado" value={form.estado} onChange={onChange} />
      </Secao>
    </>
  );
}

function Secao({ icon, iconColor = 'icon-roxo', titulo, subtitulo, children }) {
  return (
    <div className="perfil-secao">
      <div className="perfil-secao-head">
        <div className={`perfil-secao-icon ${iconColor}`}><span className="material-symbols-outlined">{icon}</span></div>
        <div className="perfil-secao-title"><h3>{titulo}</h3>{subtitulo && <p>{subtitulo}</p>}</div>
      </div>
      <div className="perfil-grid">{children}</div>
    </div>
  );
}

function Campo({ label, name, value, onChange, type = 'text', full, readOnly, placeholder }) {
  return (
    <div className={`perfil-field ${full ? 'full' : ''}`}>
      <label>{label}</label>
      <input name={name} type={type} value={value || ''} onChange={onChange} readOnly={readOnly} placeholder={placeholder} />
    </div>
  );
}

function SelectCampo({ label, name, value, onChange, options }) {
  return (
    <div className="perfil-field">
      <label>{label}</label>
      <select name={name} value={value || ''} onChange={onChange}>
        <option value="" disabled>Selecione</option>
        {options.map(([v, l]) => (<option key={v} value={v}>{l}</option>))}
      </select>
    </div>
  );
}

function legendaTipo(tipo, form) {
  if (tipo === 'PROFISSIONAL') return { PSICOLOGO: 'Psicólogo(a)', PSIQUIATRA: 'Psiquiatra', TERAPEUTA: 'Terapeuta' }[form.tipo] || 'Profissional';
  if (tipo === 'EMPRESA') return 'Empresa';
  if (tipo === 'BENEFICIARIO') return form.status === 'APROVADO' ? 'Beneficiário Ativo' : (form.status === 'REJEITADO' ? 'Cadastro Recusado' : 'Aguardando Aprovação');
  return '';
}