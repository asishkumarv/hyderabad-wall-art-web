import type { ReactNode } from "react";

export function renderRichText(content: string) {
  const lines = content.split("\n").filter(Boolean);
  let listBuffer: string[] = [];
  const nodes: ReactNode[] = [];

  const flushList = (key: string) => {
    if (!listBuffer.length) return;
    nodes.push(
      <ul key={key} className="list-disc space-y-2 pl-6 text-lg leading-relaxed text-muted-foreground mb-6">
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
        <h3 key={index} className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4">
          {line.replace(/^###\s*/, "")}
        </h3>,
      );
      return;
    }

    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={index} className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-6">
          {line.replace(/^##\s*/, "")}
        </h2>,
      );
      return;
    }

    const parts = line.split(/(\*\*.*?\*\*)/g);
    nodes.push(
      <p key={index} className="text-lg leading-relaxed text-muted-foreground mb-6">
        {parts.map((part, partIndex) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={partIndex} className="font-bold text-foreground">
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
