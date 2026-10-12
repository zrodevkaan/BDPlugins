# Kaan's BetterDiscord Plugins

Nothing else here

## Plugin manifests

Each buildable folder under `src/` has a `manifest.json` containing its BetterDiscord metadata:

```json
{
  "name": "ExamplePlugin",
  "author": "Kaan",
  "version": "1.0.0",
  "description": "An example plugin.",
  "changelog": [
    {
      "version": "1.0.0",
      "title": "Initial release",
      "type": "added",
      "items": ["Added the plugin."]
    }
  ]
}
```

`name` and `version` are required. `author`, `description`, and `icon` are optional. `changelog`
is an array of BetterDiscord changelog entries ordered newest to oldest. Each entry requires a
semantic `version`, `title`, `type` (`added`, `improved`, `fixed`, or `progress`), and `items` array;
`blurb` is optional. Call `ChangeLog()` from the plugin's `start()` method to show entries newer
than the version previously seen by that plugin. A fresh install shows only the newest entry
applicable to its current version.
