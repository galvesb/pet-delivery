import { useEffect, useState } from "react";
import { api } from "@/api/client";
import type { FaqItem } from "@/types";
import { FaqAccordion } from "@/components/home/FaqAccordion";

export function ContactSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    api.get<FaqItem[]>("/faqs").then((res) => {
      setFaqs(res.data);
    }).catch(() => {});
  }, []);

  return (
    <section className="contact-section container">
      <h2>Contato & Perguntas Frequentes</h2>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <div>
              <strong>Endereço</strong>
              <p>Rua Victor Augusto Mesquita, 458</p>
              <p>Massaguaçu - Caraguatatuba, SP</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div>
              <strong>Telefone / WhatsApp</strong>
              <p>
                <a href="tel:+5511963416515">(11) 96341-6515</a>
              </p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🕐</span>
            <div>
              <strong>Horário de Funcionamento</strong>
              <p>Segunda a Sábado</p>
              <p>8h às 19h</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📸</span>
            <div>
              <strong>Instagram</strong>
              <p>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @petshop
                </a>
              </p>
            </div>
          </div>
        </div>
        {faqs.length > 0 && (
          <div>
            <FaqAccordion items={faqs} />
          </div>
        )}
      </div>
    </section>
  );
}
