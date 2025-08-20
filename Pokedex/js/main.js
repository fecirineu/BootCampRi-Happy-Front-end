const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords =15
const limit =5
let offset = 0




 function LoadPokemonItens(offset, limit){
  function convertPokemonToLi(pokemon) {
  return `
   <li class="pokemon ${pokemon.type}"> 
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
            <ol class="types">
          ${pokemon.types.map((type) =>  `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" 
            alt="${pokemon.name}" >
        </div>
    </li>
  `;
}


pokeApi.getPokemons(offset,limit).then((pokemons = []) => { 
  pokemonList.innerHTML += pokemons.map(convertPokemonToLi).join('')
 });

 

 }

 LoadPokemonItens(offset,limit)

 loadMoreButton.addEventListener('click', () => {
  offset += limit;

  const qtdRecordNexPage = offset+limit;

  if(qtdRecordNexPage >= maxRecords){
    const newLimit = maxRecords - offset
      LoadPokemonItens(offset,newLimit)

      loadMoreButton.parentElement.removeChild(loadMoreButton)
  }else{
    LoadPokemonItens(offset,limit)
  }
 })


