# TODO

- Refactor popup.js
- [ ] SVG -> PNG extension icons
  Icons should generally be in PNG format because PNG has the best support for transparency. However, they can be in any format supported by WebKit, including BMP, GIF, ICO, and JPEG.
  The manifest file should include the icons in the following format:
  "icons": { "16": "icon16.png", "48": "icon48.png", "128": "icon128.png" }

  It is also recommended to include additional sizes such as 19x19 and 38x38 for browser action icons.
- [ ] Much simpler styling
- [ ] extension main width is 330px
- [ ] Make copilot to write docs that pass linter
