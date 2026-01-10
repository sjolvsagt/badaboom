import { Faction, GameEvent, GameState } from './types';

// Helper to modify faction popularity safely
const mod = (state: GameState, faction: Faction, amount: number) => {
    state.popularity[faction] = Math.max(0, Math.min(100, state.popularity[faction] + amount));
};

export const EVENTS: GameEvent[] = [
    // --- ORIGINAL EVENTS ---
    {
        id: 'initial_speech',
        title: 'Inauguration Day Speech',
        description: 'It is January 2026. You step onto the balcony of the Casa de Nariño. The square is packed. Donald Trump has just sent a tweet warning you not to "mess up the remittance flow". The local Cartels are quiet, watching. What is the theme of your first address?',
        choices: [
            {
                text: 'Promise "Iron Fist" security measures.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 15);
                    mod(s, Faction.USA, 5);
                    mod(s, Faction.Public, -15);
                    mod(s, Faction.Guerillas, -10);
                    log("General Montoya nods approvingly from the shadows.");
                }
            },
            {
                text: 'Promise "Social Justice" and redistribution.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.Guerillas, 5);
                    mod(s, Faction.Oligarchs, -15);
                    mod(s, Faction.USA, -10);
                    s.treasury -= 5;
                    log("The crowd roars! The US Ambassador checks his phone nervously.");
                }
            },
            {
                text: 'Promise "Free Market" and open business.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 15);
                    mod(s, Faction.USA, 5);
                    mod(s, Faction.Public, -20);
                    mod(s, Faction.Guerillas, -2);
                    mod(s, Faction.Cartels, 2); // Easier to wash money
                    s.treasury += 5;
                    s.personalAccount += 2;
                    log("Stocks in Bogota rally immediately.");
                }
            }
        ]
    },
    {
        id: 'venezuela_crisis',
        title: 'Border Tension',
        description: 'Thousands of refugees are crossing from Venezuela as the economic situation there worsens. The Venezuelan Regime accuses you of harboring "imperialist spies" amongst them. Trump demands you "build a wall" (which he won\'t pay for).',
        choices: [
            {
                text: 'Close the border and deploy the Army.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 5);
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.Public, -14);
                    s.treasury -= 2;
                    log("The border is sealed. Human rights groups are furious, but Washington is happy.");
                }
            },
            {
                text: 'Accept the refugees and ask for UN aid.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 6);
                    mod(s, Faction.USA, -5);
                    mod(s, Faction.Oligarchs, -5);
                    s.treasury -= 5;
                    log("It strains the budget, but it's the humane thing to do.");
                }
            },
            {
                text: 'Secretly arm anti-Regime rebels in the crowd.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 10);
                    mod(s, Faction.Guerillas, -15); 
                    mod(s, Faction.Public, -5);
                    s.treasury -= 1
                    log("A risky play. The CIA sends a fruit basket.");
                }
            }
        ]
    },
    {
        id: 'drug_lord_offer',
        title: 'A humble offer from "El Fantasma"',
        description: 'The infamous drug lord "El Fantasma" has sent a representative. He wants the police to look the other way in the port of Buenaventura for one week. In exchange, he offers to pay off a significant chunk of the national debt... or your personal retirement fund.',
        choices: [
            {
                text: 'Reject the offer and raid his compound!',
                effect: (s, log) => {
                    mod(s, Faction.Cartels, -20);
                    mod(s, Faction.USA, 5);
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Guerillas, 2);
                    log("War it is. Car bombs are reported in Cali the next day.");
                }
            },
            {
                text: 'Accept the money for the Treasury.',
                effect: (s, log) => {
                    mod(s, Faction.Cartels, 10);
                    mod(s, Faction.USA, -15);
                    mod(s, Faction.Public, -5);
                    mod(s, Faction.Guerillas, -2);
                    s.treasury += 35;
                    log("The budget is balanced... with blood money.");
                }
            },
            {
                text: 'Accept the money into your Swiss account.',
                effect: (s, log) => {
                    mod(s, Faction.Cartels, 10);
                    mod(s, Faction.Public, -15);
                    mod(s, Faction.Oligarchs, -5);
                    s.personalAccount += 15;
                    log("You have a very nice new yacht in the catalog.");
                }
            }
        ]
    },
    {
        id: 'crypto_scheme',
        title: 'The "crypto-peso" Initiative',
        description: 'Your nephew, a tech-bro who spends too much time in Miami, suggests replacing the peso with a new cryptocurrency to bypass inflation and sanctions. The Oligarchs are skeptical.',
        choices: [
            {
                text: 'Launch the Crypto-Peso! To the moon!',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, -20);
                    mod(s, Faction.Public, -5); 
                    mod(s, Faction.Cartels, 5); // Laundering heaven
                    s.treasury -= 10;
                    log("The launch is a disaster. The value crashes in 4 hours.");
                }
            },
            {
                text: 'Stick to traditional banking but lower interest rates.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    mod(s, Faction.Public, -5);
                    mod(s, Faction.Cartels, -2); // Harder to move cash
                    log("Boring, but safe.");
                }
            }
        ]
    },
    {
        id: 'trump_golf',
        title: 'A Round of Golf',
        description: 'President Trump visits for a diplomatic summit, but mostly wants to check out a potential site for a new golf course in a protected nature reserve.',
        choices: [
            {
                text: 'Approve the golf course. Destroy the forest.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 10);
                    mod(s, Faction.Public, -15);
                    mod(s, Faction.Guerillas, 5);
                    mod(s, Faction.Oligarchs, -5); // Disruption
                    s.personalAccount += 2; 
                    log("You are hailed as a 'Very smart negotiator' on Truth Social.");
                }
            },
            {
                text: 'Refuse. The environment is sacred.',
                effect: (s, log) => {
                    mod(s, Faction.USA, -15);
                    mod(s, Faction.Public, 5);
                    log("Trump tweets major insults about your appearance.");
                }
            }
        ]
    },
    {
        id: 'elon_lithium',
        title: 'The Techno-King Arrives',
        description: 'Elon Musk tweets "Colombia is based" and lands his private jet. He wants exclusive rights to mine lithium in the Amazon, promising a Gigafactory. The catch? It requires displacing a protected indigenous tribe.',
        choices: [
            {
                text: 'Deal! We need the tech jobs.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 10);
                    mod(s, Faction.USA, 5);
                    mod(s, Faction.Public, -20);
                    mod(s, Faction.Guerillas, 5); 
                    s.treasury += 20;
                    log("Tesla announces 'Giga-Bogota'. Protesters glue themselves to the entrance.");
                }
            },
            {
                text: 'No. The Amazon is not for sale.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.USA, -5);
                    mod(s, Faction.Oligarchs, -10);
                    log("Elon calls you a 'pedoyguy' on X. Your popularity with youth drops slightly.");
                }
            },
            {
                text: 'Tell him he can only mine if he buys the national airline first.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    mod(s, Faction.Public, -10);
                    s.treasury += 5;
                    log("He actually does it. The airline is renamed 'X-Air' and now accepts Dogecoin.");
                }
            }
        ]
    },
    {
        id: 'pop_star_tax',
        title: 'Hips Don\'t Lie (But Taxes Might)',
        description: 'Colombia\'s biggest pop star is accused of evading $15M in taxes. She threatens to release a diss track about your administration if you pursue the case.',
        choices: [
            {
                text: 'Prosecute her! Everyone must pay.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5); 
                    mod(s, Faction.Oligarchs, -10); 
                    s.treasury += 15;
                    log("The money is recovered. The diss track hits #1 on Spotify, mocking your suit.");
                }
            },
            {
                text: 'Pardon her. She is a national treasure.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Oligarchs, 5);
                    mod(s, Faction.Guerillas, -5);
                    mod(s, Faction.Army, -10);
                    mod(s, Faction.Cartels, 2); // She performs at their parties
                    log("She performs at your birthday party. Critics call it a 'circus'.");
                }
            }
        ]
    },
    {
        id: 'copa_america',
        title: 'Copa América Final',
        description: 'Colombia has reached the final of the Copa América against Argentina. The mood in the country is electric. A win would boost morale, but the team needs... "motivation".',
        choices: [
            {
                text: 'Promise each player a tax-free house if they win.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 15);
                    mod(s, Faction.Oligarchs, -10);
                    mod(s, Faction.Army, -10);
                    s.treasury -= 5;
                    log("They win! The party lasts for a week. Productivity drops to zero, but you are a god.");
                }
            },
            {
                text: 'Just attend and clap.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Army, -5);
                    mod(s, Faction.Oligarchs, -5);
                    log("You are booed slightly when shown on the jumbotron.");
                }
            },
            {
                text: 'Bribe the referees. We MUST win.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.USA, -10);
                    mod(s, Faction.Oligarchs, -5);
                    s.treasury -= 10;
                    s.personalAccount -= 2; 
                    log("It works, but it's obvious. FIFA investigates, but who cares? Check the scoreboard.");
                }
            }
        ]
    },
    
    // --- REALISTIC / BORING EVENTS ---
    {
        id: 'road_maintenance',
        title: 'Pothole Pandemic',
        description: 'A major highway in Bogota has more holes than Swiss cheese. Commuters are furious, but the repair budget is tight.',
        choices: [
            {
                text: 'Fix the roads properly.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    s.treasury -= 5;
                    log("Traffic flows smoothly for about a week.");
                }
            },
            {
                text: 'Ignore it. People should walk.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -10);
                    mod(s, Faction.Oligarchs, -5); 
                    log("A meme of you falling into a pothole goes viral.");
                }
            }
        ]
    },
    {
        id: 'coffee_rust',
        title: 'Coffee Rust Outbreak',
        description: 'A fungal disease is destroying coffee crops in the Eje Cafetero. Farmers are demanding subsidies.',
        choices: [
            {
                text: 'Subsidize the farmers.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Oligarchs, -5);
                    mod(s, Faction.Guerillas, -2); // State presence hurts them
                    s.treasury -= 8;
                    log("The harvest is saved, but the Treasury takes a hit.");
                }
            },
            {
                text: 'Let the free market decide.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -15);
                    mod(s, Faction.Oligarchs, 5);
                    mod(s, Faction.Guerillas, 5); // Displaced farmers join rebels
                    log("Small farms go bankrupt. Starbucks stock goes up.");
                }
            }
        ]
    },
   {
        id: 'teachers_strike',
        title: 'National Teachers Strike',
        description: 'FECODE (The teachers union) has shut down schools, demanding better healthcare and wages.',
        choices: [
            {
                text: 'Meet their demands.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.Oligarchs, -10);
                    mod(s, Faction.Guerillas, 2); // Solidarity
                    s.treasury -= 10;
                    log("Classes resume. The fiscal deficit widens.");
                }
            },
            {
                text: 'Send in the ESMAD (Riot Police).',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.Public, -15);
                    mod(s, Faction.Guerillas, 5); // Recruitment drive
                    log("Tear gas in the streets. Parents are furious.");
                }
            }
        ]
    },
    {
        id: 'medellin_smog',
        title: 'Smog Emergency in Medellin',
        description: 'Air quality in the Aburrá Valley is critical. Doctors recommend banning cars for 3 days.',
        choices: [
            {
                text: 'Ban cars.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Oligarchs, -10); // Business disrupted
                    log("The sky clears, but the Chamber of Commerce sends an angry letter.");
                }
            },
            {
                text: 'Keep the economy moving.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -10);
                    mod(s, Faction.Oligarchs, 5);
                    log("Hospitals fill up with respiratory cases.");
                }
            }
        ]
    },
     {
        id: 'el_nino_drought',
        title: 'El Niño Energy Crisis',
        description: 'Reservoir levels are historically low due to drought. Hydroelectric dams are failing.',
        choices: [
            {
                text: 'Implement rationing blackouts.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -15);
                    mod(s, Faction.Oligarchs, -15);
                    log("Candle sales skyrocket. Your approval ratings plummet.");
                }
            },
            {
                text: 'Buy expensive gas from neighbors.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5);
                    s.treasury -= 15;
                    log("Lights stay on, but the bill is astronomical.");
                }
            }
        ]
    },
     {
        id: 'tax_reform',
        title: 'The Annual Tax Reform',
        description: 'The Finance Minister says we are broke. Again. He proposes taxing basic food items.',
        choices: [
            {
                text: 'Approve the tax. We need stability.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 10);
                    mod(s, Faction.USA, 5); // IMF is happy
                    mod(s, Faction.Public, -20);
                    s.treasury += 20;
                    log("Protests erupt immediately. The IMF upgrades our credit rating.");
                }
            },
            {
                text: 'Tax the rich instead.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, -20);
                    mod(s, Faction.Public, 10);
                    s.treasury += 10;
                    log("Capital flight accelerates. But you are a hero to the working class.");
                }
            },
            {
                text: 'Do nothing. Print money.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5); // Short term gain
                    mod(s, Faction.Oligarchs, -5);
                    s.treasury -= 5; // Inflation devaluation
                    log("Inflation ticks up to 15%.");
                }
            }
        ]
    },
    
    // --- 2026 / TECH / FUN EVENTS ---
    {
        id: 'ai_cabinet',
        title: 'The AI Minister',
        description: 'A silicon valley startup offers to replace your corrupt Transport Minister with an AI named "TransmilenioGPT".',
        choices: [
            {
                text: 'Install the AI.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    mod(s, Faction.Public, -5); // Distrust
                    s.treasury += 5; // Efficiency
                    log("The AI routes all buses perfectly, but refuses to take bribes.");
                }
            },
            {
                text: 'Keep the human.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Oligarchs, -5);
                    log("Business as usual. Inefficiency is a human right.");
                }
            }
        ]
    },
    {
        id: 'narco_hippos',
        title: 'Attack of the Narco-Hippos',
        description: 'Pablo Escobar\'s hippos have multiplied and are now threatening a major town. Biology experts are baffled.',
        choices: [
            {
                text: 'Cull them. Sorry.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -10); // Animal lovers angry
                    mod(s, Faction.Army, 5); // Target practice
                    log("International outcry. Netflix makes a documentary about your cruelty.");
                }
            },
            {
                text: 'Send them to the USA as a "gift".',
                effect: (s, log) => {
                    mod(s, Faction.USA, -10);
                    mod(s, Faction.Public, 10);
                    s.treasury -= 5;
                    log("Florida now has a wild hippo problem. Trump is furious.");
                }
            }
        ]
    },
    {
        id: 'guerilla_nft',
        title: 'Rebel NFTs',
        description: 'The ELN guerillas are funding their war by selling "Revolutionary Ape" NFTs on the blockchain.',
        choices: [
            {
                text: 'Ban crypto exchanges.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, -10);
                    mod(s, Faction.Guerillas, -5);
                    log("Tech bros leave the country.");
                }
            },
            {
                text: 'Buy one. It looks cool.',
                effect: (s, log) => {
                    mod(s, Faction.Guerillas, 5);
                    mod(s, Faction.Army, -10);
                    mod(s, Faction.USA, -5);
                    s.personalAccount -= 1;
                    log("You are now the owner of Ape #420. The Army is confused.");
                }
            }
        ]
    },
    {
        id: 'influencer_scandal',
        title: 'TikTok Diplomacy',
        description: 'Your Foreign Minister was caught dancing on TikTok while the UN discussed sanctions.',
        choices: [
            {
                text: 'Fire him.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5); // Professionalism
                    log("He becomes a full-time streamer and attacks you daily.");
                }
            },
            {
                text: 'Join him in a duet.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10); // Youth vote
                    mod(s, Faction.USA, -5); // Unprofessional
                    mod(s, Faction.Army, -5);
                    log("The video gets 50M views. Global embarrassment.");
                }
            }
        ]
    },

    // --- CARTEL / CRIME ---
    {
        id: 'prison_riot',
        title: 'Riot in La Picota',
        description: 'Inmates have taken control of the country\'s largest prison.',
        choices: [
            {
                text: 'Storm it with special forces.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.Public, -5);
                    mod(s, Faction.Cartels, -10);
                    log("Bloody, but effective. Order restored.");
                }
            },
            {
                text: 'Negotiate.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Army, -10);
                    mod(s, Faction.Cartels, 5);
                    log("They demanded better food and Xboxes. You gave in.");
                }
            }
        ]
    },
    {
        id: 'illegal_mining',
        title: 'Gold Rush chaos',
        description: 'Illegal gold mining in the Amazon is poisoning rivers with mercury. The miners are backed by armed groups.',
        choices: [
            {
                text: 'Bomb the machinery.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.Guerillas, -10);
                    mod(s, Faction.Public, 5); // Environmental win
                    log("The river is safer, but the miners vow revenge.");
                }
            },
            {
                text: 'Tax them and look away.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    mod(s, Faction.Cartels, 5);
                    mod(s, Faction.Public, -10);
                    s.treasury += 10;
                    s.personalAccount += 5;
                    log("The fish are dying, but your pockets are full.");
                }
            }
        ]
    },

    // --- INTERNATIONAL ---
    {
        id: 'chinese_train',
        title: 'The Silk Road',
        description: 'China offers to build a high-speed train from Bogota to the coast. The US warns against "debt traps".',
        choices: [
            {
                text: 'Accept the deal. We need trains!',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.Oligarchs, 5);
                    mod(s, Faction.USA, -15);
                    s.treasury += 15; // Loan injection
                    log("Construction starts. Washington cancels your visa.");
                }
            },
            {
                text: 'Reject it. Loyalty to the US.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 10);
                    mod(s, Faction.Public, -5);
                    log("We stay with our old trucks. Traffic remains terrible.");
                }
            }
        ]
    },
    {
        id: 'russian_spies',
        title: 'From Russia With Love',
        description: 'Intelligence suggests Russian diplomats are funding local protests.',
        choices: [
            {
                text: 'Expel them immediately.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 10);
                    mod(s, Faction.Public, 5); // Patriotism
                    mod(s, Faction.Guerillas, -5);
                    log("Putin calls you a 'NATO puppet'.");
                }
            },
            {
                text: 'Do nothing. They buy our flowers.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    mod(s, Faction.USA, -10);
                    log("The protests continue, but flower exports are safe.");
                }
            }
        ]
    },

    // --- RANDOM / CULTURAL ---
    {
        id: 'football_hooligan',
        title: 'Stadium Violence',
        description: 'The "Clasico" between Millonarios and Nacional ended in a riot.',
        choices: [
            {
                text: 'Ban fans from stadiums for a month.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -15); // They love football
                    mod(s, Faction.Army, 5); // Less work
                    mod(s, Faction.Cartels, -2); // Sales drop
                    log("Weekends are boring. People are grumpy.");
                }
            },
            {
                text: 'Blame it on "social decay".',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5);
                    log("A speech does nothing to clean the blood.");
                }
            }
        ]
    },
    {
        id: 'miss_universe',
        title: 'Miss Universe Host',
        description: 'The organization wants to host the next pageant in Cartagena. It costs millions but brings tourists.',
        choices: [
            {
                text: 'Host it!',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.Oligarchs, 10);
                    mod(s, Faction.Cartels, 5); // They love pageants
                    s.treasury -= 10;
                    log("Glitz, glamour, and traffic jams.");
                }
            },
            {
                text: 'Too expensive.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5);
                    mod(s, Faction.Oligarchs, -5);
                    s.treasury += 2;
                    log("Cartagena hoteliers are crying.");
                }
            }
        ]
    },
    {
        id: 'avocado_boom',
        title: 'The Avocado Rush',
        description: 'Global demand for avocados is skyrocketing. Cartels are seizing land to grow "green gold".',
        choices: [
            {
                text: 'Protect the small farmers.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Cartels, -10);
                    mod(s, Faction.Army, 5); // Deployed
                    s.treasury -= 2;
                    log("The army guards the guacamole.");
                }
            },
            {
                text: 'Let the market (and guns) decide.',
                effect: (s, log) => {
                    mod(s, Faction.Cartels, 10);
                    mod(s, Faction.Public, -5);
                    mod(s, Faction.Oligarchs, 5); // More exports
                    log("Exports boom. Violence booms.");
                }
            }
        ]
    },
    {
        id: 'amazon_fire',
        title: 'Amazon Burning',
        description: 'Fires are raging in Chiribiquete. Environmentalists say it\'s deliberate for cattle ranching.',
        choices: [
            {
                text: 'Send all available water bombers.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.Oligarchs, -5); // Cattle ranchers angry
                    mod(s, Faction.Guerillas, 2); // Saves their cover
                    s.treasury -= 5;
                    log("The fires are contained. Greta Thunberg tweets about you.");
                }
            },
            {
                text: 'Pray for rain.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -15);
                    mod(s, Faction.USA, -5);
                    mod(s, Faction.Guerillas, -2); // Their camps burn
                    log("The smoke reaches Bogota.");
                }
            }
        ]
    },

    // --- ABSURD / RANDOM ---
    {
        id: 'ufo_andes',
        title: 'UFO over Nevado del Ruiz',
        description: 'Hikers report strange lights and a "metallic cigar" hovering over the volcano.',
        choices: [
            {
                text: 'Send the Air Force to intercept.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    s.treasury -= 2;
                    log("They found nothing. Or so they say.");
                }
            },
            {
                text: 'Claim it\'s a sign from God.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5); // Some believe it
                    log("A cult forms near the volcano.");
                }
            }
        ]
    },
    {
        id: 'reggeaton_ban',
        title: 'Noise Pollution',
        description: 'Conservative groups want to ban "vulgar" reggaeton lyrics from radio.',
        choices: [
            {
                text: 'Ban it. Think of the children!',
                effect: (s, log) => {
                    mod(s, Faction.Public, -10); // Youth angry
                    mod(s, Faction.Army, 5); // Conservatives happy
                    log("Radio stations play classical music. Everyone is asleep.");
                }
            },
            {
                text: 'Freedom of speech (and perreo).',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Army, -5);
                    log("The party continues.");
                }
            }
        ]
    },
    {
        id: 'lost_city_gold',
        title: 'Treasure Hunter',
        description: 'An explorer claims to have found the legendary "El Dorado" gold stash. He needs a permit.',
        choices: [
            {
                text: 'Give permit. 50% state tax.',
                effect: (s, log) => {
                    s.treasury += 1; // It was mostly pyrite
                    log("He found a few golden trinkets. Disappointing.");
                }
            },
            {
                text: 'Deny. It belongs to indigenous people.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    log("Cultural heritage preserved.");
                }
            }
        ]
    },
    
    // --- POLITICAL INTRIGUE ---
    {
        id: 'journalist_leak',
        title: 'The "Petro-Video" Leak',
        description: 'A video leaks of your brother accepting bags of cash. He says it was for "charity".',
        choices: [
            {
                text: 'Investigate your own brother.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.Oligarchs, 5);
                    log("Justice is blind. Thanksgiving dinner will be awkward.");
                }
            },
            {
                text: 'Call it a "Deepfake".',
                effect: (s, log) => {
                    mod(s, Faction.Public, -10); // They don't believe you
                    mod(s, Faction.USA, -5);
                    log("The scandal drags on for months.");
                }
            }
        ]
    },
    {
        id: 'general_coup_rumor',
        title: 'Whispers in the Barracks',
        description: 'Intelligence says General Zapateiro is unhappy with your "soft" policies.',
        choices: [
            {
                text: 'Purge the leadership. Fire him.',
                effect: (s, log) => {
                    mod(s, Faction.Army, -15); // Dangerous!
                    mod(s, Faction.Public, 5);
                    log("You are safe for now, but the officers are grumbling.");
                }
            },
            {
                text: 'Raise military salaries. Buying loyalty.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 15);
                    s.treasury -= 5;
                    log("The rumors stop. The General buys a new truck.");
                }
            }
        ]
    },
    {
        id: 'covid_26',
        title: 'New Variant: Omega-Mu',
        description: 'A new respiratory virus is spreading. WHO suggests a lockdown.',
        choices: [
            {
                text: 'Lockdown everything.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5); // Safe but bored
                    mod(s, Faction.Oligarchs, -15); // Economy hurts
                    s.treasury -= 10;
                    log("The curve is flattened. The economy is also flattened.");
                }
            },
            {
                text: 'It\'s just a flu. Keep working.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    mod(s, Faction.Public, -15); // People dying
                    log("Hospitals collapse. You are blamed.");
                }
            }
        ]
    },
    {
        id: 'bridge_collapse',
        title: 'Infrastructure Failure',
        description: 'The new bridge to Villavicencio has collapsed days after opening. Corruption is suspected.',
        choices: [
            {
                text: 'Blame the previous government.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5); // Tired of excuses
                    log("Nobody believes you anymore.");
                }
            },
            {
                text: 'Arrest the contractor (your friend).',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.Oligarchs, -10);
                    log("A brave move. You lose a golf buddy.");
                }
            }
        ]
    },
    {
        id: 'panama_canal',
        title: 'Canal Jam',
        description: 'A drought in Panama has slowed ship traffic. Imports are expensive.',
        choices: [
            {
                text: 'Subsidize refined fuel.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    s.treasury -= 10;
                    log("Prices stay stable, but the debt grows.");
                }
            },
            {
                text: 'Do nothing.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -10);
                    mod(s, Faction.Guerillas, 3); // Anger at the cost of living
                    log("Everything is 20% more expensive. People are angry.");
                }
            }
        ]
    },
    {
        id: 'shark_soup',
        title: 'Shark Fin Controversy',
        description: 'A shipment of shark fins bound for Asia was seized. Powerful traders want it released.',
        choices: [
            {
                text: 'Burn it. Save the sharks.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.Oligarchs, -5);
                    log("Environmental victory!");
                }
            },
            {
                text: 'Release it silently.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    s.personalAccount += 2; // Bribe
                    log("It disappears. Your wallet feels heavier.");
                }
            }
        ]
    },
    {
        id: 'guerrilla_peace',
        title: 'Peace Talks? Again?',
        description: 'The rebels offer a ceasefire for Christmas.',
        choices: [
            {
                text: 'Accept. Peace is good.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Army, -10); // They want to fight
                    log("The guns are silent for December.");
                }
            },
            {
                text: 'No. Attack while they rest.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 10);
                    mod(s, Faction.Guerillas, -10);
                    mod(s, Faction.Public, -5);
                    log("A surprise attack kills 20 rebels. The war goes on.");
                }
            }
        ]
    },
    {
        id: 'metro_delay',
        title: 'Bogota Metro Delayed',
        description: 'The Metro construction is delayed... for the 50th year. They found a rock.',
        choices: [
            {
                text: 'Fire the consortium.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, -10);
                    mod(s, Faction.Public, 5);
                    s.treasury -= 10; // Lawsuits
                    log("Lawyers get rich. No trains.");
                }
            },
            {
                text: 'Ask China for help.',
                effect: (s, log) => {
                    mod(s, Faction.USA, -5);
                    s.treasury -= 5;
                    log("They send engineers. It moves slightly faster.");
                }
            }
        ]
    },
    {
        id: 'netflix_series',
        title: 'Narcos Season 10',
        description: 'Netflix wants to film a new series about YOUR rise to power. It\'s not very flattering.',
        choices: [
            {
                text: 'Ban them from filming.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5);
                    mod(s, Faction.USA, -5); // Freedom of speech
                    log("Streisand effect. Everyone watches it on VPN.");
                }
            },
            {
                text: 'Demand creative control.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    s.treasury += 2; // Licensing
                    log("The show now portrays you as a superhero. Nobody watches it.");
                }
            }
        ]
    },
    {
        id: 'oil_price_crash',
        title: 'Oil Price Crash',
        description: 'Global oil prices have plummeted. Ecopetrol revenue is down 40%.',
        choices: [
            {
                text: 'Cut social programs.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -20);
                    mod(s, Faction.Oligarchs, 5); // Maintaining credit
                    log("The poor starve. The rich are fine.");
                }
            },
            {
                text: 'Increase debt.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Oligarchs, -5);
                    s.treasury -= 20;
                    log("Kick the can down the road.");
                }
            }
        ]
    },

    // --- EXPANSION PACK 1: CHAOS & CORRUPTION ---
    {
        id: 'space_program',
        title: 'Colombian Space Agency',
        description: 'A scientist in Barranquilla claims he can build a rocket to Mars using recycled bus parts and fireworks.',
        choices: [
            {
                text: 'Fund him. We need prestige!',
                effect: (s, log) => {
                    s.treasury -= 5;
                    mod(s, Faction.Public, 10);
                    log("The rocket explodes on the launchpad. But the fireworks were beautiful. National pride +1.");
                }
            },
            {
                text: 'Ignore him.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -2);
                    log("He emigrates to NASA. Typical brain drain.");
                }
            },
            {
                text: 'Put a spy satellite on it.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 10);
                    mod(s, Faction.USA, -5);
                    s.treasury -= 8;
                    log("It works! We can now see the traffic jams from space.");
                }
            }
        ]
    },
    {
        id: 'arepa_crisis',
        title: 'The Great Arepa Inflation',
        description: 'The price of corn flour has tripled. The working class can no longer afford breakfast. This is the tipping point.',
        choices: [
            {
                text: 'Subsidize the flour.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 15);
                    s.treasury -= 8;
                    log("Breakfast is saved. The people cheer with full mouths.");
                }
            },
            {
                text: 'Suggest eating "cake" instead.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -20);
                    mod(s, Faction.Oligarchs, 5);
                    log("Marie Antoinette style. Riots start in 5 minutes.");
                }
            },
            {
                text: 'Nationalize the flour mills.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, -15);
                    mod(s, Faction.Guerillas, 10);
                    mod(s, Faction.Public, 5);
                    log("The Arepas belong to the people now!");
                }
            }
        ]
    },
    {
        id: 'zombie_escobar',
        title: 'The Return of "El Patron"',
        description: 'A rumor spreads on WhatsApp that Pablo Escobar never died and is living in a basement in Itagüí. Cultists are gathering.',
        choices: [
            {
                text: 'Deny it publicly.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5);
                    log("They think you are hiding the truth. #PabloLives trends.");
                }
            },
            {
                text: 'Raid the basement.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    log("It was just an Elvis impersonator. Disappointing.");
                }
            },
            {
                text: 'Start a "Pablo Tourism" campaign.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 10);
                    mod(s, Faction.Public, -10); // Victims angry
                    s.treasury += 5;
                    log("Tourists flood in. Morally bankrupt, financially sound.");
                }
            }
        ]
    },
    {
        id: 'hacker_collective',
        title: 'Anonymous Columbia',
        description: 'Hackers have seized the Tax Office database. They threaten to delete all debt records.',
        choices: [
            {
                text: 'Let them do it! Wipe the slate clean.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 20);
                    mod(s, Faction.Oligarchs, -10); // Banks angry
                    s.treasury -= 20; // Revenue lost
                    log("People celebrate in the streets. The Treasury is empty.");
                }
            },
            {
                text: 'Pay them a ransom to restore data.',
                effect: (s, log) => {
                    s.treasury -= 10;
                    s.personalAccount -= 2; // "Handling fee"
                    log("Data restored. You look weak.");
                }
            },
            {
                text: 'Trace and arrest them.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.Public, -5);
                    log("They were just teenagers in a basement. You bully.");
                }
            }
        ]
    },
    {
        id: 'monserrate_elevator',
        title: 'The Holy Elevator',
        description: 'A company proposes an escalator to the top of Monserrate. Using it costs $50.',
        choices: [
            {
                text: 'Approve it. Progress!',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 10);
                    mod(s, Faction.Public, -5);
                    s.treasury += 2; // Taxes
                    log("The rich love it. Pilgrims hate it.");
                }
            },
            {
                text: 'Build a slide instead.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 15);
                    s.treasury -= 2;
                    log("Weeeee! Most fun country in the world.");
                }
            },
            {
                text: 'Reject. Walk as penance.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Guerillas, 1); // Respect for land
                    log("Tradition respected. Legs tired.");
                }
            }
        ]
    },
    {
        id: 'guerilla_tv',
        title: 'Revolutionary Streaming',
        description: 'The Rebels have launched "FARC-TV" on Netflix. Their cooking show "Jungle Flavors" is a hit.',
        choices: [
            {
                text: 'Ban the show.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 5);
                    mod(s, Faction.Public, -10);
                    log("It becomes the most pirated show in history.");
                }
            },
            {
                text: 'Demand royalties.',
                effect: (s, log) => {
                    s.treasury += 5;
                    mod(s, Faction.Guerillas, -5);
                    log("We take a 30% cut of the revolution.");
                }
            },
            {
                text: 'Appear as a guest judge.',
                effect: (s, log) => {
                    mod(s, Faction.Guerillas, 10);
                    mod(s, Faction.Army, -20);
                    log("The General resigns in disgust. The soup was good though.");
                }
            }
        ]
    },
    {
        id: 'biotech_soldier',
        title: 'Project: Universal Soldier',
        description: 'The Defense Minister wants to implant chips in soldiers to make them "fearless" (and obedience).',
        choices: [
            {
                text: 'Do it. Super soldiers!',
                effect: (s, log) => {
                    mod(s, Faction.Army, 15);
                    mod(s, Faction.Public, -10);
                    s.treasury -= 10;
                    log("The Army is terrifying now. Also, they occasionally blue-screen.");
                }
            },
            {
                text: 'Unethical. No.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Army, -5);
                    log("Human rights preserved. Soldiers remain human (and scared).");
                }
            },
            {
                text: 'Chip the politicians instead.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 20);
                    mod(s, Faction.Oligarchs, -15);
                    log("Best. Idea. Ever. Corruption drops to 0%.");
                }
            }
        ]
    },
    {
        id: 'darien_wall',
        title: 'The Jungle Wall',
        description: 'The US demands a concrete wall across the Darien Gap to stop migration. It is ecologically impossible.',
        choices: [
            {
                text: 'Start building (take the money).',
                effect: (s, log) => {
                    mod(s, Faction.USA, 15);
                    mod(s, Faction.Public, -10);
                    s.treasury += 20; // US Aid
                    s.personalAccount += 5;
                    log("We poured some concrete in a swamp. It sank. We kept the money.");
                }
            },
            {
                text: 'Refuse. It is a nature reserve.',
                effect: (s, log) => {
                    mod(s, Faction.USA, -10);
                    mod(s, Faction.Public, 5);
                    log("Washington is unhappy. The jaguars are happy.");
                }
            },
            {
                text: 'Propose a "Virtual Wall" (Drones).',
                effect: (s, log) => {
                    mod(s, Faction.USA, 5);
                    mod(s, Faction.Oligarchs, 5); // Tech contracts
                    s.treasury -= 5;
                    log("We bought expensive drones. They crashed immediately.");
                }
            }
        ]
    },
    {
        id: 'teleport_accident',
        title: 'Science Experiment Gone Wrong',
        description: 'A lab in Medellin tried to teleport a Chiguiro (Capybara). It... merged with a scientist.',
        choices: [
            {
                text: 'Cover it up.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5);
                    log("Rumors of 'Man-Bear-Pig' circulate.");
                }
            },
            {
                text: 'Put it in the zoo.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    s.treasury += 2; // Ticket sales
                    log("It is the main attraction. He seems happy eating carrots.");
                }
            },
            {
                text: 'Make him Minister of Environment.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 15);
                    mod(s, Faction.Oligarchs, -5);
                    log("He is surprisingly competent. Approval ratings soar.");
                }
            }
        ]
    },
    {
        id: 'legalize_all',
        title: 'Radical Libertarian Proposal',
        description: 'A new advisor suggests legalizing EVERYTHING. Drugs, guns, street racing, petting tigers.',
        choices: [
            {
                text: 'YOLO. Let\'s do it.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5); // Mixed reaction
                    mod(s, Faction.Cartels, -20); // Put out of business!
                    mod(s, Faction.Oligarchs, 10); // New markets
                    s.treasury += 30; // Tax revenue
                    log("Chaos reigns. But the economy is booming. Crime is technically 0%.");
                }
            },
            {
                text: 'That is insane. No.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    log("Order maintained. Boring.");
                }
            },
            {
                text: 'Just legalize the tigers.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 10); // Exotic pets
                    mod(s, Faction.Public, -5); // Dangerous
                    mod(s, Faction.Cartels, 5); // Status symbol
                    log("Tiger King: Colombia Edition.");
                }
            }
        ]
    },
    {
        id: 'water_privatize',
        title: 'Thirsty Corporation',
        description: 'Nestle wants to buy the rights to all rain falling in the Andes.',
        choices: [
            {
                text: 'Sell the rain.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 10); // Shareholders happy
                    mod(s, Faction.Public, -25); // Furious!
                    s.treasury += 25;
                    log("It touches the ground, it's theirs. People are collecting water illegally.");
                }
            },
            {
                text: 'Kick them out.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 15);
                    mod(s, Faction.USA, -5);
                    log("Water is a human right! Stay hydrated.");
                }
            },
            {
                text: 'Sell them the sewage instead.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    s.treasury += 5;
                    log("They bought it? Marketing is amazing.");
                }
            }
        ]
    },
    {
        id: 'clone_army',
        title: 'The Presidential Clone',
        description: 'A rogue geneticist offers to clone you. "One for speeches, one for prison," he says.',
        choices: [
            {
                text: 'Clone me!',
                effect: (s, log) => {
                    s.personalAccount -= 5;
                    mod(s, Faction.Public, -5); // Creepy
                    log("There are now two of you. He is sleeping with your wife. Bad idea.");
                }
            },
            {
                text: 'Arrest the mad scientist.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    log("He is in jail. Or is it a clone of him?");
                }
            },
            {
                text: 'Clone the best soccer player instead.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 20);
                    s.treasury -= 10;
                    log("World Cup guaranteed. The people love you.");
                }
            }
        ]
    },
    {
        id: 'gold_tank',
        title: 'The Golden Gift',
        description: 'An Arab Sheikh sends you a solid gold tank as a diplomatic gift. It doesn\'t shoot, it just shines.',
        choices: [
            {
                text: 'Keep it in the palace garden.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -10); // Ostentatious
                    mod(s, Faction.Oligarchs, 5); // Classy
                    log("It blinds pilots flying overhead.");
                }
            },
            {
                text: 'Melt it down for the Treasury.',
                effect: (s, log) => {
                    s.treasury += 30;
                    mod(s, Faction.Public, 10);
                    log("Fiscal responsibility! The Sheikh is offended.");
                }
            },
            {
                text: 'Drive it to work.',
                effect: (s, log) => {
                    mod(s, Faction.Army, -5); // They are jealous
                    mod(s, Faction.Public, 5); // It looks cool
                    log("Traffic moves out of your way. Fast.");
                }
            }
        ]
    },
    {
        id: 'smart_city',
        title: 'AI Traffic Control',
        description: 'We installed AI traffic lights in Bogota. The AI has decided the most efficient flow requires zero pedestrians.',
        choices: [
            {
                text: 'Turn it off!',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    s.treasury -= 5; // Wasted money
                    log("Back to normal jams. Humans 1, Machines 0.");
                }
            },
            {
                text: 'Let the AI optimize.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -15);
                    mod(s, Faction.Oligarchs, 10); // Deliveries are fast
                    log("Crosswalks are death zones. Amazon delivery is instant.");
                }
            },
            {
                text: 'Teach it "Colombian Driving" logic.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    log("The AI learns to honk and ignore lanes. It has become sentient.");
                }
            }
        ]
    },
    {
        id: 'fat_tax',
        title: 'The Chicharron Tax',
        description: 'Health Minister wants a 50% tax on fried pork to curb heart disease.',
        choices: [
            {
                text: 'Pass the tax.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -20); // DO NOT TOUCH THE PORK
                    mod(s, Faction.Guerillas, 3); // Unrest
                    s.treasury += 5;
                    log("Riots in the Antioquia region. You are hated.");
                }
            },
            {
                text: 'Veto it. Pork is culture.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    log("Cholesterol levels rise. Approvals rise.");
                }
            },
            {
                text: 'Only tax salads.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    log("Vegetarians protest silently.");
                }
            }
        ]
    },
    {
        id: 'olympic_bid',
        title: 'Olympic Dreams',
        description: 'The IOC suggests Bogota could host the Winter Olympics (using artificial snow).',
        choices: [
            {
                text: 'Yes! Winter is coming.',
                effect: (s, log) => {
                    s.treasury -= 40; // Expensive!
                    mod(s, Faction.Oligarchs, 15); // Contracts
                    mod(s, Faction.Public, 5);
                    log("We are bankrupt, but the bobsled track is nice.");
                }
            },
            {
                text: 'No. We are a tropical country.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5); // Sensible
                    log("We save billions. Boring.");
                }
            },
            {
                text: 'Host the "Narco-Olympics" instead.',
                effect: (s, log) => {
                    mod(s, Faction.Cartels, 15);
                    mod(s, Faction.USA, -20);
                    s.treasury += 10;
                    log("Events include 'Border Crossing' and 'Money Laundering'. Ratings are huge.");
                }
            }
        ]
    },
    {
        id: 'panda_diplomacy',
        title: 'Panda-monium',
        description: 'China sends two Pandas as a gift. They refuse to eat bamboo and only eat empanadas.',
        choices: [
            {
                text: 'Feed them empanadas.',
                effect: (s, log) => {
                    s.treasury -= 2;
                    mod(s, Faction.Public, 10);
                    log("They are fat and happy. The cutest drain on the budget.");
                }
            },
            {
                text: 'Send them back.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 5);
                    log("China is insulted. Trade war begins.");
                }
            },
            {
                text: 'Grill them.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -50);
                    log("You monster. Game Over imminent.");
                }
            }
        ]
    },
    {
        id: 'indigenous_upgrade',
        title: 'Cyber-Shaman',
        description: 'An indigenous leader in the Sierra Nevada demands Starlink internet for "spiritual connection".',
        choices: [
            {
                text: 'Grant it.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    s.treasury -= 1;
                    log("He is now streaming rituals on Twitch.");
                }
            },
            {
                text: 'Refuse. Preserve tradition.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5);
                    log("They block the highway in protest.");
                }
            },
            {
                text: 'Ask him to curse your enemies online.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, -5);
                    log("The opposition leader gets a virus. Magic or tech?");
                }
            }
        ]
    },
    {
        id: 'asteroid_mineral',
        title: 'Space Rock',
        description: 'A meteor landed in the desert. It glows green and vibrates.',
        choices: [
            {
                text: 'Sell it to Elon Musk.',
                effect: (s, log) => {
                    s.treasury += 20;
                    mod(s, Faction.USA, 5);
                    log("He makes a new battery. We get cash.");
                }
            },
            {
                text: 'Touch it.',
                effect: (s, log) => {
                    log("You now have visions of the future. Lottery numbers!");
                    s.personalAccount += 10;
                }
            },
            {
                text: 'Worship it.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -10); // Crazy
                    log("You start wearing tinfoil hats.");
                }
            }
        ]
    },
    {
        id: 'beauty_pageant_fix',
        title: 'Miss Colombia Crisis',
        description: 'The judges are deadlocked at the National Beauty Pageant. They ask YOU to pick the winner.',
        choices: [
            {
                text: 'Pick Miss Antioquia (Oligarchs favorite).',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 10);
                    mod(s, Faction.Public, -5);
                    log("The rich applaud. The poor boo.");
                }
            },
            {
                text: 'Pick Miss Choco (Public favorite).',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    mod(s, Faction.Oligarchs, -5);
                    log("A victory for the people!");
                }
            },
            {
                text: 'Pick yourself.',
                effect: (s, log) => {
                    mod(s, Faction.Army, -10);
                    mod(s, Faction.Public, -10);
                    log("You wear the sash. It is very awkward.");
                }
            }
        ]
    },
    {
        id: 'volcano_sacrifice',
        title: 'The Angry Mountain',
        description: 'Galeras volcano is smoking. A local witch doctor says it needs a sacrifice.',
        choices: [
            {
                text: 'Evacuate the area.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    s.treasury -= 5;
                    log("Safe, but expensive.");
                }
            },
            {
                text: 'Throw the Finance Minister in.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 20); // Everyone hated him
                    s.treasury += 5; // Saved his pension
                    log("The volcano stops smoking immediately. Coincidence?");
                }
            },
            {
                text: 'Ignore it.',
                effect: (s, log) => {
                    log("It erupts. Ash covers your car.");
                }
            }
        ]
    },
    {
        id: 'fast_furious',
        title: 'Street Racing Legalization',
        description: 'Illegal racers want to turn the main highway into a drag strip at night.',
        choices: [
            {
                text: 'Yes! Need for Speed!',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5); // Youth
                    mod(s, Faction.Oligarchs, -5); // Noise
                    log("Accidents rise, but you look cool in a leather jacket.");
                }
            },
            {
                text: 'Arrest them all.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.Public, -5);
                    log("Boring!");
                }
            },
            {
                text: 'Tax the bets.',
                effect: (s, log) => {
                    s.treasury += 5;
                    s.personalAccount += 2;
                    mod(s, Faction.Cartels, -5); // Intrusion on their turf
                    log("Gambling is now the main economy.");
                }
            }
        ]
    },
    {
        id: 'lost_nuke',
        title: 'Broken Arrow',
        description: 'A fisherman found a rusted Cold War nuke off the coast. The US wants it back quietly.',
        choices: [
            {
                text: 'Return it for a reward.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 15);
                    s.treasury += 10;
                    log("The Americans are relieved. We pretend we didn't see anything.");
                }
            },
            {
                text: 'Keep it. We are a nuclear power now!',
                effect: (s, log) => {
                    mod(s, Faction.USA, -50); // DEFCON 1
                    mod(s, Faction.Army, 20);
                    log("The world is terrified. Kim Jong Un sends a friend request.");
                }
            },
            {
                text: 'Try to take it apart with a hammer.',
                effect: (s, log) => {
                    // 50% chance of death?
                    log("It didn't explode. But now you glow in the dark.");
                }
            }
        ]
    },
    {
        id: 'soccer_war',
        title: 'The Second Football War',
        description: 'We lost to Brazil. The fans are demanding we declare war on Brazil.',
        choices: [
            {
                text: 'Do it! War!',
                effect: (s, log) => {
                    mod(s, Faction.Army, 10);
                    mod(s, Faction.Public, 10);
                    s.treasury -= 50;
                    log("We invaded the Amazon. We got lost immediately. Brazil didn't notice.");
                }
            },
            {
                text: 'It is just a game.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -20); // Traitor
                    log("You are burned in effigy.");
                }
            },
            {
                text: 'Bribe FIFA to annul the match.',
                effect: (s, log) => {
                    s.treasury -= 10;
                    s.personalAccount -= 2;
                    mod(s, Faction.Cartels, 5); // They approve of match fixing
                    log("Match replayed. We lost again.");
                }
            }
        ]
    },
    {
        id: 'hacker_election',
        title: 'Digital Democracy',
        description: 'A proposal to run the next election via Blockchain. No more dead people voting!',
        choices: [
            {
                text: 'Approve it.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Oligarchs, -10); // They liked rigging it
                    log("Fair elections? A dangerous precedent.");
                }
            },
            {
                text: 'Rig the blockchain.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -10);
                    s.personalAccount += 5; // Bribes
                    log("You win with 140% of the vote.");
                }
            },
            {
                text: ' Stick to paper and "lost" boxes.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    log("Tradition.");
                }
            }
        ]
    },
    {
        id: 'national_pet',
        title: 'National Animal Debate',
        description: 'People want to change the national symbol from the Condor to something "more relatable".',
        choices: [
            {
                text: 'The Capybara.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    log("Chill, friendly, and round. Just like us.");
                }
            },
            {
                text: 'The Hippo.',
                effect: (s, log) => {
                    mod(s, Faction.Cartels, 5);
                    mod(s, Faction.Public, -5);
                    log("An invasive species. A bold choice.");
                }
            },
            {
                text: 'The Pigeon.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5);
                    log("They are everywhere and poop on statues. Accurate.");
                }
            }
        ]
    },
    {
        id: 'coffee_strike',
        title: 'No Coffee?!',
        description: 'Truckers have blocked the roads. Bogota has run out of coffee. It is 8:00 AM.',
        choices: [
            {
                text: 'Send the Army to break the blockade.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.Public, 10); // They need caffeine
                    log("The coffee arrives. Violence was justified.");
                }
            },
            {
                text: 'Import instant coffee.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -20); // Disgusting
                    log("People would rather sleep.");
                }
            },
            {
                text: 'Air drop espresso shots.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 15);
                    s.treasury -= 5;
                    log("IT RAINS CAFFEINA! PRAISE BE!");
                }
            }
        ]
    },
    {
        id: 'telenovela_drama',
        title: 'Prime Time Drama',
        description: 'The writers of the top Telenovela want to kill off the main character. The nation is grieving in advance.',
        choices: [
            {
                text: 'Issue a decree: He lives.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10);
                    log("You saved Pedro el Escamoso. Hero.");
                }
            },
            {
                text: 'Let art be art.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5);
                    log("Tears flood the streets.");
                }
            },
            {
                text: 'Kill him yourself in a cameo.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5); // Tough guy
                    mod(s, Faction.Public, 5); // Ratings gold
                    log("You shot him! Best episode ever.");
                }
            }
        ]
    },
    {
        id: 'shark_tornado',
        title: 'Shark Phenomenon',
        description: 'A waterspout on the coast has picked up sharks and dropped them on a town. Literally Sharknado.',
        choices: [
            {
                text: 'Send chainsaws.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    log("Life imitates bad movies.");
                }
            },
            {
                text: 'Blame the opposition.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, -5);
                    log("They say it is climate change. You say it is communism.");
                }
            },
            {
                text: 'Sell the movie rights.',
                effect: (s, log) => {
                    s.treasury += 5;
                    log("Sharknado 7: Colombia.");
                }
            }
        ]
    },
    {
        id: 'emerald_curse',
        title: 'The Cursed Emerald',
        description: 'Miners found a fist-sized emerald. They say it is cursed by an ancient god.',
        choices: [
            {
                text: 'Put it in the museum.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    log("The museum burns down. But the gem is fine.");
                }
            },
            {
                text: 'Give it to your wife.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    log("She leaves you for a tennis instructor. The curse is real.");
                }
            },
            {
                text: 'Sell it on eBay.',
                effect: (s, log) => {
                    s.treasury += 10;
                    log("Sold to a buyer in Transylvania. Good luck to them.");
                }
            }
        ]
    },

    // --- VENEZUELA & TRUMP SPECIAL ---
    {
        id: 'super_bigote',
        title: 'Super Bigote vs. Captain maga',
        description: 'The Vice President released a cartoon where "Super Bigote" (the jailed former President) fights imperialism from his cell. Trump is jealous and demands his own show produced in Bogota.',
        choices: [
            {
                text: 'Fund "The Orange Avenger".',
                effect: (s, log) => {
                    s.treasury -= 5;
                    mod(s, Faction.USA, 15);
                    log("It has terrible ratings, but Trump loves it. He binges it on Air Force One.");
                }
            },
            {
                text: 'Ban all political cartoons.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5);
                    log("Freedom of speech is dead. But cartoons are gone.");
                }
            },
            {
                text: 'Make a cartoon of yourself.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5); // It's funny
                    log("You play the villain. Everyone loves it.");
                }
            }
        ]
    },
    {
        id: 'venezuela_election',
        title: 'The 99.9% Victory',
        description: 'The Vice President has won the "emergency election" with 105% of the vote. She asks for your official congratulations.',
        choices: [
            {
                text: 'Congratulate her. Comrades!',
                effect: (s, log) => {
                    mod(s, Faction.USA, -20);
                    mod(s, Faction.Guerillas, 10);
                    mod(s, Faction.Public, -10);
                    log("Trump tweets: 'WEAK! Colombia is LOST!' Sanctions incoming.");
                }
            },
            {
                text: 'Call it a fraud.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 10);
                    mod(s, Faction.Guerillas, -10);
                    log("The Regime closes the border again. Trade stops.");
                }
            },
            {
                text: 'Say nothing. Pretend you lost your phone.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5); // Stability
                    log("Awkward silence. Diplomatic masterpiece.");
                }
            }
        ]
    },
    {
        id: 'trump_tariffs',
        title: 'The Coffee Tariff',
        description: 'Trump is angry about "Bad Hombres" and threatens a 200% tariff on Colombian coffee unless you investigate Hunter Biden.',
        choices: [
            {
                text: 'Start the investigation.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 10);
                    mod(s, Faction.Public, -5);
                    log("CNN attacks you. Fox News calls you a hero.");
                }
            },
            {
                text: 'Tell him to drink tea.',
                effect: (s, log) => {
                    mod(s, Faction.USA, -15);
                    mod(s, Faction.Public, 10); // Nationalism
                    s.treasury -= 10; // Exports hurt
                    log("A brave stance. Coffee piles up in warehouses.");
                }
            },
            {
                text: 'Send him a golden coffee pot.',
                effect: (s, log) => {
                    s.personalAccount -= 1;
                    mod(s, Faction.USA, 5);
                    log("He forgets the tariff. 'Beautiful coffee, the best.'");
                }
            }
        ]
    },
    {
        id: 'asylum_seeker',
        title: 'The Opposition Leader',
        description: 'The Venezuelan opposition leader has fled to the Colombian embassy in Caracas. The government demands you hand her over.',
        choices: [
            {
                text: 'Grant asylum. She is a hero.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 10);
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Guerillas, -5);
                    log("She gives a speech from your balcony. The Regime burns your flag.");
                }
            },
            {
                text: 'Hand her over.',
                effect: (s, log) => {
                    mod(s, Faction.USA, -20); // Human rights violation
                    mod(s, Faction.Guerillas, 5);
                    s.personalAccount += 5; // Secret payment
                    log("The world is horrified. Your Swiss account is happy.");
                }
            },
            {
                text: 'Smuggle her to Miami.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 5);
                    s.treasury -= 2;
                    log("Problem solved. Not your problem anymore.");
                }
            }
        ]
    },
    {
        id: 'space_force_jungle',
        title: 'Space Force Training',
        description: 'Trump wants to train his "Space Force" in the Amazon jungle because "It looks like Endor" from Star Wars.',
        choices: [
            {
                text: 'Charge them rent. Sure.',
                effect: (s, log) => {
                    s.treasury += 10;
                    mod(s, Faction.Public, -5);
                    log("Soldiers in spacesuits are sweating in the jungle. It is hilarious.");
                }
            },
            {
                text: 'No foreign troops!',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.USA, -5);
                    log("Sovereignty defended.");
                }
            },
            {
                text: 'Only if I get a lightsaber.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 5);
                    log("They sent a plastic toy. Trump signed it.");
                }
            }
        ]
    },
    {
        id: 'oil_smuggling',
        title: 'Gasoline for $0.01',
        description: 'Gasoline is free in Venezuela. Smugglers are flooding the border with cheap fuel, bankrupting local stations.',
        choices: [
            {
                text: 'Legalize the smuggling.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 10); // Cheap gas!
                    mod(s, Faction.Oligarchs, -10); // Oil companies mad
                    log("Who cares about the law? The tank is full.");
                }
            },
            {
                text: 'Build a wall (Trump style).',
                effect: (s, log) => {
                    mod(s, Faction.USA, 5);
                    s.treasury -= 10;
                    log("The smugglers just built tunnels.");
                }
            },
            {
                text: 'Buy it yourself and resell it.',
                effect: (s, log) => {
                    s.treasury += 15;
                    mod(s, Faction.Cartels, 5); // You cut them in
                    log("The state is now the biggest smuggler.");
                }
            }
        ]
    },
    {
        id: 'fake_coup',
        title: 'The Drone "Attack"',
        description: 'The Vice President claims a Colombian drone attacked the government palace. It was actually a bird hitting a power line.',
        choices: [
            {
                text: 'Apologize to the bird.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    log("The bird is a national martyr.");
                }
            },
            {
                text: 'Admit it! "Yes, our drones are deadly."',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.USA, 5);
                    log("We look powerful. Nobody needs to know it was a pigeon.");
                }
            },
            {
                text: 'Send inspectors.',
                effect: (s, log) => {
                    log("They were denied entry. The drama continues.");
                }
            }
        ]
    },
    {
        id: 'trump_hotel',
        title: 'Trump Tower Cartagena',
        description: 'The Trump Organization wants to build a 100-story gold tower in the historic center of Cartagena.',
        choices: [
            {
                text: 'It will ruin the skyline. No.',
                effect: (s, log) => {
                    mod(s, Faction.USA, -10);
                    mod(s, Faction.Public, 5); // Heritage saved
                    log("UNESCO is relieved. Trump calls you 'Low Energy'.");
                }
            },
            {
                text: 'Build it! Make Cartagena Great Again.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 10);
                    mod(s, Faction.Oligarchs, 10);
                    mod(s, Faction.Public, -10);
                    mod(s, Faction.Cartels, 2); // Construction contracts
                    s.personalAccount += 5; // Condo gift
                    log("It is hideous. But the suites are nice.");
                }
            },
            {
                text: 'Only if it is invisible.',
                effect: (s, log) => {
                    log("They didn't understand the joke. Project cancelled.");
                }
            }
        ]
    },
    {
        id: 'migrant_caravan',
        title: 'The Mega-Caravan',
        description: 'A caravan of 50,000 migrants begins walking towards the US. Trump tweets: "STOP THEM OR ELSE!"',
        choices: [
            {
                text: 'Block the roads.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 10);
                    mod(s, Faction.Public, -10); // Humanitarian crisis
                    log("The caravan stops. The camps are overflowing.");
                }
            },
            {
                text: 'Let them pass. "Vaya con Dios".',
                effect: (s, log) => {
                    mod(s, Faction.USA, -20);
                    mod(s, Faction.Public, 5);
                    log("Trump threatens to nuke the highway. He is joking... right?");
                }
            },
            {
                text: 'Give them bus tickets to the border.',
                effect: (s, log) => {
                    s.treasury -= 5;
                    mod(s, Faction.USA, -25); // Furious
                    log("State-sponsored migration. Bold move.");
                }
            }
        ]
    },
    {
        id: 'hair_diplomat',
        title: 'The Special Envoy',
        description: 'Trump sends a special diplomatic envoy to discuss policy. It is his barber.',
        choices: [
            {
                text: 'Treat him with full state honors.',
                effect: (s, log) => {
                    mod(s, Faction.USA, 5);
                    log("He gives you a trim. You look... orange.");
                }
            },
            {
                text: 'Refuse to meet.',
                effect: (s, log) => {
                    mod(s, Faction.USA, -5);
                    log("Disrespectful! War is threatened.");
                }
            },
            {
                text: 'Ask for the "Trump Cut".',
                effect: (s, log) => {
                    mod(s, Faction.Public, -20); // You look ridiculous
                    mod(s, Faction.USA, 10); // Flattery works
                    log("You now have the most famous hair in Latin America.");
                }
            }
        ]
    },

    // --- UNDERWORLD & JUNGLE JUSTICE (New) ---
    {
        id: 'narco_submarine',
        title: 'The Silent Cargo',
        description: 'The Navy has seized a semi-submersible craft off the Pacific coast. It is loaded with cash and "flour".',
        choices: [
            {
                text: 'Seize it all for the State.',
                effect: (s, log) => {
                    s.treasury += 25;
                    mod(s, Faction.Cartels, -15);
                    mod(s, Faction.USA, 5);
                    log("A massive bust. The Treasury is full, but you have new enemies.");
                }
            },
            {
                text: '"Lose" the evidence.',
                effect: (s, log) => {
                    s.personalAccount += 10;
                    mod(s, Faction.Cartels, 10);
                    mod(s, Faction.USA, -10);
                    mod(s, Faction.Army, -5); // Corrupt
                    log("The sub 'sank while being towed'. A tragedy.");
                }
            },
            {
                text: 'Turn it into a museum piece.',
                effect: (s, log) => {
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Cartels, -5); // Mockery
                    log("Kids love playing in the drug boat.");
                }
            }
        ]
    },
    {
        id: 'secret_airstrip',
        title: 'Jungle Runway',
        description: 'Satellite images reveal a new unauthorized airstrip near the Brazilian border.',
        choices: [
            {
                text: 'Bomb it.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.Cartels, -10);
                    mod(s, Faction.Guerillas, -5); // Collateral damage
                    log("Crater maker. Problem solved.");
                }
            },
            {
                text: 'Tax the flights.',
                effect: (s, log) => {
                    s.treasury += 5;
                    mod(s, Faction.Cartels, 5);
                    mod(s, Faction.USA, -10);
                    log("It is now the 'Informal International Airport'.");
                }
            },
            {
                text: 'Use it for your weekend trips.',
                effect: (s, log) => {
                    mod(s, Faction.Oligarchs, 5);
                    mod(s, Faction.Cartels, 2); // You share the schedule
                    log("Very convenient. No customs.");
                }
            }
        ]
    },
    {
        id: 'land_reform_demand',
        title: 'Land or War',
        description: 'Guerilla leaders demand 100,000 hectares of land be given to peasants in the Cauca region.',
        choices: [
            {
                text: 'Grant the land reform.',
                effect: (s, log) => {
                    mod(s, Faction.Guerillas, 15);
                    mod(s, Faction.Public, 5);
                    mod(s, Faction.Oligarchs, -20); // They owned that land
                    log("A historic agreement. The landowners are buying guns.");
                }
            },
            {
                text: 'Send the Army to evict them.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.Guerillas, -15);
                    mod(s, Faction.Public, -5);
                    log("Violence erupts. The land remains fallow.");
                }
            },
            {
                text: 'Offer them "Digital Land" in the Metaverse.',
                effect: (s, log) => {
                    mod(s, Faction.Guerillas, -10); // Insulted
                    mod(s, Faction.USA, 5); // Tech savvy?
                    log("They did not appreciate the NFT deed. War continues.");
                }
            }
        ]
    },
    {
        id: 'cartel_accountant',
        title: 'The Informant',
        description: 'The chief accountant for the Gulf Clan wants to defect. He has the ledger.',
        choices: [
            {
                text: 'Protect him (Witness Protection).',
                effect: (s, log) => {
                    mod(s, Faction.Cartels, -20);
                    mod(s, Faction.USA, 15);
                    mod(s, Faction.Public, 5);
                    log("He sings like a canary. Major arrests follow.");
                }
            },
            {
                text: 'Sell him back to the Clan.',
                effect: (s, log) => {
                    s.personalAccount += 15;
                    mod(s, Faction.Cartels, 15);
                    mod(s, Faction.USA, -10);
                    mod(s, Faction.Public, -10);
                    log("He disappeared. Your bank account appeared.");
                }
            },
            {
                text: 'Make him Finance Minister.',
                effect: (s, log) => {
                    s.treasury += 10; // Expertise
                    mod(s, Faction.Oligarchs, -10);
                    mod(s, Faction.Cartels, 5);
                    log("He knows where all the money is. Literally.");
                }
            }
        ]
    },
    {
        id: 'community_radio',
        title: 'Pirate Radio',
        description: 'Guerillas are setting up unlicensed radio stations broadcasting "revolutionary education" (and good salsa).',
        choices: [
            {
                text: 'Jam the signals.',
                effect: (s, log) => {
                    mod(s, Faction.Army, 5);
                    mod(s, Faction.Guerillas, -5);
                    log("Static fills the airwaves. Boring.");
                }
            },
            {
                text: 'Legalize them.',
                effect: (s, log) => {
                    mod(s, Faction.Guerillas, 10);
                    mod(s, Faction.Public, 5); // People like the salsa
                    mod(s, Faction.Oligarchs, -5);
                    log("Freedom of speech includes rebels, apparently.");
                }
            },
            {
                text: 'Broadcast your own podcast on their frequency.',
                effect: (s, log) => {
                    mod(s, Faction.Public, -5); // You have a boring voice
                    mod(s, Faction.Guerillas, -2); // Annoyed
                    log("You talk about macroeconomics over their music.");
                }
            }
        ]
    }
];
