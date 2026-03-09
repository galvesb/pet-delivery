export function Footer() {
  return (
    <footer>
      <div className="container">
        <h3>🐾 HomePet Delivery</h3>
        <p style={{ marginTop: 10, fontSize: 14 }}>Tudo para o seu pet no conforto do seu lar.</p>
        <p style={{ marginTop: 30, fontSize: 12, opacity: 0.8 }}>
          Copyright © {new Date().getFullYear()} HomePet. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
