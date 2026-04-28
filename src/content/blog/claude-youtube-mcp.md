---
title: "How to Give Claude Access to YouTube Videos (via MCP)"
description: "Claude can't watch YouTube on its own. Here's how to give it transcripts, summaries, and channel search using an MCP server — connected to Claude Desktop in a few minutes."
date: 2026-04-28
categories: guide
---

Claude is a strong reading and reasoning partner. It will happily summarize a 40-page PDF, traverse a GitHub repo, or pull facts from a webpage you paste in. But ask it to watch a YouTube video, and it shrugs. The model can't open the player. It can't read the captions. It can't tell you what the speaker said in the third hour of a livestream.

This post walks through the cleanest way I've found to fix that — connecting Claude to YouTube through an [MCP](https://modelcontextprotocol.io/) server. The specific server I'll use is [SubDownload's](https://subdownload.com?utm_source=blog&utm_medium=guide_mcp), because that's what I built; the pattern works for any compatible MCP YouTube server you'd rather use.

> New to MCP? The short explainer is in [What is MCP (and why YouTube needs one)](/blog/what-is-mcp/). This post assumes you know what an MCP server is and want to get one talking to Claude.

## Why Claude can't read YouTube

Claude — the model itself — works on text. It doesn't have a built-in browser, it doesn't run audio decoders, and YouTube doesn't give third parties a clean transcript API for arbitrary videos. The captions you see in the YouTube player are accessible to Google, but not generally to your AI client unless something else fetches and processes them first.

So if you want Claude to engage with YouTube content, *something else* has to:

1. Resolve the video URL into a transcript.
2. Fall back to AI transcription when no captions exist.
3. Hand the result back to Claude in a form the model can read.

That "something else" is exactly what an MCP server is for.

## What MCP gives you

MCP — the Model Context Protocol — is the spec that lets a Claude client (Claude Desktop, Claude Code, Cursor, and a growing list of others) call out to an external tool. The client talks to the server. The server does the work — fetch a transcript, search a channel, return JSON. Claude reads the result and reasons over it like any other context.

Three properties of MCP that matter for the YouTube use case:

- **No browser tab dance.** You don't paste video URLs into a chat box. You ask Claude a question, and Claude calls the MCP tool itself.
- **Multi-step, agentic workflows.** Claude can search a channel, pick three videos, fetch their transcripts, and synthesize across them — one prompt, no manual scrubbing.
- **Reusable across clients.** The same MCP server works for Claude Desktop, Claude Code, Cursor, and any other MCP-aware host. One install, all your agents.

## Connecting SubDownload's MCP server to Claude Desktop

Concretely: SubDownload exposes an MCP server at `api.subdownload.com/mcp`. To plug it into Claude Desktop:

1. Sign in once at [subdownload.com](https://subdownload.com?utm_source=blog&utm_medium=guide_mcp) and grab an API key (or use OAuth — the server supports OAuth 2.1 with Dynamic Client Registration via RFC 7591).
2. Open Claude Desktop's settings → MCP servers, and add a new server entry pointing at `https://api.subdownload.com/mcp`. Authenticate with the API key or run through the OAuth flow.
3. Restart Claude Desktop. The SubDownload tools — fetch transcript, list channel videos, search a channel, fetch metadata — show up in the tool list.

I'm intentionally not pasting a JSON config block here. The exact field names in MCP client configs change every couple of releases, and any snippet I publish will be subtly wrong by the time you read this. Use Claude Desktop's current MCP setup docs for the canonical format.

The same idea applies for Claude Code, Cursor, and other MCP-aware clients. The endpoint and the auth are the same; the UI you click through is different.

## What you can ask Claude once it's connected

This is the part that pays for the setup. A few prompts I use weekly:

- **"Summarize this YouTube video for me — paste of URL — and give me a timestamped outline of the main arguments."** Claude calls the transcript tool, reads the result, returns a structured outline. I decide which sections are worth a real watch.
- **"Find the part of this 90-minute interview where they talk about pricing and quote what they said exactly."** Full-text search inside a long transcript, with quoted spans. No scrubbing.
- **"Look at the last ten videos on this channel and tell me which two are most relevant to my current project."** Multi-video reasoning — Claude lists, fetches metadata or excerpts, and ranks.
- **"Compare what these three founder interviews say about hiring early engineers."** Cross-video synthesis across separate transcripts in one prompt.

Each of these would be a 30-minute scrubbing job by hand. With MCP, they're a single message.

## Edge cases the server handles

A few things worth knowing about the SubDownload MCP server specifically:

- **Videos without captions.** YouTube doesn't auto-caption every video. Loom recordings, fresh uploads, niche channels, conference talks where the speaker disabled captions — they often have no transcript track. The server runs an AI transcription layer to handle those cases, so Claude gets text either way.
- **Channels and playlists.** The same server exposes channel-level and playlist-level tools. Claude can ask "what are the most recent videos on this channel" without you having to dig in YouTube first.
- **Multiple export formats.** Behind MCP, the same backend serves txt, srt, vtt, csv, json, and md transcripts. Useful if you want to pipe transcripts somewhere else later.

## Other paths: REST API and Agent Skills

If you don't want to set up MCP, the same backend is reachable two other ways:

- **REST API** — Bearer auth, plain JSON, full OpenAPI 3.1 spec. Good for scripts and automations outside an agent loop.
- **Agent Skills** — `npx @subdown/skill@latest`. Installs a Skill bundle that Claude can call from inside Claude Code or Claude Desktop without manual MCP wiring.

MCP is the most flexible path. Skills is the easiest. REST is the lowest-level. Pick whichever fits your stack.

## Try it

Step zero is just confirming the backend works for the videos you actually care about. The simplest way to test is to paste a YouTube URL into the box on [subdownload.com](https://subdownload.com?utm_source=blog&utm_medium=guide_mcp) and watch the transcript and summary come back. If it works there, the same backend serves the MCP tools.

If you want the broader story behind the product — the three pillars and why I led with the knowledge-base half — that's in the [launch announcement](/blog/introducing-subdownload/).

If you build something on top of the MCP server, find a bug, or want to argue about the design, ping me at **contact@subdownload.com**.
