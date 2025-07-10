import React, { useRef, useEffect } from 'react';
import type { MultiValue } from 'react-select';

import type { ArticleContextType, DropdownOption, UserContextType, World, WorldContextType } from '../../../utils/types';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import Dropdown from '../../../components/Dropdown/Dropdown';

import { ArticleContext } from '../../../context/ArticleContext';
import { UserContext } from '../../../context/UserContext';
import { WorldContext } from '../../../context/WorldContext';

import styles from '../ExportToolContainer.module.css';
import worldAnvilAPI from '../../../utils/worldAnvilAPI';


function ExportHeader() {

  const {
    articleId,
    setArticleId,
    fetchAndProcessCharacter,
  } = React.useContext(ArticleContext) as ArticleContextType;

  const {
    worldIsLoading,
    setWorldIsLoading,
    selectedWorld,
    setSelectedWorld
  } = React.useContext(WorldContext) as WorldContextType

  const {
    accessToken,
    user,
    setUser
  } = React.useContext(UserContext) as UserContextType;

  const {
    setSelectedTags
  } = React.useContext(WorldContext) as WorldContextType

  const refArticleId = useRef(null);

  useEffect(() => {
    if (selectedWorld?.id && user?.worlds) {
      let updatedWorlds = user.worlds;
      let selectedWorldIndex = updatedWorlds.findIndex(world => world.id === selectedWorld.id)
      updatedWorlds[selectedWorldIndex] = selectedWorld;
      setUser(prevUser => {
        if (prevUser === null) {
          return null;
        }
        return {
          ...prevUser,
          worlds: updatedWorlds
        }
      })
    };
    setSelectedTags([])
  }, [selectedWorld])

  const handleSelectedTagChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    setSelectedTags(options as DropdownOption[])
  };

  const handleSelectedWorldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.selectedOptions[0]
    if (user && user.worlds) {
      const worldIndex = user.worlds.findIndex(world => world.id === selectedOption.id)

      if (worldIndex >= 0) {
        const world = user.worlds[worldIndex]

        if (!world.characterSheets || !world.tags) {
          setWorldIsLoading(true);

          worldAnvilAPI.getCharacterSheets(accessToken, world.id).then((results) => {
            if (results.length > 0) {
              world.characterSheets = results;

              // get set of unique tags
              const tagSet = new Set(results.map((sheet) => sheet.tags).flat())

              world.tags = [...tagSet]
            }
            setSelectedWorld(world);
            setWorldIsLoading(false);
          })
        } else {
          setSelectedWorld(world);
        }
      }
    }
  };

  const handleArticleIdChange = (e: React.FormEvent<HTMLInputElement>) =>
    setArticleId(e.currentTarget.value);

  const onSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (articleId === '') {
      return;
    }

    const selectedWorldKey = selectedWorld?.cssClassName || 'default'

    fetchAndProcessCharacter(accessToken, articleId, selectedWorldKey)
  };

  const worldDropdownOptions = (worlds: World[]): DropdownOption[] => {

    const options = [{
      value: "",
      id: 'default',
      label: "--Choose a world--"
    }]
    worlds.forEach((world: World) => {
      options.push({
        value: world.title,
        id: world.id,
        label: world.title
      })
    })
    return options;
  }

  const tagDropdownOptions = (tags: string[] | undefined | null): DropdownOption[] => {
    const options: DropdownOption[] = [];

    if (tags) {
      tags.forEach((tag: string) => {
        options.push({
          value: tag,
          id: tag,
          label: tag
        })
      })
    }
    return options;
  }

  return (
    <div className={styles.ExportHeader} id='exportHeader'>
      <div className={'worldDropdown'}>
        {user?.worlds && <Dropdown id="world" items={worldDropdownOptions(user.worlds)} onChange={handleSelectedWorldChange} error="No words available" />}
      </div>
      {worldIsLoading ? (<div className={styles.Loading}>Tags Loading</div>) : selectedWorld && <SearchDropdown id="tags" placeholder="--Choose a tag--" items={tagDropdownOptions(selectedWorld.tags)} isMultiSelect={true} error="No tags available for the selected world." handleChange={handleSelectedTagChange} />}
      {worldIsLoading ? (<div className={styles.Loading}>Articles Loading</div>) : (<div id='userInput'>
        <label>Article ID: <input type='text' id='articleId' data-testid="articleId" name='Article ID' ref={refArticleId} value={articleId} onChange={handleArticleIdChange} placeholder="enter an article Id" /></label>
        <button
          className={'submit'}
          onClick={onSubmit}
          data-testid="set-article-id-button"
        >
          <span>Submit</span>
        </button>
      </div>)}

      <div className={'username'}>
        <p>Logged in as {user?.displayName}</p>
      </div>
    </div>
  )
};

export default ExportHeader;