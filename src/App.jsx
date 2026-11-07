import { useState, useEffect } from 'react';
import { getPokemonList } from './services/pokemonService';
import PokemonCard from './components/PokemonCard';
import PokemonModal from './components/PokemonModal';
import './styles.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        const data = await getPokemonList(20, 0);
        setPokemonList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemons();
  }, []);

  const filteredPokemons = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="pokeball" aria-hidden="true" />
          <div>
            <h1>Catálogo Pokédex</h1>
            <p>Explora los primeros 20 Pokémon y descubre sus estadísticas</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="search-box">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar Pokémon por nombre"
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => setSearch('')}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>

        {loading && (
          <div className="grid" aria-busy="true" aria-label="Cargando Pokémon">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="skeleton-card" key={index} aria-hidden="true">
                <div className="skeleton skeleton-img" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line short" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="state state-error" role="alert">
            <h2>No se pudo cargar la Pokédex</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredPokemons.length === 0 && (
          <div className="state">
            <h2>Sin coincidencias</h2>
            <p>No se encontró ningún Pokémon con “{search}”.</p>
          </div>
        )}

        {!loading && !error && filteredPokemons.length > 0 && (
          <div className="grid">
            {filteredPokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                pokemonName={pokemon.name}
                onSelect={setSelectedPokemon}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <span>{filteredPokemons.length} Pokémon</span>
        <span>Datos en vivo de PokéAPI</span>
      </footer>

      {selectedPokemon && (
        <PokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
      )}
    </div>
  );
}

export default App;
