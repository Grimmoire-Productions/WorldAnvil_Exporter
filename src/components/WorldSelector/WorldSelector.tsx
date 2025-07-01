import React from 'react';
import type { World, WorldContextType } from '../../utils/types';
import { WorldContext } from '../../context/WorldContext';

type WorldSelectorProps = {
  worlds: World[]
}
function WorldSelector({worlds}: WorldSelectorProps) {

  const { setSelectedWorld } = React.useContext(WorldContext) as WorldContextType;

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cssClassName = event.target.value.replaceAll(/\s/g, "").replace('&','And')
    setSelectedWorld({ title: event.target.value, id: event.target.id, cssClassName: cssClassName });
  };

  const worldDropDown = worlds?.map((world: World, i: number) => {
    return <option value={world.title} id={world.id} key={'world' + i}>{world.title}</option>
  })

  worldDropDown.unshift(<option key='default' value="">--Choose a world--</option>)

  return (
    <select onChange={handleSelectChange}>
      {worldDropDown}
    </select>
  );
}

export default WorldSelector;