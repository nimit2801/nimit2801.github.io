<script setup lang="ts">
    const aboutMe = 'Hello there! I am Nimit Savant, I\'m a backend developer and Project Manager who loves to work with Open Source projects. I\'m currently looking for various open source projects I can contribute too and give my expertise to make development better. Along with development I also have a keen interest in Developer Relations, as I\'ve been a advocate of technologies in my career. I love to talk about new developments in the fiend of software and how that can benefit developer experience.';
</script>

<template>
    <img class="ufo-image" src="../assets/polar-ufo-1.gif">
    <div class="typewriter">
        <h1 class="typewriter">Welcome to Nimit's Website</h1>
    </div>
    <div class="about-me">
        <h1>About Me</h1>
        <p>{{aboutMe}}
            You can get my <a
                href="./Nimit Resume.pdf"
                target="_blank">Resume Here!</a>
        </p>
    </div>
    <div class="container">
        <a href="https://github.com/nimit2801" target=”_blank”>
            <div class="item"><img src="https://img.icons8.com/material-rounded/48/null/github.png" />
                <h4>GitHub Profile</h4>
            </div>
        </a>
        <a href="https://twitter.com/SavantNimit" target=”_blank”>
            <div class="item"><img src="https://img.icons8.com/color/48/null/twitter--v1.png" />
                <h4>Twitter</h4>
            </div>
        </a>
        <a href="https://www.linkedin.com/in/nimit-savant-95b7571a0/" target=”_blank”>

            <div class="item"><img src="https://img.icons8.com/color/48/null/linkedin-circled--v1.png" />
                <h4>LinkedIn</h4>
            </div>
        </a>
        <a href="mailto:hello@nimitsavant.me" target=”_blank”>
            <div class="item"><img src="https://img.icons8.com/ios-glyphs/48/null/circled-envelope.png" />
                <h4>Contact Me</h4>
            </div>
        </a>
        <a href="https://calendly.com/nimit2801/30min" target=”_blank”>
            <div class="item"><img width="48" src="https://img.icons8.com/wired/64/google-meet--v1.png" />
                <h4>Let's Meet</h4>
            </div>
        </a>
        <a href="./Nimit Resume.pdf"
            target=”_blank”>
            <div class="item"><img width="48" src="https://img.icons8.com/ios-glyphs/90/resume.png" />
                <h4>Resume Here Too</h4>
            </div>
        </a>
        <a href="https://discord.gg/BB5AqebMgk" target=”_blank”>
            <div class="item"><img width="48" src="https://img.icons8.com/ios/50/discord-logo--v1.png"
                    alt="discord-logo--v1" />
                <h4>Connect On Discord</h4>
            </div>
        </a>
    </div>
</template>

<style>
.ufo-image {
    width: 8%;
    margin-bottom: 3%;
}

.typewriter h1 {
    font-weight: 400;

    font-size: 50px;
    overflow: hidden;
    /* Ensures the content is not revealed until the animation */
    border-right: .15em solid black;
    /* The typwriter cursor */
    white-space: nowrap;
    /* Keeps the content on a single line */
    margin: 0 auto;
    /* Gives that scrolling effect as the typing happens */
    letter-spacing: .05em;
    /* Adjust as needed */
    animation:
        typing 3.5s steps(40, end),
        blink-caret .75s step-end infinite;
}

.typewriter {
    margin-bottom: 4em;
}

.about-me {
    margin: auto;
    width: 50%;
    margin-bottom: 6em;
}

.about-me>p {
    font-size: 20px;
}

.about-me a {
    text-decoration: underline;
}

/* The typing effect */
@keyframes typing {
    from {
        width: 0
    }

    to {
        width: 100%
    }
}

/* The typewriter cursor effect */
@keyframes blink-caret {

    from,
    to {
        border-color: transparent
    }
}

.container {
    display: inline-grid;
    gap: 0.2em;
    grid-template-columns: auto auto auto auto auto auto auto;
    padding: 10px;
}

.item {
    margin: 10px;
    font-size: 30px;
    text-align: center;
}

.item>img {
    width: 1.5em;
}

.item>h4 {
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 15px;
}

a {
    text-decoration: none;
    color: #F0EBCE;
}
</style>
