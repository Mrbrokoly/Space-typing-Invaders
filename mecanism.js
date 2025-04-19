
    // Configuration du jeu
    const CONFIG = {
        waves: 10,                           // Nombre total de vagues
        initialWordsPerWave: 5,               // Nombre de mots dans la première vague
        wordsIncreasePerWave: 3,              // Augmentation du nombre de mots par vague
        initialSpeed: 0.25,                    // Vitesse initiale de chute
        speedIncrease: 0.2,                  // Augmentation de vitesse par vague
        lifeDecrease: 10,                     // Perte de vie quand un mot atteint le bas
        scorePerWord: 10,                     // Points gagnés par mot tapé
        wordLength: 5,                        // Longueur des mots
        waveDelay: 5000,                      // Délai entre les vagues
        minWordInterval: 1000,                 // Intervalle minimum entre les mots
        maxWordInterval: 1500                  // Intervalle maximum entre les mots
    };
    //Les mots speciales
    const powerWords = {
        "feu" :{color:"red",effect: () => showEffect("Pouvoir : Explosion !")},
        "glace" :{color:"blue",effect: () => showEffect("Pouvoir : Enemis ralentis !")},
        "soin" :{color:"lime",effect: () => showEffect("Pouvoir : +20% PV !")},
        "bouclier" :{color:"violet",effect: () => showEffect("Pouvoir : Bouclier activé !")}
    }
    
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
    
    // Nettoyage des mots existants
    document.querySelectorAll('.word').forEach(word => word.remove());
    
    // Focus sur la zone de saisie
    inputBox.addEventListener("input", () =>{
        if (inputBox.value.trim() === correctChars) {
            inputBox.value = "";
            inputBox.focus();
            
        }
    })
   
    
    // Ajout d'étoiles en arrière-plan
    createStars();
    
    // Démarrage de la première vague
    nextWave();
}

// Création des étoiles en arrière-plan
function createStars() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random();
        gameContainer.appendChild(star);
        
        // Animation des étoiles
        if (Math.random() > 0.8) {
            star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite`;
        }
    }
}

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

// Fait apparaître un mot à l'écran
function spawnWord(word) {
    if (!gameActive || gamePaused) return;
    
    const wordElement = document.createElement('span');
    wordElement.className = 'word';
    wordElement.textContent = word;
    
    // Position aléatoire en haut de l'écran
    wordElement.style.left = `${Math.random() * (gameContainer.offsetWidth - 100)}px`;
    wordElement.style.top = '0px';
    
    gameContainer.appendChild(wordElement);
    
    // Vitesse basée sur la vague actuelle
    const speed = CONFIG.initialSpeed + ((currentWave-1) * CONFIG.speedIncrease);
    
    // Ajout du mot à la liste des mots actifs
    activeWords.push({
        text: word,
        element: wordElement,
        y: 0,
        speed: speed,
        spawnedTime: Date.now()
    });
    
    lastWordTime = Date.now();
}

// Met à jour la position des mots
function updateWords() {
    if (!gameActive || gamePaused) return;
    
    activeWords.forEach((word, index) => {
        word.y += word.speed;
        word.element.style.top = `${word.y}px`;
        
        // Vérifie si le mot a atteint le bas
        if (word.y > gameContainer.offsetHeight - 50) {
            word.element.remove();
            activeWords.splice(index, 1);
            decreaseLife(CONFIG.lifeDecrease);
        }
    });
    
    // Mise à jour du WPM (mots par minute)
    updateWPM();
}
// Vérifie l'entrée utilisateur
function checkInput() {
    if (gamePaused) return;
    
    const typed = inputBox.value.trim().toLowerCase();
    
    activeWords.forEach((word, index) => {
        if (typed === word.text.toLowerCase()) {
             // Créer l'explosion avant de supprimer le mot
             
                const x = word.element.offsetLeft + word.element.offsetWidth/2;
                const y = word.element.offsetTop + word.element.offsetHeight/2;
                if (createExplosion == 'functionf') {
                    createExplosion(x, y);
                    
                }
            
            // Mot correctement tapé
            word.element.remove();
            
            activeWords.splice(index, 1);
            inputBox.value = '';
            inputBox.focus();


                // Création d'une explosion
                
            
           
            // Mise à jour des statistiques
            wordsTyped++;
            correctChars += word.text.length;
            totalChars += word.text.length;
            updateScore(CONFIG.scorePerWord);
            updateAccuracy();
        }
    });
    
    // Compte les caractères tapés (même incorrects) pour la précision
    if (typed.length > 0) {
        totalChars++;
    }
}
// Crée une animation d'explosion
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.position = 'absolute'
    
    explosion.style.left = `${x - 15}px`;
    explosle.top = `${y - 15}px`;
    explosion.style.background = url('ressource/effet visuel/explosion.png')
    
    gameContainer.appendChild(explosion);
    setTimeout(() => explosion.remove(), 500);
}
 
// Met à jour le score
function updateScore(points) {
    score += points;
    scoreDisplay.textContent = score;
}
// Calcule et affiche les mots par minute (WPM)
function updateWPM() {
    const minutes = (Date.now() - startTime) / 60000;
    const wpm = Math.round(wordsTyped / minutes) || 0;
    wpmDisplay.textContent = wpm;
}
// Calcule et affiche la précision
function updateAccuracy() {
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    accuracyDisplay.textContent = `${accuracy}%`;
}
// Réduit la vie du joueur
function decreaseLife(amount) {
    life = Math.max(0, life - amount);
    lifeBar.style.width = `${life}%`;
    
    // Change la couleur si la vie est basse
    if (life <= 60  ) {
        lifeBar.style.backgroundColor = '#ffcc00';
    } if (life <= 30 ) {
        lifeBar.style.backgroundColor = 'rgba(225, 0, 0, 0.91)';
    }else{
        lifeBar.style.backgroundColor = ' #00cc00)';
    }
    
   
    // Game over si vie à 0
    if (life === 0) {
        gameOver();
    }
}
function togglePause() {
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        pauseScreen.style.display = 'flex';
        inputBox.blur();
    } else {
        pauseScreen.style.display = 'none';
        inputBox.focus();
    }
}
// Fin du jeu (victoire ou défaite)
function gameOver(victory) {
    gameActive = false;
    
    // Affichage du message de fin
    const gameOverMsg = document.createElement('div');
    gameOverMsg.className = 'wave-info';
    gameOverMsg.textContent = victory ? 'VICTOIRE!' : 'GAME OVER';
    gameOverMsg.style.color = victory ? '#0ff' : '#f00';
    gameOverMsg.style.textShadow = victory ? '0 0 10px #0ff, 0 0 20px #0ff' : '0 0 10px #f00, 0 0 20px #f00';
    gameOverMsg.style.fontSize = '60px';
    gameContainer.appendChild(gameOverMsg);
    
    // Désactivation de la zone de saisie
    inputBox.disabled = true;
    
    // Suppression du message après 5 secondes
    setTimeout(() => {
        gameOverMsg.remove();
    }, 5000);
}
// Événements
inputBox.addEventListener('input', checkInput);
pauseButton.addEventListener('click', togglePause);
restartButton.addEventListener('click', togglePause);

// Boucle de jeu principale
const gameLoop = setInterval(updateWords, 16);

// Initialisation au chargement de la page
window.addEventListener('load', initGame);
