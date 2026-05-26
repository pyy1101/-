export const ADSENSE_ENABLED = true;

export const ADSTERRA_TOP = `atOptions = {'key':'cf1b663b00c8ff37e1ef479c73a076ca','format':'iframe','height':90,'width':728,'params':{}};`;
export const ADSTERRA_TOP_SRC = "https://www.highperformanceformat.com/cf1b663b00c8ff37e1ef479c73a076ca/invoke.js";

// 300x250 sidebar ad - get from Adsterra dashboard
export const ADSTERRA_SIDEBAR = `atOptions = {'key':'cf1b663b00c8ff37e1ef479c73a076ca','format':'iframe','height':250,'width':300,'params':{}};`;
export const ADSTERRA_SIDEBAR_SRC = "https://www.highperformanceformat.com/cf1b663b00c8ff37e1ef479c73a076ca/invoke.js";

export const AD_SLOTS = {
  top: "top",
  sidebar: "sidebar",
  bottom: "bottom",
} as const;
