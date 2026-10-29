import type { ReactNode } from "react";

type AsciiFrameProps = {
  title?: string;
  className?: string;
  children: ReactNode;
};

export function AsciiFrame({ title, className = "", children }: AsciiFrameProps) {
  return (
    <section className={`ascii-frame ${className}`.trim()}>
      <span className="frame-corner frame-corner-tl" aria-hidden="true" />
      <span className="frame-corner frame-corner-tr" aria-hidden="true" />
      <span className="frame-corner frame-corner-br" aria-hidden="true" />
      <span className="frame-corner frame-corner-bl" aria-hidden="true" />
      {title ? (
        <header className="frame-title">
          <span>{title}</span>
        </header>
      ) : null}
      {children}
    </section>
  );
}
