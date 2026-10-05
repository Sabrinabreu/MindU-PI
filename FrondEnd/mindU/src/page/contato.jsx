import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../css/contato.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const CANAIS_CONTATO = [
  {
    icon: 'chat',
    titulo: 'WhatsApp',
    valor: '(11) 91234-5678',
  },
  {
    icon: 'mail',
    titulo: 'E-mail',
    valor: 'contato@mindu.com.br',
  },
  {
    icon: 'call',
    titulo: 'Telefone',
    valor: '(11) 4000-0000',
  },
  {
    icon: 'schedule',
    titulo: 'Horário de atendimento',
    valor: 'Seg a Sex — 9h às 18h',
  },
];

// Localização das sedes
const SEDES = [
  {
    nome: 'MindU — Matriz',
    endereco: 'Av. Goiás, 1200 — São Caetano do Sul, SP',
    coords: [-23.6238, -46.5544],
  },
  {
    nome: 'MindU — Unidade Centro',
    endereco: 'R. Manoel Coelho, 450 — São Caetano do Sul, SP',
    coords: [-23.6226, -46.5516],
  },
  {
    nome: 'MindU — Polo Santo André',
    endereco: 'Av. Industrial, 780 — Santo André, SP',
    coords: [-23.6478, -46.5293],
  },
  {
    nome: 'MindU — Polo São Paulo',
    endereco: 'Av. Paulista, 1500 — Bela Vista, São Paulo, SP',
    coords: [-23.5629, -46.6544],
  },
];

// Centro do mapa 
const MAP_CENTER = [-23.6289, -46.5483];

export function Contato() {
  return (
    <div className="contato-page">
      {/* ===== Banner ===== */}
      <section className="contato-banner">
        <div className="contato-banner-content">
          <h1>Quer falar conosco?</h1>
          <p>Adoraríamos ouvir de você.<br />
            Veja como entrar em contato.</p>
        </div>
      </section>

      {/* ===== Cards de contato ===== */}
        <section className="contato-section">
            <div className="contato-canais">
                {CANAIS_CONTATO.map((canal, i) => (
                <div key={i} className="contato-card glass-card">
                    <div className="contato-card-icon">
                    <span className="material-symbols-outlined">{canal.icon}</span>
                    </div>
                    <h3>{canal.titulo}</h3>
                    <p className="contato-card-valor">{canal.valor}</p>
                </div>
                ))}
            </div>
        </section>

      {/* ===== Mapa com as sedes ===== */}
      <section className="contato-section">
        <div className="sectionHeader">
          <h2>Nossas sedes</h2>
          <p>Encontre a unidade MindU mais próxima de você!</p>
        </div>

        <div className="contato-mapa-wrapper">
          <MapContainer
            center={MAP_CENTER}
            zoom={13}
            scrollWheelZoom={false}
            className="contato-mapa" >
            
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

            {SEDES.map((sede, i) => (
              <Marker key={i} position={sede.coords}>
                <Popup>
                  <strong>{sede.nome}</strong>
                  <br />
                  {sede.endereco}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Card endereços */}
        <div className="contato-sedes-lista">
          {SEDES.map((sede, i) => (
            <div key={i} className="contato-sede">
              <span className="material-symbols-outlined">location_on</span>
              <div>
                <h4>{sede.nome}</h4>
                <p>{sede.endereco}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}