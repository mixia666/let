// main.ts — entrypoint for the make.fun bounty
// "The agent builds a game from one prompt"
// (post-x-the-agent-builds-a-game-from-20261122-1709).
//
// The entry itself is a post on X: the video of an AI coding agent building
// a tiny browser game from one prompt. The repository's only data file is
// POST.json, which names that post's address. This program's one job is to
// copy POST.json from the repository into the output directory, where the
// house reads the post and writes its own post.counts.json beside it.
//
// Runs on Node 22, standard library only, no network.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir =
  process.env.MAKEFUN_BOT_DIR ?? dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Fail loudly rather than hand the house a post file it cannot read:
// POST.json must be a small JSON object naming an X post's address.
const post = JSON.parse(readFileSync(join(repoDir, "POST.json"), "utf8"));
if (
  typeof post.url !== "string" ||
  !/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(post.url)
) {
  throw new Error(`POST.json does not name an X post: ${JSON.stringify(post)}`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(join(repoDir, "POST.json"), join(outDir, "POST.json"));
