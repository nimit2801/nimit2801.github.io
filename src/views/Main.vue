<script setup lang="ts">
import { onMounted } from 'vue';

const aboutMe = 'Hello there! I am Nimit Savant, I\'m a Developer Advocate at DevRev who loves to work with Communities and Startups. I love to talk about new technologies in the field of Software Tech, JavaScript,Cloud and Databases and how they can benefit developer experience.';

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
});
</script>

<template>
    <div id="main">
        <img class="ufo-image floating" src="../assets/polar-ufo-1.gif" alt="UFO">
        <div class="typewriter">
            <h1>Welcome to Nimit's Website</h1>
        </div>
        <div class="about-me hidden">
            <h2>About Me</h2>
            <p>{{ aboutMe }}
                You can get my <a href="/files/Nimit_Resume.pdf" target="_blank">Resume Here!</a>
            </p>
        </div>
        <div class="logo-container hidden">
            <a href="https://github.com/nimit2801" target="_blank" class="item">
                <img src="https://img.icons8.com/material-rounded/48/null/github.png" alt="GitHub" />
                <h4>GitHub Profile</h4>
            </a>
            <a href="https://twitter.com/SavantNimit" target="_blank" class="item">
                <img src="https://img.icons8.com/color/48/null/twitter--v1.png" alt="Twitter" />
                <h4>Twitter</h4>
            </a>
            <a href="https://www.linkedin.com/in/nimit-savant-95b7571a0/" target="_blank" class="item">
                <img src="https://img.icons8.com/color/48/null/linkedin-circled--v1.png" alt="LinkedIn" />
                <h4>LinkedIn</h4>
            </a>
            <a href="mailto:hello@nimitsavant.me" target="_blank" class="item">
                <img src="https://img.icons8.com/ios-glyphs/48/null/circled-envelope.png" alt="Email" />
                <h4>Contact Me</h4>
            </a>
            <a href="https://cal.com/nimit-devassure" target="_blank" class="item">
                <img width="48" src="https://img.icons8.com/wired/64/google-meet--v1.png" alt="Meet" />
                <h4>Let's Meet</h4>
            </a>
            <a href="/files/Nimit_Resume.pdf" target="_blank" class="item">
                <img width="48" src="https://img.icons8.com/ios-glyphs/90/resume.png" alt="Resume" />
                <h4>Resume Here Too</h4>
            </a>
            <a href="https://discord.gg/BB5AqebMgk" target="_blank" class="item">
                <img width="48" src="https://img.icons8.com/ios/50/discord-logo--v1.png" alt="Discord" />
                <h4>Connect On Discord</h4>
            </a>
        </div>

        <footer class="hidden">
            <p>© 2024 Nimit Savant</p>
        </footer>
    </div>
</template>

<style scoped>
#main {
    padding: 20px;
    box-sizing: border-box;
}

.ufo-image {
    width: 8%;
    max-width: 100px;
    margin-bottom: 1.5em;
}

.typewriter h1 {
    font-weight: 400;
    font-size: 50px;
    overflow: hidden;
    white-space: nowrap;
    margin: 0 auto;
    letter-spacing: .05em;
    animation: typing 3.5s steps(40, end);
}

.typewriter {
    margin-bottom: 1.5em;
}

.about-me {
    margin: auto;
    width: 80%;
    max-width: 800px;
    margin-bottom: 3em;
}

.about-me > p {
    font-size: 18px;
}

.about-me a {
    text-decoration: underline;
}

@keyframes typing {
    from { width: 0 }
    to { width: 100% }
}

.logo-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    padding: 10px;
}

.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100px;
    text-align: center;
    transition: transform 0.3s ease;
}

.item:hover {
    transform: scale(1.1);
}

.item > img {
    width: 48px;
    height: 48px;
}

.item > h4 {
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 14px;
}

.hidden {
    opacity: 0;
    filter: blur(5px);
    transform: translateX(-100%);
    transition: all 1s;
}

.show {
    opacity: 1;
    filter: blur(0);
    transform: translateX(0);
}

.floating {
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
    100% {
        transform: translateY(0px);
    }
}

@media only screen and (max-width: 768px) {
    .ufo-image {
        width: 20%;
    }

    .typewriter h1 {
        font-size: 30px;
    }

    .about-me {
        width: 90%;
    }

    .about-me h2 {
        font-size: 24px;
    }

    .about-me > p {
        font-size: 16px;
    }

    .item {
        width: 80px;
    }

    .item > img {
        width: 36px;
        height: 36px;
    }

    .item > h4 {
        font-size: 12px;
    }
}
</style>