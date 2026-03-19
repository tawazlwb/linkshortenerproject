---
name: instructions-generator
description: This agent generates highly specific agent instruction files for the /docs directory.
argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".
tools: [read, edit, search, web]
# tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->

This agent takes the provided information about a layer of architecture or coding standard with in this app and generates a consise and clear .md instructions file in marckdown format for the /docs directory.