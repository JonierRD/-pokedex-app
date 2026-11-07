import { useEffect } from 'react';
import { formatId, getTypeColor, STAT_LABELS } from '../utils/pokemonTypes';

function PokemonModal({ pokemon, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const artwork =
    pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default;
  const accent = getTypeColor(pokemon.types[0]?.type.name);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pokemon-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{ '--accent': accent }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar" autoFocus>
          ×
        </button>

        <div className="modal-hero">
          <img src={artwork} alt={pokemon.name} />
          <span className="modal-id">{formatId(pokemon.id)}</span>
        </div>

        <h2 id="pokemon-modal-title" className="modal-name">
          {pokemon.name}
        </h2>

        <div className="modal-types">
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

        <div className="modal-meta">
          <div>
            <span>Altura</span>
            <strong>{(pokemon.height / 10).toFixed(1)} m</strong>
          </div>
          <div>
            <span>Peso</span>
            <strong>{(pokemon.weight / 10).toFixed(1)} kg</strong>
          </div>
          <div>
            <span>Habilidades</span>
            <strong>{pokemon.abilities.map((a) => a.ability.name).join(', ')}</strong>
          </div>
        </div>

        <div className="modal-stats">
          <h3>Estadísticas base</h3>
          {pokemon.stats.map((s) => (
            <div className="stat-row" key={s.stat.name}>
              <span className="stat-name">{STAT_LABELS[s.stat.name] ?? s.stat.name}</span>
              <span className="stat-value">{s.base_stat}</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonModal;
