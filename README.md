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
    layout.tsx
    page.tsx
requirements.txt
```

## Custom renderer keys

- `plugintextinput`
- `pluginstatscard`
- `pluginsentimentbadge`

## Plugin API

After installation and backend reload, the API is available at:

```txt
GET  /api/interactive/mockup/text-lab/health
POST /api/interactive/mockup/text-lab/analyze
```

Example payload:

```json
{ "text": "CGNodes plugins are useful." }
```

## Frontend workflow template

The plugin installs a frontend template at:

```txt
/workflows/mockup
```

It calls the plugin API and renders a small text analysis dashboard.

Install it from CGNodes via **Settings → Package Manager** using this repository URL.
