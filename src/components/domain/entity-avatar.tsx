import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const PALETTE = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
];

function paletteFor(name: string) {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export function EntityAvatar({
  name,
  imageUrl,
  className,
  size = "md",
}: {
  name: string;
  imageUrl?: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  const sizeClass = { xs: "size-5 text-[10px]", sm: "size-7 text-xs", md: "size-9 text-sm", lg: "size-12 text-base" }[size];
  return (
    <Avatar className={cn(sizeClass, className)}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={name} /> : null}
      <AvatarFallback className={cn("font-medium", paletteFor(name))}>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
