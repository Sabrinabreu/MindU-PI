import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { getUsuario, getIniciais, api } from '../api';
import '../css/perfil.css';

const INITIAL = {
  nome: '', email: '', telefone: '', foto: '', banner: '',
  dataNascimento: '', sexo: '', tipo: '', tags: [], bio: '', modalidade: '',
  fotoCarteirinha: null, razaoSocial: '', nomeFantasia: '', inscricaoEstadual: '',
  cnpj: '', responsavel: '', plano: '', empresa: '', matricula: '', cns: '', nomeMae: '',
  cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  senhaAtual: '', novaSenha: '', confirmarSenha: '',
  status: '', locais: [], disponibilidade: [],
};

const TAGS_SUGERIDAS = ['ansiedade', 'depressao', 'burnout', 'luto', 'relacionamentos', 'infantil', 'adolescentes', 'borderline', 'psicanalise', 'casais', 'autismo'];
const TIPOS_PROFISSIONAL = [{ value: 'PSICOLOGO', label: 'Psicólogo(a)' }, { value: 'PSIQUIATRA', label: 'Psiquiatra' }, { value: 'TERAPEUTA', label: 'Terapeuta' }];
const DIAS_SEMANA = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];

export function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState(INITIAL);
  const [originalForm, setOriginalForm] = useState(INITIAL);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false); // APROVADO + dados sensíveis faltando
  const [isEditing, setIsEditing] = useState(false);
  const [bloqueioStatus, setBloqueioStatus] = useState(null); // AGUARDANDO_APROVACAO | REJEITADO | PENDENTE

  const [novoLocal, setNovoLocal] = useState({ modalidade: 'VIRTUAL' });
  const [novaDispo, setNovaDispo] = useState({ diaSemana: 'SEGUNDA', horaInicio: '08:00', horaFim: '12:00' });

  useEffect(() => {
    const u = getUsuario();
    if (!u) { navigate('/login'); return; }
    setUsuario(u);

    const fetchPerfil = async () => {
      try {
        if (u.tipo === 'BENEFICIARIO') {
          const dadosBasicos = await api('/v1/clientes/me');

          // ===== STATUS BLOQUEADO: mostra tela de espera/recusa, SEM form editável =====
          if (dadosBasicos.status === 'AGUARDANDO_APROVACAO' || dadosBasicos.status === 'REJEITADO') {
            const formInicial = { ...INITIAL, ...dadosBasicos };
            setForm(formInicial);
            setOriginalForm(formInicial);
            setBloqueioStatus(dadosBasicos.status);
            setIsEditing(false);
            setIsOnboarding(false);
            setLoading(false);
            return;
          }

          // ===== APROVADO: busca dados sensíveis e decide se precisa onboarding =====
          let dadosSensiveis = {};
          try {
            dadosSensiveis = await api('/v1/clientes/me/dados-sensiveis');
          } catch (err) {
            console.warn('Dados sensíveis não encontrados', err);
          }

          const formInicial = {
            ...INITIAL,
            ...dadosBasicos,
            ...dadosSensiveis,
            sexo: dadosSensiveis.genero || '',
          };

          setForm(formInicial);
          setOriginalForm(formInicial);

          const incompleto = !formInicial.cns || !formInicial.dataNascimento || !formInicial.nomeMae || !formInicial.sexo;
          if (incompleto) {
            setIsOnboarding(true);
            setIsEditing(true);
            localStorage.setItem('mindu_perfil_incompleto', 'true');
          } else {
            localStorage.removeItem('mindu_perfil_incompleto');
          }
        }
        else if (u.tipo === 'PROFISSIONAL') {
          const dados = await api('/v1/profissionais/conta/perfil');

          if (dados.status === 'PENDENTE' || dados.status === 'REJEITADO') {
            const formInicial = { ...INITIAL, ...dados };
            setForm(formInicial);
            setOriginalForm(formInicial);
            setBloqueioStatus(dados.status);
            setIsEditing(false);
            setIsOnboarding(false);
            setLoading(false);
            return;
          }

          const formInicial = {
            ...INITIAL,
            ...dados,
            locais: dados.locaisAtendimento || [],
            disponibilidade: dados.disponibilidades || [],
          };
          setForm(formInicial);
          setOriginalForm(formInicial);

          const incompleto = !dados.tipo || !dados.bio || !dados.tags || dados.tags.length === 0;
          if (incompleto) {
            setIsOnboarding(true);
            setIsEditing(true);
            localStorage.setItem('mindu_perfil_incompleto', 'true');
          } else {
            localStorage.removeItem('mindu_perfil_incompleto');
          }
        }
        else if (u.tipo === 'EMPRESA') {
          const dados = await api('/v1/empresas/me');
          const formInicial = { ...INITIAL, ...dados, nome: dados.nomeFantasia || dados.razaoSocial };
          setForm(formInicial);
          setOriginalForm(formInicial);
          localStorage.removeItem('mindu_perfil_incompleto');
        }
      } catch (err) {
        console.error('Erro ao buscar perfil', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [navigate]);

  // Revalida status a cada 30s se estiver bloqueado (RH pode aprovar enquanto aberto)
  useEffect(() => {
    if (!bloqueioStatus || !usuario) return;
    const id = setInterval(async () => {
      try {
        if (usuario.tipo === 'BENEFICIARIO') {
          const c = await api('/v1/clientes/me');
          if (c.status === 'APROVADO') window.location.reload();
        } else if (usuario.tipo === 'PROFISSIONAL') {
          const p = await api('/v1/profissionais/conta/perfil');
          if (p.status === 'APROVADO') window.location.reload();
        }
      } catch { /* ignora */ }
    }, 30000);
    return () => clearInterval(id);
  }, [bloqueioStatus, usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleArrayItem = (campo, valor) => {
    setForm((p) => ({ ...p, [campo]: p[campo].includes(valor) ? p[campo].filter((v) => v !== valor) : [...p[campo], valor] }));
  };

  const handleAddLocal = () => {
    if (novoLocal.modalidade === 'PRESENCIAL' && (!novoLocal.cep || !novoLocal.cidade)) {
      return alert('Para atendimento presencial, preencha o CEP e a Cidade.');
    }
    setForm((p) => ({ ...p, locais: [...p.locais, novoLocal] }));
    setNovoLocal({ modalidade: 'VIRTUAL' });
  };

  const handleAddDispo = () => {
    setForm((p) => ({ ...p, disponibilidade: [...p.disponibilidade, novaDispo] }));
  };

  const handleCancelarEdicao = () => {
    setForm(originalForm);
    setIsEditing(false);
  };

  const verificarCompleto = (tipo, f) => {
    if (tipo === 'BENEFICIARIO') {
      return f.status === 'APROVADO' && f.cns && f.dataNascimento && f.nomeMae && f.sexo;
    }
    if (tipo === 'PROFISSIONAL') {
      return f.status === 'APROVADO' && f.tipo && f.bio && f.tags && f.tags.length > 0;
    }
    return true; // EMPRESA, ADMIN
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    setSalvando(true);

    try {
      if (form.novaSenha) {
        if (form.novaSenha !== form.confirmarSenha) throw new Error('As senhas não coincidem.');
        await api('/v1/auth/senha', { method: 'PUT', body: { senhaAtual: form.senhaAtual, novaSenha: form.novaSenha } });
      }

      if (usuario.tipo === 'BENEFICIARIO') {
        await api('/v1/clientes/me', {
          method: 'PATCH',
          body: {
            nome: form.nome, email: form.email, telefone: form.telefone,
            cep: form.cep, logradouro: form.logradouro, numero: form.numero,
            bairro: form.bairro, cidade: form.cidade, estado: form.estado,
          },
        });

        if (form.status === 'APROVADO') {
          if (!form.cns || !form.dataNascimento || !form.nomeMae || !form.sexo) {
            throw new Error('Preencha CNS, Data de Nascimento, Gênero e Nome da Mãe para liberar o acesso.');
          }
          await api('/v1/clientes/me/dados-sensiveis', {
            method: 'PATCH',
            body: { cns: form.cns, dataNascimento: form.dataNascimento, nomeMae: form.nomeMae, genero: form.sexo },
          });
        }
      }
      else if (usuario.tipo === 'PROFISSIONAL') {
        await api(`/v1/profissionais/${usuario.id}`, {
          method: 'PATCH',
          body: { nome: form.nome, email: form.email, telefone: form.telefone, bio: form.bio, tipo: form.tipo, tags: form.tags },
        });
        for (const local of form.locais) {
          if (!local.id) await api(`/v1/profissionais/${usuario.id}/locais`, { method: 'POST', body: local });
        }
        if (form.disponibilidade.length > 0) {
          await api(`/v1/profissionais/${usuario.id}/disponibilidade`, { method: 'PUT', body: form.disponibilidade });
        }
      }
      else if (usuario.tipo === 'EMPRESA') {
        await api('/v1/empresas/me', {
          method: 'PATCH',
          body: {
            nomeFantasia: form.nomeFantasia, responsavel: form.responsavel, email: form.email,
            telefone: form.telefone, cep: form.cep, logradouro: form.logradouro, numero: form.numero,
            complemento: form.complemento, bairro: form.bairro, cidade: form.cidade, estado: form.estado,
          },
        });
      }

      // ===== SÓ remove a flag se o perfil estiver REALMENTE completo =====
      const completo = verificarCompleto(usuario.tipo, form);
      if (completo) {
        localStorage.removeItem('mindu_perfil_incompleto');
      }

      setOriginalForm(form);
      setIsEditing(false);

      if (isOnboarding && completo) {
        alert('Cadastro completo! Bem-vindo(a) à MindU.');
        navigate(usuario.tipo === 'BENEFICIARIO' ? '/profissionais' : '/agenda');
      } else {
        alert('Perfil atualizado!');
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

  // ===== TELAS DE BLOQUEIO =====
  if (bloqueioStatus === 'AGUARDANDO_APROVACAO') {
    return (
      <div className="perfil-page">
        <div className="perfil-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '72px', color: 'var(--accent)' }}>hourglass_top</span>
          <h1 style={{ marginTop: '1rem' }}>Cadastro em análise</h1>
          <p style={{ color: 'var(--text-s)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
            Seu cadastro foi enviado para o RH da sua empresa.<br />
            Você receberá acesso assim que for aprovado.
          </p>
          <button className="btn-gradient" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>
            <span className="material-symbols-outlined">refresh</span> Verificar novamente
          </button>
          <p style={{ color: 'var(--text-m)', marginTop: '1.5rem', fontSize: '0.85rem' }}>
            A página atualiza sozinha a cada 30 segundos.
          </p>
        </div>
      </div>
    );
  }

  if (bloqueioStatus === 'REJEITADO') {
    return (
      <div className="perfil-page">
        <div className="perfil-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '72px', color: '#ef4444' }}>cancel</span>
          <h1 style={{ marginTop: '1rem' }}>Cadastro recusado</h1>
          <p style={{ color: 'var(--text-s)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
            Seu cadastro foi recusado pelo RH da sua empresa.<br />
            Entre em contato com o departamento pessoal para mais informações.
          </p>
        </div>
      </div>
    );
  }

  if (bloqueioStatus === 'PENDENTE') {
    return (
      <div className="perfil-page">
        <div className="perfil-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '72px', color: 'var(--accent)' }}>hourglass_top</span>
          <h1 style={{ marginTop: '1rem' }}>Carteirinha em análise</h1>
          <p style={{ color: 'var(--text-s)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
            Sua carteirinha profissional está em análise pela nossa equipe.<br />
            Você será notificado em até 3 dias úteis.
          </p>
          <button className="btn-gradient" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>
            <span className="material-symbols-outlined">refresh</span> Verificar novamente
          </button>
        </div>
      </div>
    );
  }

  // ===== PERFIL NORMAL / ONBOARDING =====
  return (
    <div className="perfil-page">
      <form className="perfil-card" onSubmit={handleSubmit}>
        {isOnboarding && (
          <div style={{ background: '#fef08a', color: '#854d0e', padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
            ⚠️ Complete seu perfil para liberar o acesso total à plataforma!
          </div>
        )}

        <div className="perfil-capa">
          <div className="perfil-capa-banner" style={{ backgroundImage: `url(${form.banner})` }}>
            <div className="perfil-capa-pattern" />
            {isEditing && (
              <label className="perfil-edit-btn" title="Alterar capa">
                <span className="material-symbols-outlined">edit</span>
                <input type="file" accept="image/*" name="banner" onChange={handleChange} hidden />
              </label>
            )}
          </div>
        </div>

        <div className="perfil-capa-info">
          <div className="perfil-capa-avatar">
            {form.foto ? <img src={form.foto} alt={form.nome} /> : <div className="avatar-text-grande">{getIniciais(form.nome)}</div>}
            {isEditing && (
              <label className="perfil-edit-avatar-btn" title="Alterar logotipo">
                <span className="material-symbols-outlined">photo_camera</span>
                <input type="file" accept="image/*" name="foto" onChange={handleChange} hidden />
              </label>
            )}
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
              isEditing={isEditing}
            />
          )}
          {usuario.tipo === 'EMPRESA' && <PerfilEmpresa form={form} onChange={handleChange} isEditing={isEditing} />}
          {usuario.tipo === 'BENEFICIARIO' && <PerfilCliente form={form} onChange={handleChange} isEditing={isEditing} />}

          <Secao icon="lock" iconColor="icon-amarelo" titulo="Segurança" subtitulo={isEditing ? 'Alterar senha (opcional)' : 'Suas credenciais estão protegidas'}>
            <Campo label="Senha atual" name="senhaAtual" type="password" value={form.senhaAtual} onChange={handleChange} readOnly={!isEditing} />
            <Campo label="Nova senha" name="novaSenha" type="password" value={form.novaSenha} onChange={handleChange} readOnly={!isEditing} />
            <Campo label="Confirmar nova senha" name="confirmarSenha" type="password" value={form.confirmarSenha} onChange={handleChange} readOnly={!isEditing} full />
          </Secao>
        </div>

        <div className="perfil-actions">
          {!isEditing ? (
            <button type="button" className="btn-salvar btn-gradient" onClick={() => setIsEditing(true)}>
              <span className="material-symbols-outlined">edit</span>
              Editar Perfil
            </button>
          ) : (
            <>
              {!isOnboarding && (
                <button type="button" className="btn-cancelar" onClick={handleCancelarEdicao}>
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn-salvar btn-gradient" disabled={salvando}>
                <span className="material-symbols-outlined">save</span>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

/* --- COMPONENTES AUXILIARES (mantidos) --- */

function PerfilProfissional({ form, onChange, toggle, novoLocal, setNovoLocal, handleAddLocal, novaDispo, setNovaDispo, handleAddDispo, isEditing }) {
  return (
    <>
      <Secao icon="person" iconColor="icon-roxo" titulo="Dados Pessoais">
        <Campo label="Nome *" name="nome" value={form.nome} onChange={onChange} readOnly={!isEditing} />
        <Campo label="E-mail *" name="email" type="email" value={form.email} onChange={onChange} readOnly={!isEditing} />
        <div className="perfil-field">
          <label>Telefone *</label>
          <IMaskInput mask="(00) 00000-0000" value={form.telefone} onAccept={(v) => onChange({ target: { name: 'telefone', value: v } })} readOnly={!isEditing} />
        </div>
        <SelectCampo label="Tipo de profissional *" name="tipo" value={form.tipo} onChange={onChange} options={TIPOS_PROFISSIONAL.map((t) => [t.value, t.label])} readOnly={!isEditing} />
      </Secao>

      <Secao icon="psychology" iconColor="icon-azul" titulo="Sobre você">
        <div className="perfil-field full">
          <label>Apresentação (Bio) *</label>
          <textarea name="bio" value={form.bio} onChange={onChange} maxLength={300} rows={4} readOnly={!isEditing} />
        </div>
      </Secao>

      <Secao icon="sell" iconColor="icon-rosa" titulo="Especialidades *">
        <div className="perfil-tags full">
          {TAGS_SUGERIDAS.map((tag) => (
            <button key={tag} type="button" className={`perfil-tag ${form.tags.includes(tag) ? 'active' : ''}`} onClick={() => isEditing && toggle('tags', tag)} disabled={!isEditing}>
              {tag}
            </button>
          ))}
        </div>
      </Secao>

      <Secao icon="location_on" iconColor="icon-verde" titulo="Locais de Atendimento" subtitulo={isEditing ? 'Onde você atende?' : ''}>
        <div className="perfil-field full">
          {isEditing && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <select value={novoLocal.modalidade} onChange={(e) => setNovoLocal({ ...novoLocal, modalidade: e.target.value })}>
                <option value="VIRTUAL">Online</option>
                <option value="PRESENCIAL">Presencial</option>
              </select>
              {novoLocal.modalidade === 'PRESENCIAL' && (
                <IMaskInput mask="00000-000" placeholder="CEP" value={novoLocal.cep || ''} onAccept={(v) => setNovoLocal({ ...novoLocal, cep: v })} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
              )}
              <button type="button" className="btn-outline" onClick={handleAddLocal}>Adicionar</button>
            </div>
          )}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {form.locais.map((l, i) => (
              <li key={i} style={{ padding: '8px', background: 'var(--bg)', marginBottom: '5px', borderRadius: '8px' }}>
                ✓ Atendimento {l.modalidade === 'VIRTUAL' ? 'Online' : 'Presencial'}
              </li>
            ))}
          </ul>
        </div>
      </Secao>

      <Secao icon="schedule" iconColor="icon-laranja" titulo="Disponibilidade" subtitulo={isEditing ? 'Quando você atende?' : ''}>
        <div className="perfil-field full">
          {isEditing && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <select value={novaDispo.diaSemana} onChange={(e) => setNovaDispo({ ...novaDispo, diaSemana: e.target.value })}>
                {DIAS_SEMANA.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="time" value={novaDispo.horaInicio} onChange={(e) => setNovaDispo({ ...novaDispo, horaInicio: e.target.value })} />
              <input type="time" value={novaDispo.horaFim} onChange={(e) => setNovaDispo({ ...novaDispo, horaFim: e.target.value })} />
              <button type="button" className="btn-outline" onClick={handleAddDispo}>Adicionar</button>
            </div>
          )}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {form.disponibilidade.map((d, i) => (
              <li key={i} style={{ padding: '8px', background: 'var(--bg)', marginBottom: '5px', borderRadius: '8px' }}>
                ✓ {d.diaSemana} das {d.horaInicio} às {d.horaFim}
              </li>
            ))}
          </ul>
        </div>
      </Secao>
    </>
  );
}

function PerfilEmpresa({ form, onChange, isEditing }) {
  return (
    <>
      <Secao icon="apartment" iconColor="icon-roxo" titulo="Dados da empresa">
        <Campo label="Razão social" name="razaoSocial" value={form.razaoSocial} readOnly />
        <Campo label="Nome fantasia" name="nomeFantasia" value={form.nomeFantasia} onChange={onChange} readOnly={!isEditing} />
        <div className="perfil-field">
          <label>CNPJ</label>
          <IMaskInput mask="00.000.000/0000-00" value={form.cnpj} readOnly />
        </div>
        <Campo label="Responsável (RH)" name="responsavel" value={form.responsavel} onChange={onChange} readOnly={!isEditing} />
        <Campo label="E-mail corporativo" name="email" type="email" value={form.email} onChange={onChange} readOnly={!isEditing} />
        <div className="perfil-field">
          <label>Telefone comercial</label>
          <IMaskInput mask="(00) 00000-0000" value={form.telefone} onAccept={(v) => onChange({ target: { name: 'telefone', value: v } })} readOnly={!isEditing} />
        </div>
        <Campo label="Plano atual" name="plano" value={form.plano} readOnly />
      </Secao>
      <Secao icon="location_on" iconColor="icon-laranja" titulo="Endereço da sede">
        <div className="perfil-field">
          <label>CEP</label>
          <IMaskInput mask="00000-000" value={form.cep} onAccept={(v) => onChange({ target: { name: 'cep', value: v } })} readOnly={!isEditing} />
        </div>
        <Campo label="Cidade" name="cidade" value={form.cidade} onChange={onChange} readOnly={!isEditing} />
        <Campo label="Logradouro" name="logradouro" value={form.logradouro} onChange={onChange} full readOnly={!isEditing} />
        <Campo label="Número" name="numero" value={form.numero} onChange={onChange} readOnly={!isEditing} />
        <Campo label="Complemento" name="complemento" value={form.complemento} onChange={onChange} readOnly={!isEditing} />
        <Campo label="Bairro" name="bairro" value={form.bairro} onChange={onChange} readOnly={!isEditing} />
        <Campo label="UF" name="estado" value={form.estado} onChange={onChange} placeholder="SP" maxLength={2} readOnly={!isEditing} />
      </Secao>
    </>
  );
}

function PerfilCliente({ form, onChange, isEditing }) {
  return (
    <>
      <Secao icon="person" iconColor="icon-roxo" titulo="Seus Dados Pessoais">
        <Campo label="Nome completo *" name="nome" value={form.nome} onChange={onChange} readOnly={!isEditing} />
        <Campo label="E-mail *" name="email" value={form.email} readOnly />
        <div className="perfil-field">
          <label>Telefone</label>
          <IMaskInput mask="(00) 00000-0000" value={form.telefone} onAccept={(v) => onChange({ target: { name: 'telefone', value: v } })} readOnly={!isEditing} />
        </div>
      </Secao>

      <Secao
        icon="verified_user"
        iconColor="icon-verde"
        titulo="Informações de Saúde"
        subtitulo="Dados obrigatórios para agendar"
      >
        <div className="perfil-field full">
          <label>CNS (SUS) *</label>
          <IMaskInput mask="000 0000 0000 0000" value={form.cns} onAccept={(v) => onChange({ target: { name: 'cns', value: v } })} readOnly={!isEditing} required />
        </div>
        <Campo label="Data de Nascimento *" name="dataNascimento" type="date" value={form.dataNascimento} onChange={onChange} readOnly={!isEditing} required />
        <div className="perfil-field">
          <label>Gênero *</label>
          <select name="sexo" value={form.sexo || ''} onChange={onChange} disabled={!isEditing} required>
            <option value="" disabled>Selecione</option>
            <option value="FEMININO">Feminino</option>
            <option value="MASCULINO">Masculino</option>
            <option value="OUTRO">Outro</option>
            <option value="PREFIRO_NAO_INFORMAR">Prefiro não informar</option>
          </select>
        </div>
        <Campo label="Nome completo da Mãe *" name="nomeMae" value={form.nomeMae} onChange={onChange} full readOnly={!isEditing} required />
      </Secao>

      <Secao icon="location_on" iconColor="icon-laranja" titulo="Endereço">
        <div className="perfil-field">
          <label>CEP</label>
          <IMaskInput mask="00000-000" value={form.cep} onAccept={(v) => onChange({ target: { name: 'cep', value: v } })} readOnly={!isEditing} />
        </div>
        <Campo label="Cidade" name="cidade" value={form.cidade} onChange={onChange} readOnly={!isEditing} />
        <Campo label="Logradouro" name="logradouro" value={form.logradouro} onChange={onChange} full readOnly={!isEditing} />
        <Campo label="Número" name="numero" value={form.numero} onChange={onChange} readOnly={!isEditing} />
        <Campo label="Bairro" name="bairro" value={form.bairro} onChange={onChange} readOnly={!isEditing} />
        <Campo label="UF" name="estado" value={form.estado} onChange={onChange} readOnly={!isEditing} />
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

function Campo({ label, name, value, onChange, type = 'text', full, readOnly, placeholder, minLength }) {
  return (
    <div className={`perfil-field ${full ? 'full' : ''}`}>
      <label>{label}</label>
      <input name={name} type={type} value={value || ''} onChange={onChange} placeholder={placeholder} readOnly={readOnly} minLength={minLength} />
    </div>
  );
}

function SelectCampo({ label, name, value, onChange, options, readOnly }) {
  return (
    <div className="perfil-field">
      <label>{label}</label>
      <select name={name} value={value || ''} onChange={onChange} disabled={readOnly}>
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