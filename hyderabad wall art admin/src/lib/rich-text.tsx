import type { ReactNode } from "react";

export function renderRichText(content: string) {
  const lines = content.split("\n").filter(Boolean);
  let listBuffer: string[] = [];
  const nodes: ReactNode[] = [];

  const flushList = (key: string) => {
    if (!listBuffer.length) return;
    nodes.push(
      <ul key={key} className="list-disc space-y-1 pl-5 text-sm leading-7 text-muted-foreground">
        {listBuffer.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  lines.forEach((line, index) => {
    if (line.startsWith("- ")) {
      listBuffer.push(line.replace(/^\-\s*/, ""));
      return;
    }

    flushList(`list-${index}`);

    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={index} className="text-lg font-semibold tracking-tight">
          {line.replace(/^###\s*/, "")}
        </h3>,
      );
      return;
    }

    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={index} className="text-2xl font-semibold tracking-tight">
          {line.replace(/^##\s*/, "")}
        </h2>,
      );
      return;
    }

    const parts = line.split(/(\*\*.*?\*\*)/g);
    nodes.push(
      <p key={index} className="text-sm leading-7 text-muted-foreground">
        {parts.map((part, partIndex) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={partIndex} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={partIndex}>{part}</span>
          ),
        )}
      </p>,
    );
  });

  flushList("list-end");
  return nodes;
}

export function formatDisplayDate(value: number) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}