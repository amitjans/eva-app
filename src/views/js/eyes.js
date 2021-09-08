var socket = io.connect('http://127.0.0.1:3000', { forceNew: true });
var canvas = document.querySelector("#eyes");
canvas.style.backgroundColor = 'white';
var context = canvas.getContext('2d');
canvas.width = window.screen.width * 0.6667;
canvas.height = window.screen.height * 0.6667;
context.width = canvas.width;
context.height = canvas.height;
var i = 1;
var emotion = 'ini';
var emotiondir = 'img/eyes/black';
var fs_status = false;
var frames = { blink: 10, wink: 10, joy: 16, sad: 16, anger: 16, surprise: 16 };
var fullscreenButton = document.querySelector("#fullscreen");

socket.on('messages', async function ({ anim }) {
    console.log(anim);
    if (anim == 'blink' || anim == 'wink') {
        emotion = anim;
        playanimx2(anim, frames[anim] * -1);
    } else if (emotion != 'ini' && anim != 'ini') {
        playanimx2(anim, frames[emotion] * -1);
    } else if (emotion == 'ini' && anim == 'ini') {
    } else {
        playanim(anim, frames[anim]);
    }
})

socket.emit('code', 'asd');

function putImage(url) {
    let base_image = new Image();
    base_image.src = url;
    base_image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(base_image, 0, 0, canvas.width, canvas.height);
    }
}

putImage(`${emotiondir}/joy/joy (1).png`);

function playanim(animation, value) {
    let dir = (animation != 'ini');
    emotion = dir ? animation : emotion;
    var anim = setInterval(() => {
        putImage(`${emotiondir}/${emotion}/${emotion + ' (' + i + ')'}.png`);
        i = dir ? i + 1 : i - 1;
        if (i > value || i == 0) {
            i = dir ? value : 1;
            emotion = animation;
            clearInterval(anim);
        }
    }, 42);
}

function playanimx2(animation, value) {
    var anim = setInterval(() => {
        putImage(`${emotiondir}/${emotion}/${emotion + ' (' + Math.abs(value) + ')'}.png`);
        value++;
        if (value == 0) {
            value++;
            emotion = animation;
        }
        if (value > frames[animation]) {
            i = (animation == 'blink' || animation == 'wink') ? 1 : frames[animation];
            emotion = (animation == 'blink' || animation == 'wink') ? 'ini' : emotion;
            clearInterval(anim);
        }
    }, 42);
}

function blink() {
    setInterval(() => {
        if (emotion == 'ini') {
            emotion = 'blink';
            playanimx2('blink', frames['blink'] * -1);
        }
    }, 10000);
}
blink();

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
        frames = { blink: 10, wink: 10, joy: 16, sad: 16, anger: 16, surprise: 16 };
        break;
    case 'white':
        emotiondir = 'img/eyes/white';
        canvas.style.backgroundColor = 'black';
        frames = { blink: 10, wink: 10, joy: 16, sad: 16, anger: 16, surprise: 16 };
        break;
    case 'dots':
        emotiondir = 'img/eyes/dots';
        canvas.style.backgroundColor = 'black';
        frames = { blink: 14, wink: 14, joy: 19, sad: 20, anger: 17, surprise: 20 };
        break;
      default:
        break;
    }
    putImage(`${emotiondir}/joy/joy (1).png`);
    changeview('vieweyeselect', 'vieweyes');
  }