import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import http from "http";

const BACKEND_API_BASE = process.env.BACKEND_API_BASE || "http://localhost:5001";

const server = new Server(
  {
    name: "presenton-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. List Available MCP Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_presentation",
        description:
          "Generates a complete 16:9 widescreen PowerPoint presentation deck (.pptx) based on user prompt instructions, topic, theme, and desired slide count.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The topic, instructions, or content outline for the presentation (e.g. 'AI in Healthcare', 'Startup Pitch Deck').",
            },
            theme: {
              type: "string",
              enum: ["modern_dark", "vibrant_neon", "executive_navy", "minimal_clean", "emerald_bio"],
              description: "Design theme color palette (default: 'modern_dark').",
              default: "modern_dark",
            },
            num_slides: {
              type: "number",
              description: "Number of slides to generate (3 to 10, default: 5).",
              default: 5,
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "list_presentation_themes",
        description: "Returns all available design theme palettes, typography options, and supported slide layout templates.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "generate_from_outline",
        description: "Converts a custom structured slide array directly into a downloadable PowerPoint presentation (.pptx).",
        inputSchema: {
          type: "object",
          properties: {
            presentationTitle: {
              type: "string",
              description: "Overall title of the presentation.",
            },
            themeId: {
              type: "string",
              description: "Theme identifier (e.g. 'modern_dark').",
            },
            slides: {
              type: "array",
              description: "Array of slide objects containing title, layout, bullets, stats, or step items.",
            },
          },
          required: ["slides"],
        },
      },
    ],
  };
});

// Helper for HTTP POST requests to backend engine
function httpPost(url: string, bodyObj: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bodyObj);
    const u = new URL(url);

    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let respBody = "";
        res.on("data", (chunk) => (respBody += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(respBody);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Failed to parse backend response: ${respBody}`));
          }
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.write(data);
    req.end();
  });
}

// 2. Handle Tool Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "generate_presentation") {
      const prompt = String(args?.prompt || "Presentation Overview");
      const theme = String(args?.theme || "modern_dark");
      const numSlides = Number(args?.num_slides || 5);

      const result = await httpPost(`${BACKEND_API_BASE}/api/generate`, {
        prompt,
        theme,
        numSlides,
      });

      if (!result.success) {
        throw new Error(result.error || "Generation failed.");
      }

      const slidesSummary = (result.presentation?.slides || [])
        .map((s: any, idx: number) => `Slide ${idx + 1} (${s.layout}): ${s.title}`)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `🎉 Presentation successfully generated!\n\n` +
                  `📁 Filename: ${result.filename}\n` +
                  `📊 Slide Count: ${result.slideCount}\n` +
                  `🎨 Theme: ${result.theme?.name} (${result.theme?.id})\n` +
                  `🔗 Download URL: ${result.downloadUrl}\n\n` +
                  `📋 Slide Deck Outline:\n${slidesSummary}\n\n` +
                  `JSON Payload:\n${JSON.stringify(result, null, 2)}`,
          },
        ],
      };
    }

    if (name === "list_presentation_themes") {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              themes: [
                { id: "modern_dark", name: "Modern Dark", bg: "#0F172A", accent: "#06B6D4" },
                { id: "vibrant_neon", name: "Vibrant Neon", bg: "#180033", accent: "#EC4899" },
                { id: "executive_navy", name: "Executive Navy", bg: "#0F172A", accent: "#F59E0B" },
                { id: "minimal_clean", name: "Minimalist Clean", bg: "#F8FAFC", accent: "#4F46E5" },
                { id: "emerald_bio", name: "Emerald Bio", bg: "#064E3B", accent: "#34D399" }
              ],
              layouts: [
                "title_cover", "stats_metrics", "two_column_content", "feature_grid", "quote_callout", "timeline_process"
              ]
            }, null, 2),
          },
        ],
      };
    }

    if (name === "generate_from_outline") {
      const result = await httpPost(`${BACKEND_API_BASE}/api/generate-from-outline`, args);
      return {
        content: [
          {
            type: "text",
            text: `✅ Custom presentation generated!\n\n` +
                  `🔗 Download URL: ${result.downloadUrl}\n` +
                  `📁 Filename: ${result.filename}`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error executing MCP tool '${name}': ${error.message}`,
        },
      ],
    };
  }
});

// Start Stdio Server Transport for Claude Desktop / ChatGPT / Cursor
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Presenton MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error starting MCP Server:", error);
  process.exit(1);
});
