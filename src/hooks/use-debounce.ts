import * as React from "react";

/**
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns same type as value
 * @example const debouncedValue = useDebounce(value, 1000);
 */
export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
