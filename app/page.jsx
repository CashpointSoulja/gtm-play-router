'use client';
import { useState, useEffect } from 'react';
import { SIGNALS } from '../lib/signals';

const now = () => new Date().toTimeString().slice(0, 5);
const DEPLOY_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'http://localhost:3000';

function tick(setter, target) {
  const start = performance.now(), dur = 650;
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
    const move = (e) => {
      document.querySelectorAll('.beat').forEach((c) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', e.clientX - r.left + 'px');
        c.style.setProperty('--my', e.clientY - r.top + 'px');
      });
    };
    document.addEventListener('pointermove', move);
    return () => document.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    }), { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const u = () => setAgeMin(((Date.now() - t0) / 60000).toFixed(1));
    const id = setInterval(u, 10000);
    u();
    return () => clearInterval(id);
  }, [t0]);

  useEffect(() => {
    const onScroll = () => {
      const tri = document.querySelector('.tri-hero');
      if (tri) tri.style.setProperty('--par', (window.scrollY * 0.12) + 'px');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      <div className="gridlines"></div>
      <header>
        <svg width="22" height="19" viewBox="0 0 76 65" fill="#fff" aria-label="triangle"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>
        <h1>GTM Play Router</h1>
        <span className="tag">Unofficial concept</span>
      </header>
      <div className="wrap">
        <section className="hero">
          <div className="orb"></div>
          <svg className="tri-hero" width="340" height="294" viewBox="0 0 76 65" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>
          <svg className="tri-hero tri-hero2" width="180" height="156" viewBox="0 0 76 65" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>
          <div className="eyebrow fadeup d1">For Vercel GTM Engineering</div>
          <h2 className="fadeup d2">From what your best rep does,<br/>to what every rep does.<br/><span className="blueline">As a system.</span></h2>
          <p className="sub fadeup d3">I read the GTM Engineer job description. This is where I think the issue is. This is how I have solved it before. And this is how I would solve it for you - and I built it on your systems: a Next.js app, routing through a real AI SDK agent on the Vercel AI Cloud.</p>
          <div className="beats">
            <div className="beat fadeup d3"><span className="num">01</span><span className="k">The issue</span><b>Best practices die in transit</b><p>A top performer's best practice lives in their head and their sent folder. By the time it reaches the org, the deal it would have saved is gone.</p></div>
            <div className="beat fadeup d4"><span className="num">02</span><span className="k">Before</span><b>How I have solved it</b><p>At Corgi I ran product operations and built the internal systems the team worked from. Before that I founded a company and ran its operations end to end.</p></div>
            <div className="beat fadeup d5"><span className="num">03</span><span className="k">For you</span><b>How I would solve it</b><p>Route every GTM signal to the right motion with a real AI SDK agent loop, turn observed top-performer behavior into a shipped, auditable play, and keep the reasoning attached to every decision.</p></div>
          </div>
          <p className="sample fadeup d5">Sample data throughout. Independent concept - not affiliated with or endorsed by Vercel.</p>
        </section>

        <section className="section" data-reveal>
          <div className="eyebrow">01 / The router</div>
          <h3>Signals in. Systems out.</h3>
          <p className="note">Signals come in from Sales, Success, Marketing and Data. Pick one, route it, and watch an anecdote become a system with its reasoning attached. The routing call is live: it hits an AI SDK route on this deployment.</p>
          <div className="counter">
            <div><b>{cSignals}</b><span>signals routed</span></div>
            <div><b>{cPlays}</b><span>plays shipped to the org</span></div>
            <div><b>{ageMin}m</b><span>session age</span></div>
          </div>
          <div className="grid">
            <div className="panel">
              <div className="ph"><span className="dot"></span>Incoming signals</div>
              <div className="signals">
                {SIGNALS.map((sg) => (
                  <div key={sg.id} className={'sig' + (routed[sg.id] ? ' routed' : '') + (sel === sg.id ? ' sel' : '')} onClick={() => setSel(sg.id)}>
                    <div className="src">{sg.src}</div>
                    <div className="txt">{sg.txt}</div>
                    {routed[sg.id] && decisions[sg.id] && (
                      <div className="motion">ROUTED: <b>{decisions[sg.id].motion}</b> · PLAY SHIPPED: <b>{sg.play}</b></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <div className="ph"><span className="dot"></span>Routed decision</div>
              <div className="detail">
                {!s && <div className="empty">Select a signal on the left, then route it.</div>}
                {s && (
                  <>
                    <div><span className="src" style={{fontFamily:"'Geist Mono',ui-monospace,monospace",fontSize:11,color:'#8a8a8a',fontWeight:500,textTransform:'uppercase',letterSpacing:'.1em'}}>{s.src}</span></div>
                    <p style={{marginTop:4}}>{s.txt}</p>
                    <div className="why"><b>Observed top-performer behavior:</b> {s.obs}</div>
                    {routing && (
                      <div className="routing-state">
                        <div className="beam"></div>
                        <span className="mono">POST /api/route-signal · generateObject · awaiting structured output<span className="dots"><i>.</i><i>.</i><i>.</i></span></span>
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
                          <div className="step"><span className="n">2</span><span><b>Motion:</b> {decisions[s.id].motion} - owner assigned per territory.</span></div>
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

        <section className="section" data-reveal>
          <div className="eyebrow">02 / Powered by</div>
          <h3>Running on Vercel, visibly</h3>
          <p className="note">Everything below is actually wired in this deployment - not a mockup.</p>
          <div className="stack">
            <div className="beat feature">
              <span className="k">AI SDK + Vercel AI Gateway</span><b>The routing brain</b>
              <p>Each "Route this signal" click POSTs to /api/route-signal, which calls a model through the Vercel AI Gateway with structured output - motion, reason, confidence, typed and logged.</p>
              <div className="term">
                <div className="term-head"><span className="livedot"></span><span>live</span></div>
                {lastCall ? (
                  <>
                    <div className="tline"><span className="tk">route</span>{lastCall.route}</div>
                    <div className="tline"><span className="tk">model</span>{lastCall.model}</div>
                    <div className="tline"><span className="tk">latency</span>{lastCall.latencyMs}ms</div>
                    <div className="tline"><span className="tk">engine</span>{lastCall.engine === 'model' ? 'live model' : 'deterministic fallback, flagged'}</div>
                  </>
                ) : (
                  <div className="tline dim">Route a signal above to see the live call here.</div>
                )}
              </div>
            </div>
            <div className="beat"><span className="k">Next.js App Router</span><b>This app</b><p>Server-rendered shell plus this interactive router, served from Vercel's edge. Deployment: <span className="mono" style={{fontSize:12,color:'#ededed'}}>{DEPLOY_URL}</span></p></div>
            <div className="beat"><span className="k">Vercel Analytics + Speed Insights</span><b>The measurement layer</b><p>@vercel/analytics and @vercel/speed-insights are mounted in the root layout - page views and Web Vitals for this session are being collected right now.</p></div>
            <div className="beat"><span className="k">Preview deployments</span><b>The workflow</b><p>Every push to the GitHub repo ships a preview deployment; production is just the main branch. That is how GTM iterations would get reviewed by Sales, Success, Marketing and Data - on real links.</p></div>
          </div>
        </section>

        <section className="section" data-reveal>
          <div className="eyebrow">03 / The stack, if I were on the team</div>
          <h3>How a GTM Engineer would grow this</h3>
          <p className="note">The next iteration, on the same platform.</p>
          <div className="stack">
            <div className="beat"><span className="k">v0</span><b>The play surface</b><p>Play drafts rendered as generated UI from the observed-behavior template, reviewed before anything ships to the org.</p></div>
            <div className="beat"><span className="k">Workflows</span><b>Durable routing</b><p>Long-running intake workflows that wait on human review before a play ships, instead of firing in one request.</p></div>
            <div className="beat"><span className="k">Observability</span><b>The audit trail</b><p>Vercel Observability across the agent loop - every classification typed, logged and replayable, exactly like the audit feed below.</p></div>
            <div className="beat"><span className="k">Web Analytics</span><b>The proof</b><p>Play performance - signal to meeting, signal to order - tracked so the org sees which shipped plays actually drive revenue.</p></div>
          </div>
        </section>

        <section className="section" data-reveal>
          <div className="eyebrow">04 / Audit trail</div>
          <h3>Nothing routes without a reason</h3>
          <p className="note">Every classification, every drafted action, every shipped play - on record, with the model route that produced it.</p>
          <div className="panel">
            <div id="audit">
              {audit.map((r, i) => (
                <div className="row" key={i}><time>{r.t}</time><span>{r.text}</span></div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <footer>
        <div className="ftri"><svg width="16" height="14" viewBox="0 0 76 65" fill="#666"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg></div>
        <b>GTM Play Router</b> - independent concept by Ayo Ahmed. Synthetic data.<br/>
        <span className="mono" style={{fontSize:11.5}}>Deployed on Vercel · Next.js · AI SDK · Vercel AI Gateway · Vercel Analytics · Speed Insights · {DEPLOY_URL}</span>
      </footer>
    </>
  );
}
