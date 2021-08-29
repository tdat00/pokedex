/*
This script will parse Type Chart of PokemonDB to JSON object.
Ref: https://pokemondb.net/type/dual
*/

let rows = Array.from(document.getElementById('dualtypechart').rows);
let attack_types = Array.from(rows[0].cells).slice(2).map(cell => cell.getElementsByTagName('a')[0]['title']);

let damage = [];
rows.forEach(row => {
  if (['has-pkmn', 'no-pkmn'].indexOf(row.getAttribute('class')) === -1) {
    return;
  }

  let cells = Array.from(row.cells);

  let types = Array.from(cells[0].getElementsByTagName('a')).map(x => x.innerText).filter(x => x !== '—');
  let values = cells.slice(2).map(x => {
    switch (x.innerText) {
      case '½':
        return "0.5"
      case '¼':
        return "0.25";
      default:
        return x.innerText;
    }
  });

  damage.push({types, values});
});

console.log(attack_types);
console.log(damage);
