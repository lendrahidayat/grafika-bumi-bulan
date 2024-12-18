

const canvas = document.getElementById('solarSystem');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Objek tata surya
const sun = { radius: 80, color: "yellow", name: "Matahari" };
const earth = { radiusOrbit: 250, size: 25, color: "blue", speed: 0.02, angle: 0, name: "Bumi" };
const moon = { radiusOrbit: 60, size: 10, color: "gray", speed: 0.1, angle: 0, name: "Bulan" };

// Efek latar belakang bintang
const stars = Array(300).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    opacity: Math.random()
}));

const info = document.getElementById('info');

function drawStars() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
    });
}

function drawSun() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, sun.radius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sun.radius);
    gradient.addColorStop(0, "yellow");
    gradient.addColorStop(1, "orange");
    ctx.fillStyle = gradient;
    ctx.shadowColor = "rgba(255, 255, 0, 0.8)";
    ctx.shadowBlur = 20;
    ctx.fill();
}

function drawPlanet(planet, orbitX, orbitY) {
    const x = orbitX + planet.radiusOrbit * Math.cos(planet.angle);
    const y = orbitY + planet.radiusOrbit * Math.sin(planet.angle);

    // Orbit
    ctx.beginPath();
    ctx.arc(orbitX, orbitY, planet.radiusOrbit, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 10]);
    ctx.stroke();

    // Planet/Bulan
    ctx.beginPath();
    ctx.arc(x, y, planet.size, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, planet.size);
    gradient.addColorStop(0, planet.color);
    gradient.addColorStop(1, "black");
    ctx.fillStyle = gradient;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fill();

    ctx.setLineDash([]);
    return { x, y };
}

function isMouseOver(mouseX, mouseY, objectX, objectY, objectSize) {
    return Math.sqrt((mouseX - objectX) ** 2 + (mouseY - objectY) ** 2) <= objectSize;
}

canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    let hoveredObject = null;

    // Hitung posisi bumi dan bulan
    const earthPosition = drawPlanet(earth, centerX, centerY);
    const moonPosition = drawPlanet(moon, earthPosition.x, earthPosition.y);

    // Periksa apakah kursor berada di atas salah satu objek
    if (isMouseOver(mouseX, mouseY, centerX, centerY, sun.radius)) {
        hoveredObject = sun;
    } else if (isMouseOver(mouseX, mouseY, earthPosition.x, earthPosition.y, earth.size)) {
        hoveredObject = earth;
    } else if (isMouseOver(mouseX, mouseY, moonPosition.x, moonPosition.y, moon.size)) {
        hoveredObject = moon;
    }

    // Tampilkan informasi
    if (hoveredObject) {
        info.innerHTML = `<strong>${hoveredObject.name}</strong>`;
    } else {
        info.innerHTML = "Arahkan kursor ke objek untuk melihat detail.";
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Latar belakang bintang
    drawStars();

    // Matahari
    drawSun();

    // Bumi dan bulan
    earth.angle += earth.speed;
    const earthPosition = drawPlanet(earth, centerX, centerY);

    moon.angle += moon.speed;
    drawPlanet(moon, earthPosition.x, earthPosition.y);

    requestAnimationFrame(animate);
}

animate();
