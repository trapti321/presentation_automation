/**
 * AI Presentation Planner & Content Generator
 * Generates rich, structured slide objects based on prompt input.
 */

async function generatePresentationPlan(prompt, themeId = "modern_dark", numSlides = 5) {
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

module.exports = {
  generatePresentationPlan
};
