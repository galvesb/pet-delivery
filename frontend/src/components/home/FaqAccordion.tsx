import { useState } from "react";
import type { FaqItem } from "@/types";

interface Props {
  items: FaqItem[];
}

export function FaqAccordion({ items }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="faq-accordion">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className="faq-item">
            <button
              className="faq-question"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span className="faq-icon">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
