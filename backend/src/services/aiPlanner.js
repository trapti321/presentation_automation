/**
 * AI Presentation Planner & Content Generator
 * Supports dual-engine mode:
 * 1. Local Static Rule Engine (Fast, offline, zero-dependency)
 * 2. Live AI Model Generation (Google Gemini & OpenAI REST API)
 * Includes robust automatic fallback to local static mode if AI inference fails.
 */

/**
 * Generate presentation plan locally using template rule engine.
 */
function generateLocalStaticPlan(prompt, themeId = "modern_dark", numSlides = 5) {
  const cleanPrompt = (prompt || "Presentation Overview").trim();
  const slideCount = Math.min(Math.max(parseInt(numSlides) || 5, 3), 10);
  
  // Extract main topic title
  const topicTitle = cleanPrompt
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  const slides = [];

  // Slide 1: Cover Slide
  slides.push({
    slideIndex: 1,
    layout: "title_cover",
    title: topicTitle,
    subtitle: `Comprehensive Strategic Overview & Actionable Plan for ${topicTitle}`,
    presenter: "Generated via Presenton Engine",
    date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    accentBadge: "STRATEGY & EXECUTION"
  });

  // Slide 2: Key Metrics / Stats
  if (slideCount >= 2) {
    slides.push({
      slideIndex: 2,
      layout: "stats_metrics",
      title: "Key Market Metrics & Performance",
      subtitle: "Quantifiable indicators driving strategic growth and execution impact.",
      metrics: [
        { stat: "85%", label: "Efficiency Gain", subtext: "Automated workflow speedup" },
        { stat: "$4.2M", label: "Projected Value", subtext: "Annual cost optimization" },
        { stat: "3.5x", label: "ROI Multiple", subtext: "Measured over 12 months" },
        { stat: "99.9%", label: "Uptime Reliability", subtext: "Enterprise architecture standard" }
      ]
    });
  }

  // Slide 3: Two Column Content / Deep Dive
  if (slideCount >= 3) {
    slides.push({
      slideIndex: 3,
      layout: "two_column_content",
      title: `Core Pillars of ${topicTitle}`,
      subtitle: "Strategic analysis comparing key structural components.",
      leftHeading: "Strategic Drivers",
      leftItems: [
        `Accelerating automation & efficiency across ${topicTitle} initiatives.`,
        "Scalable modular framework supporting enterprise-grade integration.",
        "Data-driven decision models utilizing real-time performance telemetry."
      ],
      rightHeading: "Key Operational Outcomes",
      rightItems: [
        "Reduced cycle time from prompt conceptualization to execution.",
        "Enhanced security posture and compliance transparency.",
        "Seamless interoperability across API endpoints and workflow engines."
      ]
    });
  }

  // Slide 4: Feature Grid / Key Capabilities
  if (slideCount >= 4) {
    slides.push({
      slideIndex: 4,
      layout: "feature_grid",
      title: "Core Capabilities & Solution Pillars",
      subtitle: "End-to-end feature architecture delivering immediate value.",
      features: [
        {
          title: "Automated Generation",
          description: "Transform complex text instructions into visual 16:9 presentation slides instantaneously."
        },
        {
          title: "Multi-Engine Integration",
          description: "Connect via native Web APIs, n8n automation pipelines, or MCP AI assistant tools."
        },
        {
          title: "Curated Design System",
          description: "Apply harmonized color palettes, high-contrast typography, and balanced card layouts."
        },
        {
          title: "Native PPTX Export",
          description: "Download ready-to-present PowerPoint decks compatible with MS Office, Keynote, and Google Slides."
        }
      ]
    });
  }

  // Slide 5: Timeline / Process Workflow
  if (slideCount >= 5) {
    slides.push({
      slideIndex: 5,
      layout: "timeline_process",
      title: "Implementation Roadmap & Milestones",
      subtitle: "Phased rollout sequence from initial setup to full adoption.",
      steps: [
        { step: "Phase 1", title: "Discovery & Setup", description: "Define requirements, choose theme, and configure API or MCP parameters." },
        { step: "Phase 2", title: "Automated Build", description: "Generate slide structure, populate key metrics, and refine slide components." },
        { step: "Phase 3", title: "Review & Customization", description: "Iterate live in the deck previewer and adjust slide titles and content." },
        { step: "Phase 4", title: "Deploy & Present", description: "Export native PPTX presentation and present directly to stakeholders." }
      ]
    });
  }

  // Slide 6: Strategic Quote Callout
  if (slideCount >= 6) {
    slides.push({
      slideIndex: 6,
      layout: "quote_callout",
      title: "Executive Vision & Strategic Directive",
      subtitle: "Guiding perspective on long-term transformation.",
      quote: `"Innovation in automation isn't just about speed; it's about turning complex data into clear, persuasive visual communication that drives immediate action."`,
      author: "Chief Product Officer",
      role: "Enterprise Automation & AI Strategy"
    });
  }

  // Extra Slides (7..10) if requested
  for (let i = 7; i <= slideCount; i++) {
    slides.push({
      slideIndex: i,
      layout: i % 2 === 0 ? "feature_grid" : "two_column_content",
      title: `${topicTitle} - Key Topic Section ${i}`,
      subtitle: `Detailed breakdown of strategic objective #${i}.`,
      features: [
        { title: `Objective ${i}.1`, description: `Actionable focus area focused on optimizing ${topicTitle.toLowerCase()}.` },
        { title: `Objective ${i}.2`, description: `Measurable deliverable ensuring cross-functional alignment.` },
        { title: `Objective ${i}.3`, description: `Quality assurance milestone with continuous telemetry monitoring.` },
        { title: `Objective ${i}.4`, description: `Scalability factor designed for multi-region deployment.` }
      ],
      leftHeading: `Strategic Priority ${i}A`,
      leftItems: [`Focus area for ${topicTitle} optimization`, "Milestone tracking and performance audit", "Stakeholder review and sign-off"],
      rightHeading: `Strategic Priority ${i}B`,
      rightItems: ["Risk mitigation strategy", "Resource allocation matrix", "Final deployment checklist"]
    });
  }

  return {
    presentationTitle: topicTitle,
    summary: `Generated ${slides.length}-slide presentation on "${topicTitle}" with theme "${themeId}".`,
    themeId,
    slideCount: slides.length,
    slides
  };
}

/**
 * System prompt instructions for AI LLM model generation.
 */
function getSystemPrompt(slideCount) {
  return `You are an expert presentation content designer. Create a structured presentation deck JSON based on the user's topic.
Generate EXACTLY ${slideCount} slides.

Use ONLY these layout types for the slides array:
1. "title_cover": { "slideIndex": 1, "layout": "title_cover", "title": "...", "subtitle": "...", "presenter": "...", "date": "...", "accentBadge": "..." }
2. "stats_metrics": { "slideIndex": 2, "layout": "stats_metrics", "title": "...", "subtitle": "...", "metrics": [ { "stat": "...", "label": "...", "subtext": "..." }, ... ] } (3-4 metrics)
3. "two_column_content": { "slideIndex": 3, "layout": "two_column_content", "title": "...", "subtitle": "...", "leftHeading": "...", "leftItems": ["...", "..."], "rightHeading": "...", "rightItems": ["...", "..."] }
4. "feature_grid": { "slideIndex": 4, "layout": "feature_grid", "title": "...", "subtitle": "...", "features": [ { "title": "...", "description": "..." }, ... ] } (4 features)
5. "timeline_process": { "slideIndex": 5, "layout": "timeline_process", "title": "...", "subtitle": "...", "steps": [ { "step": "Phase 1", "title": "...", "description": "..." }, ... ] } (3-4 steps)
6. "quote_callout": { "slideIndex": 6, "layout": "quote_callout", "title": "...", "subtitle": "...", "quote": "...", "author": "...", "role": "..." }

Return strictly valid JSON with this top-level schema:
{
  "presentationTitle": "...",
  "summary": "...",
  "slides": [ ... ]
}`;
}

/**
 * Generate plan live via Google Gemini REST API
 */
async function generateGeminiPlan(prompt, themeId, slideCount, apiKey, model) {
  const modelsToTry = model 
    ? [model, "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp", "gemini-pro"]
    : ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp", "gemini-pro", "gemini-1.0-pro"];

  let lastError;
  for (const mod of modelsToTry) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${apiKey}`;
    const systemInstruction = getSystemPrompt(slideCount);
    const fullPrompt = `${systemInstruction}\n\nUser Topic: "${prompt}"\n\nGenerate the JSON output now.`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        // If 404 (model not found), try next model name in candidate list
        if (response.status === 404) {
          lastError = new Error(`Gemini API HTTP 404 for '${mod}': ${errorText}`);
          continue;
        }
        throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Gemini returned empty text candidate response.");
      }

      const parsed = JSON.parse(text);
      if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
        throw new Error("Gemini output JSON missing valid slides array.");
      }

      return parsed;
    } catch (err) {
      lastError = err;
      if (err.message.includes("404")) continue;
      throw err;
    }
  }

  throw lastError || new Error("All Gemini model aliases failed.");
}

/**
 * Generate plan live via OpenAI Chat Completions REST API
 */
async function generateOpenAIPlan(prompt, themeId, slideCount, apiKey, model = "gpt-4o-mini") {
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const systemInstruction = getSystemPrompt(slideCount);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: `Create a presentation deck on topic: "${prompt}"` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("OpenAI returned empty message content.");
  }

  const parsed = JSON.parse(text);
  if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
    throw new Error("OpenAI output JSON missing valid slides array.");
  }

  return parsed;
}

/**
 * Unified Main Entrypoint for Presentation Generation
 *
 * @param {string} prompt User prompt instruction
 * @param {string} themeId Theme ID
 * @param {number} numSlides Desired slide count
 * @param {object} options Options object containing { mode, provider, apiKey, model }
 */
async function generatePresentationPlan(prompt, themeId = "modern_dark", numSlides = 5, options = {}) {
  const cleanPrompt = (prompt || "Presentation Overview").trim();
  const slideCount = Math.min(Math.max(parseInt(numSlides) || 5, 3), 10);

  // 1. Resolve Provider & Key Configuration
  const reqApiKey = options.apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "";
  const reqMode = (options.mode || process.env.LLM_MODE || "auto").toLowerCase();
  
  let reqProvider = (options.provider || process.env.LLM_PROVIDER || "").toLowerCase();
  
  // Smart key-based auto-detection
  if (reqApiKey.startsWith("sk-")) {
    reqProvider = "openai";
  } else if (reqApiKey.startsWith("AIza")) {
    reqProvider = "gemini";
  } else if (!reqProvider || reqProvider === "auto") {
    reqProvider = process.env.OPENAI_API_KEY ? "openai" : "gemini";
  }

  // 2. Explicit Local Static Mode Requested OR No Key Available
  if (reqMode === "static" || reqProvider === "local" || !reqApiKey) {
    console.log(`[AI Planner] Running in LOCAL STATIC mode (Provider: local, Key present: ${Boolean(reqApiKey)})`);
    const staticPlan = generateLocalStaticPlan(cleanPrompt, themeId, slideCount);
    return {
      ...staticPlan,
      modeUsed: "static",
      provider: "local",
      fallbackUsed: false
    };
  }

  // 3. AI Mode Execution Attempt
  console.log(`[AI Planner] Attempting LIVE AI generation via Provider: '${reqProvider}'`);
  try {
    let aiPlan;
    if (reqProvider === "openai") {
      const model = options.model || process.env.OPENAI_MODEL || "gpt-4o-mini";
      aiPlan = await generateOpenAIPlan(cleanPrompt, themeId, slideCount, reqApiKey, model);
    } else {
      const model = options.model || process.env.GEMINI_MODEL || "gemini-1.5-flash";
      aiPlan = await generateGeminiPlan(cleanPrompt, themeId, slideCount, reqApiKey, model);
    }

    // Ensure slides array format & indexes
    const normalizedSlides = aiPlan.slides.map((s, idx) => ({
      ...s,
      slideIndex: idx + 1,
      layout: s.layout || "two_column_content"
    }));

    return {
      presentationTitle: aiPlan.presentationTitle || cleanPrompt,
      summary: aiPlan.summary || `AI Generated presentation on "${cleanPrompt}".`,
      themeId,
      slideCount: normalizedSlides.length,
      slides: normalizedSlides,
      modeUsed: "ai",
      provider: reqProvider,
      fallbackUsed: false
    };
  } catch (error) {
    console.warn(`[AI Planner Fallback Warning] Live AI generation failed: ${error.message}. Falling back to Local Static Engine.`);
    
    // Graceful Fallback to Local Static Plan
    const fallbackPlan = generateLocalStaticPlan(cleanPrompt, themeId, slideCount);
    return {
      ...fallbackPlan,
      modeUsed: "static",
      provider: reqProvider,
      fallbackUsed: true,
      fallbackReason: error.message
    };
  }
}

module.exports = {
  generatePresentationPlan,
  generateLocalStaticPlan
};
