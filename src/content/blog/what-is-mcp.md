---
title: "What Is MCP (Model Context Protocol) — and Why YouTube Needs One"
description: "MCP is the protocol that lets Claude and other AI agents talk to external tools. Here's what it is, why it matters, and why YouTube specifically needs an MCP server."
date: 2026-04-28
categories: explainer
---

If you've spent any time around Claude in the last six months, you've probably bumped into the acronym MCP. It shows up in Claude Desktop's settings, in agent framework docs, in Show HN posts. People talk about it like it's a foregone conclusion — *of course* you have an MCP server for that.

If you haven't worked through what MCP actually is, that's confusing. This post is the explainer I wish existed when I started building [SubDownload](https://subdownload.com?utm_source=blog&utm_medium=explainer_mcp): what MCP is, what it isn't, and why YouTube specifically is the kind of source that desperately needs one.

## MCP, in one paragraph

MCP — the [Model Context Protocol](https://modelcontextprotocol.io/) — is a specification for how an AI client (Claude Desktop, Claude Code, Cursor, and a growing list of others) talks to external tools and data sources. Instead of every AI app shipping its own ad-hoc plugin system, MCP defines a standard way for the *client* (the thing you talk to) to discover and call into a *server* (the thing that knows how to do something — fetch a transcript, query a database, search a codebase).

The model itself doesn't change. Claude is still Claude. What changes is what Claude can *reach*: any tool that speaks MCP becomes available, the same way a webpage becomes available to a browser.

## What MCP is not

A few common misreadings worth clearing up:

- **MCP is not a model.** It's a protocol. There's no "MCP AI." Models like Claude *use* MCP to call tools.
- **MCP is not an LLM API.** It's not how you call Claude — that's still the regular Anthropic API. MCP is how Claude (the client app) calls *other* services.
- **MCP is not a Claude-only thing,** even though Anthropic shipped it. Other clients implement it. The protocol is open and growing.
- **MCP is not a replacement for plugins or RAG.** It's a layer beneath them. You can implement plugins or RAG-like flows on top of MCP servers.

## What MCP gives you, practically

Three properties that matter for anyone trying to extend an AI agent's reach:

- **Discoverability.** A client connects to a server, asks "what can you do?", and gets back a list of tools with structured schemas. The client now knows how to call them.
- **Standardized auth.** MCP supports OAuth 2.1 with Dynamic Client Registration (RFC 7591), API keys, and other credential flows. The user authenticates once; the agent uses the credentials silently after that.
- **Cross-client portability.** The same MCP server works for Claude Desktop, Claude Code, Cursor, and any future MCP-aware host. You don't write a Cursor plugin AND a Claude Desktop plugin — you write one MCP server.

The net effect: the wall between "what your AI agent can do" and "what your tools can do" gets thinner. Any system you can wrap in an MCP server becomes part of the agent's accessible context.

## Why YouTube is a hard case for AI agents

Now flip the question: why does YouTube specifically need an MCP server?

Because YouTube is one of the largest knowledge sources on the internet, and it's effectively invisible to a vanilla AI agent.

Think about the channels by which Claude reads inputs today:

- **Webpages** — Claude can read text-based pages directly when given access (browser tools, fetch tools, etc.).
- **PDFs and docs** — first-class support in Claude's UI; uploadable, summarizable.
- **Code** — Claude Code reads your repo natively.
- **APIs** — anything with an HTTP API is reachable through tool use.

Now look at YouTube:

- The video itself is a binary stream the model can't decode.
- Captions, when they exist, aren't behind a public API for arbitrary videos.
- Auto-captions are missing from a non-trivial slice of useful content (live talks where captions were disabled, Loom recordings, conference uploads from small channels, fresh content).
- Even if you could fetch a transcript, you'd want summaries, channel-level metadata, and search across multiple videos — none of which YouTube exposes in a useful way to a third party.

So a vanilla Claude can read every blog, every PDF, and every doc you depend on, then go silent the moment your input is on YouTube. Without an MCP server (or some other equivalent bridge), there's no way to fix this from the client side.

## What an MCP server for YouTube looks like

This is the gap I built [SubDownload](https://subdownload.com?utm_source=blog&utm_medium=explainer_mcp) to fill. The MCP server at `api.subdownload.com/mcp` exposes a tool surface roughly like:

- `fetch_transcript(url)` — get a clean transcript for any YouTube video, with AI transcription fallback when no captions exist.
- `summarize(url)` — get an AI summary with a structured outline.
- `list_channel_videos(channel_url)` — page through a channel's catalog.
- `search_channel(channel_url, query)` — find which video on a channel discusses a given topic.

Once the MCP server is connected, Claude doesn't need YouTube to be "supported" — it just calls the tools. The agent sees video content as normal text-shaped context, the same way it would see a fetched webpage.

The setup walkthrough is in [How to give Claude access to YouTube videos (via MCP)](/blog/claude-youtube-mcp/). The OAuth flow uses standard MCP auth, so Claude Desktop, Claude Code, Cursor, and other MCP-aware clients all work without separate plumbing per client.

## The non-MCP paths (when MCP isn't the right fit)

Not every workflow needs MCP. Two other paths reach the same backend:

- **REST API + OpenAPI 3.1 spec** — for scripts, agents written in your own framework, or non-MCP AI clients. Bearer auth, plain JSON. Good for daily-digest jobs, Discord bots, custom integrations.
- **Agent Skills** — `npx @subdown/skill@latest` installs a Skill bundle that Claude can call from inside Claude Code or Claude Desktop without manual MCP wiring. Easier setup, less flexibility than raw MCP.

The decision tree is: if you're using Claude Desktop / Claude Code / Cursor and want video tools to "just be there," use MCP. If you're scripting, use the REST API. If you want one-command install over MCP, use Skills.

## Where this is going

The interesting thing about MCP is that it makes "AI agent reads X" composable in a way it wasn't before. Anyone can stand up an MCP server for the data source they care about — your CRM, your wiki, your video library, your inbox — and any MCP-aware client suddenly has access. We're still early in the curve where most data sources don't have MCP servers; that's the gap that gets closed over the next few years.

YouTube is a useful first case because so much working knowledge is locked there, and it's one of the few large sources without a clean third-party text API. SubDownload's job is to close that specific gap.

## Try it

Paste any YouTube link into [subdownload.com](https://subdownload.com?utm_source=blog&utm_medium=explainer_mcp) — the basic transcript and summary work without an account. For the MCP integration, see [How to give Claude access to YouTube videos](/blog/claude-youtube-mcp/), or the broader [launch announcement](/blog/introducing-subdownload/) for the full product picture.

If you're building an MCP server of your own and want to compare notes, ping me at **contact@subdownload.com**.
