# CGNodes Mockup Plugin

A minimal CGNodes plugin repository used to demonstrate how external packages can add nodes to the backend.

This package includes three backend nodes and a few custom frontend renderer mockups.

## Structure

```txt
api/
  text_lab.py
nodes/
  text_lab/
    prompt_template.py
    text_stats.py
    mock_sentiment.py
ui/
  input/PluginTextInput/Render.tsx
  output/PluginStatsCard/Render.tsx
  output/PluginSentimentBadge/Render.tsx
workflows/
  mockup/
    api/
      analyze/
        route.ts
    layout.tsx
    page.tsx
requirements.txt
```

## Custom renderer keys

- `plugintextinput`
- `pluginstatscard`
- `pluginsentimentbadge`

## Workflow API

The installed workflow template includes its own Next.js route, so it does not depend on CGNodes backend dynamic API discovery:

```txt
POST /workflows/mockup/api/analyze
```

The backend FastAPI implementation is still included in `api/text_lab.py` for hosts that register plugin APIs from the plugin `api/` directory.

Example payload:

```json
{ "text": "CGNodes plugins are useful." }
```

## Frontend workflow template

The plugin installs a frontend template at:

```txt
/workflows/mockup
```

It calls the co-installed workflow API and renders a small text analysis dashboard.

Install it from CGNodes via **Settings → Package Manager** using this repository URL.
