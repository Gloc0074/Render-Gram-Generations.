const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle System Setup
const particles = [];
const mouseTrail = { x: null, y: null };
const ripples = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.life = 0.7;
        this.color = '#1da1f2';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.03;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 100;
        this.speed = 5;
        this.life = 1;
    }

    update() {
        this.radius += this.speed;
        this.life -= 0.02;
    }

    draw() {
        ctx.strokeStyle = `rgba(29, 161, 242, ${this.life})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Track mouse movement and add ripple effect
document.addEventListener('mousemove', (e) => {
    mouseTrail.x = e.x;
    mouseTrail.y = e.y;
    for(let i = 0; i < 4; i++) {
        particles.push(new Particle(mouseTrail.x, mouseTrail.y));
    }
});

document.addEventListener('click', (e) => {
    ripples.push(new Ripple(e.x, e.y));
});

// Characters for Matrix effect
const chars = '01';
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);

// Initialize drops
const drops = [];
const dropSpeed = [];
for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * canvas.height / fontSize;
    dropSpeed[x] = Math.random() * 2 + 1;
}

// Matrix character scatter effect
function updateMatrixCharacters() {
    if (mouseTrail.x && mouseTrail.y) {
        for (let i = 0; i < drops.length; i++) {
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            const dx = x - mouseTrail.x;
            const dy = y - mouseTrail.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                dropSpeed[i] = Math.random() * 5 + 3;
            } else {
                dropSpeed[i] = Math.random() * 2 + 1;
            }
        }
    }
}

// Modify the drops and dropSpeed arrays initialization
for (let x = 0; x < columns; x++) {
    // Random starting positions across the entire screen
    drops[x] = Math.random() * canvas.height;
    // Random horizontal positions
    dropSpeed[x] = Math.random() * canvas.width;
}

// Update the drawMatrix function
function drawMatrix() {

    // During activation sequence, use a much lower alpha value so characters barely fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';  // Reduced from 0.05 to 0.01
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const numLayers = 5;
    for(let layer = 0; layer < numLayers; layer++) {
        const layerDepth = layer / numLayers;
        
        for (let i = 0; i < drops.length; i++) {
            const blueHues = ['#003366', '#004080', '#0059b3', '#0066cc', '#0080ff', '#3399ff', '#66b2ff'];
            
            const xOffset = (Math.random() - 0.5) * canvas.width * 2;
            const yOffset = (Math.random() - 0.5) * canvas.height * 2;
            
            const size = Math.max(10, Math.floor((1 - layerDepth) * 40));
            ctx.font = `${size}px 'Courier New'`;
            
            // Reduced speeds here
            const speed = ((1 - layerDepth) * 5 + Math.random() * 2);  // Reduced from 10 to 5
            const opacity = Math.max(0.2, 1 - layerDepth);
            
            ctx.fillStyle = blueHues[Math.floor(Math.random() * blueHues.length)];
            ctx.globalAlpha = opacity;

            const types = [
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                'abcdefghijklmnopqrstuvwxyz',
                '0123456789',
                'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
                '＠＄％＆＃＋－＝｜＿＾￥！？',
                '田水月火木土金石山川人女子日中国白百千万円年時分後前東西南北上下左右中外大小多少半市町村区州府県道京新会社部課局局所'
            ];

            const type = types[Math.floor(Math.random() * types.length)];
            const text = type[Math.floor(Math.random() * type.length)];

            const x = dropSpeed[i] + xOffset;
            const y = drops[i] + yOffset;
            
            ctx.fillText(text, x, y);

            // Reduced movement speeds here
            drops[i] += speed + Math.random() * 1.25;  // Reduced from 2.5 to 1.25
            dropSpeed[i] += (Math.random() - 0.5) * 2;  // Reduced from 4 to 2
            if (drops[i] > canvas.height * 1.5) {
                drops[i] = -canvas.height * Math.random();
                dropSpeed[i] = Math.random() * canvas.width;
                
                if (Math.random() > 0.8) {
                    ripples.push(new Ripple(x, canvas.height));
                    for(let p = 0; p < 3; p++) {
                        particles.push(new Particle(x, canvas.height));
                    }
                }
            }
        }
    }
    
    ctx.globalAlpha = 1;

}

// Get the header element
const header = document.querySelector('.navbar');
let headerHeight = header.offsetHeight;

function updateHeaderHeight() {
    headerHeight = header.offsetHeight;
}

updateHeaderHeight();
window.addEventListener('resize', updateHeaderHeight);

// Letter animation variables
const letters = [
    { char: 'A', startX: -100, startY: canvas.height / 2 },
    { char: 'c', startX: canvas.width + 100, startY: canvas.height / 2 },
    { char: 't', startX: canvas.width / 2, startY: -100 },
    { char: 'i', startX: -100, startY: canvas.height / 2 },
    { char: 'v', startX: canvas.width + 100, startY: canvas.height / 2 },
    { char: 'a', startX: -100, startY: canvas.height / 2 },
    { char: 't', startX: canvas.width + 100, startY: canvas.height / 2 },
    { char: 'i', startX: -100, startY: canvas.height / 2 },
    { char: 'n', startX: canvas.width + 100, startY: canvas.height / 2 },
    { char: 'g', startX: -100, startY: canvas.height / 2 }
];let animationStartTime = null;
const animationDuration = 4000; // Reduced from 3000
const holdDuration = 2000;      // Reduced from 3000
const animationDelay = 1000;       // Removed delay entirely

// Modify the animate function
function animate(timestamp) {
    if (!animationStartTime) {
        animationStartTime = timestamp;
    }
    const totalDuration = animationDuration + holdDuration;
    const progress = (timestamp - animationStartTime) / totalDuration;

    // Calculate opacity for fade out
    const opacity = progress > 0.7 ? 1 - ((progress - 0.7) / 0.3) : 1;
    
    // Apply opacity to matrix rain
    ctx.globalAlpha = opacity;
    drawMatrix();
    updateMatrixCharacters();

    // Apply same opacity to letters
    if (progress < 1) {
        const moveProgress = Math.min(progress * (totalDuration / animationDuration), 1);
        const easedProgress = easeInOutQuad(moveProgress);
        drawLetters(easedProgress);
    }

    requestAnimationFrame(animate);
}function drawLetters(easedProgress) {
            letters.forEach((letter, index) => {
                const totalWidth = 600; // Increased spread
                const letterSpacing = totalWidth / (letters.length - 1);
                const endX = (canvas.width * 0.75 - totalWidth / 2) + index * letterSpacing;
                const endY = canvas.height / 2;

                const x = letter.startX + (endX - letter.startX) * easedProgress;
                const y = letter.startY + (endY - letter.startY) * easedProgress;

                const startFontSize = 15; // Smaller starting size
                const endFontSize = 40;   // Smaller end size
        
                const fontSize = startFontSize + (endFontSize - startFontSize) * easedProgress;

                // Rest of your existing styling code
                const brandElement = document.querySelector('.brand-name');
                const brandStyles = window.getComputedStyle(brandElement);
        
                ctx.font = `${brandStyles.fontWeight} ${fontSize}px ${brandStyles.fontFamily}`;
                ctx.strokeStyle = brandStyles.textStrokeColor || brandStyles.webkitTextStrokeColor;
                ctx.lineWidth = parseInt(brandStyles.textStrokeWidth || brandStyles.webkitTextStrokeWidth);
                ctx.strokeText(letter.char, x, y);
                ctx.fillStyle = brandStyles.color;
                ctx.fillText(letter.char, x, y);
            });
}function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function interpolateColor(color1, color2, factor) {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);

    const r1 = (c1 >> 16) & 0xff;
    const g1 = (c1 >> 8) & 0xff;
    const b1 = c1 & 0xff;

    const r2 = (c2 >> 16) & 0xff;
    const g2 = (c2 >> 8) & 0xff;
    const b2 = c2 & 0xff;

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `rgb(${r},${g},${b})`;
}

// 3D Card Effect
document.addEventListener('DOMContentLoaded', () => {
    const features = document.querySelectorAll('.feature');
    
    features.forEach(feature => {
        feature.addEventListener('mousemove', (e) => {
            const rect = feature.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            feature.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            feature.style.boxShadow = `0 0 30px rgba(29, 161, 242, 0.6)`;
        });
        
        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            feature.style.boxShadow = 'none';
        });
    });
});

// Start the animation
requestAnimationFrame(animate);

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const newColumns = Math.floor(canvas.width / fontSize);
    drops.length = 0;
    dropSpeed.length = 0;
    for (let x = 0; x < newColumns; x++) {
        drops[x] = Math.random() * canvas.height / fontSize;
        dropSpeed[x] = Math.random() * 2 + 1;
    }

    letters[0].startY = canvas.height / 2;
    letters[1].startY = canvas.height / 2;
    letters[2].startY = -100;
    letters[3].startY = canvas.height / 2;
    letters[4].startY = canvas.height / 2;

    letters[0].startX = -100;
    letters[1].startX = canvas.width + 100;
    letters[2].startX = -100;
    letters[3].startX = canvas.width + 100;
    letters[4].startX = canvas.width + 100;

    updateHeaderHeight();
});

document.getElementById('cyborg-overlay').addEventListener('ended', function() {
    this.currentTime = this.duration;
});
