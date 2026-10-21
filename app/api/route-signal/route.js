import { generateObject, gateway } from 'ai';
import { z } from 'zod';

const MOTIONS = ['New-logo', 'Save', 'Enablement', 'Expansion'];

const RoutingDecision = z.object({
  motion: z.enum(MOTIONS),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
});

const SYSTEM = `You are the routing brain of a GTM play router. A GTM signal arrives from one of four teams (Sales, Success, Marketing, Data). Classify it into exactly one revenue motion:
- New-logo: a warm path into an account that is not a customer
- Save: an active deal or trial at risk of stalling or churning
- Enablement: a buying question that needs a fast, well-formed answer
- Expansion: an existing customer showing growth signals
Return the motion, one sentence of reasoning a revenue leader would accept, and a confidence between 0 and 1.`;

function deterministicRoute(src, txt) {
  const t = (src + ' ' + txt).toLowerCase();
  let motion = 'Enablement', reason = 'A question signal routes to Enablement by default.';
  if (t.includes('moved') || t.includes('not a customer') || t.includes('champion')) {
    motion = 'New-logo'; reason = 'A moved champion is a warm path into a non-customer account, so it routes to New-logo.';
  } else if (t.includes('quiet') || t.includes('stall') || t.includes('security review')) {
    motion = 'Save'; reason = 'Silence at security review is a stall signal, so it routes to Save.';
  } else if (t.includes('usage') || t.includes('seat') || t.includes('tripled')) {
    motion = 'Expansion'; reason = 'Usage growth without seat growth is an expansion signal, so it routes to Expansion.';
  }
  return { motion, reason, confidence: 0.62 };
}

export async function POST(req) {
  const { src, txt } = await req.json();
  const started = Date.now();

  if (process.env.AI_GATEWAY_API_KEY) {
    try {
      const { object, response } = await generateObject({
        model: gateway('openai/gpt-4o-mini'),
        schema: RoutingDecision,
        system: SYSTEM,
        prompt: `Signal source: ${src}\nSignal: ${txt}`,
        maxRetries: 1,
      });
      return Response.json({
        ...object,
        engine: 'model',
        model: response?.modelId || 'openai/gpt-4o-mini',
        route: 'Vercel AI Gateway',
        latencyMs: Date.now() - started,
      });
    } catch (e) {
      return Response.json({
        ...deterministicRoute(src, txt),
        engine: 'deterministic-fallback',
        model: 'none (fallback)',
        route: 'in-app rules (gateway call failed)',
        latencyMs: Date.now() - started,
      });
    }
  }
  return Response.json({
    ...deterministicRoute(src, txt),
    engine: 'deterministic-fallback',
    model: 'none (fallback)',
    route: 'in-app rules (no gateway key set)',
    latencyMs: Date.now() - started,
  });
}
