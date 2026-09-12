# Presentation Automation - Loom / Demo Video Walkthrough Guide

This document provides a step-by-step video script and walkthrough demonstration guide for presenting the completed **Presentation Automation** project.

---

## 🎬 Video Recording Outline (Total: ~3-4 Minutes)

### Section 1: Introduction & System Architecture (0:00 - 0:45)
- **Goal**: Introduce the project and explain how we analyzed the `presenton/presenton` open-source repository and rebuilt it into a multi-channel presentation automation suite.
- **Key Points to Mention**:
  - Rebuilt core slide generation logic into a high-performance Node.js presentation engine.
  - Native 16:9 `.pptx` PowerPoint file rendering using custom themes and 6 structured slide layouts.
  - 3 integration surfaces: Web Frontend UI, n8n Workflow Automation, and Model Context Protocol (MCP) Server.

---

### Section 2: Web Frontend UI Walkthrough (0:45 - 1:45)
- **Action**: Open `http://localhost:5001/` in the browser.
- **Steps to Show**:
  1. **Prompt Studio**: Click on a preset pill e.g., `"🏥 AI Healthcare"` or type `"AI in Healthcare - Diagnostics & Machine Learning"`.
  2. **Controls**: Change the theme to `"Vibrant Neon"` or `"Executive Navy"`, and adjust slide count to `5 Slides`.
  3. **Generate**: Click **Generate Presentation**.
  4. **Live 16:9 Deck Previewer**:
     - Click through slide thumbnails on the left sidebar (`Title Cover`, `Key Metrics`, `Two Column`, `Feature Grid`, `Roadmap`).
     - Highlight the inline text editing feature: click on a slide title or subtitle and edit text live.
  5. **Download**: Click **Download PPTX** to download the genuine `.pptx` file. Open the downloaded presentation in PowerPoint/Keynote to show native vector shapes and layout formatting.

---

### Section 3: n8n Workflow Automation (1:45 - 2:30)
- **Action**: Show `n8n/n8n_presentation_workflow.json` or run a cURL trigger against `http://localhost:5001/webhook/n8n-generate`.
- **Steps to Show**:
  1. Explain the 4-node flow: `Webhook Trigger` ➔ `Prepare Payload` ➔ `PPTX Generator Engine` ➔ `Respond to Webhook`.
  2. Run the cURL command:
     ```bash
     curl -X POST http://localhost:5001/webhook/n8n-generate \
       -H "Content-Type: application/json" \
       -d '{"prompt": "SaaS Product Growth 2026", "theme": "modern_dark", "numSlides": 5}'
     ```
  3. Show the JSON response containing the direct download URL, presentation ID, and base64 binary presentation payload.

---

### Section 4: MCP Server Integration (2:30 - 3:15)
- **Action**: Show `mcp-server/dist/index.js` and `claude_desktop_config.json`.
- **Steps to Show**:
  1. Show `tools/list` RPC execution:
     ```bash
     cd mcp-server && node dist/index.js <<< '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
     ```
  2. Point out the 3 registered MCP tools: `generate_presentation`, `list_presentation_themes`, `generate_from_outline`.
  3. Explain how Claude Desktop or ChatGPT uses this tool to take conversational user prompts and return downloadable presentation links automatically.

---

### Section 5: Conclusion & Architecture Trade-offs (3:15 - 3:45)
- **Key Takeaways**:
  - Fast, modular architecture eliminating heavy database overhead while preserving native `.pptx` output.
  - 100% out-of-the-box reliability.
  - Clean repository setup with automated build and startup scripts.
