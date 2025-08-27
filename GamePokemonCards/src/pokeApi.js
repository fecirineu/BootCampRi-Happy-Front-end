// pokeApi.js
export class Pokemon {
    constructor(id, name, type, img, attack) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.img = img;
        this.attack = attack;
    }
}

const API_URL = "https://pokeapi.co/api/v2/pokemon";
const validTypes = ["electric", "water", "fire","grass"];

export async function getPokemons() {
    try {
        const response = await fetch(`${API_URL}?limit=75`);
        const data = await response.json();

        const pokemonList = await Promise.all(
            data.results.map(async (pokemon) => {
                const details = await fetch(pokemon.url).then(res => res.json());
                const validType = details.types.find(type => validTypes.includes(type.type.name));
                
                if (validType) {
                    return new Pokemon(
                        details.id,
                        details.name,
                        validType.type.name,
                        details.sprites.other["official-artwork"].front_default || details.sprites.front_default,
                        details.stats.find(stat => stat.stat.name === "attack").base_stat
                    );
                }
                return null;
            })
        );

        const filtered = pokemonList.filter(p => p !== null);

        return filtered.length > 0 ? filtered : getDefaultPokemons();

    } catch (error) {
        console.error("Erro na API:", error);
        return getDefaultPokemons();
    }
}

function getDefaultPokemons() {
    return [
        new Pokemon(4, "charmander", "fire", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png", 52),
        new Pokemon(7, "squirtle", "water", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png", 48),
        new Pokemon(50, "diglett", "ground", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/50.png", 55),
        new Pokemon(37, "vulpix", "fire", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37.png", 41),
        new Pokemon(54, "psyduck", "water", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png", 52),
        new Pokemon(27, "sandshrew", "ground", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png", 75)
    ];
}
