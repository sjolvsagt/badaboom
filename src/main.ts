import './style.css'
import { GameEngine } from './game';
import { GameEvent, Choice, Faction, StateChanges, GameState } from './types';
import { calculateScoreBreakdown } from './rules';

const app = document.querySelector<HTMLDivElement>('#app')!;

function generateChangesHtml(changes: StateChanges, state: GameState): string {
    const parts: string[] = [];
    
    if (changes.treasury !== 0) {
        const sign = changes.treasury > 0 ? "+" : "";
        const color = changes.treasury > 0 ? "var(--accent-color)" : "var(--danger-color)";
        parts.push(`<div>Treasury: <span style="color:${color}">${sign}$${changes.treasury}B</span></div>`);
    }

    if (changes.personalAccount !== 0) {
        const sign = changes.personalAccount > 0 ? "+" : "";
        const color = changes.personalAccount > 0 ? "var(--accent-color)" : "var(--danger-color)";
        parts.push(`<div>Swiss Account: <span style="color:${color}">${sign}$${changes.personalAccount}B</span></div>`);
    }

    Object.entries(changes.popularity).forEach(([faction, diff]) => {
         const val = diff as number;
         const sign = val > 0 ? "+" : "";
         const color = val > 0 ? "var(--accent-color)" : "var(--danger-color)";
         parts.push(`<div>${faction}: <span style="color:${color}">${sign}${val}%</span></div>`);
    });

    if (parts.length === 0) return "";

    let prevMonth = state.month - 1;
    let prevYear = state.year;
    if (prevMonth === 0) {
        prevMonth = 12;
        prevYear--;
    }
    const monthName = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][prevMonth - 1];

    return `<div style="text-align: left; background: #2a2a2a; padding: 15px; margin: 15px 0; border: 1px solid #444;">
        <h3 style="text-align: center; border-bottom: 1px solid #444; padding-bottom: 5px; margin-bottom: 10px; font-size: 0.8rem; color: #888;">${monthName} ${prevYear}</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; font-size: 0.9rem;">
            ${parts.join('')}
        </div>
    </div>`;
}

// Simple UI Render
function render(engine: GameEngine, currentEvent: GameEvent | null, lastLog: string, changes?: StateChanges) {
    if (!app) return;

    if (!engine.state.isAlive || engine.state.isExiled || engine.state.isVictory) {
        const breakdown = calculateScoreBreakdown(engine.state, engine.state.isAlive); // isAlive is true if exiled (escaped), false if dead
        app.innerHTML = `
            <div class="main-monitor" style="text-align: center; justify-content: center;">
                <h1 style="color: var(--danger-color)">${engine.state.isVictory ? "CONGRATULATIONS" : "GAME OVER"}</h1>
                <p class="event-text">${engine.state.gameOverReason}</p>
                <br/>
                <div class="score-display" style="border: 1px dashed #666; padding: 20px; margin: 20px;">
                    <h2>FINAL SCORE: ${breakdown.total}</h2>
                    <div style="text-align: left; max-width: 300px; margin: 20px auto; font-size: 0.9rem; color: #aaa;">
                        ${breakdown.monthsScore > 0 ? `
                        <div style="display: flex; justify-content: space-between;">
                            <span>Time in Power (${breakdown.totalMonths} months):</span>
                            <span>+${breakdown.monthsScore}</span>
                        </div>` : ''}
                        ${breakdown.moneyScore > 0 ? `
                        <div style="display: flex; justify-content: space-between;">
                            <span>Swiss Account ($${engine.state.personalAccount}B):</span>
                            <span>+${breakdown.moneyScore}</span>
                        </div>` : ''}
                        ${breakdown.survivalBonus > 0 ? `
                        <div style="display: flex; justify-content: space-between; color: var(--accent-color);">
                            <span>Survival Bonus:</span>
                            <span>+${breakdown.survivalBonus}</span>
                        </div>` : ''}
                        ${breakdown.termBonus > 0 ? `
                        <div style="display: flex; justify-content: space-between; color: var(--accent-color);">
                            <span>Full Term Bonus:</span>
                            <span>+${breakdown.termBonus}</span>
                        </div>` : ''}
                    </div>
                </div>
                <button onclick="location.reload()">Try Again</button>
            </div>
        `;
        return;
    }

    const factionsHtml = Object.entries(engine.state.popularity).map(([name, value]) => {
        let colorClass = "";
        if (value > 60) colorClass = "value-positive";
        else if (value < 30) colorClass = "value-negative";
        return `
            <div class="stat-item">
                <span class="stat-label">${name}</span>
                <span class="stat-value ${colorClass}">${value}%</span>
            </div>
        `;
    }).join('');

    const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][engine.state.month - 1];

    app.innerHTML = `
        <div class="header">
            <h1>EL PRESIDENTE</h1>
            <div class="status-bar">
                <span>${monthName} ${engine.state.year}</span>
                <span>TREASURY: $${engine.state.treasury}B</span>
                <span>SWISS ACCT: <span style="color: var(--accent-color)">$${engine.state.personalAccount}B</span></span>
            </div>
        </div>

        <div class="stats-grid">
            ${factionsHtml}
        </div>

        <div class="main-monitor">
            ${currentEvent ? `
                <div>
                    <h2>// INCOMING MESSAGE: ${currentEvent.title}</h2>
                    <hr style="border-color: #333; opacity: 0.5; margin: 15px 0" />
                    <p class="event-text">${currentEvent.description}</p>
                </div>
                <div class="choices" id="choice-container">
                    <!-- Choices injected via JS to bind events -->
                </div>
            ` : `
                <div style="text-align: center; padding: 20px 50px;">
                    <h2>// INTELLIGENCE REPORT</h2>
                    <hr style="border-color: #333; opacity: 0.5; margin: 15px 0" />
                    
                    ${changes ? generateChangesHtml(changes, engine.state) : ''}
                    
                    <p style="color: #ffd700; font-size: 1.25rem; font-style: italic; margin: 30px 0;">${lastLog}</p>
                    <button id="next-turn-btn">Continue to Next Month</button>
                    <br/><br/><button class="danger" id="escape-btn">Run Away to Switzerland</button>
                </div>
            `}
        </div>
        
        ${lastLog && currentEvent ? `<div class="status-bar"><span style="color: var(--warning-color)">> ${lastLog}</span></div>` : ''}
    `;

    // Bind events
    if (currentEvent) {
        const container = document.getElementById('choice-container');
        if (container) {
            currentEvent.choices.forEach((choice) => {
                const btn = document.createElement('button');
                btn.textContent = `> ${choice.text}`;
                btn.onclick = () => {
                    engine.makeChoice(choice);
                };
                container.appendChild(btn);
            });
        }
    } else {
        const nextBtn = document.getElementById('next-turn-btn');
        if (nextBtn) {
            nextBtn.onclick = () => {
                engine.nextTurn();
            };
        }
        const escapeBtn = document.getElementById('escape-btn');
        if(escapeBtn) {
            escapeBtn.onclick = () => {
                engine.escape();
                render(engine, null, "");
            }
        }
    }
}

// Bootstrap
const engine = new GameEngine(
    (state, log, changes) => { render(engine, null, log || "", changes); },
    (msg) => { /* Game Over dealt with in render */ },
    (event) => { render(engine, event, event ? "" : "No new major events. The country is eerily stable."); }
);

// Start with the first event hardcoded or random
engine.nextTurn();

