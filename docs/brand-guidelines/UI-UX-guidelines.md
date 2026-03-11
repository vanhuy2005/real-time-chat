# ChatHub — Brand Guidelines v2
## Ứng dụng nhắn tin cho học sinh & sinh viên | Mobile-First

---

## 1. Định Hướng Thương Hiệu

### Đối tượng
- Học sinh cấp 2–3 (13–18 tuổi), sinh viên đại học (18–24)
- Sử dụng điện thoại là chính, nhắn tin nhanh với bạn cùng lớp

### Brand Personality

| Thuộc tính | Mô tả | Thể hiện |
|---|---|---|
| **Vui nhộn** | Kích thích, không nhàm chán | Rounded shapes, gradient accents, playful animations |
| **Dễ thương** | Thân thiện, gần gũi | Cute fonts, soft shadows, pastel-friendly themes |
| **Nhanh** | Real-time, instant | Micro-interactions, skeleton loading, smooth transitions |
| **Cá tính** | Tự do express bản thân | 8 themed skins, customizable, bold color pops |

### Phong Cách Thiết Kế Chủ Đạo: **Bubbly Glassmorphism**

> **Xuyên suốt toàn bộ app** — kết hợp **Glassmorphism** (frosted glass, blur, transparency) với **Bubbly/Rounded elements** (bo góc lớn, soft shadows, inflated shapes).

**Tại sao phong cách này?**
- **Glassmorphism** → hiện đại, premium feel, trending 2024–2025
- **Bubbly/Rounded** → dễ thương, thân thiện, phù hợp học sinh
- Kết hợp = **không childish nhưng vẫn đáng yêu**, giống aesthetic của LINE, KakaoTalk

**3 nguyên tắc thiết kế:**
1. **Glass Layers** — Cards, modals, sidebars dùng `backdrop-blur` + semi-transparent backgrounds
2. **Soft Bubbles** — Border-radius lớn (16–20px), shadows mềm, không có cạnh sắc
3. **Floating Elements** — Badges, avatars, buttons có subtle shadow tạo cảm giác nổi lên

---

## 2. Color System

### Default Theme: **Neutral Glass** (trung tính, sạch, nổi bật)

```
Semantic Token         Hex          Vai trò
──────────────────────────────────────────────────────
--primary              #5B6DFF      Nút chính, links (Soft Indigo — trung tính nhưng nổi)
--primary-content      #FFFFFF      Text trên primary
--secondary            #36D6B5      Online indicator, success actions (Mint)
--secondary-content    #FFFFFF      Text trên secondary
--accent               #FF6B9D      Notification badges, highlights (Coral Pink)
--accent-content       #FFFFFF      Text trên accent
--neutral              #2A2B3D      Card backgrounds (Charcoal Indigo)
--neutral-content      #E4E6F0      Text trên neutral
--base-100             #1E1F2E      Background chính (Dark Slate)
--base-200             #252638      Background phụ — sidebar, input
--base-300             #343550      Borders, dividers
--base-content         #F0F1F5      Text chính
--info                 #5BC0EB      Info
--success              #36D6B5      Success
--warning              #FFD166      Warning
--error                #EF476F      Error
```

**Triết lý**: Nền trung tính (dark slate) làm nổi bật nội dung chat. Accent colors đủ sáng để tạo điểm nhấn mà không chói.

---

### 8 Custom Themes — Theo Cá Tính

#### 🔥 4 Themes Nam — Mạnh mẽ, cá tính

**🎮 Midnight Gamer**
*"Cho game thủ — tông tối, accent neon xanh"*
- `--primary`: #00F0FF (Neon Cyan)
- `--secondary`: #7B2FFF (Electric Purple)  
- `--accent`: #FF3D71 (Hot Red)
- `--base-100`: #0D0D1A (Void Black)

**🌊 Ocean Storm**
*"Biển đêm — tông navy, accent xanh dương sáng"*
- `--primary`: #0077B6 (Deep Ocean Blue)
- `--secondary`: #00B4D8 (Bright Teal)
- `--accent`: #90E0EF (Sky Blue)
- `--base-100`: #0A1628 (Deep Sea)

**⚡ Cyber Punk**
*"Sci-fi neon — tông tối, accent vàng/hồng neon"*
- `--primary`: #F7E733 (Neon Yellow)
- `--secondary`: #FF2E97 (Neon Pink)
- `--accent`: #00FF88 (Matrix Green)
- `--base-100`: #120716 (Dark Purple Black)

**🌲 Forest Warrior**
*"Thiên nhiên mạnh — tông đất, accent xanh lá"*
- `--primary`: #4CAF50 (Forest Green)
- `--secondary`: #8BC34A (Lime)
- `--accent`: #FF9800 (Amber)
- `--base-100`: #1A1E12 (Dark Olive)

#### 💖 4 Themes Nữ — Đáng yêu, dễ thương, ấn tượng

**🌸 Sakura Dream**
*"Hoa anh đào — pastel hồng phấn, nhẹ nhàng"*
- `--primary`: #FF8FAB (Sakura Pink)
- `--secondary`: #FFB3C6 (Soft Rose)
- `--accent`: #FF5C8A (Deep Pink)
- `--base-100`: #FFF0F3 (Blush White)

**💜 Lavender Cloud**
*"Mây tím — pastel tím lavender, dreamy"*
- `--primary`: #B48EFF (Lavender)
- `--secondary`: #E0C3FC (Soft Lilac)
- `--accent`: #FF9CEE (Orchid Pink)
- `--base-100`: #F5F0FF (Ghost White Purple)

**🍑 Peach Blossom**
*"Đào ngọt — cam đào ấm áp, cute vintage"*
- `--primary`: #FF8C69 (Peach)
- `--secondary`: #FFB085 (Light Peach)
- `--accent`: #FF6B6B (Coral)
- `--base-100`: #FFF8F0 (Cream White)

**🍃 Mint Candy**
*"Kẹo bạc hà — xanh mint tươi mát, dễ thương"*
- `--primary`: #4ECDC4 (Mint)
- `--secondary`: #A8E6CF (Soft Green)
- `--accent`: #FF6B9D (Pink Punch)
- `--base-100`: #F0FFF8 (Mint White)

---

## 3. Typography

### Font Stack — Đáng yêu, đặc biệt, dễ đọc

```css
/* Heading font — rounded, cute, ấn tượng */
--font-heading: 'Quicksand', 'Comfortaa', system-ui, sans-serif;

/* Body font — dễ đọc, thân thiện, rounded */
--font-body: 'Comfortaa', 'Quicksand', system-ui, sans-serif;

/* Monospace — timestamps, code */
--font-mono: 'JetBrains Mono', monospace;
```

**Tại sao combo này ấn tượng:**
- **Rounded terminals** → dễ thương kiểu "bubble letter"
- Giống aesthetic của LINE, Duolingo, KakaoTalk — apps mà học sinh yêu thích
- Hỗ trợ tiếng Việt hoàn hảo trên Google Fonts

### Type Scale (Mobile-First)

```
Token           Mobile         Desktop        Weight    Use case
────────────────────────────────────────────────────────────────
--text-xs       11px           12px           400       Timestamps, meta
--text-sm       13px           14px           500       Secondary text, labels
--text-base     15px           16px           400       Chat messages, body
--text-lg       17px           18px           600       Section headers
--text-xl       20px           22px           700       Page titles
--text-2xl      24px           28px           700       Hero/welcome
```

---

## 4. Glassmorphism Tokens

```css
/* Frosted glass card */
--glass-bg:           rgba(255, 255, 255, 0.05); /* Hoặc rgba(0,0,0, 0.05) theme sáng */
--glass-blur:         12px;                      /* backdrop-filter: blur() */
--glass-border:       1px solid rgba(255, 255, 255, 0.12);
--glass-shadow:       0 4px 20px rgba(0, 0, 0, 0.15);
--glass-radius:       16px;                      /* rounded-2xl */
```

**Áp dụng:**
- **Sidebar**: glass background để blend với background app
- **Cards (Profile, Settings)**: glass panels over solid background

---

## 5. Spacing & Layout System

### Base Unit: 4px
Mọi khoảng cách (padding, margin, gap) đều là bội số 4px. Dùng Tailwind tokens mặc định (`p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px).

### Layout Architecture (Mobile-First < 768px)

**Quy tắc tối thượng: Single View trên Mobile**
Sidebar (Contact list) và Chat Container KHÔNG hiển thị cùng lúc trên mobile.
- Khi vào app `->` Hiện Sidebar danh sách bạn bè.
- Khi bấm chọn 1 người `->` Trượt sang giao diện ChatContainer (Sidebar bị ẩn/chiếm trọn width).
- Navbar có nút Back (trang chat) `->` Trở về Sidebar.

Trên Desktop (`md:` và lớn hơn): Hiển thị sidebar hẹp (280-320px) bên trái và Chat Container bên phải trong 1 flex container.

---

## 6. Border Radius & Chat Bubbles

```css
/* Sent message (right) */
.bubble-sent {
  border-radius: 20px 20px 4px 20px;
}

/* Received message (left) */
.bubble-received {
  border-radius: 20px 20px 20px 4px;
}
```

Kiểu bo góc bất đối xứng (iMessage/Messenger) tạo cảm giác hướng bong bóng hội thoại chỉ về phía avatar.

---

## 7. Motion

- Hover, focus (fast): `150ms ease-out` (vd: nút nhấn nổi lên)
- Slide in/out (normal/slow): `300ms ease-in-out` (chuyển đổi màn hình mobile)
- Bouncing animation cho loading/typing: `600ms loop`

---

## 8. Iconography — Phù hợp Bubbly Glassmorphism

### Kích thước & Component
| Context | Size | Tailwind | Ví dụ |
|---|---|---|---|
| Navbar/Sidebar | 20px | `w-5 h-5` | `Settings`, `LogOut`, `MessageSquare` |
| Chat actions | 16-18px | `w-[18px]` | `Image`, `Send`, `Smile` |

### Icon Containers — Glass Bubble Style
Các action icons được đặt vào box có hiệu ứng nổi và mềm:
```css
.icon-bubble {
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
  background: var(--primary) / 10%;
  backdrop-filter: blur(8px);
  padding: 10px;
  transition: all 200ms ease-out;
}
.icon-bubble:hover { transform: scale(1.05); }
```

### Màu sắc theo theme
- **Dark themes**: Icon màu primary (`text-primary`), hover sáng hơn. Icon bubble dùng nền translucent của màu primary (`bg-primary/10`).
- **Light themes**: Icon màu primary, hover sáng hơn nhẹ.

---

## 9. Dev Checklist
- [ ] Font: `Quicksand` (heading), `Comfortaa` (body).
- [ ] Tailwind Config: Loại bỏ 32 themes mặc định, chèn 9 custom themes (1 neutral + 4 nam + 4 nữ).
- [ ] Bubbly Radius: Áp dụng `rounded-2xl` cho các box nội dung, `.bubble-sent/.received` cho khung tin nhắn.
- [ ] Glass: Dùng `bg-base-100/60 backdrop-blur-md` cho Navbar và Sidebar.
- [ ] Mobile Layout: Ẩn/hiện Sidebar và ChatContainer theo state `selectedUser` nếu màn hình nhỏ.
- [ ] Icon: Update tất cả icon sang dạng `icon-bubble` với padding/rounding/hover scale mới. 
