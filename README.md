# CGNodes Mockup Plugin

A minimal CGNodes plugin repository used to demonstrate how external packages can add nodes to the backend.

This package includes three backend nodes and a few custom frontend renderer mockups.

## Structure

```txt
nodes/
  text_lab/
    prompt_template.py
    text_stats.py
    mock_sentiment.py
ui/
  input/PluginTextInput/Render.tsx
  output/PluginStatsCard/Render.tsx
  output/PluginSentimentBadge/Render.tsx
api/
  text_lab.py
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

The installed package includes FastAPI endpoints from the top-level `api` folder:

```txt
GET  /interactive/mockup/text-lab/health
POST /interactive/mockup/text-lab/analyze
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

It calls the co-installed plugin API and renders a small text analysis dashboard.

Install it from CGNodes via **Settings → Package Manager** using this repository URL.
