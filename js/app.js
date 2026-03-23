/* ================================================================
   CIEBP — Campeonato Escolar de Futebol de Robôs
   Arquivo: js/app.js (Refatorado para Alta Performance)
   ================================================================ */
'use strict';

/* --- 1. DADOS SIMULADOS --- */
const gamesData = [
  {
    id: 1, status: 'live', round: 'Semifinal', arena: 'Quadra A',
    teamA: { name: 'GALÁXIA', class: 'Turma 7A', icon: '🤖', score: 3 },
    teamB: { name: 'TITAN X', class: 'Turma 8B', icon: '🦾', score: 3 },
    time: '04:32', isMain: true
  },
  {
    id: 2, status: 'live', round: 'Semifinal', arena: 'Quadra B',
    teamA: { name: 'NEON', class: 'Turma 6C', icon: '⚡', score: 210 },
    teamB: { name: 'VORTEX', class: 'Turma 9A', icon: '🌀', score: 198 },
    time: '07:15', isMain: false
  },
  {
    id: 3, status: 'ended', round: 'Quartas', arena: 'Quadra C',
    teamA: { name: 'ALPHA', class: 'Turma 8A', icon: '🔵', score: 320 },
    teamB: { name: 'DELTA', class: 'Turma 7B', icon: '🔴', score: 290 },
    time: '—', isMain: false
  }
];

let currentFilter = 'all';
let timerSeconds  = 272; // 04:32 em segundos
const activeAnimations = {}; // Evita conflito de animações no placar

/* --- 2. FILTROS E RENDERIZAÇÃO DOS CARDS --- */
window.filterGames = function(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCards();
};

function renderCards() {
  const grid = document.getElementById('games-grid');
  if (!grid) return;

  const list = currentFilter === 'all' ? gamesData : gamesData.filter(g => g.status === currentFilter);
  grid.innerHTML = '';

  list.forEach((game, i) => {
    const card = document.createElement('div');
    card.className = `game-card ${game.status === 'live' ? 'border-2 border-red-500 shadow-lg' : 'border border-gray-200'} bg-white rounded-xl p-4 transition-transform hover:-translate-y-1`;
    card.style.opacity = '0';
    card.style.animation = `fadeUp 0.4s ease ${i * 0.05}s forwards`;
    
    // Simplificação do Card usando Tailwind para estrutura rápida
    card.innerHTML = `
      <div class="flex justify-between items-center mb-3 border-b pb-2">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">${game.round} · ${game.arena}</span>
        ${game.status === 'live' ? '<span class="text-xs font-bold text-red-500 flex items-center gap-1"><span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> AO VIVO</span>' : ''}
      </div>
      <div class="flex justify-between items-center px-2">
        <div class="text-center">
          <div class="text-2xl">${game.teamA.icon}</div>
          <div class="font-black text-sm">${game.teamA.name}</div>
        </div>
        <div class="text-center px-4 font-black text-2xl tracking-tighter">
          <span id="card-score-a-${game.id}" class="${game.status === 'live' ? 'text-red-500' : 'text-gray-800'}">${game.teamA.score}</span>
          <span class="text-gray-300 mx-1">×</span>
          <span id="card-score-b-${game.id}" class="${game.status === 'live' ? 'text-red-500' : 'text-gray-800'}">${game.teamB.score}</span>
        </div>
        <div class="text-center">
          <div class="text-2xl">${game.teamB.icon}</div>
          <div class="font-black text-sm">${game.teamB.name}</div>
        </div>
      </div>
      ${game.status === 'live' ? `<button onclick="setMainGame(${game.id})" class="w-full mt-4 bg-blue-50 text-blue-600 font-bold text-xs py-2 rounded-lg hover:bg-blue-100 uppercase tracking-widest transition">▶ Assistir</button>` : ''}
    `;
    grid.appendChild(card);
  });
}

/* --- 3. PLACAR PRINCIPAL DA ARENA --- */
// Atualiza APENAS os textos fixos (evita re-renderização desnecessária)
function initScoreboard(game) {
  const fields = {
    'team-a-name': game.teamA.name,
    'team-a-class': game.teamA.class,
    'robot-a': game.teamA.icon,
    'team-b-name': game.teamB.name,
    'team-b-class': game.teamB.class,
    'robot-b': game.teamB.icon
  };

  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  document.getElementById('score-a').textContent = game.teamA.score;
  document.getElementById('score-b').textContent = game.teamB.score;
}

// Animação Segura de Números
function animateScore(id, target) {
  const el = document.getElementById(id);
  if (!el) return;

  const current = parseInt(el.textContent) || 0;
  if (current === target) return;

  // Limpa animação anterior se o time pontuar de novo rápido demais
  if (activeAnimations[id]) clearInterval(activeAnimations[id]);

  el.classList.add('text-white', 'scale-110'); // Efeito Flash Tailwind
  setTimeout(() => el.classList.remove('text-white', 'scale-110'), 300);

  let val = current;
  const step = target > current ? 1 : -1;

  activeAnimations[id] = setInterval(() => {
    val += step;
    el.textContent = val;
    if (val === target) {
      clearInterval(activeAnimations[id]);
      delete activeAnimations[id];
    }
  }, 40); // Velocidade da roleta numérica
}

/* --- 4. LÓGICA DE DADOS AO VIVO --- */
window.setMainGame = function(id) {
  const game = gamesData.find(g => g.id === id);
  if (!game || game.status !== 'live') return;

  gamesData.forEach(g => g.isMain = false);
  game.isMain = true;

  initScoreboard(game);
  document.getElementById('arena').scrollIntoView({ behavior: 'smooth' });
};

function simulateLiveUpdate() {
  gamesData.forEach(game => {
    if (game.status !== 'live') return;

    // Lógica realista: 40% de chance de pontuar a cada ciclo
    let scored = false;
    if (Math.random() > 0.6) { game.teamA.score += Math.floor(Math.random() * 3) + 1; scored = true; }
    if (Math.random() > 0.6) { game.teamB.score += Math.floor(Math.random() * 3) + 1; scored = true; }

    if (!scored) return;

    // Atualiza mini-cards sutilmente
    const elA = document.getElementById(`card-score-a-${game.id}`);
    const elB = document.getElementById(`card-score-b-${game.id}`);
    if (elA) elA.textContent = game.teamA.score;
    if (elB) elB.textContent = game.teamB.score;

    // Se for o jogo principal, aciona a animação de roleta
    if (game.isMain) {
      animateScore('score-a', game.teamA.score);
      animateScore('score-b', game.teamB.score);
    }
  });
}

window.refreshScores = function() {
  const btn = document.getElementById('refresh-btn');
  if (!btn) return;
  btn.textContent = '↻ Atualizando...';
  btn.disabled = true;

  setTimeout(() => {
    simulateLiveUpdate();
    btn.textContent = '↻ Atualizar Placares';
    btn.disabled = false;
  }, 600);
};

/* --- 5. TIMER E INICIALIZAÇÃO --- */
function updateTimer() {
  timerSeconds++;
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');
  const el = document.getElementById('match-timer');
  if (el) el.textContent = `⏱ ${m}:${s}`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  const mainGame = gamesData.find(g => g.isMain);
  if (mainGame) initScoreboard(mainGame);

  setInterval(simulateLiveUpdate, 3500);
  setInterval(updateTimer, 1000);
});