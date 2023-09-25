import {MutableRefObject, useCallback, useRef} from "react";

export function useDebounce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (...args: any[]) => void,
    delay: number,
) {
    const timer = useRef() as MutableRefObject<ReturnType<typeof setTimeout>>;

    return useCallback(
        (...args: unknown[]) => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay],
    );
}
