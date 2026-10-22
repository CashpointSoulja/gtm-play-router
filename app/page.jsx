'use client';
import { useState, useEffect } from 'react';
import { SIGNALS } from '../lib/signals';

const now = () => new Date().toTimeString().slice(0, 5);
const DEPLOY_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://gtm-play-router.ayomideahmedcp.workers.dev';

function tick(setter, target) {
  const start = performance.now(), dur = 600;
  function step(t) {
    const p = Math.max(0, Math.min(1, (t - start) / dur));
    const e = 1 - Math.pow(1 - p, 3);
    setter(Math.round(target * e));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

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
      <header>
        <img src="/assets/vercel-symbol-white.svg" alt="Vercel" width="18" height="16" />
        <h1>GTM Play Router</h1>
        <span className="meta">Unofficial concept · Sample data</span>
      </header>
      <main className="wrap">
        <section className="hero">
          <p className="meta-label">For Vercel GTM Engineering</p>
          <h2 className="display">From what your best rep does, to what every rep does. As a system.</h2>
          <p className="lede">The GTM Engineer role exists to build AI apps and workflows that drive revenue, and to ship top performers' best practices to the org as systems. This is that system, built on your own stack: a Next.js app routing every GTM signal through a real AI SDK agent on the Vercel AI Cloud, with the reasoning attached to every decision. This is where I think the issue is, this is how I have solved it before, and this is how I would solve it for you.</p>
          <div className="beats">
            <div className="beat">
              <p className="beat-label">The issue</p>
              <p className="beat-title">Best practices die in transit</p>
              <p className="beat-body">A top performer's best practice lives in their head and their sent folder. By the time it reaches the org, the deal it would have saved is gone.</p>
            </div>
            <div className="beat">
              <p className="beat-label">Before</p>
              <p className="beat-title">How I have solved it</p>
              <p className="beat-body">At Corgi I ran product operations and built the internal systems the team worked from. Before that I founded a company and ran its operations end to end.</p>
            </div>
            <div className="beat">
              <p className="beat-label">For you</p>
              <p className="beat-title">How I would solve it</p>
              <p className="beat-body">Route every GTM signal to the right motion with a real AI SDK agent loop, turn observed top-performer behavior into a shipped, auditable play, and keep the reasoning attached to every decision.</p>
            </div>
          </div>
          <p className="sample">Sample data throughout. Independent concept, not affiliated with or endorsed by Vercel.</p>
        </section>

        <section className="section">
          <h3 className="section-title">Signals in. Systems out.</h3>
          <p className="note">Signals come in from Sales, Success, Marketing and Data. Pick one, route it, and watch an anecdote become a system with its reasoning attached. The routing call is live: it hits an AI SDK route on this deployment.</p>
          <div className="stat-strip">
            <div className="stat"><p className="stat-value">{cSignals}</p><p className="stat-label">Signals routed</p></div>
            <div className="stat"><p className="stat-value">{cPlays}</p><p className="stat-label">Plays shipped to the org</p></div>
            <div className="stat"><p className="stat-value">{ageMin}m</p><p className="stat-label">Session age</p></div>
          </div>
          <div className="console">
            <div className="panel">
              <div className="ph">Incoming signals</div>
              <div className="signals">
                {SIGNALS.map((sg) => (
                  <div key={sg.id} className={'sig' + (routed[sg.id] ? ' routed' : '') + (sel === sg.id ? ' sel' : '')} onClick={() => setSel(sg.id)}>
                    <div className="src">{sg.src}</div>
                    <div className="txt">{sg.txt}</div>
                    {routed[sg.id] && decisions[sg.id] && (
                      <div className="motion">Routed: <b>{decisions[sg.id].motion}</b> · Play shipped: <b>{sg.play}</b></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <div className="ph">Routed decision</div>
              <div className="detail">
                {!s && <div className="empty">Select a signal on the left, then route it.</div>}
                {s && (
                  <>
                    <div className="src">{s.src}</div>
                    <p className="detail-txt">{s.txt}</p>
                    <div className="why"><b>Observed top-performer behavior:</b> {s.obs}</div>
                    {routing && (
                      <div className="routing-state">
                        <span className="spinner"></span>
                        <span className="mono">POST /api/route-signal · generateObject · awaiting structured output</span>
                      </div>
                    )}
                    {!routed[s.id] && !routing && <button className="route" onClick={() => routeSignal(s)}>Route this signal</button>}
                    {routed[s.id] && decisions[s.id] && (
                      <>
                        <div className="conf">
                          <div className="conf-head"><span>Motion: <b>{decisions[s.id].motion}</b></span><span className="mono">{Math.round(decisions[s.id].confidence * 100)}% confidence</span></div>
                          <div className="conf-bar"><i style={{width: Math.round(decisions[s.id].confidence * 100) + '%'}}></i></div>
                        </div>
                        <div className="why"><b>Why this motion:</b> {decisions[s.id].reason}</div>
                        <div className="play">
                          <div className="step"><span className="n">1</span><span><b>Trigger:</b> {s.txt.split('.')[0].toLowerCase()}.</span></div>
                          <div className="step"><span className="n">2</span><span><b>Motion:</b> {decisions[s.id].motion}, owner assigned per territory.</span></div>
                          <div className="step"><span className="n">3</span><span><b>Action:</b> drafted from the observed behavior, context attached.</span></div>
                          <div className="step"><span className="n">4</span><span><b>System:</b> play is now the org default for this signal; every future match routes here.</span></div>
                        </div>
                        <div className="draft">{s.draft}</div>
                        <div className="shipped"><b>Shipped:</b> "{s.play}" is live for the whole org. This is the part that used to take a quarter.</div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h3 className="section-title">Running on Vercel, visibly</h3>
          <p className="note">Everything below is actually wired in this deployment, not a mockup.</p>
          <div className="sys">
            <div className="sys-row">
              <p className="sys-name">AI SDK + Vercel AI Gateway</p>
              <p className="sys-role">The routing brain</p>
              <p className="sys-desc">Each "Route this signal" click POSTs to /api/route-signal, which calls a model through the Vercel AI Gateway with structured output: motion, reason, confidence, typed and logged.</p>
              <div className="term">
                {lastCall ? (
                  <>
                    <div className="tline"><span className="tk">route</span>{lastCall.route}</div>
                    <div className="tline"><span className="tk">model</span>{lastCall.model}</div>
                    <div className="tline"><span className="tk">latency</span>{lastCall.latencyMs}ms</div>
                    <div className="tline"><span className="tk">engine</span>{lastCall.engine === 'model' ? 'live model' : 'deterministic fallback, flagged'}</div>
                  </>
                ) : (
                  <div className="tline dim">Route a signal above and the live call appears here.</div>
                )}
              </div>
            </div>
            <div className="sys-row">
              <p className="sys-name">Next.js App Router</p>
              <p className="sys-role">This app</p>
              <p className="sys-desc">Server-rendered shell plus this interactive router, served from the edge. Deployment: <span className="mono">{DEPLOY_URL}</span></p>
            </div>
            <div className="sys-row">
              <p className="sys-name">Vercel Analytics + Speed Insights</p>
              <p className="sys-role">The measurement layer</p>
              <p className="sys-desc">@vercel/analytics and @vercel/speed-insights are mounted in the root layout. Page views and Web Vitals for this session are being collected right now.</p>
            </div>
            <div className="sys-row">
              <p className="sys-name">Preview deployments</p>
              <p className="sys-role">The workflow</p>
              <p className="sys-desc">Every push to the GitHub repo ships a preview deployment; production is just the main branch. That is how GTM iterations would get reviewed by Sales, Success, Marketing and Data, on real links.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <h3 className="section-title">How a GTM Engineer would grow this</h3>
          <p className="note">The next iteration, on the same platform.</p>
          <div className="sys">
            <div className="sys-row">
              <p className="sys-name">v0</p>
              <p className="sys-role">The play surface</p>
              <p className="sys-desc">Play drafts rendered as generated UI from the observed-behavior template, reviewed before anything ships to the org.</p>
            </div>
            <div className="sys-row">
              <p className="sys-name">Workflows</p>
              <p className="sys-role">Durable routing</p>
              <p className="sys-desc">Long-running intake workflows that wait on human review before a play ships, instead of firing in one request.</p>
            </div>
            <div className="sys-row">
              <p className="sys-name">Observability</p>
              <p className="sys-role">The audit trail</p>
              <p className="sys-desc">Vercel Observability across the agent loop: every classification typed, logged and replayable, exactly like the audit feed below.</p>
            </div>
            <div className="sys-row">
              <p className="sys-name">Web Analytics</p>
              <p className="sys-role">The proof</p>
              <p className="sys-desc">Play performance, signal to meeting and signal to order, tracked so the org sees which shipped plays actually drive revenue.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <h3 className="section-title">Nothing routes without a reason</h3>
          <p className="note">Every classification, every drafted action, every shipped play, on record, with the model route that produced it.</p>
          <div className="panel">
            <div id="audit">
              {audit.map((r, i) => (
                <div className="row" key={i}><time>{r.t}</time><span>{r.text}</span></div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer>
        <img src="/assets/vercel-symbol-white.svg" alt="Vercel" width="16" height="14" className="ftri" />
        <p><b>GTM Play Router</b>, an independent concept by Ayo Ahmed. Synthetic data. Not affiliated with or endorsed by Vercel.</p>
        <p className="mono stack-line">Next.js · AI SDK · Vercel AI Gateway · Vercel Analytics · Speed Insights · {DEPLOY_URL}</p>
        <p className="attr">Vercel, the Vercel design, Next.js and related marks, designs and logos are trademarks or registered trademarks of Vercel, Inc. or its affiliates in the US and other countries.</p>
      </footer>
    </>
  );
}
