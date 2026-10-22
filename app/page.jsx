'use client';
import { useState, useEffect } from 'react';
import { SIGNALS } from '../lib/signals';

const now = () => new Date().toTimeString().slice(0, 5);
const DEPLOY_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'http://localhost:3000';

function tick(setter, target) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setter(target); return; }
  const start = performance.now(), dur = 600;
  function step(t) {
    const p = Math.max(0, Math.min(1, (t - start) / dur));
    const e = 1 - Math.pow(1 - p, 3);
    setter(Math.round(target * e));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function Home() {
  const [routed, setRouted] = useState({});
  const [decisions, setDecisions] = useState({});
  const [sel, setSel] = useState(null);
  const [routing, setRouting] = useState(false);
  const [cSignals, setCSignals] = useState(0);
  const [cPlays, setCPlays] = useState(0);
  const [ageMin, setAgeMin] = useState('0.0');
  const [audit, setAudit] = useState([{ t: now(), text: 'Router session opened. Intake live for Sales, Success, Marketing and Data.' }]);
  const [lastCall, setLastCall] = useState(null);
  const t0 = useState(() => Date.now())[0];

  useEffect(() => {
    const u = () => setAgeMin(((Date.now() - t0) / 60000).toFixed(1));
    const id = setInterval(u, 10000);
    u();
    return () => clearInterval(id);
  }, [t0]);

  const log = (text) => setAudit((a) => [{ t: now(), text }, ...a]);
  const s = SIGNALS.find((x) => x.id === sel);

  async function routeSignal(sig) {
    setRouting(true);
    log(`Classifying signal from ${sig.src} via /api/route-signal (AI SDK generateObject, structured output)...`);
    try {
      const res = await fetch('/api/route-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src: sig.src, txt: sig.txt }),
      });
      const d = await res.json();
      setDecisions((m) => ({ ...m, [sig.id]: d }));
      setRouted((m) => ({ ...m, [sig.id]: true }));
      tick(setCSignals, Object.keys({ ...routed, [sig.id]: true }).length);
      tick(setCPlays, Object.keys({ ...routed, [sig.id]: true }).length);
      setLastCall(d);
      log(`Signal from ${sig.src} routed to ${d.motion} (${Math.round(d.confidence * 100)}% confidence) via ${d.route} - ${d.model}, ${d.latencyMs}ms. Reason recorded.`);
      log(`Play "${sig.play}" shipped to org - drafted action attached for review.`);
    } catch (e) {
      log('Routing failed - network error.');
    }
    setRouting(false);
  }

  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <h1>GTM Play Router</h1>
          <span className="t-compact muted">Unofficial concept · Sample data</span>
        </div>
      </header>
      <main className="wrap">
        <section className="hero">
          <div className="grid hero-grid">
            <h2 className="t-display">From what your best rep does, to what every rep does. As a system.</h2>
            <p className="t-lede measure">I read the GTM Engineer job description. This is where I think the issue is, this is how I have solved it before, and this is how I would solve it for you. I built it on your systems: a Next.js app routing through a real AI SDK agent on the Vercel AI Cloud.</p>
            <p className="hero-meta t-compact muted">
              <span>For Vercel GTM Engineering</span>
              <span>Sample data throughout. Independent concept, not affiliated with or endorsed by Vercel.</span>
            </p>
          </div>
          <div className="rows beats">
            <div className="row grid">
              <p className="row-key t-body muted">The issue</p>
              <div className="row-body">
                <h3 className="t-subsection">Best practices die in transit</h3>
                <p className="t-body muted measure">A top performer's best practice lives in their head and their sent folder. By the time it reaches the org, the deal it would have saved is gone.</p>
              </div>
            </div>
            <div className="row grid">
              <p className="row-key t-body muted">Before</p>
              <div className="row-body">
                <h3 className="t-subsection">How I have solved it</h3>
                <p className="t-body muted measure">At Corgi I ran product operations and built the internal systems the team worked from. Before that I founded a company and ran its operations end to end.</p>
              </div>
            </div>
            <div className="row grid">
              <p className="row-key t-body muted">For you</p>
              <div className="row-body">
                <h3 className="t-subsection">How I would solve it</h3>
                <p className="t-body muted measure">Route every GTM signal to the right motion with a real AI SDK agent loop, turn observed top-performer behavior into a shipped, auditable play, and keep the reasoning attached to every decision.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3 className="t-section">Signals in. Systems out.</h3>
            <p className="t-body muted measure">Signals come in from Sales, Success, Marketing and Data. Pick one, route it, and watch an anecdote become a system with its reasoning attached. The routing call is live: it hits an AI SDK route on this deployment.</p>
          </div>
          <dl className="grid kpis">
            <div className="kpi"><dt className="t-compact muted">Signals routed</dt><dd className="t-kpi">{cSignals}</dd></div>
            <div className="kpi"><dt className="t-compact muted">Plays shipped to the org</dt><dd className="t-kpi">{cPlays}</dd></div>
            <div className="kpi"><dt className="t-compact muted">Session age</dt><dd className="t-kpi">{ageMin}<span className="unit">m</span></dd></div>
          </dl>
          <div className="grid console">
            <div className="col-signals">
              <h4 className="col-label t-body">Incoming signals</h4>
              <ul className="signals">
                {SIGNALS.map((sg) => (
                  <li key={sg.id}>
                    <button type="button" aria-pressed={sel === sg.id} className={'sig' + (routed[sg.id] ? ' routed' : '') + (sel === sg.id ? ' sel' : '')} onClick={() => setSel(sg.id)}>
                      <span className="src t-compact">{sg.src}</span>
                      <span className="txt t-body">{sg.txt}</span>
                      {routed[sg.id] && decisions[sg.id] && (
                        <span className="motion t-compact"><Check /><span>Routed: <b>{decisions[sg.id].motion}</b> · Play shipped: <b>{sg.play}</b></span></span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-decision">
              <h4 className="col-label t-body">Routed decision</h4>
              <div className="decision" aria-live="polite">
                {!s && <p className="empty t-body">Select a signal on the left, then route it.</p>}
                {s && (
                  <>
                    <div>
                      <p className="src t-compact">{s.src}</p>
                      <p className="detail-txt t-subsection">{s.txt}</p>
                    </div>
                    <p className="why t-body"><b>Observed top-performer behavior:</b> {s.obs}</p>
                    {routing && (
                      <div className="routing-state">
                        <span className="spinner" aria-hidden="true"></span>
                        <span className="mono">POST /api/route-signal · generateObject · awaiting structured output</span>
                      </div>
                    )}
                    {!routed[s.id] && !routing && <button className="route" onClick={() => routeSignal(s)}>Route this signal</button>}
                    {routed[s.id] && decisions[s.id] && (
                      <div className="result">
                        <div>
                          <dl className="readout">
                            <div><dt className="t-compact muted">Motion</dt><dd className="t-title">{decisions[s.id].motion}</dd></div>
                            <div className="conf-value"><dt className="t-compact muted">confidence</dt><dd className="t-title">{Math.round(decisions[s.id].confidence * 100)}%</dd></div>
                          </dl>
                          <div className="conf-bar" role="presentation"><i style={{width: Math.round(decisions[s.id].confidence * 100) + '%'}}></i></div>
                        </div>
                        <p className="why t-body"><b>Why this motion:</b> {decisions[s.id].reason}</p>
                        <ol className="play t-body">
                          <li><span className="n">1</span><span><b>Trigger:</b> {s.txt.split('.')[0].toLowerCase()}.</span></li>
                          <li><span className="n">2</span><span><b>Motion:</b> {decisions[s.id].motion}, owner assigned per territory.</span></li>
                          <li><span className="n">3</span><span><b>Action:</b> drafted from the observed behavior, context attached.</span></li>
                          <li><span className="n">4</span><span><b>System:</b> play is now the org default for this signal; every future match routes here.</span></li>
                        </ol>
                        <div className="draft t-body">{s.draft}</div>
                        <div className="shipped t-body"><Check /><p><b>Shipped:</b> "{s.play}" is live for the whole org. This is the part that used to take a quarter.</p></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3 className="t-section">Running on Vercel, visibly</h3>
            <p className="t-body muted measure">Everything below is actually wired in this deployment, not a mockup.</p>
          </div>
          <div className="rows">
            <div className="row grid">
              <div className="row-key">
                <h4 className="t-body">AI SDK + Vercel AI Gateway</h4>
                <p className="t-compact muted">The routing brain</p>
              </div>
              <div className="row-body">
                <p className="t-body muted measure">Each "Route this signal" click POSTs to <code>/api/route-signal</code>, which calls a model through the Vercel AI Gateway with structured output: motion, reason, confidence, typed and logged.</p>
                <div className="call t-compact">
                  {lastCall ? (
                    <dl>
                      <div className="call-row"><dt>route</dt><dd>{lastCall.route}</dd></div>
                      <div className="call-row"><dt>model</dt><dd className="mono">{lastCall.model}</dd></div>
                      <div className="call-row"><dt>latency</dt><dd className="tnum">{lastCall.latencyMs}ms</dd></div>
                      <div className="call-row"><dt>engine</dt><dd>{lastCall.engine === 'model' ? 'live model' : 'deterministic fallback, flagged'}</dd></div>
                    </dl>
                  ) : (
                    <p className="call-empty">Route a signal above and the live call appears here.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="row grid">
              <div className="row-key">
                <h4 className="t-body">Next.js App Router</h4>
                <p className="t-compact muted">This app</p>
              </div>
              <div className="row-body">
                <p className="t-body muted measure">Server-rendered shell plus this interactive router, served from Vercel's edge. Deployment: <code className="url">{DEPLOY_URL}</code></p>
              </div>
            </div>
            <div className="row grid">
              <div className="row-key">
                <h4 className="t-body">Vercel Analytics + Speed Insights</h4>
                <p className="t-compact muted">The measurement layer</p>
              </div>
              <div className="row-body">
                <p className="t-body muted measure"><code>@vercel/analytics</code> and <code>@vercel/speed-insights</code> are mounted in the root layout. Page views and Web Vitals for this session are being collected right now.</p>
              </div>
            </div>
            <div className="row grid">
              <div className="row-key">
                <h4 className="t-body">Preview deployments</h4>
                <p className="t-compact muted">The workflow</p>
              </div>
              <div className="row-body">
                <p className="t-body muted measure">Every push to the GitHub repo ships a preview deployment; production is just the main branch. That is how GTM iterations would get reviewed by Sales, Success, Marketing and Data, on real links.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3 className="t-section">How a GTM Engineer would grow this</h3>
            <p className="t-body muted measure">The next iteration, on the same platform.</p>
          </div>
          <div className="rows">
            <div className="row grid">
              <div className="row-key">
                <h4 className="t-body">v0</h4>
                <p className="t-compact muted">The play surface</p>
              </div>
              <div className="row-body"><p className="t-body muted measure">Play drafts rendered as generated UI from the observed-behavior template, reviewed before anything ships to the org.</p></div>
            </div>
            <div className="row grid">
              <div className="row-key">
                <h4 className="t-body">Workflows</h4>
                <p className="t-compact muted">Durable routing</p>
              </div>
              <div className="row-body"><p className="t-body muted measure">Long-running intake workflows that wait on human review before a play ships, instead of firing in one request.</p></div>
            </div>
            <div className="row grid">
              <div className="row-key">
                <h4 className="t-body">Observability</h4>
                <p className="t-compact muted">The audit trail</p>
              </div>
              <div className="row-body"><p className="t-body muted measure">Vercel Observability across the agent loop: every classification typed, logged and replayable, exactly like the audit feed below.</p></div>
            </div>
            <div className="row grid">
              <div className="row-key">
                <h4 className="t-body">Web Analytics</h4>
                <p className="t-compact muted">The proof</p>
              </div>
              <div className="row-body"><p className="t-body muted measure">Play performance, signal to meeting and signal to order, tracked so the org sees which shipped plays actually drive revenue.</p></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h3 className="t-section">Nothing routes without a reason</h3>
            <p className="t-body muted measure">Every classification, every drafted action, every shipped play, on record, with the model route that produced it.</p>
          </div>
          <div className="audit" id="audit">
            <table className="t-compact">
              <thead className="sr-only"><tr><th scope="col">Time</th><th scope="col">Event</th></tr></thead>
              <tbody>
                {audit.map((r, i) => (
                  <tr key={i}><td><time className="mono">{r.t}</time></td><td>{r.text}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="wrap grid">
          <p className="foot-main t-body muted"><b>GTM Play Router</b>, an independent concept by <b>Ayo Ahmed</b>. Synthetic data. Not affiliated with or endorsed by Vercel.</p>
          <div className="foot-stack t-compact muted">
            <img src="/assets/vercel-symbol-white.svg" alt="Vercel" width="14" height="12" />
            <p>Deployed on Vercel · Next.js · AI SDK · Vercel AI Gateway · Vercel Analytics · Speed Insights · <code className="url">{DEPLOY_URL}</code></p>
          </div>
          <p className="foot-legal t-compact muted measure">Vercel, the Vercel design, Next.js and related marks, designs and logos are trademarks or registered trademarks of Vercel, Inc. or its affiliates in the US and other countries.</p>
        </div>
      </footer>
    </>
  );
}
