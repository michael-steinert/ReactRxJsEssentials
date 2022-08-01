import { createContext, useContext } from "react";
import { BehaviorSubject, map, combineLatestWith } from "rxjs";

export interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  power?: number;
  selected?: boolean;
}

// Convention that Observables has a $
const rawPokemon$ = new BehaviorSubject<Pokemon[]>([]);

// Reactive Programming: pokemonWithPower$ changes when rawPokemon$ changes
const pokemonWithPower$ = rawPokemon$.pipe(
  map((pokemon) => {
    return pokemon.map((p) => {
      return {
        ...p,
        power:
          p.hp +
          p.attack +
          p.defense +
          p.special_attack +
          p.special_defense +
          p.speed,
      };
    });
  })
);

const selectedPokemon$ = new BehaviorSubject<number[]>([0]);

// Reactive Programming: pokemon$ changes when pokemonWithPower$ changes
const pokemon$ = pokemonWithPower$.pipe(
  // Combining Observables pokemonWithPower$ with selectedPokemon$
  combineLatestWith(selectedPokemon$),
  map(([pokemon, selectedPokemon]) => {
    return pokemon.map((p) => {
      return {
        ...p,
        selected: selectedPokemon.includes(p.id),
      };
    });
  })
);

// Reactive Programming: deckOfPokemon$ changes when pokemon$ changes
const deckOfPokemon$ = pokemon$.pipe(
  map((pokemon) => {
    return pokemon.filter((p) => {
      return p.selected;
    });
  })
);

fetch("/pokemon-simplified.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    return rawPokemon$.next(data);
  });

// Custom Hook
export const usePokemon = () => {
  return useContext(PokemonContext);
};

const PokemonContext = createContext({
  pokemon$,
  selectedPokemon$,
  deckOfPokemon$,
});

export const PokemonProvider: React.FunctionComponent = ({ children }) => {
  return (
    <PokemonContext.Provider
      value={{
        pokemon$,
        selectedPokemon$,
        deckOfPokemon$,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
