// Presenton Automation Frontend Logic

const API_BASE = "http://localhost:5001";
let currentPresentation = null;
let activeSlideIndex = 0;
let currentEngineMode = "direct"; // 'direct' or 'n8n'

const THEME_PALETTES = {
  modern_dark: { bg: "#0f172a", cardBg: "#1e293b", text: "#f8fafc", primary: "#38bdf8", secondary: "#818cf8" },
  vibrant_neon: { bg: "#180033", cardBg: "#2d0d54", text: "#ffffff", primary: "#a855f7", secondary: "#ec4899" },
  executive_navy: { bg: "#0f172a", cardBg: "#1e293b", text: "#ffffff", primary: "#f59e0b", secondary: "#3b82f6" },
  minimal_clean: { bg: "#f8fafc", cardBg: "#ffffff", text: "#0f172a", primary: "#4f46e5", secondary: "#0ea5e9" },
  emerald_bio: { bg: "#064e3b", cardBg: "#065f46", text: "#f0fdf4", primary: "#34d399", secondary: "#a7f3d0" }
};

document.addEventListener("DOMContentLoaded", () => {
  // Load saved API key from localStorage if available
  const savedKey = localStorage.getItem("presenton_api_key");
  if (savedKey) {
    document.getElementById("apiKeyInput").value = savedKey;
  }

  // Set initial default presentation
  setPreset("AI in Modern Healthcare - Diagnostics & Patient Care");
  generatePresentation();
});

function setPreset(promptText) {
  document.getElementById("promptInput").value = promptText;
}

function updateSlideRangeVal(val) {
  document.getElementById("rangeVal").innerText = `${val} Slides`;
}

function setEngineMode(mode) {
  currentEngineMode = mode;
  document.getElementById("modeDirect").classList.toggle("active", mode === "direct");
  document.getElementById("modeN8n").classList.toggle("active", mode === "n8n");
}

function onProviderChange() {
  const provider = document.getElementById("providerSelect").value;
  const apiKeyRow = document.getElementById("apiKeyRow");
  if (provider === "gemini" || provider === "openai") {
    apiKeyRow.style.display = "flex";
  } else {
    apiKeyRow.style.display = "none";
  }
}

function onApiKeyInput(val) {
  localStorage.setItem("presenton_api_key", val.trim());
}

function toggleApiKeyVisibility() {
  const input = document.getElementById("apiKeyInput");
  const btn = document.getElementById("btnToggleKey");
  if (input.type === "password") {
    input.type = "text";
    btn.innerText = "🔒";
  } else {
    input.type = "password";
    btn.innerText = "👁️";
  }
}

function onThemeChange() {
  if (currentPresentation) {
    currentPresentation.presentation.themeId = document.getElementById("themeSelect").value;
    renderCurrentSlide();
  }
}

async function generatePresentation() {
  const prompt = document.getElementById("promptInput").value.trim() || "Presentation Overview";
  const theme = document.getElementById("themeSelect").value;
  const numSlides = document.getElementById("slidesRange").value;
  const provider = document.getElementById("providerSelect").value;
  const apiKey = document.getElementById("apiKeyInput").value.trim();
  const mode = provider === "local" ? "static" : "ai";

  showLoading(true);

  const endpoint = currentEngineMode === "n8n" 
    ? `${API_BASE}/webhook/n8n-generate`
    : `${API_BASE}/api/generate`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, theme, numSlides, mode, provider, apiKey })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    currentPresentation = data;
    activeSlideIndex = 0;

    renderSidebarThumbs();
    renderCurrentSlide();

    // Update Status Badge
    const badge = document.getElementById("engineMetaBadge");
    if (data.generatorMeta) {
      if (data.generatorMeta.fallbackUsed) {
        badge.innerText = "⚠️ Fallback Engine (Static)";
        badge.className = "meta-badge fallback";
        badge.title = `AI Failed: ${data.generatorMeta.fallbackReason || "Unknown"}`;
      } else if (data.generatorMeta.modeUsed === "ai") {
        badge.innerText = `🤖 Live AI (${data.generatorMeta.provider === "openai" ? "OpenAI" : "Gemini"})`;
        badge.className = "meta-badge ai";
        badge.title = "Generated live via LLM API";
      } else {
        badge.innerText = "⚡ Local Engine";
        badge.className = "meta-badge";
        badge.title = "Generated via Local Rule Engine";
      }
    }

    // Enable download button
    document.getElementById("btnDownload").disabled = false;
    document.getElementById("deckTitle").innerText = data.presentation.presentationTitle;
  } catch (error) {
    alert(`Failed to generate presentation: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

function renderSidebarThumbs() {
  const thumbList = document.getElementById("thumbList");
  thumbList.innerHTML = "";

  if (!currentPresentation || !currentPresentation.presentation.slides) return;

  currentPresentation.presentation.slides.forEach((slide, idx) => {
    const item = document.createElement("div");
    item.className = `thumb-item ${idx === activeSlideIndex ? "active" : ""}`;
    item.onclick = () => selectSlide(idx);

    item.innerHTML = `
      <div class="thumb-header">
        <span class="thumb-num">Slide ${idx + 1}</span>
        <span class="thumb-type">${slide.layout.replace("_", " ")}</span>
      </div>
      <div class="thumb-text">${slide.title || "Untitled Slide"}</div>
    `;
    thumbList.appendChild(item);
  });
}

function selectSlide(idx) {
  activeSlideIndex = idx;
  renderSidebarThumbs();
  renderCurrentSlide();
}

function renderCurrentSlide() {
  if (!currentPresentation || !currentPresentation.presentation.slides) return;

  const slide = currentPresentation.presentation.slides[activeSlideIndex];
  const themeId = currentPresentation.presentation.themeId || "modern_dark";
  const palette = THEME_PALETTES[themeId] || THEME_PALETTES.modern_dark;

  const canvas = document.getElementById("canvasFrame");
  canvas.style.backgroundColor = palette.bg;
  canvas.style.color = palette.text;

  const slideContent = document.getElementById("slideContent");
  slideContent.innerHTML = "";

  // 1. Cover Slide
  if (slide.layout === "title_cover") {
    slideContent.innerHTML = `
      <div class="slide-content-wrapper" style="justify-content: center; gap: 24px;">
        <div style="width: 80px; height: 6px; background: ${palette.primary}; border-radius: 4px;"></div>
        <span style="font-size: 14px; font-weight: 700; color: ${palette.primary}; letter-spacing: 1px;">${slide.accentBadge || "STRATEGY"}</span>
        <h1 contenteditable="true" class="editable-title" style="font-size: 38px; color: ${palette.text};">${slide.title}</h1>
        <p contenteditable="true" class="editable-subtitle" style="font-size: 18px; color: ${palette.text}; opacity: 0.8; max-width: 80%;">${slide.subtitle}</p>
        <div style="margin-top: 32px; font-size: 13px; opacity: 0.6;">${slide.presenter || "Presenton Engine"} • ${slide.date || ""}</div>
      </div>
    `;
    return;
  }

  // Header Zone
  const headerHtml = `
    <div class="slide-heading-zone">
      <h2 contenteditable="true" class="editable-title" style="font-size: 26px; color: ${palette.text};">${slide.title}</h2>
      <p contenteditable="true" class="editable-subtitle" style="font-size: 14px; color: ${palette.text}; opacity: 0.8;">${slide.subtitle || ""}</p>
    </div>
  `;

  let bodyHtml = "";

  // 2. Stats Metrics
  if (slide.layout === "stats_metrics") {
    const metrics = slide.metrics || [];
    bodyHtml = `
      <div class="metrics-render-grid">
        ${metrics.map(m => `
          <div class="metric-card-render" style="background: ${palette.cardBg}; border-color: rgba(255,255,255,0.1);">
            <div class="metric-stat-num" style="color: ${palette.primary};">${m.stat}</div>
            <div class="metric-stat-label" style="color: ${palette.text};">${m.label}</div>
            <div class="metric-stat-sub" style="color: ${palette.text}; opacity: 0.7;">${m.subtext}</div>
          </div>
        `).join("")}
      </div>
    `;
  } 
  // 3. Two Column
  else if (slide.layout === "two_column_content") {
    bodyHtml = `
      <div class="two-col-render-grid">
        <div class="col-card-render" style="background: ${palette.cardBg};">
          <div class="col-card-title" style="color: ${palette.primary};">${slide.leftHeading || "Overview"}</div>
          <ul style="padding-left: 20px; font-size: 13px; line-height: 1.8;">
            ${(slide.leftItems || []).map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
        <div class="col-card-render" style="background: ${palette.cardBg};">
          <div class="col-card-title" style="color: ${palette.secondary};">${slide.rightHeading || "Highlights"}</div>
          <ul style="padding-left: 20px; font-size: 13px; line-height: 1.8;">
            ${(slide.rightItems || []).map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
  }
  // 4. Feature Grid
  else if (slide.layout === "feature_grid") {
    const features = slide.features || [];
    bodyHtml = `
      <div class="feature-grid-render">
        ${features.map(f => `
          <div class="feature-card-render" style="background: ${palette.cardBg}; border-left-color: ${palette.primary};">
            <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px; color: ${palette.text};">${f.title}</div>
            <div style="font-size: 12px; opacity: 0.8; color: ${palette.text};">${f.description}</div>
          </div>
        `).join("")}
      </div>
    `;
  }
  // 5. Timeline Process
  else if (slide.layout === "timeline_process") {
    const steps = slide.steps || [];
    bodyHtml = `
      <div class="timeline-render-grid">
        ${steps.map(s => `
          <div class="timeline-card-render" style="background: ${palette.cardBg};">
            <div style="font-size: 11px; font-weight: 700; color: ${palette.primary}; margin-bottom: 4px;">${s.step}</div>
            <div style="font-size: 14px; font-weight: 700; color: ${palette.text}; margin-bottom: 6px;">${s.title}</div>
            <div style="font-size: 11px; opacity: 0.8; color: ${palette.text};">${s.description}</div>
          </div>
        `).join("")}
      </div>
    `;
  }
  // 6. Quote Callout
  else if (slide.layout === "quote_callout") {
    bodyHtml = `
      <div class="quote-render-box" style="background: ${palette.cardBg}; border-left-color: ${palette.primary};">
        <div style="font-size: 18px; font-style: italic; margin-bottom: 16px; color: ${palette.text};">${slide.quote}</div>
        <div style="font-weight: 700; font-size: 14px; color: ${palette.secondary};">— ${slide.author}</div>
        <div style="font-size: 12px; opacity: 0.7;">${slide.role}</div>
      </div>
    `;
  }

  slideContent.innerHTML = `
    <div class="slide-content-wrapper">
      ${headerHtml}
      ${bodyHtml}
      <div style="display: flex; justify-content: space-between; font-size: 11px; opacity: 0.6; margin-top: 12px;">
        <span>Slide ${activeSlideIndex + 1} of ${currentPresentation.presentation.slides.length}</span>
        <span>Presenton Widescreen Deck</span>
      </div>
    </div>
  `;
}

function downloadPptx() {
  if (!currentPresentation || !currentPresentation.downloadUrl) return;
  window.open(currentPresentation.downloadUrl, "_blank");
}

function showLoading(active) {
  const overlay = document.getElementById("loadingOverlay");
  if (active) {
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}

function showJsonModal() {
  if (!currentPresentation) return;
  document.getElementById("modalTitle").innerText = "Presentation JSON Data";
  document.getElementById("modalCode").innerText = JSON.stringify(currentPresentation.presentation, null, 2);
  document.getElementById("modalBackdrop").classList.add("active");
}

function showMcpModal() {
  const prompt = document.getElementById("promptInput").value.trim();
  const theme = document.getElementById("themeSelect").value;
  const provider = document.getElementById("providerSelect").value;
  const apiKey = document.getElementById("apiKeyInput").value.trim();
  const mode = provider === "local" ? "static" : "ai";

  const argsObj = {
    prompt,
    theme,
    num_slides: Number(document.getElementById("slidesRange").value),
    mode,
    provider
  };
  if (apiKey) {
    argsObj.apiKey = apiKey;
  }

  const mcpCmd = JSON.stringify({
    tool: "generate_presentation",
    arguments: argsObj
  }, null, 2);

  document.getElementById("modalTitle").innerText = "MCP Tool Execution JSON";
  document.getElementById("modalCode").innerText = mcpCmd;
  document.getElementById("modalBackdrop").classList.add("active");
}

function closeModal(event) {
  document.getElementById("modalBackdrop").classList.remove("active");
}

function closeModalDirect() {
  document.getElementById("modalBackdrop").classList.remove("active");
}

function copyModalCode() {
  const code = document.getElementById("modalCode").innerText;
  navigator.clipboard.writeText(code);
  alert("Copied to clipboard!");
}
