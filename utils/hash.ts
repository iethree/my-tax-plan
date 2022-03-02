import Hashids from "hashids";
const hashids = new Hashids("", 4, "abcdefghijklmnopqrstuvwxyz");

export const encode = (id: number): string => {
  const encoded = hashids.encode(id);

  if (encoded.length === 0) return "";
  return encoded as string;
};

export const decode = (hash: string): number => {
  const decoded = hashids.decode(hash);

  if (decoded.length === 0) return 0;
  return decoded[0] as number;
};
