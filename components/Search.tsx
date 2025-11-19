"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";

const Search = ({
  searchInputs = [],
  className,
}: {
  searchInputs?: { label: string }[];
  className?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const placeholderStrings = searchInputs.map((p) => p.label);

  return (
    <div
      className={cn(
        className,
        "flex flex-col items-center justify-center px-4",
      )}
    >
      <PlaceholdersAndVanishInput
        placeholders={placeholderStrings}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default Search;
