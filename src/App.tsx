import { useObservableState } from "observable-hooks";
import { useEffect, useMemo, useState } from "react";
import { BehaviorSubject, map, combineLatestWith } from "rxjs";
import "./App.css";
import { usePokemon, PokemonProvider, Pokemon } from "./store";

const Deck = () => {
  const { deckOfPokemon$ } = usePokemon();
  // Alternative with Dependency Observables-Hooks
  const deckOfPokemon = useObservableState(deckOfPokemon$, []);
  return (
    <div>
      <h4>Deck</h4>
      <div>
        {deckOfPokemon.map((p, index) => {
          return (
            <div key={index} style={{ display: "flex" }}>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                alt={p.name}
              />
              <div>{p.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Search = () => {
  const { pokemon$, selectedPokemon$ } = usePokemon();
  //const [search, setSearch] = useState<string>("");
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const search$ = useMemo(() => {
    return new BehaviorSubject("");
  }, []);
  const [filteredPokemon] = useObservableState(() => {
    return pokemon$.pipe(
      combineLatestWith(search$),
      map(([pokemon, search]) => {
        return pokemon.filter((p) => {
          return p.name.toLowerCase().includes(search.toLowerCase());
        });
      })
    );
  }, []);

  useEffect(() => {
    const subscription = pokemon$.subscribe((x) => {
      setPokemon(x);
    });

    return () => {
      return subscription.unsubscribe();
    };
  }, []);

  /*
  const filteredPokemon = useMemo(() => {
    return pokemon.filter((p) => {
      return p.name.toLowerCase().includes(search$.value.toLowerCase());
    });
  }, [pokemon, search]);
  */

  return (
    <div>
      <input
        onChange={(event) => search$.next(event.target.value)}
        type={"text"}
        value={search$.value}
      />
      <div>
        {filteredPokemon.map((p, index) => {
          return (
            <div key={index}>
              <input
                onChange={() => {
                  if (selectedPokemon$.value.includes(p.id)) {
                    selectedPokemon$.next(
                      // Removing Pokemon with specific ID
                      selectedPokemon$.value.filter((id) => {
                        return id !== p.id;
                      })
                    );
                  } else {
                    selectedPokemon$.next([
                      // Adding Pokemon with specific ID
                      ...selectedPokemon$.value,
                      p.id,
                    ]);
                  }
                }}
                checked={p.selected}
                type={"checkbox"}
              />
              <strong>
                {p.name} - {p.power}
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <PokemonProvider>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <Search />
        <Deck />
      </div>
    </PokemonProvider>
  );
};

export default App;
