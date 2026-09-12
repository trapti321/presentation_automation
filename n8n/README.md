# n8n Presentation Automation Workflow Guide

This directory contains the ready-to-import n8n workflow for automated presentation generation.

## File Included
- [`n8n_presentation_workflow.json`](file:///Users/kt/workspace/presenton-automation/n8n/n8n_presentation_workflow.json)

---

## Workflow Architecture

```
[Webhook Trigger] ➔ [Prepare Payload] ➔ [PPTX Generator Engine] ➔ [Respond to Webhook]
```

1. **Webhook Trigger**: Exposes `POST /webhook/generate-presentation` to accept incoming prompt instructions, theme choice, and slide count.
2. **Prepare Payload**: Formats request parameters into structured JSON.
3. **PPTX Generator Engine**: Calls the backend engine at `http://localhost:5001/webhook/n8n-generate` to generate slide structure and render the native 16:9 `.pptx` PowerPoint file.
4. **Respond to Webhook**: Returns presentation metadata, `downloadUrl`, `filename`, `slideCount`, and base64 binary presentation payload.

---

## How to Import into n8n

1. Open your n8n dashboard (e.g. `http://localhost:5678`).
2. Click **Workflows** in the sidebar.
3. Click **Add Workflow** ➔ **Import from File...**
4. Select [`n8n_presentation_workflow.json`](file:///Users/kt/workspace/presenton-automation/n8n/n8n_presentation_workflow.json).
5. Toggle the workflow to **Active**.

---

## Sample Test Requests

### 1. Test via cURL

```bash
curl -X POST http://localhost:5678/webhook/generate-presentation \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "AI in Healthcare - Diagnostics & Patient Care",
    "theme": "modern_dark",
    "numSlides": 5
  }'
```

### 2. Direct Engine Webhook Verification (No n8n server required)

You can also test the n8n webhook endpoint directly against the running backend server:

```bash
curl -X POST http://localhost:5001/webhook/n8n-generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "SaaS Product Roadmap 2026",
    "theme": "vibrant_neon",
    "numSlides": 5
  }'
```

---

## Expected Response Payload

```json
{
  "status": "success",
  "source": "n8n_webhook",
  "presentationId": "presentation_1789198073824_yrvgc",
  "filename": "presentation_1789198073824_yrvgc.pptx",
  "downloadUrl": "http://localhost:5001/api/download/presentation_1789198073824_yrvgc.pptx",
  "slideCount": 5,
  "presentation": {
    "presentationTitle": "SaaS Product Roadmap 2026",
    "slides": [ ... ]
  }
}
```
