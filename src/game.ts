import { EVENTS } from './events';
import { Choice, Faction, GameEvent, GameState, StateChanges } from './types';
import { checkGameOver, checkDanger, calculateScore } from './rules';

export class GameEngine {
    state: GameState;
    eventQueue: GameEvent[];
    onStateChange: (state: GameState, logMsg?: string, changes?: StateChanges) => void;
    onGameOver: (message: string) => void;
    onEventTriggered: (event: GameEvent | null) => void;

    constructor(
        onStateChange: (s: GameState, l?: string, c?: StateChanges) => void, 
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
            // 50 Billion base treasury
            treasury: 50, 
            // Start with 0 in Swiss Account
            personalAccount: 0,
            popularity: {
                [Faction.Army]: 50,
                [Faction.Public]: 50,
                [Faction.Oligarchs]: 50,
                [Faction.USA]: 50,
                [Faction.Cartels]: 30, // Start lower
                [Faction.Guerillas]: 20
            },
            isAlive: true,
            isExiled: false,
            isVictory: false
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

        // Check for Term End (4 years = Jan 2030)
        if (this.state.year >= 2030) {
             this.finishGame("You survived your full 4-year term! A historic achievement.");
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
        // Snapshot pre-state for diff
        // We use JSON parse/stringify for a quick deep copy of the simple state object
        const preState: GameState = JSON.parse(JSON.stringify(this.state));

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

        // Calculate changes
        const changes: StateChanges = {
            treasury: this.state.treasury - preState.treasury,
            personalAccount: this.state.personalAccount - preState.personalAccount,
            popularity: {}
        };

        (Object.keys(this.state.popularity) as Faction[]).forEach(key => {
            const diff = this.state.popularity[key] - preState.popularity[key];
            if (diff !== 0) {
                changes.popularity[key] = diff;
            }
        });

        this.onStateChange(this.state, logMsg, changes);
        
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
        this.state.isVictory = true;
        this.state.gameOverReason = reason;
        const score = calculateScore(this.state, true);
        
        // Trigger render via onEventTriggered(null) which will now pick up the Victory state
        this.onEventTriggered(null);
    }

    escape() {
        // 10% Chance of being caught check
        const caughtRoll = Math.random();
        if (caughtRoll < 0.10) {
            this.state.isAlive = false;
            this.state.isExiled = false; // Caught, not exiled
            this.state.gameOverReason = "INTERCEPTED. You tried to flee the country, but the authorities caught you at the airport. You spend the rest of your life in a less-than-luxurious cell with a few rats as your only friends.";
            const score = calculateScore(this.state, false);
            this.onGameOver(`${this.state.gameOverReason}\n\nYour flight was cancelled.\nFinal Score: ${score}`);
            return;
        }

        this.state.isExiled = true;
        this.state.isAlive = true; // Alive but exiled
        const score = calculateScore(this.state, true);
        
        const unit = this.state.personalAccount === 1 ? "billion" : "billions";
        let reason = `You fled to Switzerland with ${this.state.personalAccount} ${unit}! A comfortable retirement.`;

        // Check who was about to kill you to add flavor text
        if (this.state.popularity[Faction.Army] <= 10) reason += "\nThe Army was mobilizing, but you are already sipping martinis in Zurich.";
        else if (this.state.popularity[Faction.Public] <= 10) reason += "\nA mob storms the palace, but you fly away in your chopper.";
        else if (this.state.popularity[Faction.Cartels] <= 10) reason += "\nThe hitmen arrive at an empty palace.";
        else if (this.state.popularity[Faction.USA] <= 10) reason += "\nThe CIA extraction team finds an empty office.";
        
        this.state.gameOverReason = reason;

        this.onGameOver(`${reason}\n\nESCAPED.\nFinal Score: ${score}`);
    }
}
