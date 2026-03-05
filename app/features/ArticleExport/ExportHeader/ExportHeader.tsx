import type { MultiValue } from 'react-select';
import type { DropdownOption, World } from '~/utils/types';
import SearchDropdown from '~/components/SearchDropdown/SearchDropdown';
import styles from './ExportHeader.module.css';
import { Link } from 'react-router';
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

interface ExportHeaderProps {
  selectedWorld: World | null;
  selectedTags: DropdownOption[];
  selectedRunTag: DropdownOption | null;
  articlesList: DropdownOption[];
  articleId?: string;
  worldId?: string;
  runDropdownOptions: (tags: string[] | undefined | null) => DropdownOption[];
  tagDropdownOptions: (tags: string[] | undefined | null) => DropdownOption[];
  onSelectedTagChange: (options: DropdownOption | MultiValue<DropdownOption>) => void;
  onSelectedRunTagChange: (options: DropdownOption | MultiValue<DropdownOption>) => void;
  onArticleChange: (options: DropdownOption | MultiValue<DropdownOption>) => void;
  isLoading?: boolean;
}

function ExportHeader({
  selectedWorld,
  selectedTags,
  selectedRunTag,
  articlesList,
  articleId,
  worldId,
  runDropdownOptions,
  tagDropdownOptions,
  onSelectedTagChange,
  onSelectedRunTagChange,
  onArticleChange,
  isLoading = false,
}: ExportHeaderProps) {

  if (!selectedWorld) {
    return (
      <div className={styles.ExportHeader} id="exportHeader">
        <p>Please select a world from the dropdown above to begin</p>
      </div>
    );
  }

  const backPath = articleId && worldId
    ? `/worlds/${worldId}/export`
    : worldId
    ? `/worlds/${worldId}`
    : undefined;

  return (
    <div className={styles.ExportHeader} id="exportHeader">
        {backPath && (
          <Link
            to={backPath}
            className={styles.backButton}
            aria-label={
              articleId ? "Back to export page" : "Back to world page"
            }
          >
            <ArrowLeftIcon className={styles.backIcon} weight="bold" />
            <span>{articleId ? "Export" : "World"}</span>
          </Link>
        )}
      <SearchDropdown
        id="select-run-tag"
        className="select-run-tag"
        label="Run"
        placeholder="Choose a run"
        items={runDropdownOptions(selectedWorld.tags)}
        isMultiSelect={false}
        error="No run tags available for the selected world."
        handleChange={onSelectedRunTagChange}
        currentSelection={selectedRunTag as DropdownOption}
        isDisabled={isLoading}
      />
      <SearchDropdown
        id="select-tags"
        className="select-tags"
        label="Tags"
        placeholder="Choose tags"
        items={tagDropdownOptions(selectedWorld.tags)}
        isMultiSelect={true}
        error="No tags available for the selected world."
        handleChange={onSelectedTagChange}
        currentSelection={selectedTags as MultiValue<DropdownOption>}
        isDisabled={isLoading}
      />
      <SearchDropdown
        id="select-article"
        className="select-article"
        label="Character"
        placeholder="Select a Character"
        items={articlesList}
        isMultiSelect={false}
        error="Cannot find character sheets"
        handleChange={onArticleChange}
        currentSelection={
          articleId
            ? articlesList.find((item) => item.id === articleId)
            : undefined
        }
        isDisabled={isLoading}
      />
    </div>
  );
}

export default ExportHeader;