function displayText() {
    var sentence = textList[currentTextIndex];
    var sentenceHtml = ''
    for (var index = 0; index < sentence.length; ++index) {
        var text = sentence.charAt(index) === ' ' ? '&nbsp;' : sentence.charAt(index);
        sentenceHtml += `<span${index === 0 ? ' class="current"' : ''} data-val="${sentence.charAt(index)}">${text}</span>`;
    }
    document.querySelector('#text').innerHTML = sentenceHtml;
}

function checkText(letter) {
    var currentLetter = document.querySelector('#text .current');
    if(letter.toLowerCase() === currentLetter.getAttribute('data-val').toLowerCase()) {
        currentLetter.classList.remove('current');
        currentLetter.classList.add('checked');
        if(currentLetter.nextElementSibling) {
            currentLetter.nextElementSibling.classList.add('current');
        } else {
            ++currentTextIndex;
            displayText();
        }
    }
}
var isTextDisplayed = false;
displayText();