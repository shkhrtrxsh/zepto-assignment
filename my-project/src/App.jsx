import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const ChipComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users").then((response) => {
      const fetchedItems = response.data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        profileIcon: `https://i.pravatar.cc/40?u=${user.id}`,
      }));
      setDropdownItems(fetchedItems);
      setFilteredItems(fetchedItems);
    });
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setIsOpen(!!value);

    const filteredItems = dropdownItems.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filteredItems);
  };

  const handleItemClick = (item) => {
    const updatedSelectedItems = [...selectedItems, item];
    const updatedDropdownItems = dropdownItems.filter(
      (dropdownItem) => dropdownItem !== item
    );

    setSelectedItems(updatedSelectedItems);
    setDropdownItems(updatedDropdownItems);
    setInputValue("");
    setIsOpen(false);
    setFilteredItems(updatedDropdownItems);
  };

  const handleChipRemove = (removedItem) => {
    const updatedSelectedItems = selectedItems.filter(
      (selectedItem) => selectedItem !== removedItem
    );
    const updatedDropdownItems = [...dropdownItems, removedItem];

    setSelectedItems(updatedSelectedItems);
    setDropdownItems(updatedDropdownItems);
    setFilteredItems(updatedDropdownItems);
  };

  const handleBackspace = (event) => {
    if (
      event.key === "Backspace" &&
      inputValue === "" &&
      selectedItems.length > 0
    ) {
      const lastSelectedItem = selectedItems[selectedItems.length - 1];
      handleChipRemove(lastSelectedItem);
    }
  };

  return (
    <div className="">
      <div className="text-center font-bold text-blue-600 text-xl"> PICK USER</div>
      <div className="flex">
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center bg-gray-400 rounded-xl p-2 m-1"
          >
            <img
              src={item.profileIcon}
              alt="Profile Icon"
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="mr-2">{item.name}</span>
            <span
              className="cursor-pointer"
              onClick={() => handleChipRemove(item)}
            >
              X
            </span>
          </div>
        ))}
        <input
  type="text"
 
  value={inputValue}
  onChange={handleInputChange}
  onKeyDown={handleBackspace}
  placeholder="Add New User.."
  onClick={() => setIsOpen(true)}
  className={`flex-1 outline-none p-2 ${
    inputValue ? "border-b-2 border-blue-500" : "border-b-2 border-blue-300"
  }`}
/>

      </div>
      {isOpen && filteredItems.length > 0 && (
        <div className="dropdown-list bg-white shadow-md rounded mt-1 overflow-y-auto w-[50%] absolute left-0">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
            >
              <img
                src={item.profileIcon}
                alt="Profile Icon"
                className="w-6 h-6 rounded-full mr-2"
              />
              <span className="mr-2">{item.name}</span>
              <span>{item.email}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChipComponent;
