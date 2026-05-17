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
  const batches = await Promise.allSettled(feeds.map(fetchFeed));
  const fetchedItems = batches.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  const existingItems = filterExistingStrict(await readExistingNews());
  const items = dedupeItems([...fetchedItems, ...existingItems])
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, MAX_ITEMS);

  const payload = {
        generatedAt: new Date().toISOString(),
        source: "Original publisher RSS archive",
        archiveDays: ARCHIVE_DAYS,
        fetchedItems: fetchedItems.length,
        feeds: feeds.map(({ name, url }) => ({ name, url })),
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
