import { useEffect, useRef, useState } from 'react';
import Counter from './Counter.jsx';
import Icon from './Icon.jsx';

// The hero's dashboard visualisation. This is a product/interface illustration
// with SAMPLE data — clearly captioned as such, never presented as live stats.
const LOG_POOL = [
  ['POST', '/v1/verify · liveness', '200 · 84ms'],
  ['EVENT', 'reservation.created', 'hms · room 204'],
  ['SYNC', 'device.checkin', 'mdm · 3 devices'],
  ['POST', '/v1/verify · document', '202 · queued'],
  ['EVENT', 'payment.posted', 'hms · invoice 88'],
  ['GET', '/v1/reports/occupancy', '200 · 31ms'],
  ['SYNC', 'policy.push', 'mdm · fleet 64'],
  ['EVENT', 'guest.checked_in', 'hms · room 112'],
];

const SERVICES = [
  ['Ryrach HMS', 'ok'],
  ['KYC Service', 'ok'],
  ['MDM Sync', 'warn'],
  ['API Gateway', 'ok'],
];

export default function MockupConsole() {
  const [logs, setLogs] = useState(() => LOG_POOL.slice(0, 4).map((l, i) => ({ ...l, id: i })));
  const poolIdx = useRef(4);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => {
      setLogs((prev) => {
        const next = LOG_POOL[poolIdx.current % LOG_POOL.length];
        poolIdx.current += 1;
        return [...prev.slice(-3), { ...next, id: poolIdx.current }];
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="console" role="img" aria-label="Illustration of a Ryrach operations dashboard showing sample data">
      <div className="console-bar">
        <span className="c-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="console-title mono">ryrach · operations console</span>
        <span className="chip chip-green"><i className="s-dot ok" /> All systems operational</span>
      </div>
      <div className="console-body">
        <aside className="console-side" aria-hidden="true">
          {['activity', 'bed', 'shieldCheck', 'monitor', 'code', 'database'].map((n) => (
            <span key={n} className="side-dot"><Icon name={n} size={15} /></span>
          ))}
        </aside>
        <div className="console-main">
          <div className="kpis">
            <div className="kpi">
              <span className="kpi-label mono">Active systems</span>
              <span className="kpi-value">12</span>
            </div>
            <div className="kpi">
              <span className="kpi-label mono">Requests today</span>
              <span className="kpi-value"><Counter end={48213} /></span>
            </div>
            <div className="kpi">
              <span className="kpi-label mono">Operations</span>
              <span className="kpi-value"><Counter end={99.2} decimals={1} />%</span>
            </div>
            <div className="kpi">
              <span className="kpi-label mono">Users</span>
              <span className="kpi-value"><Counter end={1284} /></span>
            </div>
          </div>
          <svg className="chart" viewBox="0 0 400 110" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8f7bff" stopOpacity="0.28" />
                <stop offset="1" stopColor="#8f7bff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[22, 48, 74, 100].map((y) => (
              <line key={y} className="chart-grid" x1="0" y1={y} x2="400" y2={y} />
            ))}
            <path
              className="chart-area"
              d="M0,88 C40,82 62,60 92,62 C122,64 142,42 172,46 C202,50 222,32 252,36 C282,40 302,24 332,28 C362,32 382,20 400,22 L400,110 L0,110 Z"
              fill="url(#area)"
            />
            <path
              className="chart-line"
              d="M0,88 C40,82 62,60 92,62 C122,64 142,42 172,46 C202,50 222,32 252,36 C282,40 302,24 332,28 C362,32 382,20 400,22"
              pathLength="1"
            />
          </svg>
          <div className="console-log" aria-hidden="true">
            {logs.map(({ id, 0: level, 1: msg, 2: meta }) => (
              <div className="log-line" key={id}>
                <span className={`lv mono lv-${level.toLowerCase()}`}>{level}</span>
                <span className="log-msg mono">{msg}</span>
                <span className="log-meta mono">{meta}</span>
              </div>
            ))}
          </div>
        </div>
        <aside className="console-status">
          <span className="kpi-label mono">System status</span>
          {SERVICES.map(([name, state]) => (
            <div className="status-row" key={name}>
              <i className={`s-dot ${state}`} />
              <span>{name}</span>
              <span className={`mono st ${state}`}>{state === 'ok' ? 'Operational' : 'Degraded'}</span>
            </div>
          ))}
        </aside>
      </div>
      <div className="console-note mono">Interface illustration · sample data — not live statistics</div>
    </div>
  );
}