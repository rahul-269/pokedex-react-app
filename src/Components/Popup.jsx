import React from 'react';
import PropTypes from 'prop-types';

const Popup = ({ pokemon, onClose }) => {
  const { image, name,length, type, id, height, weight, stats } = pokemon;

  const bothType = () => {
    if(length===2)
    {
      const type1 = type[0].type.name.toUpperCase();
      const type2 = type[1].type.name.toUpperCase();
      return <><span className={`popup-type ${type[0].type.name}`}>{type1}</span><span className={`popup-type ${type[1].type.name}`}>{type2}</span></>;
    }
    else
    {
      const type1 = type[0].type.name.toUpperCase();
      return <><span className={`popup-type ${type[0].type.name}`}>{type1}</span></>;

    }
  };

  const ucaseFirst = (pkname) => {
    return (
      pkname.charAt(0).toUpperCase() + pkname.slice(1).toLowerCase()
    );
  };

  const basetotal = stats.reduce((a,b) => {
    return a + b.value;
  },0);

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
            <span>{ucaseFirst(name)}</span>
            <>{bothType()}</>
            <span>Height: {height / 10} m</span>
            <span>Weight: {weight / 10} kg</span>
          </div>
        </div>

        <div className="popup-body">
          <div className="popup-stats">
            <div className="popup-stats-header">Base Stats</div>
            {stats.map((stat) => (
              <div key={stat.name} className="popup-stats-item">
                <span>{ucaseFirst(stat.name)}</span>
                <span>{stat.value}</span>
              </div>
            ))}
            <div className="popup-stats-item">
              <span>Total</span>
              <span>{basetotal}</span>
            </div>
          </div>
          <span>hello</span>
        </div>
      </div>
    </div>
  );
};

Popup.propTypes = {
  pokemon: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    type: PropTypes.array.isRequired,
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
