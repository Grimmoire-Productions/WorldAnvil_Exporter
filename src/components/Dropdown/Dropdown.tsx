import React, {useState} from 'react';
import type { DropdownOption } from '../../utils/types';

type DropdownProps = {
  id: string,
  items: DropdownOption[],
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  error: string;
}



function Dropdown({ id, items, onChange, error }: DropdownProps) {

  // State to hold the currently selected tag in the dropdown
  const [currentSelectedItem, setCurrentSelectedItem] = useState<string>(items[0].value);
  
  const dropdownOptions = items?.map((item: DropdownOption, i: number) => {
    return <option value={item.value} id={item.id} key={id + i}>{item.label}</option>
  })

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItem = event.target.value;
    setCurrentSelectedItem(newItem);
    if (onChange) {
      onChange(event);
    }
  };

  const dropdownComponent = (
    < select id={id} value={currentSelectedItem} onChange={handleSelectionChange} >
    { dropdownOptions }
    </select >
  )

  return (items && items.length > 1) ? dropdownComponent : error
}

export default Dropdown;