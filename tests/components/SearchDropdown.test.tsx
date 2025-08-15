import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchDropdown from "../../src/components/SearchDropdown/SearchDropdown";
import type { DropdownOption } from "../../src/utils/types";

// Mock the CSS module
jest.mock("./SearchDropdown.module.css", () => ({
  container: "container",
  control: "control",
  "control--is-focused": "control--is-focused",
  menu: "menu",
  option: "option",
  "option--is-focused": "option--is-focused",
  "option--is-selected": "option--is-selected",
  valueContainer: "valueContainer",
  multiValue: "multiValue",
  multiValueLabel: "multiValueLabel",
  multiValueRemove: "multiValueRemove",
  input: "input",
}));

describe("SearchDropdown", () => {
  const mockItems: DropdownOption[] = [
    { id: "option1", value: "Option 1", label: "Option 1" },
    { id: "option2", value: "Option 2", label: "Option 2" },
    { id: "option3", value: "Option 3", label: "Option 3" },
  ];

  const defaultProps = {
    id: "test-dropdown",
    className: "test-class",
    placeholder: "Select an option",
    items: mockItems,
    isMultiSelect: false,
    error: "No options found",
    handleChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Single Select Mode", () => {
    it("renders single select dropdown with correct props", () => {
      render(<SearchDropdown {...defaultProps} />);

      const dropdown = screen.getByTestId("test-dropdown");

      expect(dropdown).toBeInTheDocument();
      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("calls handleChange when an option is selected", async () => {
      const user = userEvent.setup();
      const mockHandleChange = jest.fn();

      render(
        <SearchDropdown {...defaultProps} handleChange={mockHandleChange} />,
      );

      
      const dropdown = screen.getByRole("combobox");
      await user.click(dropdown);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Option 1"));
      expect(mockHandleChange).toHaveBeenCalledWith(mockItems[0]);
    });

    it("displays current selection", () => {
      render(
        <SearchDropdown {...defaultProps} currentSelection={mockItems[0]} />,
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.queryByText("Option 2")).toBeNull();
    });
  });

  describe("Multi Select Mode", () => {
    const multiSelectProps = {
      ...defaultProps,
      isMultiSelect: true,
    };

    it("allows multiple selections", async () => {
      const user = userEvent.setup();
      const mockHandleChange = jest.fn();

      render(
        <SearchDropdown
          {...multiSelectProps}
          handleChange={mockHandleChange}
        />,
      );

      const dropdown = screen.getByRole("combobox");
      await user.click(dropdown);

      // Select first option
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
      await user.click(screen.getByText("Option 1"));

      // Select second option
      await user.click(dropdown);
      await waitFor(() => {
        expect(screen.getByText("Option 2")).toBeInTheDocument();
      });
      await user.click(screen.getByText("Option 2"));

      expect(mockHandleChange).toHaveBeenCalledTimes(2);
    });

    it("displays multiple current selections", () => {
      const multipleSelections = [mockItems[0], mockItems[1]];

      render(
        <SearchDropdown
          {...multiSelectProps}
          currentSelection={multipleSelections}
        />,
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("displays error message when no options match search", async () => {
      const user = userEvent.setup();
      render(<SearchDropdown {...defaultProps} />);

      const dropdown = screen.getByRole("combobox");
      await user.click(dropdown);
      await user.type(dropdown, "nonexistent");

      await waitFor(() => {
        expect(screen.getByText("No options found")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty items array", () => {
      render(<SearchDropdown {...defaultProps} items={[]} />);

      const dropdown = screen.getByRole("combobox");
      expect(dropdown).toBeInTheDocument();
    });

    it("does not call handleChange when null option is selected", () => {
      const mockHandleChange = jest.fn();
      render(
        <SearchDropdown {...defaultProps} handleChange={mockHandleChange} />,
      );

      // Simulate internal handleSelectionChange with null
      const component = screen.getByRole("combobox");
      fireEvent.change(component, { target: { value: null } });

      expect(mockHandleChange).not.toHaveBeenCalled();
    });

    it("handles undefined currentSelection", () => {
      render(<SearchDropdown {...defaultProps} currentSelection={undefined} />);

      const dropdown = screen.getByRole("combobox");
      expect(dropdown).toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("applies custom CSS classes", () => {
      render(<SearchDropdown {...defaultProps} />);

      const container = screen.getByRole("combobox").closest(".test-class");
      expect(container).toBeInTheDocument();
    });
  });
});
