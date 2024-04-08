"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import * as React from "react";

export function InputWithKeyUp(
  props: React.ComponentPropsWithoutRef<typeof Input>,
) {
  const [value, setValue] = React.useState<string | undefined>();
  const debouncedValue = useDebounce(value, 1000);
  const router = useRouter();

  React.useEffect(() => {
    if (debouncedValue) {
      router.push(`/search?q=${debouncedValue}`);
    } else {
      router.push("/search");
    }
  }, [debouncedValue, router]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
