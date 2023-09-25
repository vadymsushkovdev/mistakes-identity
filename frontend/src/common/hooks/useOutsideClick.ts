import { MutableRefObject, useEffect } from "react";

function useClickOutside(
  elementRef: MutableRefObject<HTMLDivElement | null>,
  callback: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as unknown as never)
      ) {
        callback();
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [elementRef, callback]);
}

export default useClickOutside;
