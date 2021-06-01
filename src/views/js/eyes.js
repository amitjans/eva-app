var socket = io.connect('http://127.0.0.1:3000', { forceNew: true });
var canvas = document.querySelector("#eyes");
canvas.style.backgroundColor = 'white';
var context = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;
context.width = canvas.width;
context.height = canvas.height;
var i = 1;
var emotion = 'ini';
var emotiondir = 'img/eyes/black';
var fs_status = false;
var fullscreenButton = document.querySelector("#fullscreen");

socket.on('messages', async function (data) {
    if (data.anim == 'blink' || data.anim == 'wink') {
        emotion = data.anim;
        animx2(data.anim, -10);
    } else if (emotion != 'ini' && data.anim != 'ini') {
        animx2(data.anim);
    } else {
        anim(data.anim);
    }
})

function putImage(url) {
    let base_image = new Image();
    base_image.src = url;
    base_image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(base_image, 0, 0, canvas.width, canvas.height);
    }
}

putImage(`${emotiondir}/joy/joy (1).png`);

function anim(animation) {
    let dir = (animation != 'ini');
    emotion = dir ? animation : emotion;
    var anim = setInterval(() => {
        putImage(`${emotiondir}/${emotion}/${emotion + ' (' + i + ')'}.png`);
        i = dir ? i + 1 : i - 1;
        if (i == 17 || i == 0) {
            i = dir ? 16 : 1;
            emotion = animation;
            clearInterval(anim);
        }
    }, 42);
}

function animx2(animation, value = -16) {
    i = value;
    var anim = setInterval(() => {
        putImage(`${emotiondir}/${emotion}/${emotion + ' (' + Math.abs(i) + ')'}.png`);
        i++;
        if (i == 0) {
            i++;
            emotion = animation;
        }
        if (i == (Math.abs(value) + 1)) {
            i = (animation == 'blink' || animation == 'wink') ? 1 : i;
            emotion = (animation == 'blink' || animation == 'wink') ? 'ini' : emotion;
            clearInterval(anim);
        }
    }, 42);
}

fullscreenButton.addEventListener('click', function () {
    canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    fs_status = true;
});

function fullscreen() {
    if (fs_status) {
        document.webkitCancelFullScreen();
    } else {
        canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    fs_status = !fs_status;
}

function changeeyes(value){
    switch (value) {
      case 'black':
        emotiondir = 'img/eyes/black';
        canvas.style.backgroundColor = 'white';
        break;
    case 'white':
        emotiondir = 'img/eyes/white';
        canvas.style.backgroundColor = 'black';
        break;
      default:
        break;
    }
    putImage(`${emotiondir}/joy/joy (1).png`);
    changeview('vieweyeselect', 'vieweyes');
  }