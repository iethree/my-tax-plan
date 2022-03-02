import { expect } from "chai";
import { encode, decode } from "./hash";

describe("hash utils", () => {
  it("encodes a numerical id to a string hash", () => {
    expect(encode(8675309)).to.equal("pljqglx");
    expect(encode(1)).to.equal("aejb");
    expect(encode(2)).to.equal("bgpa");
  });

  it("decodes a string hash to a numerical id", () => {
    expect(decode("pljqglx")).to.equal(8675309);
    expect(decode("aejb")).to.equal(1);
    expect(decode("bgpa")).to.equal(2);
  });
});
