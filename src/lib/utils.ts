import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Filter from "bad-words";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cleanup = (text: string) => {
  const filter = new Filter();

  try {
    return filter.clean(text);
  } catch {
    return text;
  }
};
