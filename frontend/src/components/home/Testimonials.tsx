const testimonials = [
  {
    name: "Maria S.",
    text: "Entrega super rápida! Meu cachorro amou a ração. Sempre compro aqui e nunca me decepcionei.",
    stars: 5,
  },
  {
    name: "João P.",
    text: "Ótima variedade de produtos e preços justos. O atendimento é excelente, super recomendo!",
    stars: 5,
  },
  {
    name: "Ana L.",
    text: "Serviço excelente, sempre compro aqui. O banho e tosa deixou minha gatinha linda!",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="testimonials container">
      <h2>O que nossos clientes dizem</h2>
      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-stars">{"★".repeat(t.stars)}</div>
            <p className="testimonial-text">"{t.text}"</p>
            <span className="testimonial-name">— {t.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
