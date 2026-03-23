/**
 * TABELA.JS - Gestão de Dados e Cronograma de Jogos
 */
const tournamentData = {
    // Jogos que aparecem na tabela de cronograma (texto)
    schedule: [
        { round: "Quartas", date: "25/10 - 14:00", match: "RoboKnights vs CyberPulse", status: "Encerrado" },
        { round: "Quartas", date: "25/10 - 15:30", match: "TechTitans vs BotSquad", status: "Encerrado" },
        { round: "Semifinal", date: "26/10 - 10:00", match: "A definir vs A definir", status: "Em Breve" },
        { round: "Final", date: "26/10 - 16:00", match: "A definir vs A definir", status: "Em Breve" }
    ]
};

function renderScheduleTable() {
    const tbody = document.getElementById('games-table-body');
    if (!tbody) return;

    tbody.innerHTML = tournamentData.schedule.map((game, i) => {
        // Classes de status baseadas no seu design original
        const statusClass = game.status === 'Encerrado' 
            ? 'bg-gray-100 text-gray-500' 
            : 'bg-blue-50 text-[#0C87D1] border border-blue-100';

        return `
            <tr class="${i !== 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-6 font-bold text-ciebp-blue uppercase tracking-tighter w-32">${game.round}</td>
                <td class="px-6 py-6 text-gray-400 font-medium italic w-48">${game.date}</td>
                <td class="px-6 py-6 font-extrabold text-ciebp-blue text-lg italic ${game.status !== 'Encerrado' ? 'opacity-40' : ''}">${game.match}</td>
                <td class="px-6 py-6 text-right">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusClass}">
                        ${game.status}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// Inicializa a tabela quando o DOM carregar
document.addEventListener('DOMContentLoaded', renderScheduleTable);