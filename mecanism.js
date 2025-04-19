    
    //CONFIGURATION DU JEU 
    
    const CONFIG = {
            waves: 12,                           
            initialWordsPerWave: 4,               
            wordsIncreasePerWave: 1,             
            initialSpeed: 0.3,                  
            speedIncrease: 0.1,                  
            lifeDecrease: 10,                     
            scorePerWord: 10,                    
            wordLength:5,                        
            waveDelay: 3500,                      
            minWordInterval: 1000,                 
            maxWordInterval: 1800                 
        };
        function gameLoop() {
            if (!gameActive || gamePaused) return;
            
            updateWords();
            updateWPM();
        }

        
const WORDS = [
"crypt", "vapor", "glide", "lunar", "quake", "wield", "mirth", "creep", "blaze",
  "drone", "pixel", "flare", "siren", "prism", "vigil", "gloom", "risky", "slick",
  "tempo", "vouch", "quark", "tweak", "sonar", "fiend", "hatch", "boost", "zoned",
  'laser', 'space', 'alien', 'earth', 'orbit', 'comet', 'stars', 'gamma', 'quark', 'pulse',
  'radio', 'solar', 'flare', 'crash', 'blast', 'light', 'speed', 'force', 'power', 'drive',
  'pluto', 'venus', 'mars', 'jupit', 'saturn', 'neptun', 'mercur', 'galaxy', 'cosmos', 'nebula'

].filter(word => word.length === CONFIG.wordLength);
        
        
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
        
     
        
        function initGame() {
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

            pauseScreen.style.display = 'none';
            gameOverScreen.style.display = 'none';
            
            
            updateScore(0);
            waveDisplay.textContent = currentWave;
            accuracyDisplay.textContent = '100%';
            wpmDisplay.textContent = '0';
            lifeBar.style.width = '100%';
            
            
            document.querySelectorAll('.word, .explosion, .wave-info').forEach(el => el.remove());
            
            
            inputBox.value = '';
            inputBox.disabled = false;
            inputBox.focus();
            
            
            if (gameLoopInterval) clearInterval(gameLoopInterval);
            gameLoopInterval = setInterval(gameLoop, 16);
            nextWave();
        }
        
         function nextWave() {
            if (!gameActive || gamePaused) return;
            currentWave++;
            waveDisplay.textContent = `${currentWave}/${CONFIG.waves}`;
            showWaveAnnouncement(`VAGUE ${currentWave}`);
            createWaveWords();
            
            if (currentWave < CONFIG.waves) {
                setTimeout(nextWave, CONFIG.waveDelay + getWordsDuration());
            } else {
                setTimeout(() => {
                    if (gameActive) {
                        gameOver(true);
                    }
                }, getWordsDuration() + 3000);
            }
        }
        
        function showWaveAnnouncement(text) {
            const waveAnnounce = document.createElement('div');
            waveAnnounce.className = 'wave-info';
            waveAnnounce.textContent = text;
            gameContainer.appendChild(waveAnnounce);
            setTimeout(() => {
                waveAnnounce.remove();
            }, 2000);
        }
        

        function getWordsDuration() {
            const wordsCount = CONFIG.initialWordsPerWave + ((currentWave-1) * CONFIG.wordsIncreasePerWave);
            return wordsCount * ((CONFIG.minWordInterval + CONFIG.maxWordInterval) / 2);
        }
        

        function createWaveWords() {
            const wordsCount = CONFIG.initialWordsPerWave + ((currentWave-1) * CONFIG.wordsIncreasePerWave);
            const shuffledWords = [...WORDS].sort(() => 0.5 - Math.random());
            const waveWords = shuffledWords.slice(0, wordsCount);
            let wordCount = 0;
            const spawnNextWord = () => {
                if (wordCount < waveWords.length && !gamePaused && gameActive) {
                    spawnWord(waveWords[wordCount]);
                    wordCount++;
                    
                    
                    const interval = Math.random() * (CONFIG.maxWordInterval - CONFIG.minWordInterval) + CONFIG.minWordInterval;
                    setTimeout(spawnNextWord, interval);
                }
            };
            spawnNextWord();
        }
        
  
        function spawnWord(word) {
            if (!gameActive || gamePaused) return;
            const wordElement = document.createElement('span');
            wordElement.className = 'word';
            wordElement.textContent = word;
            wordElement.style.left = `${Math.random() * (gameContainer.offsetWidth - 100)}px`;
            wordElement.style.top = '0px';
            gameContainer.appendChild(wordElement);
            
            
            const speed = CONFIG.initialSpeed + ((currentWave-1) * CONFIG.speedIncrease);
            activeWords.push({
                text: word,
                element: wordElement,
                y: 0,
                speed: speed,
                spawnedTime: Date.now()
            });
            lastWordTime = Date.now();
        }
        
       function updateWords() {
            if (!gameActive || gamePaused) return;
            activeWords.forEach((word, index) => {
                word.y += word.speed;
                word.element.style.top = `${word.y}px`;
                if (word.y > gameContainer.offsetHeight - 50) {
                    word.element.remove();
                    activeWords.splice(index, 1);
                    decreaseLife(CONFIG.lifeDecrease);
                }
            });
        }
        

        function checkInput() {
            if (gamePaused || !gameActive) return;
            const typed = inputBox.value.trim().toLowerCase();
            activeWords.forEach((word, index) => {
                if (typed === word.text.toLowerCase()) {
                    word.element.remove();
                    activeWords.splice(index, 1);
                    inputBox.value = '';
                    wordsTyped++;
                    correctChars += word.text.length;
                    totalChars += word.text.length;
                    updateScore(CONFIG.scorePerWord);
                    updateAccuracy();
                }
            });
        if (typed.length > 0) {
            totalChars++;
            }
        }
        
     

        
  
        function updateScore(points) {
            score += points;
            scoreDisplay.textContent = score;
        }
        

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
        
        //Calcule et affiche les mots par minute (WPM)
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
        
        // Permet de mettre en pause de reprendre le jeu 
        
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
     
        //Quitte le jeu et recharge la page
        
        function quitGame() {
            location.reload();
            window.location.href = "login.html";
        }
        

        inputBox.addEventListener('input', checkInput);
        pauseButton.addEventListener('click', togglePause);
        resumeButton.addEventListener('click', togglePause);
        restartButton.addEventListener('click', initGame );
        quitButton.addEventListener('click', quitGame);
        gameOverRestart.addEventListener('click', initGame);
        gameOverQuit.addEventListener('click', quitGame);


        
        // Démarrer le jeu quand la fenêtre est en focus
        window.addEventListener('focus', () => {
            if (gameActive && !gamePaused) {
                inputBox.focus();
            }
        });
        
        // Démarrer le jeu au chargement de la page
        window.addEventListener('load', initGame);