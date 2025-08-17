import React, { useEffect, useState } from 'react';
import type { MultiValue } from 'react-select';
import type { ArticleContextType, DropdownOption, WorldContextType, CharacterSheet } from '../../../utils/types';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import { ArticleContext } from '../../../context/ArticleContext';
import { WorldContext } from '../../../context/WorldContext';
import styles from '../ExportToolContainer.module.css';

function ExportHeader() {
  const {
    articleId,
    setArticleId,
    fetchAndProcessCharacter,
    setActiveCharacter
  } = React.useContext(ArticleContext) as ArticleContextType;

  const {
    selectedWorld,
    selectedTags,
    setSelectedTags,
    selectedRunTag,
    setSelectedRunTag,
  } = React.useContext(WorldContext) as WorldContextType;

  const [articlesList, setArticlesList] = useState<DropdownOption[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<DropdownOption | null>(null);

  useEffect(() => {
    if (selectedWorld) {
      setArticleDropdownOptions(selectedWorld.characterSheets);
      setCurrentCharacter(null);
      setArticleId('');
      setActiveCharacter('');
      setSelectedTags([]);
      setSelectedRunTag(null);
    }
  }, [selectedWorld]);

  useEffect(() => {
    if (selectedWorld) {
      setArticleDropdownOptions(selectedWorld.characterSheets);

      // Check if the current character is still available in the updated articlesList
      if (currentCharacter) {
        const isCurrentCharacterValid = articlesList.some(
          (article) => article.id === currentCharacter.id,
        );

        if (!isCurrentCharacterValid) {
          setCurrentCharacter(null);
          setArticleId("");
          setActiveCharacter("");
        }
      }
    }
  }, [selectedTags, selectedRunTag, selectedWorld, currentCharacter]);

  useEffect(() => {
    if (articleId && selectedWorld) {
      const selectedWorldKey = selectedWorld?.cssClassName || "default";
      fetchAndProcessCharacter(articleId, selectedWorldKey);
    }
  }, [articleId]);

  const handleSelectedTagChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    setSelectedTags(options as DropdownOption[]);
  };

  const handleSelectedRunTagChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    setSelectedRunTag(options as DropdownOption);
  };

  const handleArticleChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    const selectedOption = options as DropdownOption;
    setCurrentCharacter(selectedOption);
    setArticleId(selectedOption.id);
  };

  const runDropdownOptions = (tags: string[] | undefined | null): DropdownOption[] => {
    const options: DropdownOption[] = [];

    if (tags) {
      tags.filter(tag => tag.toLowerCase().includes('run')).forEach((tag: string) => {
        options.push({
          value: tag,
          id: tag,
          label: tag
        });
      });
    }
    return options;
  };

  const tagDropdownOptions = (tags: string[] | undefined | null): DropdownOption[] => {
    const options: DropdownOption[] = [];

    if (tags) {
      tags.filter(tag => !tag.toLowerCase().includes('run') && !tag.toLowerCase().includes('character_sheet')).forEach((tag: string) => {
        options.push({
          value: tag,
          id: tag,
          label: tag
        });
      });
    }
    return options;
  };

  const setArticleDropdownOptions = (characterSheets: CharacterSheet[] | undefined | null) => {
    const options: DropdownOption[] = [];

    if (characterSheets) {
      characterSheets.filter((character) => {
        let matchesTags = true;
        let matchesRunTag = true;

        // Check if character matches all selected tags
        if (selectedTags && selectedTags.length > 0) {
          const tagsArray = selectedTags.map((tag) => tag.value);
          matchesTags = tagsArray.every((tag) => character.tags.includes(tag));
        }

        // Check if character matches the selected run tag
        if (selectedRunTag) {
          matchesRunTag = character.tags.includes(selectedRunTag.value);
        }

        return matchesTags && matchesRunTag;
      }).forEach(character => {
        options.push({
          value: character.title,
          id: character.articleId,
          label: character.title,
        });
      });
    }
    setArticlesList(options);
  };

  if (!selectedWorld) {
    return (
      <div className={styles.ExportHeader} id="exportHeader">
        <p>Please select a world from the dropdown above to begin</p>
      </div>
    );
  }

  return (
    <div className={styles.ExportHeader} id="exportHeader">
      <SearchDropdown
        id="select-run-tag"
        className="select-run-tag"
        placeholder="--Choose a run--"
        items={runDropdownOptions(selectedWorld.tags)}
        isMultiSelect={false}
        error="No run tags available for the selected world."
        handleChange={handleSelectedRunTagChange}
        currentSelection={selectedRunTag as DropdownOption}
      />
      <SearchDropdown
        id="select-tags"
        className="select-tags"
        placeholder="--Choose tags--"
        items={tagDropdownOptions(selectedWorld.tags)}
        isMultiSelect={true}
        error="No tags available for the selected world."
        handleChange={handleSelectedTagChange}
        currentSelection={selectedTags as MultiValue<DropdownOption>}
      />
      <SearchDropdown
        id="select-article"
        className="select-article"
        placeholder="--Select a Character--"
        items={articlesList}
        isMultiSelect={false}
        error="Cannot find character sheets"
        handleChange={handleArticleChange}
        currentSelection={currentCharacter as DropdownOption}
      />
    </div>
  );
}

export default ExportHeader;