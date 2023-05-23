import React from 'react';
import PropTypes from 'prop-types';

const Popup = ({ pokemon, onClose }) => {
  const { image, name, type, id, height, weight, stats } = pokemon;

  return (
    <div className="popup">
      <div className="popup-close" onClick={onClose}>
        EXIT
      </div>
      <div className="popup-content">
        <div className="popup-header">
          <img className="popup-image" src={image} alt={name} />
          
          <div className="popup-info">
            <span>#{id}</span>
            <span className={`popup-type ${type.toLowerCase()}`}>{type}</span>
            <span className={`popup-type ${type.toLowerCase()}`}>{type}</span>
            <span>Height: {height / 10} m</span>
            <span>Weight: {weight / 10} kg</span>
          </div>

        </div>
        <div className="popup-body">
          <div className="popup-stats">
            <div className="popup-stats-header">Base Stats</div>
            {stats.map((stat) => (
              <div key={stat.name} className="popup-stats-item">
                <span>{stat.name}</span>
                <span>{stat.value}</span>
              </div>
            ))}
          </div>
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
    id: PropTypes.number.isRequired,
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
