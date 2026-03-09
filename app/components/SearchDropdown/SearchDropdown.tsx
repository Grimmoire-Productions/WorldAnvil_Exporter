import Select from "react-select";
import type { MultiValue } from "react-select";
import type { DropdownOption } from "~/utils/types";
import styles from "./SearchDropdown.module.css";

type SearchDropdownProps = {
  id: string;
  className: string;
  label: string;
  ariaLabel?: string;
  placeholder: string;
  items: DropdownOption[];
  isMultiSelect: boolean;
  error: string;
  handleChange: (
    options: DropdownOption | MultiValue<DropdownOption> | null,
  ) => void;
  currentSelection?: DropdownOption | MultiValue<DropdownOption>;
  isDisabled?: boolean;
  isClearable?: boolean;
};

function SearchDropdown({
  id,
  className,
  label,
  ariaLabel,
  placeholder,
  items,
  isMultiSelect,
  error,
  handleChange,
  currentSelection,
  isDisabled = false,
  isClearable = false,
}: SearchDropdownProps) {
  const handleSelectionChange = (
    options: DropdownOption | MultiValue<DropdownOption> | null,
  ) => {
    // Always call handleChange, even for null (when clearing)
    handleChange(options);
  };

  const customClassNames = {
    // Top-level container
    container: () => styles.container,

    // The control (input area)
    control: (state: { isFocused: boolean }) =>
      `${styles.control} ${state.isFocused ? styles["control--is-focused"] : ""}`,

    // The dropdown menu
    menu: () => styles.menu,

    // Individual options in the dropdown
    option: (state: { isFocused: boolean; isSelected: boolean }) =>
      `${styles.option} ${state.isFocused ? styles["option--is-focused"] : ""} ${state.isSelected ? styles["option--is-selected"] : ""}`,

    // Container for selected values in multi-select
    valueContainer: () => styles.valueContainer,

    // Individual selected value (tag) in multi-select
    multiValue: () => styles.multiValue,
    multiValueLabel: () => styles.multiValueLabel,
    multiValueRemove: () => styles.multiValueRemove,

    input: () => styles.input,
  };

  return (
    <div data-testid={id}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      {isMultiSelect ? (
        <Select<DropdownOption, true>
          inputId={id}
          className={className}
          classNames={customClassNames}
          placeholder={placeholder}
          value={currentSelection}
          onChange={handleSelectionChange}
          options={items}
          isSearchable={true}
          isMulti
          isClearable={isClearable}
          noOptionsMessage={() => error}
          aria-label={ariaLabel || label}
          isDisabled={isDisabled}
        />
      ) : (
        <Select<DropdownOption>
          inputId={id}
          className={className}
          classNames={customClassNames}
          placeholder={placeholder}
          value={currentSelection}
          onChange={handleSelectionChange}
          options={items}
          isSearchable={true}
          isClearable={isClearable}
          noOptionsMessage={() => error}
          aria-label={ariaLabel || label}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
}

export default SearchDropdown;
