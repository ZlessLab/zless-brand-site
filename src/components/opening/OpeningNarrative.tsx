import { OPENING_SCENES } from "@/scene/openingScenes";

type OpeningNarrativeProps = {
  activeIndex: number;
};

export function OpeningNarrative({ activeIndex }: OpeningNarrativeProps) {
  const activeScene = OPENING_SCENES[activeIndex] ?? OPENING_SCENES[0];

  return (
    <div className="opening-narrative" aria-live="polite">
      <div className="scene-kicker">
        <span>{activeScene.id}</span>
        <p>{activeScene.title}</p>
      </div>
      <p className="scene-label">{activeScene.label}</p>
      {activeScene.headline && (
        <div className="opening-headline">
          {activeScene.headline.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <span>ゼロから、新しい価値を創る。</span>
        </div>
      )}
      <div className="scene-copy">
        {activeScene.copy.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}
