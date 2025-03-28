const WHITE = 0;
const BLACK = 255;
const PRIMARY_LIGHT = "#ccc19f";
const PRIMARY_DARK = "#1c274d";

export const DARK_THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const DARK_THEME_ATTRIBUTE = "data-theme";
export const WHEEL_COLORS = {
  DARK_THEME: {
    thinner: WHITE,
    cursor: PRIMARY_DARK,
    stroke: PRIMARY_LIGHT,
  },
  LIGHT_THEME: {
    thinner: BLACK,
    cursor: PRIMARY_LIGHT,
    stroke: PRIMARY_DARK,
  },
};
