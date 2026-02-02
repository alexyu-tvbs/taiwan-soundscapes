# Taiwan Soundscapes — 好眠秘境

> 用耳朵旅行台灣 — Travel Taiwan with Your Ears

一個互動式 Web Prototype，將白噪音重新定義為**台灣聲音旅行**。為 TVBS 內部「好眠服務 Prototype 提案大賽」而打造。

**部署方式：** Vercel 靜態 SPA

---

## 產品理念

### 問題

現有的助眠 / 白噪音 App（Calm、Headspace、Tide、Endel）都遵循同一個模式：從播放清單選一個聲音，按下播放。它們把聲音當成用過即丟的背景內容——沒有情感連結、沒有進度感、沒有文化認同。

### 洞察

睡眠不是靠一個播放清單就能解決的問題——它是一個需要被引導的行為。而幫助我們入睡的聲音，當它扎根於我們熟悉和喜愛的地方時，就承載了意義。

### 解法

Taiwan Soundscapes 用**台灣地圖**取代播放清單。地圖上的每個位置都是真實的地方——淡水河的夕陽、阿里山的雲海、基隆港的浪聲。使用者探索地圖、聆聽聲景，並透過維持良好的睡眠習慣來解鎖隱藏地點。

這不是對既有 App 的功能改進，而是一次**品類重新定義**：從「聲音播放器」到「聲音旅行」。

### 三大差異化支柱

1. **在地文化作為護城河** — 台灣地理認同 + 真實地點聲景。國際競品無法複製。
2. **反焦慮 Gamification** — 沒有倒數計時、沒有懲罰、沒有排行榜。只有溫暖的鼓勵：「連續好眠 14 天，解鎖這片海洋。」刻意反轉業界的焦慮設計模式。
3. **睡眠教練，不是聲音播放器** — Prototype 展示了完整的助眠方案循環：評估 → 處方 → 追蹤 → 調整。聲景是遞送機制，不是產品本身。

---

## 功能

### Phase 1 — 台灣聲音地圖

- 互動式 SVG 台灣地圖，10 個地點標記（3 個已解鎖 + 7 個鎖定）
- 點擊探索：每個已解鎖地點播放獨特聲景，搭配現場攝影
- Audio Player 含播放 / 暫停與音量控制
- 鎖定地點顯示鼓勵性質的解鎖條件（Gamification 展示）
- Dark Theme 搭配地點標記的 Ambient Glow 動畫
- 品牌標語：「好眠秘境 — 用耳朵旅行台灣」

### Phase 2 — 睡眠教練概念

- **睡眠評估 Onboarding** — 5 題問卷，判定 3 種睡眠類型之一（入睡困難型 / 淺眠易醒型 / 焦慮思緒型）
- **今晚 (Tonight) Tab** — 個人化睡眠處方首頁，含進度條、呼吸練習卡片、聲景推薦、教練 Tip
- **探索 (Explore) Tab** — 台灣聲音地圖，新增收集進度指標與計畫連動的解鎖提示
- **我的 (My Journey) Tab** — 成就數據、連續天數追蹤、正向回饋訊息
- **產品故事頁 (Product Story)** — 內嵌 Pitch Page，呈現產品願景、競品分析、設計哲學與 Roadmap
- **跨 Tab 導航** — 「今晚」的聲景推薦可直接跳轉至「探索」Tab 播放

---

## 給 IP 端 / 評審的說明

### 為什麼這個 Prototype 值得關注

這個 Prototype 本身就是提案。不需要簡報、不需要投影片——產品自己說話。

**在 60 秒內，你應該理解三件事：**

1. **創意概念** — 「台灣地圖即介面」是品類重新定義，不是功能改良
2. **視覺品質** — Presentation-Grade 的 Dark Theme、Ambient Animation 和場景攝影，超越一般 Prototype 水準
3. **商業護城河** — 台灣在地內容 + 專家背書（健康 2.0）+ 睡眠行為 Gamification = 國際競品不可能複製的組合

### 與現有 App 的差異

| | Calm / Headspace | Tide | Endel | **Taiwan Soundscapes** |
|---|---|---|---|---|
| 核心模式 | 冥想內容庫 | 自然聲音播放器 | AI 生成音頻 | 睡眠教練 + 聲音旅行 |
| 內容策略 | 通用全球化 | 通用自然聲 | 演算法生成 | 台灣特有、地點連結 |
| 使用者關係 | 內容消費 | 背景噪音 | 被動聆聽 | 主動探索 + 成長進度 |
| 留存機制 | 付費牆 | 無 | 個人化 | 透過睡眠習慣解鎖 |
| 文化認同 | 無 | 無 | 無 | **台灣地理認同** |

### 展現的產品思維

這不僅僅是一個 Prototype——它展示了完整的產品願景：

- **評估 → 處方 → 追蹤 → 調整** — 完整的睡眠教練循環
- **反焦慮設計哲學** — 追蹤行為，不追蹤睡眠時數；沒有懲罰，只有鼓勵
- **專家整合路徑** — 健康 2.0 內容合作，建立超越技術的內容護城河
- **可擴展的內容模型** — 新地點、季節聲景、地方合作可無限延伸

### 產品故事頁

Prototype 內建了一個專屬的 Product Story 頁面（可在 App 內存取），呈現完整的產品概念、競品分析與設計哲學。評審可以依自己的節奏深入了解。

---

## Tech Stack

| 層級 | 技術 |
|------|------|
| Framework | React 19 + TypeScript (strict mode) |
| Build | Vite 7.x |
| Styling | Tailwind CSS v4（CSS-first，無 config 檔） |
| Animation | Motion 12.x（前身為 Framer Motion） |
| Audio | HTML5 Audio API |
| Testing | Playwright (E2E) + Vitest (Unit) |
| Deployment | Vercel (static SPA) |
| Node | v24+ |

---

## 快速開始

### 前置需求

- Node.js 24+

### 安裝與執行

```bash
npm install
npm run dev
```

在 Chrome 開啟 [http://localhost:5173](http://localhost:5173)。

### Build

```bash
npm run build
npm run preview
```

### 測試

```bash
# E2E 測試 (Playwright)
npm run test:e2e

# Unit 測試 (Vitest)
npm run test:unit

# 全部測試
npm run test:all
```

---

## 專案結構

```
src/
├── App.tsx                  # Root Component，狀態擁有者
├── components/
│   ├── TaiwanMap.tsx        # SVG 台灣地圖與地點標記
│   ├── LocationDot.tsx      # 單一地點標記（Glow / Dimmed 狀態）
│   ├── LocationDetail.tsx   # 場景照片 + 地點資訊 Overlay
│   ├── LockOverlay.tsx      # 鎖定地點提示
│   ├── SoundscapePlayer.tsx # Audio 播放控制
│   ├── TabBar.tsx           # 底部 Tab 導航
│   ├── SleepAssessment.tsx  # Onboarding 問卷 + 類型結果
│   ├── TonightPage.tsx      # 睡眠處方首頁
│   ├── PrescriptionCard.tsx # 呼吸練習 / 聲景推薦卡片
│   ├── MyJourneyPage.tsx    # 成就與進度頁
│   ├── CollectionProgress.tsx # 地圖收集進度指標
│   └── ProductStory.tsx     # 產品願景與 Pitch 頁
├── data/
│   ├── locations.ts         # 10 個台灣地點（座標、狀態、資源路徑）
│   └── sleep.ts             # 睡眠問卷、類型、處方資料
├── hooks/
│   └── useAudioPlayer.ts   # 共用 Audio 管理 Hook
├── types/
│   └── index.ts             # TypeScript 型別定義
├── index.css                # Tailwind CSS 入口
└── main.tsx                 # App 進入點
```

---

## 架構重點

- **State Management：** App.tsx 是唯一的狀態擁有者，所有子元件皆為 Presentational。僅使用 Prop Drilling — 無 Context、無 Redux。
- **SVG 地圖：** 自製 Inline SVG，地點標記為 SVG 子元素。座標使用 SVG viewBox 座標系統，非 CSS 定位。
- **Audio：** 透過 `useAudioPlayer` Hook 共用單一 `HTMLAudioElement`。無 Crossfade — 停止當前、載入新的、播放。
- **Navigation：** Conditional Rendering（無 React Router）。Tab 狀態由 App.tsx 管理。
- **Assets：** 所有 Audio（`.mp3`）與 Image（`.jpg`）從 `public/` 以絕對路徑提供，不使用 ES Module Import。

---

## 開發方法論

本專案使用 **BMAD Method**（Business Method Architecture Documentation）建構，這是一套 AI 輔助的軟體開發框架。完整的規劃與實作產出位於 `_bmad-output/`：

| 文件 | 用途 |
|------|------|
| `planning-artifacts/prd.md` | Product Requirements Document — 2 個 Phase，46 個 FR + 7 個 NFR |
| `planning-artifacts/architecture.md` | Architecture Decision Document — 12 個架構決策、元件模式、程式碼慣例 |
| `planning-artifacts/epics.md` | Epic & Story 拆解 — 8 個 Epic、15 個 Story，含 Given/When/Then 驗收標準 |
| `implementation-artifacts/sprint-status.yaml` | Sprint 追蹤 — 全部 8 個 Epic 已完成 |
| `project-context.md` | AI Agent 行為規範 — 確保跨 Session 的一致性程式碼模式 |

---

## 範圍與限制

這是一個**比賽 Prototype**，非 Production 應用：

- 無 Backend、無 API 呼叫 — 一切皆為靜態
- 無資料持久化 — 頁面重新整理即重置狀態
- 無使用者驗證
- Desktop-First（Chrome 為主、Safari 為輔）
- 1 人 + AI 工具，1 週時程

---

## 作者

**Alex Yu** — 產品概念、設計方向與 AI 輔助開發。

使用 Claude Code (Anthropic) 搭配 BMAD Method 建構。
