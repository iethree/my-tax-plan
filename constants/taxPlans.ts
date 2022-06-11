import { TaxScheme } from "@/types/taxTypes";
import jsonRates from "../data/rates.json";
const defaultRates: TaxScheme = JSON.parse(JSON.stringify(jsonRates));

// eslint-disable-next-line
const emojis = ["😂","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","🐵","🐮","🐩","🐎","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🚲","🍉","💛","💚"]

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

export const newPlan = () =>
  JSON.parse(
    JSON.stringify({
      id: new Date().getTime(),
      user_id: null,
      title: `My ${randomEmoji()} Tax Plan`,
      description: "",
      scheme: defaultRates,
      created_at: "",
    })
  );

export const classThresholds = {
  working: {
    min: 0,
    max: 35000,
  },
  middle: {
    min: 35001,
    max: 120000,
  },
  upper: {
    min: 120001,
    max: 600000,
  },
  "top 1%": {
    min: 600001,
    max: 3200000,
  },
  "top 0.1%": {
    min: 3200001,
    max: Infinity,
  },
};
