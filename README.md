# WorldAnvil Exporter

A web application that converts narrative larp character sheets written in World Anvil into HTML with CSS that produces professional quality pdfs when printed in browser, supporting multiple games with distinct visual themes and formatting needs.

## Overview

Grimmoire Productions authors detailed character sheets for their lit-form live-action role playing games (larps) in World Anvil -- a world-building platform that is, essentially, an extremely fancy wiki. These World Anvil character sheets are distributed to players as PDFs ahead of the game and in print on site. 

However, using the browser's print-to-PDF functionality directly from World Anvil has significant limitations:

- Limited CSS customization within World Anvil
- Articles include internal links and writer-focused content not intended for players
- Default formatting doesn't meet the production quality standards needed for player handouts

This exporter tool solves these problems by:

- Fetching character sheet content via [the World Anvil API](https://www.worldanvil.com/api/external/boromir/swagger-documentation#/)
- Converting BBCode formatting into html
- Removing internal links and World-Anvil specific content that would be amiss on a printed sheet
- Generating clean, print-ready exports suitable for players
- Applying custom, world-specific themes and formatting

## Features

- **Secure Authentication**: Staff log in with their World Anvil credentials
- **Article Search**: Find and preview character sheets and articles
- **Custom Theming**: Each game world (Hawkins, Lies & Liability) has its own visual style
- **Clean Exports**: Generate formatted content without internal links or writer notes
- **Print-Ready Output**: Exports are optimized for printing via browser print-to-PDF

## Supported Games

- [Lies & Liability](https://www.worldanvil.com/w/lies-26-liability-grimmoireproductions/)
- [Hawkins](https://www.worldanvil.com/w/hawkins-grimmoireproductions)

**Note:** These World Anvil wikis (aka "worlds") are private, and not visible to the general public. Generally developers do not need perms to view these World Anvil sites, however if a situation arises in which you do:

1. Create a free World Anvil account (if you don't have one already)
2. Ask Kelsey to add your World Anvil user to the `staff` subscriber group(s) for the wiki(s) you need to view.

## Get Started

New to local development? Start here: [./docs/newToDevelopment.md](./docs/newToDevelopment.md)

### [Local Development](./docs/localDev.md)