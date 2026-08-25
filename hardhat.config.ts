import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const DEPLOYER_PRIVATE_KEY =
  process.env.DEPLOYER_PRIVATE_KEY ??
  // Well-known Hardhat default test key — funded only on local networks.
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const config: HardhatUserConfig = {
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  solidity: {
    version: "0.8.27",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    celoSepolia: {
      // Celo Sepolia testnet, chain ID 11142220.
      url: process.env.CELO_SEPOLIA_RPC_URL ?? "https://forno.celo-sepolia.celo-testnet.org",
      accounts: [DEPLOYER_PRIVATE_KEY],
      chainId: 11142220,
    },
    celo: {
      // Celo mainnet — production deployment only, see docs/DEPLOYMENT.md
      url: process.env.CELO_RPC_URL ?? "https://forno.celo.org",
      accounts: [DEPLOYER_PRIVATE_KEY],
      chainId: 42220,
    },
  },
  etherscan: {
    apiKey: {
      celoSepolia: process.env.CELOSCAN_API_KEY ?? "",
      celo: process.env.CELOSCAN_API_KEY ?? "",
    },
    customChains: [
      {
        network: "celoSepolia",
        chainId: 11142220,
        urls: {
          apiURL: "https://api-sepolia.celoscan.io/api",
          browserURL: "https://sepolia.celoscan.io",
        },
      },
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },
};

export default config;
