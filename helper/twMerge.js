import { extendTailwindMerge } from "tailwind-merge";
const TWM = extendTailwindMerge({
  classGroups: {
    shadow: ["shadow-glow-1", "shadow-glow-2"],
    fontSize: [
      "text-10",
      "text-12",
      "text-14",
      "text-16",
      "text-18",
      "text-20",
      "text-22",
      "text-24",
      "text-32",
      "text-42",
      "text-68",
      "text-90",
    ],
  },
});

export default TWM;
