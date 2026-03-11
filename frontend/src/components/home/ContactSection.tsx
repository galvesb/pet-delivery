export function ContactSection() {
  return (
    <section className="contact-section container">
      <h2>Onde estamos</h2>
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
        <div className="contact-map">
          <iframe
            title="Localização no mapa"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-45.43%2C-23.63%2C-45.37%2C-23.59&layer=mapnik&marker=-23.608%2C-45.408"
            width="100%"
            height="350"
            loading="lazy"
            style={{ border: "none", borderRadius: "var(--border-radius)" }}
          />
        </div>
      </div>
    </section>
  );
}
