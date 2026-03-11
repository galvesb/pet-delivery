import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="hero container">
      <div className="hero-content">
        <h1 className="hero-title">Encontre tudo para o seu pet e agende serviços online</h1>
        <p className="hero-desc">
          Fornecemos rações, acessórios e um serviço completo de banho e tosa
          entregando conforto para você e seu melhor amigo.
        </p>
        <Link to="/products" className="btn">Explorar Produtos</Link>
        <div className="hero-stats">
          <div className="stat">
            <h3>500+</h3>
            <p>Produtos disponíveis</p>
          </div>
          <div className="stat">
            <h3>4.9★</h3>
            <p>Avaliação média</p>
          </div>
          <div className="stat">
            <h3>24h</h3>
            <p>Entrega rápida</p>
          </div>
        </div>
      </div>
      <div className="hero-image-wrapper">
        <div className="hero-img-box">
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="Gato fofo"
          />
        </div>
        <div className="price-tag">
          🏷️ Ração Premium <span>R$ 125</span>
        </div>
      </div>
    </section>
  );
}
