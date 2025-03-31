// Question: Describe how you would design the architecture for
// a real-time chat application.
import { useMemo, useRef, useState } from "react";

const suggestions = [
    "aardvark",
    "ant",
    "bear",
    "beaver",
    "cat",
    "cheetah",
    "dog",
    "dolphin",
    "leopard",
    "lion",
    "tiger",
    "yak",
    "zebra",
];

const Autocomplete = () => {
  const [text, setText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const optionHeight = listRef?.current?.children[0]?.clientHeight ?? 1;

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    setShowSuggestions(true);
  };

  const handleTextBlur = () => {
    setShowSuggestions(false);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setText(suggestion);
    setShowSuggestions(false);
  };

  const selectOption = (index: number) => {
    if (index > -1) {
      handleSuggestionSelect(filteredSuggestions[index]);
    }
  };

  const scrollUp = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
    if (listRef && listRef.current) {
      listRef.current.scrollTop -= optionHeight;
    }
  };

  const scrollDown = () => {
    if (selectedIndex < filteredSuggestions.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
    if (listRef && listRef.current) {
      listRef.current.scrollTop = selectedIndex * optionHeight;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
        scrollUp();
    } else if (event.key === "ArrowDown") {
        scrollDown();
    } else if (event.key === "Enter") {
        selectOption(selectedIndex);
    }
  };

  const filteredSuggestions = useMemo(
    () =>
      suggestions.filter((s) => s.toLowerCase().startsWith(text.toLowerCase())),
    [suggestions, text]
  );

  return (
    <div>
      <input
        type="text"
        placeholder="search animals here"
        value={text}
        onChange={handleTextChange}
        onBlur={handleTextBlur}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && (
        <ul ref={listRef}>
          {filteredSuggestions.slice(0, 5).map((s) => (
            <li
              key={s}
              className={`hover:bg-slate-300`}
              onClick={() => handleSuggestionSelect(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
