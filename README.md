# Presenton Presentation Automation Suite

> **Developer Assessment Submission for ContentBeta**  
> An end-to-end presentation generation system based on the open-source [Presenton](https://github.com/presenton/presenton) project. Generates native 16:9 widescreen PowerPoint (`.pptx`) presentations via a **Modern Web Frontend**, an **n8n Workflow Automation**, and a **Model Context Protocol (MCP) Server**.

---

## 🌟 Highlights & Key Features

- 🎨 **5 Curated Design Themes**: `Modern Dark`, `Vibrant Neon`, `Executive Navy`, `Minimalist Clean`, and `Emerald Bio`.
- 📐 **6 Widescreen Slide Layouts**: `Title Cover`, `Key Stats & Metrics`, `Two Column Breakdown`, `Feature Grid (2x2)`, `Quote Callout`, and `Timeline / Process Flow`.
- 🤖 **Configurable AI Models & Local Static Engine**: Toggle between **⚡ Local Rule Engine** (fast, deterministic, offline) and **🤖 Live AI Models (Google Gemini & OpenAI)** via API Key or environment variables with automatic graceful fallback.
- 📊 **Native PowerPoint Export**: Generates genuine 16:9 `.pptx` presentation files compatible with Microsoft PowerPoint, Apple Keynote, and Google Slides.
- 🖥️ **Modern Web Frontend**: Dark glassmorphism interface with prompt studio, preset topic pills, theme swatches, AI settings panel, live 16:9 deck previewer, and inline slide text editing.
- ⚡ **n8n Workflow Automation**: Importable n8n workflow (`n8n/n8n_presentation_workflow.json`) for event-driven presentation generation via webhooks returning binary Base64 PPTX data.
- 🤖 **MCP Server Integration**: Stdio JSON-RPC MCP server compatible with Claude Desktop, ChatGPT, Cursor, Windsurf, and Antigravity.
- 🚀 **Zero-Friction Execution**: Runs 100% reliably out of the box without requiring paid external API keys or complex database setups.

---

## 🛠️ What We Used & Why (Tech Stack & Architecture)

| Technology | Purpose | Rationale & Trade-offs |
| :--- | :--- | :--- |
| **Node.js & Express** | Presentation Engine & REST API | Fast, asynchronous event-driven server providing instant JSON API responses without heavy web server overhead. |
| **`pptxgenjs` Engine** | 16:9 `.pptx` Renderer | Renders native vector shapes, stat cards, text boxes, and typography directly into PowerPoint `.pptx` binaries in memory—eliminating headless browser or database dependencies. |
| **Google Gemini & OpenAI REST Integration** | Live AI Inference | Direct HTTP REST calls to Gemini (`gemini-1.5-flash`) or OpenAI (`gpt-4o-mini`) using native `fetch` for rich content generation with zero heavy external SDK bloat. |
| **Model Context Protocol (`@modelcontextprotocol/sdk`)** | MCP Server Transport | Standardized JSON-RPC stdio transport allowing AI assistants (Claude, ChatGPT, Cursor) to discover tools and trigger slide generation directly from chat. |
| **Vanilla HTML5/CSS3/JS** | Web Frontend Previewer | Zero-framework dark glassmorphism web UI with live 16:9 slide rendering, thumbnail navigation, theme swatches, AI model settings, and inline content editing. |
| **n8n Automation Package** | Workflow Engine Integration | Modular HTTP/webhook workflow wrapper allowing non-technical teams to automate presentation generation from Slack bots, forms, or emails. |

---

## 💡 How This Project Is Different

Compared to standard presentation generation tools or the original multi-tier setup:

1. **Configurable AI Models with 100% Offline Fallback:** Easily switch between local rule generation and live AI inference (Gemini or OpenAI). If an invalid key is supplied or rate limits are hit, the system automatically falls back to local static mode without failing.
2. **Multi-Channel Interoperability:** A single presentation engine powers **three separate consumer channels** simultaneously: Web Browser UI, AI Agent Tool Calls (MCP), and Event-Driven Pipelines (n8n Webhooks).
3. **Native Vector `.pptx` Output (Not Static Images/PDFs):** Outputs genuine, fully editable PowerPoint files with selectable text, native vector card shapes, and formatted speaker notes.
4. **Live 16:9 Web Previewer with Inline Text Editing:** Allows users to preview slides in exact 16:9 proportions and tweak text live in the browser before exporting.

---

## ⚡ Quickstart & Setup Instructions

### Prerequisites
- **Node.js**: v18+ (tested on v26.4.0)
- **npm**: v9+ (tested on v11.17.0)

### 1. One-Click Launch (Recommended)

Run either command from the root directory:

```bash
# Option A: Using npm
npm start

# Option B: Using startup script directly
chmod +x start.sh
./start.sh
```

*This automatically checks for and frees port `5001`, installs backend & MCP dependencies, compiles TypeScript, and starts the server at **`http://localhost:5001`**.*

---

### 2. Manual Step-by-Step Setup

#### Step A: Launch Presentation Engine & Frontend UI
```bash
cd backend
npm install
npm start
```
- **Web Frontend**: Open [`http://localhost:5001`](http://localhost:5001) in your browser.
- **Backend API**: Listening at `http://localhost:5001/api`.

#### Step B: Testing AI Model vs. Local Static Mode
- **Local Static Mode (Default)**: Select **⚡ Local Rule Engine** in the UI dropdown or send `mode: "static"`. Zero external API keys needed.
- **Google Gemini Mode**: Select **🤖 Google Gemini AI**, enter your Gemini API Key (or set `GEMINI_API_KEY` in `.env`).
- **OpenAI Mode**: Select **🧠 OpenAI GPT**, enter your OpenAI API Key (or set `OPENAI_API_KEY` in `.env`).

#### Step C: Build & Test MCP Server
```bash
cd mcp-server
npm install
npm run build
node dist/index.js <<< '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

After setting up the MCP server, try asking your AI assistant:
> Use the presenton tool `generate_presentation` to generate a 5-slide PowerPoint presentation on "Artificial Intelligence in Healthcare" with theme "modern_dark".

#### Step D: Import n8n Workflow
1. Open n8n (e.g. `http://localhost:5678`).
2. Import [`n8n/n8n_presentation_workflow.json`](file:///Users/kt/workspace/presenton-automation/n8n/n8n_presentation_workflow.json).
3. Test using the webhook endpoint `http://localhost:5001/webhook/n8n-generate`.

---

## 📡 API Reference

### 1. Generate Presentation from Prompt
`POST /api/generate`

**Request Body:**
```json
{
  "prompt": "Artificial Intelligence in Healthcare",
  "theme": "modern_dark",
  "numSlides": 5,
  "mode": "ai",
  "provider": "gemini",
  "apiKey": "AIzaSy..."
}
```

**Response:**
```json
{
  "success": true,
  "presentationId": "presentation_1789198073824_yrvgc",
  "filename": "presentation_1789198073824_yrvgc.pptx",
  "downloadUrl": "http://localhost:5001/api/download/presentation_1789198073824_yrvgc.pptx",
  "summary": "Generated 5-slide presentation on \"Artificial Intelligence in Healthcare\"",
  "slideCount": 5,
  "generatorMeta": {
    "modeUsed": "ai",
    "provider": "gemini",
    "fallbackUsed": false,
    "fallbackReason": null
  },
  "presentation": { ... }
}
```

### 2. Generate from Custom Slide Outline JSON
`POST /api/generate-from-outline`

**Request Body:**
```json
{
  "theme": "vibrant_neon",
  "presentationTitle": "Custom Slide Outline Deck",
  "slides": [
    {
      "slideIndex": 1,
      "layout": "title_cover",
      "title": "Custom Title Cover",
      "subtitle": "Generated directly from JSON outline payload",
      "presenter": "Automation Engine",
      "accentBadge": "CUSTOM OUTLINE"
    }
  ]
}
```

### 3. Download PPTX File
`GET /api/download/:filename`

Returns the `.pptx` binary stream for direct browser download or disk saving.

### 4. n8n Event-Driven Webhook
`POST /webhook/n8n-generate`

Generates presentation and returns both `downloadUrl` and `binaryBase64` for seamless n8n binary node consumption.

---

## 🤖 MCP Integration (Claude Desktop, ChatGPT, Cursor & Antigravity)

### Available MCP Tools

| Tool | Parameters | Description |
| :--- | :--- | :--- |
| **`generate_presentation`** | `prompt` (required), `theme`, `num_slides`, `mode` (`auto`/`static`/`ai`), `provider` (`local`/`gemini`/`openai`), `apiKey` | Generates a 16:9 widescreen PowerPoint `.pptx` presentation deck and returns download link + slide outline. |
| **`list_presentation_themes`** | None | Returns the list of 5 available design themes and hex color palettes. |
| **`generate_from_outline`** | `outline` (JSON object), `theme` | Generates `.pptx` presentation directly from custom structured slide array JSON. |

### Claude Desktop / Cursor Configuration
Add the snippet to `claude_desktop_config.json` or Cursor MCP settings:

```json
{
  "mcpServers": {
    "presenton-presentation-automation": {
      "command": "node",
      "args": [
        "/Users/kt/workspace/presenton-automation/mcp-server/dist/index.js"
      ],
      "env": {
        "BACKEND_API_BASE": "http://localhost:5001"
      }
    }
  }
}
```

### Prompting AI Clients (Claude / ChatGPT / Cursor)
To trigger presentation generation via MCP, ask your AI assistant:

> Use the presenton tool `generate_presentation` to generate a 5-slide PowerPoint presentation on "Artificial Intelligence in Healthcare" with theme "modern_dark" and mode "ai".

---

## 🚀 How We Can Expand It Further (Future Roadmap)

1. 🖼️ **Dynamic AI Image Generation & Lucide Vector Icons:**
   - Integrating Gemini Imagen / DALL-E 3 API to auto-generate slide background graphics, illustrations, and contextual icon vectors.
2. 📄 **PDF & Google Slides Sync:**
   - Server-side conversion from `.pptx` to `.pdf` via headless LibreOffice and direct Google Drive API upload sync.
3. 📊 **Live Database & Spreadsheet Automation:**
   - Expanding n8n workflows to automatically generate weekly executive decks from Google Sheets, Airtable, or SQL queries.
4. 🎨 **Custom Brand Kit Uploader:**
   - Allowing organizations to upload custom fonts (`.otf`/`.ttf`), brand color hex palettes, and corporate logo assets for automatic header/footer branding.
5. 💬 **Real-time Slide Collaboration & Comments:**
   - Websocket-based multi-user slide tweaking with instant live preview updates across sessions.

---

## 📜 Repository Structure & Additional Docs

- [`WORKFLOW.md`](file:///Users/kt/workspace/presenton-automation/WORKFLOW.md): Detailed step-by-step system execution sequence diagrams and channel workflows.
- [`ARCHITECTURE.md`](file:///Users/kt/workspace/presenton-automation/ARCHITECTURE.md): Technical trade-offs, slide layout specs, and system design.


