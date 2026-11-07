import { useState, useEffect } from 'react';
import { getPokemonDetails } from '../services/pokemonService';
import { formatId, getTypeColor } from '../utils/pokemonTypes';

function PokemonCard({ pokemonName, onSelect }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const data = await getPokemonDetails(pokemonName);
        setPokemon(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [pokemonName]);

  if (loading) {
    return (
      <div className="skeleton-card" aria-hidden="true">
        <div className="skeleton skeleton-img" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div>
    );
  }

  if (!pokemon) return null;

  const mainType = pokemon.types[0]?.type.name;
  const accent = getTypeColor(mainType);
  const artwork =
    pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default;

  return (
    <article
      className="card"
      style={{ '--accent': accent }}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(pokemon)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(pokemon);
        }
      }}
      aria-label={`Ver detalles de ${pokemon.name}`}
    >
      <span className="card-id">{formatId(pokemon.id)}</span>

      <div className="card-image">
        <img src={artwork} alt={pokemon.name} loading="lazy" />
      </div>

      <h3 className="card-name">{pokemon.name}</h3>

      <div className="card-types">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className="type-badge"
            style={{ backgroundColor: getTypeColor(t.type.name) }}
          >
            {t.type.name}
          </span>
        ))}
      </div>

      <div className="card-stats">
        <span>
          <strong>{pokemon.stats[0].base_stat}</strong> HP
        </span>
        <span>
          <strong>{pokemon.stats[1].base_stat}</strong> ATK
        </span>
      </div>

      <span className="card-hint">Ver detalles</span>
    </article>
  );
}

export default PokemonCard;
