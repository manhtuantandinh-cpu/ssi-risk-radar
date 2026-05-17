#!/usr/bin/env bash
set -euo pipefail

mkdir -p assets

cat > assets/ssi-logo.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 96" role="img" aria-labelledby="title desc">
  <title id="title">SSI</title>
  <desc id="desc">SSI logo-style mark for the competitive radar dashboard.</desc>
  <rect width="240" height="96" rx="12" fill="#e30613"/>
  <g fill="#fff">
    <path d="M38 28h55v11H48c-5 0-9 4-9 9s4 9 9 9h26c12 0 22 10 22 22s-10 22-22 22H25V90h49c6 0 11-5 11-11s-5-11-11-11H48c-12 0-21-9-21-20s9-20 21-20z" transform="scale(.8) translate(0 0)"/>
    <path d="M116 28h55v11h-45c-5 0-9 4-9 9s4 9 9 9h26c12 0 22 10 22 22s-10 22-22 22h-49V90h49c6 0 11-5 11-11s-5-11-11-11h-26c-12 0-21-9-21-20s9-20 21-20z" transform="scale(.8) translate(10 0)"/>
    <rect x="180" y="22" width="14" height="52" rx="3"/>
    <rect x="206" y="22" width="14" height="52" rx="3"/>
  </g>
  <text x="30" y="79" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="2">SECURITIES</text>
</svg>
SVG

python3 - <<'PY'
from pathlib import Path

index = Path("index.html")
html = index.read_text()
old = '''      <header class="topbar">
        <div>
          <p class="eyebrow">SSI Competitive Intelligence</p>
          <h1>Radar rủi ro đối thủ</h1>
        </div>'''
new = '''      <header class="topbar">
        <div class="brand-lockup">
          <img class="ssi-logo" src="assets/ssi-logo.svg" alt="SSI" />
          <div>
            <p class="eyebrow">SSI Competitive Intelligence</p>
            <h1>Radar rủi ro đối thủ</h1>
          </div>
        </div>'''
if "assets/ssi-logo.svg" not in html:
    html = html.replace(old, new)
index.write_text(html)

styles = Path("styles.css")
css = styles.read_text()
logo_css = '''
.brand-lockup {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.ssi-logo {
  width: clamp(86px, 12vw, 128px);
  height: auto;
  flex: 0 0 auto;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(160, 0, 16, 0.18);
}
'''
if ".brand-lockup" not in css:
    css = css.replace(".topbar h1 {", logo_css + "\n.topbar h1 {")
if ".topbar {\n    display: grid;" in css and ".brand-lockup {\n    align-items: flex-start;" not in css:
    css = css.replace(
        "  .topbar {\n    display: grid;\n    align-items: start;\n  }",
        "  .topbar {\n    display: grid;\n    align-items: start;\n  }\n\n  .brand-lockup {\n    align-items: flex-start;\n  }",
    )
if "@media (max-width: 520px)" in css and ".ssi-logo {\n    width: 96px;" not in css:
    css = css.replace(
        "  .topbar h1 {\n    font-size: 2.3rem;\n  }",
        "  .topbar h1 {\n    font-size: 2.3rem;\n  }\n\n  .brand-lockup {\n    display: grid;\n    gap: 12px;\n  }\n\n  .ssi-logo {\n    width: 96px;\n  }",
    )
styles.write_text(css)
PY

git add index.html styles.css assets/ssi-logo.svg
git commit -m "Add SSI logo to dashboard"
git push
