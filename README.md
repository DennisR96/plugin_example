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
  inputs/...    # compatibility copy for package-manager variants
  outputs/...   # compatibility copy for package-manager variants
requirements.txt
```

## Custom renderer keys

- `plugintextinput`
- `pluginstatscard`
- `pluginsentimentbadge`

Install it from CGNodes via **Settings → Package Manager** using this repository URL.
