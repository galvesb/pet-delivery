const steps = [
  {
    icon: "🛒",
    title: "Escolha seus produtos",
    desc: "Navegue pelo catálogo, filtre por categoria e adicione ao carrinho o que seu pet precisa.",
  },
  {
    icon: "💳",
    title: "Pague online",
    desc: "Finalize sua compra com segurança em poucos cliques.",
  },
  {
    icon: "📦",
    title: "Receba em casa",
    desc: "Entregamos na sua porta com rapidez e muito cuidado.",
  },
];

export function HowItWorks() {
  return (
    <section className="how-it-works container">
      <h2>Como funciona</h2>
      <p className="how-it-works-subtitle">Comprar para o seu pet nunca foi tão fácil</p>
      <div className="how-it-works-steps">
        {steps.map((step, i) => (
          <div key={i} className="how-it-works-step-wrapper">
            <div className="how-it-works-step">
              <div className="how-it-works-number">{i + 1}</div>
              <div className="how-it-works-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="how-it-works-connector" aria-hidden="true">
                <svg width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10 Q40 2 80 10" stroke="#E63946" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                  <polygon points="74,6 80,10 74,14" fill="#E63946" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
