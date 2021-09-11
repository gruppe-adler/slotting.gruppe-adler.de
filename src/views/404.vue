<template>
    <main>
        <img src="https://gruppe-adler.de/logo.png">
        <h1>Du bist auf dem falschen Pfad unterwegs</h1>
        <p>Wir wollen dich nicht beim Suchen stören, aber hier ist nichts.</p>
    </main>
</template>

<style lang="scss" scoped>
main {
    display: grid;
    grid-template:
        "logo heading" auto
        "logo text" auto / auto auto;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    height: 100vh;
    gap: 1rem;

    @media(max-width: 50rem) {
        grid-template:
            "logo" auto
            "heading" auto
            "text" auto / auto;

        justify-items: center;
        text-align: center;
    }
}

img {
    grid-area: logo;
    max-width: 20rem;
}

h1 {
    grid-area: heading;
    align-self: flex-end;
    margin: 0;
}

p {
    grid-area: text;
    align-self: flex-start;
    margin: 0;
}
</style>
