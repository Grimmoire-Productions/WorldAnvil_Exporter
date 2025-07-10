import Select from "react-select";
import type { MultiValue } from "react-select";
import type { DropdownOption } from "../../utils/types";

type SearchDropdownProps = {
  id: string;
  placeholder: string;
  items: DropdownOption[];
  isMultiSelect: boolean;
  error: string;
  handleChange: (options: DropdownOption | MultiValue<DropdownOption>) => void;
  currentSelection?: DropdownOption | MultiValue<DropdownOption>;
};

function SearchDropdown({
  id,
  placeholder,
  items,
  isMultiSelect,
  error,
  handleChange,
  currentSelection,
}: SearchDropdownProps) {
  const handleSelectionChange = (
    options: DropdownOption | MultiValue<DropdownOption> | null,
  ) => {
    if (options) {
      handleChange(options);
    }
  };

  return (
    <>
      {isMultiSelect ? (
        <Select<DropdownOption, true>
          id={id}
          placeholder={placeholder}
          value={currentSelection}
          onChange={handleSelectionChange}
          options={items}
          isSearchable={true}
          isMulti
          noOptionsMessage={() => error}
        />
      ) : (
        <Select<DropdownOption>
          id={id}
          placeholder={placeholder}
          value={currentSelection}
          onChange={handleSelectionChange}
          options={items}
          isSearchable={true}
          noOptionsMessage={() => error}
        />
      )}
    </>
  );
}

export default SearchDropdown;
