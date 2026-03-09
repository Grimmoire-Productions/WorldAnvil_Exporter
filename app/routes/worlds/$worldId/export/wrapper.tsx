import React, { useMemo, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import type { MultiValue } from "react-select";
import ExportHeader from "~/features/ArticleExport/ExportHeader/ExportHeader";
import { WorldContext } from "~/context/WorldContext/WorldContext";
import type { WorldContextType, DropdownOption } from "~/utils/types";

export default function ExportWrapper() {
  const { worldId, articleId } = useParams<{
    worldId?: string;
    articleId?: string;
  }>();
  const navigate = useNavigate();

  const { selectedWorld, worldIsLoading } = React.useContext(
    WorldContext,
  ) as WorldContextType;

  // Local state for tag filtering (scoped to export context only)
  // Automatically resets when component unmounts - no cleanup Effect needed!
  const [selectedTags, setSelectedTags] = useState<DropdownOption[]>([]);
  const [selectedRunTag, setSelectedRunTag] = useState<DropdownOption | null>(
    null,
  );

  const handleSelectedTagChange = (
    options: DropdownOption | MultiValue<DropdownOption> | null,
  ) => {
    setSelectedTags((options as DropdownOption[]) || []);
  };

  const handleSelectedRunTagChange = (
    options: DropdownOption | MultiValue<DropdownOption> | null,
  ) => {
    setSelectedRunTag((options as DropdownOption) || null);
  };

  const handleArticleChange = (
    options: DropdownOption | MultiValue<DropdownOption> | null,
  ) => {
    const selectedOption = options as DropdownOption;

    // If cleared, navigate back to export page without article
    if (!selectedOption && worldId) {
      navigate(`/worlds/${worldId}/export`);
      return;
    }

    // Navigate to character sheet route (URL is source of truth)
    if (worldId && selectedOption?.id) {
      navigate(`/worlds/${worldId}/export/${selectedOption.id}`);
    }
  };

  const runDropdownOptions = (
    tags: string[] | undefined | null,
  ): DropdownOption[] => {
    const options: DropdownOption[] = [];

    if (tags) {
      tags
        .filter((tag) => tag.toLowerCase().includes("run"))
        .forEach((tag: string) => {
          options.push({
            value: tag,
            id: tag,
            label: tag,
          });
        });
    }
    return options;
  };

  const tagDropdownOptions = (
    tags: string[] | undefined | null,
  ): DropdownOption[] => {
    const options: DropdownOption[] = [];

    if (tags) {
      tags
        .filter(
          (tag) =>
            !tag.toLowerCase().includes("run") &&
            !tag.toLowerCase().includes("character_sheet"),
        )
        .forEach((tag: string) => {
          options.push({
            value: tag,
            id: tag,
            label: tag,
          });
        });
    }
    return options;
  };

  // Compute filtered articles list based on selected tags
  const articlesList = useMemo(() => {
    const options: DropdownOption[] = [];
    const characterSheets = selectedWorld?.characterSheets;

    if (characterSheets) {
      characterSheets
        .filter((character) => {
          let matchesTags = true;
          let matchesRunTag = true;

          // Check if character matches all selected tags
          if (selectedTags && selectedTags.length > 0) {
            const tagsArray = selectedTags.map((tag) => tag.value);
            matchesTags = tagsArray.every((tag) =>
              character.tags.includes(tag),
            );
          }

          // Check if character matches the selected run tag
          if (selectedRunTag) {
            matchesRunTag = character.tags.includes(selectedRunTag.value);
          }

          return matchesTags && matchesRunTag;
        })
        .forEach((character) => {
          options.push({
            value: character.title,
            id: character.articleId,
            label: character.title,
          });
        });
    }

    return options;
  }, [selectedWorld?.characterSheets, selectedTags, selectedRunTag]);

  return (
    <>
      <ExportHeader
        selectedWorld={selectedWorld}
        selectedTags={selectedTags || []}
        selectedRunTag={selectedRunTag}
        articlesList={articlesList}
        articleId={articleId}
        worldId={worldId}
        runDropdownOptions={runDropdownOptions}
        tagDropdownOptions={tagDropdownOptions}
        onSelectedTagChange={handleSelectedTagChange}
        onSelectedRunTagChange={handleSelectedRunTagChange}
        onArticleChange={handleArticleChange}
        isLoading={worldIsLoading}
        showCharacterDropdown={true}
      />
      <Outlet />
    </>
  );
}
