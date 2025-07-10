import React, { useState, useEffect } from 'react';
import type { ArticleResponse, World } from '../../utils/types';

// Define the props for the TagsDropdown component
interface ArticleSelectorProps {
  selectedWorld: World | null;
  onArticleChange?: (article: string) => void; // Optional callback for when a tag is selected
  initialArticle?: string; // Optional initial selected tag
}

const ArticleSelector: React.FC<ArticleSelectorProps> = ({ selectedWorld, onArticleChange, initialArticle }) => {
  // State to hold the currently selected tag in the dropdown
  const [currentSelectedTag, setCurrentSelectedTag] = useState<string>(initialArticle || '');

  // useEffect hook to reset the selected tag when selectedWorld changes
  useEffect(() => {
    if (selectedWorld?.tags && selectedWorld.tags.length > 0) {
      // If an initialArticle is provided and exists in the new world's tags, use it.
      // Otherwise, default to the first tag or an empty string.
      const defaultArticle = initialArticle && selectedWorld.tags.includes(initialArticle)
        ? initialArticle
        : selectedWorld.tags[0] || '';
      setCurrentSelectedTag(defaultArticle);
      // Optionally, call onArticleChange with the new default tag
      if (onArticleChange) {
        onArticleChange(defaultArticle);
      }
    } else {
      // If no world or no tags, clear the selection
      setCurrentSelectedTag('');
      if (onArticleChange) {
        onArticleChange('');
      }
    }
  }, [selectedWorld, initialArticle, onArticleChange]); // Re-run when selectedWorld, initialArticle, or onArticleChange changes

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newArticle = event.target.value;
    setCurrentSelectedTag(newArticle);
    // Call the optional onArticleChange callback if provided
    if (onArticleChange) {
      onArticleChange(newArticle);
    }
  };

  // If there's no selected world or no tags in the selected world, render nothing or a disabled message
  if (!selectedWorld || !selectedWorld.tags || selectedWorld.tags.length === 0) {
    return (
      <div>
        No tags available for the selected world.
      </div>
    );
  }

    const tagsDropDown = selectedWorld.tags?.map((tag: string, i: number) => {
      return <option value={tag} id={tag} key={'tag' + i}>{tag}</option>
    })

    tagsDropDown.unshift(<option key='default' value="">--Choose a tag--</option>)

  return (
      <select
        value={currentSelectedTag}
        onChange={handleTagChange}
      >
        {tagsDropDown}
      </select>
  );
};

export default ArticleSelector;
