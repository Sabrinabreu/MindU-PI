import React, { useState } from 'react';
import '../css/calendar.css';

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function Calendar({ dataSelecionada, onSelectData, eventos = {} }) {
  const [mesVisualizado, setMesVisualizado] = useState(dataSelecionada || new Date());

  const mesAnterior = () => {
    setMesVisualizado(new Date(mesVisualizado.getFullYear(), mesVisualizado.getMonth() - 1, 1));
  };
  
  const proximoMes = () => {
    setMesVisualizado(new Date(mesVisualizado.getFullYear(), mesVisualizado.getMonth() + 1, 1));
  };

  // Grade de dias
  const gerarCalendario = () => {
    const ano = mesVisualizado.getFullYear();
    const mes = mesVisualizado.getMonth();
    
    const primeiroDia = new Date(ano, mes, 1).getDay(); 
    const ultimoDia = new Date(ano, mes + 1, 0).getDate(); 
    
    const dias = [];
    for (let i = 0; i < primeiroDia; i++) dias.push(null); // Espaços vazios
    for (let i = 1; i <= ultimoDia; i++) dias.push(new Date(ano, mes, i));
    
    return dias;
  };

  const diasDoCalendario = gerarCalendario();

  const formatarDataChave = (data) => {
    if (!data) return '';
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  return (
    <div className="calendar-container glass-card">
      <header className="calendario-header">
        <h2>{NOMES_MESES[mesVisualizado.getMonth()]}, {mesVisualizado.getFullYear()}</h2>
        <div className="calendario-controles">
          <button onClick={mesAnterior} aria-label="Mês anterior">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button onClick={proximoMes} aria-label="Próximo mês">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </header>

      <div className="calendario-grid">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="calendario-dia-semana">{dia}</div>
        ))}

        {diasDoCalendario.map((data, index) => {
          if (!data) return <div key={`vazio-${index}`} className="calendario-dia vazio"></div>;

          const isHoje = formatarDataChave(data) === formatarDataChave(new Date());
          const isSelecionado = formatarDataChave(data) === formatarDataChave(dataSelecionada);
          const temEvento = eventos[formatarDataChave(data)]?.length > 0;

          return (
            <button
              key={index}
              type="button"
              className={`calendario-dia ${isHoje ? 'hoje' : ''} ${isSelecionado ? 'selecionado' : ''}`}
              onClick={() => onSelectData(data)}
            >
              <span>{data.getDate()}</span>
              {temEvento && <span className="calendario-ponto"></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}