# Presenton Presentation Automation Suite

> **Developer Assessment Submission for ContentBeta**  
> An end-to-end presentation generation system based on the open-source [Presenton](https://github.com/presenton/presenton) project. Generates native 16:9 widescreen PowerPoint (`.pptx`) presentations via a **Modern Web Frontend**, an **n8n Workflow Automation**, and a **Model Context Protocol (MCP) Server**.

---

## 🌟 Highlights & Key Features

- 🎨 **5 Curated Design Themes**: `Modern Dark`, `Vibrant Neon`, `Executive Navy`, `Minimalist Clean`, and `Emerald Bio`.
- 📐 **6 Widescreen Slide Layouts**: `Title Cover`, `Key Stats & Metrics`, `Two Column Breakdown`, `Feature Grid (2x2)`, `Quote Callout`, and `Timeline / Process Flow`.
- 📊 **Native PowerPoint Export**: Generates genuine 16:9 `.pptx` presentation files compatible with Microsoft PowerPoint, Apple Keynote, and Google Slides.
- 🖥️ **Modern Web Frontend**: Dark glassmorphism interface with prompt studio, preset topic pills, theme swatches, live 16:9 deck previewer, and inline slide text editing.
- ⚡ **n8n Workflow Automation**: Importable n8n workflow (`n8n/n8n_presentation_workflow.json`) for event-driven presentation generation via webhooks returning binary Base64 PPTX data.
- 🤖 **MCP Server Integration**: Stdio JSON-RPC MCP server compatible with Claude Desktop, ChatGPT, Cursor, Windsurf, and Antigravity.
- 🚀 **Zero-Friction Execution**: Runs 100% reliably out of the box without requiring paid external API keys or complex database setups.

---

## 🛠️ What We Used & Why (Tech Stack & Architecture)

| Technology | Purpose | Rationale & Trade-offs |
| :--- | :--- | :--- |
| **Node.js & Express** | Presentation Engine & REST API | Fast, asynchronous event-driven server providing instant JSON API responses without heavy web server overhead. |
| **`pptxgenjs` Engine** | 16:9 `.pptx` Renderer | Renders native vector shapes, stat cards, text boxes, and typography directly into PowerPoint `.pptx` binaries in memory—eliminating headless browser or database dependencies. |
| **Model Context Protocol (`@modelcontextprotocol/sdk`)** | MCP Server Transport | Standardized JSON-RPC stdio transport allowing AI assistants (Claude, ChatGPT, Cursor) to discover tools and trigger slide generation directly from chat. |
| **Vanilla HTML5/CSS3/JS** | Web Frontend Previewer | Zero-framework dark glassmorphism web UI with live 16:9 slide rendering, thumbnail navigation, theme swatches, and inline content editing. |
| **n8n Automation Package** | Workflow Engine Integration | Modular HTTP/webhook workflow wrapper allowing non-technical teams to automate presentation generation from Slack bots, forms, or emails. |

---

## 💡 How This Project Is Different

Compared to standard presentation generation tools or the original multi-tier setup:

1. **Zero-Setup & 100% Offline Fallback:** Unlike traditional LLM wrappers that break without external API keys or DB migrations, this suite features an intelligent rule-based presentation planner that generates structured decks instantly out of the box while retaining plug-and-play LLM capability.
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

#### Step B: Build & Test MCP Server
```bash
cd mcp-server
npm install
npm run build
node dist/index.js <<< '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

#### Step C: Import n8n Workflow
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
  "numSlides": 5
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
  "presentation": { ... }
}
```

### 2. Generate from Custom Slide Outline JSON
`POST /api/generate-from-outline`

### 3. Download PPTX File
`GET /api/download/:filename`

---

## 🤖 MCP Integration (Claude Desktop, ChatGPT & Cursor)

### Claude Desktop Configuration
Add the snippet to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
To guarantee the AI calls your local Presenton engine instead of default tools, use:

> *"Use the tool `generate_presentation` with prompt: 'Artificial Intelligence in Healthcare', theme: 'modern_dark', num_slides: 5."*

---

## 🚀 How We Can Expand It Further (Future Roadmap)

1. 🧠 **LLM API Integration (Gemini / OpenAI / Anthropic):**
   - Adding plug-and-play LLM key configuration to auto-expand short user prompts into full multi-paragraph slide content and speaker notes.
2. 🖼️ **Dynamic AI Image Generation & Lucide Vector Icons:**
   - Integrating Gemini Imagen / DALL-E 3 API to auto-generate slide background graphics, illustrations, and contextual icon vectors.
3. 📄 **PDF & Google Slides Sync:**
   - Server-side conversion from `.pptx` to `.pdf` via headless LibreOffice and direct Google Drive API upload sync.
4. 📊 **Live Database & Spreadsheet Automation:**
   - Expanding n8n workflows to automatically generate weekly executive decks from Google Sheets, Airtable, or SQL queries.
5. 🎨 **Custom Brand Kit Uploader:**
   - Allowing organizations to upload custom fonts (`.otf`/`.ttf`), brand color hex palettes, and corporate logo assets for automatic header/footer branding.

---

## 📜 Repository Structure & Additional Docs

- [`WORKFLOW.md`](file:///Users/kt/workspace/presenton-automation/WORKFLOW.md): Detailed step-by-step system execution sequence diagrams and channel workflows.
- [`ARCHITECTURE.md`](file:///Users/kt/workspace/presenton-automation/ARCHITECTURE.md): Technical trade-offs, slide layout specs, and system design.
- [`DEMO_WALKTHROUGH.md`](file:///Users/kt/workspace/presenton-automation/DEMO_WALKTHROUGH.md): 3-4 minute Loom video demonstration script walkthrough.

