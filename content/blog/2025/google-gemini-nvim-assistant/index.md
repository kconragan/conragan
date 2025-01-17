---
draft: true
date: 2025-01-13T11:42:40-08:00
title: "Google Gemini: My Neovim Configuration Assistant"
slug: "google-gemini-nvim-assistant"
---

I love Vim. And while I'm a fan of its infinite customizability, I'm not a fan of having to remember every syntax and config parameter.

I ran into a simple problem today: when using [Telescope](https://github.com/nvim-telescope/telescope.nvim) to find a file, I kept seeing repeated filenames in my tree (e.g., in this Hugo site, numerous files are duplicated between `/content` and `/docs`). This made it tough to know which file to choose. I wanted Telescope to show me the full pathname in order to help disambiguate the files. Easy enough, I assumed, but I don't know Telescope and NeoVim's syntax well enough to implement this without resorting to Google and clicking through some links. But then I remembered that Gemini now lets you [upload code folders](https://blog.google/products/gemini/google-gemini-learning-features/) and I thought, _why not just upload my entire NeoVim config and ask Gemini?_

I went to [gemini.google.com](https://gemini.google.com/) and started a new chat with the Gemini Advanced 1.5 Pro model. One of the cool things about this model is that you can upload code for it to analyze and use as context for your session. I simply uploaded my entire `~/.config/nvim/` directory and asked:

> When I use `<leader>ff`, how can I make it so I see the full pathnames to better disambiguate files? Please give me the exact code snippet and file and line number to add it to.

Gemini's response:

> To see full pathnames when using `<leader>ff` to disambiguate files, you need to modify your Telescope configuration. Here's how:
>
> File: `nvim/lua/kai/plugins/telescope.lua`
>
> Line Number: 7
>
> Original Code:
>
> ```lua
> path_display = { "smart" }
> ```
>
> Modified Code:
>
> ```lua
> path_display = { "absolute" }
> ```
>
> Explanation:
>
> The `path_display` setting in Telescope controls how file paths are displayed in the picker. By changing it to `"absolute"`, you'll see the full path for each file, making it easier to distinguish between files with the same name in different directories.

This simple interaction saved me a ton of time, and it really highlights the potential of LLMs as collaborative "agents." (To clarify, "agent behavior" in this context refers to the ability of an AI to act autonomously and complete tasks with minimal human intervention.) Simon Willison recently published his [AI/LLM predictions for the next 1, 3, and 6 years](https://simonwillison.net/2025/Jan/10/ai-predictions/), and while he's generally bearish on the idea of fully autonomous "agents" in the near term, he does see potential in two key areas: coding assistants and research assistants. My experience with Gemini perfectly illustrates this. While it wasn't exhibiting full-blown agent behavior, it demonstrated the impressive reasoning capabilities of current LLMs and their ability to be incredibly helpful with specific, well-defined tasks right now. This, to me, is a glimpse into the future of how we'll work alongside these powerful tools.
