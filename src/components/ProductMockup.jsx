import Icon from './Icon.jsx';

function Window({ title, children, compact }) {
  return (
    <div className={`mock-window ${compact ? 'compact' : ''}`}>
      <div className="console-bar">
        <span className="c-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="console-title mono">{title}</span>
      </div>
      <div className="mock-body">{children}</div>
    </div>
  );
}

const Pill = ({ tone, children }) => <span className={`m-pill ${tone}`}>{children}</span>;

export default function ProductMockup({ variant, compact = false }) {
  if (variant === 'hms') {
    return (
      <Window title="ryrach hms · reservations — today" compact={compact}>
        <div className="m-row"><span className="mono m-key">Deluxe 204</span><span>A. Banda · 2 nights</span><Pill tone="ok">Paid</Pill></div>
        <div className="m-row"><span className="mono m-key">Suite 301</span><span>M. Phiri · 4 nights</span><Pill tone="info">In-house</Pill></div>
        <div className="m-row"><span className="mono m-key">Standard 112</span><span>J. Nkhoma · 1 night</span><Pill tone="warn">Arriving</Pill></div>
        <div className="m-row"><span className="mono m-key">Standard 108</span><span>T. Mwale · 3 nights</span><Pill tone="ok">Confirmed</Pill></div>
        <div className="occ">
          <span className="kpi-label mono">Occupancy · sample</span>
          <div className="occ-bar"><i style={{ width: '76%' }} /></div>
          <span className="mono occ-val">76%</span>
        </div>
      </Window>
    );
  }

  if (variant === 'sms') {
    return (
      <Window title="school management · today" compact={compact}>
        <div className="kpis kpis-sm">
          <div className="kpi"><span className="kpi-label mono">Students</span><span className="kpi-value">1,248</span></div>
          <div className="kpi"><span className="kpi-label mono">Present</span><span className="kpi-value">1,193</span></div>
          <div className="kpi"><span className="kpi-label mono">Fees due</span><span className="kpi-value warn">MK 4.2m</span></div>
        </div>
        <div className="m-row"><span className="mono m-key">Form 2A</span><span>Morning register</span><Pill tone="ok">Complete</Pill></div>
        <div className="m-row"><span className="mono m-key">Term 2 fees</span><span>Invoicing run</span><Pill tone="info">In progress</Pill></div>
        <div className="m-row"><span className="mono m-key">Report cards</span><span>End of term</span><Pill tone="warn">Draft</Pill></div>
      </Window>
    );
  }

  if (variant === 'kyc') {
    return (
      <Window title="kyc verification · session" compact={compact}>
        <div className="kyc-steps">
          <div className="kyc-step done"><i className="s-dot ok" /><span>Document capture</span><Pill tone="ok">Passed</Pill></div>
          <div className="kyc-step done"><i className="s-dot ok" /><span>Selfie match</span><Pill tone="ok">Passed</Pill></div>
          <div className="kyc-step active"><i className="s-dot run" /><span>Liveness</span><Pill tone="warn">Running</Pill></div>
          <div className="kyc-step"><i className="s-dot idle" /><span>Decision</span><Pill tone="idle">Pending</Pill></div>
        </div>
        <pre className="kyc-json mono">{`{
  "check": "liveness",
  "status": "processing",
  "session": "sbx_9f2e…"
}`}</pre>
      </Window>
    );
  }

  if (variant === 'mdm') {
    return (
      <Window title="mdm · fleet overview" compact={compact}>
        <div className="kpis kpis-sm">
          <div className="kpi"><span className="kpi-label mono">Enrolled</span><span className="kpi-value">64</span></div>
          <div className="kpi"><span className="kpi-label mono">Compliant</span><span className="kpi-value">61</span></div>
          <div className="kpi"><span className="kpi-label mono">Attention</span><span className="kpi-value warn">3</span></div>
        </div>
        <div className="m-row"><Icon name="smartphone" size={15} /><span className="mono m-key">Field Tab 014</span><span>Android 13</span><Pill tone="ok">Compliant</Pill></div>
        <div className="m-row"><Icon name="monitor" size={15} /><span className="mono m-key">Sales Laptop 007</span><span>Windows 11</span><Pill tone="info">Synced 2m ago</Pill></div>
        <div className="m-row"><Icon name="smartphone" size={15} /><span className="mono m-key">Field Tab 022</span><span>Android 12</span><Pill tone="warn">Policy pending</Pill></div>
      </Window>
    );
  }

  if (variant === 'custom') {
    return (
      <Window title="custom platform · architecture" compact={compact}>
        <div className="arch">
          <div className="arch-box">Client app · web / mobile</div>
          <i className="arch-line" />
          <div className="arch-box accent">Ryrach API gateway</div>
          <i className="arch-line" />
          <div className="arch-row">
            <div className="arch-box sm">Auth</div>
            <div className="arch-box sm">Core services</div>
            <div className="arch-box sm">Billing</div>
          </div>
          <i className="arch-line" />
          <div className="arch-box">Database · object storage</div>
        </div>
      </Window>
    );
  }

  return (
    <Window title="ryrach system · console" compact={compact}>
      <div className="m-row"><Icon name="layers" size={15} /><span>Modular platform</span><Pill tone="info">Sample</Pill></div>
      <div className="m-row"><Icon name="code" size={15} /><span>API-first architecture</span><Pill tone="ok">Ready</Pill></div>
      <div className="m-row"><Icon name="database" size={15} /><span>Structured data model</span><Pill tone="ok">Ready</Pill></div>
    </Window>
  );
}