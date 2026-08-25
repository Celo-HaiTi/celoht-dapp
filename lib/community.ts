export type CommunityChannel = {
  platform: string;
  title: string;
  detail: string;
  url: string;
};

function verifiedUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

const configuredChannels: Array<{
  platform: string;
  title: string;
  detail: string;
  env: string | undefined;
}> = [
  {
    platform: "GitHub",
    title: "CeloHT organization",
    detail: "Public project updates and open community resources.",
    env: process.env.COMMUNITY_GITHUB_URL,
  },
  {
    platform: "Discord",
    title: "CeloHT community",
    detail: "Community conversation and collaboration.",
    env: process.env.COMMUNITY_DISCORD_URL,
  },
  {
    platform: "Telegram",
    title: "CeloHT community",
    detail: "Community and agent coordination.",
    env: process.env.COMMUNITY_TELEGRAM_URL,
  },
  {
    platform: "LinkedIn",
    title: "CeloHT page",
    detail: "Professional updates and partnership news.",
    env: process.env.COMMUNITY_LINKEDIN_URL,
  },
];

export const communityChannels: CommunityChannel[] = configuredChannels.flatMap((channel) => {
  const url = verifiedUrl(channel.env);
  return url ? [{ platform: channel.platform, title: channel.title, detail: channel.detail, url }] : [];
});

export const unconfiguredCommunityPlatforms = [
  "Facebook",
  "Instagram",
  "X",
  "Medium",
];
