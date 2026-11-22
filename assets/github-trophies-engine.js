"use strict";

(function () {
  var GLOBAL_KEY = "__PRG_TROPHY_ENGINE__";
  var CACHE_PREFIX = "prg-trophy-cache-v4:";
  var METRICS_TTL = 6 * 60 * 60 * 1e3;
  var PANEL_SIZE = 110;
  var memoryMetrics = new Map();
  var memorySvg = new Map();
  var RANK = {
    SECRET: "SECRET",
    SSS: "SSS",
    SS: "SS",
    S: "S",
    AAA: "AAA",
    AA: "AA",
    A: "A",
    B: "B",
    C: "C",
    UNKNOWN: "?",
  };
  var RANK_ORDER = [
    RANK.SECRET,
    RANK.SSS,
    RANK.SS,
    RANK.S,
    RANK.AAA,
    RANK.AA,
    RANK.A,
    RANK.B,
    RANK.C,
    RANK.UNKNOWN,
  ];
  var THEMES = {
    default: {
      BACKGROUND: "#FFF",
      TITLE: "#000",
      ICON_CIRCLE: "#FFF",
      TEXT: "#666",
      LAUREL: "#009366",
      SECRET_RANK_1: "red",
      SECRET_RANK_2: "fuchsia",
      SECRET_RANK_3: "blue",
      SECRET_RANK_TEXT: "fuchsia",
      NEXT_RANK_BAR: "#0366d6",
      S_RANK_BASE: "#FAD200",
      S_RANK_SHADOW: "#C8A090",
      S_RANK_TEXT: "#886000",
      A_RANK_BASE: "#B0B0B0",
      A_RANK_SHADOW: "#9090C0",
      A_RANK_TEXT: "#505050",
      B_RANK_BASE: "#A18D66",
      B_RANK_SHADOW: "#816D96",
      B_RANK_TEXT: "#412D06",
      DEFAULT_RANK_BASE: "#777",
      DEFAULT_RANK_SHADOW: "#333",
      DEFAULT_RANK_TEXT: "#333",
    },
    green: {
      BACKGROUND: "#151515",
      TITLE: "#79ff97",
      ICON_CIRCLE: "#f8f8f8",
      TEXT: "#9f9f9f",
      LAUREL: "#79ff97",
      SECRET_RANK_1: "#79ff97",
      SECRET_RANK_2: "#c9d1d9",
      SECRET_RANK_3: "#ffffff",
      SECRET_RANK_TEXT: "#79ff97",
      NEXT_RANK_BAR: "#79ff97",
      S_RANK_BASE: "#ffffff",
      S_RANK_SHADOW: "#3d3d3d",
      S_RANK_TEXT: "#c9b18a",
      A_RANK_BASE: "#79ff97",
      A_RANK_SHADOW: "#3d3d3d",
      A_RANK_TEXT: "#151515",
      B_RANK_BASE: "#ffffff",
      B_RANK_SHADOW: "#3d3d3d",
      B_RANK_TEXT: "#c9b18a",
      DEFAULT_RANK_BASE: "#9f9f9f",
      DEFAULT_RANK_SHADOW: "#3d3d3d",
      DEFAULT_RANK_TEXT: "#f8f8f8",
    },
    dracula: {
      BACKGROUND: "#282a36",
      TITLE: "#ff79c6",
      ICON_CIRCLE: "#f8f8f2",
      TEXT: "#f8f8f2",
      LAUREL: "#50fa7b",
      SECRET_RANK_1: "#ff5555",
      SECRET_RANK_2: "#ff79c6",
      SECRET_RANK_3: "#bd93f9",
      SECRET_RANK_TEXT: "#bd93f9",
      NEXT_RANK_BAR: "#ff79c6",
      S_RANK_BASE: "#ffb86c",
      S_RANK_SHADOW: "#ffb86c",
      S_RANK_TEXT: "#6272a4",
      A_RANK_BASE: "#8be9fd",
      A_RANK_SHADOW: "#8be9fd",
      A_RANK_TEXT: "#6272a4",
      B_RANK_BASE: "#ff5555",
      B_RANK_SHADOW: "#ff5555",
      B_RANK_TEXT: "#6272a4",
      DEFAULT_RANK_BASE: "#6272a4",
      DEFAULT_RANK_SHADOW: "#6272a4",
      DEFAULT_RANK_TEXT: "#6272a4",
    },
    flat: {
      BACKGROUND: "#FFF",
      TITLE: "#000",
      ICON_CIRCLE: "#FFF",
      TEXT: "#666",
      LAUREL: "#009366",
      SECRET_RANK_1: "red",
      SECRET_RANK_2: "fuchsia",
      SECRET_RANK_3: "blue",
      SECRET_RANK_TEXT: "fuchsia",
      NEXT_RANK_BAR: "#0366d6",
      S_RANK_BASE: "#eac200",
      S_RANK_SHADOW: "#eac200",
      S_RANK_TEXT: "#886000",
      A_RANK_BASE: "#B0B0B0",
      A_RANK_SHADOW: "#B0B0B0",
      A_RANK_TEXT: "#505050",
      B_RANK_BASE: "#A18D66",
      B_RANK_SHADOW: "#A18D66",
      B_RANK_TEXT: "#412D06",
      DEFAULT_RANK_BASE: "#777",
      DEFAULT_RANK_SHADOW: "#777",
      DEFAULT_RANK_TEXT: "#333",
    },
    onedark: {
      BACKGROUND: "#282c34",
      TITLE: "#e5c07b",
      ICON_CIRCLE: "#FFF",
      TEXT: "#e06c75",
      LAUREL: "#98c379",
      SECRET_RANK_1: "#e06c75",
      SECRET_RANK_2: "#c678dd",
      SECRET_RANK_3: "#61afef",
      SECRET_RANK_TEXT: "#c678dd",
      NEXT_RANK_BAR: "#e5c07b",
      S_RANK_BASE: "#e5c07b",
      S_RANK_SHADOW: "#e5c07b",
      S_RANK_TEXT: "#282c34",
      A_RANK_BASE: "#56b6c2",
      A_RANK_SHADOW: "#56b6c2",
      A_RANK_TEXT: "#282c34",
      B_RANK_BASE: "#c678dd",
      B_RANK_SHADOW: "#c678dd",
      B_RANK_TEXT: "#282c34",
      DEFAULT_RANK_BASE: "#abb2bf",
      DEFAULT_RANK_SHADOW: "#abb2bf",
      DEFAULT_RANK_TEXT: "#282c34",
    },
    gruvbox: {
      BACKGROUND: "#282828",
      TITLE: "#ebdbb2",
      ICON_CIRCLE: "#ebdbb2",
      TEXT: "#98971a",
      LAUREL: "#689d6a",
      SECRET_RANK_1: "#fb4934",
      SECRET_RANK_2: "#d3869b",
      SECRET_RANK_3: "#458588",
      SECRET_RANK_TEXT: "#b16286",
      NEXT_RANK_BAR: "#fabd26",
      S_RANK_BASE: "#fabd2f",
      S_RANK_SHADOW: "#fabd2f",
      S_RANK_TEXT: "#322301",
      A_RANK_BASE: "#83a598",
      A_RANK_SHADOW: "#83a598",
      A_RANK_TEXT: "#151e1a",
      B_RANK_BASE: "#d65d0e",
      B_RANK_SHADOW: "#d65d0e",
      B_RANK_TEXT: "#301503",
      DEFAULT_RANK_BASE: "#928374",
      DEFAULT_RANK_SHADOW: "#928374",
      DEFAULT_RANK_TEXT: "#282828",
    },
    monokai: {
      BACKGROUND: "#272822",
      TITLE: "#f92672",
      ICON_CIRCLE: "#fff",
      TEXT: "#fff",
      LAUREL: "#a6e22e",
      SECRET_RANK_1: "#f92672",
      SECRET_RANK_2: "#ae81ff",
      SECRET_RANK_3: "#66d9ef",
      SECRET_RANK_TEXT: "#b16286",
      NEXT_RANK_BAR: "#f92672",
      S_RANK_BASE: "#e6db74",
      S_RANK_SHADOW: "#e6db74",
      S_RANK_TEXT: "#272822",
      A_RANK_BASE: "#66d9ef",
      A_RANK_SHADOW: "#66d9ef",
      A_RANK_TEXT: "#272822",
      B_RANK_BASE: "#fd971f",
      B_RANK_SHADOW: "#fd971f",
      B_RANK_TEXT: "#272822",
      DEFAULT_RANK_BASE: "#75715e",
      DEFAULT_RANK_SHADOW: "#75715e",
      DEFAULT_RANK_TEXT: "#282828",
    },
    nord: {
      BACKGROUND: "#2E3440",
      TITLE: "#81A1C1",
      ICON_CIRCLE: "#D8DEE9",
      TEXT: "#ECEFF4",
      LAUREL: "#A3BE8C",
      SECRET_RANK_1: "#BF616A",
      SECRET_RANK_2: "#B48EAD",
      SECRET_RANK_3: "#81A1C1",
      SECRET_RANK_TEXT: "#B48EAD",
      NEXT_RANK_BAR: "#81A1C1",
      S_RANK_BASE: "#EBCB8B",
      S_RANK_SHADOW: "#EBCB8B",
      S_RANK_TEXT: "#3B4252",
      A_RANK_BASE: "#8FBCBB",
      A_RANK_SHADOW: "#8FBCBB",
      A_RANK_TEXT: "#3B4252",
      B_RANK_BASE: "#D08770",
      B_RANK_SHADOW: "#D08770",
      B_RANK_TEXT: "#3B4252",
      DEFAULT_RANK_BASE: "#5E81AC",
      DEFAULT_RANK_SHADOW: "#5E81AC",
      DEFAULT_RANK_TEXT: "#3B4252",
    },
    discord: {
      BACKGROUND: "#23272A",
      TITLE: "#7289DA",
      ICON_CIRCLE: "#FFFFFF",
      TEXT: "#FFFFFF",
      LAUREL: "#57F287",
      SECRET_RANK_1: "#ED4245",
      SECRET_RANK_2: "#57F287",
      SECRET_RANK_3: "#5865F2",
      SECRET_RANK_TEXT: "#000000",
      NEXT_RANK_BAR: "#5865F2",
      S_RANK_BASE: "#FEE75C",
      S_RANK_SHADOW: "#FEE75C",
      S_RANK_TEXT: "#000000",
      A_RANK_BASE: "#EB459E",
      A_RANK_SHADOW: "#ED4245",
      A_RANK_TEXT: "#000000",
      B_RANK_BASE: "#ED4245",
      B_RANK_SHADOW: "#ED4245",
      B_RANK_TEXT: "#000000",
      DEFAULT_RANK_BASE: "#5865F2",
      DEFAULT_RANK_SHADOW: "#5865F2",
      DEFAULT_RANK_TEXT: "#000000",
    },
    chalk: {
      BACKGROUND: "#2d2d2d",
      TITLE: "#fed37e",
      ICON_CIRCLE: "#e4e4e4",
      TEXT: "#d4d4d4",
      LAUREL: "#a9d3ab",
      SECRET_RANK_1: "#f58e8e",
      SECRET_RANK_2: "#d6add5",
      SECRET_RANK_3: "#66d9ef",
      SECRET_RANK_TEXT: "#f58e8e",
      NEXT_RANK_BAR: "#7aabd4",
      S_RANK_BASE: "#fed37e",
      S_RANK_SHADOW: "#fed37e",
      S_RANK_TEXT: "#2d2d2d",
      A_RANK_BASE: "#79D4D5",
      A_RANK_SHADOW: "#79D4D5",
      A_RANK_TEXT: "#2d2d2d",
      B_RANK_BASE: "#f58e8e",
      B_RANK_SHADOW: "#f58e8e",
      B_RANK_TEXT: "#2d2d2d",
      DEFAULT_RANK_BASE: "#75715e",
      DEFAULT_RANK_SHADOW: "#75715e",
      DEFAULT_RANK_TEXT: "#2d2d2d",
    },
    alduin: {
      BACKGROUND: "#1c1c1c",
      TITLE: "#dfd7af",
      ICON_CIRCLE: "#e3e3e3",
      TEXT: "#dfd7af",
      LAUREL: "#a9d3ab",
      SECRET_RANK_1: "#f58e8e",
      SECRET_RANK_2: "#d6add5",
      SECRET_RANK_3: "#66d9ef",
      SECRET_RANK_TEXT: "#f58e8e",
      NEXT_RANK_BAR: "#dfd7af",
      S_RANK_BASE: "#fed37e",
      S_RANK_SHADOW: "#fed37e",
      S_RANK_TEXT: "#2d2d2d",
      A_RANK_BASE: "#79D4D5",
      A_RANK_SHADOW: "#79D4D5",
      A_RANK_TEXT: "#2d2d2d",
      B_RANK_BASE: "#f58e8e",
      B_RANK_SHADOW: "#f58e8e",
      B_RANK_TEXT: "#2d2d2d",
      DEFAULT_RANK_BASE: "#75715e",
      DEFAULT_RANK_SHADOW: "#75715e",
      DEFAULT_RANK_TEXT: "#2d2d2d",
    },
    darkhub: {
      BACKGROUND: "#0d1117",
      TITLE: "#c9d1d9",
      ICON_CIRCLE: "#f0f6fb",
      TEXT: "#8b949e",
      LAUREL: "#178600",
      SECRET_RANK_1: "#ff5555",
      SECRET_RANK_2: "#ff79c6",
      SECRET_RANK_3: "#388bfd",
      SECRET_RANK_TEXT: "#ff79c6",
      NEXT_RANK_BAR: "#ff79c6",
      S_RANK_BASE: "#ffb86c",
      S_RANK_SHADOW: "#ffb86c",
      S_RANK_TEXT: "#0d1117",
      A_RANK_BASE: "#8be9fd",
      A_RANK_SHADOW: "#8be9fd",
      A_RANK_TEXT: "#0d1117",
      B_RANK_BASE: "#ff5555",
      B_RANK_SHADOW: "#ff5555",
      B_RANK_TEXT: "#0d1117",
      DEFAULT_RANK_BASE: "#6272a4",
      DEFAULT_RANK_SHADOW: "#6272a4",
      DEFAULT_RANK_TEXT: "#0d1117",
    },
    juicyfresh: {
      BACKGROUND: "#0d0c15",
      TITLE: "#f7d745",
      ICON_CIRCLE: "#FFF",
      TEXT: "#b2d76c",
      LAUREL: "#8bb071",
      SECRET_RANK_1: "#a8d937",
      SECRET_RANK_2: "#f7e662",
      SECRET_RANK_3: "#4d9b1c",
      SECRET_RANK_TEXT: "#ff5700",
      NEXT_RANK_BAR: "#6562af",
      S_RANK_BASE: "#f7d644",
      S_RANK_SHADOW: "#f69e44",
      S_RANK_TEXT: "#ff5700",
      A_RANK_BASE: "#f69e44",
      A_RANK_SHADOW: "#f46d5a",
      A_RANK_TEXT: "#ff5700",
      B_RANK_BASE: "#f46d5a",
      B_RANK_SHADOW: "#f73155",
      B_RANK_TEXT: "#ff5700",
      DEFAULT_RANK_BASE: "#f0d7d6",
      DEFAULT_RANK_SHADOW: "#f58867",
      DEFAULT_RANK_TEXT: "#ff5700",
    },
    oldie: {
      BACKGROUND: "#F0F0F0",
      TITLE: "#111",
      ICON_CIRCLE: "#FFF",
      TEXT: "#666",
      LAUREL: "#535353",
      SECRET_RANK_1: "#738986",
      SECRET_RANK_2: "#B36154",
      SECRET_RANK_3: "#91A16A",
      SECRET_RANK_TEXT: "#4D4D4D",
      NEXT_RANK_BAR: "#8E8680",
      S_RANK_BASE: "#8E8E8E",
      S_RANK_SHADOW: "#8E8E8E",
      S_RANK_TEXT: "#4D4D4D",
      A_RANK_BASE: "#AFAFAF",
      A_RANK_SHADOW: "#AFAFAF",
      A_RANK_TEXT: "#4D4D4D",
      B_RANK_BASE: "#858585",
      B_RANK_SHADOW: "#858585",
      B_RANK_TEXT: "#4D4D4D",
      DEFAULT_RANK_BASE: "#535353",
      DEFAULT_RANK_SHADOW: "#535353",
      DEFAULT_RANK_TEXT: "#4D4D4D",
    },
    buddhism: {
      BACKGROUND: "#ffc20e",
      TITLE: "#FFF",
      ICON_CIRCLE: "#FFF",
      TEXT: "#FFF",
      LAUREL: "#27c5ff",
      SECRET_RANK_1: "#FFF",
      SECRET_RANK_2: "#f73155",
      SECRET_RANK_3: "#fff",
      SECRET_RANK_TEXT: "#f73155",
      NEXT_RANK_BAR: "#f73155",
      S_RANK_BASE: "#ff8400",
      S_RANK_SHADOW: "#ff8400",
      S_RANK_TEXT: "#ffc20e",
      A_RANK_BASE: "#fff",
      A_RANK_SHADOW: "#fff",
      A_RANK_TEXT: "#ffc20e",
      B_RANK_BASE: "#f73155",
      B_RANK_SHADOW: "#f73155",
      B_RANK_TEXT: "#ffc20e",
      DEFAULT_RANK_BASE: "#27c5ff",
      DEFAULT_RANK_SHADOW: "#27c5ff",
      DEFAULT_RANK_TEXT: "#ffc20e",
    },
    radical: {
      BACKGROUND: "#141321",
      ICON_CIRCLE: "#EEEEEE",
      TITLE: "#fe428e",
      TEXT: "#a9fef7",
      LAUREL: "#50fa7b",
      SECRET_RANK_1: "#ff5555",
      SECRET_RANK_2: "#ff15d9",
      SECRET_RANK_3: "#1E65F5",
      SECRET_RANK_TEXT: "#ff61c6",
      NEXT_RANK_BAR: "#fe428e",
      S_RANK_BASE: "#ffce32",
      S_RANK_SHADOW: "#ffce32",
      S_RANK_TEXT: "#CB8A30",
      A_RANK_BASE: "#8DF7B5",
      A_RANK_SHADOW: "#8DF7B5",
      A_RANK_TEXT: "#3A3A3A",
      B_RANK_BASE: "#EA3F25",
      B_RANK_SHADOW: "#EA3F25",
      B_RANK_TEXT: "#3A3A3A",
      DEFAULT_RANK_BASE: "#1E65F5",
      DEFAULT_RANK_SHADOW: "#1E65F5",
      DEFAULT_RANK_TEXT: "#3A3A3A",
    },
    onestar: {
      BACKGROUND: "#0d1117",
      ICON_CIRCLE: "#EEEEEE",
      TITLE: "#EEEEEE",
      TEXT: "#c7c7c7",
      LAUREL: "#0dbc79",
      SECRET_RANK_1: "#ff5555",
      SECRET_RANK_2: "#d861d8",
      SECRET_RANK_3: "#3b8eea",
      SECRET_RANK_TEXT: "#ff61c6",
      NEXT_RANK_BAR: "#9e9e9e",
      S_RANK_BASE: "#FFD54F",
      S_RANK_SHADOW: "#FFE082",
      S_RANK_TEXT: "#CB8A30",
      A_RANK_BASE: "#23d18b",
      A_RANK_SHADOW: "#8DF7B5",
      A_RANK_TEXT: "#3A3A3A",
      B_RANK_BASE: "#d13b3b",
      B_RANK_SHADOW: "#fa4b4b",
      B_RANK_TEXT: "#3A3A3A",
      DEFAULT_RANK_BASE: "#2472c8",
      DEFAULT_RANK_SHADOW: "#3b8eea",
      DEFAULT_RANK_TEXT: "#3A3A3A",
    },
    algolia: {
      BACKGROUND: "#050f2c",
      TITLE: "#00aeff",
      ICON_CIRCLE: "#f0f6fb",
      TEXT: "#7eace9",
      LAUREL: "#178600",
      SECRET_RANK_1: "#ff5555",
      SECRET_RANK_2: "#ff79c6",
      SECRET_RANK_3: "#388bfd",
      SECRET_RANK_TEXT: "#ff79c6",
      NEXT_RANK_BAR: "#00aeff",
      S_RANK_BASE: "#ffb86c",
      S_RANK_SHADOW: "#ffb86c",
      S_RANK_TEXT: "#0d1117",
      A_RANK_BASE: "#2dde98",
      A_RANK_TEXT: "#0d1117",
      A_RANK_SHADOW: "#2dde98",
      B_RANK_BASE: "#8be9fd",
      B_RANK_SHADOW: "#8be9fd",
      B_RANK_TEXT: "#0d1117",
      DEFAULT_RANK_BASE: "#5c75c3",
      DEFAULT_RANK_SHADOW: "#6272a4",
      DEFAULT_RANK_TEXT: "#0d1117",
    },
    gitdimmed: {
      BACKGROUND: "#333",
      TITLE: "#f0f6fb",
      ICON_CIRCLE: "#f0f6fb",
      TEXT: "#FFF",
      LAUREL: "#178600",
      SECRET_RANK_1: "#ff5555",
      SECRET_RANK_2: "#ff79c6",
      SECRET_RANK_3: "#388bfd",
      SECRET_RANK_TEXT: "#ff79c6",
      NEXT_RANK_BAR: "#00aeff",
      S_RANK_BASE: "#ffb86c",
      S_RANK_SHADOW: "#ffb86c",
      S_RANK_TEXT: "#0d1117",
      A_RANK_BASE: "#2dde98",
      A_RANK_TEXT: "#0d1117",
      A_RANK_SHADOW: "#2dde98",
      B_RANK_BASE: "#8be9fd",
      B_RANK_SHADOW: "#8be9fd",
      B_RANK_TEXT: "#0d1117",
      DEFAULT_RANK_BASE: "#5c75c3",
      DEFAULT_RANK_SHADOW: "#6272a4",
      DEFAULT_RANK_TEXT: "#0d1117",
    },
    tokyonight: {
      BACKGROUND: "#1a1b27",
      TITLE: "#70a5fd",
      ICON_CIRCLE: "#bf91f3",
      TEXT: "#38bdae",
      LAUREL: "#178600",
      SECRET_RANK_1: "#ff5555",
      SECRET_RANK_2: "#ff79c6",
      SECRET_RANK_3: "#388bfd",
      SECRET_RANK_TEXT: "#ff79c6",
      NEXT_RANK_BAR: "#00aeff",
      S_RANK_BASE: "#ffb86c",
      S_RANK_SHADOW: "#ffb86c",
      S_RANK_TEXT: "#0d1117",
      A_RANK_BASE: "#2dde98",
      A_RANK_TEXT: "#0d1117",
      A_RANK_SHADOW: "#2dde98",
      B_RANK_BASE: "#8be9fd",
      B_RANK_SHADOW: "#8be9fd",
      B_RANK_TEXT: "#0d1117",
      DEFAULT_RANK_BASE: "#5c75c3",
      DEFAULT_RANK_SHADOW: "#6272a4",
      DEFAULT_RANK_TEXT: "#0d1117",
    },
    matrix: {
      BACKGROUND: "#000000",
      TITLE: "#00cc00",
      ICON_CIRCLE: "#002200",
      TEXT: "#00cc00",
      LAUREL: "#178600",
      SECRET_RANK_1: "#ffd700",
      SECRET_RANK_2: "#ffffff",
      SECRET_RANK_3: "#ffd700",
      SECRET_RANK_TEXT: "#00ff00",
      NEXT_RANK_BAR: "#00ff00",
      S_RANK_BASE: "#ffd700",
      S_RANK_SHADOW: "#ffd700",
      S_RANK_TEXT: "#00ff00",
      A_RANK_BASE: "#c0c0c0",
      A_RANK_TEXT: "#00ff00",
      A_RANK_SHADOW: "#c0c0c0",
      B_RANK_BASE: "#b08d57",
      B_RANK_SHADOW: "#b08d57",
      B_RANK_TEXT: "#00ff00",
      DEFAULT_RANK_BASE: "#b08d57",
      DEFAULT_RANK_SHADOW: "#b08d57",
      DEFAULT_RANK_TEXT: "#00ff00",
    },
    apprentice: {
      BACKGROUND: "#262626",
      TITLE: "#BCBCBC",
      ICON_CIRCLE: "#BCBCBC",
      TEXT: "#5F875F",
      LAUREL: "#5F8787",
      SECRET_RANK_1: "#FF8700",
      SECRET_RANK_2: "#8787AF",
      SECRET_RANK_3: "#5F87AF",
      SECRET_RANK_TEXT: "#5F5F87",
      NEXT_RANK_BAR: "#FFFFA9",
      S_RANK_BASE: "#FFFFAF",
      S_RANK_SHADOW: "#FFFFAF",
      S_RANK_TEXT: "#87875F",
      A_RANK_BASE: "#8FAFD7",
      A_RANK_SHADOW: "#8FAFD7",
      A_RANK_TEXT: "#5F875F",
      B_RANK_BASE: "#AF5F5F",
      B_RANK_SHADOW: "#AF5F5F",
      B_RANK_TEXT: "#AF5F5F",
      DEFAULT_RANK_BASE: "#6C6C6C",
      DEFAULT_RANK_SHADOW: "#6C6C6C",
      DEFAULT_RANK_TEXT: "#1C1C1C",
    },
    dark_dimmed: {
      BACKGROUND: "#22272e",
      TITLE: "#adbac7",
      ICON_CIRCLE: "#002200",
      TEXT: "#adbac7",
      LAUREL: "#178600",
      SECRET_RANK_1: "red",
      SECRET_RANK_2: "fuchsia",
      SECRET_RANK_3: "blue",
      SECRET_RANK_TEXT: "fuchsia",
      NEXT_RANK_BAR: "#0366d6",
      S_RANK_BASE: "#FAD200",
      S_RANK_SHADOW: "#C8A090",
      S_RANK_TEXT: "#886000",
      A_RANK_BASE: "#B0B0B0",
      A_RANK_SHADOW: "#9090C0",
      A_RANK_TEXT: "#505050",
      B_RANK_BASE: "#A18D66",
      B_RANK_SHADOW: "#816D96",
      B_RANK_TEXT: "#412D06",
      DEFAULT_RANK_BASE: "#777",
      DEFAULT_RANK_SHADOW: "#333",
      DEFAULT_RANK_TEXT: "#333",
    },
    dark_lover: {
      BACKGROUND: "#0d0d0d",
      TITLE: "#e8aa64",
      ICON_CIRCLE: "white",
      TEXT: "#e8aa64",
      LAUREL: "#e86464",
      SECRET_RANK_1: "#e05555",
      SECRET_RANK_2: "#e05555",
      SECRET_RANK_3: "#e05555",
      SECRET_RANK_TEXT: "#e05555",
      NEXT_RANK_BAR: "#e05555",
      S_RANK_BASE: "#f2c635",
      S_RANK_SHADOW: "#e0d7b8",
      S_RANK_TEXT: "#b35707",
      A_RANK_BASE: "#f25755",
      A_RANK_SHADOW: "#e69493",
      A_RANK_TEXT: "#f5352f",
      B_RANK_BASE: "#63db93",
      B_RANK_SHADOW: "#8cd1a8",
      B_RANK_TEXT: "#07b84e",
      DEFAULT_RANK_BASE: "#7f6ceb",
      DEFAULT_RANK_SHADOW: "#a598ed",
      DEFAULT_RANK_TEXT: "#7f6ceb",
    },
    react: {
      BACKGROUND: "#0d1117",
      TITLE: "#61dafb",
      ICON_CIRCLE: "#fff",
      TEXT: "#c9d1d9",
      LAUREL: "#61dafb",
      SECRET_RANK_1: "#ff5555",
      SECRET_RANK_2: "#61dafb",
      SECRET_RANK_3: "#388bfd",
      SECRET_RANK_TEXT: "#61dafb",
      NEXT_RANK_BAR: "#61dafb",
      S_RANK_BASE: "#58a6ff",
      S_RANK_SHADOW: "#79c0ff",
      S_RANK_TEXT: "#0d1117",
      A_RANK_BASE: "#2ea043",
      A_RANK_SHADOW: "#3fb950",
      A_RANK_TEXT: "#0d1117",
      B_RANK_BASE: "#d29922",
      B_RANK_SHADOW: "#e3b341",
      B_RANK_TEXT: "#0d1117",
      DEFAULT_RANK_BASE: "#6e7681",
      DEFAULT_RANK_SHADOW: "#8b949e",
      DEFAULT_RANK_TEXT: "#0d1117",
    },
    kimbie_dark: {
      BACKGROUND: "#221a0f",
      TITLE: "#f06431",
      ICON_CIRCLE: "#f9f3e5",
      TEXT: "#d3af86",
      LAUREL: "#889b4a",
      SECRET_RANK_1: "#f06431",
      SECRET_RANK_2: "#f79a32",
      SECRET_RANK_3: "#a57a4c",
      SECRET_RANK_TEXT: "#f79a32",
      NEXT_RANK_BAR: "#f06431",
      S_RANK_BASE: "#f79a32",
      S_RANK_SHADOW: "#f06431",
      S_RANK_TEXT: "#221a0f",
      A_RANK_BASE: "#889b4a",
      A_RANK_SHADOW: "#a1b56c",
      A_RANK_TEXT: "#221a0f",
      B_RANK_BASE: "#dc3958",
      B_RANK_SHADOW: "#f06431",
      B_RANK_TEXT: "#221a0f",
      DEFAULT_RANK_BASE: "#a57a4c",
      DEFAULT_RANK_SHADOW: "#d3af86",
      DEFAULT_RANK_TEXT: "#221a0f",
    },
  };

  var TROPHY_DEFS = {
    stars: {
      title: "Звёзды",
      rankConditions: [
        { rank: RANK.SSS, message: "Супер старгейзер", requiredScore: 2000 },
        { rank: RANK.SS, message: "Сильный старгейзер", requiredScore: 700 },
        { rank: RANK.S, message: "Старгейзер", requiredScore: 200 },
        { rank: RANK.AAA, message: "Суперзвезда", requiredScore: 100 },
        { rank: RANK.AA, message: "Высокий рейтинг", requiredScore: 50 },
        { rank: RANK.A, message: "Вы - звезда", requiredScore: 30 },
        { rank: RANK.B, message: "Хороший старт", requiredScore: 10 },
        { rank: RANK.C, message: "Первая звезда", requiredScore: 1 },
      ],
      filterTitles: ["Star", "Stars"],
    },
    commits: {
      title: "Коммиты",
      rankConditions: [
        { rank: RANK.SSS, message: "Бог коммитов", requiredScore: 4000 },
        { rank: RANK.SS, message: "Глубокий коммитер", requiredScore: 2000 },
        { rank: RANK.S, message: "Сильный коммитер", requiredScore: 1000 },
        { rank: RANK.AAA, message: "Продвинутый коммитер", requiredScore: 500 },
        { rank: RANK.AA, message: "Опытный коммитер", requiredScore: 200 },
        { rank: RANK.A, message: "Активный коммитер", requiredScore: 100 },
        { rank: RANK.B, message: "Уверенный старт", requiredScore: 10 },
        { rank: RANK.C, message: "Первый коммит", requiredScore: 1 },
      ],
      filterTitles: ["Commit", "Commits"],
    },
    followers: {
      title: "Подписчики",
      rankConditions: [
        { rank: RANK.SSS, message: "Суперзвезда", requiredScore: 1000 },
        { rank: RANK.SS, message: "Очень известный профиль", requiredScore: 400 },
        { rank: RANK.S, message: "Очень заметный профиль", requiredScore: 200 },
        { rank: RANK.AAA, message: "Известный автор", requiredScore: 100 },
        { rank: RANK.AA, message: "Активный автор", requiredScore: 50 },
        { rank: RANK.A, message: "Динамичный автор", requiredScore: 20 },
        { rank: RANK.B, message: "Много друзей", requiredScore: 10 },
        { rank: RANK.C, message: "Первый подписчик", requiredScore: 1 },
      ],
      filterTitles: ["Follower", "Followers"],
    },
    issues: {
      title: "Issues",
      rankConditions: [
        { rank: RANK.SSS, message: "God Issuer", requiredScore: 1000 },
        { rank: RANK.SS, message: "Deep Issuer", requiredScore: 500 },
        { rank: RANK.S, message: "Super Issuer", requiredScore: 200 },
        { rank: RANK.AAA, message: "Продвинутый автор", requiredScore: 100 },
        { rank: RANK.AA, message: "Опытный автор", requiredScore: 50 },
        { rank: RANK.A, message: "Активный автор", requiredScore: 20 },
        { rank: RANK.B, message: "Уверенный старт", requiredScore: 10 },
        { rank: RANK.C, message: "First Issue", requiredScore: 1 },
      ],
      filterTitles: ["Issue", "Issues"],
    },
    pullRequests: {
      title: "Пулл-рекв.",
      rankConditions: [
        { rank: RANK.SSS, message: "Бог PR", requiredScore: 1000 },
        { rank: RANK.SS, message: "Глубокий автор PR", requiredScore: 500 },
        { rank: RANK.S, message: "Сильный автор PR", requiredScore: 200 },
        { rank: RANK.AAA, message: "Продвинутый автор", requiredScore: 100 },
        { rank: RANK.AA, message: "Опытный автор", requiredScore: 50 },
        { rank: RANK.A, message: "Активный автор", requiredScore: 20 },
        { rank: RANK.B, message: "Уверенный старт", requiredScore: 10 },
        { rank: RANK.C, message: "Первый PR", requiredScore: 1 },
      ],
      filterTitles: ["PR", "PullRequest", "Pulls", "Puller"],
    },
    repositories: {
      title: "Репозит.",
      rankConditions: [
        { rank: RANK.SSS, message: "Бог репозиториев", requiredScore: 100 },
        { rank: RANK.SS, message: "Очень плодовитый автор", requiredScore: 90 },
        { rank: RANK.S, message: "Сильный автор репо", requiredScore: 80 },
        { rank: RANK.AAA, message: "Продвинутое портфолио", requiredScore: 50 },
        { rank: RANK.AA, message: "Много проектов", requiredScore: 30 },
        { rank: RANK.A, message: "Активный автор", requiredScore: 20 },
        { rank: RANK.B, message: "Хороший набор", requiredScore: 10 },
        { rank: RANK.C, message: "Первый репозиторий", requiredScore: 1 },
      ],
      filterTitles: ["Repo", "Repository", "Repositories"],
    },
    reviews: {
      title: "Ревью",
      rankConditions: [
        { rank: RANK.SSS, message: "Бог ревью", requiredScore: 70 },
        { rank: RANK.SS, message: "Глубокий ревьюер", requiredScore: 57 },
        { rank: RANK.S, message: "Сильный ревьюер", requiredScore: 45 },
        { rank: RANK.AAA, message: "Продвинутый ревьюер", requiredScore: 30 },
        { rank: RANK.AA, message: "Опытный ревьюер", requiredScore: 20 },
        { rank: RANK.A, message: "Активный ревьюер", requiredScore: 8 },
        { rank: RANK.B, message: "Уверенный ревьюер", requiredScore: 3 },
        { rank: RANK.C, message: "Первое ревью", requiredScore: 1 },
      ],
      filterTitles: ["Review", "Reviews"],
    },
    experience: {
      title: "Стаж",
      rankConditions: [
        { rank: RANK.SSS, message: "Матёрый ветеран", requiredScore: 70 },
        { rank: RANK.SS, message: "Грандмастер", requiredScore: 55 },
        { rank: RANK.S, message: "Мастер разработки", requiredScore: 40 },
        { rank: RANK.AAA, message: "Эксперт", requiredScore: 28 },
        { rank: RANK.AA, message: "Опытный разработчик", requiredScore: 18 },
        { rank: RANK.A, message: "Уверенный разработчик", requiredScore: 11 },
        { rank: RANK.B, message: "Разработчик с опытом", requiredScore: 6 },
        { rank: RANK.C, message: "Новый участник", requiredScore: 2 },
      ],
      filterTitles: ["Experience", "Duration", "Since"],
    },
    languages: {
      title: "Языки",
      hidden: true,
      rankConditions: [{ rank: RANK.SECRET, message: "Полиглот кода", requiredScore: 10 }],
      filterTitles: ["MultipleLang", "MultiLanguage"],
    },
    organizations: {
      title: "Орг.",
      hidden: true,
      rankConditions: [{ rank: RANK.SECRET, message: "Человек многих команд", requiredScore: 3 }],
      filterTitles: ["Organizations", "Orgs", "Teams"],
    },
    longTime: {
      title: "Старожил",
      hidden: true,
      rankConditions: [{ rank: RANK.SECRET, message: "Старейшина GitHub", requiredScore: 10 }],
      filterTitles: ["LongTimeUser"],
    },
    ancient: {
      title: "До 2010",
      hidden: true,
      rankConditions: [{ rank: RANK.SECRET, message: "Древний пользователь", requiredScore: 1 }],
      bottomMessage: "До 2010",
      filterTitles: ["AncientUser"],
    },
    og: {
      title: "OG",
      hidden: true,
      rankConditions: [{ rank: RANK.SECRET, message: "OG-пользователь", requiredScore: 1 }],
      bottomMessage: "С 2008",
      filterTitles: ["OGUser"],
    },
    joined2020: {
      title: "2020",
      hidden: true,
      rankConditions: [{ rank: RANK.SECRET, message: "Всё началось...", requiredScore: 1 }],
      bottomMessage: "С 2020",
      filterTitles: ["Joined2020"],
    },
    allSuperRank: {
      title: "Все S",
      hidden: true,
      rankConditions: [{ rank: RANK.SECRET, message: "S-ранг хакер", requiredScore: 1 }],
      bottomMessage: "Все базовые S",
      filterTitles: ["AllSuperRank"],
    },
  };
  var SUPPORTED_LOCAL_GRAPHS = ["stats", "languages", "streak", "trophy", "activity-graph"];
  var LOCAL_GRAPH_TITLES = {
    stats: "Статистика профиля",
    languages: "Статистика языков",
    streak: "Серия активности",
    trophy: "Трофеи GitHub",
    "activity-graph": "График активности",
  };
  var LOCAL_GRAPH_ASSETS = {
    stats: "github-stats.svg",
    languages: "github-languages.svg",
    streak: "github-streak.svg",
    trophy: "github-trophies.svg",
    "activity-graph": "github-activity-graph.svg",
  };
  var runtimeConfigPromise = null;

  function stripQuotes(value) {
    return String(value || "").trim().replace(/^['"]|['"]$/g, "");
  }

  function normalizeHost(value) {
    var host = stripQuotes(value);
    if (!host) return "";
    if (host.indexOf("//") === 0) {
      host = "https:" + host;
    } else if (!/^https?:\/\//i.test(host)) {
      host = "https://" + host;
    }
    return host.replace(/\/+$/g, "");
  }

  function normalizeAssetPath(value) {
    var path = stripQuotes(value) || "/assets";
    path = path.replace(/^\/+/, "").replace(/\/+$/g, "");
    return path ? "/" + path : "";
  }

  function parseEnv(text) {
    var result = {};
    String(text || "").split(/\r?\n/).forEach(function (line) {
      var cleaned = line.trim();
      if (!cleaned || cleaned.charAt(0) === "#") return;
      var index = cleaned.indexOf("=");
      if (index < 0) return;
      result[cleaned.slice(0, index).trim()] = stripQuotes(cleaned.slice(index + 1));
    });
    return result;
  }

  function defaultHost() {
    if (typeof window === "undefined" || !window.location || !/^https?:$/i.test(window.location.protocol)) {
      return "";
    }
    return window.location.origin;
  }

  async function getRuntimeConfig() {
    if (runtimeConfigPromise) return runtimeConfigPromise;
    runtimeConfigPromise = (async function () {
      var env = {};
      try {
        var response = await fetch("/.env?ts=" + Date.now(), { cache: "no-store" });
        if (response.ok) {
          env = parseEnv(await response.text());
        }
      } catch (_error) {
        env = {};
      }
      return {
        assetHost: normalizeHost(env.README_ASSET_HOST || env.PUBLIC_README_ASSET_HOST || defaultHost()),
        assetPath: normalizeAssetPath(env.README_ASSET_PATH || env.PUBLIC_README_ASSET_PATH || "/assets"),
      };
    })();
    return runtimeConfigPromise;
  }

  function buildAssetUrl(config, assetName) {
    var host = config && config.assetHost ? config.assetHost : "";
    var path = config && config.assetPath ? config.assetPath : "/assets";
    if (!host) {
      return "./assets/" + assetName;
    }
    return host + path + "/" + assetName;
  }

  function localImageTag(config, assetName, alt, height) {
    return '<img src="' +
      escapeXml(buildAssetUrl(config, assetName)) +
      '"' +
      (height ? ' height="' + height + '"' : "") +
      ' alt="' +
      escapeXml(alt) +
      '" />';
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function getTheme(name) {
    return THEMES[name] || THEMES.default;
  }

  function numberOr(value, fallback) {
    var parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function boolFrom(value) {
    return value === true || value === "true";
  }

  function hexColor(value, fallback) {
    var color = stripQuotes(value);
    if (!color) return fallback;
    color = color.replace(/^#/, "");
    if (/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(color)) {
      return "#" + color;
    }
    return fallback;
  }

  function normalizeAlign(value) {
    return value === "left" || value === "right" || value === "center" ? value : "center";
  }

  function formatCount(value) {
    var count = Math.max(0, Number(value) || 0);
    if (count >= 1000) {
      return (Math.round(count / 100) / 10).toString().replace(".", ",") + " тыс.";
    }
    return String(count);
  }

  function formatGithubCount(value) {
    var count = Math.max(0, Number(value) || 0);
    if (count >= 1000000) {
      return (Math.round(count / 100000) / 10).toString().replace(/\.0$/, "") + "m";
    }
    if (count >= 1000) {
      return (Math.round(count / 100) / 10).toString().replace(/\.0$/, "") + "k";
    }
    return String(count);
  }

  function abridgeScore(score) {
    var value = Number(score) || 0;
    if (Math.abs(value) < 1) {
      return "0pt";
    }
    if (Math.abs(value) > 999) {
      return (Math.sign(value) * (Math.abs(value) / 1000)).toFixed(1) + "kpt";
    }
    return (Math.sign(value) * Math.abs(value)).toString() + "pt";
  }

  function sanitizeId(value) {
    return String(value || "trophy").replace(/[^a-zA-Z0-9_-]/g, "");
  }

  function sanitizeFileSegment(value) {
    return String(value || "github")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "github";
  }

  function hashString(value) {
    var text = String(value || "");
    var hash = 2166136261;
    for (var index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function getLocalAssetName(type, options) {
    var baseName = LOCAL_GRAPH_ASSETS[type] || "github-card.svg";
    var base = baseName.replace(/\.svg$/i, "");
    var username = sanitizeFileSegment(options && options.username);
    var theme = sanitizeFileSegment((options && options.theme) || "theme");
    var hash = hashString(JSON.stringify(options || {})).slice(0, 8);
    return username + "-" + base + "-" + theme + "-" + hash + ".svg";
  }

  function leafIcon(laurel) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="90pt" height="90pt" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><g transform="translate(20.000000,60.000000) scale(0.00400000,-0.00400000)" fill="' +
      laurel +
      '" stroke="none"><path d="M200 5103 c0 -2 18 -40 41 -84 47 -95 62 -132 50 -125 -15 10 -18 -39 -6 -87 31 -121 265 -468 412 -608 124 -119 281 -222 383 -251 36 -10 49 -16 30 -13 -19 3 -78 12 -130 20 -117 17 -353 35 -477 35 l-93 0 53 -82 c72 -112 72 -112 59 -104 -18 11 -26 -41 -13 -84 25 -84 261 -376 404 -502 95 -83 222 -168 304 -205 98 -43 194 -73 242 -74 l46 -1 -45 -8 c-25 -5 -124 -21 -220 -36 -96 -15 -177 -29 -180 -31 -2 -2 0 -7 5 -11 27 -19 138 -144 123 -139 -18 6 -28 -10 -28 -47 0 -38 53 -108 141 -187 349 -313 631 -450 939 -453 63 0 131 2 150 7 19 4 -35 -17 -120 -46 -236 -82 -310 -110 -310 -117 0 -3 29 -28 65 -54 55 -40 102 -84 67 -62 -13 8 -32 -24 -32 -54 0 -99 486 -361 790 -426 125 -27 327 -25 444 4 113 28 261 98 309 145 39 40 56 92 38 124 -8 17 -4 24 29 49 22 16 40 32 40 36 0 4 -26 40 -58 80 -162 203 -368 328 -608 369 -89 15 -368 6 -474 -15 -131 -26 -147 -26 -59 -3 51 13 102 34 122 50 38 29 61 84 51 123 -5 18 1 26 25 39 17 8 31 19 31 23 0 4 -16 38 -35 75 -163 317 -424 501 -781 548 -113 15 -127 19 -91 30 51 14 84 58 89 118 1 20 9 33 20 37 23 7 23 6 -12 114 -108 329 -305 534 -640 662 -41 15 -59 25 -40 21 19 -5 82 -8 140 -8 81 0 113 4 142 18 39 20 73 76 65 107 -3 12 2 20 14 23 23 6 23 21 4 124 -61 320 -249 568 -544 718 -157 79 -394 147 -666 190 -88 13 -170 26 -182 29 -13 2 -23 2 -23 -1z"/><path d="M12550 5099 c-232 -36 -334 -55 -445 -84 -484 -122 -761 -346 -880 -712 -26 -79 -57 -242 -48 -255 2 -5 14 -8 26 -9 12 0 16 -3 10 -6 -17 -6 -16 -38 2 -72 25 -49 75 -66 200 -66 61 0 124 4 140 8 17 5 -13 -9 -66 -31 -136 -55 -250 -126 -341 -211 -128 -120 -217 -263 -272 -439 -32 -101 -32 -110 -3 -122 12 -5 17 -9 11 -9 -8 -1 -9 -12 -5 -34 15 -66 41 -95 94 -107 31 -7 31 -7 7 -12 -14 -3 -72 -13 -130 -22 -322 -51 -553 -206 -714 -479 -25 -42 -52 -92 -60 -111 -14 -33 -14 -33 23 -54 20 -12 31 -22 26 -22 -15 0 -17 -39 -4 -78 14 -42 76 -88 130 -97 22 -4 39 -9 36 -11 -2 -2 -55 3 -118 12 -154 22 -395 15 -494 -13 -216 -62 -391 -184 -545 -380 l-41 -52 40 -32 c34 -27 39 -35 30 -51 -17 -33 -1 -85 38 -125 48 -47 196 -117 309 -145 117 -29 319 -31 444 -4 300 64 790 328 790 425 0 29 -18 63 -31 56 -5 -4 -9 -4 -9 -2 0 3 34 29 75 59 41 29 75 56 75 59 0 3 -21 13 -47 22 -349 120 -422 146 -388 140 59 -12 241 -8 310 6 208 43 437 158 636 322 241 199 314 293 265 342 -13 12 -6 24 51 86 36 40 64 73 62 75 -4 2 -107 20 -359 60 -70 12 -77 14 -39 15 48 1 144 31 241 74 139 62 318 202 451 352 104 117 225 279 249 333 21 47 21 99 0 94 -16 -3 -10 9 58 116 l50 77 -72 3 c-91 4 -362 -14 -488 -33 -179 -26 -179 -26 -116 -9 93 26 244 120 365 230 193 174 467 605 443 696 -2 10 -8 15 -13 12 -12 -7 3 30 51 126 23 45 40 85 38 89 -2 4 -23 4 -48 0z"/><path d="M10242 4632 c-46 -140 -92 -319 -118 -457 -18 -94 -28 -519 -12 -509 4 3 5 -8 2 -25 -8 -40 21 -179 58 -274 75 -195 297 -437 400 -437 57 0 124 70 177 185 53 112 67 224 65 510 -1 120 -5 166 -23 233 -66 252 -206 515 -423 795 -39 51 -74 95 -77 99 -4 4 -26 -50 -49 -120z"/><path d="M2407 4612 c-305 -408 -443 -757 -422 -1067 3 -55 8 -140 10 -190 5 -113 30 -204 83 -293 44 -74 88 -118 128 -128 102 -26 339 218 422 433 34 87 67 235 58 258 -3 9 -1 39 5 68 5 28 10 117 10 197 1 155 -15 284 -57 455 -33 137 -117 405 -126 405 -5 0 -55 -62 -111 -138z"/><path d="M2970 3839 c-189 -385 -254 -632 -248 -941 2 -86 6 -151 10 -145 5 7 5 -2 2 -19 -19 -98 77 -354 181 -487 76 -96 141 -120 210 -77 70 43 195 240 239 375 20 63 46 197 40 207 -3 4 0 54 6 111 26 257 -51 553 -240 922 -42 83 -87 165 -98 184 l-21 35 -81 -165z"/><path d="M9711 3929 c-124 -219 -230 -466 -276 -642 -39 -151 -47 -234 -41 -426 7 -237 39 -357 136 -517 136 -225 233 -251 355 -97 94 121 171 313 181 453 2 36 8 111 13 167 26 288 -56 600 -266 1017 l-60 120 -42 -75z"/><path d="M3645 3278 c-2 -7 -14 -78 -27 -158 -19 -123 -22 -188 -23 -430 -2 -309 7 -401 50 -555 66 -232 204 -430 388 -552 120 -80 189 -70 245 34 36 69 74 205 78 283 1 30 5 109 9 175 9 135 -1 213 -41 339 -66 208 -198 406 -429 645 -147 152 -244 237 -250 219z"/><path d="M8994 3143 c-289 -284 -435 -492 -514 -732 -32 -100 -55 -261 -45 -330 3 -25 8 -91 10 -146 7 -168 66 -347 129 -387 77 -48 196 11 347 170 94 98 156 199 205 331 37 99 67 234 59 262 -4 11 -2 19 5 19 8 0 10 8 7 21 -3 11 1 77 10 147 10 89 13 172 9 277 -7 191 -48 515 -65 515 -3 0 -74 -66 -157 -147z"/><path d="M4501 2358 c52 -129 69 -179 59 -173 -6 4 -10 -12 -10 -42 0 -78 115 -313 252 -514 215 -317 529 -509 832 -509 124 0 166 27 180 112 1 11 8 23 15 27 10 7 11 27 2 98 -66 545 -401 836 -1164 1012 -97 23 -179 41 -182 41 -3 0 5 -24 16 -52z"/><path d="M8159 2375 c-609 -138 -940 -344 -1096 -683 -59 -127 -110 -377 -88 -429 5 -10 10 -29 12 -42 13 -75 59 -101 179 -101 316 0 625 196 854 543 110 165 222 395 228 465 3 40 2 53 -7 48 -11 -7 -3 15 53 153 28 68 31 81 19 80 -5 0 -74 -16 -154 -34z"/><path d="M4032 1479 c-193 -25 -435 -124 -667 -274 -108 -69 -314 -218 -315 -226 0 -4 28 -16 63 -29 66 -24 92 -40 65 -40 -10 0 -19 -12 -23 -30 -14 -65 45 -105 226 -154 572 -155 982 -93 1270 194 75 74 101 131 81 174 -9 21 -6 31 29 77 21 29 39 55 39 58 0 3 -25 24 -55 46 -229 167 -469 236 -713 204z"/><path d="M8513 1476 c-155 -30 -317 -101 -446 -196 l-67 -50 40 -54 c37 -49 40 -56 29 -80 -21 -46 4 -101 80 -176 288 -287 698 -349 1270 -194 180 49 240 89 226 153 -3 16 -14 31 -23 33 -9 2 18 18 61 35 l79 30 -126 92 c-304 223 -550 347 -780 395 -113 23 -257 28 -343 12z"/><path d="M6324 1249 c-48 -14 -120 -83 -139 -134 -13 -34 -16 -60 -11 -112 4 -37 6 -84 6 -103 -2 -95 62 -193 145 -220 138 -46 285 52 292 195 1 28 8 71 14 97 10 37 10 60 0 101 -31 139 -167 217 -307 176z"/><path d="M5255 1054 c-276 -46 -587 -227 -935 -541 l-54 -50 74 -23 c41 -13 67 -25 58 -27 -23 -6 -34 -48 -20 -78 16 -35 75 -61 188 -84 568 -115 968 -37 1250 243 69 69 110 130 114 171 5 42 0 66 -12 59 -12 -8 -12 -7 39 73 18 29 33 56 33 62 0 15 -49 46 -147 95 -207 104 -386 135 -588 100z"/><path d="M7249 1054 c-42 -7 -109 -25 -150 -40 -76 -27 -226 -101 -267 -133 l-24 -18 41 -66 c22 -37 36 -67 31 -67 -18 0 -11 -80 11 -121 11 -22 53 -73 92 -113 279 -282 682 -361 1251 -245 113 23 172 49 188 84 14 30 3 72 -20 77 -9 3 18 15 61 29 l78 24 -93 81 c-362 313 -622 460 -902 509 -106 18 -194 18 -297 -1z"/></g></svg>';
  }

  function getNextRankBar(id, percentage, color) {
    var width = Math.max(0, Math.min(1, percentage)) * 80;
    var safeId = sanitizeId(id);
    return (
      '<style>@keyframes ' +
      safeId +
      'RankAnimation{from{width:0px}to{width:' +
      width +
      'px}}#' +
      safeId +
      '-rank-progress{animation:' +
      safeId +
      'RankAnimation 1s forwards ease-in-out}</style><rect x="15" y="101" rx="1" width="80" height="3.2" opacity="0.3" fill="' +
      color +
      '"/><rect id="' +
      safeId +
      '-rank-progress" x="15" y="101" rx="1" height="3.2" fill="' +
      color +
      '"/>'
    );
  }

  function getSmallTrophyIcon(icon, color, count) {
    function renderAt(x) {
      return '<svg x="' + x + '" y="35" width="65" height="65" viewBox="0 0 30 30" fill="' + color + '" xmlns="http://www.w3.org/2000/svg">' + icon + "</svg>";
    }
    if (count === 1) return renderAt(68);
    if (count === 2) return renderAt(7) + renderAt(68);
    return "";
  }

  function getTrophyIcon(theme, rank) {
    var color = theme.DEFAULT_RANK_BASE;
    var rankColor = theme.DEFAULT_RANK_TEXT;
    var backgroundIcon = "";
    var gradationColor = '<stop offset="0%" stop-color="' +
      theme.DEFAULT_RANK_BASE +
      '"/><stop offset="50%" stop-color="' +
      theme.DEFAULT_RANK_BASE +
      '"/><stop offset="100%" stop-color="' +
      theme.DEFAULT_RANK_SHADOW +
      '"/>';
    if (rank === RANK.SECRET) {
      rankColor = theme.SECRET_RANK_TEXT;
      gradationColor = '<stop offset="0%" stop-color="' +
        theme.SECRET_RANK_1 +
        '"/><stop offset="50%" stop-color="' +
        theme.SECRET_RANK_2 +
        '"/><stop offset="100%" stop-color="' +
        theme.SECRET_RANK_3 +
        '"/>';
    } else if (String(rank).slice(0, 1) === "S") {
      color = theme.S_RANK_BASE;
      rankColor = theme.S_RANK_TEXT;
      backgroundIcon = leafIcon(theme.LAUREL);
      gradationColor = '<stop offset="0%" stop-color="' +
        color +
        '"/><stop offset="70%" stop-color="' +
        color +
        '"/><stop offset="100%" stop-color="' +
        theme.S_RANK_SHADOW +
        '"/>';
    } else if (String(rank).slice(0, 1) === "A") {
      color = theme.A_RANK_BASE;
      rankColor = theme.A_RANK_TEXT;
      backgroundIcon = leafIcon(theme.LAUREL);
      gradationColor = '<stop offset="0%" stop-color="' +
        color +
        '"/><stop offset="70%" stop-color="' +
        color +
        '"/><stop offset="100%" stop-color="' +
        theme.A_RANK_SHADOW +
        '"/>';
    } else if (rank === RANK.B) {
      color = theme.B_RANK_BASE;
      rankColor = theme.B_RANK_TEXT;
      gradationColor = '<stop offset="0%" stop-color="' +
        color +
        '"/><stop offset="70%" stop-color="' +
        color +
        '"/><stop offset="100%" stop-color="' +
        theme.B_RANK_SHADOW +
        '"/>';
    }
    var icon = '<path d="M7 10h2v4H7v-4z"/><path d="M10 11c0 .552-.895 1-2 1s-2-.448-2-1 .895-1 2-1 2 .448 2 1z"/><path fill-rule="evenodd" d="M12.5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3 2a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3 2a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/><path d="M3 1h10c-.495 3.467-.5 10-5 10S3.495 4.467 3 1zm0 15a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1H3zm2-1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1H5z"/><circle cx="8" cy="6" r="4" fill="' +
      theme.ICON_CIRCLE +
      '"/><text x="6" y="8" font-family="Courier, Monospace" font-size="7" fill="' +
      rankColor +
      '">' +
      escapeXml(String(rank).slice(0, 1)) +
      "</text>";
    var optionRankIcon = getSmallTrophyIcon(icon, color, String(rank).length - 1);
    return backgroundIcon +
      optionRankIcon +
      '<defs><linearGradient id="' +
      escapeXml(rank) +
      '" gradientTransform="rotate(45)">' +
      gradationColor +
      '</linearGradient></defs><svg x="28" y="20" width="100" height="100" viewBox="0 0 30 30" fill="url(#' +
      escapeXml(rank) +
      ')" xmlns="http://www.w3.org/2000/svg">' +
      icon +
      "</svg>";
  }

  function makeTrophy(def, score, info) {
    var rankConditions = def.rankConditions.slice().sort(function (a, b) {
      return RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank);
    });
    var rank = RANK.UNKNOWN;
    var rankCondition = null;
    var topMessage = "Нет ранга";
    for (var i = 0; i < rankConditions.length; i += 1) {
      if (score >= rankConditions[i].requiredScore) {
        rank = rankConditions[i].rank;
        rankCondition = rankConditions[i];
        topMessage = rankConditions[i].message;
        break;
      }
    }
    var bottomMessage = def.bottomMessage || (def.bottom ? def.bottom(score, info) : abridgeScore(score));
    return {
      title: def.title,
      hidden: !!def.hidden,
      filterTitles: Array.isArray(def.filterTitles) ? def.filterTitles.slice() : [def.title],
      rank: rank,
      score: score,
      topMessage: topMessage,
      bottomMessage: bottomMessage,
      rankCondition: rankCondition,
      rankConditions: rankConditions,
    };
  }

  function getNextRankPercentage(trophy) {
    if (!trophy || trophy.rank === RANK.UNKNOWN || trophy.rank === RANK.SECRET || !trophy.rankCondition) {
      return trophy && trophy.rank === RANK.SECRET ? 1 : 0;
    }
    var nextRankIndex = RANK_ORDER.indexOf(trophy.rank) - 1;
    if (nextRankIndex < 0 || trophy.rank === RANK.SSS) {
      return 1;
    }
    var nextRank = RANK_ORDER[nextRankIndex];
    var nextRankCondition = trophy.rankConditions.find(function (item) {
      return item.rank === nextRank;
    });
    if (!nextRankCondition) {
      return 1;
    }
    var distance = nextRankCondition.requiredScore - trophy.rankCondition.requiredScore;
    if (distance <= 0) {
      return 1;
    }
    var progress = trophy.score - trophy.rankCondition.requiredScore;
    return Math.max(0, Math.min(1, progress / distance));
  }

  function renderTrophy(trophy, theme, x, y, panelSize, noBackground, noFrame) {
    var id = sanitizeId(trophy.title + "-" + trophy.rank);
    return '<svg x="' +
      x +
      '" y="' +
      y +
      '" width="' +
      panelSize +
      '" height="' +
      panelSize +
      '" viewBox="0 0 ' +
      panelSize +
      " " +
      panelSize +
      '" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" rx="4.5" width="' +
      (panelSize - 1) +
      '" height="' +
      (panelSize - 1) +
      '" stroke="#e1e4e8" fill="' +
      theme.BACKGROUND +
      '" stroke-opacity="' +
      (noFrame ? "0" : "1") +
      '" fill-opacity="' +
      (noBackground ? "0" : "1") +
      '"/>' +
      getTrophyIcon(theme, trophy.rank) +
      '<text x="50%" y="18" text-anchor="middle" font-family="Segoe UI,Helvetica,Arial,sans-serif" font-weight="bold" font-size="13" fill="' +
      theme.TITLE +
      '">' +
      escapeXml(trophy.title) +
      '</text><text x="50%" y="85" text-anchor="middle" font-family="Segoe UI,Helvetica,Arial,sans-serif" font-weight="bold" font-size="10.5" fill="' +
      theme.TEXT +
      '">' +
      escapeXml(trophy.topMessage) +
      '</text><text x="50%" y="97" text-anchor="middle" font-family="Segoe UI,Helvetica,Arial,sans-serif" font-weight="bold" font-size="10" fill="' +
      theme.TEXT +
      '">' +
      escapeXml(trophy.bottomMessage) +
      "</text>" +
      getNextRankBar(id, getNextRankPercentage(trophy), theme.NEXT_RANK_BAR) +
      "</svg>";
  }

  function buildTrophies(info) {
    var base = [
      makeTrophy(TROPHY_DEFS.stars, info.totalStargazers, info),
      makeTrophy(TROPHY_DEFS.commits, info.totalCommits, info),
      makeTrophy(TROPHY_DEFS.followers, info.totalFollowers, info),
      makeTrophy(TROPHY_DEFS.issues, info.totalIssues, info),
      makeTrophy(TROPHY_DEFS.pullRequests, info.totalPullRequests, info),
      makeTrophy(TROPHY_DEFS.repositories, info.totalRepositories, info),
      makeTrophy(TROPHY_DEFS.reviews, info.totalReviews, info),
    ];
    var trophies = base.slice();
    if (base.every(function (item) { return String(item.rank).slice(0, 1) === "S"; })) {
      trophies.push(makeTrophy(TROPHY_DEFS.allSuperRank, 1, info));
    }
    trophies.push(
      makeTrophy(TROPHY_DEFS.languages, info.languageCount, info),
      makeTrophy(TROPHY_DEFS.longTime, info.durationYear, info),
      makeTrophy(TROPHY_DEFS.ancient, info.ancientAccount, info),
      makeTrophy(TROPHY_DEFS.og, info.ogAccount, info),
      makeTrophy(TROPHY_DEFS.joined2020, info.joined2020, info),
      makeTrophy(TROPHY_DEFS.organizations, info.totalOrganizations, info),
      makeTrophy(TROPHY_DEFS.experience, info.durationScore, info)
    );
    return trophies
      .filter(function (item) {
        return !item.hidden || item.rank !== RANK.UNKNOWN;
      })
      .sort(function (a, b) {
        return RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank);
      });
  }

  function renderCardSvg(info, options) {
    var theme = getTheme(options.theme);
    var trophies = buildTrophies(info);
    var column = numberOr(options.column, -1);
    var rowLimit = Math.max(1, numberOr(options.row, 1));
    var marginW = Math.max(0, numberOr(options.marginW, 8));
    var marginH = Math.max(0, numberOr(options.marginH, 8));
    var noBackground = !!options.noBackground;
    var noFrame = !!options.noFrame;
    var panelSize = PANEL_SIZE;
    if (column === -1) {
      column = Math.max(1, trophies.length);
    }
    var row = Math.min(rowLimit, Math.max(1, Math.floor((trophies.length - 1) / column) + 1));
    var width = panelSize * column + marginW * (column - 1);
    var height = panelSize * row + marginH * (row - 1);
    var body = trophies
      .slice(0, column * rowLimit)
      .map(function (trophy, index) {
        var currentColumn = index % column;
        var currentRow = Math.floor(index / column);
        return renderTrophy(
          trophy,
          theme,
          panelSize * currentColumn + marginW * currentColumn,
          panelSize * currentRow + marginH * currentRow,
          panelSize,
          noBackground,
          noFrame
        );
      })
      .join("");
    return '<svg width="' +
      width +
      '" height="' +
      height +
      '" viewBox="0 0 ' +
      width +
      " " +
      height +
      '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      body +
      "</svg>";
  }

  function getCardTitle(type, options) {
    return (options && options.customTitle) || LOCAL_GRAPH_TITLES[type] || "Карточка GitHub";
  }

  var CARD_FONT = "Segoe UI,Helvetica,Arial,sans-serif";

  function clampNumber(value, min, max) {
    var number = Number(value);
    if (!isFinite(number)) return min;
    return Math.max(min, Math.min(max, number));
  }

  function truncateText(value, maxLength) {
    var text = String(value == null ? "" : value);
    var safeLength = Math.max(4, maxLength || 24);
    if (text.length <= safeLength) return text;
    return text.slice(0, safeLength - 1) + "…";
  }

  function textLimitForWidth(width, averageCharWidth) {
    return Math.max(6, Math.floor(Math.max(0, width) / (averageCharWidth || 7)));
  }

  function cardText(x, y, text, size, weight, fill, extraAttrs) {
    return '<text x="' +
      Math.round(x) +
      '" y="' +
      Math.round(y) +
      '" font-family="' +
      CARD_FONT +
      '" font-size="' +
      size +
      '"' +
      (weight ? ' font-weight="' + weight + '"' : "") +
      ' fill="' +
      fill +
      '"' +
      (extraAttrs ? " " + extraAttrs : "") +
      ">" +
      escapeXml(text) +
      "</text>";
  }

  function cardShell(size, palette, hideBorder) {
    return '<rect x="0.5" y="0.5" width="' +
      (size.width - 1) +
      '" height="' +
      (size.height - 1) +
      '" rx="4.5" fill="' +
      palette.bg +
      '" stroke="' +
      palette.border +
      '" stroke-opacity="' +
      (hideBorder ? "0" : "0.45") +
      '"/>';
  }

  function normalizeThemeKey(name) {
    return String(name || "default").trim().toLowerCase().replace(/\s+/g, "-");
  }

  var CARD_THEME_PALETTES = {
    default: { bg: "#fffefe", title: "#2f80ed", text: "#434d58", border: "#e4e2e2", accent: "#2f80ed" },
    dark: { bg: "#151515", title: "#fff", text: "#9f9f9f", border: "#151515", accent: "#79ff97" },
    green: { bg: "#151515", title: "#79ff97", text: "#9f9f9f", border: "#151515", accent: "#79ff97", ring: "#f8f8f8", ringBg: "#3d3d3d", progressBg: "#333846" },
    "green-dark": { bg: "#151515", title: "#79ff97", text: "#9f9f9f", border: "#151515", accent: "#79ff97", ring: "#f8f8f8", ringBg: "#3d3d3d", progressBg: "#333846" },
    github_dark: { bg: "#0d1117", title: "#58a6ff", text: "#c9d1d9", border: "#30363d", accent: "#58a6ff" },
    "github-dark": { bg: "#0d1117", title: "#58a6ff", text: "#c9d1d9", border: "#30363d", accent: "#58a6ff" },
    dracula: { bg: "#282a36", title: "#ff79c6", text: "#f8f8f2", border: "#44475a", accent: "#ff79c6" },
    onedark: { bg: "#282c34", title: "#e4bf7a", text: "#abb2bf", border: "#282c34", accent: "#e06c75" },
    "one-dark": { bg: "#282c34", title: "#e4bf7a", text: "#abb2bf", border: "#282c34", accent: "#e06c75" },
    radical: { bg: "#141321", title: "#fe428e", text: "#a9fef7", border: "#141321", accent: "#fe428e" },
    tokyonight: { bg: "#1a1b27", title: "#70a5fd", text: "#38bdae", border: "#1a1b27", accent: "#70a5fd" },
    "tokyo-night": { bg: "#1a1b27", title: "#70a5fd", text: "#38bdae", border: "#1a1b27", accent: "#70a5fd" },
    gruvbox: { bg: "#282828", title: "#fabd2f", text: "#ebdbb2", border: "#282828", accent: "#fabd2f" },
    gruvbox_light: { bg: "#fbf1c7", title: "#b57614", text: "#3c3836", border: "#d5c4a1", accent: "#b57614" },
    "gruvbox-light": { bg: "#fbf1c7", title: "#b57614", text: "#3c3836", border: "#d5c4a1", accent: "#b57614" },
    cobalt: { bg: "#193549", title: "#ffc600", text: "#ffffff", border: "#193549", accent: "#ffc600" },
    synthwave: { bg: "#2b213a", title: "#e2e9ec", text: "#ef8539", border: "#2b213a", accent: "#e5289e" },
    highcontrast: { bg: "#000", title: "#e7f216", text: "#fff", border: "#000", accent: "#e7f216" },
    monokai: { bg: "#272822", title: "#eb1f6a", text: "#f1f1eb", border: "#272822", accent: "#eb1f6a" },
    prussian: { bg: "#172f45", title: "#bddfff", text: "#6e93b5", border: "#172f45", accent: "#bddfff" },
    "vue-dark": { bg: "#273849", title: "#41b883", text: "#fff", border: "#273849", accent: "#41b883" },
    "solarized-dark": { bg: "#002b36", title: "#268bd2", text: "#859900", border: "#073642", accent: "#b58900" },
    "solarized-light": { bg: "#fdf6e3", title: "#268bd2", text: "#586e75", border: "#eee8d5", accent: "#b58900" },
    nord: { bg: "#2e3440", title: "#88c0d0", text: "#d8dee9", border: "#4c566a", accent: "#88c0d0" },
    swift: { bg: "#151515", title: "#fff", text: "#9f9f9f", border: "#151515", accent: "#ff5a47" },
  };

  function isDarkThemeKey(key) {
    return /dark|night|dracula|onedark|radical|gruvbox|cobalt|synthwave|monokai|prussian|nord|gotham|palenight|mirage|purple|omni|outrun|panda|apprentice|darcula|bear/.test(key);
  }

  function mixPalette(base, theme) {
    var lightBackground = /^(#fff|#fffefe|#fbf1c7|#fdf6e3)$/i.test(base.bg);
    return {
      bg: base.bg,
      title: base.title,
      text: base.text,
      border: base.border,
      surface: base.text,
      muted: base.text,
      accent: base.accent,
      accent2: theme.A_RANK_BASE || base.accent,
      accent3: theme.B_RANK_BASE || base.accent,
      accent4: theme.S_RANK_BASE || base.accent,
      progressBg: base.progressBg || (lightBackground ? "#e6e8ef" : "#333846"),
      ring: base.ring || base.text,
      ringBg: base.ringBg || (lightBackground ? "#d8dce3" : "#3d3d3d"),
    };
  }

  function getCardSize(type, options) {
    options = options || {};
    var requestedWidth = numberOr(options.cardWidth, options.card_width || options.width || 360);
    var height = Math.max(130, numberOr(options.height, 150));
    if (type === "languages") {
      return {
        width: Math.max(360, requestedWidth),
        height: Math.max(195, height),
      };
    }
    if (type === "trophy") {
      return null;
    }
    if (type === "activity-graph") {
      return {
        width: Math.max(760, requestedWidth || 850),
        height: Math.max(240, numberOr(options.height, 300)),
      };
    }
    if (type === "streak") {
      return {
        width: 495,
        height: Math.max(195, height),
      };
    }
    return {
      width: 495,
      height: Math.max(195, height),
    };
  }

  function getCardThemeColors(theme, themeName) {
    var key = normalizeThemeKey(themeName);
    var base = CARD_THEME_PALETTES[key] || CARD_THEME_PALETTES[key.replace(/-/g, "_")];
    if (!base && isDarkThemeKey(key)) {
      base = CARD_THEME_PALETTES.dark;
    }
    if (!base) {
      base = {
        bg: theme.BACKGROUND,
        title: theme.TITLE,
        text: theme.TEXT,
        border: theme.DEFAULT_RANK_BASE,
        accent: theme.NEXT_RANK_BAR,
      };
    }
    return mixPalette(base, theme);
  }

  function getStatsRank(info) {
    var score =
      (Number(info.totalStargazers) || 0) * 2 +
      (Number(info.totalFollowers) || 0) * 4 +
      (Number(info.totalRepositories) || 0) * 3 +
      (Number(info.languageCount) || 0) * 5 +
      (Number(info.totalOrganizations) || 0) * 8;
    if (score >= 2000) return "SSS";
    if (score >= 1200) return "SS";
    if (score >= 700) return "S";
    if (score >= 400) return "AAA";
    if (score >= 220) return "AA";
    if (score >= 100) return "A";
    if (score >= 40) return "B";
    return "C";
  }

  function renderStatsCard(info, options) {
    options = options || {};
    var theme = getTheme(options.theme);
    var palette = getCardThemeColors(theme, options.theme);
    var size = getCardSize("stats", options);
    var hideBorder = !!options.hideBorder || !!options.noFrame;
    var hideTitle = !!options.hideTitle;
    var hideRank = !!options.hideRank;
    var title = options.customTitle || (options.username ? "Статистика GitHub @" + options.username : getCardTitle("stats", options));
    var rank = getStatsRank(info);
    var metrics = [
      { icon: "☆", label: "Всего звёзд:", value: formatGithubCount(info.totalStargazers) },
      { icon: "↻", label: "Коммитов за год:", value: formatGithubCount(info.totalCommits) },
      { icon: "⑂", label: "Pull requests:", value: formatGithubCount(info.totalPullRequests) },
      { icon: "ⓘ", label: "Issues:", value: formatGithubCount(info.totalIssues) },
      { icon: "▱", label: "Участие за год:", value: formatGithubCount(info.totalOrganizations) },
    ];
    var pad = 24;
    var titleLimit = textLimitForWidth(size.width - pad * 2, 8);
    var startY = hideTitle ? 42 : 64;
    var lineHeight = 26;
    var labelX = pad + 32;
    var rankX = size.width - 82;
    var radius = 43;
    var valueX = hideRank ? size.width - pad : rankX - radius - 34;
    var rankY = Math.round(size.height / 2);
    var dash = 216;
    var gap = 289 - dash;
    var cells = metrics
      .map(function (item, index) {
        var y = startY + index * lineHeight;
        var labelLimit = textLimitForWidth(valueX - labelX - 16, 7);
        return cardText(pad + 2, y, item.icon, 18, "700", palette.accent, 'dominant-baseline="middle" text-anchor="middle"') +
          cardText(labelX, y, truncateText(item.label, labelLimit), 14, "700", palette.text, 'dominant-baseline="middle"') +
          cardText(valueX, y, item.value, 14, "700", palette.text, 'dominant-baseline="middle" text-anchor="end"');
      })
      .join("");
    return '<svg width="' +
      size.width +
      '" height="' +
      size.height +
      '" viewBox="0 0 ' +
      size.width +
      " " +
      size.height +
      '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      cardShell(size, palette, hideBorder) +
      '<rect x="14" y="14" width="' +
      (size.width - 28) +
      '" height="' +
      (size.height - 28) +
      '" rx="12" fill="' +
      palette.surface +
      '" fill-opacity="0.035"/>' +
      (hideTitle
        ? ""
        : cardText(pad, 34, truncateText(title, titleLimit), 16, "700", palette.title)) +
      (hideRank
        ? ""
        : '<circle cx="' +
          rankX +
          '" cy="' +
          rankY +
          '" r="' +
          radius +
          '" stroke="' +
          palette.ringBg +
          '" stroke-width="6" fill="none"/><circle cx="' +
          rankX +
          '" cy="' +
          rankY +
          '" r="' +
          radius +
          '" stroke="' +
          palette.ring +
          '" stroke-width="6" stroke-linecap="round" stroke-dasharray="216 289" transform="rotate(-90 ' +
          rankX +
          " " +
          rankY +
          ')"/><circle cx="' +
          rankX +
          '" cy="' +
          rankY +
          '" r="3" fill="' +
          palette.ring +
          '" transform="rotate(' +
          (dash - gap) +
          " " +
          rankX +
          " " +
          rankY +
          ')"/><text x="' +
          rankX +
          '" y="' +
          (rankY + 8) +
          '" text-anchor="middle" font-family="' +
          CARD_FONT +
          '" font-size="24" font-weight="700" fill="' +
          palette.text +
          '">' +
          escapeXml(rank) +
          "</text>") +
      cells +
      "</svg>";
  }

  function getLanguageColor(name, index, palette) {
    var colors = {
      javascript: "#f1e05a",
      typescript: "#3178c6",
      python: "#3572a5",
      "c++": "#f34b7d",
      c: "#555555",
      "c#": "#178600",
      php: "#4f5d95",
      java: "#b07219",
      go: "#00add8",
      rust: "#dea584",
      swift: "#f05138",
      kotlin: "#a97bff",
      ruby: "#701516",
      html: "#e34c26",
      css: "#563d7c",
      vue: "#41b883",
      shell: "#89e051",
    };
    var fallback = [palette.accent, palette.accent2, palette.accent3, palette.accent4, palette.title];
    return colors[String(name || "").toLowerCase()] || fallback[index % fallback.length];
  }

  function renderLanguagesCard(info, options) {
    options = options || {};
    var theme = getTheme(options.theme);
    var palette = getCardThemeColors(theme, options.theme);
    var size = getCardSize("languages", options);
    var hideBorder = !!options.hideBorder || !!options.noFrame;
    var hideTitle = !!options.hideTitle;
    var title = getCardTitle("languages", options);
    var limit = Math.max(1, Math.min(8, numberOr(options.langsCount, options.langs_count || 5)));
    var items = (info.topLanguages || []).slice(0, limit);
    var total = items.reduce(function (sum, item) {
      return sum + item.count;
    }, 0) || 1;
    var pad = 24;
    var titleY = 34;
    var barY = hideTitle ? 36 : 66;
    var barWidth = size.width - pad * 2;
    var listTop = barY + 38;
    var rowHeight = 26;
    size.height = Math.max(size.height, listTop + Math.ceil(Math.max(1, items.length) / 2) * rowHeight + 24);
    var titleLimit = textLimitForWidth(size.width - pad * 2, 8);
    var clipId = "languageBarClip-" + sanitizeId((options.username || "user") + "-" + (options.theme || "theme"));
    var accumulated = 0;
    var stacked = items
      .map(function (item, index) {
        var count = Number(item.count) || 0;
        var percent = count / total;
        var width = index + 1 === items.length ? Math.max(0, barWidth - accumulated) : Math.max(1, Math.round(barWidth * percent));
        var x = pad + accumulated;
        accumulated += width;
        return '<rect x="' +
          x +
          '" y="' +
          barY +
          '" width="' +
          width +
          '" height="10" fill="' +
          getLanguageColor(item.name, index, palette) +
          '"/>';
      })
      .join("");
    var rows = items
      .map(function (item, index) {
        var column = index % 2;
        var row = Math.floor(index / 2);
        var columnWidth = Math.floor((size.width - pad * 2 - 18) / 2);
        var x = pad + column * (columnWidth + 18);
        var y = listTop + row * rowHeight;
        var count = Number(item.count) || 0;
        var percentText = ((count / total) * 100).toFixed(2) + "%";
        var color = getLanguageColor(item.name, index, palette);
        var nameLimit = textLimitForWidth(columnWidth - 96, 7);
        return '<circle cx="' +
          (x + 6) +
          '" cy="' +
          y +
          '" r="6" fill="' +
          color +
          '"/>' +
          cardText(x + 18, y + 1, truncateText(item.name, nameLimit), 12, "500", palette.text, 'dominant-baseline="middle"') +
          cardText(x + columnWidth, y + 1, percentText, 12, "700", palette.text, 'dominant-baseline="middle" text-anchor="end" opacity="0.92"');
      })
      .join("");
    return '<svg width="' +
      size.width +
      '" height="' +
      size.height +
      '" viewBox="0 0 ' +
      size.width +
      " " +
      size.height +
      '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      cardShell(size, palette, hideBorder) +
      '<rect x="14" y="14" width="' +
      (size.width - 28) +
      '" height="' +
      (size.height - 28) +
      '" rx="12" fill="' +
      palette.surface +
      '" fill-opacity="0.035"/>' +
      (hideTitle
        ? ""
        : cardText(pad, titleY, truncateText(title, titleLimit), 16, "700", palette.title)) +
      (items.length
        ? '<rect x="' +
          pad +
          '" y="' +
          barY +
           '" width="' +
           barWidth +
           '" height="10" rx="5" fill="' +
           palette.progressBg +
           '"/><defs><clipPath id="' +
           clipId +
           '"><rect x="' +
           pad +
           '" y="' +
           barY +
           '" width="' +
           barWidth +
           '" height="10" rx="5"/></clipPath></defs><g clip-path="url(#' +
           clipId +
           ')">' +
           stacked +
           "</g>" +
           rows
        : cardText(pad, hideTitle ? 42 : 72, "Не удалось собрать языки из публичных репозиториев.", 13, "", palette.text)) +
      "</svg>";
  }

  function renderStreakCard(info, options) {
    options = options || {};
    var theme = getTheme(options.theme);
    var palette = getCardThemeColors(theme, options.theme);
    var size = getCardSize("streak", options);
    var hideBorder = !!options.hideBorder || !!options.noFrame;
    var hideTitle = !!options.hideTitle;
    var title = getCardTitle("streak", options);
    var streak = info.recentActivity || { currentStreak: 0, longestStreak: 0, activeDays: 0, totalEvents: 0 };
    var pad = 24;
    var titleLimit = textLimitForWidth(size.width - pad * 2, 8);
    var centerX = Math.round(size.width / 2);
    var centerY = hideTitle ? 88 : 106;
    var ringRadius = 42;
    var current = Number(streak.currentStreak) || 0;
    var longest = Number(streak.longestStreak) || 0;
    var activeDays = Number(streak.activeDays) || 0;
    var totalEvents = Number(streak.totalEvents) || 0;
    var progress = longest > 0 ? Math.max(0.18, Math.min(1, current / longest)) : current > 0 ? 0.55 : 0.18;
    var circumference = Math.round(2 * Math.PI * ringRadius);
    var dash = Math.round(circumference * progress);
    var leftX = Math.round(size.width * 0.22);
    var rightX = Math.round(size.width * 0.78);
    var baseline = centerY + 72;
    var dividerTop = hideTitle ? 38 : 66;
    var dividerHeight = size.height - dividerTop - 24;
    var leftBlock =
      cardText(leftX, centerY - 6, formatGithubCount(totalEvents), 26, "700", palette.accent, 'text-anchor="middle"') +
      cardText(leftX, centerY + 30, "Всего вкладов", 12, "600", palette.title, 'text-anchor="middle" opacity="0.95"') +
      cardText(leftX, baseline, "Календарь GitHub", 11, "", palette.text, 'text-anchor="middle" opacity="0.82"');
    var centerBlock =
      '<circle cx="' +
      centerX +
      '" cy="' +
      centerY +
      '" r="' +
      ringRadius +
      '" stroke="' +
      palette.ringBg +
      '" stroke-width="7" fill="none"/><circle cx="' +
      centerX +
      '" cy="' +
      centerY +
      '" r="' +
      ringRadius +
      '" stroke="' +
      palette.accent +
      '" stroke-width="7" stroke-linecap="round" stroke-dasharray="' +
      dash +
      " " +
      circumference +
      '" transform="rotate(-90 ' +
      centerX +
      " " +
      centerY +
      ')"/>' +
      cardText(centerX, centerY + 10, formatGithubCount(current), 28, "700", palette.title, 'text-anchor="middle"') +
      cardText(centerX, centerY + 58, "Текущая серия", 12, "700", palette.accent2, 'text-anchor="middle"') +
      cardText(centerX, baseline, "Активных дней: " + formatGithubCount(activeDays), 11, "", palette.text, 'text-anchor="middle" opacity="0.82"');
    var rightBlock =
      cardText(rightX, centerY - 6, formatGithubCount(longest), 26, "700", palette.accent, 'text-anchor="middle"') +
      cardText(rightX, centerY + 30, "Лучшая серия", 12, "600", palette.title, 'text-anchor="middle" opacity="0.95"') +
      cardText(rightX, baseline, "за доступный период", 11, "", palette.text, 'text-anchor="middle" opacity="0.82"');
    return '<svg width="' +
      size.width +
      '" height="' +
      size.height +
      '" viewBox="0 0 ' +
      size.width +
      " " +
      size.height +
      '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      cardShell(size, palette, hideBorder) +
      '<rect x="14" y="14" width="' +
      (size.width - 28) +
      '" height="' +
      (size.height - 28) +
      '" rx="12" fill="' +
      palette.surface +
      '" fill-opacity="0.035"/>' +
      (hideTitle
        ? ""
        : cardText(pad, 34, truncateText(title, titleLimit), 20, "700", palette.title) +
          cardText(pad, 56, "По календарю вкладов GitHub", 12, "", palette.text, 'opacity="0.86"')) +
      '<line x1="' +
      Math.round(size.width * 0.36) +
      '" y1="' +
      dividerTop +
      '" x2="' +
      Math.round(size.width * 0.36) +
      '" y2="' +
      (dividerTop + dividerHeight) +
      '" stroke="' +
      palette.border +
      '" stroke-opacity="0.65"/><line x1="' +
      Math.round(size.width * 0.64) +
      '" y1="' +
      dividerTop +
      '" x2="' +
      Math.round(size.width * 0.64) +
      '" y2="' +
      (dividerTop + dividerHeight) +
      '" stroke="' +
      palette.border +
      '" stroke-opacity="0.65"/>' +
      leftBlock +
      centerBlock +
      rightBlock +
      "</svg>";
  }

  function renderActivityGraphCard(info, options) {
    options = options || {};
    var theme = getTheme(options.theme);
    var palette = getCardThemeColors(theme, options.theme);
    var size = getCardSize("activity-graph", options);
    var hideBorder = !!options.hideBorder || !!options.noFrame;
    var hideTitle = !!options.hideTitle;
    var radius = clampNumber(numberOr(options.radius, 16), 0, 32);
    var title = options.customTitle || (options.username ? "График активности @" + options.username : getCardTitle("activity-graph", options));
    var bgColor = hexColor(options.bgColor || options.bg_color, palette.bg);
    var textColor = hexColor(options.textColor || options.color, palette.text);
    var titleColor = hexColor(options.titleColor || options.title_color, palette.title);
    var lineColor = hexColor(options.lineColor || options.line, palette.accent2 || palette.accent);
    var pointColor = hexColor(options.pointColor || options.point, lineColor);
    var areaColor = hexColor(options.areaColor || options.area_color, lineColor);
    var borderColor = hexColor(options.borderColor || options.border_color, palette.border);
    var series =
      info && info.recentActivity && Array.isArray(info.recentActivity.activitySeries)
        ? info.recentActivity.activitySeries
        : [];
    if (!series.length) {
      var today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      for (var fallbackIndex = 30; fallbackIndex >= 0; fallbackIndex -= 1) {
        var fallbackDate = new Date(today.getTime() - fallbackIndex * 24 * 60 * 60 * 1000);
        series.push({ day: fallbackDate.getUTCDate(), count: 0 });
      }
    }
    var maxCount = series.reduce(function (max, item) {
      return Math.max(max, Number(item.count) || 0);
    }, 0);
    var step = maxCount > 1000 ? 500 : maxCount > 200 ? 100 : maxCount > 40 ? 20 : maxCount > 10 ? 5 : 1;
    var maxY = Math.max(step * 5, Math.ceil(maxCount / step) * step);
    var padLeft = 64;
    var padRight = 34;
    var padBottom = 44;
    var plotTop = hideTitle ? 26 : 58;
    var plotWidth = size.width - padLeft - padRight;
    var plotHeight = size.height - plotTop - padBottom;
    var plotBottom = plotTop + plotHeight;
    var xStep = series.length > 1 ? plotWidth / (series.length - 1) : plotWidth;
    var points = series.map(function (item, index) {
      var value = Number(item.count) || 0;
      return {
        x: padLeft + index * xStep,
        y: plotBottom - (value / maxY) * plotHeight,
        day: item.day,
        count: value,
      };
    });
    var pointPath = points
      .map(function (point, index) {
        return (index === 0 ? "M" : "L") + point.x.toFixed(1) + " " + point.y.toFixed(1);
      })
      .join(" ");
    var areaPath =
      pointPath +
      " L" +
      (padLeft + plotWidth).toFixed(1) +
      " " +
      plotBottom.toFixed(1) +
      " L" +
      padLeft.toFixed(1) +
      " " +
      plotBottom.toFixed(1) +
      " Z";
    var grid = "";
    for (var yIndex = 0; yIndex <= 5; yIndex += 1) {
      var y = plotBottom - (plotHeight / 5) * yIndex;
      var value = Math.round((maxY / 5) * yIndex);
      grid +=
        '<line x1="' +
        padLeft +
        '" y1="' +
        y.toFixed(1) +
        '" x2="' +
        (padLeft + plotWidth) +
        '" y2="' +
        y.toFixed(1) +
        '" stroke="' +
        textColor +
        '" stroke-opacity="0.18" stroke-dasharray="2 3"/>' +
        cardText(padLeft - 10, y + 4, String(value), 10, "700", textColor, 'text-anchor="end"');
    }
    for (var xIndex = 0; xIndex < series.length; xIndex += 1) {
      var x = padLeft + xIndex * xStep;
      grid +=
        '<line x1="' +
        x.toFixed(1) +
        '" y1="' +
        plotTop +
        '" x2="' +
        x.toFixed(1) +
        '" y2="' +
        plotBottom +
        '" stroke="' +
        textColor +
        '" stroke-opacity="' +
        (xIndex % 4 === 0 ? "0.18" : "0.08") +
        '" stroke-dasharray="2 3"/>';
    }
    var xLabels = points
      .map(function (point, index) {
        if (series.length > 24 && index % 2 !== 0) return "";
        return cardText(point.x, plotBottom + 18, point.day, 10, "700", textColor, 'text-anchor="middle"');
      })
      .join("");
    var dots = points
      .map(function (point) {
        return '<circle cx="' +
          point.x.toFixed(1) +
          '" cy="' +
          point.y.toFixed(1) +
          '" r="3.8" fill="' +
          pointColor +
          '" stroke="' +
          bgColor +
          '" stroke-width="1.5"/>';
      })
      .join("");
    return '<svg width="' +
      size.width +
      '" height="' +
      size.height +
      '" viewBox="0 0 ' +
      size.width +
      " " +
      size.height +
      '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="0.5" y="0.5" width="' +
      (size.width - 1) +
      '" height="' +
      (size.height - 1) +
      '" rx="' +
      radius +
      '" fill="' +
      bgColor +
      '" stroke="' +
      borderColor +
      '" stroke-opacity="' +
      (hideBorder ? "0" : "0.65") +
      '"/>' +
      (hideTitle
        ? ""
        : cardText(size.width / 2, 30, truncateText(title, textLimitForWidth(size.width - 80, 7)), 14, "700", titleColor, 'text-anchor="middle"')) +
      grid +
      (boolFrom(options.area)
        ? '<path d="' + areaPath + '" fill="' + areaColor + '" fill-opacity="0.20"/>'
        : "") +
      '<path d="' +
      pointPath +
      '" stroke="' +
      lineColor +
      '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      dots +
      cardText(20, plotTop + plotHeight / 2, "Вклады", 11, "700", textColor, 'text-anchor="middle" transform="rotate(-90 20 ' + (plotTop + plotHeight / 2).toFixed(1) + ')"') +
      cardText(size.width / 2, size.height - 12, "Дни", 11, "700", textColor, 'text-anchor="middle"') +
      xLabels +
      "</svg>";
  }

  function buildCardSvgByType(type, info, options) {
    if (type === "trophy") {
      return renderCardSvg(info, options);
    }
    if (type === "stats") {
      return renderStatsCard(info, options);
    }
    if (type === "languages") {
      return renderLanguagesCard(info, options);
    }
    if (type === "streak") {
      return renderStreakCard(info, options);
    }
    if (type === "activity-graph") {
      return renderActivityGraphCard(info, options);
    }
    throw new Error("Unsupported local graph type: " + type);
  }

  function getStorageKey(username) {
    return CACHE_PREFIX + String(username || "").toLowerCase();
  }

  function readCachedMetrics(username) {
    if (!username) return null;
    var key = getStorageKey(username);
    var memory = memoryMetrics.get(key);
    if (memory && Date.now() - memory.time < METRICS_TTL) {
      return memory.value;
    }
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || Date.now() - parsed.time >= METRICS_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      memoryMetrics.set(key, parsed);
      return parsed.value;
    } catch (_error) {
      return null;
    }
  }

  function writeCachedMetrics(username, value) {
    if (!username || !value) return;
    var entry = { time: Date.now(), value: value };
    var key = getStorageKey(username);
    memoryMetrics.set(key, entry);
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (_error) {

    }
  }

  async function fetchJson(url, extraHeaders) {
    var headers = Object.assign(
      {
        Accept: "application/vnd.github+json",
      },
      extraHeaders || {}
    );
    var response = await fetch(url, {
      headers: headers,
    });
    if (!response.ok) {
      throw new Error("GitHub API returned " + response.status + " for " + url);
    }
    return response.json();
  }

  async function fetchJsonResource(url) {
    var response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("JSON resource returned " + response.status + " for " + url);
    }
    return response.json();
  }

  async function fetchTextResource(url) {
    var response = await fetch(url, {
      headers: {
        Accept: "text/html",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Text resource returned " + response.status + " for " + url);
    }
    return response.text();
  }

  function htmlText(value) {
    return String(value || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  }

  function parseContributionCount(tooltip) {
    var text = htmlText(tooltip);
    if (/no contributions/i.test(text)) return 0;
    var match = text.match(/([\d,]+)\s+contribution/i);
    return match ? Math.max(0, parseInt(match[1].replace(/,/g, ""), 10) || 0) : 0;
  }

  function normalizeContributionDays(days) {
    if (!Array.isArray(days)) return [];
    var byDate = Object.create(null);
    days.forEach(function (day) {
      if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(String(day.date || ""))) return;
      byDate[String(day.date)] = Math.max(0, Number(day.count) || 0);
    });
    return Object.keys(byDate)
      .sort()
      .map(function (date) {
        return { date: date, count: byDate[date] };
      });
  }

  function parseGitHubContributionHtml(html) {
    var days = Object.create(null);
    var cellPattern = /<td\b(?=[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})")(?=[^>]*\bid="([^"]+)")[^>]*>[\s\S]*?<\/td>\s*<tool-tip\b(?=[^>]*\bfor="\2")[^>]*>([\s\S]*?)<\/tool-tip>/gi;
    var match;
    while ((match = cellPattern.exec(String(html || "")))) {
      days[match[1]] = parseContributionCount(match[3]);
    }
    if (!Object.keys(days).length) {
      var countPattern = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-count="(\d+)"/gi;
      while ((match = countPattern.exec(String(html || "")))) {
        days[match[1]] = Math.max(0, parseInt(match[2], 10) || 0);
      }
    }
    return normalizeContributionDays(
      Object.keys(days).map(function (date) {
        return { date: date, count: days[date] };
      })
    );
  }

  async function fetchContributionCalendar(username) {
    var encoded = encodeURIComponent(username);
    try {
      var serverResult = await fetchJsonResource("/api/github-contributions.php?username=" + encoded);
      var serverDays = normalizeContributionDays(serverResult && serverResult.days);
      if (serverDays.length) {
        return {
          source: "github-contributions",
          days: serverDays,
          total: Number(serverResult.total) || 0,
          activeDays: Number(serverResult.activeDays) || 0,
        };
      }
    } catch (_serverError) {

    }
    try {
      var html = await fetchTextResource("https://github.com/users/" + encoded + "/contributions");
      var directDays = parseGitHubContributionHtml(html);
      if (directDays.length) {
        return {
          source: "github-contributions",
          days: directDays,
        };
      }
    } catch (_directError) {

    }
    return null;
  }

  async function fetchSearchCount(type, query) {
    var baseUrl = type === "commits"
      ? "https://api.github.com/search/commits?q="
      : "https://api.github.com/search/issues?q=";
    var headers = type === "commits"
      ? { Accept: "application/vnd.github.cloak-preview+json" }
      : null;
    try {
      var result = await fetchJson(baseUrl + encodeURIComponent(query) + "&per_page=1", headers);
      return Number(result && result.total_count) || 0;
    } catch (_error) {
      return 0;
    }
  }

  async function fetchAllRepos(username, totalCount) {
    var pages = Math.max(1, Math.min(10, Math.ceil((Number(totalCount) || 0) / 100)));
    var repos = [];
    for (var page = 1; page <= pages; page += 1) {
      var batch = await fetchJson(
        "https://api.github.com/users/" +
          encodeURIComponent(username) +
          "/repos?per_page=100&page=" +
          page +
          "&sort=updated&type=owner"
      );
      if (!Array.isArray(batch) || batch.length === 0) {
        break;
      }
      repos = repos.concat(batch);
      if (batch.length < 100) {
        break;
      }
    }
    return repos;
  }

  async function fetchRecentEvents(username) {
    var events = [];
    for (var page = 1; page <= 3; page += 1) {
      var batch = await fetchJson(
        "https://api.github.com/users/" +
          encodeURIComponent(username) +
          "/events/public?per_page=100&page=" +
          page
      );
      if (!Array.isArray(batch) || batch.length === 0) {
        break;
      }
      events = events.concat(batch);
      if (batch.length < 100) {
        break;
      }
    }
    return events;
  }

  function getDateKey(value) {
    return new Date(value).toISOString().slice(0, 10);
  }

  function buildRecentActivityFromDayMap(countByDay, totalCount, source) {
    var dates = Array.from(countByDay.keys())
      .filter(function (key) {
        return (countByDay.get(key) || 0) > 0;
      })
      .sort();
    var longest = 0;
    var currentRun = 0;
    var previous = null;
    dates.forEach(function (key) {
      var time = new Date(key + "T00:00:00Z").getTime();
      if (previous !== null && time - previous === 24 * 60 * 60 * 1000) {
        currentRun += 1;
      } else {
        currentRun = 1;
      }
      if (currentRun > longest) {
        longest = currentRun;
      }
      previous = time;
    });
    var today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    var yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    var streakBase = countByDay.get(getDateKey(today)) > 0 ? today : countByDay.get(getDateKey(yesterday)) > 0 ? yesterday : null;
    var current = 0;
    while (streakBase) {
      var key = getDateKey(streakBase);
      if ((countByDay.get(key) || 0) <= 0) break;
      current += 1;
      streakBase = new Date(streakBase.getTime() - 24 * 60 * 60 * 1000);
    }
    var activitySeries = [];
    for (var dayIndex = 30; dayIndex >= 0; dayIndex -= 1) {
      var date = new Date(today.getTime() - dayIndex * 24 * 60 * 60 * 1000);
      var seriesKey = getDateKey(date);
      activitySeries.push({
        key: seriesKey,
        day: date.getUTCDate(),
        count: countByDay.get(seriesKey) || 0,
      });
    }
    return {
      currentStreak: current,
      longestStreak: longest,
      activeDays: dates.length,
      totalEvents: Math.max(0, Number(totalCount) || 0),
      lastActiveDate: dates.length ? dates[dates.length - 1] : null,
      activitySeries: activitySeries,
      source: source || "github-events",
    };
  }

  function buildRecentActivityFromContributions(contributions) {
    var days = normalizeContributionDays(contributions && contributions.days);
    var countByDay = new Map();
    var total = 0;
    days.forEach(function (day) {
      var count = Math.max(0, Number(day.count) || 0);
      countByDay.set(day.date, count);
      total += count;
    });
    return buildRecentActivityFromDayMap(countByDay, total, "github-contributions");
  }

  function buildRecentActivityFromEvents(events) {
    var countByDay = new Map();
    (events || []).forEach(function (event) {
      if (!event || !event.created_at) return;
      var key = getDateKey(event.created_at);
      countByDay.set(key, (countByDay.get(key) || 0) + 1);
    });
    return buildRecentActivityFromDayMap(countByDay, (events || []).length, "github-events");
  }

  function buildRecentActivity(activitySource) {
    if (activitySource && Array.isArray(activitySource.days) && activitySource.days.length) {
      return buildRecentActivityFromContributions(activitySource);
    }
    return buildRecentActivityFromEvents(activitySource);
  }

  function computeInfo(user, repos, orgs, activitySource, searches) {
    var languages = new Set();
    var languageCounts = Object.create(null);
    var totalStargazers = 0;
    var searchCounts = searches || {};
    repos.forEach(function (repo) {
      totalStargazers += Number(repo && repo.stargazers_count) || 0;
      if (repo && repo.language) {
        languages.add(repo.language);
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });
    var createdAt = new Date(user.created_at || Date.now());
    var durationTime = Math.max(0, Date.now() - createdAt.getTime());
    var durationDays = Math.floor(durationTime / (1000 * 60 * 60 * 24));
    var durationYear = Math.floor(durationDays / 365);
    var topLanguages = Object.keys(languageCounts)
      .map(function (name) {
        return { name: name, count: languageCounts[name] };
      })
      .sort(function (a, b) {
        return b.count - a.count;
      });
    var recentActivity = buildRecentActivity(activitySource);
    return {
      login: user.login || "",
      displayName: user.name || user.login || "",
      totalFollowing: Number(user.following) || 0,
      totalPublicGists: Number(user.public_gists) || 0,
      totalCommits: Number(searchCounts.commits) || 0,
      totalFollowers: Number(user.followers) || 0,
      totalIssues: Number(searchCounts.issues) || 0,
      totalPullRequests: Number(searchCounts.pullRequests) || 0,
      totalReviews: Number(searchCounts.reviews) || 0,
      totalStargazers: totalStargazers,
      totalRepositories: Number(user.public_repos) || repos.length || 0,
      totalOrganizations: Array.isArray(orgs) ? orgs.length : 0,
      languageCount: languages.size,
      topLanguages: topLanguages,
      recentActivity: recentActivity,
      durationYear: durationYear,
      durationScore: Math.floor(durationDays / 100),
      ancientAccount: createdAt.getFullYear() <= 2010 ? 1 : 0,
      joined2020: createdAt.getFullYear() === 2020 ? 1 : 0,
      ogAccount: createdAt.getFullYear() <= 2008 ? 1 : 0,
    };
  }

  async function getMetrics(username) {
    if (!username) {
      throw new Error("GitHub username is required");
    }
    var key = getStorageKey(username);
    var cached = readCachedMetrics(username);
    if (cached) {
      return cached;
    }
    if (memoryMetrics.has(key) && memoryMetrics.get(key).promise) {
      return memoryMetrics.get(key).promise;
    }
    var promise = (async function () {
      var user = await fetchJson("https://api.github.com/users/" + encodeURIComponent(username));
      var loaded = await Promise.all([
        fetchAllRepos(username, user.public_repos),
        fetchJson("https://api.github.com/users/" + encodeURIComponent(username) + "/orgs?per_page=100"),
        Promise.allSettled([fetchContributionCalendar(username), fetchRecentEvents(username)]),
      ]);
      var searchResults = await Promise.allSettled([
        fetchSearchCount("commits", "author:" + username),
        fetchSearchCount("issues", "author:" + username + " type:issue"),
        fetchSearchCount("issues", "author:" + username + " type:pr"),
        fetchSearchCount("issues", "reviewed-by:" + username + " type:pr"),
      ]);
      var repos = loaded[0];
      var orgs = loaded[1];
      var activityResults = loaded[2] || [];
      var contributions =
        activityResults[0] && activityResults[0].status === "fulfilled" && activityResults[0].value
          ? activityResults[0].value
          : null;
      var events =
        activityResults[1] && activityResults[1].status === "fulfilled" && Array.isArray(activityResults[1].value)
          ? activityResults[1].value
          : [];
      var activitySource = contributions && Array.isArray(contributions.days) && contributions.days.length ? contributions : events;
      var searches = {
        commits: searchResults[0].status === "fulfilled" ? searchResults[0].value : 0,
        issues: searchResults[1].status === "fulfilled" ? searchResults[1].value : 0,
        pullRequests: searchResults[2].status === "fulfilled" ? searchResults[2].value : 0,
        reviews: searchResults[3].status === "fulfilled" ? searchResults[3].value : 0,
      };
      var value = computeInfo(user, repos, orgs, activitySource, searches);
      writeCachedMetrics(username, value);
      return value;
    })();
    memoryMetrics.set(key, { promise: promise, time: Date.now() });
    try {
      return await promise;
    } finally {
      var ready = readCachedMetrics(username);
      if (ready) {
        memoryMetrics.set(key, { time: Date.now(), value: ready });
      }
    }
  }

  function normalizeOptions(options) {
    var normalized = options || {};
    return {
      type: normalized.type || normalized.cardType || normalized["data-prg-local-card"] || "trophy",
      username: normalized.username || normalized.user || "",
      theme: normalized.theme || "dracula",
      customTitle: normalized.customTitle || normalized.custom_title || "",
      height: numberOr(normalized.height, 150),
      hideTitle: boolFrom(normalized.hideTitle || normalized.hide_title),
      hideRank: boolFrom(normalized.hideRank || normalized.hide_rank),
      hideBorder: boolFrom(normalized.hideBorder || normalized.hide_border),
      cardWidth: numberOr(normalized.cardWidth, normalized.card_width || 320),
      langsCount: numberOr(normalized.langsCount, normalized.langs_count || 5),
      layout: normalized.layout || "compact",
      locale: normalized.locale || "ru",
      mode: normalized.mode || "daily",
      column: numberOr(normalized.column, -1),
      row: numberOr(normalized.row, 1),
      radius: numberOr(normalized.radius || normalized.border_radius, 16),
      area: boolFrom(normalized.area),
      align: normalizeAlign(normalized.align),
      bgColor: normalized.bgColor || normalized.bg_color || "",
      textColor: normalized.textColor || normalized.color || "",
      titleColor: normalized.titleColor || normalized.title_color || "",
      lineColor: normalized.lineColor || normalized.line || "",
      pointColor: normalized.pointColor || normalized.point || "",
      areaColor: normalized.areaColor || normalized.area_color || "",
      borderColor: normalized.borderColor || normalized.border_color || "",
      marginW: numberOr(normalized.marginW, normalized["margin-w"] || 8),
      marginH: numberOr(normalized.marginH, normalized["margin-h"] || 8),
      noBackground: boolFrom(normalized.noBackground || normalized["no-bg"]),
      noFrame: boolFrom(normalized.noFrame || normalized["no-frame"]),
    };
  }

  async function buildCardSvg(type, options) {
    var normalized = normalizeOptions(options);
    normalized.type = type || normalized.type || "trophy";
    var cacheKey = JSON.stringify(normalized);
    if (memorySvg.has(cacheKey)) {
      return memorySvg.get(cacheKey);
    }
    var promise = getMetrics(normalized.username).then(function (info) {
      return buildCardSvgByType(normalized.type, info, normalized);
    });
    memorySvg.set(cacheKey, promise);
    return promise;
  }

  async function buildSvg(options) {
    return buildCardSvg("trophy", options);
  }

  function getPlaceholderHtml(message, tone) {
    return (
      '<div class="prg-local-trophy-message" data-tone="' +
      tone +
      '">' +
      escapeXml(message) +
      "</div>"
    );
  }

  var enhanceQueued = false;

  function scheduleEnhance(root) {
    if (enhanceQueued) return;
    enhanceQueued = true;
    var runner = function () {
      enhanceQueued = false;
      enhance(root || document);
    };
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(runner);
      return;
    }
    setTimeout(runner, 0);
  }

  function ensureStyle() {
    if (document.getElementById("prg-local-trophy-style")) return;
    var style = document.createElement("style");
    style.id = "prg-local-trophy-style";
    style.textContent =
      ".prg-local-card-wrap{box-sizing:border-box;display:flex;max-width:100%;flex:0 1 auto;justify-content:center}" +
      '.prg-local-card-wrap[data-align="left"]{justify-content:flex-start}' +
      '.prg-local-card-wrap[data-align="right"]{justify-content:flex-end}' +
      '.prg-local-card-wrap[data-align="center"]{justify-content:center}' +
      '.prg-local-card-wrap[data-prg-local-card="stats"]{flex-basis:495px}' +
      '.prg-local-card-wrap[data-prg-local-card="languages"]{flex-basis:360px}' +
      '.prg-local-card-wrap[data-prg-local-card="streak"]{flex-basis:495px}' +
      '.prg-local-card-wrap[data-prg-local-card="trophy"],.prg-local-card-wrap[data-prg-local-card="activity-graph"]{flex:1 1 100%}' +
      ".prg-local-trophy-host{display:block;width:100%;min-height:110px}" +
      ".prg-local-trophy-host svg{display:block;max-width:100%;height:auto}" +
      ".prg-local-trophy-message{display:flex;align-items:center;justify-content:center;min-height:110px;padding:16px;border:1px dashed rgba(255,255,255,.12);border-radius:12px;color:var(--foreground, #c9d1d9);background:rgba(255,255,255,.03);text-align:center;font-size:14px;line-height:1.4}" +
      '.prg-local-trophy-message[data-tone="error"]{border-color:rgba(255,87,87,.35);color:#ffb3b3}' +
      '.prg-local-trophy-message[data-tone="info"]{border-color:rgba(120,180,255,.25)}';
    document.head.appendChild(style);
  }

  function elementOptions(node) {
    return normalizeOptions({
      type: node.getAttribute("data-prg-local-card") || (node.hasAttribute("data-prg-local-trophy") ? "trophy" : "trophy"),
      username: node.getAttribute("data-username"),
      theme: node.getAttribute("data-theme"),
      customTitle: node.getAttribute("data-custom-title"),
      height: node.getAttribute("data-height"),
      hideTitle: node.getAttribute("data-hide-title"),
      hideRank: node.getAttribute("data-hide-rank"),
      hideBorder: node.getAttribute("data-hide-border"),
      cardWidth: node.getAttribute("data-card-width"),
      langsCount: node.getAttribute("data-langs-count"),
      layout: node.getAttribute("data-layout"),
      locale: node.getAttribute("data-locale"),
      mode: node.getAttribute("data-mode"),
      column: node.getAttribute("data-column"),
      row: node.getAttribute("data-row"),
      radius: node.getAttribute("data-radius"),
      area: node.getAttribute("data-area"),
      align: node.getAttribute("data-align"),
      bgColor: node.getAttribute("data-bg-color"),
      textColor: node.getAttribute("data-color"),
      titleColor: node.getAttribute("data-title-color"),
      lineColor: node.getAttribute("data-line"),
      pointColor: node.getAttribute("data-point"),
      areaColor: node.getAttribute("data-area-color"),
      borderColor: node.getAttribute("data-border-color"),
      marginW: node.getAttribute("data-margin-w"),
      marginH: node.getAttribute("data-margin-h"),
      noBackground: node.getAttribute("data-no-bg"),
      noFrame: node.getAttribute("data-no-frame"),
    });
  }

  async function enhanceNode(node) {
    if (!node || node.nodeType !== 1) return;
    ensureStyle();
    var options = elementOptions(node);
    var renderKey = JSON.stringify(options);
    if (
      node.__prgTrophyRenderKey === renderKey &&
      (node.__prgTrophyRendered || node.__prgTrophyRendering)
    ) {
      return;
    }
    node.__prgTrophyRenderKey = renderKey;
    node.__prgTrophyRendered = false;
    node.__prgTrophyRendering = true;
    node.classList.add("prg-local-trophy-host");
    if (!options.username) {
      if (node.__prgTrophyTimer) {
        clearTimeout(node.__prgTrophyTimer);
        node.__prgTrophyTimer = null;
      }
      node.innerHTML = getPlaceholderHtml(
        "Укажите имя пользователя GitHub, чтобы построить " +
          (LOCAL_GRAPH_TITLES[options.type] || "карточку GitHub") +
          ".",
        "info"
      );
      node.__prgTrophyRendering = false;
      node.__prgTrophyRendered = true;
      return;
    }
    node.innerHTML = getPlaceholderHtml(
      options.type === "trophy"
        ? "Собираем трофеи из GitHub…"
        : "Собираем " + (LOCAL_GRAPH_TITLES[options.type] || "карточку GitHub") + "…",
      "info"
    );
    if (node.__prgTrophyTimer) {
      clearTimeout(node.__prgTrophyTimer);
    }
    node.__prgTrophyTimer = setTimeout(async function () {
      node.__prgTrophyTimer = null;
      if (node.__prgTrophyRenderKey !== renderKey) return;
      try {
        var svg = await buildCardSvg(options.type, options);
        if (node.__prgTrophyRenderKey !== renderKey) return;
        node.innerHTML = svg;
        node.__prgTrophyRendering = false;
        node.__prgTrophyRendered = true;
      } catch (error) {
        if (node.__prgTrophyRenderKey !== renderKey) return;
        node.innerHTML = getPlaceholderHtml(
          "Не удалось загрузить " +
            (LOCAL_GRAPH_TITLES[options.type] || "карточку GitHub") +
            " для @" +
            options.username +
            ". Проверьте имя пользователя и лимиты GitHub API.",
          "error"
        );
        node.__prgTrophyRendering = false;
        node.__prgTrophyRendered = true;
        node.setAttribute("title", error && error.message ? error.message : "GitHub API error");
      }
    }, 250);
  }

  function enhance(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll("[data-prg-local-trophy],[data-prg-local-card]").forEach(function (node) {
      void enhanceNode(node);
    });
  }

  function cloneTree(tree) {
    try {
      return JSON.parse(JSON.stringify(tree || []));
    } catch (_error) {
      return Array.isArray(tree) ? tree.slice() : [];
    }
  }

  function getVisibleLocalGraphConfigs(sections, settings) {
    var username = settings && settings.user && settings.user.github ? settings.user.github : "";
    if (!username || !Array.isArray(sections)) return null;
    var found = [];
    for (var i = 0; i < sections.length; i += 1) {
      var section = sections[i];
      var graphs = section && section.props && section.props.content && section.props.content.graphs;
      if (!graphs) continue;
      for (var j = 0; j < SUPPORTED_LOCAL_GRAPHS.length; j += 1) {
        var type = SUPPORTED_LOCAL_GRAPHS[j];
        var graph = graphs[type];
        if (graph && graph.show) {
          var options = normalizeOptions({
            type: type,
            username: username,
            theme: graph.theme,
            customTitle: graph.custom_title,
            height: graph.height,
            hideTitle: graph.hide_title,
            hideRank: graph.hide_rank,
            hideBorder: graph.hide_border,
            cardWidth: graph.card_width,
            langsCount: graph.langs_count,
            layout: graph.layout,
            locale: graph.locale,
            mode: graph.mode,
            column: graph.column,
            row: graph.row,
            radius: graph.radius || graph.border_radius,
            area: graph.area,
            align: graph.align,
            bgColor: graph.bg_color,
            textColor: graph.color,
            titleColor: graph.title_color,
            lineColor: graph.line,
            pointColor: graph.point,
            areaColor: graph.area_color,
            borderColor: graph.border_color,
            marginW: graph["margin-w"],
            marginH: graph["margin-h"],
            noBackground: graph["no-bg"],
            noFrame: graph["no-frame"],
          });
          found.push({
            type: type,
            assetName: getLocalAssetName(type, options),
            options: options,
          });
        }
      }
    }
    return found;
  }

  function getReadmeFile(tree) {
    for (var i = 0; i < tree.length; i += 1) {
      var item = tree[i];
      if (!item || !Array.isArray(item.files)) continue;
      for (var j = 0; j < item.files.length; j += 1) {
        if (item.files[j] && item.files[j].file === "README.md") {
          return item.files[j];
        }
      }
    }
    return null;
  }

  function upsertAssetFile(tree, name, content) {
    var folder = tree.find(function (item) {
      return item && item.name === "assets";
    });
    if (!folder) {
      folder = { name: "assets", files: [] };
      tree.push(folder);
    }
    folder.files = Array.isArray(folder.files) ? folder.files : [];
    var existing = folder.files.find(function (item) {
      return item && item.file === name;
    });
    if (existing) {
      existing.content = content;
      return;
    }
    folder.files.push({ file: name, content: content });
  }

  async function saveGeneratedAssets(files) {
    if (!Array.isArray(files) || !files.length || typeof fetch !== "function") {
      return { ok: false, saved: [] };
    }
    try {
      var response = await fetch("/api/save-generated-assets.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          assets: files.map(function (file) {
            return {
              name: file.name,
              content: file.content,
            };
          }),
        }),
      });
      if (!response.ok) {
        throw new Error("Asset save endpoint returned " + response.status);
      }
      return response.json();
    } catch (error) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Не удалось сохранить SVG на сервере. Файлы останутся в списке экспорта.", error);
      }
      return { ok: false, saved: [] };
    }
  }

  async function buildExportTree(tree, sections, settings) {
    var cloned = cloneTree(tree);
    var visibleConfigs = getVisibleLocalGraphConfigs(sections, settings);
    if (!visibleConfigs || !visibleConfigs.length) {
      return cloned;
    }
    var runtimeConfig = await getRuntimeConfig();
    function assetNameFor(type) {
      var config = visibleConfigs.find(function (item) {
        return item && item.type === type;
      });
      return config ? config.assetName : LOCAL_GRAPH_ASSETS[type];
    }
    var readme = getReadmeFile(cloned);
    if (readme && typeof readme.content === "string") {
      readme.content = readme.content.replace(
        /<img\s+src="[^"]*github-profile-trophy[^"]*"[^>]*alt="[^"]*Трофеи GitHub[^"]*"[^>]*>/g,
        localImageTag(runtimeConfig, assetNameFor("trophy"), "Трофеи GitHub")
      );
      readme.content = readme.content.replace(
        /(?:<img\s+src="https:\/\/img\.shields\.io\/badge\/dynamic\/json[^>]*>\s*){2,}/g,
        function (match) {
          return match.includes("Репозитории") || match.includes("%D0%A0%D0%B5%D0%BF%D0%BE%D0%B7%D0%B8%D1%82%D0%BE%D1%80%D0%B8%D0%B8")
            ? localImageTag(runtimeConfig, assetNameFor("trophy"), "Трофеи GitHub")
            : match;
        }
      );
      readme.content = readme.content.replace(
        /<img\s+src="[^"]*github-readme-stats\.vercel\.app\/api\/top-langs[^"]*"[^>]*alt="[^"]*Статистика языков[^"]*"[^>]*>/g,
        localImageTag(runtimeConfig, assetNameFor("languages"), "Статистика языков", 130)
      );
      readme.content = readme.content.replace(
        /<img\s+src="[^"]*github-readme-stats\.vercel\.app\/api(?!\/top-langs)[^"]*"[^>]*alt="[^"]*Статистика профиля[^"]*"[^>]*>/g,
        localImageTag(runtimeConfig, assetNameFor("stats"), "Статистика профиля", 130)
      );
      readme.content = readme.content.replace(
        /<img\s+src="[^"]*streak-stats\.demolab\.com\/[^"]*"[^>]*alt="[^"]*Серия активности[^"]*"[^>]*>/g,
        localImageTag(runtimeConfig, assetNameFor("streak"), "Серия активности", 130)
      );
      readme.content = readme.content.replace(
        /<img\s+src="[^"]*github-readme-activity-graph\.vercel\.app\/graph[^"]*"[^>]*alt="[^"]*График активности[^"]*"[^>]*>/g,
        localImageTag(runtimeConfig, assetNameFor("activity-graph"), "График активности", 300)
      );
      Object.keys(LOCAL_GRAPH_ASSETS).forEach(function (type) {
        var assetName = LOCAL_GRAPH_ASSETS[type];
        var alt = LOCAL_GRAPH_TITLES[type] || assetName;
        var height = type === "stats" || type === "languages" || type === "streak" ? 130 : type === "activity-graph" ? 300 : null;
        var absoluteTag = localImageTag(runtimeConfig, assetNameFor(type), alt, height);
        var assetSlug = assetName.replace(/\.svg$/i, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        readme.content = readme.content.replace(
          new RegExp('<img\\s+src="[^"]*assets\\/[^"]*' + assetSlug + '[^"]*\\.svg"[^>]*>', "g"),
          absoluteTag
        );
      });
    }
    var generatedAssets = [];
    for (var i = 0; i < visibleConfigs.length; i += 1) {
      var config = visibleConfigs[i];
      var svg = await buildCardSvg(config.type, config.options);
      upsertAssetFile(cloned, config.assetName, svg);
      generatedAssets.push({ name: config.assetName, content: svg });
    }
    await saveGeneratedAssets(generatedAssets);
    return cloned;
  }

  var api = {
    buildCardSvg: buildCardSvg,
    buildSvg: buildSvg,
    buildExportTree: buildExportTree,
    enhance: enhance,
  };

  window[GLOBAL_KEY] = api;

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        enhance(document);
      });
    } else {
      enhance(document);
    }
    var observer = new MutationObserver(function () {
      scheduleEnhance(document);
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "data-prg-local-card",
        "data-prg-local-trophy",
        "data-username",
        "data-theme",
        "data-custom-title",
        "data-height",
        "data-hide-title",
        "data-hide-rank",
        "data-hide-border",
        "data-card-width",
        "data-langs-count",
        "data-layout",
        "data-locale",
        "data-mode",
        "data-column",
        "data-row",
        "data-radius",
        "data-area",
        "data-align",
        "data-bg-color",
        "data-color",
        "data-title-color",
        "data-line",
        "data-point",
        "data-area-color",
        "data-border-color",
        "data-margin-w",
        "data-margin-h",
        "data-no-bg",
        "data-no-frame",
      ],
    });
  }
})();