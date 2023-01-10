import React, { useState } from "react"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { CDN_URL } from "../../../../../types"
import { ICreditName } from "../../../../../types"
import {
  AbilityName,
  AbilityDescription
} from "../../../../../types/strings/Ability"
import { ITracker } from "../../../../../types/ITracker"
import Credits from "./Credits"
import { RarityColor } from "../../../../../types/Config"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"

export default function WikiPokemonDetail(props: {
  pokemon: Pkm
  m: ITracker | undefined
}) {
  const pokemon = PokemonFactory.createPokemonFromName(props.pokemon)
  const [credits, setCredits] = useState<ICreditName[]>()
  const [initialized, setInitialized] = useState<boolean>(false)
  if (!initialized) {
    setInitialized(true)
    fetch(`${CDN_URL}/credit_names.txt`)
      .then(res => res.text())
      .then(text => text.split('\n'))
      .then((lines: string[]) => lines.slice(1).map(line => {
        const [Name, Discord, Contact] = line.split('\t')
        const credit: ICreditName = { Name, Discord, Contact }
        return credit
      }))
      .then((credits: ICreditName[]) => setCredits(credits))
  }

  if (props.m) {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ width: "30%" }}>
          <p>name:{pokemon.name}</p>
          <p>Portrait Credit:</p>
          <Credits
            credits={credits}
            primary={props.m.sprite_credit.primary}
            secondary={props.m.sprite_credit.secondary}
          />
          <p>Sprite Credit:</p>
          <Credits
            credits={credits}
            primary={props.m.portrait_credit.primary}
            secondary={props.m.portrait_credit.secondary}
          />
          <p style={{ color: RarityColor[pokemon.rarity] }}>
            rarity:{pokemon.rarity}
          </p>
          <div>
            types:
            {pokemon.types.map((type) => {
              return (
                <img key={"img" + type} src={"assets/types/" + type + ".png"} />
              )
            })}
          </div>
          <div>
            evolution:{" "}
            {pokemon.evolution == Pkm.DEFAULT ? (
              "No evolution"
            ) : (
              <img
                src={getPortraitSrc(
                  PokemonFactory.createPokemonFromName(pokemon.evolution as Pkm)
                    .index
                )}
              />
            )}
          </div>
        </div>
        <div style={{ width: "30%" }}>
          <p>Health: {pokemon.hp}</p>
          <p>Attack: {pokemon.atk}</p>
          <p>Defense: {pokemon.def}</p>
          <p>Special Defense: {pokemon.speDef}</p>
          <p>Range: {pokemon.range}</p>
          <p>Mana: {pokemon.maxMana}</p>
        </div>
        <div style={{ width: "30%" }}>
          <p>Ability: {AbilityName[pokemon.skill].eng}</p>
          <p>Description:{AbilityDescription[pokemon.skill].eng}</p>
        </div>
      </div>
    )
  } else {
    return null
  }
}
