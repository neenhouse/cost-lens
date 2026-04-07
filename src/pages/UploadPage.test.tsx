import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UploadPage from "./UploadPage";

describe("UploadPage", () => {
  it("renders the page heading", () => {
    render(
      <MemoryRouter>
        <UploadPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Upload Billing Data")).toBeInTheDocument();
  });

  it("renders the Paste CSV and Upload File tabs", () => {
    render(
      <MemoryRouter>
        <UploadPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Paste CSV")).toBeInTheDocument();
    expect(screen.getByText("Upload File")).toBeInTheDocument();
  });

  it("defaults to Paste CSV mode with a textarea", () => {
    render(
      <MemoryRouter>
        <UploadPage />
      </MemoryRouter>
    );
    const textarea = screen.getByPlaceholderText(/Paste your billing CSV here/i);
    expect(textarea).toBeInTheDocument();
  });

  it("shows Load Sample AWS Data button", () => {
    render(
      <MemoryRouter>
        <UploadPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Load Sample AWS Data")).toBeInTheDocument();
  });

  it("shows Analyze Data button after loading sample data", () => {
    render(
      <MemoryRouter>
        <UploadPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Load Sample AWS Data"));
    expect(screen.getByText("Analyze Data")).toBeInTheDocument();
  });
});
