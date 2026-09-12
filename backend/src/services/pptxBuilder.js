const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const { getTheme } = require("../config/themes");

/**
 * Builds a widescreen 16:9 PPTX file from presentation data.
 */
async function buildPptxFile(presentationData, outputDir) {
  const pptx = new pptxgen();

  // Widescreen 16:9
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Presenton Engine";
  pptx.company = "ContentBeta Presentation Automation";
  pptx.title = presentationData.presentationTitle || "Presentation";

  const theme = getTheme(presentationData.themeId);
  const slidesData = presentationData.slides || [];

  for (let i = 0; i < slidesData.length; i++) {
    const slideData = slidesData[i];
    const slide = pptx.addSlide();

    // Set background color
    slide.background = { color: theme.bg };

    // Render footer page number (except cover slide)
    if (slideData.layout !== "title_cover") {
      slide.addText(`Page ${i + 1} of ${slidesData.length}  |  ${presentationData.presentationTitle}`, {
        x: 0.8,
        y: 7.0,
        w: 11.7,
        h: 0.3,
        fontSize: 10,
        color: theme.textSecondary,
        fontFace: theme.fontBody,
        align: "left"
      });
    }

    // Render specific layout
    switch (slideData.layout) {
      case "title_cover":
        renderTitleCover(slide, slideData, theme);
        break;
      case "stats_metrics":
        renderStatsMetrics(slide, slideData, theme);
        break;
      case "two_column_content":
        renderTwoColumnContent(slide, slideData, theme);
        break;
      case "feature_grid":
        renderFeatureGrid(slide, slideData, theme);
        break;
      case "quote_callout":
        renderQuoteCallout(slide, slideData, theme);
        break;
      case "timeline_process":
        renderTimelineProcess(slide, slideData, theme);
        break;
      default:
        renderFeatureGrid(slide, slideData, theme);
        break;
    }
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `presentation_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.pptx`;
  const filePath = path.join(outputDir, filename);

  await pptx.writeFile({ fileName: filePath });
  return { filename, filePath };
}

// 1. Cover Slide
function renderTitleCover(slide, data, theme) {
  // Top Accent Bar
  slide.addShape("rect", {
    x: 0.8,
    y: 1.2,
    w: 1.5,
    h: 0.1,
    fill: { color: theme.primary }
  });

  // Badge
  if (data.accentBadge) {
    slide.addText(data.accentBadge, {
      x: 0.8,
      y: 1.5,
      w: 4.0,
      h: 0.4,
      fontSize: 12,
      bold: true,
      color: theme.primary,
      fontFace: theme.fontHeader
    });
  }

  // Main Title
  slide.addText(data.title || "Presentation Title", {
    x: 0.8,
    y: 2.1,
    w: 11.5,
    h: 2.2,
    fontSize: 40,
    bold: true,
    color: theme.textPrimary,
    fontFace: theme.fontHeader,
    valign: "top"
  });

  // Subtitle
  slide.addText(data.subtitle || "", {
    x: 0.8,
    y: 4.4,
    w: 10.5,
    h: 1.2,
    fontSize: 18,
    color: theme.textSecondary,
    fontFace: theme.fontBody,
    valign: "top"
  });

  // Footer / Presenter Info
  slide.addText(`${data.presenter || "Presenton Automation"}  •  ${data.date || ""}`, {
    x: 0.8,
    y: 6.2,
    w: 11.5,
    h: 0.5,
    fontSize: 12,
    color: theme.textSecondary,
    fontFace: theme.fontBody
  });
}

// 2. Header Helper
function renderHeader(slide, title, subtitle, theme) {
  slide.addText(title || "", {
    x: 0.8,
    y: 0.6,
    w: 11.7,
    h: 0.8,
    fontSize: 26,
    bold: true,
    color: theme.textPrimary,
    fontFace: theme.fontHeader
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8,
      y: 1.3,
      w: 11.7,
      h: 0.5,
      fontSize: 14,
      color: theme.textSecondary,
      fontFace: theme.fontBody
    });
  }
}

// 3. Stats & Metrics Layout
function renderStatsMetrics(slide, data, theme) {
  renderHeader(slide, data.title, data.subtitle, theme);

  const metrics = data.metrics || [];
  const cardW = 2.7;
  const cardH = 4.2;
  const startX = 0.8;
  const gapX = 0.3;
  const startY = 2.2;

  metrics.forEach((m, idx) => {
    if (idx >= 4) return;
    const x = startX + idx * (cardW + gapX);

    // Card background box
    slide.addShape("rect", {
      x,
      y: startY,
      w: cardW,
      h: cardH,
      fill: { color: theme.cardBg },
      line: { color: theme.cardBorder, width: 1 }
    });

    // Stat Number
    slide.addText(m.stat || "0", {
      x: x + 0.2,
      y: startY + 0.5,
      w: cardW - 0.4,
      h: 1.2,
      fontSize: 36,
      bold: true,
      color: theme.primary,
      fontFace: theme.fontHeader,
      align: "center"
    });

    // Label
    slide.addText(m.label || "", {
      x: x + 0.2,
      y: startY + 1.8,
      w: cardW - 0.4,
      h: 0.8,
      fontSize: 16,
      bold: true,
      color: theme.textPrimary,
      fontFace: theme.fontHeader,
      align: "center"
    });

    // Subtext
    slide.addText(m.subtext || "", {
      x: x + 0.2,
      y: startY + 2.7,
      w: cardW - 0.4,
      h: 1.0,
      fontSize: 12,
      color: theme.textSecondary,
      fontFace: theme.fontBody,
      align: "center",
      valign: "top"
    });
  });
}

// 4. Two Column Content Layout
function renderTwoColumnContent(slide, data, theme) {
  renderHeader(slide, data.title, data.subtitle, theme);

  const colW = 5.6;
  const colH = 4.5;
  const startY = 2.0;

  // Left Column Card
  const leftX = 0.8;
  slide.addShape("rect", {
    x: leftX,
    y: startY,
    w: colW,
    h: colH,
    fill: { color: theme.cardBg },
    line: { color: theme.cardBorder, width: 1 }
  });

  slide.addText(data.leftHeading || "Overview", {
    x: leftX + 0.4,
    y: startY + 0.4,
    w: colW - 0.8,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: theme.primary,
    fontFace: theme.fontHeader
  });

  const leftText = (data.leftItems || []).map(item => `• ${item}`).join("\n\n");
  slide.addText(leftText, {
    x: leftX + 0.4,
    y: startY + 1.1,
    w: colW - 0.8,
    h: 3.0,
    fontSize: 13,
    color: theme.textPrimary,
    fontFace: theme.fontBody,
    valign: "top"
  });

  // Right Column Card
  const rightX = 6.9;
  slide.addShape("rect", {
    x: rightX,
    y: startY,
    w: colW,
    h: colH,
    fill: { color: theme.cardBg },
    line: { color: theme.cardBorder, width: 1 }
  });

  slide.addText(data.rightHeading || "Key Highlights", {
    x: rightX + 0.4,
    y: startY + 0.4,
    w: colW - 0.8,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: theme.secondary,
    fontFace: theme.fontHeader
  });

  const rightText = (data.rightItems || []).map(item => `• ${item}`).join("\n\n");
  slide.addText(rightText, {
    x: rightX + 0.4,
    y: startY + 1.1,
    w: colW - 0.8,
    h: 3.0,
    fontSize: 13,
    color: theme.textPrimary,
    fontFace: theme.fontBody,
    valign: "top"
  });
}

// 5. Feature Grid Layout
function renderFeatureGrid(slide, data, theme) {
  renderHeader(slide, data.title, data.subtitle, theme);

  const features = data.features || [];
  const cardW = 5.6;
  const cardH = 2.1;
  const startY = 2.1;
  const gapY = 0.3;

  features.forEach((feat, idx) => {
    if (idx >= 4) return;
    const isRight = idx % 2 === 1;
    const isBottom = idx >= 2;

    const x = isRight ? 6.9 : 0.8;
    const y = startY + (isBottom ? cardH + gapY : 0);

    slide.addShape("rect", {
      x,
      y,
      w: cardW,
      h: cardH,
      fill: { color: theme.cardBg },
      line: { color: theme.cardBorder, width: 1 }
    });

    // Accent line on left of card
    slide.addShape("rect", {
      x,
      y,
      w: 0.1,
      h: cardH,
      fill: { color: isRight ? theme.secondary : theme.primary }
    });

    slide.addText(feat.title || "", {
      x: x + 0.3,
      y: y + 0.25,
      w: cardW - 0.5,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: theme.textPrimary,
      fontFace: theme.fontHeader
    });

    slide.addText(feat.description || "", {
      x: x + 0.3,
      y: y + 0.7,
      w: cardW - 0.5,
      h: 1.2,
      fontSize: 12,
      color: theme.textSecondary,
      fontFace: theme.fontBody,
      valign: "top"
    });
  });
}

// 6. Quote Callout Layout
function renderQuoteCallout(slide, data, theme) {
  renderHeader(slide, data.title, data.subtitle, theme);

  const boxX = 1.5;
  const boxY = 2.2;
  const boxW = 10.3;
  const boxH = 4.2;

  slide.addShape("rect", {
    x: boxX,
    y: boxY,
    w: boxW,
    h: boxH,
    fill: { color: theme.cardBg },
    line: { color: theme.cardBorder, width: 1 }
  });

  // Vertical Accent Line
  slide.addShape("rect", {
    x: boxX,
    y: boxY,
    w: 0.15,
    h: boxH,
    fill: { color: theme.primary }
  });

  // Quote Mark
  slide.addText("“", {
    x: boxX + 0.4,
    y: boxY + 0.2,
    w: 1.0,
    h: 1.0,
    fontSize: 72,
    bold: true,
    color: theme.primary,
    fontFace: theme.fontHeader
  });

  // Quote Text
  slide.addText(data.quote || "", {
    x: boxX + 0.6,
    y: boxY + 1.1,
    w: boxW - 1.2,
    h: 1.8,
    fontSize: 20,
    italic: true,
    color: theme.textPrimary,
    fontFace: theme.fontHeader,
    valign: "top"
  });

  // Author & Role
  slide.addText(`— ${data.author || "Executive Leader"}\n${data.role || ""}`, {
    x: boxX + 0.6,
    y: boxY + 3.0,
    w: boxW - 1.2,
    h: 0.9,
    fontSize: 14,
    bold: true,
    color: theme.secondary,
    fontFace: theme.fontBody
  });
}

// 7. Timeline / Process Layout
function renderTimelineProcess(slide, data, theme) {
  renderHeader(slide, data.title, data.subtitle, theme);

  const steps = data.steps || [];
  const count = Math.min(steps.length, 4);
  const cardW = (11.7 - (count - 1) * 0.3) / count;
  const cardH = 4.3;
  const startX = 0.8;
  const startY = 2.2;

  steps.forEach((st, idx) => {
    if (idx >= count) return;
    const x = startX + idx * (cardW + 0.3);

    // Card background
    slide.addShape("rect", {
      x,
      y: startY,
      w: cardW,
      h: cardH,
      fill: { color: theme.cardBg },
      line: { color: theme.cardBorder, width: 1 }
    });

    // Step Badge
    slide.addText(st.step || `Step ${idx + 1}`, {
      x: x + 0.2,
      y: startY + 0.3,
      w: cardW - 0.4,
      h: 0.4,
      fontSize: 12,
      bold: true,
      color: theme.primary,
      fontFace: theme.fontHeader
    });

    // Step Title
    slide.addText(st.title || "", {
      x: x + 0.2,
      y: startY + 0.8,
      w: cardW - 0.4,
      h: 0.8,
      fontSize: 16,
      bold: true,
      color: theme.textPrimary,
      fontFace: theme.fontHeader,
      valign: "top"
    });

    // Step Description
    slide.addText(st.description || "", {
      x: x + 0.2,
      y: startY + 1.7,
      w: cardW - 0.4,
      h: 2.2,
      fontSize: 12,
      color: theme.textSecondary,
      fontFace: theme.fontBody,
      valign: "top"
    });
  });
}

module.exports = {
  buildPptxFile
};
