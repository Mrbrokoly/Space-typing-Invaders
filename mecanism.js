
    // Configuration du jeu
    const CONFIG = {
        waves: 10,                           // Nombre total de vagues
        initialWordsPerWave: 5,               // Nombre de mots dans la première vague
        wordsIncreasePerWave: 2,              // Augmentation du nombre de mots par vague
        initialSpeed: 0.5,                    // Vitesse initiale de chute
        speedIncrease: 0.2,                  // Augmentation de vitesse par vague
        lifeDecrease: 10,                     // Perte de vie quand un mot atteint le bas
        scorePerWord: 10,                     // Points gagnés par mot tapé
        wordLength: 5,                        // Longueur des mots
        waveDelay: 3000,                      // Délai entre les vagues
        minWordInterval: 800,                 // Intervalle minimum entre les mots
        maxWordInterval: 1500                  // Intervalle maximum entre les mots
    };
    
    // Liste des mots disponibles (tous de 5 lettres)
    const WORDS = [
        'laser', 'space', 'alien', 'earth', 'orbit', 'comet', 'stars', 'gamma', 'quark', 'pulse',
        'radio', 'solar', 'flare', 'crash', 'blast', 'light', 'speed', 'force', 'power', 'drive',
        'pluto', 'venus', 'mars', 'jupit', 'saturn', 'neptun', 'mercur', 'galaxy', 'cosmos', 'nebula'
    ].filter(word => word.length === CONFIG.wordLength);