function Hero({ title, subtitle, onExploreClick }) {
  return (
    <section className="hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button type="button" className="primary-btn" onClick={onExploreClick}>
        View Schedule
      </button>
    </section>
  );
}

export default Hero;
