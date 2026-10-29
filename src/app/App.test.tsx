import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("Fumbly app shell", () => {
  it("renders the Fumbly menu, episode shelf, and playable lesson surface", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Fumbly" })).toBeInTheDocument();
    expect(screen.getByText("Episode Shelf")).toBeInTheDocument();
    expect(screen.getByText("Episode I: The Living Grid")).toBeInTheDocument();
    expect(screen.getAllByText("The Living Grid").length).toBeGreaterThan(0);
    expect(screen.getByText(/Code Grimoire/)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Run/i }).length).toBeGreaterThan(0);
  });
});
