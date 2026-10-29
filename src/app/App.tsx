import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  ArrowCounterClockwise,
  BookOpen,
  BracketsCurly,
  Flask,
  Gear,
  Lifebuoy,
  MapTrifold,
  Play,
  Power,
  SkipForward
} from "@phosphor-icons/react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { gsap } from "gsap";
import { AsciiFrame } from "../ui/AsciiFrame";
import { episodeCatalog } from "../lessons/lessonData";
import { getCurrentStage, getStage } from "../lessons/lessonEngine";
import { BoardCanvas } from "../simulation/BoardCanvas";
import { patterns } from "../simulation/patterns";
import { quitDesktopApp, runningInDesktop } from "../lib/desktop";
import { getBoardMetrics, useFumblyStore, type SandboxPreset } from "./store";

export function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isDesktop = runningInDesktop();
  const {
    progress,
    selectedStageId,
    grid,
    generation,
    stepsTaken,
    code,
    selectedCell,
    hoveredCell,
    runResult,
    sandboxOpen,
    sandboxPreset,
    setCode,
    stepWorld,
    resetWorld,
    toggleCell,
    setHoveredCell,
    runStage,
    openSandbox,
    closeSandbox,
    applySandboxPreset
  } = useFumblyStore();

  const stage =
    getStage(episodeCatalog, selectedStageId) ??
    getCurrentStage(episodeCatalog, progress)!;
  const metrics = useMemo(() => getBoardMetrics(grid, selectedCell), [grid, selectedCell]);

  useEffect(() => {
    document.body.classList.toggle("is-desktop-shell", isDesktop);
    return () => document.body.classList.remove("is-desktop-shell");
  }, [isDesktop]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".reveal-panel", {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.035
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "F5") {
        event.preventDefault();
        runStage();
      }
      if (event.key === "F6") {
        event.preventDefault();
        stepWorld();
      }
      if (event.key === "F7") {
        event.preventDefault();
        resetWorld();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resetWorld, runStage, stepWorld]);

  return (
    <main className="app-shell" ref={rootRef}>
      <section className="terminal-screen" aria-labelledby="fumbly-menu-title">
        <TopBar onOpenSettings={() => setSettingsOpen(true)} />

        <section className="terminal-layout" aria-label="Episode cockpit">
          <StoryPanel stage={stage} />
          <div className="center-stack">
            <InteractiveWorld
              grid={grid}
              generation={generation}
              stepsTaken={stepsTaken}
              selectedCell={selectedCell}
              hoveredCell={hoveredCell}
              population={metrics.population}
              selectedNeighbors={metrics.selectedNeighbors}
              onToggleCell={toggleCell}
              onHoverCell={setHoveredCell}
            />
            <CodeGrimoire
              code={code}
              onChange={setCode}
              runResult={runResult}
            />
          </div>
          <aside className="right-stack" aria-label="Quest and commands">
            <QuestLog
              stage={stage}
              completedStageIds={progress.completedStageIds}
              runResult={runResult}
            />
            <CommandRail
              onRun={runStage}
              onStep={stepWorld}
              onReset={resetWorld}
              onSandbox={openSandbox}
            />
          </aside>
        </section>

        <footer className="status-line reveal-panel">
          <span>Welcome, Apprentice. The grid awaits your command.</span>
          <span>Memory Runes: {progress.completedStageIds.length}</span>
        </footer>
      </section>

      <EpisodeShelf
        selectedStageId={selectedStageId}
        completedCount={progress.completedStageIds.length}
      />

      {sandboxOpen ? (
        <SandboxPanel
          activePreset={sandboxPreset}
          onClose={closeSandbox}
          onApplyPreset={applySandboxPreset}
        />
      ) : null}

      {settingsOpen ? (
        <SettingsPanel
          isDesktop={isDesktop}
          onClose={() => setSettingsOpen(false)}
          onQuit={() => void quitDesktopApp()}
        />
      ) : null}
    </main>
  );
}

function TopBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <nav className="top-bar reveal-panel" aria-label="Primary navigation">
      <a
        href="#fumbly-menu-title"
        className="brand-lockup top-bar-drag"
        data-tauri-drag-region
        aria-label="Fumbly home"
      >
        <Archive size={28} weight="duotone" />
        <h1 id="fumbly-menu-title">Fumbly</h1>
      </a>
      <div className="episode-title top-bar-drag" data-tauri-drag-region>
        Episode I: The Living Grid
      </div>
      <div className="top-links">
        <a href="#codex">
          <BookOpen size={16} /> Codex
        </a>
        <a href="#episodes">
          <MapTrifold size={16} /> Episodes
        </a>
        <a href="#sandbox">
          <BracketsCurly size={16} /> Runes
        </a>
        <button type="button" className="top-link-button" onClick={onOpenSettings}>
          <Gear size={16} /> Settings
        </button>
        <a href="#help">
          <Lifebuoy size={16} /> Help
        </a>
      </div>
    </nav>
  );
}

function EpisodeShelf({
  selectedStageId,
  completedCount
}: {
  selectedStageId: string;
  completedCount: number;
}) {
  return (
    <AsciiFrame title="Episode Shelf" className="episode-shelf reveal-panel">
      <div id="episodes" className="episode-grid">
        {episodeCatalog.map((episode) => (
          <article
            key={episode.id}
            className={`episode-card ${episode.status === "open" ? "open" : ""}`}
          >
            <div className="episode-index">Episode {episode.roman}</div>
            <h3>{episode.title}</h3>
            <p>{episode.project}</p>
            <dl>
              <div>
                <dt>Status</dt>
                <dd>{episode.status}</dd>
              </div>
              <div>
                <dt>Teaches</dt>
                <dd>{episode.teaches.slice(0, 3).join(", ")}</dd>
              </div>
            </dl>
            {episode.id === "living-grid" ? (
              <span className="progress-mark">
                {completedCount} / {episode.stages.length} stages restored
              </span>
            ) : (
              <span className="progress-mark">planned shelf slot</span>
            )}
          </article>
        ))}
      </div>
      <span className="screen-reader-note">Current stage id: {selectedStageId}</span>
    </AsciiFrame>
  );
}

function StoryPanel({ stage }: { stage: NonNullable<ReturnType<typeof getStage>> }) {
  return (
    <AsciiFrame title="Lore" className="story-panel reveal-panel">
      <div className="panel-body">
        <span className="chapter-tag">The Living Grid</span>
        <h3>{stage.title}</h3>
        <p className="subtitle">{stage.subtitle}</p>

        <div className="narrative-stack">
          {stage.narrative.slice(0, 2).map((block) => (
            <p key={`${block.speaker}-${block.kind}-${block.text}`} className={block.kind}>
              <strong>{block.speaker}</strong>
              {block.text}
            </p>
          ))}
        </div>

        <div className="ascii-divider">+---+---+---+---+</div>

        <section className="law-block" aria-label="The Laws of Life">
          <h4>The Laws of Life</h4>
          <p>A cell is born if it has exactly 3 neighbors.</p>
          <p>A cell survives with 2 or 3 neighbors.</p>
          <p>Otherwise, it dies or remains dead.</p>
        </section>

        <div className="ascii-divider">+---+---+---+---+</div>

        <section className="legend-block" aria-label="Legend">
          <h4>Legend</h4>
          <span><i className="alive-swatch" /> Alive Cell</span>
          <span><i className="dead-swatch" /> Dead Cell</span>
          <p>Neighbors are the 8 surrounding cells. The grid wraps at the edges.</p>
        </section>

        <figure className="lore-illustration-wrap">
          <svg
            className="lore-illustration"
            viewBox="0 0 640 360"
            role="img"
            aria-labelledby="living-grid-gate-title"
          >
            <title id="living-grid-gate-title">A glider crossing the Living Grid gate</title>
            <rect width="640" height="360" fill="#06100f" />
            <g stroke="#d9ae58" strokeOpacity="0.12" fill="none">
              <path d="M0 240H640M0 280H640M0 320H640M80 240V360M160 240V360M240 240V360M320 240V360M400 240V360M480 240V360M560 240V360" />
              <path d="M40 40H600V320H40ZM56 56H584V304H56" />
            </g>
            <path d="M208 280V158a112 112 0 0 1 224 0V280" fill="#0a1514" stroke="#d9ae58" strokeWidth="8" />
            <path d="M232 280V158a88 88 0 0 1 176 0V280" fill="#06100f" stroke="#d9ae58" strokeOpacity="0.35" strokeWidth="2" />
            <g fill="#a8d95a">
              <rect x="300" y="142" width="18" height="18" />
              <rect x="322" y="164" width="18" height="18" />
              <rect x="278" y="186" width="18" height="18" />
              <rect x="300" y="186" width="18" height="18" />
              <rect x="322" y="186" width="18" height="18" />
            </g>
            <path d="M268 258H372M296 270H344M456 110h24m-12-12v24M140 180h16m-8-8v16" stroke="#d9ae58" strokeWidth="2" />
          </svg>
        </figure>

      </div>
    </AsciiFrame>
  );
}

type InteractiveWorldProps = {
  grid: Parameters<typeof BoardCanvas>[0]["grid"];
  generation: number;
  stepsTaken: number;
  selectedCell?: { row: number; col: number };
  hoveredCell?: { row: number; col: number };
  population: number;
  selectedNeighbors?: number;
  onToggleCell: (row: number, col: number) => void;
  onHoverCell: (cell?: { row: number; col: number }) => void;
};

function InteractiveWorld({
  grid,
  generation,
  stepsTaken,
  selectedCell,
  hoveredCell,
  population,
  selectedNeighbors,
  onToggleCell,
  onHoverCell
}: InteractiveWorldProps) {
  const sizeLabel = `${grid.length} x ${grid[0]?.length ?? 0}`;

  return (
    <AsciiFrame title="The Living Grid" className="world-panel reveal-panel">
      <BoardCanvas
        grid={grid}
        selectedCell={selectedCell}
        hoveredCell={hoveredCell}
        onToggleCell={onToggleCell}
        onHoverCell={onHoverCell}
      />
      <div className="world-metrics">
        <span>Generation: {generation}</span>
        <span>Size: {sizeLabel}</span>
        <span>Wrap: On</span>
      </div>
    </AsciiFrame>
  );
}

function QuestLog({
  stage,
  completedStageIds,
  runResult
}: {
  stage: NonNullable<ReturnType<typeof getStage>>;
  completedStageIds: string[];
  runResult?: { ok: boolean; message: string; objectiveIds: string[] };
}) {
  const stageComplete = completedStageIds.includes(stage.id);

  return (
    <AsciiFrame title="Quest Log" className="quest-panel reveal-panel">
      <div className="panel-body">
        <h3>Current Quest</h3>
        <p className="quest-name">&gt; {stage.title}</p>
        <p>{stage.subtitle}</p>
        <ul className="objective-list">
          {stage.objectives.map((objective, index) => {
            const prologueSeed = stage.id === "life-prologue" && index < 2;
            const done = prologueSeed || stageComplete || runResult?.objectiveIds.includes(objective.id);
            return (
              <li key={objective.id} className={done ? "done" : ""}>
                <span className="objective-box" aria-hidden="true">{done ? "x" : ""}</span>
                {objective.text}
              </li>
            );
          })}
        </ul>

        {runResult ? (
          <div className="result-box" role="status">
            <>
              <strong>{runResult.ok ? "Restored" : "Distorted"}</strong>
              <p>{runResult.message}</p>
            </>
          </div>
        ) : null}

        <div className="future-quests">
          <h4>Future Quests</h4>
          <span>&gt; Patterns in the Wild</span>
          <span>&gt; Oscillations</span>
          <span>&gt; Gliders</span>
          <span>&gt; Infinite Realms</span>
        </div>
      </div>
    </AsciiFrame>
  );
}

function CommandRail({
  onRun,
  onStep,
  onReset,
  onSandbox
}: {
  onRun: () => void;
  onStep: () => void;
  onReset: () => void;
  onSandbox: () => void;
}) {
  return (
    <AsciiFrame className="command-panel reveal-panel">
      <div className="command-stack">
        <button type="button" className="primary-action command-button" onClick={onRun}>
          <Play size={22} weight="fill" />
          <span>Run</span>
          <kbd>F5</kbd>
        </button>
        <button type="button" className="command-button" onClick={onStep}>
          <SkipForward size={22} weight="bold" />
          <span>Step</span>
          <kbd>F6</kbd>
        </button>
        <button type="button" className="command-button" onClick={onReset}>
          <ArrowCounterClockwise size={22} weight="bold" />
          <span>Reset</span>
          <kbd>F7</kbd>
        </button>
        <button type="button" className="command-button sandbox-command" onClick={onSandbox}>
          <Flask size={22} weight="duotone" />
          <span>Open Sandbox</span>
        </button>
      </div>
    </AsciiFrame>
  );
}

function CodeGrimoire({
  code,
  onChange,
  runResult
}: {
  code: string;
  onChange: (code: string) => void;
  runResult?: { ok: boolean; message: string };
}) {
  return (
    <AsciiFrame title="</> Code Grimoire" className="code-panel reveal-panel">
      <div className="editor-shell">
        <CodeMirror
          value={code}
          height="230px"
          extensions={[python()]}
          theme="dark"
          basicSetup={{
            foldGutter: false,
            highlightActiveLine: true,
            lineNumbers: true
          }}
          onChange={onChange}
        />
      </div>
      <div className="run-console">
        <p>{runResult?.message ?? "The grimoire accepts small fragments first. Pyodide comes next."}</p>
      </div>
    </AsciiFrame>
  );
}

function SettingsPanel({
  isDesktop,
  onClose,
  onQuit
}: {
  isDesktop: boolean;
  onClose: () => void;
  onQuit: () => void;
}) {
  return (
    <div className="settings-overlay" id="settings" role="dialog" aria-label="Settings">
      <AsciiFrame title="Settings" className="settings-panel">
        <div className="settings-body">
          <div className="settings-copy">
            <h2>Academy Controls</h2>
            <p>
              {isDesktop
                ? "Fumbly is running as a desktop shell. Drag the title bar to move the window."
                : "Browser mode is active. Use npm run tauri:dev for the frameless desktop build."}
            </p>
          </div>
          <div className="settings-actions">
            <button type="button" onClick={onClose}>
              Close
            </button>
            <button type="button" className="danger-action" onClick={onQuit}>
              <Power size={18} weight="bold" />
              <span>{isDesktop ? "Quit Fumbly" : "Close Tab"}</span>
            </button>
          </div>
        </div>
      </AsciiFrame>
    </div>
  );
}

function SandboxPanel({
  activePreset,
  onClose,
  onApplyPreset
}: {
  activePreset: SandboxPreset;
  onClose: () => void;
  onApplyPreset: (preset: SandboxPreset) => void;
}) {
  const presets: Array<{ id: SandboxPreset; title: string; detail: string }> = [
    { id: "classic", title: "Classic B3/S23", detail: "Birth on 3. Survival on 2 or 3." },
    { id: "overbirth", title: "Overbirth", detail: "Birth on 3 or more neighbors." },
    { id: "weak-survival", title: "Weak Survival", detail: "One neighbor can keep a cell alive." },
    { id: "wrapped", title: "Wrapped Edges", detail: "The board joins at every edge." }
  ];

  return (
    <div className="sandbox-overlay" id="sandbox" role="dialog" aria-label="Sandbox Library">
      <AsciiFrame title="Sandbox Library" className="sandbox-panel">
        <div className="sandbox-header">
          <div>
            <h2>Break the rules on purpose</h2>
            <p>Choose a preset, step the board, and watch what changes.</p>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="sandbox-presets">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={preset.id === activePreset ? "is-active" : ""}
              onClick={() => onApplyPreset(preset.id)}
            >
              <strong>{preset.title}</strong>
              <span>{preset.detail}</span>
            </button>
          ))}
        </div>
        <div className="pattern-strip">
          {patterns.map((pattern) => (
            <span key={pattern.id}>
              {pattern.name}: {pattern.kind}
            </span>
          ))}
        </div>
      </AsciiFrame>
    </div>
  );
}
