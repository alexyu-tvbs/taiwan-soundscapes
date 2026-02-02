import { motion } from 'motion/react'

interface ProductStoryProps {
  onClose: () => void
}

export const ProductStory = ({ onClose }: ProductStoryProps) => (
  <motion.div
    className="fixed inset-0 z-50 bg-slate-900 overflow-y-auto"
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
  >
    <div data-testid="product-story-content" className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex justify-end mb-6">
        <button
          data-testid="product-story-close"
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors text-2xl"
          aria-label="關閉"
        >
          ✕
        </button>
      </div>

      <div data-testid="product-story-sections" className="space-y-8">
        <section data-testid="section-vision">
          <h3 className="text-xl font-bold text-white mb-3">產品願景</h3>
          <p className="text-base text-slate-300 leading-relaxed">
            「好眠秘境」將睡眠改善從醫療苦差事轉化為文化旅程。用戶不只是「修復」睡眠——他們透過建立更好的睡眠習慣，探索台灣最美麗的聲景作為獎勵。
          </p>
        </section>

        <section data-testid="section-competitive">
          <h3 className="text-xl font-bold text-white mb-3">市場競爭分析</h3>
          <p className="text-base text-slate-300 leading-relaxed">
            White noise 類 App（Calm、Headspace）提供通用音效。我們以文化根植的台灣聲景、遊戲化收集機制，以及個人化睡眠教練系統做出差異化。沒有競爭者同時結合這三者。
          </p>
        </section>

        <section data-testid="section-audience">
          <h3 className="text-xl font-bold text-white mb-3">目標用戶</h3>
          <p className="text-base text-slate-300 leading-relaxed">
            台灣都會區 25-40 歲的年輕專業人士，正經歷壓力相關的睡眠困擾。他們重視自我提升、欣賞在地文化，並對遊戲化機制有正向回應。
          </p>
        </section>

        <section data-testid="section-philosophy">
          <h3 className="text-xl font-bold text-white mb-3">設計哲學</h3>
          <p className="text-base text-slate-300 leading-relaxed">
            暗色優先的介面呼應夜間使用情境。溫暖的琥珀色調引導互動，避免刺眼的視覺刺激。極簡的操控設計降低睡前的認知負擔。
          </p>
        </section>

        <section data-testid="section-moat">
          <h3 className="text-xl font-bold text-white mb-3">差異化護城河</h3>
          <p className="text-base text-slate-300 leading-relaxed">
            台灣獨家聲景創造了全球競爭者無法複製的地理與文化獨特性。睡眠解鎖機制形成行為飛輪：更好的睡眠 → 更多聲景 → 更多動力 → 更好的睡眠。
          </p>
        </section>

        <section data-testid="section-roadmap">
          <h3 className="text-xl font-bold text-white mb-3">產品路線圖</h3>
          <p className="text-base text-slate-300 leading-relaxed">
            Phase 1：聲景地圖原型（已完成）。Phase 2：睡眠教練概念（目前階段）。Phase 3：整合真實睡眠追蹤。Phase 4：社群功能與挑戰活動。
          </p>
        </section>
      </div>
    </div>
  </motion.div>
)
