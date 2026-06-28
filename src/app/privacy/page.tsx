import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PageFooter from "@/components/PageFooter";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Zless",
  description: "Zless プライバシーポリシー",
};

// ─────────────────────────────────────────────
//  差し替えガイド
//  各 <PolicySection> の children を
//  ChatGPTで作成した正式な文章に置き換えてください。
//  タイトルは title prop で変更できます。
// ─────────────────────────────────────────────

function PolicySection({
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

export default function PrivacyPage() {
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
            プライバシーポリシー
          </h1>
          {/* ▼ 施行日・最終更新日 ── ここを差し替え ▼ */}
          <p className="mt-4 text-[0.72rem] font-light tracking-[0.08em] text-white/25">
            制定日：2026年X月X日　／　最終更新：2026年X月X日
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </div>

        {/* ── セクション1 ──────────────────────── */}
        <PolicySection title="01 — はじめに">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            合同会社Zless（以下「当社」）は、当社が提供するアプリケーション・ウェブサービス（以下「本サービス」）における
            ユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </PolicySection>

        {/* ── セクション2 ──────────────────────── */}
        <PolicySection title="02 — 収集する情報">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            本サービス（ServeEye）は、チーム名・背番号・試合スコア・試合時間などの
            スポーツ記録データをお客様の端末内（localStorage）にのみ保存します。
            これらのデータは当社のサーバーへ送信されることはありません。
          </p>
          <p>
            本サービスは以下の情報を収集しません：氏名・住所・電話番号・メールアドレス・
            位置情報・カメラ映像・マイク音声・連絡先・写真ライブラリ。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </PolicySection>

        {/* ── セクション3 ──────────────────────── */}
        <PolicySection title="03 — 情報の利用目的">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            端末内に保存されたデータは、試合中のスコア表示・ローテーション管理・
            試合履歴の閲覧など、本サービスの機能提供のみに使用されます。
            当社はこれらのデータにアクセスすることはできません。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </PolicySection>

        {/* ── セクション4 ──────────────────────── */}
        <PolicySection title="04 — 第三者への提供">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            当社はユーザーの情報を第三者へ提供・開示・販売することはありません。
            本サービスはGoogle Analytics・Firebase・Supabase等の
            外部解析・データ収集サービスを一切使用していません。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </PolicySection>

        {/* ── セクション5 ──────────────────────── */}
        <PolicySection title="05 — Cookie・トラッキング">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            本サービスはトラッキング目的のCookieを使用しません。
            Service Workerによるキャッシュはアプリのオフライン動作のためのみに使用されます。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </PolicySection>

        {/* ── セクション6 ──────────────────────── */}
        <PolicySection title="06 — データの削除">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            端末内に保存されたデータは、アプリのアンインストールまたはブラウザの
            サイトデータ削除によって完全に消去されます。
            当社はデータの削除を依頼された場合でも、端末内のデータにアクセスする手段を持ちません。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </PolicySection>

        {/* ── セクション7 ──────────────────────── */}
        <PolicySection title="07 — お問い合わせ">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            本ポリシーに関するお問い合わせは、以下の窓口までご連絡ください。
          </p>
          <p>
            合同会社Zless<br />
            メール：info@zless.jp<br />
            受付時間：平日 10:00〜18:00
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </PolicySection>

        {/* ── セクション8 ──────────────────────── */}
        <PolicySection title="08 — ポリシーの変更">
          {/* ▼ ここを正式な文章に差し替え ▼ */}
          <p>
            当社は、必要に応じて本ポリシーを変更することがあります。
            変更後のポリシーは本ページに掲載した時点で効力を生じるものとします。
          </p>
          {/* ▲ 差し替えここまで ▲ */}
        </PolicySection>

      </main>

      <PageFooter />
    </div>
  );
}
