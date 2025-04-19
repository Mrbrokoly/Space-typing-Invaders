   // =============================================
        // CONFIGURATION DU JEU
        // =============================================

        const CONFIG = {
            waves: 12,                           // Nombre total de vagues
            initialWordsPerWave: 4,               // Nombre de mots dans la première vague
            wordsIncreasePerWave: 1,              // Augmentation du nombre de mots par vague
            initialSpeed: 0.3,                    // Vitesse initiale de chute
            speedIncrease: 0.1,                  // Augmentation de vitesse par vague
            lifeDecrease: 10,                     // Perte de vie quand un mot atteint le bas
            scorePerWord: 10,                     // Points gagnés par mot tapé
            wordLength:(4 && 5) ,                        // Longueur des mots
            waveDelay: 3500,                      // Délai entre les vagues
            minWordInterval: 1000,                 // Intervalle minimum entre les mots
            maxWordInterval: 1800                 // Intervalle maximum entre les mots
        };

        
        
        // Liste des mots disponibles (tous de 5 lettres)
        const WORDS = [


  // 5 lettres
  "crypt", "vapor", "glide", "lunar", "quake", "wield", "mirth", "creep", "blaze",
  "drone", "pixel", "flare", "siren", "prism", "vigil", "gloom", "risky", "slick",
  "tempo", "vouch", "quark", "tweak", "sonar", "fiend", "hatch", "boost", "zoned",
  'laser', 'space', 'alien', 'earth', 'orbit', 'comet', 'stars', 'gamma', 'quark', 'pulse',
  'radio', 'solar', 'flare', 'crash', 'blast', 'light', 'speed', 'force', 'power', 'drive',
  'pluto', 'venus', 'mars', 'jupit', 'saturn', 'neptun', 'mercur', 'galaxy', 'cosmos', 'nebula'



  
].filter(word => word.length === CONFIG.wordLength);
        
        // =============================================
        // ÉLÉMENTS DU DOM
        // =============================================
        const gameContainer = document.getElementById('gameContainer');
        const inputBox = document.getElementById('inputBox');
        const scoreDisplay = document.getElementById('score');
        const wpmDisplay = document.getElementById('wpm');
        const accuracyDisplay = document.getElementById('accuracy');
        const waveDisplay = document.getElementById('wave');
        const lifeBar = document.getElementById('lifeBar');
        const pauseButton = document.getElementById('pauseButton');
        const pauseScreen = document.getElementById('pauseScreen');
        const resumeButton = document.getElementById('resumeButton');
        const restartButton = document.getElementById('restartButton');
        const quitButton = document.getElementById('quitButton');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const gameOverTitle = document.getElementById('gameOverTitle');
        const finalScore = document.getElementById('finalScore');
        const finalWpm = document.getElementById('finalWpm');
        const finalAccuracy = document.getElementById('finalAccuracy');
        const gameOverRestart = document.getElementById('gameOverRestart');
        const gameOverQuit = document.getElementById('gameOverQuit');
        
        // =============================================
        // VARIABLES D'ÉTAT DU JEU
        // =============================================
        let activeWords = [];     // Mots actuellement à l'écran
        let score = 0;            // Score actuel
        let life = 100;           // Vie restante (en pourcentage)
        let currentWave = 0;      // Vague actuelle
        let gameActive = false;   // Si le jeu est en cours
        let gamePaused = false;   // Si le jeu est en pause
        let wordsTyped = 0;       // Nombre de mots tapés
        let correctChars = 0;     // Nombre de caractères corrects
        let totalChars = 0;       // Nombre total de caractères tapés
        let startTime = 0;       // Temps de début du jeu
        let lastWordTime = 0;    // Dernier moment où un mot est apparu
        let gameLoopInterval;     // Référence à l'intervalle de jeu
        
        // =============================================
        // FONCTIONS DU JEU
        // =============================================
        
        /**
         * Initialise le jeu
         */
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
            
            // Masquer les écrans de pause et game over
            pauseScreen.style.display = 'none';
            gameOverScreen.style.display = 'none';
            
            // Mise à jour de l'affichage
            updateScore(0);
            waveDisplay.textContent = currentWave;
            accuracyDisplay.textContent = '100%';
            wpmDisplay.textContent = '0';
            lifeBar.style.width = '100%';
            
            // Nettoyage des éléments existants
            document.querySelectorAll('.word, .explosion, .wave-info').forEach(el => el.remove());
            
            // Focus sur la zone de saisie
            inputBox.value = '';
            inputBox.disabled = false;
            inputBox.focus();
            
            // Démarrer la boucle de jeu
            if (gameLoopInterval) clearInterval(gameLoopInterval);
            gameLoopInterval = setInterval(gameLoop, 16);
            
            // Démarrer la première vague
            nextWave();
        }
        
        /**
         * Boucle principale du jeu
         */
        function gameLoop() {
            if (!gameActive || gamePaused) return;
            
            updateWords();
            updateWPM();
        }
        
        /**
         * Passe à la vague suivante
         */
        function nextWave() {
            if (!gameActive || gamePaused) return;
            
            currentWave++;
            waveDisplay.textContent = `${currentWave}/${CONFIG.waves}`;
            
            // Annonce de la vague
            showWaveAnnouncement(`VAGUE ${currentWave}`);
            
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
                }, getWordsDuration() + 3000);
            }
        }
        
        /**
         * Affiche l'annonce de vague
         * @param {string} text - Texte à afficher
         */
        function showWaveAnnouncement(text) {
            const waveAnnounce = document.createElement('div');
            waveAnnounce.className = 'wave-info';
            waveAnnounce.textContent = text;
            gameContainer.appendChild(waveAnnounce);
            
            setTimeout(() => {
                waveAnnounce.remove();
            }, 2000);
        }
        
        /**
         * Calcule la durée estimée de la vague actuelle
         * @returns {number} Durée estimée en ms
         */
        function getWordsDuration() {
            const wordsCount = CONFIG.initialWordsPerWave + ((currentWave-1) * CONFIG.wordsIncreasePerWave);
            return wordsCount * ((CONFIG.minWordInterval + CONFIG.maxWordInterval) / 2);
        }
        
        /**
         * Crée les mots pour la vague actuelle
         */
        function createWaveWords() {
            const wordsCount = CONFIG.initialWordsPerWave + ((currentWave-1) * CONFIG.wordsIncreasePerWave);
            const shuffledWords = [...WORDS].sort(() => 0.5 - Math.random());
            const waveWords = shuffledWords.slice(0, wordsCount);
            
            let wordCount = 0;
            const spawnNextWord = () => {
                if (wordCount < waveWords.length && !gamePaused && gameActive) {
                    spawnWord(waveWords[wordCount]);
                    wordCount++;
                    
                    // Intervalle aléatoire entre les mots
                    const interval = Math.random() * (CONFIG.maxWordInterval - CONFIG.minWordInterval) + CONFIG.minWordInterval;
                    setTimeout(spawnNextWord, interval);
                }
            };
            
            spawnNextWord();
        }
        
        /**
         * Fait apparaître un mot à l'écran
         * @param {string} word - Mot à afficher
         */
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
        
        /**
         * Met à jour la position des mots
         */
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
        }
        
        /**
         * Vérifie l'entrée utilisateur
         */
        function checkInput() {
            if (gamePaused || !gameActive) return;
            
            const typed = inputBox.value.trim().toLowerCase();
            
            activeWords.forEach((word, index) => {
                if (typed === word.text.toLowerCase()) {
                    // Mot correctement tapé
                    word.element.remove();
                    activeWords.splice(index, 1);
                    inputBox.value = '';
                    
                    // Création d'une explosion
                    createExplosion(word.element.offsetLeft, word.element.offsetTop);
                    
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
        
        /**
         * Crée une animation d'explosion
         * @param {number} x - Position horizontale
         * @param {number} y - Position verticale
         */
        function createExplosion(x, y) {
            const explosion = document.createElement('div');
            explosion.className = 'explosion';
            explosion.style.left = `${x-25}px`;
            explosion.style.top = `${y-25}px`;
            gameContainer.appendChild(explosion);
            
            setTimeout(() => {
                explosion.remove();
            }, 800);
        }
        
        /**
         * Met à jour le score
         * @param {number} points - Points à ajouter
         */
        function updateScore(points) {
            score += points;
            scoreDisplay.textContent = score;
        }
        
        /**
         * Réduit la vie du joueur
         * @param {number} amount - Quantité de vie à retirer
         */
        function decreaseLife(amount) {
            life = Math.max(0, life - amount);
            lifeBar.style.width = `${life}%`;
            
            // Animation de dégâts
            lifeBar.style.backgroundColor = '#f00';
            setTimeout(() => {
                lifeBar.style.backgroundColor = '#0f0';
            }, 200);
            
            if (life <= 0) {
                gameOver(false);
            }
        }
        
        /**
         * Calcule et affiche les mots par minute (WPM)
         */
        function updateWPM() {
            const minutes = (Date.now() - startTime) / 60000;
            const wpm = Math.round(wordsTyped / minutes) || 0;
            wpmDisplay.textContent = wpm;
        }
        
        /**
         * Calcule et affiche la précision
         */
        function updateAccuracy() {
            const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
            accuracyDisplay.textContent = `${accuracy}%`;
        }
        
        /**
         * Fin du jeu (victoire ou défaite)
         * @param {boolean} victory - Si le joueur a gagné
         */
        function gameOver(victory) {
            gameActive = false;
            clearInterval(gameLoopInterval);
            
            // Mettre à jour l'écran de fin
            gameOverTitle.textContent = victory ? 'VICTOIRE !' : 'GAME OVER';
            gameOverTitle.className = victory ? 'victory' : 'defeat';
            finalScore.textContent = score;
            finalWpm.textContent = wpmDisplay.textContent;
            finalAccuracy.textContent = accuracyDisplay.textContent;
            
            // Désactiver la zone de saisie
            inputBox.disabled = true;
            
            // Afficher l'écran de fin
            gameOverScreen.style.display = 'flex';
        }
        
        /**
         * Met en pause ou reprend le jeu
         */
        function togglePause() {
            if (!gameActive) return;
            
            gamePaused = !gamePaused;
            
            if (gamePaused) {
                pauseScreen.style.display = 'flex';
                inputBox.blur();
            } else {
                pauseScreen.style.display = 'none';
                inputBox.focus();
            }
        }
        
        /**
         * Quitte le jeu et recharge la page
         */
        function quitGame() {
            location.reload();
        }
        
        // =============================================
        // ÉCOUTEURS D'ÉVÉNEMENTS
        // =============================================
        inputBox.addEventListener('input', checkInput);
        pauseButton.addEventListener('click', togglePause);
        resumeButton.addEventListener('click', togglePause);
        restartButton.addEventListener('click', quitGame, );
        quitButton.addEventListener('click', quitGame);
        gameOverRestart.addEventListener('click', quitGame);
        gameOverQuit.addEventListener('click', quitGame);


        
        // Démarrer le jeu quand la fenêtre est en focus
        window.addEventListener('focus', () => {
            if (gameActive && !gamePaused) {
                inputBox.focus();
                bgSound.play();
            }
        });
        
        // Démarrer le jeu au chargement de la page
        window.addEventListener('load', initGame);