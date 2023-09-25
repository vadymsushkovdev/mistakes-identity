import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Sources } from "quill";
import "react-quill/dist/quill.snow.css";
import ReactQuill, { Range, UnprivilegedEditor } from "react-quill";

import { validateWordApi } from "@src/api/validateWordApi.ts";
import { LanguagesEnum } from "@src/common/enums/languagesEnum.ts";
import { useDebounce } from "@src/common/hooks/useDebounce.ts";
import useOutsideClick from "@src/common/hooks/useOutsideClick.ts";
import { findWordIndices } from "@src/common/utils/findWordIndices.ts";
import { getWordBoundsAtPosition } from "@src/common/utils/getWordBoundsAtPosition.ts";
import {
  hintDropdownMoveLeft,
  hintDropdownMoveTop,
  matchSpaceRegex,
  textEditorDebounceDelay,
} from "@src/components/TextEditorWithErrors/consts/textEditorConsts.ts";
import { QuillWithEditor } from "@src/components/TextEditorWithErrors/types/quillTypes.ts";
import classes from "./TextEditorWithErrors.module.scss";

import "./RedUnderlineFormat/RedUnderlineFormat.ts";

type Props = {
  lang: LanguagesEnum;
};

export const TextEditorWithErrors = memo((props: Props) => {
  const { lang } = props;

  const editorRef = useRef<QuillWithEditor>(null);

  const [bounds, setBounds] = useState({ top: 0, left: 0 });
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [dropdownWords, setDropdownWords] = useState<string[]>([]);
  const [currentWordIndexes, setCurrentWordIndexes] = useState({
    start: 0,
    end: 0,
  });
  const [dictionary, setDictionary] = useState<Set<string>>(new Set());
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    editorRef.current?.editor.root.setAttribute("spellcheck", "false");
  }, []);

  const handleChange = useCallback(
    async (selection: Range, _sources: Sources, editor: UnprivilegedEditor) => {
      if (!editorRef.current || !selection) {
        return;
      }

      const editorText = editor.getText();

      editorRef.current.editor.removeFormat(0, editorText.length);

      const words = editorText
        .split(" ")
        .map((word) => word.replace(matchSpaceRegex, ""))
        .filter((word) => word.length > 0 && !dictionary.has(word));

      const validationResponses = await validateWordApi(words.join(","), lang);

      validationResponses.map((validationResponse) => {
        const indexes = findWordIndices(
          editorText,
          validationResponse.original,
        );

        indexes.map(({ startIndex, endIndex }) => {
          (editorRef.current as QuillWithEditor).editor.formatText(
            startIndex,
            endIndex,
            { redU: true },
          );
        });
      });

      const [start, end] = getWordBoundsAtPosition(editorText, selection.index);

      const currentWord = editorText.substring(start, end);

      setCurrentWord(currentWord);

      const validationResponse = validationResponses.find(
        (res) => res.original === currentWord.trim(),
      );

      if (validationResponse) {
        const { top, left } = editor.getBounds(selection.index);

        setBounds({
          top: top + hintDropdownMoveTop,
          left: left - hintDropdownMoveLeft,
        });
        setIsDropdownVisible(true);
        setDropdownWords(validationResponse.suggestions);
        setCurrentWordIndexes({ start, end });
      } else {
        setIsDropdownVisible(false);
        setDropdownWords([]);
      }
    },
    [dictionary, lang],
  );

  const hideDropdown = useCallback(() => {
    setIsDropdownVisible(false);
    setDropdownWords([]);
  }, [setIsDropdownVisible, setDropdownWords]);

  const handleWordClick = useCallback(
    (word: string) => () => {
      if (!editorRef.current) {
        return;
      }

      const text = editorRef.current.editor.getText();
      editorRef.current.editor.setText(
        text.slice(0, currentWordIndexes.start) +
          word +
          text.slice(currentWordIndexes.end),
      );

      hideDropdown();
    },
    [currentWordIndexes.end, currentWordIndexes.start, hideDropdown],
  );

  const debouncedChangeHandler = useDebounce(
    handleChange,
    textEditorDebounceDelay,
  );
  useOutsideClick(dropdownRef, hideDropdown);

  const handleSaveToDictionaryClick = useCallback(() => {
    if (currentWord) {
      setDictionary((prev) => prev.add(currentWord));
      hideDropdown();
      if (editorRef.current) {
        const text = editorRef.current.editor.getText();
        editorRef.current.editor.setText(text);
      }
    }
  }, [currentWord, hideDropdown]);

  return (
    <div style={{ position: "relative" }}>
      <ReactQuill
        theme="snow"
        onChangeSelection={debouncedChangeHandler}
        className={classes.editor}
        modules={{ toolbar: false }}
        ref={editorRef}
      />
      {isDropdownVisible && (
        <div style={bounds} className={classes.dropdown} ref={dropdownRef}>
          <ul className={classes.list}>
            {dropdownWords.map((word) => (
              <li className={classes.listItem} onClick={handleWordClick(word)}>
                {word}
              </li>
            ))}
          </ul>
          <button onClick={handleSaveToDictionaryClick} className={classes.btn}>
            Save to dictionary
          </button>
        </div>
      )}
    </div>
  );
});
