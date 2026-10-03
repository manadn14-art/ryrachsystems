const ITEMS = ['RYRACH HMS', 'SCHOOL MANAGEMENT', 'KYC VERIFICATION', 'MDM & MONITORING', 'CUSTOM SAAS', 'API & INTEGRATIONS'];

export default function Ticker() {
  const row = (hidden) => (
    <div className="ticker-track" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <span className="tick-item" key={item + (hidden ? '-b' : '-a')}>
          {item}
          <span className="tick-sep" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker" role="marquee" aria-label="Ryrach products and capabilities">
      {row(false)}
      {row(true)}
    </div>
  );
}