import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PageFooter from "@/components/PageFooter";

export const metadata: Metadata = {
  title: "利用規約 | Zless",
  description: "Zless 利用規約",
};

// ─────────────────────────────────────────────
//  差し替えガイド
//  各 <TermsSection> の children を
//  ChatGPTで作成した正式な文章に置き換えてください。
//  タイトルは title prop で変更できます。
// ─────────────────────────────────────────────

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-[0.70rem] font-light tracking-[0.40em] text-[rgba(85,160,255,0.60)] uppercase mb-4">
        {title}
      </h2>
      <div className="w-8 h-px bg-[rgba(60,120,255,0.30)] mb-6" />
      <div className="text-[0.84rem] font-light leading-[2.1] tracking-[0.04em] text-white/50 space-y-4">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="bg-[#010407] text-white min-h-screen">
      <PageHeader />

      <main className="max-w-3xl mx-auto px-6 pt-36 pb-8">

        {/* ページタイトル */}
        <div className="mb-16">
          <p className="text-[0.60rem] font-light tracking-[0.46em] text-[rgba(70,140,220,0.50)] uppercase mb-5">
            Legal
          </p>
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.12em] text-white/90">
            利用規約
          </h1>
          {/* ▼ 施行日・最終更新日 ── ここを差し替え ▼ */}
          <p className="mt-4 text-[0.72rem] font-light tracking-[0.08em] text-white/25">
            制定日：2026年X月X日　／　最終更新：2026年X月X日
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </div>

        {/* ── セクション1 ──────────────────────── */}
        <TermsSection title="第1条 — 適用">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            本利用規約（以下「本規約」）は、合同会社Zless（以下「当社」）が提供する
            アプリケーション「ServeEye」およびその関連サービス（以下「本サービス」）の
            利用条件を定めるものです。ユーザーの皆さまには、本規約に同意いただいたうえで
            本サービスをご利用いただきます。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </TermsSection>

        {/* ── セクション2 ──────────────────────── */}
        <TermsSection title="第2条 — サービス内容">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            本サービスは、4人制ソフトバレーボールの試合におけるスコア管理・
            ローテーション表示・試合履歴の記録を目的としたツールです。
            スコアの正確性・完全性については保証しません。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </TermsSection>

        {/* ── セクション3 ──────────────────────── */}
        <TermsSection title="第3条 — 禁止事項">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>ユーザーは本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
          <ul className="list-disc list-inside space-y-2 pl-1">
            <li>本サービスのリバースエンジニアリング・改ざん・再配布</li>
            <li>法令または公序良俗に反する行為</li>
            <li>当社または第三者の権利を侵害する行為</li>
            <li>本サービスの運営を妨害する行為</li>
          </ul>
          {/* ▲ 差し替えここまで ▲ */}
        </TermsSection>

        {/* ── セクション4 ──────────────────────── */}
        <TermsSection title="第4条 — 免責事項">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            当社は、本サービスの利用によって生じた損害（データ消失・試合記録の誤り等を含む）
            について、一切の責任を負いません。本サービスは現状有姿（as is）で提供されます。
          </p>
          <p>
            当社は予告なく本サービスの内容を変更・停止・終了することがあります。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </TermsSection>

        {/* ── セクション5 ──────────────────────── */}
        <TermsSection title="第5条 — 知的財産権">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            本サービスに関する著作権・商標権その他の知的財産権はすべて当社に帰属します。
            ユーザーは、当社の事前の書面による承諾なく、これらを複製・転載・改変することはできません。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </TermsSection>

        {/* ── セクション6 ──────────────────────── */}
        <TermsSection title="第6条 — プライバシー">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            個人情報の取り扱いについては、別途定める
            <a href="/privacy" className="text-[rgba(85,160,255,0.70)] hover:text-[rgba(115,185,255,0.90)] transition-colors underline underline-offset-4">
              プライバシーポリシー
            </a>
            に従います。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </TermsSection>

        {/* ── セクション7 ──────────────────────── */}
        <TermsSection title="第7条 — 規約の変更">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            当社は必要に応じて本規約を変更することがあります。
            変更後の規約は本ページへの掲載をもって効力を生じ、
            変更後に本サービスを利用したユーザーは変更後の規約に同意したものとみなします。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </TermsSection>

        {/* ── セクション8 ──────────────────────── */}
        <TermsSection title="第8条 — 準拠法・裁判管轄">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            本規約は日本法に準拠します。本サービスに関する紛争については、
            当社の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </TermsSection>

        {/* ── セクション9 ──────────────────────── */}
        <TermsSection title="第9条 — お問い合わせ">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            本規約に関するお問い合わせは、以下の窓口までご連絡ください。
          </p>
          <p>
            合同会社Zless<br />
            メール：info@zless.jp<br />
            受付時間：平日 10:00〜18:00
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </TermsSection>

      </main>

      <PageFooter />
    </div>
  );
}
