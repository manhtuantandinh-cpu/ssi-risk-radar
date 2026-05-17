# Hướng Dẫn Go Live Miễn Phí

Mục tiêu: đưa web lên internet miễn phí bằng GitHub Pages, và mỗi ngày GitHub Actions tự lấy tin RSS gốc từ báo rồi cập nhật dashboard.

## Bạn cần chuẩn bị

1. Một tài khoản GitHub: https://github.com
2. Toàn bộ file trong thư mục web này.
3. Không cần mua hosting, không cần server riêng.

## Bước 1: Tạo repository trên GitHub

1. Vào https://github.com
2. Đăng nhập.
3. Bấm nút `+` ở góc trên bên phải.
4. Chọn `New repository`.
5. Repository name: nhập `ssi-risk-radar`.
6. Chọn `Public`.
7. Không cần tick thêm gì.
8. Bấm `Create repository`.

## Bước 2: Upload toàn bộ file web

1. Trong repository vừa tạo, bấm `uploading an existing file`.
2. Kéo thả toàn bộ file và thư mục này lên GitHub:
   - `.github`
   - `data`
   - `scripts`
   - `.nojekyll`
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
   - `vercel.json`
3. Ở cuối trang, ô commit message có thể để mặc định.
4. Bấm `Commit changes`.

## Bước 3: Bật GitHub Pages

1. Trong repository, bấm tab `Settings`.
2. Ở menu bên trái, bấm `Pages`.
3. Tại mục `Build and deployment`, phần `Source`, chọn `GitHub Actions`.
4. Không cần chọn theme.

## Bước 4: Chạy deploy lần đầu

1. Bấm tab `Actions`.
2. Nếu GitHub hỏi có cho chạy workflow không, bấm `I understand my workflows, go ahead and enable them`.
3. Chọn workflow `Update news and deploy site`.
4. Bấm `Run workflow`.
5. Bấm nút xanh `Run workflow`.
6. Chờ khoảng 1-3 phút.

## Bước 5: Lấy link public

1. Vào lại `Settings`.
2. Bấm `Pages`.
3. GitHub sẽ hiện link dạng:

```text
https://ten-tai-khoan.github.io/ssi-risk-radar/
```

Đó là link public để gửi cho người khác.

## Sau này tin tự cập nhật thế nào?

Workflow `.github/workflows/update-news-and-deploy.yml` đang chạy mỗi ngày lúc 07:20 giờ Việt Nam.

Mỗi lần chạy, nó sẽ:

1. Lấy tin từ RSS gốc của các báo đang cấu hình.
2. Gộp tin mới với kho lưu trữ trong `data/news.json`.
3. Ghi tin mới vào `data/news.json`.
4. Ghi thêm `data/news-data.js` để bản mở local cũng đọc được dữ liệu.
5. Commit kho tin về repo để các bài cũ không bị mất.
6. Deploy lại website lên GitHub Pages.

Bạn cũng có thể cập nhật thủ công bất cứ lúc nào:

1. Vào tab `Actions`.
2. Chọn `Update news and deploy site`.
3. Bấm `Run workflow`.

## Muốn đổi giờ tự cập nhật

Mở file:

```text
.github/workflows/update-news-and-deploy.yml
```

Dòng hiện tại:

```yaml
- cron: "20 0 * * *"
```

Nghĩa là 00:20 UTC, tương đương 07:20 sáng Việt Nam.

## Muốn thêm đối thủ

Mở 2 file:

1. `app.js`: thêm đối thủ vào mảng `competitors`.
2. `scripts/fetch-news.mjs`: thêm danh sách tên gọi vào mảng `competitors`.

Ví dụ:

```js
{
  id: "ssi",
  aliases: ["ssi", "chứng khoán ssi", "ctcp chứng khoán ssi"],
}
```

## Muốn thêm nguồn báo gốc

Mở file:

```text
scripts/fetch-news.mjs
```

Tìm mảng `feeds`, rồi thêm nguồn RSS mới theo mẫu:

```js
{
  name: "Tên báo - Chuyên mục",
  url: "https://example.com/chung-khoan.rss",
  host: "example.com",
}
```

Hệ thống chỉ giữ link nếu URL bài viết thuộc đúng `host`, vì vậy nút `Đọc bài` sẽ đi tới bài gốc của nguồn đó.

Các nguồn đang có sẵn gồm CafeF, Vietstock, VnExpress, Thanh Niên và VnEconomy, ưu tiên chuyên mục chứng khoán, đầu tư, kinh tế, tài chính, ngân hàng và doanh nghiệp.

## Lưu ý quan trọng

- Hệ thống không dùng Google News RSS nữa vì dễ lẫn ngữ cảnh.
- Nếu không có bài mới nhắc đúng đối thủ trong RSS gốc, web vẫn giữ kho bài cũ trong 90 ngày.
- Càng thêm nhiều RSS báo gốc chất lượng, khả năng có tin đúng mỗi ngày càng cao.
- Bộ chấm điểm rủi ro hiện là rule-based, chưa dùng AI trả phí.
- Nếu muốn tóm tắt sâu hơn hoặc đánh giá thông minh hơn, lúc đó có thể tích hợp API AI sau.
