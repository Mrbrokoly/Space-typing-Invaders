const starsContainer = document.querySelector('.stars');

function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    
    
    const size = Math.random() * 3 + 1; 
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    
    starsContainer.appendChild(star);
}


for (let i = 0; i < 100; i++) {
    createStar();
}



document.getElementById('submitBtn').addEventListener('click', function(event) {
    event.preventDefault(); 

    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    if (username === '' || password === '') {
        alert('Il y a une erreur : veuillez remplir tous les champs.');
    } else {
        
        window.location.href = "";
    }
});
