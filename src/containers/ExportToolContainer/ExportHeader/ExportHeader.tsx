import React, { useRef, useEffect, useState } from 'react';
import type { MultiValue } from 'react-select';

import type { ArticleContextType, DropdownOption, UserContextType, World, WorldContextType, CharacterSheet } from '../../../utils/types';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

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
    setActiveCharacter
  } = React.useContext(ArticleContext) as ArticleContextType;

  const {
    worldIsLoading,
    setWorldIsLoading,
    selectedWorld,
    setSelectedWorld,
    selectedTags,
    setSelectedTags,
  } = React.useContext(WorldContext) as WorldContextType;

  const {
    accessToken,
    user,
    setUser
  } = React.useContext(UserContext) as UserContextType;

  const [articlesList, setArticlesList] = useState<DropdownOption[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<DropdownOption | null>(null);

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
      setArticleDropdownOptions(selectedWorld.characterSheets);
    };
    setCurrentCharacter(null);
    setArticleId('')
    setActiveCharacter('')
    setSelectedTags([])
    
  }, [selectedWorld])

  useEffect(() => {
    if (selectedWorld) {
      setArticleDropdownOptions(selectedWorld.characterSheets);
    }
  }, [selectedTags])

  useEffect(() => {
    if (articleId && selectedWorld) {
      const selectedWorldKey = selectedWorld?.cssClassName || "default";
      fetchAndProcessCharacter(accessToken, articleId, selectedWorldKey);
    }
  }, [articleId])
  const handleSelectedTagChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    setSelectedTags(options as DropdownOption[])
  };

  const handleSelectedWorldChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    const selectedOption = options as DropdownOption;

    // Only proceed if a different world is selected
    if (selectedWorld?.id === selectedOption.id) {
      return; // Do nothing if the same world is selected
    }

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
  }

  const handleArticleIdChange = (e: React.FormEvent<HTMLInputElement>) =>
    setArticleId(e.currentTarget.value);

  const handleArticleChangeV2 = (options: DropdownOption | MultiValue<DropdownOption>) => {
    const selectedOption = options as DropdownOption;
    setCurrentCharacter(selectedOption)
    setArticleId(selectedOption.id)
  }

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

    const options: DropdownOption[] = [];
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

  const setArticleDropdownOptions = (characterSheets: CharacterSheet[] | undefined | null) => {
    const options: DropdownOption[] = [];

    if (characterSheets) {
      characterSheets.filter((character) => {
        if (selectedTags && selectedTags.length > 0) {
          const tagsArray = selectedTags.map((tag) => tag.value);
          return tagsArray.every((tag) => character.tags.includes(tag));
        }
        return true
      }).forEach(character => {
        options.push({
          value: character.title,
          id: character.articleId,
          label: character.title,
        });
      })
    }
    setArticlesList(options);
  }

  return (
    <div className={styles.ExportHeader} id="exportHeader">
      {user?.worlds && (
        <SearchDropdown
          id="select-world"
          className="select-world"
          placeholder="--Choose a World--"
          items={worldDropdownOptions(user.worlds)}
          isMultiSelect={false}
          error="No words available"
          handleChange={handleSelectedWorldChange}
        />
      )}

      {worldIsLoading ? (
        <div className={styles.Loading}>Tags Loading</div>
      ) : (
        selectedWorld && (
          <SearchDropdown
            id="select-tags"
            className="select-tags"
            placeholder="--Choose a tag--"
            items={tagDropdownOptions(selectedWorld.tags)}
            isMultiSelect={true}
            error="No tags available for the selected world."
            handleChange={handleSelectedTagChange}
            currentSelection={selectedTags as MultiValue<DropdownOption>}
          />
        )
      )}
      {worldIsLoading ? (
        <div className={styles.Loading}>Articles Loading</div>
      ) : (
        selectedWorld && (
          <SearchDropdown
            id="select-article"
            className="select-article"
            placeholder="--Select a Character--"
            items={articlesList}
            isMultiSelect={false}
            error="Cannot find character sheets"
            handleChange={handleArticleChangeV2}
            currentSelection={currentCharacter as DropdownOption}
          />
        )
      )}
      {/* {worldIsLoading ? (
        <div className={styles.Loading}>Articles Loading</div>
      ) : (
        <div id="userInput">
          <label>
            Article ID:{" "}
            <input
              type="text"
              id="articleId"
              data-testid="articleId"
              name="Article ID"
              ref={refArticleId}
              value={articleId}
              onChange={handleArticleIdChange}
              placeholder="enter an article Id"
            />
          </label>
          <button
            className={"submit"}
            onClick={onSubmit}
            data-testid="set-article-id-button"
          >
            <span>Submit</span>
          </button>
        </div>
      )} */}

      <div className={"username"}>
        <p>Logged in as {user?.displayName}</p>
      </div>
    </div>
  );
};

export default ExportHeader;