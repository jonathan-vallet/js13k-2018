function initKeyboard() {
    var lineList = [
        'QWERTYUIOP',
        'ASDFGHJKL',
        "ZXCVBNM,.'",
    ]
    var keyboard = $('iphone-keyboard');
    var keyboardHTML = '';
    lineList.forEach(letterList => {
        keyboardHTML += '<li>';
        for(var index = 0; index < letterList.length; ++index) {
            keyboardHTML += `<button type="button" data-char="${letterList.charAt(index)}">${letterList.charAt(index)}</button>`;
        }
        keyboardHTML += '</li>';
    });
    keyboardHTML += `<li>
        <button type="button" class="space" data-char=" ">space</button>
    </li>`;
    keyboard.innerHTML = keyboardHTML;
}