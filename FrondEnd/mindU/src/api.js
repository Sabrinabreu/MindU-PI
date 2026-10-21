const BASE_URL = "https://mindu-api.onrender.com"; 

export function getToken() {
  return localStorage.getItem("mindu_token");
}

export function getUsuario() {
  const id = localStorage.getItem('mindu_user_id');
  const tipo = localStorage.getItem('mindu_tipo');
  if (!id || !tipo) return null;
  return {
    id,
    tipo,
    nome: localStorage.getItem('mindu_user_nome') || '',
    foto: localStorage.getItem('mindu_user_foto') || '',
  };
}

export function salvarSessao({ token, tipo, id, nome }) {
  if (token) localStorage.setItem("mindu_token", token);
  if (tipo) localStorage.setItem("mindu_tipo", tipo);
  if (id) localStorage.setItem("mindu_user_id", id);
  if (nome) localStorage.setItem("mindu_user_nome", nome);
  window.dispatchEvent(new Event('usuario-mudou'));
}

export function limparSessao() {
  localStorage.removeItem("mindu_token");
  localStorage.removeItem("mindu_tipo");
  localStorage.removeItem("mindu_user_id");
  localStorage.removeItem("mindu_user_nome");
  window.dispatchEvent(new Event('usuario-mudou'));
}

export async function api(path, { method = "GET", body, isFormData = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });

    
    
    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      throw new Error(erro.erro || erro.message || `Erro ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('O servidor pode estar iniciando (Cold Start). Aguarde 1 minuto e tente novamente.');
    }
    throw error;
  }
}