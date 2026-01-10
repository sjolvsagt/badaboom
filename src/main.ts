import './style.css'
import { GameEngine } from './game';
import { GameEvent, Choice, Faction } from './types';
import { calculateScore } from './rules';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Simple UI Render
function render(engine: GameEngine, currentEvent: GameEvent | null, lastLog: string) {
    if (!app) return;

    if (!engine.state.isAlive || engine.state.isExiled) {
        const score = calculateScore(engine.state, engine.state.isAlive); // isAlive is true if exiled (escaped), false if dead
        app.innerHTML = `
            <div class="main-monitor" style="text-align: center; justify-content: center;">
                <h1 style="color: var(--danger-color)">GAME OVER</h1>
                <p class="event-text">${engine.state.gameOverReason}</p>
                <br/>
                <div class="score-display" style="border: 1px dashed #666; padding: 20px; margin: 20px;">
                    <h2>FINAL SCORE: ${score}</h2>
                    <p>You survived until ${engine.state.month}/${engine.state.year}</p>
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
                <span>TREASURY: $${engine.state.treasury}M</span>
                <span>SWISS ACCT: <span style="color: var(--accent-color)">$${engine.state.personalAccount}M</span></span>
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
                <div style="text-align: center; padding: 50px;">
                    <p class="event-text">Checking intelligence reports...</p>
                    <p style="color: #666; font-style: italic;">${lastLog}</p>
                    <button id="next-turn-btn">Continue to Next Month</button>
                    ${engine.state.personalAccount > 10 ? '<br/><br/><button class="danger" id="escape-btn">Run Away With The Money</button>' : ''}
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
    (state, log) => { render(engine, null, log || ""); },
    (msg) => { /* Game Over dealt with in render */ },
    (event) => { render(engine, event, event ? "" : "No new major events. The country is eerily stable."); }
);

// Start with the first event hardcoded or random
engine.nextTurn();

