const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 2;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#00f5ff";
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            this.x -= dx / 10;
            this.y -= dy / 10;
        }

        this.draw();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function connect() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(0,245,255,0.2)";
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.update());
    connect();
    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();

// ---- To-Do List ----
function updateProgress() {
    const tasks = document.querySelectorAll("#tasklist li");
    const completed = document.querySelectorAll("#tasklist li.completed");
    document.querySelector(".numbers").textContent = `${completed.length}/${tasks.length}`;
}

function addTask() {
    const input = document.getElementById("inputtask");
    if (input.value.trim() === "") return;

    const newtask = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = function () {
        newtask.classList.toggle("completed", checkbox.checked);
        updateProgress();
    };

    const span = document.createElement("span");
    span.textContent = input.value;

    const deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete";
    deletebtn.onclick = function () {
        newtask.remove();
        updateProgress();
    };

    newtask.appendChild(checkbox);
    newtask.appendChild(span);
    newtask.appendChild(deletebtn);

    document.getElementById("tasklist").appendChild(newtask);
    input.value = "";
    updateProgress();
}

function updateProgress() {
    const tasks = document.querySelectorAll("#tasklist li");
    const completed = document.querySelectorAll("#tasklist li.completed");

    // update counter
    document.querySelector(".numbers").textContent = `${completed.length}/${tasks.length}`;

    // update progress bar
    const fill = document.querySelector(".progress-fill");
    let percent = tasks.length === 0 ? 0 : (completed.length / tasks.length) * 100;
    fill.style.width = percent + "%";
}
