import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";

const OUTPUT_FILE = "data/news.json";
const JS_OUTPUT_FILE = "data/news-data.js";
const MAX_ITEMS = 220;
const ARCHIVE_DAYS = 90;

const competitors = [
  {
    id: "ssi",
    aliases: ["ssi", "chứng khoán ssi", "ctcp chứng khoán ssi", "ssi securities"],
  },
  {
    id: "vps",
    aliases: ["vps", "ctcp chứng khoán vps", "chứng khoán vps"],
  },
  {
    id: "tcbs",
    aliases: ["tcbs", "techcom securities", "chứng khoán kỹ thương", "chứng khoán techcom"],
  },
  {
    id: "vci",
    aliases: ["vci", "vietcap", "bản việt", "chứng khoán bản việt", "vietcap securities"],
  },
  {
    id: "hsc",
    aliases: ["hsc", "chứng khoán tp.hcm", "chứng khoán tp hcm", "hochiminh city securities"],
  },
  {
    id: "mbs",
    aliases: ["mbs", "chứng khoán mb", "mb securities", "ctcp chứng khoán mb"],
  },
  {
    id: "mas",
    aliases: ["mirae asset", "masvn", "mirae asset securities"],
  },
  {
    id: "vnds",
    aliases: ["vndirect", "vnds", "vnd", "chứng khoán vndirect"],
  },
  {
    id: "yuanta",
    aliases: ["yuanta", "chứng khoán yuanta", "yuanta việt nam", "yuanta securities"],
  },
  {
    id: "dnse",
    aliases: ["dnse", "chứng khoán dnse", "dnse securities"],
  },
  {
    id: "fpts",
    aliases: ["fpts", "chứng khoán fpt", "fpt securities"],
  },
  {
    id: "vpbanks",
    aliases: [
      "vpx",
      "vpbanks",
      "vpbank s",
      "vpbank securities",
      "vpbanksecurities",
      "vpbank securities jsc",
      "chứng khoán vpbank",
      "ctcp chứng khoán vpbank",
    ],
  },
  {
    id: "kis",
    aliases: ["kis", "chứng khoán kis", "kis việt nam", "kis securities"],
  },
  {
    id: "kafi",
    aliases: ["kafi", "chứng khoán kafi", "kafi securities"],
  },
];

const feeds = [
  {
    name: "CafeF - Thị trường chứng khoán",
    url: "https://cafef.vn/thi-truong-chung-khoan.rss",
    host: "cafef.vn",
  },
  {
    name: "CafeF - Tài chính ngân hàng",
    url: "https://cafef.vn/tai-chinh-ngan-hang.rss",
    host: "cafef.vn",
  },
  {
    name: "CafeF - Doanh nghiệp",
    url: "https://cafef.vn/doanh-nghiep.rss",
    host: "cafef.vn",
  },
  {
    name: "Vietstock - Cổ phiếu",
    url: "https://vietstock.vn/830/chung-khoan/co-phieu.rss",
    host: "vietstock.vn",
  },
  {
    name: "Vietstock - Chứng khoán phái sinh",
    url: "https://vietstock.vn/418/chung-khoan/chung-khoan-phai-sinh.rss",
    host: "vietstock.vn",
  },
  {
    name: "Vietstock - Trái phiếu",
    url: "https://vietstock.vn/785/chung-khoan/trai-phieu.rss",
    host: "vietstock.vn",
  },
  {
    name: "Vietstock - Hoạt động kinh doanh",
    url: "https://vietstock.vn/737/doanh-nghiep/hoat-dong-kinh-doanh.rss",
    host: "vietstock.vn",
  },
  {
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
];

const officialArticles = [
  {
    competitorId: "ssi",
    source: "SSI - Chính sách margin",
    url: "https://www.ssi.com.vn/tin-tuc/tin-tuc-su-kien-ssi/ra-mat-goi-nhap-cuoc-voi-lai-suat-9-danh-cho-khach-hang-dung-margin-lan-dau",
    host: "ssi.com.vn",
  },
  {
    competitorId: "ssi",
    source: "SSI - Margin loan",
    url: "https://www.ssi.com.vn/en/individual-customer/margin-loan",
    host: "ssi.com.vn",
  },
  {
    competitorId: "vps",
    source: "VPS - Margin FAQ",
    url: "https://www.vps.com.vn/ca-nhan/ho-tro/cau-hoi-thuong-gap/lai-suat-vay-khi-su-dung-san-pham-ky-quy-margin-la-bao-nhieu",
    host: "vps.com.vn",
  },
  {
    competitorId: "vps",
    source: "VPS - Margin trading service",
    url: "https://vps.com.vn/en/retail-sales/products-services/margin-trading-service",
    host: "vps.com.vn",
  },
  {
    competitorId: "tcbs",
    source: "TCBS - Margin 789",
    url: "https://www.tcbs.com.vn/ca-nhan/uu-dai/margin-789/",
    host: "tcbs.com.vn",
  },
  {
    competitorId: "tcbs",
    source: "TCBS Help - Chính sách margin",
    url: "https://help.tcbs.com.vn/chinh-sach-margin/",
    host: "help.tcbs.com.vn",
  },
  {
    competitorId: "tcbs",
    source: "TCBS Help - Vay ký quỹ",
    url: "https://help.tcbs.com.vn/vay-ky-quy-margin/",
    host: "help.tcbs.com.vn",
  },
  {
    competitorId: "vci",
    source: "Vietcap - Dịch vụ margin",
    url: "https://www.vietcap.com.vn/san-pham-tai-chinh/huong-dan-chung-khoan-co-so/dich-vu-margin",
    host: "vietcap.com.vn",
  },
  {
    competitorId: "vci",
    source: "Vietcap - Kiến thức margin",
    url: "https://www.vietcap.com.vn/tin-tuc/cach-su-dung-margin-hieu-qua-va-tranh-rui-ro",
    host: "vietcap.com.vn",
  },
  {
    competitorId: "hsc",
    source: "HSC - Margin lending",
    url: "https://www.hsc.com.vn/en/hsc-margin-lending",
    host: "hsc.com.vn",
  },
  {
    competitorId: "hsc",
    source: "HSC Online - Sử dụng margin",
    url: "https://online.hsc.com.vn/tin-tuc/de-dau-tu-chung-khoan-hieu-qua/lam-the-nao-de-su-dung-margin-hieu-qua.html",
    host: "online.hsc.com.vn",
  },
  {
    competitorId: "mbs",
    source: "MBS - Phí và lãi suất margin",
    url: "https://mbs.com.vn/vi/goc-truyen-thong/tin-tuc-mbs/phi-giao-dich-va-lai-suat-margin-mbs-online/",
    host: "mbs.com.vn",
  },
  {
    competitorId: "mas",
    source: "Mirae Asset - Margin 6.99%",
    url: "https://www.masvn.com/article/margin-699-lai-suat-sieu-hoi-dau-tu-them-loi-1084074",
    host: "masvn.com",
  },
  {
    competitorId: "mas",
    source: "Mirae Asset - Danh mục margin",
    url: "https://www.masvn.com/article/chung-khoan-mirae-asset-cap-nhat-danh-muc-chung-khoan-duoc-giao-dich-ky-quy-va-gia-chanmirae-asset-securities-viet-nam-jsc-update-on-the-margin-trading-securities-list-749887",
    host: "masvn.com",
  },
  {
    competitorId: "vnds",
    source: "VNDirect - Margin",
    url: "https://support.vndirect.com.vn/hc/vi/articles/360002244373-MARGIN-GIAO-D%E1%BB%8ACH-K%C3%9D-QU%E1%BB%B8-VNDIRECT",
    host: "support.vndirect.com.vn",
  },
  {
    competitorId: "vnds",
    source: "VNDirect - Biểu phí lãi margin",
    url: "https://www.vndirect.com.vn/bieu-phi-lai-margin/",
    host: "vndirect.com.vn",
  },
  {
    competitorId: "yuanta",
    source: "Yuanta - Sử dụng margin",
    url: "https://yuanta.com.vn/tin-tuc/khi-nao-nen-su-dung-margin-goi-y-tu-chuyen-gia-dau-tu-chung-khoan",
    host: "yuanta.com.vn",
  },
  {
    competitorId: "yuanta",
    source: "Yuanta - Hướng dẫn margin",
    url: "https://yuanta.com.vn/tin-tuc/huong-dan-giao-dich-margin-hieu-qua-cho-nha-dau-tu-f0-va-f1",
    host: "yuanta.com.vn",
  },
  {
    competitorId: "dnse",
    source: "DNSE - Margin X",
    url: "https://www.dnse.com.vn/san-pham/margin",
    host: "dnse.com.vn",
  },
  {
    competitorId: "dnse",
    source: "DNSE - Margin 5.99%",
    url: "https://www.dnse.com.vn/margin599",
    host: "dnse.com.vn",
  },
  {
    competitorId: "fpts",
    source: "FPTS - Margin trading",
    url: "https://www.fpts.com.vn/customer-service/financial-services/margin-trading/margin-trading-by-item/",
    host: "fpts.com.vn",
  },
  {
    competitorId: "fpts",
    source: "FPTS - Margin T+",
    url: "https://www.fpts.com.vn/products-services/securities-trading/financial-services/margin-trading-by-item/margin/margin-tplus/",
    host: "fpts.com.vn",
  },
  {
    competitorId: "vpbanks",
    source: "VPBankS - eMargin",
    url: "https://www.vpbanks.com.vn/emargin-2",
    host: "vpbanks.com.vn",
  },
  {
    competitorId: "kis",
    source: "KIS - Margin K+",
    url: "https://kisvn.vn/san-pham-dich-vu/margin/san-pham-margin/",
    host: "kisvn.vn",
  },
  {
    competitorId: "kis",
    source: "KIS - Ứng trước",
    url: "https://kisvn.vn/san-pham-dich-vu/margin/ung-truoc/",
    host: "kisvn.vn",
  },
  {
    competitorId: "kafi",
    source: "KAFI - Margin",
    url: "https://kafi.vn/",
    host: "kafi.vn",
  },
  {
    competitorId: "kafi",
    source: "KAFI - Margin Zero",
    url: "https://kafi.vn/margin-zero",
    host: "kafi.vn",
  },
];

function getTag(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? cleanText(match[1]) : "";
}

function cleanText(value = "") {
  return decodeXml(value)
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeXml(value = "") {
  const namedEntities = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    agrave: "à",
    aacute: "á",
    acirc: "â",
    atilde: "ã",
    egrave: "è",
    eacute: "é",
    ecirc: "ê",
    igrave: "ì",
    iacute: "í",
    ograve: "ò",
    oacute: "ó",
    ocirc: "ô",
    otilde: "õ",
    ugrave: "ù",
    uacute: "ú",
    yacute: "ý",
    Agrave: "À",
    Aacute: "Á",
    Acirc: "Â",
    Atilde: "Ã",
    Egrave: "È",
    Eacute: "É",
    Ecirc: "Ê",
    Igrave: "Ì",
    Iacute: "Í",
    Ograve: "Ò",
    Oacute: "Ó",
    Ocirc: "Ô",
    Otilde: "Õ",
    Ugrave: "Ù",
    Uacute: "Ú",
    Yacute: "Ý",
  };

  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&([a-zA-Z]+);/g, (match, entity) => namedEntities[entity] ?? match);
}

function normalizeText(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^\p{L}\p{N}\s.]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, maxLength = 230) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}…`;
}

function getMetaContent(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return cleanText(match[1]);
  }

  return "";
}

function getHtmlTag(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? cleanText(match[1]) : "";
}

function getRelevantExcerpt(text) {
  const normalized = normalizeText(text);
  const keywords = ["margin", "ky quy", "lai suat", "cho vay", "ung truoc", "han muc", "phi giao dich"];
  const index = keywords
    .map((keyword) => normalized.indexOf(keyword))
    .filter((position) => position >= 0)
    .sort((a, b) => a - b)[0];

  if (index === undefined) return truncate(text, 260);

  const start = Math.max(0, index - 140);
  return truncate(text.slice(start, start + 420).trim(), 260);
}

function makeId(competitorId, title, url) {
  const hash = createHash("sha1").update(`${competitorId}:${title}:${url}`).digest("hex").slice(0, 10);
  return `${competitorId}-${hash}`;
}

function inferTheme(text) {
  const normalized = normalizeText(text);
  if (["margin", "room", "lai suat", "cho vay", "vay ky quy"].some((word) => normalized.includes(word))) {
    return "Margin";
  }
  if (["to chuc", "nuoc ngoai", "block deal", "ib", "huy dong von"].some((word) => normalized.includes(word))) {
    return "Khách hàng tổ chức";
  }
  if (["app", "ai", "mobile", "nen tang", "cong nghe", "so hoa"].some((word) => normalized.includes(word))) {
    return "Sản phẩm số";
  }
  return "Môi giới";
}

function isWithinArchive(publishedAt) {
  const publishedTime = new Date(publishedAt).getTime();
  if (!Number.isFinite(publishedTime)) return false;

  const cutoffTime = Date.now() - ARCHIVE_DAYS * 24 * 60 * 60 * 1000;
  return publishedTime >= cutoffTime;
}

function findCompetitor(title, description) {
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
}

function isOriginalArticleUrl(url, host) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === host || parsed.hostname.endsWith(`.${host}`);
  } catch {
    return false;
  }
}

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function getHostLabel(url) {
  return getHostname(url).replace(/^www\./, "");
}

function parseRss(xml, feed) {
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

  return itemBlocks
    .map((block) => {
      const title = getTag(block, "title");
      const description = getTag(block, "description");
      const url = getTag(block, "link");
      const pubDate = getTag(block, "pubDate");
      const competitor = findCompetitor(title, description);

      if (!title || !url || !competitor || !isOriginalArticleUrl(url, feed.host)) {
        return null;
      }

      const publishedAt = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();
      if (!isWithinArchive(publishedAt)) {
        return null;
      }

      const content = `${title}. ${description}`;

      return {
        id: makeId(competitor.id, title, url),
        competitorId: competitor.id,
        source: feed.name,
        url,
        theme: inferTheme(content),
        title,
        summary: truncate(description || title),
        content,
        publishedAt,
      };
    })
    .filter(Boolean);
}

async function fetchFeed(feed) {
  const response = await fetch(feed.url, {
    headers: {
      "user-agent": "SSI Competitive Risk Radar/1.0",
      accept: "application/rss+xml, application/xml, text/xml",
    },
  });

  if (!response.ok) {
    throw new Error(`RSS failed for ${feed.name}: ${response.status}`);
  }

  const xml = await response.text();
  return parseRss(xml, feed);
}

async function fetchOfficialArticle(article, existingByUrl) {
  const response = await fetch(article.url, {
    headers: {
      "user-agent": "SSI Competitive Risk Radar/1.0",
      accept: "text/html,application/xhtml+xml,application/xml",
    },
  });

  if (!isOriginalArticleUrl(article.url, article.host)) {
    return null;
  }

  const html = await response.text();
  if (!response.ok && !/<html|<title|<h1|<meta/i.test(html)) {
    throw new Error(`Official page failed for ${article.source}: ${response.status}`);
  }

  const plainText = cleanText(html);
  const title =
    article.title ||
    getMetaContent(html, "og:title") ||
    getHtmlTag(html, "h1") ||
    getHtmlTag(html, "title") ||
    article.source;
  const description =
    getMetaContent(html, "description") ||
    getMetaContent(html, "og:description") ||
    getRelevantExcerpt(plainText) ||
    title;
  const content = `${title}. ${description}. ${getRelevantExcerpt(plainText)}`;
  const existing = existingByUrl.get(article.url);
  const publishedAt = existing?.publishedAt || article.publishedAt || new Date().toISOString();

  if (!isWithinArchive(publishedAt)) {
    return null;
  }

  return {
    id: makeId(article.competitorId, title, article.url),
    competitorId: article.competitorId,
    source: article.source || `Official - ${getHostLabel(article.url)}`,
    url: article.url,
    theme: inferTheme(content),
    title,
    summary: truncate(description || title),
    content,
    publishedAt,
    sourceType: "official-company-site",
  };
}

async function readExistingNews() {
  if (!existsSync(OUTPUT_FILE)) return [];
  try {
    const payload = JSON.parse(await readFile(OUTPUT_FILE, "utf8"));
    return Array.isArray(payload.items) ? payload.items : [];
  } catch {
    return [];
  }
}

function dedupeItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.url || `${item.competitorId}:${item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(item.title && item.url && item.competitorId);
  });
}

function filterExistingStrict(items) {
  return items
    .map((item) => {
      const competitor = findCompetitor(item.title, item.summary || item.content || "");
      return competitor ? { ...item, competitorId: competitor.id } : null;
    })
    .filter((item) => item && isWithinArchive(item.publishedAt));
}

async function main() {
  const existingItems = filterExistingStrict(await readExistingNews());
  const existingByUrl = new Map(existingItems.map((item) => [item.url, item]));
  const batches = await Promise.allSettled(feeds.map(fetchFeed));
  const fetchedItems = batches.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  const officialBatches = await Promise.allSettled(
    officialArticles.map((article) => fetchOfficialArticle(article, existingByUrl)),
  );
  const officialItems = officialBatches
    .flatMap((result) => (result.status === "fulfilled" && result.value ? [result.value] : []));
  const items = dedupeItems([...fetchedItems, ...officialItems, ...existingItems])
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, MAX_ITEMS);

  const payload = {
        generatedAt: new Date().toISOString(),
        source: "Original publisher RSS and official company site archive",
        archiveDays: ARCHIVE_DAYS,
        fetchedItems: fetchedItems.length,
        officialItems: officialItems.length,
        feeds: feeds.map(({ name, url }) => ({ name, url })),
        officialSources: officialArticles.map(({ competitorId, source, url }) => ({ competitorId, source, url })),
    items,
  };

  await mkdir("data", { recursive: true });
  await writeFile(OUTPUT_FILE, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(JS_OUTPUT_FILE, `window.__SSI_NEWS_DATA__ = ${JSON.stringify(payload, null, 2)};\n`);

  console.log(`Wrote ${items.length} verified original RSS items to ${OUTPUT_FILE} and ${JS_OUTPUT_FILE}.`);
  if (!items.length) {
    console.log("No strict competitor-matching articles found today. The website will show an empty state.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
