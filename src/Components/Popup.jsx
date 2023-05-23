import React from 'react';
import PropTypes from 'prop-types';



const Popup = ({ pokemon, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-close" onClick={onClose}>
        Close
      </div>
      <div className="popup-content">
        <img className="popup-image" src={pokemon.image} alt={pokemon.name} />
        <div className="popup-info">
          <span>Type: {pokemon.type}</span>
          <span>Height: {pokemon.height/10} m</span>
          <span>Weight: {pokemon.weight/10} kg</span>
        </div>
        <div className="popup-stats">
          <div className="popup-stats-header">Base Stats</div>
          {pokemon.stats.map((stat) => (
            <div key={stat.name} className="popup-stats-item">
              <span>{stat.name}</span>
              <span>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Popup.propTypes = {
  pokemon: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    weight: PropTypes.number.isRequired,
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Popup;
