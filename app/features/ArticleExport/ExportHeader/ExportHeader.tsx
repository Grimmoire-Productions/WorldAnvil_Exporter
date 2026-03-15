import type { MultiValue } from "react-select";
import type { DropdownOption, World } from "~/utils/types";
import SearchDropdown from "~/components/SearchDropdown/SearchDropdown";
import styles from "./ExportHeader.module.css";
import { Link } from "react-router";
import { ArrowLeftIcon, DownloadSimpleIcon } from "@phosphor-icons/react";

interface ExportHeaderProps {
  selectedWorld: World | null;
  selectedTags: DropdownOption[];
  selectedRunTag: DropdownOption | null;
  articlesList: DropdownOption[];
  articleId?: string;
  worldId?: string;
  runDropdownOptions: (tags: string[] | undefined | null) => DropdownOption[];
  tagDropdownOptions: (tags: string[] | undefined | null) => DropdownOption[];
  onSelectedTagChange: (
    options: DropdownOption | MultiValue<DropdownOption> | null,
  ) => void;
  onSelectedRunTagChange: (
    options: DropdownOption | MultiValue<DropdownOption> | null,
  ) => void;
  onArticleChange: (
    options: DropdownOption | MultiValue<DropdownOption> | null,
  ) => void;
  isLoading?: boolean;
  showCharacterDropdown?: boolean;
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
  showCharacterDropdown = true,
}: ExportHeaderProps) {
  const handlePdfExport = async () => {
    if (!articleId || !worldId) {
      console.error("Missing article ID or world ID");
      return;
    }

    // Get the selected character title for the filename
    const selectedArticle = articlesList.find((item) => item.id === articleId);
    const filename = selectedArticle?.label
      ? `${selectedArticle.label.replace(/[^a-zA-Z0-9]/g, "")}.pdf`
      : "character_sheet.pdf";

    // Build the full URL to the current article page
    const articleUrl = `${window.location.origin}/worlds/${worldId}/export/${articleId}`;

    // Get the user token from localStorage to pass to Puppeteer
    const userTokenData = localStorage.getItem("WA_TOKEN");

    // Call the PDF generation API
    const apiUrl = `/pdf/generate?url=${encodeURIComponent(articleUrl)}&filename=${encodeURIComponent(filename)}${userTokenData ? `&token=${encodeURIComponent(userTokenData)}` : ""}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.statusText}`);
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("PDF downloaded successfully:", filename);
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (!selectedWorld) {
    return (
      <div className={styles.ExportHeader} id="exportHeader">
        <p>Please select a world from the dropdown above to begin</p>
      </div>
    );
  }

  const backPath =
    articleId && worldId
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
          aria-label={articleId ? "Back to export page" : "Back to world page"}
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
        isClearable={true}
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
      {showCharacterDropdown && (
        <>
          <SearchDropdown
            id="select-article"
            className="select-article"
            label="Character"
            placeholder="Select a Character"
            items={articlesList}
            isMultiSelect={false}
            isClearable={true}
            error="Cannot find character sheets"
            handleChange={onArticleChange}
            currentSelection={
              articleId
                ? articlesList.find((item) => item.id === articleId)
                : undefined
            }
            isDisabled={isLoading}
          />
          {articleId && (
            <button
              onClick={handlePdfExport}
              className={styles.pdfButton}
              aria-label="Export as PDF"
              disabled={isLoading}
            >
              <DownloadSimpleIcon className={styles.pdfIcon} weight="bold" />
              <span>Export PDF</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default ExportHeader;
