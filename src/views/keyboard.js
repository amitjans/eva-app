let letters = Array.prototype.slice.call(document.querySelectorAll('.tecla.tecla-letra'));
let numeros = Array.prototype.slice.call(document.querySelectorAll('.tecla.tecla-shift-numero'));
let caract = Array.prototype.slice.call(document.querySelectorAll('.tecla.tecla-caract-espec'));
let others = Array.prototype.slice.call(document.querySelectorAll('.tecla.tecla-caract-espec-tiny'));
Array.prototype.push.apply(letters, Array.prototype.slice.call(numeros));
Array.prototype.push.apply(letters, Array.prototype.slice.call(caract));
Array.prototype.push.apply(others, Array.prototype.slice.call(document.querySelectorAll('.tecla.tecla-null')))
Array.prototype.push.apply(letters, Array.prototype.slice.call(others));

let shift = Array.prototype.slice.call(document.querySelectorAll('.tecla.tecla-shift'));
Array.prototype.push.apply(shift, Array.prototype.slice.call(document.querySelectorAll('.tecla.tecla-bloq-mayus')));

let back = document.querySelector('.tecla.tecla-backspace');
let temp = document.querySelector('#pass');
let status = false;

shift.forEach(key => {
    key.addEventListener('click', e => {
        status = !status;
        letters.forEach(item => {
            item.children[0].innerHTML = status ? item.children[0].innerHTML.toUpperCase() : item.children[0].innerHTML.toLowerCase();
        })
        numeros.forEach(item => {
            item.children[0].innerHTML = numberorsymbols(item.id.substring(1), status);
        })
        caract.forEach(item => {
            item.children[0].innerHTML = symbols(item.id, status);
        })
        others.forEach(item => {
            item.children[0].innerHTML = symbols(item.id, status);
        })
    })
});
letters.forEach(key => {
    key.addEventListener('click', e => {
        temp.value = temp.value + e.currentTarget.children[0].innerHTML;
    })
});
back.addEventListener('click', e => {
    temp.value = temp.value.substring(0, temp.value.length - 1);
});

function numberorsymbols(value, state) {
    switch (value) {
        case '1':
            return state ? '!' : '1';
        case '2':
            return state ? '"' : '2';
        case '3':
            return state ? '·' : '3';
        case '4':
            return state ? '$' : '4';
        case '5':
            return state ? '%' : '5';
        case '6':
            return state ? '&' : '6';
        case '7':
            return state ? '/' : '7';
        case '8':
            return state ? '(' : '8';
        case '9':
            return state ? ')' : '9';
        case '0':
            return state ? '=' : '0';
        default:
            break;
    }
}

function symbols(value, state) {
    switch (value) {
        case 'dotcoma':
            return state ? `&#59;` : `&#44;`;
        case 'twodots':
            return state ? `&#58;` : `&#46;`;
        case 'minus':
            return state ? `&#8212;` : `&#8211;`;
        case 'greater':
            return state ? `&gt;` : `&lt;`;
        case 'rightbra':
            return state ? `&#93;` : `&#125;`;
        case 'leftbra':
            return state ? `&#91;` : `&#123;`;
        case 'plus':
            return state ? `&#42;` : `&#43;`;
        case 'accent':
            return state ? `&#168;` : `&#180;`;
        case 'question':
            return state ? `&#63;` : `&#39;`;
        case 'questiontwo':
            return state ? `&#161;` : `&#191;`;
        case 'bar':
            return state ? `&#186;` : `&#124;`;
        default:
            break;
    }
}