
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


