---
title: "Introducing SubDownload — Summarize YouTube Videos Into Your AI Knowledge Base"
description: "SubDownload is live: paste any YouTube link, get a transcript and AI summary, then search and pipe it into Claude, ChatGPT, or Cursor — even for videos without captions."
date: 2026-04-28
categories: launch
---

This is the official launch post for **SubDownload** — a tool I've been building to make YouTube finally readable by your AI agents. If you've ever pasted a YouTube link into Claude or ChatGPT and watched it shrug, this is for you.

[**Open SubDownload →**](https://subdownload.com?utm_source=blog&utm_medium=launch_post)

YouTube is where a huge slice of the world's most useful knowledge lives — research talks, founder interviews, deep-dive tutorials, niche conference recordings. But that knowledge is locked inside video. Your notes app can't search it. Your AI agent can't read it. A 90-minute talk you watched last quarter is, for all practical purposes, gone.

SubDownload's job is to fix that. Paste a YouTube link, and you get:

1. A clean transcript — even for videos without captions.
2. An instant AI summary of what was actually said.
3. The whole thing saved to a personal, searchable knowledge base.

No queue. No upload. No signup for the basics.

## What's in the v1 launch

There are three pillars the product is designed around. They map directly to how a working builder actually wants to use long-form video.

### 1. Works with Claude, ChatGPT, Cursor & 40+ AI agents

The thing I wanted, that nothing else gave me: every transcript and summary should be one HTTP call away from whatever agent I happen to be using. SubDownload ships with three integration paths:

- **REST API** — Bearer auth, plain JSON, full OpenAPI 3.1 spec.
- **MCP server** at `api.subdownload.com/mcp` — connect Claude Desktop, Claude Code, or any MCP-aware client over OAuth or an API key.
- **Agent Skills** — install with `npx @subdown/skill@latest` and your agent learns the SubDownload toolset directly.

The point is that you stop copy-pasting transcripts into chat windows. Your agent fetches them on demand, the same way it would fetch a webpage.

### 2. Your personal YouTube thinking library

Every video you process gets filed into a Knowledge Base that you own. Tag it. Favorite it. Search across the full text of everything you've ever watched. That research talk you skimmed in March? Searchable. The founder interview you wanted to quote? One click to copy.

This is the half of the product I'm most opinionated about. I didn't want a chat tab where videos get dumped and vanish. I wanted a long-running, searchable record of the ideas I've decided are worth holding onto. Watching deserves to compound.

### 3. Instant Summary. Transcripts in seconds.

Paste link → summary appears. The transcript renders side-by-side with the player, with timestamps you can click to jump. One-click copy of the whole thing. Six export formats: txt, srt, vtt, csv, json, md.

The whole flow is built to take less time than it takes to scrub a YouTube video looking for "the part where they said the thing."

## The coverage edge: even videos without captions

Most YouTube transcript tools fall over when YouTube hasn't auto-generated captions, or when the creator turned them off. SubDownload runs an AI transcription layer that handles those videos too. So your knowledge base isn't artificially limited to whatever the platform decided to caption.

This is positioned as coverage, not a benchmark. The point isn't engine speed — the point is that no useful video gets locked out of your library because of a missing caption track.

## Built for: anyone who reads what they watch

A few audiences this was built for:

- **Researchers and students** — Skim hours of conference talks in minutes. Quote transcripts straight into your notes.
- **Content creators** — Turn long videos into outlines, blog posts, thread fodder, social clips.
- **Indie devs and AI tinkerers** — Wire up the MCP server, point your agent at a playlist, build something on top.
- **PKM folks** — Obsidian, Logseq, NotebookLM users who want a piece of the YouTube graph living outside YouTube.

Whichever camp you're in, the core promise is the same: less time hunting through videos, more time using what's inside them.

## Why I built this

I'm a solo dev, and I'm a heavy YouTube user. The honest answer for why SubDownload exists is in my own behavior:

- I'd watch a great talk, fail to take notes, and lose most of it within a week.
- I'd open Claude or Cursor for a research task and notice that my AI could read every blog, doc, and PDF I depended on — except YouTube.
- I'd waste real chunks of an evening scrubbing a two-hour stream looking for the eight minutes that actually mattered.

So I built the bridge. SubDownload is the version of YouTube I wanted: one where videos get faster to use, the good ones get saved, and the ones I love get the time they deserve.

## Try it

The fastest way to see it work is to paste a YouTube URL into the box on [subdownload.com](https://subdownload.com?utm_source=blog&utm_medium=launch_post). No account needed for the basics. If you're a developer, the API and MCP docs are linked from the same page.

If you build something on top of it, find a bug, or want to push back on a design decision — drop a note at **contact@subdownload.com**. I read everything.

This blog will keep the record: what's shipping, what's broken, what I'd do differently. Subscribe to the [RSS feed](/rss.xml), or check back in.

Welcome to SubDownload.

## What else to read

- [How to give Claude access to YouTube videos (via MCP)](/blog/claude-youtube-mcp/) — the developer setup walkthrough, end to end.
- [How to summarize a long YouTube video with AI](/blog/summarize-long-youtube-video-with-ai/) — the practical paste-link → summary → triage workflow.
- [How to build a personal YouTube knowledge base](/blog/youtube-knowledge-base/) — the PKM angle: turning what you watch into a searchable library that compounds.
- [FAQ](/faq/) — short answers to the questions that come up before you try it.
