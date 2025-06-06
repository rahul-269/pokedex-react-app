import React, { useEffect, useState } from "react";
import GetPokemon from "./GetPokemon";
import GetAbility from "./GetAbility";
import { motion, AnimatePresence } from "framer-motion";

const ModernPokedexPopup = ({ pokemon, onClose }) => {
  const [pokeman, setPokeman] = useState(pokemon);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [shinyMode, setShinyMode] = useState(false);
  const [evolutionData, setEvolutionData] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [varietiesData, setVarietiesData] = useState([]);
  const [damageRelations, setDamageRelations] = useState({});
  const [moveDetails, setMoveDetails] = useState({});

  const { image, name, type, abilities, moves, id, height, weight, stats } =
    pokeman;

  const [purl, setPurl] = useState(`https://pokeapi.co/api/v2/pokemon/${id}/`);

  // Fetch comprehensive Pokemon data
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        // Fetch species data
        const speciesResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${id}/`
        );
        const species = await speciesResponse.json();
        setSpeciesData(species);

        // Fetch evolution chain
        if (species.evolution_chain?.url) {
          const evolutionResponse = await fetch(species.evolution_chain.url);
          const evolution = await evolutionResponse.json();
          setEvolutionData(evolution);
        }

        // Fetch location data
        const locationResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${id}/encounters`
        );
        const locations = await locationResponse.json();
        setLocationData(locations);

        // Fetch type damage relations
        const typeRelations = {};
        for (const typeInfo of type) {
          const typeResponse = await fetch(typeInfo.type.url);
          const typeData = await typeResponse.json();
          typeRelations[typeInfo.type.name] = typeData.damage_relations;
        }
        setDamageRelations(typeRelations);

        // Fetch varieties/forms
        if (species.varieties) {
          const varietiesPromises = species.varieties.map((variety) =>
            fetch(variety.pokemon.url).then((res) => res.json())
          );
          const varieties = await Promise.all(varietiesPromises);
          setVarietiesData(varieties);
        }

        // Fetch details for top moves
        const topMoves = moves.slice(0, 10);
        const moveDetailsPromises = topMoves.map((move) =>
          fetch(move.move.url).then((res) => res.json())
        );
        const moveDetailsResults = await Promise.all(moveDetailsPromises);
        const moveDetailsObj = {};
        moveDetailsResults.forEach((moveDetail, index) => {
          moveDetailsObj[topMoves[index].move.name] = moveDetail;
        });
        setMoveDetails(moveDetailsObj);
      } catch (error) {
        console.error("Error fetching additional data:", error);
      }
    };

    fetchAdditionalData();
  }, [id]);

  const nextPokemon = async () => {
    if (id >= 1010) return;
    setLoading(true);
    setPurl(`https://pokeapi.co/api/v2/pokemon/${id + 1}/`);
  };

  const prevPokemon = async () => {
    if (id <= 1) return;
    setLoading(true);
    setPurl(`https://pokeapi.co/api/v2/pokemon/${id - 1}/`);
  };

  useEffect(() => {
    const fetchpkmn = async () => {
      setLoading(true);
      try {
        const pokemons = await GetPokemon(purl);
        setPokeman(pokemons.selectedPokemonData);
        setShinyMode(false);
        setActiveTab("overview");
      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchpkmn();
  }, [purl]);

  const ucaseFirst = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  };

  const getTypeColor = (typeName) => {
    const typeColors = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };
    return typeColors[typeName] || "#68A090";
  };

  const getFlavorText = () => {
    if (!speciesData?.flavor_text_entries) return "No description available.";
    const englishEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    return englishEntry
      ? englishEntry.flavor_text.replace(/\f/g, " ")
      : "No description available.";
  };

  const getStatColor = (statName) => {
    const statColors = {
      hp: "#FF5959",
      attack: "#F5AC78",
      defense: "#FAE078",
      "special-attack": "#9DB7F5",
      "special-defense": "#A7DB8D",
      speed: "#FA92B2",
    };
    return statColors[statName] || "#68A090";
  };

  const getStatBarWidth = (value) => {
    return Math.min((value / 255) * 100, 100);
  };

  const getStatRank = (statName, value) => {
    if (value >= 150) return "Excellent";
    if (value >= 120) return "Very Good";
    if (value >= 90) return "Good";
    if (value >= 60) return "Average";
    if (value >= 40) return "Below Average";
    return "Poor";
  };

  const baseStatTotal = stats.reduce((total, stat) => total + stat.value, 0);

  const parseEvolutionChain = (chain) => {
    const evolutionChain = [];
    let current = chain;

    while (current) {
      const pokemonId = current.species.url.split("/").slice(-2, -1)[0];
      evolutionChain.push({
        name: current.species.name,
        id: pokemonId,
        evolutionDetails: current.evolution_details[0] || null,
      });
      current = current.evolves_to[0];
    }

    return evolutionChain;
  };

  const getGenderRate = () => {
    if (!speciesData?.gender_rate) return "Unknown";
    if (speciesData.gender_rate === -1) return "Genderless";
    const femaleRate = (speciesData.gender_rate / 8) * 100;
    const maleRate = 100 - femaleRate;
    return `♂ ${maleRate}% / ♀ ${femaleRate}%`;
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "stats", label: "Stats", icon: "📊" },
    { id: "abilities", label: "Abilities", icon: "⚡" },
    { id: "moves", label: "Moves", icon: "⚔️" },
    { id: "evolution", label: "Evolution", icon: "🔄" },
    { id: "location", label: "Habitat", icon: "🗺️" },
    { id: "forms", label: "Forms", icon: "🔄" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="pokedex-content">
            <div className="info-section">
              <h3 className="section-title">Basic Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Height:</span>
                  <span className="info-value">
                    {height / 10} m ({Math.round((height / 10) * 3.28)} ft)
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Weight:</span>
                  <span className="info-value">
                    {weight / 10} kg ({Math.round((weight / 10) * 2.2)} lbs)
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Base Experience:</span>
                  <span className="info-value">
                    {pokeman.base_experience || "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Habitat:</span>
                  <span className="info-value">
                    {speciesData?.habitat?.name
                      ? ucaseFirst(speciesData.habitat.name)
                      : "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Generation:</span>
                  <span className="info-value">
                    {speciesData?.generation?.name
                      ? ucaseFirst(
                          speciesData.generation.name.replace("-", " ")
                        )
                      : "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Shape:</span>
                  <span className="info-value">
                    {speciesData?.shape?.name
                      ? ucaseFirst(speciesData.shape.name)
                      : "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Color:</span>
                  <span className="info-value">
                    {speciesData?.color?.name
                      ? ucaseFirst(speciesData.color.name)
                      : "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender Ratio:</span>
                  <span className="info-value">{getGenderRate()}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title">Pokédex Entry</h3>
              <div className="pokemon-description">
                <p>{getFlavorText()}</p>
                {speciesData?.genera && (
                  <div className="genera-info">
                    <strong>Category:</strong>{" "}
                    {speciesData.genera.find((g) => g.language.name === "en")
                      ?.genus || "Unknown"}
                  </div>
                )}
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title">Breeding & Training</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Egg Groups:</span>
                  <span className="info-value">
                    {speciesData?.egg_groups
                      ?.map((group) => ucaseFirst(group.name))
                      .join(", ") || "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Hatch Time:</span>
                  <span className="info-value">
                    {speciesData?.hatch_counter
                      ? `${speciesData.hatch_counter * 255} steps`
                      : "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Capture Rate:</span>
                  <span className="info-value">
                    {speciesData?.capture_rate || "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Base Happiness:</span>
                  <span className="info-value">
                    {speciesData?.base_happiness || "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Growth Rate:</span>
                  <span className="info-value">
                    {speciesData?.growth_rate?.name
                      ? ucaseFirst(
                          speciesData.growth_rate.name.replace("-", " ")
                        )
                      : "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Is Legendary:</span>
                  <span className="info-value">
                    {speciesData?.is_legendary ? "Yes" : "No"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Is Mythical:</span>
                  <span className="info-value">
                    {speciesData?.is_mythical ? "Yes" : "No"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Has Gender Differences:</span>
                  <span className="info-value">
                    {speciesData?.has_gender_differences ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Type Effectiveness */}
            <div className="info-section">
              <h3 className="section-title">Type Effectiveness</h3>
              {Object.keys(damageRelations).length > 0 && (
                <div className="type-effectiveness">
                  {Object.entries(damageRelations).map(
                    ([typeName, relations]) => (
                      <div key={typeName} className="type-relations">
                        <h4
                          className="type-title"
                          style={{ color: getTypeColor(typeName) }}
                        >
                          {ucaseFirst(typeName)} Type
                        </h4>
                        <div className="effectiveness-grid">
                          <div className="effectiveness-section">
                            <strong>Weak to:</strong>
                            <div className="type-list">
                              {relations.double_damage_from?.map((type) => (
                                <span
                                  key={type.name}
                                  className="type-badge weak"
                                  style={{
                                    backgroundColor: getTypeColor(type.name),
                                  }}
                                >
                                  {ucaseFirst(type.name)}
                                </span>
                              )) || <span className="no-types">None</span>}
                            </div>
                          </div>
                          <div className="effectiveness-section">
                            <strong>Strong against:</strong>
                            <div className="type-list">
                              {relations.double_damage_to?.map((type) => (
                                <span
                                  key={type.name}
                                  className="type-badge strong"
                                  style={{
                                    backgroundColor: getTypeColor(type.name),
                                  }}
                                >
                                  {ucaseFirst(type.name)}
                                </span>
                              )) || <span className="no-types">None</span>}
                            </div>
                          </div>
                          <div className="effectiveness-section">
                            <strong>Resists:</strong>
                            <div className="type-list">
                              {relations.half_damage_from?.map((type) => (
                                <span
                                  key={type.name}
                                  className="type-badge resist"
                                  style={{
                                    backgroundColor: getTypeColor(type.name),
                                  }}
                                >
                                  {ucaseFirst(type.name)}
                                </span>
                              )) || <span className="no-types">None</span>}
                            </div>
                          </div>
                          <div className="effectiveness-section">
                            <strong>Immune to:</strong>
                            <div className="type-list">
                              {relations.no_damage_from?.map((type) => (
                                <span
                                  key={type.name}
                                  className="type-badge immune"
                                  style={{
                                    backgroundColor: getTypeColor(type.name),
                                  }}
                                >
                                  {ucaseFirst(type.name)}
                                </span>
                              )) || <span className="no-types">None</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="pokedex-content">
            <div className="info-section">
              <h3 className="section-title">Base Stats</h3>
              <div className="stats-container">
                {stats?.map((stat, index) => (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="stat-row"
                  >
                    <div className="stat-name">
                      {ucaseFirst(stat.name.replace("-", " "))}
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-bar-container">
                      <motion.div
                        className="stat-bar"
                        style={{ backgroundColor: getStatColor(stat.name) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${getStatBarWidth(stat.value)}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                      />
                    </div>
                    <div className="stat-rank">
                      {getStatRank(stat.name, stat.value)}
                    </div>
                  </motion.div>
                ))}
                <div className="stat-total">
                  <div className="stat-name">Base Stat Total</div>
                  <div className="stat-value">{baseStatTotal}</div>
                  <div className="stat-rank">
                    {baseStatTotal >= 600
                      ? "Legendary"
                      : baseStatTotal >= 500
                      ? "Excellent"
                      : baseStatTotal >= 400
                      ? "Good"
                      : "Average"}
                  </div>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 className="section-title">Stat Analysis</h3>
              <div className="stat-analysis">
                <div className="analysis-item">
                  <strong>Highest Stat:</strong>{" "}
                  {stats
                    .reduce((prev, current) =>
                      prev.value > current.value ? prev : current
                    )
                    .name.replace("-", " ")}{" "}
                  (
                  {
                    stats.reduce((prev, current) =>
                      prev.value > current.value ? prev : current
                    ).value
                  }
                  )
                </div>
                <div className="analysis-item">
                  <strong>Lowest Stat:</strong>{" "}
                  {stats
                    .reduce((prev, current) =>
                      prev.value < current.value ? prev : current
                    )
                    .name.replace("-", " ")}{" "}
                  (
                  {
                    stats.reduce((prev, current) =>
                      prev.value < current.value ? prev : current
                    ).value
                  }
                  )
                </div>
                <div className="analysis-item">
                  <strong>Stat Spread:</strong>{" "}
                  {baseStatTotal >= 500
                    ? "Well-rounded powerhouse"
                    : baseStatTotal >= 400
                    ? "Balanced combatant"
                    : "Specialist fighter"}
                </div>
              </div>
            </div>
          </div>
        );

      case "abilities":
        return (
          <div className="pokedex-content">
            <div className="info-section">
              <h3 className="section-title">Abilities</h3>
              <div className="abilities-container">
                {abilities?.map((ability, index) => (
                  <motion.div
                    key={ability.ability.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="ability-card"
                  >
                    <div className="ability-header">
                      <h4 className="ability-name">
                        {ucaseFirst(ability.ability.name.replace("-", " "))}
                      </h4>
                      <div className="ability-badges">
                        {ability.is_hidden && (
                          <span className="ability-badge hidden">
                            Hidden Ability
                          </span>
                        )}
                        <span className="ability-badge slot">
                          Slot {ability.slot}
                        </span>
                      </div>
                    </div>
                    <div className="ability-description">
                      <GetAbility abiurl={ability.ability.url} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case "moves":
        return (
          <div className="pokedex-content">
            <div className="info-section">
              <h3 className="section-title">Notable Moves</h3>
              <div className="moves-container">
                {moves.slice(0, 15)?.map((move, index) => {
                  const moveDetail = moveDetails[move.move.name];
                  return (
                    <motion.div
                      key={move.move.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="move-card"
                    >
                      <div className="move-header">
                        <div className="move-name">
                          {ucaseFirst(move.move.name.replace("-", " "))}
                        </div>
                        <div className="move-level">
                          {move.version_group_details[0]?.level_learned_at >
                            0 && (
                            <span className="level-badge">
                              Lv.{" "}
                              {move.version_group_details[0].level_learned_at}
                            </span>
                          )}
                          <span className="method-badge">
                            {ucaseFirst(
                              move.version_group_details[0]?.move_learn_method
                                ?.name || "unknown"
                            )}
                          </span>
                        </div>
                      </div>
                      {moveDetail && (
                        <div className="move-details">
                          <div className="move-stats">
                            {moveDetail.type && (
                              <span
                                className="move-type"
                                style={{
                                  backgroundColor: getTypeColor(
                                    moveDetail.type.name
                                  ),
                                }}
                              >
                                {ucaseFirst(moveDetail.type.name)}
                              </span>
                            )}
                            {moveDetail.damage_class && (
                              <span className="move-category">
                                {ucaseFirst(moveDetail.damage_class.name)}
                              </span>
                            )}
                            {moveDetail.power && (
                              <span className="move-power">
                                PWR: {moveDetail.power}
                              </span>
                            )}
                            {moveDetail.accuracy && (
                              <span className="move-accuracy">
                                ACC: {moveDetail.accuracy}%
                              </span>
                            )}
                            {moveDetail.pp && (
                              <span className="move-pp">
                                PP: {moveDetail.pp}
                              </span>
                            )}
                          </div>
                          {moveDetail.effect_entries?.[0] && (
                            <div className="move-description">
                              {moveDetail.effect_entries[0].short_effect}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                {moves.length > 15 && (
                  <div className="moves-more">
                    And {moves.length - 15} more moves available...
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "evolution":
        return (
          <div className="pokedex-content">
            <div className="info-section">
              <h3 className="section-title">Evolution Chain</h3>
              {evolutionData ? (
                <div className="evolution-chain">
                  {parseEvolutionChain(evolutionData.chain).map(
                    (evolution, index) => (
                      <div key={evolution.id} className="evolution-stage">
                        <div className="evolution-pokemon">
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`}
                            alt={evolution.name}
                            className="evolution-sprite"
                          />
                          <div className="evolution-info">
                            <div className="evolution-name">
                              {ucaseFirst(evolution.name)}
                            </div>
                            <div className="evolution-id">
                              #{String(evolution.id).padStart(3, "0")}
                            </div>
                          </div>
                        </div>
                        {index <
                          parseEvolutionChain(evolutionData.chain).length -
                            1 && (
                          <div className="evolution-arrow">
                            <div className="arrow">→</div>
                            {evolution.evolutionDetails && (
                              <div className="evolution-requirement">
                                {evolution.evolutionDetails.min_level && (
                                  <span>
                                    Level {evolution.evolutionDetails.min_level}
                                  </span>
                                )}
                                {evolution.evolutionDetails.item && (
                                  <span>
                                    {ucaseFirst(
                                      evolution.evolutionDetails.item.name
                                    )}
                                  </span>
                                )}
                                {evolution.evolutionDetails.trigger && (
                                  <span>
                                    {ucaseFirst(
                                      evolution.evolutionDetails.trigger.name
                                    )}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="evolution-placeholder">
                  <p>
                    This Pokémon does not evolve or evolution data is not
                    available.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "location":
        return (
          <div className="pokedex-content">
            <div className="info-section">
              <h3 className="section-title">Habitat & Locations</h3>
              {locationData.length > 0 ? (
                <div className="locations-container">
                  {locationData.slice(0, 10).map((location, index) => (
                    <div key={index} className="location-item">
                      <div className="location-name">
                        {ucaseFirst(
                          location.location_area.name.replace("-", " ")
                        )}
                      </div>
                      <div className="location-details">
                        {location.version_details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="version-detail">
                            <span className="version-name">
                              {ucaseFirst(detail.version.name)}
                            </span>
                            <span className="encounter-rate">
                              Max chance: {detail.max_chance}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {locationData.length > 10 && (
                    <div className="locations-more">
                      And {locationData.length - 10} more locations...
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-locations">
                  <p>
                    This Pokémon cannot be found in the wild or location data is
                    not available.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "forms":
        return (
          <div className="pokedex-content">
            <div className="info-section">
              <h3 className="section-title">Forms & Varieties</h3>
              {varietiesData.length > 1 ? (
                <div className="forms-container">
                  {varietiesData.map((variety, index) => (
                    <div key={variety.id} className="form-item">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${variety.id}.png`}
                        alt={variety.name}
                        className="form-sprite"
                      />
                      <div className="form-info">
                        <div className="form-name">
                          {ucaseFirst(variety.name)}
                        </div>
                        <div className="form-id">
                          #{String(variety.id).padStart(3, "0")}
                        </div>
                        <div className="form-types">
                          {variety.types.map((type) => (
                            <span
                              key={type.type.name}
                              className="form-type"
                              style={{
                                backgroundColor: getTypeColor(type.type.name),
                              }}
                            >
                              {ucaseFirst(type.type.name)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-forms">
                  <p>This Pokémon has no alternate forms or varieties.</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="popup-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="modern-pokedex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pokédex indicator lights */}
        <div className="indicator-lights">
          <div className="indicator-light red"></div>
          <div className="indicator-light yellow"></div>
          <div className="indicator-light green"></div>
        </div>

        {/* Header */}
        <div className="pokedex-header">
          <button onClick={onClose} className="close-button">
            ×
          </button>

          <div className="pokemon-showcase">
            <div className="pokemon-image-showcase">
              <motion.div
                animate={loading ? { rotate: 360, scale: 0.5 } : {}}
                transition={
                  loading
                    ? { duration: 1, repeat: Infinity, ease: "linear" }
                    : {}
                }
                className="image-frame"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${id}-${shinyMode}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: [0, 5, -5, 0],
                      filter: loading ? "blur(2px)" : "blur(0px)",
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                      rotate: { duration: 2, repeat: Infinity },
                    }}
                    src={shinyMode ? pokeman.shiny_image : image}
                    alt={name}
                    className="pokemon-main-image"
                  />
                </AnimatePresence>
              </motion.div>

              <div className="image-controls">
                <button
                  onClick={() => setShinyMode(!shinyMode)}
                  className={`shiny-toggle ${shinyMode ? "active" : ""}`}
                  disabled={loading}
                >
                  ✨ {shinyMode ? "Normal" : "Shiny"}
                </button>
              </div>
            </div>

            <div className="pokemon-basic-info">
              <div className="pokemon-name-section">
                <h1 className="pokemon-name">
                  {ucaseFirst(name)}
                  {speciesData?.is_legendary && (
                    <span className="legendary-badge">★ Legendary</span>
                  )}
                  {speciesData?.is_mythical && (
                    <span className="mythical-badge">✦ Mythical</span>
                  )}
                </h1>
                <div className="pokemon-id">#{String(id).padStart(3, "0")}</div>
              </div>

              <div className="pokemon-types">
                {type?.map((typeInfo) => (
                  <motion.span
                    key={typeInfo.type.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="type-badge"
                    style={{
                      backgroundColor: getTypeColor(typeInfo.type.name),
                    }}
                  >
                    {ucaseFirst(typeInfo.type.name)}
                  </motion.span>
                ))}
              </div>

              <div className="pokemon-flavor-text">
                <p>{getFlavorText()}</p>
              </div>

              <div className="pokemon-quick-stats">
                <div className="quick-stat">
                  <span className="stat-label">Height</span>
                  <span className="stat-value">{height / 10}m</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-label">Weight</span>
                  <span className="stat-value">{weight / 10}kg</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-label">BST</span>
                  <span className="stat-value">{baseStatTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="navigation-controls">
          <button
            onClick={prevPokemon}
            disabled={id <= 1 || loading}
            className="nav-button prev"
          >
            ← Previous
          </button>

          <div className="pokemon-counter">{id} / 1010</div>

          <button
            onClick={nextPokemon}
            disabled={id >= 1010 || loading}
            className="nav-button next"
          >
            Next →
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              disabled={loading}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="pokedex-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading Pokémon data...</p>
                </div>
              ) : (
                renderTabContent()
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer with Pokédex branding */}
        <div className="pokedex-footer">
          <div className="pokedex-brand">
            <span className="brand-text">PokéDex</span>
            <span className="brand-version">Version 2.0</span>
          </div>
          <div className="footer-controls">
            <div className="volume-control">
              <span className="volume-icon">🔊</span>
              <div className="volume-bars">
                <div className="volume-bar active"></div>
                <div className="volume-bar active"></div>
                <div className="volume-bar"></div>
                <div className="volume-bar"></div>
              </div>
            </div>
            <div className="battery-indicator">
              <span className="battery-icon">🔋</span>
              <span className="battery-level">85%</span>
            </div>
          </div>
        </div>

        {/* Pokédex Screen Effects */}
        <div className="screen-effects">
          <div className="scan-line"></div>
          <div className="screen-glare"></div>
        </div>

        {/* Side Panel Indicators */}
        <div className="side-panel left">
          <div className="panel-lights">
            <div className="panel-light blue active"></div>
            <div className="panel-light blue"></div>
            <div className="panel-light blue"></div>
          </div>
          <div className="panel-buttons">
            <button className="panel-btn small red"></button>
            <button className="panel-btn small yellow"></button>
          </div>
        </div>

        <div className="side-panel right">
          <div className="panel-screen">
            <div className="mini-stats">
              <div className="mini-stat">
                <span>HP</span>
                <div className="mini-bar">
                  <div
                    className="mini-fill"
                    style={{
                      width: `${getStatBarWidth(
                        stats.find((s) => s.name === "hp")?.value || 0
                      )}%`,
                      backgroundColor: getStatColor("hp"),
                    }}
                  ></div>
                </div>
              </div>
              <div className="mini-stat">
                <span>ATK</span>
                <div className="mini-bar">
                  <div
                    className="mini-fill"
                    style={{
                      width: `${getStatBarWidth(
                        stats.find((s) => s.name === "attack")?.value || 0
                      )}%`,
                      backgroundColor: getStatColor("attack"),
                    }}
                  ></div>
                </div>
              </div>
              <div className="mini-stat">
                <span>DEF</span>
                <div className="mini-bar">
                  <div
                    className="mini-fill"
                    style={{
                      width: `${getStatBarWidth(
                        stats.find((s) => s.name === "defense")?.value || 0
                      )}%`,
                      backgroundColor: getStatColor("defense"),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="panel-buttons">
            <button className="panel-btn round green"></button>
            <button className="panel-btn round blue"></button>
          </div>
        </div>

        {/* D-Pad and Action Buttons */}
        <div className="control-pad">
          <div className="d-pad">
            <button className="d-btn up">▲</button>
            <button className="d-btn down">▼</button>
            <button className="d-btn left">◀</button>
            <button className="d-btn right">▶</button>
            <button className="d-btn center">●</button>
          </div>
          <div className="action-buttons">
            <button className="action-btn a">A</button>
            <button className="action-btn b">B</button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-overlay"
          >
            <div className="loading-content">
              <div className="pokeball-loader">
                <div className="pokeball">
                  <div className="pokeball-top"></div>
                  <div className="pokeball-middle"></div>
                  <div className="pokeball-bottom"></div>
                  <div className="pokeball-center"></div>
                </div>
              </div>
              <p className="loading-text">Searching for Pokémon...</p>
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ModernPokedexPopup;
