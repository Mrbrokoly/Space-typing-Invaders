const text = " Welcome to our page"

const typingText = document.getElementById("typingText");

let index = 0;

function type() {
    if (index < text.length) {
        typingText.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100); 
    }
}

type();