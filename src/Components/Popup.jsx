import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GetPokemon from './GetPokemon';
import GetAbility from './GetAbility';
import { motion } from 'framer-motion';

const Popup = ({ pokemon, onClose }) => {
  
  const [pokeman,setPokeman] = useState(pokemon);
  const { image, name,length, type, abilities, moves, id, height, weight, stats } = pokeman;
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
      return <><div className='ability-header'>Abilities</div>
               <div className='ability-item-one'>
                 <span className='ability-name'>{ucaseFirst(ability1)}</span>
                 <span><GetAbility abiurl={abiurl1}/></span>
               </div>
             </>
    }
    else if(abilities.length===2)
    {
      const ability1 = abilities[0].ability.name;
      const hiddenability = abilities[1].ability.name;
      const abiurl1 = abilities[0].ability.url;
      const abiurl2 = abilities[1].ability.url;
      return <><div className='ability-header'>Abilities</div>
               <div className='ability-item-two'>
                <span className='ability-name'>{ucaseFirst(ability1)}</span>
                <span><GetAbility abiurl={abiurl1}/></span>
               </div>
               <div className="ability-item-two">
                <span className='ability-name'>{ucaseFirst(hiddenability)}</span>
                <span><GetAbility abiurl={abiurl2}/></span>
               </div>
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
      return <><div className='ability-header'>Abilities</div>
               <div className='ability-item'>
                <span className='ability-name'>{ucaseFirst(ability1)}</span>
                <span><GetAbility abiurl={abiurl1}/></span>
               </div>
               <div className="ability-item">
                <span className='ability-name'>{ucaseFirst(ability2)}</span>
                <span><GetAbility abiurl={abiurl2}/></span>
               </div>
               <div className="ability-item">
                <span className='ability-name'>{ucaseFirst(hiddenability)}</span>
                <span><GetAbility abiurl={abiurl3}/></span>
               </div>
             </>
    }
  };

  const basetotal = stats.reduce((a,b) => {
    return a + b.value;
  },0);

  return (
    <motion.div className="popup" animate={{scale:1,x:"0%",y:"0%",translateX:"-50%",translateY: "-50%"}} initial={{scale:0,x:"50%", y:"50%" }} transition={{type:"tween",duration:1}}>
      <div className="popup-close" onClick={onClose}>
        EXIT
      </div>
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-image"> 
          <motion.img className='popup-image-sprite' src={image} alt={name} animate={{ rotate: [0,-15,15,0], y: [0,5,-15,0] }} transition={{delay:1}} />
          </div>
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

          {(selected ===2) && <div className='popup-moves-info'>
            <div className="moves-header">Learnable Moves</div>
              {moves.map((move)=>(
                <div key={move.move.name} className='popup-moves-item'>
                  <span>
                    {ucaseFirst(move.move.name)}
                  </span>
                </div>
            
              ))}</div>}

          {(selected ===3) && <div className='popup-shiny-info'>
            <div className="popup-image">
            <motion.img className='popup-image-sprite' key={id} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`} alt={`shiny ${name}`} animate={{ rotate: [0,-15,15,0], y: [0,5,-15,0] ,x:[0,5,0]}} transition={{delay:0.5}}/>
            </div>
          </div>}

        </div>

        <div className='dpad-buttons'>
        <div className='toggle-buttons'> 
            <div className='button-group'>
                <div className='stats-button' onClick={() => setSelected(0)}> STATS </div>
                <div className='moves-button' onClick={() => setSelected(2)}> MOVES </div>
            </div>
            <div className='button-group'>
                <div className='abilities-button' onClick={() => setSelected(1)}> ABILITIES </div> 
                <div className='shiny-button' onClick={() => setSelected(3)}> SHINY </div> 
            </div>  
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
    </motion.div>
  );
};

Popup.propTypes = {
  pokemon: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    type: PropTypes.array.isRequired,
    abilities: PropTypes.array.isRequired,
    moves: PropTypes.array.isRequired,
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
