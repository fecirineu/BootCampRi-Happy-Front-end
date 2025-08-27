// engine.js
import { getPokemons } from './pokeApi.js';

const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        attack: document.getElementById("card-attack")
    },
    fieldCards: {
        player: document.getElementById("player-field-type"),
        computer: document.getElementById("computer-field-type"),
        playerAttack: document.getElementById("player-field-attack"),
        computerAttack: document.getElementById("computer-field-attack"),
        playerName: document.getElementById("player-field-name"),
        computerName: document.getElementById("computer-field-name"),
          playerType: document.getElementById("player-field-type-span"),
        computerType: document.getElementById("computer-field-type-span"),
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel")
    },
    pokemonList: [],
    selectedPokemon: null
};

const typeAdvantages = {
    fire: ["grass"],
    water: ["fire"],
    grass: ["water"],
    electric: ["water"],
};

async function init() {
    state.pokemonList = await getPokemons();
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    state.actions.button.addEventListener("click", resetDuel);
}

async function getRandomPokemon() {
    const randomIndex = Math.floor(Math.random() * state.pokemonList.length);
    return state.pokemonList[randomIndex];
}

async function createCardElement(pokemon, fieldSide) {
    const cardElement = document.createElement("div");

    if (fieldSide === state.playerSides.player1) {
        cardElement.classList.add("pokemon-card", `type-${pokemon.type}`);
    
        cardElement.setAttribute("data-id", pokemon.id);
        cardElement.innerHTML = `
      
            <div class="card-info">
                <p>${pokemon.name}</p>
                      <img src="${pokemon.img}" alt="${pokemon.name}">
                <div class="type-${pokemon.type}"> ${pokemon.type}</div>
                <p>Attack: ${pokemon.attack}</p>
            </div>
        `;
        
        cardElement.addEventListener("click", () => setCardsField(pokemon));
        cardElement.addEventListener("mouseover", () => drawSelectCard(pokemon));
    } else {
        cardElement.classList.add("pokemon-cardComputer", "computer");
    }

    return cardElement;
}

async function drawCards(cardNumbers, fieldSide) {
    const container = document.getElementById(fieldSide);
    container.innerHTML = "";

    for (let i = 0; i < cardNumbers; i++) {
        const pokemon = await getRandomPokemon();
        const cardElement = await createCardElement(pokemon, fieldSide);
        container.appendChild(cardElement);
    }
}
function clearTypes(){
    document.getElementById("cleft").classList.remove(`type-water`);
      document.getElementById("cleft").classList.remove(`type-fire`);
        document.getElementById("cleft").classList.remove(`type-electric`);
          document.getElementById("cleft").classList.remove(`type-ground`);
              document.getElementById("cleft").classList.remove(`type-grass`);
              state.cardSprites.type.classList.remove(`type-water`);
              state.cardSprites.type.classList.remove(`type-electric`);
              state.cardSprites.type.classList.remove(`type-fire`);
              state.cardSprites.type.classList.remove(`type-ground`);
              state.cardSprites.type.classList.remove(`type-grass`);

                          state.fieldCards.computerType.classList.remove(`type-grass`);
    state.fieldCards.playerType.classList.remove(`type-grass`);
                           state.fieldCards.computerType.classList.remove(`type-electric`);
    state.fieldCards.playerType.classList.remove(`type-electric`);
                          state.fieldCards.computerType.classList.remove(`type-water`);
    state.fieldCards.playerType.classList.remove(`type-water`);
      state.fieldCards.computerType.innerText=  ``;
    state.fieldCards.playerType.innerText=  ``;
}
async function drawSelectCard(pokemon) {
    clearTypes();
    state.cardSprites.avatar.src = pokemon.img;
    state.cardSprites.name.innerText = pokemon.name;
     state.cardSprites.type.innerText = pokemon.type;
    state.cardSprites.type.classList.add(`type-${pokemon.type}`);
    state.cardSprites.attack.innerText = `Ataque: ${pokemon.attack}`;

        document.getElementById("cleft").classList.add(`type-${pokemon.type}`);
    state.selectedPokemon = pokemon;
}

async function checkDuelResult(playerCard, computerCard) {
    let duelResult = "draw";

    if (typeAdvantages[playerCard.type]?.includes(computerCard.type)) {
        duelResult = "win";
        state.score.playerScore++;
    } else if (typeAdvantages[computerCard.type]?.includes(playerCard.type)) {
        duelResult = "lose";
        state.score.computerScore++;
    } else {
        if (playerCard.attack > computerCard.attack) {
            duelResult = "win";
            state.score.playerScore++;
        } else if (playerCard.attack < computerCard.attack) {
            duelResult = "lose";
            state.score.computerScore++;
        }
    }

    await playAudio(duelResult);
    return duelResult;
}

async function setCardsField(playerCard) {
    removeAllCardsImages();
    const computerCard = await getRandomPokemon();

    state.fieldCards.player.src = playerCard.img;
    state.fieldCards.computer.src = computerCard.img;
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    state.fieldCards.playerAttack.innerText = `Ataque: ${playerCard.attack}`;
    state.fieldCards.computerAttack.innerText = `Ataque: ${computerCard.attack}`;
        state.fieldCards.playerName.innerText = ` ${playerCard.name}`;
    state.fieldCards.computerName.innerText = ` ${computerCard.name}`;
            state.fieldCards.computerType.classList.add(`type-${computerCard.type}`);
    state.fieldCards.playerType.classList.add(`type-${playerCard.type}`);
      state.fieldCards.computerType.innerText=  `${computerCard.type}`;
    state.fieldCards.playerType.innerText=  `${playerCard.type}`;

    const duelResult = await checkDuelResult(playerCard, computerCard);

    if (duelResult === "win") {
            state.fieldCards.player.parentElement.classList.remove("fieldLose");
        state.fieldCards.player.parentElement.classList.add("fieldwin");
        state.fieldCards.computer.parentElement.classList.add("fieldLose");
    } else if (duelResult === "lose") {
        state.fieldCards.player.parentElement.classList.add("fieldLose");
          state.fieldCards.computer.parentElement.classList.remove("fieldLose");
        state.fieldCards.computer.parentElement.classList.add("fieldwin");
    }

    await updateScore();
    await drawButton(duelResult);
}

function removeAllCardsImages() {
    state.playerSides.computerBox.querySelectorAll(".pokemon-card").forEach(card => card.remove());
    state.playerSides.player1Box.querySelectorAll(".pokemon-card").forEach(card => card.remove());
}

async function updateScore() {
    state.score.scoreBox.innerText = `Vitórias: ${state.score.playerScore} | Derrotas: ${state.score.computerScore}`;
}

async function drawButton(result) {
    state.actions.button.innerText = result === "win" ? "VITÓRIA - PRÓXIMO DUELO" :
                                     result === "lose" ? "DERROTA - PRÓXIMO DUELO" : "EMPATE - PRÓXIMO DUELO";
    state.actions.button.style.display = "block";
}

async function resetDuel() {
  clearTypes();
    state.actions.button.style.display = "none";

    state.cardSprites.avatar.src = "src/assets/card-back.png";
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "um Pokémon";
    state.cardSprites.attack.innerText = ``;
 state.fieldCards.playerAttack.innerText = ``;
    state.fieldCards.computerAttack.innerText = ``;
          state.fieldCards.computer.parentElement.classList.remove("fieldLose");
                state.fieldCards.computer.parentElement.classList.remove("fieldwin");
                          state.fieldCards.player.parentElement.classList.remove("fieldLose");
                state.fieldCards.player.parentElement.classList.remove("fieldwin");
                 state.fieldCards.player.src = "src/assets/card-back.png";
                    state.fieldCards.computer.src = "src/assets/card-back.png";

    init();
}

async function playAudio(status) {
    try {
        const audio = new Audio(`assets/${status}.wav`);
        audio.volume = 0.5;
        await audio.play();
    } catch (error) {
        console.log("Áudio não disponível");
    }
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");

    if (body.classList.contains("light-theme")) {
        body.classList.replace("light-theme", "dark-theme");
        themeToggle.innerText = "Modo Claro";
    } else {
        body.classList.replace("dark-theme", "light-theme");
        themeToggle.innerText = "Modo Escuro";
    }
}

document.addEventListener("DOMContentLoaded", init);
