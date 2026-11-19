/* ==========================================
   PROBE GAMING - SCRIPT.JS
   PART 1
========================================== */

"use strict";

/*=========================================
LOADER
=========================================*/

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        loader.style.transition = "0.8s";

    }, 2500);

});

/*=========================================
CUSTOM CURSOR
=========================================*/

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

});

/*=========================================
SCROLL PROGRESS BAR
=========================================*/

const progress = document.getElementById("progress");

window.addEventListener("scroll", () => {

    const totalHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progressHeight =
        (window.scrollY / totalHeight) * 100;

    progress.style.width = progressHeight + "%";

});

/*=========================================
NAVBAR EFFECT
=========================================*/

const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        nav.style.background = "rgba(0,0,0,.85)";
        nav.style.padding = "15px 8%";
        nav.style.boxShadow = "0 5px 30px rgba(0,0,0,.5)";

    } else {

        nav.style.background = "rgba(0,0,0,.45)";
        nav.style.padding = "20px 8%";
        nav.style.boxShadow = "none";

    }

});

/*=========================================
SMOOTH SCROLL
=========================================*/

document.querySelectorAll('nav a').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const section =
            document.querySelector(this.getAttribute("href"));

        if (section) {

            section.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

/*=========================================
BUTTON HOVER
=========================================*/

document.querySelectorAll(".btn").forEach(btn => {

    btn.addEventListener("mouseenter", () => {

        btn.style.transform = "translateY(-5px) scale(1.03)";

    });

    btn.addEventListener("mouseleave", () => {

        btn.style.transform = "translateY(0) scale(1)";

    });

});

/*=========================================
TYPING EFFECT
=========================================*/

const words = [

    "BGMI MONTAGES",
    "LIVE STREAMS",
    "RANK PUSH",
    "SCRIMS",
    "FUNNY MOMENTS",
    "ESPORTS"

];

let wordIndex = 0;
let letterIndex = 0;
let deleting = false;

const typing = document.getElementById("typing");

function typeEffect() {

    const current = words[wordIndex];

    if (!deleting) {

        typing.textContent =
            current.substring(0, letterIndex++);

        if (letterIndex > current.length) {

            deleting = true;

            setTimeout(typeEffect, 1200);

            return;

        }

    } else {

        typing.textContent =
            current.substring(0, letterIndex--);

        if (letterIndex === 0) {

            deleting = false;

            wordIndex++;

            if (wordIndex >= words.length) {

                wordIndex = 0;

            }

        }

    }

    setTimeout(typeEffect, deleting ? 60 : 120);

}

typeEffect();

/*=========================================
LIVE SUBSCRIBERS
=========================================*/

const subs = document.getElementById("subs");

let totalSubs = 439000;

setInterval(() => {

    totalSubs += Math.floor(Math.random() * 4);

    subs.innerHTML = (totalSubs / 1000).toFixed(1) + "K";

}, 3000);

/*=========================================
FLOATING PARTICLES
=========================================*/

const particleBox = document.getElementById("particles");

for (let i = 0; i < 80; i++) {

    const particle = document.createElement("span");

    particle.style.position = "absolute";
    particle.style.width = "3px";
    particle.style.height = "3px";
    particle.style.borderRadius = "50%";

    particle.style.background = Math.random() > .5
        ? "#ff0055"
        : "#ff7b00";

    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";

    particle.style.opacity = Math.random();

    particle.style.boxShadow =
        "0 0 12px currentColor";

    particle.style.animation =
        `float ${4 + Math.random() * 6}s linear infinite`;

    particle.style.animationDelay =
        Math.random() * 5 + "s";

    particleBox.appendChild(particle);

}

/*=========================================
FLOAT KEYFRAMES
=========================================*/

const style = document.createElement("style");

style.innerHTML = `

@keyframes float{

0%{

transform:translateY(0px);

}

50%{

transform:translateY(-80px);

}

100%{

transform:translateY(0px);

}

}

`;

document.head.appendChild(style);