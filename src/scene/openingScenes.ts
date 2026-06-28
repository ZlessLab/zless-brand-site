export type OpeningSceneId = "dark" | "logo" | "line" | "message" | "start";

export type OpeningSceneCopy = {
  id: string;
  title: string;
  label: string;
  headline?: string[];
  copy: string[];
  mode: OpeningSceneId;
};

export const OPENING_SCENES: OpeningSceneCopy[] = [
  {
    id: "01",
    title: "暗闇",
    label: "THE STORY STARTS AT ZERO.",
    copy: ["真っ黒な画面。", "静寂の中で、遠くに小さな光が生まれる。"],
    mode: "dark",
  },
  {
    id: "02",
    title: "ロゴ出現",
    label: "A SYMBOL RISES.",
    copy: ["光が近づき、Zlessのロゴが静かに浮かび上がる。", "まだ、何の文字もない。"],
    mode: "logo",
  },
  {
    id: "03",
    title: "光が走る",
    label: "LIGHT BECOMES A PATH.",
    copy: ["ロゴの中心から光が走り出し、一本のラインが未来へ伸びていく。", "その光が、Zlessの「道」になる。"],
    mode: "line",
  },
  {
    id: "04",
    title: "キャッチコピー",
    label: "ZERO LIMITS. ENDLESS SUCCESS.",
    headline: ["Zero Limits.", "Endless Success."],
    copy: ["光のラインの先に、地平線が広がる。", "キャッチコピーが静かに表示される。"],
    mode: "message",
  },
  {
    id: "05",
    title: "スクロール開始",
    label: "BEGIN THE EXPERIENCE.",
    headline: ["Zero Limits.", "Endless Success."],
    copy: ["スクロールすると、ロゴは左上に小さく残り、", "ブランドの象徴として常に存在する。"],
    mode: "start",
  },
];

export const getOpeningSceneIndex = (progress: number) => {
  const clamped = Math.min(0.999, Math.max(0, progress));
  return Math.floor(clamped * OPENING_SCENES.length);
};
