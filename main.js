const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const textContainer = document.querySelector('.text-container')

const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    pressed: false
}

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
})

window.addEventListener("click", (e) => {
    if (giftHidden) {
        return
    }
    hidingGift = true
})

window.addEventListener('mousedown', e => {
    mouse.pressed = true
});

window.addEventListener('mouseup', e => {
    mouse.pressed = false
});

function getImages() {
    let images = []
    let img = new Image();
    img.src = './img/balloonBlue.png'
    images.push(img);

    img = new Image();
    img.src = './img/balloonLightGreen.png'
    images.push(img);

    img = new Image();
    img.src = './img/balloonOrange.png'
    images.push(img);

    img = new Image();
    img.src = './img/balloonPink.png'
    images.push(img);

    img = new Image();
    img.src = './img/balloonRed.png'
    images.push(img);

    return images
}

let giftImage = new Image()
giftImage.src = './img/gift.png'

let bgImage = new Image()
bgImage.src = './img/bg.png'

let images = getImages();
let balloons = [];

let giftAlpha = 1.0
let hidingGift = false;
let giftHidden = false;

let textShowing = false;
let textAlpha = 0.0

let letterShown = false;
let balloonCooldown = 100

class Balloon {
    constructor(image, x, y) {
        this.image = image,
            this.x = x
        this.y = y
    }
}

function spawnBaloons() {
    balloons.push(new Balloon(images[Math.floor(Math.random() * images.length)], Math.random() * (canvas.width - 50), canvas.height))
}

function loop() {

    c.clearRect(0, 0, canvas.width, canvas.height)

    let balloonsToRemove = []

    if (balloonCooldown < 0 && giftHidden) {
        balloonCooldown = 100
        spawnBaloons();
    }

    balloons.forEach(b => {
        if(mouse.pressed){
            b.y -= 5
        } else{
            b.y -= 3
        }
        c.drawImage(b.image, b.x, b.y, 50, 100)

        if (b.y < - 100) {
            balloonsToRemove.push(b);
        }
    })

    if (balloonsToRemove.length > 0) {
        balloons = [...balloons.filter(b => balloonsToRemove.indexOf(b) == -1)]
    }

    if (hidingGift) {
        if (giftAlpha < 0) {
            hidingGift = false
            giftHidden = true
            setTimeout(() => {
                textShowing = true;
            }, 100)
        }
        else if (giftAlpha > 0) {
            c.globalAlpha = giftAlpha
            c.drawImage(giftImage, canvas.width / 2 - 128, canvas.height / 2 - 128, 256, 256)
            c.globalAlpha = 1
        }
        giftAlpha -= 0.01
    } else if (!giftHidden) {
        c.drawImage(giftImage, canvas.width / 2 - 128, canvas.height / 2 - 128, 256, 256)
    }

    if (textShowing) {
        textAlpha += .005
        if (textAlpha > 1) {
            textAlpha = 1
            textShowing = false
            letterShown = true
        }
        textContainer.style.opacity = `${textAlpha}`
        c.globalAlpha = textAlpha
        c.drawImage(bgImage, canvas.width / 2 - 256, canvas.height / 2 - 200, 512, 424)
        c.globalAlpha = 1
    }
    else if (letterShown) {
        c.drawImage(bgImage, canvas.width / 2 - 256, canvas.height / 2 - 200, 512, 424)
    }

    if(mouse.pressed){
        balloonCooldown -= 20        
    }else{
        balloonCooldown -= 10
    }
    window.requestAnimationFrame(loop)
}

window.requestAnimationFrame(loop)
