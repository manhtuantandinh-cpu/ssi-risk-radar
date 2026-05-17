# SSI Competitive Risk Radar

Prototype web tĩnh theo dõi đối thủ của SSI, hiển thị một bản tin mỗi ngày và tự động chấm điểm rủi ro từ nội dung tin.

## Chạy local

Mở trực tiếp `index.html` trong trình duyệt hoặc chạy:

```bash
python3 -m http.server 4173
```

Sau đó vào `http://127.0.0.1:4173`.

## Deploy public miễn phí

Cách khuyến nghị cho bản này là GitHub Pages + GitHub Actions.

- GitHub Pages publish website ra internet.
- GitHub Actions chạy mỗi ngày để lấy RSS gốc từ các báo và cập nhật `data/news.json`.
- Xem hướng dẫn từng bước trong `HUONG_DAN_GO_LIVE.md`.

## Cấu trúc

- `index.html`: khung dashboard.
- `styles.css`: giao diện responsive.
- `app.js`: dữ liệu mẫu, logic chọn tin hằng ngày, bộ chấm điểm rủi ro và form đánh giá tin mới.
- `data/news.json`: dữ liệu tin tức dạng JSON.
- `data/news-data.js`: dữ liệu tin tức dạng JavaScript để mở local bằng `file://` vẫn đọc được.
- `scripts/fetch-news.mjs`: script lấy tin từ RSS gốc của báo, lọc chặt theo tên đối thủ, giữ link bài gốc và lưu kho tin.
- `.github/workflows/update-news-and-deploy.yml`: workflow tự lấy tin và deploy GitHub Pages mỗi ngày.
- `vercel.json`: cấu hình deploy tĩnh trên Vercel.

Mỗi tin trong `newsItems` có trường `url`. Nút `Đọc bài` và `Đọc bài gốc` sẽ mở URL này trong tab mới. Dữ liệu mẫu hiện trỏ tới trang tìm kiếm tin tức theo tiêu đề; khi có RSS/API thật, thay `url` bằng link bài báo gốc.

## Dữ liệu tự động

Khi chạy trên GitHub Pages, web sẽ đọc tin từ `data/news.json`. File này được GitHub Actions cập nhật hằng ngày bằng RSS công khai của nguồn báo gốc.

Workflow hiện chạy mỗi ngày lúc 07:20 giờ Việt Nam. Có thể chạy thủ công trong tab `Actions` của GitHub.

Nguyên tắc lọc hiện tại:

- Không dùng tiêu đề mẫu.
- Không dùng link Google News redirect.
- Chỉ giữ bài có nhắc đúng tên đối thủ trong tiêu đề hoặc mô tả RSS.
- Chỉ giữ URL thuộc domain nguồn báo gốc, ví dụ `cafef.vn` hoặc `vietstock.vn`.
- Lưu kho bài trong 90 ngày gần nhất để dashboard có nhiều dữ liệu hơn.
- Nguồn RSS hiện gồm CafeF, Vietstock, VnExpress, Thanh Niên và VnEconomy.

Nếu hôm đó không có bài đạt điều kiện, web sẽ hiển thị trạng thái chưa có tin phù hợp thay vì tự tạo tin thay thế.

Nếu muốn nâng cấp sau này, có thể thêm:

- RSS hoặc API tin tức theo từng đối thủ.
- Model NLP/LLM để trích xuất chủ đề, mức ảnh hưởng, bằng chứng và khuyến nghị hành động.

Bộ chấm điểm hiện tại dùng `keywordRules`, `baseRisk` và `sensitivity` theo từng mảng kinh doanh. Có thể tinh chỉnh các trọng số này theo dữ liệu lịch sử của SSI.
