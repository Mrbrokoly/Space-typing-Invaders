
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

    
// Récupération des éléments du DOM
const gameContainer = document.getElementById('gameContainer');
const inputBox = document.getElementById('inputBox');
const scoreDisplay = document.getElementById('score');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const waveDisplay = document.getElementById('wave');
const lifeBar = document.getElementById('lifeBar');
const pauseButton = document.getElementById('pauseButton');
const pauseScreen = document.getElementById('pauseScreen');
const restartButton = document.getElementById('restartButton');



// Variables d'état du jeu
let activeWords = [];     // Mots actuellement à l'écran
let score = 0;           // Score actuel
let life = 100;           // Vie restante (en pourcentage)
let currentWave = 0;      // Vague actuelle
let gameActive = true;    // Si le jeu est en cours
let gamePaused = false;   // Si le jeu est en pause
let wordsTyped = 0;       // Nombre de mots tapés
let correctChars = 0;     // Nombre de caractères corrects
let totalChars = 0;       // Nombre total de caractères tapés
let startTime = Date.now(); // Temps de début du jeu
let lastWordTime = 0;      // Dernier moment où un mot est apparu

// Initialisation du jeu
function initGame() {
    // Réinitialisation des variables
    activeWords = [];
    score = 0;
    life = 100;
    currentWave = 0;
    gameActive = true;
    gamePaused = false;
    wordsTyped = 0;
    correctChars = 0;
    totalChars = 0;
    startTime = Date.now();
    lastWordTime = 0;
    
    // Mise à jour de l'affichage
    scoreDisplay.textContent = score;
    waveDisplay.textContent = currentWave;
    accuracyDisplay.textContent = '100%';
    wpmDisplay.textContent = '0';
    lifeBar.style.width = '100%';
}
    // Nettoyage des mots existants
    document.querySelectorAll('.word').forEach(word => word.remove());
    
    // Focus sur la zone de saisie
    inputBox.addEventListener("input", () =>{
        if (inputBox.value.trim() === correctChars) {
            inputBox.value = "";
            inputBox.focus();
            
        }
        // Démarrage de la première vague
    nextWave();
    })

  // Annonce de la vague
  const waveAnnounce = document.createElement('div');
  waveAnnounce.className = 'wave-info';
  waveAnnounce.textContent = `VAGUE ${currentWave}`;
  gameContainer.appendChild(waveAnnounce);
  
  setTimeout(() => {
      waveAnnounce.remove();
  }, 2000);
  // Passage à la vague suivante
function nextWave() {
    if (!gameActive || gamePaused) return;
    
    currentWave++;
    waveDisplay.textContent = currentWave;
    
    // Annonce de la vague
    const waveAnnounce = document.createElement('div');
    waveAnnounce.className = 'wave-info';
    waveAnnounce.textContent = `VAGUE ${currentWave}`;
    gameContainer.appendChild(waveAnnounce);
    
    setTimeout(() => {
        waveAnnounce.remove();
    }, 2000);
    
    // Création des mots pour cette vague
    createWaveWords();
    
    // Planification de la prochaine vague si ce n'est pas la dernière
    if (currentWave < CONFIG.waves) {
        setTimeout(nextWave, CONFIG.waveDelay + getWordsDuration());
    } else {
        // Dernière vague terminée - victoire!
        setTimeout(() => {
            if (gameActive) {
                gameOver(true);
            }
        }, getWordsDuration() + 6000);
    }
}

// Calcule la durée estimée de la vague actuelle
function getWordsDuration() {
    const wordsCount = CONFIG.initialWordsPerWave + (currentWave * CONFIG.wordsIncreasePerWave);
    return wordsCount * ((CONFIG.minWordInterval + CONFIG.maxWordInterval) / 2);
}

// Crée les mots pour la vague actuelle
function createWaveWords() {
    const wordsCount = CONFIG.initialWordsPerWave + ((currentWave-1) * CONFIG.wordsIncreasePerWave);
    const shuffledWords = [...WORDS].sort(() => 0.5 - Math.random());
    const waveWords = shuffledWords.slice(0, wordsCount);
    
    let wordCount = 0;
    const spawnNextWord = () => {
        if (wordCount < waveWords.length && !gamePaused) {
            spawnWord(waveWords[wordCount]);
            wordCount++;
            
            // Intervalle aléatoire entre les mots
            const interval = Math.random() * (CONFIG.maxWordInterval - CONFIG.minWordInterval) + CONFIG.minWordInterval;
            setTimeout(spawnNextWord, interval);
        }
    };
    
    spawnNextWord();
}

