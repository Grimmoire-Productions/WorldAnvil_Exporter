import React from 'react';
import type { MultiValue } from 'react-select';
import type { DropdownOption, World } from '../../../utils/types';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import styles from '../../../routes/worlds/$worldId/export.module.css';

interface ExportHeaderProps {
  selectedWorld: World | null;
  selectedTags: DropdownOption[];
  selectedRunTag: DropdownOption | null;
  articlesList: DropdownOption[];
  articleId: string;
  runDropdownOptions: (tags: string[] | undefined | null) => DropdownOption[];
  tagDropdownOptions: (tags: string[] | undefined | null) => DropdownOption[];
  onSelectedTagChange: (options: DropdownOption | MultiValue<DropdownOption>) => void;
  onSelectedRunTagChange: (options: DropdownOption | MultiValue<DropdownOption>) => void;
  onArticleChange: (options: DropdownOption | MultiValue<DropdownOption>) => void;
}

function ExportHeader({
  selectedWorld,
  selectedTags,
  selectedRunTag,
  articlesList,
  articleId,
  runDropdownOptions,
  tagDropdownOptions,
  onSelectedTagChange,
  onSelectedRunTagChange,
  onArticleChange,
}: ExportHeaderProps) {

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
        handleChange={onSelectedRunTagChange}
        currentSelection={selectedRunTag as DropdownOption}
      />
      <SearchDropdown
        id="select-tags"
        className="select-tags"
        placeholder="--Choose tags--"
        items={tagDropdownOptions(selectedWorld.tags)}
        isMultiSelect={true}
        error="No tags available for the selected world."
        handleChange={onSelectedTagChange}
        currentSelection={selectedTags as MultiValue<DropdownOption>}
      />
      <SearchDropdown
        id="select-article"
        className="select-article"
        placeholder="--Select a Character--"
        items={articlesList}
        isMultiSelect={false}
        error="Cannot find character sheets"
        handleChange={onArticleChange}
        currentSelection={articleId ? articlesList.find(item => item.id === articleId) : undefined}
      />
    </div>
  );
}

export default ExportHeader;