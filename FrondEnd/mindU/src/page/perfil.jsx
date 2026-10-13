import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuario } from '../api';
import { PerfilProfissional } from '../components/perfil/PerfilProfissional';
import { PerfilBeneficiario } from '../components/perfil/PerfilBeneficiario';
import '../css/perfil.css';

// usuario teste (remover depois)
const USUARIO_MOCK = {
  id: 'mock-1',
  tipo: 'PROFISSIONAL',
  nome: 'Roberto Rocha',
  email: 'roberto@mindu.com.br',
  avatar: 'https://i.pravatar.cc/200?img=13',
  capa: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
};

const DADOS_MOCK = {
  nome: 'Roberto Rocha',
  email: 'roberto@mindu.com.br',
  tipo: '',
  tags: [],
  fotoCarteirinha: null,
};

export function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [dados, setDados] = useState(null);
  const [secao, setSecao] = useState('perfil');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const { id, tipo } = getUsuario();

    const usuarioAtual =
      id && tipo
        ? { id, tipo, nome: USUARIO_MOCK.nome, email: USUARIO_MOCK.email, avatar: USUARIO_MOCK.avatar, capa: USUARIO_MOCK.capa }
        : USUARIO_MOCK;

    setUsuario(usuarioAtual);
    setDados(DADOS_MOCK);
    setCarregando(false);
  }, [navigate]);

  if (carregando || !usuario) {
    return (
      <div className="perfil-app">
        <div className="perfil-carregando">
          <span className="material-symbols-outlined girando">progress_activity</span>
          <p>Carregando…</p>
        </div>
      </div>
    );
  }

  const renderConteudo = () => {
    if (secao === 'perfil') {
      return usuario.tipo === 'PROFISSIONAL' ? (
        <PerfilProfissional usuario={usuario} dadosIniciais={dados} modo="editar" />
      ) : (
        <PerfilBeneficiario usuario={usuario} dadosIniciais={dados} modo="editar" />
      );
    }

    return (
      <div className="perfil-placeholder">
        <span className="material-symbols-outlined">construction</span>
        <h3>Em breve</h3>
        <p>Esta seção está em desenvolvimento.</p>
      </div>
    );
  };

  return (
     <div className="perfil-app">
    <div className="perfil-conteudo">
      {renderConteudo()}
    </div>
  </div>
  );
}