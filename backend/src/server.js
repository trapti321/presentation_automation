const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { THEMES, getTheme } = require("./config/themes");
const { generatePresentationPlan } = require("./services/aiPlanner");
const { buildPptxFile } = require("./services/pptxBuilder");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Directory to store generated presentations
const OUTPUT_DIR = path.join(__dirname, "../public/output");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Serve public static files for downloads & frontend
app.use("/download-file", express.static(OUTPUT_DIR));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Presenton Automation Backend",
    timestamp: new Date().toISOString()
  });
});

// List Themes & Layouts
app.get("/api/themes", (req, res) => {
  res.json({
    themes: Object.values(THEMES),
    layouts: [
      { id: "title_cover", name: "Title Cover Slide", description: "Main cover with title, subtitle, and accent branding" },
      { id: "stats_metrics", name: "Key Stats & Metrics", description: "4 stat cards with numbers and subtext" },
      { id: "two_column_content", name: "Two Column Breakdown", description: "Dual comparative columns with bullet lists" },
      { id: "feature_grid", name: "Feature Grid (2x2)", description: "4 feature cards with headers and descriptions" },
      { id: "quote_callout", name: "Quote Callout", description: "Large blockquote with attribution and accent line" },
      { id: "timeline_process", name: "Timeline / Process Flow", description: "Horizontal milestone step cards" }
    ]
  });
});

// Primary Endpoint: Generate Presentation from Prompt Instructions
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, theme = "modern_dark", numSlides = 5 } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt instruction is required." });
    }

    console.log(`[Generate] Prompt: "${prompt}", Theme: ${theme}, Slides: ${numSlides}`);

    // 1. Generate Structured Slide Deck Plan
    const presentationPlan = await generatePresentationPlan(prompt, theme, numSlides);

    // 2. Render PPTX File
    const { filename, filePath } = await buildPptxFile(presentationPlan, OUTPUT_DIR);

    const protocol = req.protocol || "http";
    const host = req.get("host") || `localhost:${PORT}`;
    const downloadUrl = `${protocol}://${host}/api/download/${filename}`;

    res.json({
      success: true,
      presentationId: filename.replace(".pptx", ""),
      filename,
      downloadUrl,
      summary: presentationPlan.summary,
      theme: getTheme(theme),
      slideCount: presentationPlan.slideCount,
      presentation: presentationPlan
    });
  } catch (error) {
    console.error("[Generate Error]", error);
    res.status(500).json({ error: "Failed to generate presentation", details: error.message });
  }
});

// Secondary Endpoint: Generate Presentation directly from Custom Slide Outline JSON
app.post("/api/generate-from-outline", async (req, res) => {
  try {
    const { presentationTitle, themeId = "modern_dark", slides } = req.body;
    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({ error: "A non-empty slides array is required." });
    }

    const presentationPlan = {
      presentationTitle: presentationTitle || "Custom Presentation",
      summary: `Custom outline generated with ${slides.length} slides.`,
      themeId,
      slideCount: slides.length,
      slides
    };

    const { filename } = await buildPptxFile(presentationPlan, OUTPUT_DIR);
    const protocol = req.protocol || "http";
    const host = req.get("host") || `localhost:${PORT}`;
    const downloadUrl = `${protocol}://${host}/api/download/${filename}`;

    res.json({
      success: true,
      filename,
      downloadUrl,
      slideCount: slides.length,
      presentation: presentationPlan
    });
  } catch (error) {
    console.error("[Outline Error]", error);
    res.status(500).json({ error: "Failed to build presentation from outline", details: error.message });
  }
});

// Download Binary File
app.get("/api/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(OUTPUT_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found." });
  }

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.sendFile(filePath);
});

// n8n Webhook Target Endpoint
app.post("/webhook/n8n-generate", async (req, res) => {
  try {
    const { prompt, theme = "modern_dark", numSlides = 5 } = req.body;
    const presentationPlan = await generatePresentationPlan(prompt || "n8n Workflow Deck", theme, numSlides);
    const { filename, filePath } = await buildPptxFile(presentationPlan, OUTPUT_DIR);

    const protocol = req.protocol || "http";
    const host = req.get("host") || `localhost:${PORT}`;
    const downloadUrl = `${protocol}://${host}/api/download/${filename}`;

    // Read base64 for n8n binary payload support
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString("base64");

    res.json({
      status: "success",
      source: "n8n_webhook",
      presentationId: filename.replace(".pptx", ""),
      filename,
      downloadUrl,
      slideCount: presentationPlan.slideCount,
      binaryBase64: base64Data,
      presentation: presentationPlan
    });
  } catch (error) {
    console.error("[n8n Webhook Error]", error);
    res.status(500).json({ error: "n8n generation failed", details: error.message });
  }
});

// Serve Frontend static files if requesting root
const FRONTEND_DIR = path.join(__dirname, "../../frontend");
if (fs.existsSync(FRONTEND_DIR)) {
  app.use(express.static(FRONTEND_DIR));
}

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Presenton Automation Server active on port ${PORT}`);
  console.log(`👉 API Base: http://localhost:${PORT}`);
  console.log(`=================================================`);
});
