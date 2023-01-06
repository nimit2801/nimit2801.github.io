<script setup lang="ts">

</script>

<template>
    <img class="ufo-image" src="../assets/polar-ufo-1.gif">
    <div class="typewriter">
        <h1 class="typewriter">Welcome to Nimit's Website</h1>
    </div>
    <div class="about-me">
        <h1>About Me</h1>
        <p>I'm a backend developer who loves to work with communities and build products. Currently I'm learning devOps
            and other emerging backend tech stack
            You can get my <a
                href="https://cdn.discordapp.com/attachments/708326707182174218/1051527028895141928/Nimit_Resume_Update_11.12.22.pdf"
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
    </div>
</template>

<style>
.ufo-image {
    width: 10%;
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
    gap: 1em;
    grid-template-columns: auto auto auto auto;
    padding: 10px;
}

.item {
    margin: 10px;
    font-size: 30px;
    text-align: center;
}

.item>h4 {
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 25px;
}

a {
    text-decoration: none;
    color: #F0EBCE;
}
</style>
