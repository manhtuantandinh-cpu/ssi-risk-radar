#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path

path = Path("scripts/fetch-news.mjs")
text = path.read_text()

text = text.replace("const MAX_ITEMS = 40;", "const MAX_ITEMS = 80;")

extra_feeds = '''  {
    name: "VnExpress - Kinh doanh",
    url: "https://vnexpress.net/rss/kinh-doanh.rss",
    host: "vnexpress.net",
  },
  {
    name: "VnExpress - Tin mới nhất",
    url: "https://vnexpress.net/rss/tin-moi-nhat.rss",
    host: "vnexpress.net",
  },
  {
    name: "Thanh Niên - Kinh tế",
    url: "https://thanhnien.vn/rss/kinh-te.rss",
    host: "thanhnien.vn",
  },
  {
    name: "Thanh Niên - Chứng khoán",
    url: "https://thanhnien.vn/rss/kinh-te/chung-khoan.rss",
    host: "thanhnien.vn",
  },
  {
    name: "Thanh Niên - Ngân hàng",
    url: "https://thanhnien.vn/rss/kinh-te/ngan-hang.rss",
    host: "thanhnien.vn",
  },
  {
    name: "Thanh Niên - Doanh nghiệp",
    url: "https://thanhnien.vn/rss/kinh-te/doanh-nghiep.rss",
    host: "thanhnien.vn",
  },
  {
    name: "VnEconomy - Tài chính",
    url: "https://vneconomy.vn/tai-chinh.rss",
    host: "vneconomy.vn",
  },
  {
    name: "VnEconomy - Chứng khoán",
    url: "https://vneconomy.vn/chung-khoan.rss",
    host: "vneconomy.vn",
  },
  {
    name: "VnEconomy - Doanh nghiệp",
    url: "https://vneconomy.vn/nhip-cau-doanh-nghiep.rss",
    host: "vneconomy.vn",
  },
  {
    name: "VnEconomy - Đầu tư",
    url: "https://vneconomy.vn/dau-tu.rss",
    host: "vneconomy.vn",
  },
'''

if "VnExpress - Kinh doanh" not in text:
    marker = "];\n\nfunction getTag"
    text = text.replace(marker, extra_feeds + "];\n\nfunction getTag")

old_decode = '''function decodeXml(value = "") {
  return value
    .replace(/&nbsp;/g, " ")'''
new_decode = '''function decodeXml(value = "") {
  return value
    .replace(/&#(\\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")'''
text = text.replace(old_decode, new_decode)

old_match = '''function findCompetitor(title, description) {
  const normalized = normalizeText(`${title} ${description}`);
  return competitors.find((competitor) =>
    competitor.aliases.some((alias) => normalized.includes(normalizeText(alias))),
  );
}'''
new_match = '''function findCompetitor(title, description) {
  const normalized = normalizeText(`${title} ${description}`);
  return competitors.find((competitor) =>
    competitor.aliases.some((alias) => {
      const normalizedAlias = normalizeText(alias);
      return (
        normalized === normalizedAlias ||
        normalized.startsWith(`${normalizedAlias} `) ||
        normalized.endsWith(` ${normalizedAlias}`) ||
        normalized.includes(` ${normalizedAlias} `)
      );
    }),
  );
}'''
text = text.replace(old_match, new_match)

path.write_text(text)

app = Path("app.js")
app_text = app.read_text()
app_text = app_text.replace("let dailyOffset = 0;", "let dailyOffset = 0;\nlet dataFeedCount = 0;")
app_text = app_text.replace(
    "newsItems = embeddedItems;\n    themeLabels",
    "newsItems = embeddedItems;\n    dataFeedCount = Array.isArray(window.__SSI_NEWS_DATA__?.feeds) ? window.__SSI_NEWS_DATA__.feeds.length : 0;\n    themeLabels",
)
app_text = app_text.replace(
    "newsItems = loadedItems;\n    themeLabels",
    "newsItems = loadedItems;\n    dataFeedCount = Array.isArray(payload.feeds) ? payload.feeds.length : 0;\n    themeLabels",
)
app_text = app_text.replace(
    'dom.dataStatus.textContent = `${newsItems.length} bài từ RSS gốc trong 7 ngày gần nhất. Chỉ giữ bài có URL báo thật và nhắc đúng đối thủ.`;',
    'const feedLabel = dataFeedCount ? `${dataFeedCount} nguồn RSS gốc` : "các nguồn RSS gốc";\n    dom.dataStatus.textContent = `${newsItems.length} bài từ ${feedLabel} trong 7 ngày gần nhất. Chỉ giữ bài có URL báo thật và nhắc đúng đối thủ.`;',
)
app.write_text(app_text)
PY

node --check scripts/fetch-news.mjs
node --check app.js
node scripts/fetch-news.mjs

git add scripts/fetch-news.mjs app.js data/news.json data/news-data.js README.md HUONG_DAN_GO_LIVE.md
git commit -m "Expand original RSS news sources"
git push
