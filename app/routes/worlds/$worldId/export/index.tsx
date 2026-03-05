import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { MultiValue } from 'react-select';
import ExportHeader from '../../../../containers/ExportToolContainer/ExportHeader/ExportHeader';
import { ArticleContext } from '../../../../context/ArticleContext';
import { WorldContext } from '../../../../context/WorldContext';
import type { ArticleContextType, WorldContextType, DropdownOption, CharacterSheet } from '../../../../utils/types';
import styles from './index.module.css';

export default function ExportPage() {
  const { worldId } = useParams<{ worldId?: string }>();
  const navigate = useNavigate();
  
  const {
    articleId,
    setArticleId,
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

  useEffect(() => {
    if (worldId && !selectedWorld) {
      // worldId will be handled by MainHeader which reads from params
    }
  }, [worldId, selectedWorld]);

  useEffect(() => {
    if (selectedWorld?.id && selectedWorld.id !== worldId) {
      navigate(`/worlds/${selectedWorld.id}/export`, { replace: true });
    }
  }, [selectedWorld, worldId, navigate]);

  useEffect(() => {
    if (selectedWorld) {
      setArticleDropdownOptions(selectedWorld.characterSheets);
      // Only reset form state when world changes, not on every dependency update
      if (selectedWorld.id !== worldId) {
        setArticleId('');
        setActiveCharacter('');
        setSelectedTags([]);
        setSelectedRunTag(null);
      }
    }
  }, [selectedWorld, setArticleId, setActiveCharacter, setSelectedTags, setSelectedRunTag, worldId]);

  useEffect(() => {
    // Update dropdown options when filters change
    if (selectedWorld) {
      setArticleDropdownOptions(selectedWorld.characterSheets);
    }
  }, [selectedTags, selectedRunTag, selectedWorld]);

  const handleSelectedTagChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    setSelectedTags(options as DropdownOption[]);
  };

  const handleSelectedRunTagChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    setSelectedRunTag(options as DropdownOption);
  };

  const handleArticleChange = (options: DropdownOption | MultiValue<DropdownOption>) => {
    const selectedOption = options as DropdownOption;
    setArticleId(selectedOption.id);

    // Navigate to character sheet route
    if (worldId && selectedOption.id) {
      navigate(`/worlds/${worldId}/export/${selectedOption.id}`);
    }
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

  return (
    <div className={styles.Exporter}>
      <div>
        <ExportHeader 
          selectedWorld={selectedWorld}
          selectedTags={selectedTags || []}
          selectedRunTag={selectedRunTag}
          articlesList={articlesList}
          articleId={articleId}
          runDropdownOptions={runDropdownOptions}
          tagDropdownOptions={tagDropdownOptions}
          onSelectedTagChange={handleSelectedTagChange}
          onSelectedRunTagChange={handleSelectedRunTagChange}
          onArticleChange={handleArticleChange}
        />
      </div>
      <div className={styles.exportInstructions}>
        <h2>Character Export Tool</h2>
        <p>Select a character from the dropdowns above to view and export their character sheet.</p>
      </div>
    </div>
  );
}