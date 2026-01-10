import { EVENTS } from './events';
import { Choice, Faction, GameEvent, GameState } from './types';
import { checkGameOver, checkDanger, calculateScore } from './rules';

export class GameEngine {
    state: GameState;
    eventQueue: GameEvent[];
    onStateChange: (state: GameState, logMsg?: string) => void;
    onGameOver: (message: string) => void;
    onEventTriggered: (event: GameEvent | null) => void;

    constructor(
        onStateChange: (s: GameState, l?: string) => void, 
        onGameOver: (m: string) => void,
        onEventTriggered: (e: GameEvent | null) => void
    ) {
        this.onStateChange = onStateChange;
        this.onGameOver = onGameOver;
        this.onEventTriggered = onEventTriggered;
        this.eventQueue = [...EVENTS];
        
        // Initial State
        this.state = {
            month: 1,
            year: 2026,
            // 50 Million base treasury
            treasury: 50, 
            // 5 Personal stash - a modest starting gift
            personalAccount: 5,
            popularity: {
                [Faction.Army]: 50,
                [Faction.Public]: 50,
                [Faction.Oligarchs]: 50,
                [Faction.USA]: 50,
                [Faction.Cartels]: 30, // Start lower
                [Faction.Guerillas]: 20
            },
            isAlive: true,
            isExiled: false
        };
    }

    start() {
        this.nextTurn();
    }

    nextTurn() {
        if (!this.state.isAlive || this.state.isExiled) {
            this.onEventTriggered(null);
            return;
        }

        // Check if we have events left
        if (this.eventQueue.length === 0) {
             this.finishGame("You survived your term! (No more events available)");
             return;
        }

        // Pick event: Force 'initial_speech' first, then random
        let eventIndex = -1;
        const firstEventIndex = this.eventQueue.findIndex(e => e.id === 'initial_speech');
        
        if (firstEventIndex !== -1) {
            eventIndex = firstEventIndex;
        } else {
            eventIndex = Math.floor(Math.random() * this.eventQueue.length);
        }

        const originalEvent = this.eventQueue[eventIndex];
        this.eventQueue.splice(eventIndex, 1);

        // CLONE the event because we might modify choices dynamically
        const event: GameEvent = {
            ...originalEvent,
            choices: [...originalEvent.choices]
        };

        // Check if we are in danger to offer escape
        if (checkDanger(this.state)) {
            event.choices.push({
                text: "⚠️ ESCAPE: Flee to Switzerland 🇨🇭 (Game Over)",
                effect: (s, log) => {
                    this.escape();
                }
            });
        }

        this.onEventTriggered(event);
    }

    makeChoice(choice: Choice) {
        // Apply effect
        let logMsg = "";
        
        // If the choice triggers an escape, it sets isExiled=true.
        // We capture this BEFORE checking status
        choice.effect(this.state, (msg) => logMsg = msg);
        
        if (this.state.isExiled) {
             // Game is over due to escape, do not process monthly decay or death checks
             // BUT we must trigger the UI update to show the Game Over screen
             this.onStateChange(this.state, logMsg);
             return;
        }

        // Monthly decay/maintenance
        this.monthlyProcess();

        this.onStateChange(this.state, logMsg);
        
        // Check for Game Over conditions
        this.checkStatus();
    }

    monthlyProcess() {
        this.state.month++;
        if (this.state.month > 12) {
            this.state.month = 1;
            this.state.year++;
        }
        
        // Treasury burn
        this.state.treasury -= 2;

        // Natural popularity decay (it's hard to be popular)
        Object.keys(this.state.popularity).forEach(key => {
            const k = key as Faction;
            if (this.state.popularity[k] > 50) {
                this.state.popularity[k] -= 1;
            }
        });
    }

    checkStatus() {
        // Use external rules
        const result = checkGameOver(this.state);
        
        if (result.isGameOver) {
            this.die(result.reason);
        }
    }

    die(reason: string) {
        this.state.isAlive = false;
        this.state.gameOverReason = reason;
        const score = calculateScore(this.state, false);
        this.onGameOver(`${reason}\n\nYour regime has fallen.\nFinal Score: ${score}`);
    }

    finishGame(reason: string) {
        this.state.isAlive = true; 
        const score = calculateScore(this.state, true);
        this.onGameOver(`${reason}\n\nVICTORY?\nFinal Score: ${score}`);
    }

    escape() {
        this.state.isExiled = true;
        this.state.isAlive = true; // Alive but exiled
        const score = calculateScore(this.state, true);
        
        let reason = `You fled to Switzerland with ${this.state.personalAccount} million! A comfortable retirement.`;

        // Check who was about to kill you to add flavor text
        if (this.state.popularity[Faction.Army] <= 10) reason += "\nThe Army was mobilizing, but you are already sipping martinis in Zurich.";
        else if (this.state.popularity[Faction.Public] <= 10) reason += "\nA mob storms the palace, but you fly away in your chopper.";
        else if (this.state.popularity[Faction.Cartels] <= 10) reason += "\nThe hitmen arrive at an empty palace.";
        else if (this.state.popularity[Faction.USA] <= 10) reason += "\nThe CIA extraction team finds an empty office.";
        
        this.state.gameOverReason = reason;

        this.onGameOver(`${reason}\n\nESCAPED.\nFinal Score: ${score}`);
    }
}
