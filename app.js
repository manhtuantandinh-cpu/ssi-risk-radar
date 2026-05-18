const competitors = [
  {
    id: "ssi",
    name: "SSI",
    focus: "Điểm chuẩn nội bộ, thị phần môi giới, IB, khách hàng tổ chức",
    baseRisk: 50,
    sensitivity: {
      "Môi giới": 74,
      "Margin": 68,
      "Sản phẩm số": 62,
      "Khách hàng tổ chức": 86,
    },
  },
  {
    id: "vps",
    name: "VPS",
    focus: "Thị phần môi giới, phái sinh, phí giao dịch",
    baseRisk: 68,
    sensitivity: {
      "Môi giới": 86,
      "Margin": 74,
      "Sản phẩm số": 66,
      "Khách hàng tổ chức": 42,
    },
  },
  {
    id: "tcbs",
    name: "TCBS",
    focus: "Wealth platform, trái phiếu, tư vấn tài sản",
    baseRisk: 64,
    sensitivity: {
      "Môi giới": 54,
      "Margin": 58,
      "Sản phẩm số": 83,
      "Khách hàng tổ chức": 49,
    },
  },
  {
    id: "vci",
    name: "VCI",
    focus: "Ngân hàng đầu tư, khách hàng tổ chức, nghiên cứu",
    baseRisk: 58,
    sensitivity: {
      "Môi giới": 55,
      "Margin": 52,
      "Sản phẩm số": 46,
      "Khách hàng tổ chức": 84,
    },
  },
  {
    id: "hsc",
    name: "HSC",
    focus: "Khách hàng tổ chức, phân tích, ngân hàng đầu tư",
    baseRisk: 55,
    sensitivity: {
      "Môi giới": 52,
      "Margin": 54,
      "Sản phẩm số": 43,
      "Khách hàng tổ chức": 82,
    },
  },
  {
    id: "mbs",
    name: "MBS",
    focus: "Hệ sinh thái MB, khách hàng cá nhân, môi giới và margin",
    baseRisk: 60,
    sensitivity: {
      "Môi giới": 67,
      "Margin": 72,
      "Sản phẩm số": 61,
      "Khách hàng tổ chức": 48,
    },
  },
  {
    id: "mas",
    name: "Mirae Asset Securities",
    focus: "Cho vay margin, nhà đầu tư cá nhân, sản phẩm Hàn Quốc",
    baseRisk: 57,
    sensitivity: {
      "Môi giới": 61,
      "Margin": 82,
      "Sản phẩm số": 52,
      "Khách hàng tổ chức": 37,
    },
  },
  {
    id: "vnds",
    name: "VNDS",
    focus: "Nhà đầu tư cá nhân, app giao dịch, nội dung tư vấn",
    baseRisk: 59,
    sensitivity: {
      "Môi giới": 70,
      "Margin": 63,
      "Sản phẩm số": 72,
      "Khách hàng tổ chức": 45,
    },
  },
  {
    id: "yuanta",
    name: "YUANTA",
    focus: "Nhà đầu tư cá nhân, môi giới, báo cáo chiến lược",
    baseRisk: 53,
    sensitivity: {
      "Môi giới": 58,
      "Margin": 55,
      "Sản phẩm số": 48,
      "Khách hàng tổ chức": 44,
    },
  },
  {
    id: "dnse",
    name: "DNSE",
    focus: "Nền tảng số, pricing linh hoạt, nhà đầu tư mới",
    baseRisk: 62,
    sensitivity: {
      "Môi giới": 65,
      "Margin": 58,
      "Sản phẩm số": 86,
      "Khách hàng tổ chức": 34,
    },
  },
  {
    id: "fpts",
    name: "FPTS",
    focus: "Môi giới cá nhân, nền tảng giao dịch, khách hàng trung thành",
    baseRisk: 50,
    sensitivity: {
      "Môi giới": 57,
      "Margin": 50,
      "Sản phẩm số": 62,
      "Khách hàng tổ chức": 38,
    },
  },
  {
    id: "vpbanks",
    name: "VPBankS",
    focus: "Nền tảng số, hệ sinh thái VPBank, sản phẩm tài sản cá nhân",
    baseRisk: 61,
    sensitivity: {
      "Môi giới": 64,
      "Margin": 67,
      "Sản phẩm số": 78,
      "Khách hàng tổ chức": 44,
    },
  },
  {
    id: "kis",
    name: "KIS",
    focus: "Nhà đầu tư cá nhân, môi giới, sản phẩm Hàn Quốc",
    baseRisk: 52,
    sensitivity: {
      "Môi giới": 56,
      "Margin": 64,
      "Sản phẩm số": 49,
      "Khách hàng tổ chức": 36,
    },
  },
  {
    id: "kafi",
    name: "KAFI",
    focus: "Nhà đầu tư cá nhân, sản phẩm số, cạnh tranh phí",
    baseRisk: 51,
    sensitivity: {
      "Môi giới": 55,
      "Margin": 48,
      "Sản phẩm số": 68,
      "Khách hàng tổ chức": 32,
    },
  },
];

let newsItems = [];

const keywordRules = [
  {
    words: ["phí", "ưu đãi", "zero fee", "miễn phí"],
    impact: 13,
    reason: "Có tín hiệu cạnh tranh trực tiếp về phí, dễ ảnh hưởng nhóm khách hàng nhạy giá.",
  },
  {
    words: ["margin", "room", "lãi suất", "cho vay"],
    impact: 16,
    reason: "Liên quan năng lực margin, có thể gây áp lực lên dư nợ và biên lãi của SSI.",
  },
  {
    words: ["ai", "cá nhân hóa", "trợ lý", "khuyến nghị"],
    impact: 12,
    reason: "Nâng trải nghiệm tư vấn số, tăng rủi ro giữ chân khách hàng cá nhân.",
  },
  {
    words: ["trái phiếu", "quỹ", "wealth", "quản lý tài sản"],
    impact: 11,
    reason: "Đẩy mạnh hệ sinh thái tài sản, cạnh tranh với chiến lược mở rộng wallet share.",
  },
  {
    words: ["phái sinh", "active trader", "giao dịch tần suất cao"],
    impact: 14,
    reason: "Nhắm vào nhóm tạo thanh khoản lớn, có thể dịch chuyển thị phần môi giới.",
  },
  {
    words: ["tổ chức", "nước ngoài", "block deal", "ngân hàng đầu tư"],
    impact: 15,
    reason: "Chạm vào phân khúc tổ chức và IB, nơi tác động thường lớn dù chu kỳ bán hàng dài.",
  },
  {
    words: ["app", "mobile", "nền tảng", "trải nghiệm số"],
    impact: 10,
    reason: "Cải thiện sản phẩm số, tăng kỳ vọng người dùng với nền tảng giao dịch của SSI.",
  },
];

const morningQuotes = [
  {
    text: "Hãy cứ khát khao, hãy cứ dại khờ.",
    author: "Steve Jobs",
  },
  {
    text: "Thành công là đi từ thất bại này đến thất bại khác mà không mất đi nhiệt huyết.",
    author: "Winston Churchill",
  },
  {
    text: "Việc khó nhất là quyết định hành động; phần còn lại chỉ là sự bền bỉ.",
    author: "Amelia Earhart",
  },
  {
    text: "Không cần phải vĩ đại để bắt đầu, nhưng phải bắt đầu để trở nên vĩ đại.",
    author: "Zig Ziglar",
  },
  {
    text: "Cơ hội thường được ngụy trang dưới dạng công việc khó khăn.",
    author: "Thomas Edison",
  },
  {
    text: "Tri thức là sức mạnh.",
    author: "Francis Bacon",
  },
  {
    text: "Đừng đếm ngày, hãy làm cho từng ngày đáng đếm.",
    author: "Muhammad Ali",
  },
];

let themeLabels = ["Tất cả", ...new Set(newsItems.map((item) => item.theme))];
let selectedCompetitorId = competitors[0].id;
let selectedTheme = "Tất cả";
let dailyOffset = 0;
let dataFeedCount = 0;
let dataOfficialSourceCount = 0;
let dataArchiveDays = 0;

const dom = {
  todayLabel: document.querySelector("#todayLabel"),
  refreshDaily: document.querySelector("#refreshDaily"),
  trackedCount: document.querySelector("#trackedCount"),
  competitorList: document.querySelector("#competitorList"),
  dailyTitle: document.querySelector("#dailyTitle"),
  dailySummary: document.querySelector("#dailySummary"),
  dailyCompetitor: document.querySelector("#dailyCompetitor"),
  dailySource: document.querySelector("#dailySource"),
  dailyTheme: document.querySelector("#dailyTheme"),
  dailyLink: document.querySelector("#dailyLink"),
  quoteText: document.querySelector("#quoteText"),
  quoteAuthor: document.querySelector("#quoteAuthor"),
  meterValue: document.querySelector("#meterValue"),
  riskScore: document.querySelector("#riskScore"),
  riskLevel: document.querySelector("#riskLevel"),
  confidenceLabel: document.querySelector("#confidenceLabel"),
  rationaleList: document.querySelector("#rationaleList"),
  segmentBars: document.querySelector("#segmentBars"),
  themeFilters: document.querySelector("#themeFilters"),
  newsStream: document.querySelector("#newsStream"),
  dataStatus: document.querySelector("#dataStatus"),
  scoreForm: document.querySelector("#scoreForm"),
  manualCompetitor: document.querySelector("#manualCompetitor"),
  manualTitle: document.querySelector("#manualTitle"),
  manualContent: document.querySelector("#manualContent"),
  manualResult: document.querySelector("#manualResult"),
  manualLevel: document.querySelector("#manualLevel"),
  manualScore: document.querySelector("#manualScore"),
  manualReason: document.querySelector("#manualReason"),
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getCompetitor(id) {
  return competitors.find((competitor) => competitor.id === id) || competitors[0];
}

function getDayIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  return Math.floor(diff / 86400000);
}

function getArticleUrl(article = {}) {
  return article.url || "#";
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeNewsItems(items) {
  if (!Array.isArray(items)) return [];
  const canonicalIds = {
    vndirect: "vnds",
    vpx: "vpbanks",
  };

  return items
    .filter((item) => item && item.title && item.competitorId)
    .map((item, index) => ({
      id: item.id || `auto-${index}`,
      competitorId: canonicalIds[item.competitorId] || item.competitorId,
      source: item.source || "RSS",
      url: item.url || "",
      theme: item.theme || inferTheme(`${item.title} ${item.summary || ""}`),
      title: item.title,
      summary: item.summary || item.content || "Chưa có tóm tắt.",
      content: item.content || item.summary || item.title,
      publishedAt: item.publishedAt || "",
    }));
}

async function loadNewsData() {
  const embeddedItems = normalizeNewsItems(window.__SSI_NEWS_DATA__?.items);
  if (embeddedItems.length) {
    newsItems = embeddedItems;
    dataFeedCount = Array.isArray(window.__SSI_NEWS_DATA__?.feeds) ? window.__SSI_NEWS_DATA__.feeds.length : 0;
    dataOfficialSourceCount = Array.isArray(window.__SSI_NEWS_DATA__?.officialSources)
      ? window.__SSI_NEWS_DATA__.officialSources.length
      : 0;
    dataArchiveDays = window.__SSI_NEWS_DATA__?.archiveDays || 0;
    themeLabels = ["Tất cả", ...new Set(newsItems.map((item) => item.theme))];
    selectCompetitorWithNews();
    return;
  }

  try {
    const response = await fetch(`data/news.json?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;

    const payload = await response.json();
    const loadedItems = normalizeNewsItems(payload.items);
    if (!loadedItems.length) return;

    newsItems = loadedItems;
    dataFeedCount = Array.isArray(payload.feeds) ? payload.feeds.length : 0;
    dataOfficialSourceCount = Array.isArray(payload.officialSources) ? payload.officialSources.length : 0;
    dataArchiveDays = payload.archiveDays || 0;
    themeLabels = ["Tất cả", ...new Set(newsItems.map((item) => item.theme))];
    selectCompetitorWithNews();
  } catch (error) {
    console.info("No verified RSS data loaded from data/news.json.", error);
  }
}

function selectCompetitorWithNews() {
  if (newsItems.some((item) => item.competitorId === selectedCompetitorId)) return;
  selectedCompetitorId = newsItems[0]?.competitorId || competitors[0].id;
}

function getLevel(score) {
  if (score >= 76) return { label: "Cao", className: "high", color: "#b53a32" };
  if (score >= 50) return { label: "Trung bình", className: "medium", color: "#c07810" };
  return { label: "Thấp", className: "low", color: "#0c7c59" };
}

function scoreArticle(article) {
  const competitor = getCompetitor(article.competitorId);
  const text = `${article.title} ${article.summary || ""} ${article.content || ""}`.toLowerCase();
  const reasons = [];
  let score = Math.round(competitor.baseRisk * 0.42);
  let matchedWeight = 0;

  keywordRules.forEach((rule) => {
    const matched = rule.words.some((word) => text.includes(word.toLowerCase()));
    if (matched) {
      score += rule.impact;
      matchedWeight += rule.impact;
      reasons.push(rule.reason);
    }
  });

  const segmentBoost = competitor.sensitivity[article.theme] || 52;
  score += Math.round(segmentBoost * 0.22);

  if (text.length > 220) score += 4;
  if (reasons.length === 0) {
    reasons.push("Chưa thấy tín hiệu cạnh tranh rõ; cần theo dõi thêm nguồn xác nhận và số liệu triển khai.");
  }

  const finalScore = clamp(score, 18, 96);
  const confidence = clamp(52 + matchedWeight + (article.summary ? 8 : 0), 45, 92);

  return {
    score: finalScore,
    level: getLevel(finalScore),
    confidence,
    reasons: [
      ...new Set(reasons),
      `Mảng "${article.theme}" có độ nhạy ${segmentBoost}/100 với vị thế SSI hiện tại.`,
    ],
    segments: Object.entries(competitor.sensitivity).map(([label, value]) => {
      const topicLift = label === article.theme ? 12 : 0;
      return { label, value: clamp(value + topicLift + Math.round(finalScore * 0.08), 0, 100) };
    }),
  };
}

function formatDate() {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

function renderMorningQuote() {
  const quote = morningQuotes[getDayIndex() % morningQuotes.length];
  dom.quoteText.textContent = quote.text;
  dom.quoteAuthor.textContent = quote.author;
}

function pickDailyNews() {
  if (!newsItems.length) return null;
  const index = (getDayIndex() + dailyOffset) % newsItems.length;
  return newsItems[index];
}

function renderCompetitors() {
  dom.trackedCount.textContent = `${competitors.length} mã theo dõi`;
  dom.competitorList.innerHTML = competitors
    .map((competitor) => {
      const latest = newsItems.find((item) => item.competitorId === competitor.id);
      const result = latest ? scoreArticle(latest) : null;
      return `
        <button class="competitor-button" type="button" data-competitor="${competitor.id}" aria-selected="${competitor.id === selectedCompetitorId}">
          <strong>${competitor.name}</strong>
          <span>${competitor.focus}</span>
          ${
            result
              ? `<span class="risk-chip ${result.level.className}">${result.level.label} · ${result.score}</span>`
              : `<span class="risk-chip muted">Chưa có tin</span>`
          }
        </button>
      `;
    })
    .join("");

  dom.competitorList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCompetitorId = button.dataset.competitor;
      render();
    });
  });
}

function renderDaily(article = pickDailyNews()) {
  if (!article) {
    dom.dailyTitle.textContent = "Chưa có bài báo gốc phù hợp hôm nay";
    dom.dailySummary.textContent =
      "Hệ thống chỉ hiển thị bài từ RSS nguồn báo gốc và có nhắc đúng đối thủ trong tiêu đề hoặc mô tả. Khi chưa có bài đạt điều kiện, dashboard sẽ không tự tạo tiêu đề thay thế.";
    dom.dailyCompetitor.textContent = "Nguồn RSS gốc";
    dom.dailySource.textContent = "Đang chờ tin";
    dom.dailyTheme.textContent = "Không bịa dữ liệu";
    dom.dailyLink.removeAttribute("href");
    dom.riskScore.textContent = "0";
    dom.riskLevel.textContent = "--";
    dom.confidenceLabel.textContent = "Chưa có dữ liệu";
    dom.meterValue.style.strokeDashoffset = 414.69;
    dom.meterValue.style.stroke = "#0c7c59";
    dom.rationaleList.innerHTML =
      "<li>Không có bài báo gốc nào vượt qua bộ lọc nghiêm ngặt trong lần cập nhật gần nhất.</li>";
    dom.segmentBars.innerHTML = "";
    return;
  }

  const competitor = getCompetitor(article.competitorId);
  const result = scoreArticle(article);
  const circumference = 414.69;
  const offset = circumference - (result.score / 100) * circumference;

  dom.dailyTitle.textContent = article.title;
  dom.dailySummary.textContent = article.summary;
  dom.dailyCompetitor.textContent = competitor.name;
  dom.dailySource.textContent = article.source;
  dom.dailyTheme.textContent = article.theme;
  dom.dailyLink.href = getArticleUrl(article);
  dom.riskScore.textContent = result.score;
  dom.riskLevel.textContent = result.level.label;
  dom.confidenceLabel.textContent = `Tin cậy ${result.confidence}%`;
  dom.meterValue.style.strokeDashoffset = offset;
  dom.meterValue.style.stroke = result.level.color;

  dom.rationaleList.innerHTML = result.reasons.map((reason) => `<li>${reason}</li>`).join("");
  dom.segmentBars.innerHTML = result.segments
    .map(
      (segment) => `
        <div class="segment-row">
          <div class="segment-label"><span>${segment.label}</span><strong>${segment.value}</strong></div>
          <div class="bar-track"><div class="bar-fill" style="--value: ${segment.value}%"></div></div>
        </div>
      `,
    )
    .join("");
}

function renderThemeFilters() {
  dom.themeFilters.innerHTML = themeLabels
    .map(
      (theme) =>
        `<button type="button" data-theme="${escapeHtml(theme)}" aria-pressed="${theme === selectedTheme}">${escapeHtml(theme)}</button>`,
    )
    .join("");

  dom.themeFilters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTheme = button.dataset.theme;
      renderNewsStream();
    });
  });
}

function renderNewsStream() {
  const filtered = newsItems.filter((item) => {
    const byCompetitor = item.competitorId === selectedCompetitorId;
    const byTheme = selectedTheme === "Tất cả" || item.theme === selectedTheme;
    return byCompetitor && byTheme;
  });

  const list = filtered.length ? filtered : newsItems.filter((item) => item.competitorId === selectedCompetitorId);

  if (!list.length) {
    dom.newsStream.innerHTML = `
      <div class="empty-state">
        Chưa có bài báo gốc phù hợp cho đối thủ này. Bộ lọc đang ưu tiên độ chính xác thay vì số lượng.
      </div>
    `;
    return;
  }

  dom.newsStream.innerHTML = list
    .map((item) => {
      const result = scoreArticle(item);
      const url = escapeHtml(getArticleUrl(item));
      return `
        <article class="news-card">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.summary)}</span>
          <footer>
            <span class="risk-chip ${result.level.className}">${result.level.label} · ${result.score}</span>
            <a href="${url}" target="_blank" rel="noreferrer">Đọc bài</a>
            <button type="button" data-news="${escapeHtml(item.id)}">Xem đánh giá</button>
          </footer>
        </article>
      `;
    })
    .join("");

  dom.newsStream.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const article = newsItems.find((item) => item.id === button.dataset.news);
      if (article) renderDaily(article);
    });
  });
}

function renderManualOptions() {
  dom.manualCompetitor.innerHTML = competitors
    .map((competitor) => `<option value="${competitor.id}">${competitor.name}</option>`)
    .join("");
}

function render() {
  dom.todayLabel.textContent = formatDate();
  renderMorningQuote();
  if (dom.dataStatus) {
    const sourceParts = [];
    if (dataFeedCount) sourceParts.push(`${dataFeedCount} RSS báo`);
    if (dataOfficialSourceCount) sourceParts.push(`${dataOfficialSourceCount} trang công ty chứng khoán`);
    const feedLabel = sourceParts.length ? sourceParts.join(" + ") : "các nguồn gốc";
    const archiveLabel = dataArchiveDays ? `kho lưu trữ ${dataArchiveDays} ngày` : "kho lưu trữ";
    dom.dataStatus.textContent = `${newsItems.length} bài trong ${archiveLabel} từ ${feedLabel}. Chỉ giữ bài có URL báo thật và nhắc đúng đối thủ.`;
  }
  renderCompetitors();
  renderThemeFilters();
  renderNewsStream();
  renderDaily();
}

dom.refreshDaily.addEventListener("click", () => {
  dailyOffset += 1;
  renderDaily();
});

dom.scoreForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = dom.manualTitle.value.trim() || "Tin chưa có tiêu đề";
  const content = dom.manualContent.value.trim();
  const competitorId = dom.manualCompetitor.value;
  const competitor = getCompetitor(competitorId);
  const article = {
    title,
    summary: content.slice(0, 180),
    content,
    competitorId,
    theme: inferTheme(content || title),
    source: "Tin nhập tay",
  };
  const result = scoreArticle(article);

  dom.manualResult.hidden = false;
  dom.manualResult.style.background = result.level.color;
  dom.manualLevel.textContent = `${competitor.name} · Rủi ro ${result.level.label}`;
  dom.manualScore.textContent = result.score;
  dom.manualReason.textContent = result.reasons[0];
});

function inferTheme(text) {
  const normalized = text.toLowerCase();
  if (["margin", "room", "lãi suất", "cho vay"].some((word) => normalized.includes(word))) return "Margin";
  if (["tổ chức", "nước ngoài", "block deal", "ib"].some((word) => normalized.includes(word))) {
    return "Khách hàng tổ chức";
  }
  if (["app", "ai", "mobile", "nền tảng", "số"].some((word) => normalized.includes(word))) return "Sản phẩm số";
  return "Môi giới";
}

async function init() {
  renderManualOptions();
  await loadNewsData();
  render();
}

init();
