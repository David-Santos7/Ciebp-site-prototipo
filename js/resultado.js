/**
 * RESULTADO.JS - Lógica de Placar Ao Vivo e Cards Visuais
 */
const matchData = [
    {
        id: 1,
        teamA: "Bolt Strikers", classA: "7A",
        teamB: "Circuit Breakers", classB: "7B",
        scoreA: 3, scoreB: 1,
        status: "LIVE", time: "Em andamento"
    },
    {
        id: 2,
        teamA: "BitBusters", classA: "8C",
        teamB: "LogicLions", classB: "8A",
        scoreA: 4, scoreB: 2,
        status: "FINISHED", time: "Finalizado"
    },
    {
        id: 3,
        teamA: "NanoNinjas", classA: "9B",
        teamB: "CircuitKings", classB: "9D",
        scoreA: 0, scoreB: 0,
        status: "UPCOMING", time: "14:30"
    }
];

function updateLiveArena(match) {
    // Atualiza o bloco "AO VIVO" do topo (ID: ao-vivo no HTML)
    const elements = {
        nameA: document.getElementById('team-a-name'),
        nameB: document.getElementById('team-b-name'),
        classA: document.getElementById('team-a-class'),
        classB: document.getElementById('team-b-class'),
        scoreA: document.getElementById('score-a'),
        scoreB: document.getElementById('score-b')
    };

    if (elements.nameA) elements.nameA.innerText = match.teamA;
    if (elements.nameB) elements.nameB.innerText = match.teamB;
    if (elements.classA) elements.classA.innerText = `Turma ${match.classA}`;
    if (elements.classB) elements.classB.innerText = `Turma ${match.classB}`;
    if (elements.scoreA) elements.scoreA.innerText = match.scoreA;
    if (elements.scoreB) elements.scoreB.innerText = match.scoreB;
}

function renderMatchGrid() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;

    grid.innerHTML = ''; 

    matchData.forEach(match => {
        let statusBadge = '';
        let cardStyle = 'border-transparent shadow-md';
        let scoreColor = 'text-ciebp-blue';

        if (match.status === 'LIVE') {
            statusBadge = `<span class="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">AO VIVO</span>`;
            cardStyle = 'border-2 border-ciebp-pink shadow-xl scale-[1.02]';
            scoreColor = 'text-ciebp-pink font-black';
            updateLiveArena(match); // Sincroniza com a arena principal
        } else if (match.status === 'FINISHED') {
            statusBadge = `<span class="bg-gray-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">ENCERRADO</span>`;
        } else {
            statusBadge = `<span class="bg-blue-50 text-[#0C87D1] border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold">EM BREVE - ${match.time}</span>`;
        }

        const card = `
            <div class="flex flex-col p-6 rounded-xl-custom transition-all duration-300 ${cardStyle} bg-white">
                <div class="flex justify-between items-center mb-6">
                    ${statusBadge}
                    <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">Arena Principal</span>
                </div>
                
                <div class="flex items-center justify-between gap-2">
                    <div class="text-center w-1/3">
                        <p class="text-[10px] text-gray-300 font-bold uppercase mb-1">${match.classA}</p>
                        <p class="text-sm font-black text-ciebp-blue leading-tight truncate uppercase">${match.teamA}</p>
                    </div>
                    
                    <div class="w-1/3 text-center">
                        <span class="text-3xl font-black italic tracking-tighter ${scoreColor}">${match.scoreA} : ${match.scoreB}</span>
                    </div>

                    <div class="text-center w-1/3">
                        <p class="text-[10px] text-gray-300 font-bold uppercase mb-1">${match.classB}</p>
                        <p class="text-sm font-black text-ciebp-blue leading-tight truncate uppercase">${match.teamB}</p>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Simulação de placar mudando
setInterval(() => {
    const liveMatch = matchData.find(m => m.status === 'LIVE');
    if (liveMatch) {
        liveMatch.scoreA += Math.random() > 0.7 ? 1 : 0; // Sorteia se sai gol
        liveMatch.scoreB += Math.random() > 0.8 ? 1 : 0;
        renderMatchGrid(); 
    }
}, 20000);

document.addEventListener('DOMContentLoaded', renderMatchGrid);