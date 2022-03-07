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
