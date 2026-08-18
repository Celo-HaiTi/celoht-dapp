import { expect } from "chai";
import {
  validateTransferInput,
  formatCurrency,
  isLikelyCeloAddress,
} from "../lib/demo-wallet.ts";

describe("CeloHT demo wallet utilities", function () {
  it("accepts valid transfer input for CELO and USDm", function () {
    expect(
      validateTransferInput({
        asset: "CELO",
        amount: "2.5",
        recipient: "0x1234567890123456789012345678901234567890",
        balance: 5,
        isConnected: true,
        wrongNetwork: false,
      }),
    ).to.deep.equal({ valid: true, error: null });

    expect(
      validateTransferInput({
        asset: "USDm",
        amount: "0.5",
        recipient: "0x1234567890123456789012345678901234567890",
        balance: 1,
        isConnected: true,
        wrongNetwork: false,
      }),
    ).to.deep.equal({ valid: true, error: null });
  });

  it("rejects invalid addresses and insufficient balances", function () {
    expect(
      validateTransferInput({
        asset: "CELO",
        amount: "10",
        recipient: "0x1234",
        balance: 5,
        isConnected: true,
        wrongNetwork: false,
      }),
    ).to.deep.equal({ valid: false, error: "Enter a valid recipient wallet address." });

    expect(
      validateTransferInput({
        asset: "USDm",
        amount: "5",
        recipient: "0x1234567890123456789012345678901234567890",
        balance: 2,
        isConnected: true,
        wrongNetwork: false,
      }),
    ).to.deep.equal({ valid: false, error: "Insufficient USDm balance." });
  });

  it("formats monetary values consistently for the UI", function () {
    expect(formatCurrency(1234.56)).to.equal("$1,234.56");
    expect(formatCurrency(0.5)).to.equal("$0.50");
  });

  it("recognizes valid Celo addresses", function () {
    expect(isLikelyCeloAddress("0x1234567890123456789012345678901234567890")).to.equal(true);
    expect(isLikelyCeloAddress("not-an-address")).to.equal(false);
  });
});
