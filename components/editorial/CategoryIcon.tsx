import type { CategoryIconName } from "@/data/homepage-editorial";

// 1.25px garden line icons drawn on a 32px grid — deliberately plain, no fills.
const paths: Record<CategoryIconName, React.ReactNode> = {
  mower: (
    <>
      <path d="M4 20h17v4H4zM7 20l2-5h9l2 5M21 20l6-12h2" />
      <circle cx="8" cy="26" r="2" />
      <circle cx="19" cy="26" r="2" />
    </>
  ),
  trimmer: (
    <>
      <path d="M26 4 12 20M14 18l-3 6 3 1M24 6l3 3M20 10l3 3" />
      <path d="M7 25c2-2 5-2 7 0M5 28h10" />
    </>
  ),
  hose: (
    <>
      <circle cx="12" cy="17" r="7" />
      <circle cx="12" cy="17" r="3" />
      <path d="M19 17h5l3-3M27 14l2 2M5 25l-1 3h16l-1-3" />
    </>
  ),
  sprout: (
    <>
      <path d="M16 22V12M16 14c0-5 4-8 9-8 0 5-4 8-9 8zM16 16c0-4-3-6-8-6 0 4 3 6 8 6z" />
      <path d="M6 22h20l-2 6H8z" />
    </>
  ),
  blower: (
    <>
      <path d="M5 13h11v8H5zM16 15h8l3 2-3 2h-8M8 13V9h6v4" />
      <path d="M27 11c1 1 2 2 2 4M27 23c1-1 2-2 2-4" />
    </>
  ),
  shears: (
    <>
      <circle cx="9" cy="23" r="3" />
      <circle cx="18" cy="26" r="3" />
      <path d="M11 21 25 5M16 23 26 9" />
    </>
  ),
  shed: (
    <>
      <path d="M4 14 16 5l12 9M7 12v15h18V12" />
      <path d="M13 27v-8h6v8" />
    </>
  ),
};

export function CategoryIcon({ name, className = "h-8 w-8" }: { name: CategoryIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
