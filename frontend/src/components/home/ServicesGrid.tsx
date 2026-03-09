export function ServicesGrid() {
  return (
    <section id="servicos" className="services container">
      <h2>Atenda às necessidades do seu pet</h2>
      <div className="services-grid">
        <div className="service-card active">
          <h3>✂️ Agendar Banho e Tosa</h3>
          <p>Equipe especializada para cuidar da higiene e estética do seu pet. Agende pelo site.</p>
          <br />
          <button className="btn btn-outline" style={{ width: "100%", textAlign: "center" }} disabled>
            Em breve
          </button>
        </div>
        <div className="service-card">
          <h3>📦 Delivery de Produtos</h3>
          <p>Compre rações, petiscos e brinquedos sem sair de casa. Entrega rápida.</p>
        </div>
        <div className="service-card">
          <h3>🩺 Consulta Veterinária</h3>
          <p>Agende uma consulta presencial ou tire dúvidas de saúde com nossos veterinários.</p>
        </div>
      </div>
    </section>
  );
}
