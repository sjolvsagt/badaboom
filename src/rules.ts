import { Faction, GameState } from './types';

export type GameOverResult = {
    isGameOver: boolean;
    reason: string;
};

export type DangerCheckResult = {
    isInDanger: boolean;
    dangerReason?: string;
};

// Returns a game over result if a condition is met
export function checkGameOver(state: GameState): GameOverResult {
    // 1. Treasury Hard Fail
    if (state.treasury < 0) {
        return { isGameOver: true, reason: "The country is bankrupt. The IMF seizures government assets, including your chair." };
    }

    const roll = Math.random();

    // 2. Army
    if (state.popularity[Faction.Army] === 0) {
        return { isGameOver: true, reason: "The Army has staged a coup. You face the firing squad." };
    }
    if (state.popularity[Faction.Army] <= 10) {
        if (roll < 0.5) return { isGameOver: true, reason: "The Army has staged a coup. You face the firing squad." };
    }

    // 3. Public
    if (state.popularity[Faction.Public] === 0) {
        return { isGameOver: true, reason: "A mob storms the palace. It does not end well." };
    }
    if (state.popularity[Faction.Public] <= 10) {
        if (roll < 0.5) return { isGameOver: true, reason: "A mob storms the palace. It does not end well." };
    }

    // 4. USA
    if (state.popularity[Faction.USA] === 0) {
        return { isGameOver: true, reason: "The CIA organizes a 'regime change'. You are extracted to a black site." };
    }
    if (state.popularity[Faction.USA] <= 10) {
        if (roll < 0.5) return { isGameOver: true, reason: "The CIA organizes a 'regime change'. You are extracted to a black site." };
    }

    // 5. Cartels
    if (state.popularity[Faction.Cartels] === 0) {
        return { isGameOver: true, reason: "A car bomb explodes your motorcade. 'El Fantasma' sends his regards." };
    }
    if (state.popularity[Faction.Cartels] <= 10) {
        if (roll < 0.5) return { isGameOver: true, reason: "A car bomb explodes your motorcade. 'El Fantasma' sends his regards." };
    }

    // 6. Guerillas (0 and Army < 25)
    if (state.popularity[Faction.Guerillas] === 0 && state.popularity[Faction.Army] < 25) {
        if (roll < 0.3) return { isGameOver: true, reason: "Viva la revolucion! The rebels overrun the capital." };
    }

    // 7. Oligarchs (0 and USA < 25)
    if (state.popularity[Faction.Oligarchs] === 0 && state.popularity[Faction.USA] < 25) {
        if (roll < 0.3) return { isGameOver: true, reason: "The business elite and the CIA decide you are bad for business. You are removed." };
    }

    return { isGameOver: false, reason: "" };
}

// Checks if we should show the "Escape" button (In the danger zone)
export function checkDanger(state: GameState): boolean {
    if (state.popularity[Faction.Army] <= 10) return true;
    if (state.popularity[Faction.Public] <= 10) return true;
    if (state.popularity[Faction.USA] <= 10) return true;
    if (state.popularity[Faction.Cartels] <= 10) return true;
    if (state.popularity[Faction.Guerillas] === 0 && state.popularity[Faction.Army] < 25) return true;
    if (state.popularity[Faction.Oligarchs] === 0 && state.popularity[Faction.USA] < 25) return true;
    
    return false;
}

export function calculateScore(state: GameState, survived: boolean): number {
    let score = 0;
    
    // 1. Time in power (1 point per month)
    // Assuming start is Jan 2026.
    const startYear = 2026;
    const startMonth = 1;
    const months = (state.year - startYear) * 12 + (state.month - startMonth);
    score += Math.max(0, months);

    // 2. Money Stolen (1 point per 10m)
    score += Math.floor(state.personalAccount / 10);

    // 3. Survival Bonus
    if (survived) {
        score += 5;
    }

    return score;
}
