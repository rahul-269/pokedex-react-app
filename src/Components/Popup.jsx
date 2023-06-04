import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GetPokemon from './GetPokemon';
import GetAbility from './GetAbility';

const Popup = ({ pokemon, onClose }) => {
  
  const [pokeman,setPokeman] = useState(pokemon);
  const { image, name,length, type, abilities, id, height, weight, stats } = pokeman;
  const [purl,setPurl] = useState(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  const [selected, setSelected] = useState(0);
  

 
  console.log(purl);
  
  const nextPokemon = () => {
    console.log('clicked next');
    setPurl(`https://pokeapi.co/api/v2/pokemon/${id+1}/`);
  }

  const prevPokemon = () => {
    console.log('clicked prev');
    setPurl(`https://pokeapi.co/api/v2/pokemon/${id-1}/`);
  }
    
    useEffect(()=>{
      
        const fetchpkmn = async() => {
          const pokemons = await GetPokemon(purl);
          console.log(pokemons.selectedPokemonData);
          setPokeman(pokemons.selectedPokemonData);
        }
        fetchpkmn()
    },[purl]) 
    
  

  const bothType = (type) => {
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

  const allAbilities = (abilities) => {
    if(abilities.length===1)
    {
      const ability1 = abilities[0].ability.name;
      const abiurl1 = abilities[0].ability.url;
      return <><span>Abilities</span>
               <span>
                Ability: {ucaseFirst(ability1)}
                <GetAbility abiurl={abiurl1}/>
               </span></>
    }
    else if(abilities.length===2)
    {
      const ability1 = abilities[0].ability.name;
      const hiddenability = abilities[1].ability.name;
      const abiurl1 = abilities[0].ability.url;
      const abiurl2 = abilities[1].ability.url;
      return <><span>Abilities</span>
               <span>
                Abi-1: {ucaseFirst(ability1)}
                <GetAbility abiurl={abiurl1}/>
                </span>
               <span>
                H-Abi: {ucaseFirst(hiddenability)}
                <GetAbility abiurl={abiurl2}/>
                </span>
             </>
    }
    else
    {
      const ability1 = abilities[0].ability.name;
      const ability2 = abilities[1].ability.name;
      const hiddenability = abilities[2].ability.name;
      const abiurl1 = abilities[0].ability.url;
      const abiurl2 = abilities[1].ability.url;
      const abiurl3 = abilities[2].ability.url;
      return <><span>Abilities</span>
               <span>
                Abi-1: {ucaseFirst(ability1)}
               <GetAbility abiurl={abiurl1}/>
               </span>
               <span>
                Abi-2: {ucaseFirst(ability2)}
                <GetAbility abiurl={abiurl2}/>
                </span>
               <span>
                H-Abi: {ucaseFirst(hiddenability)}
                <GetAbility abiurl={abiurl3}/>
                </span>
             </>
    }
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
            <>{bothType(type)}</>
            <span>Height: {height / 10} m</span>
            <span>Weight: {weight / 10} kg</span>
          </div>
        </div>

        <div className="popup-body">
          <div>
          

          {(selected === 0) && <div className="popup-stats">
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
          </div>}

          {(selected === 1) && <div className="popup-body-info">
          {allAbilities(abilities)}
            
          </div>}

        </div>

        <div>
        <div className='toggle-buttons'> 
                <div className='stats-button' onClick={() => setSelected(0)}> Stats </div>
                <div className='abilities-button' onClick={() => setSelected(1)}> Abilities </div>     
        </div>

        <div className='pop-end-buttons'>
              <div className="popup-prev-button" onClick={prevPokemon}>
                PREV
              </div>
              <div className="popup-next-button" onClick={nextPokemon} >
                NEXT
              </div>  
        </div>
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
    length: PropTypes.number.isRequired,
    type: PropTypes.array.isRequired,
    abilities: PropTypes.array.isRequired,
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
