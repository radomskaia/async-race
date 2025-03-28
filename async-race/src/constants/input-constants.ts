export const TEXTAREA_ROWS = 15;
export const TEXTAREA_COLS = 80;

export const PLACEHOLDER = {
  TITLE: "Title",
  WEIGHT: "Weight",
  INSTRUCTION: `
Paste a list of new options in a CSV-like format:

title,weight(number)              -> | title                           |weight|
title,1                           -> | title                           | 1 |
title with whitespace,2           -> | title with whitespace           | 2 |
title , with , commas,3           -> | title , with , commas           | 3 |
title with &quot;quotes&quot;,4   -> | title with &quot;quotes&quot;   | 4 |
`,
} as const;
export const INPUT_TYPES = {
  TEXT: "text",
  NUMBER: "number",
  FILE: "file",
} as const;
export const DURATION_ID = "duration";
export const WEIGHT_STEP = "any";
