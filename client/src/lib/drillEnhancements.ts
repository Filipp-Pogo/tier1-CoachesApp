/**
 * Drill Enhancements — richer content for common development drills.
 * Keyed by drill ID. Merged into drill data at runtime.
 *
 * Coordinate system for diagrams:
 *   x: 0-100 (court width, 0=left, 100=right)
 *   y: 0-100 (court length, 0=far baseline, 100=near baseline, 50=net)
 */

import type { DrillDiagram } from './data';

export interface DrillEnhancement {
  diagram?: DrillDiagram;
  stepByStep?: string[];
  whyItMatters?: string;
  variations?: string[];
  commonSetupErrors?: string[];
}

export const drillEnhancements: Record<string, DrillEnhancement> = {
  // ═══════════════════════════════════════════════════════════════════
  // FOUNDATIONS — Red/Orange Ball
  // ═══════════════════════════════════════════════════════════════════

  'f-warmup-1': {
    diagram: {
      caption: 'Cone line relay — 4 movements, 3m apart',
      positions: [
        { x: 50, y: 92, label: 'P', role: 'player' },
        { x: 40, y: 92, label: 'P', role: 'player' },
        { x: 30, y: 92, label: 'C', role: 'coach' },
      ],
      zones: [
        { x: 48, y: 50, width: 4, height: 4, label: '1' },
        { x: 48, y: 62, width: 4, height: 4, label: '2' },
        { x: 48, y: 74, width: 4, height: 4, label: '3' },
        { x: 48, y: 86, width: 4, height: 4, label: '4' },
      ],
      paths: [
        { from: { x: 50, y: 90 }, to: { x: 50, y: 52 }, kind: 'movement', label: 'relay path' },
      ],
    },
    stepByStep: [
      'Set 4 cones in a line, 3m apart, each marked with a movement card.',
      'Players line up single-file at the start cone.',
      'On go, first player moves to cone 1 (bear crawl), stands up, jogs to cone 2.',
      'Cone 2: crab walk sideways. Cone 3: frog jumps. Cone 4: lateral shuffle back.',
      'Next player goes when previous reaches cone 2 (staggered relay).',
    ],
    whyItMatters:
      'Young players build every sport movement on this base. Without athletic literacy — pushing off both feet, staying low, moving laterally — proper footwork can never develop on court.',
    variations: [
      'Add a ball balance on the racket for higher challenge.',
      'Race as teams for competitive energy.',
      'Reverse the pattern coming back.',
    ],
    commonSetupErrors: [
      'Cones too far apart — movements lose quality from fatigue.',
      'Too many players in line — long waits kill engagement.',
      'No demo at each cone — players default to sloppy form.',
    ],
  },

  'f-warmup-2': {
    diagram: {
      caption: 'Mini-court rally — cooperative, short distance',
      positions: [
        { x: 30, y: 42, label: 'P1', role: 'player' },
        { x: 70, y: 58, label: 'P2', role: 'player' },
      ],
      paths: [
        { from: { x: 30, y: 42 }, to: { x: 70, y: 58 }, label: 'rally' },
        { from: { x: 70, y: 58 }, to: { x: 30, y: 42 }, style: 'dashed' },
      ],
      zones: [
        { x: 18, y: 30, width: 64, height: 40, label: 'rally zone', color: 'muted' },
      ],
    },
    stepByStep: [
      'Both players stand inside the service boxes (close to the net).',
      'P1 drops and hits a soft forehand over the net.',
      'P2 lets it bounce once, then hits softly back.',
      'Count rally length out loud — aim for 10 consecutive hits.',
      'Switch after each 10-ball rally.',
    ],
    whyItMatters:
      'Rally consistency at short range builds contact point, racket path, and visual tracking before adding pace or distance. Players who can rally 10 here will rally 20 from the baseline.',
    variations: [
      'Crosscourt only (both players stand on deuce side).',
      'Add scoring — first to 20 together wins.',
      'No bounce (volley-to-volley) for advanced.',
    ],
    commonSetupErrors: [
      'Players start too far back — ball dies before reaching partner.',
      'Hitting too hard — defeats the rhythm goal.',
      'No count — loses the cooperative focus.',
    ],
  },

  'f-movement-1': {
    diagram: {
      caption: 'Split step + shadow swing — no ball',
      positions: [
        { x: 50, y: 90, label: 'P', role: 'player' },
        { x: 50, y: 55, label: 'C', role: 'coach' },
      ],
      paths: [
        { from: { x: 50, y: 55 }, to: { x: 35, y: 85 }, kind: 'movement', label: 'point' },
        { from: { x: 50, y: 90 }, to: { x: 35, y: 85 }, kind: 'movement', style: 'dashed' },
      ],
    },
    stepByStep: [
      'Player stands at the baseline in ready position.',
      'Coach mimics a serve motion from the other side.',
      'As coach "contacts", player performs a split step (small hop, land balanced).',
      'Coach points left or right — player shuffles that way and shadows a full swing.',
      'Recover to center with crossover step, reset, repeat.',
    ],
    whyItMatters:
      'The split step is the most missed athletic moment in junior tennis. Training it without the ball — just timing the hop to the coach\'s contact — hardwires it before pressure is added.',
    variations: [
      'Add a forehand/backhand call instead of pointing.',
      'Coach feeds a ball after the split — player hits, recovers.',
      'Two players side-by-side mirror each other.',
    ],
    commonSetupErrors: [
      'Player hops too early — split must land on coach\'s contact.',
      'Hopping too high — it\'s a small, athletic bounce.',
      'No recovery step — player stays where they swung.',
    ],
  },

  'f-feeding-1': {
    diagram: {
      caption: 'Forehand crosscourt feed — target zone',
      positions: [
        { x: 75, y: 20, label: 'C', role: 'coach' },
        { x: 75, y: 90, label: 'P', role: 'player' },
      ],
      paths: [
        { from: { x: 75, y: 20 }, to: { x: 75, y: 78 }, label: 'feed' },
        { from: { x: 75, y: 88 }, to: { x: 25, y: 30 }, label: 'FH CC' },
      ],
      zones: [
        { x: 12, y: 8, width: 30, height: 30, label: 'target', color: 'accent' },
      ],
    },
    stepByStep: [
      'Coach stands at the opposite service line, forehand side.',
      'Feed a consistent forehand to the player\'s forehand corner.',
      'Player hits crosscourt into the target zone (opposite back corner).',
      'After 5 feeds, pause — give one cue.',
      'Set of 10, then rotate.',
    ],
    whyItMatters:
      'Crosscourt forehand is the most played shot in tennis. If it isn\'t grooved from a young age, everything downstream — patterns, transitions, serve+1 — suffers.',
    variations: [
      'Add a target cone — 1 point per hit.',
      'Mix in a backhand feed every 3rd ball.',
      'Increase pace gradually as rhythm improves.',
    ],
    commonSetupErrors: [
      'Coach feeds inconsistently — player can\'t groove.',
      'No target zone — player swings without intent.',
      'Too many balls in a row — quality drops off.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // PREP — Green Ball
  // ═══════════════════════════════════════════════════════════════════

  'p-warmup-1': {
    diagram: {
      caption: 'Dynamic warmup + mini tennis progression',
      positions: [
        { x: 30, y: 40, label: 'P1', role: 'player' },
        { x: 70, y: 40, label: 'P2', role: 'player' },
        { x: 30, y: 60, label: 'P3', role: 'player' },
        { x: 70, y: 60, label: 'P4', role: 'player' },
      ],
      paths: [
        { from: { x: 30, y: 40 }, to: { x: 70, y: 60 }, label: 'CC' },
        { from: { x: 70, y: 40 }, to: { x: 30, y: 60 }, label: 'CC' },
      ],
    },
    stepByStep: [
      'Full dynamic warmup — jog, side shuffle, high knees, butt kicks (5 min).',
      'Pairs into service boxes, crosscourt mini rally (3 min).',
      'Add spin — topspin forehand only (2 min).',
      'Progress to baseline after 10+ ball rallies consistently.',
    ],
    whyItMatters:
      'Green ball players need to feel spin before they swing with full pace. Mini-court topspin is the bridge between flat red-ball hitting and full-court rally tolerance.',
    variations: [
      'Hit-and-switch: after each ball, rotate one spot clockwise.',
      'Add a "no errors" rule — if ball goes wide, restart count.',
    ],
    commonSetupErrors: [
      'Skipping the dynamic warmup — injury risk, poor first reps.',
      'Rushing to baseline before mini-court rhythm is established.',
    ],
  },

  'p-feeding-1': {
    diagram: {
      caption: 'Crosscourt forehand rally — full court',
      positions: [
        { x: 80, y: 10, label: 'P1', role: 'player' },
        { x: 20, y: 90, label: 'P2', role: 'player' },
      ],
      paths: [
        { from: { x: 80, y: 10 }, to: { x: 20, y: 90 }, label: 'CC' },
        { from: { x: 20, y: 90 }, to: { x: 80, y: 10 }, style: 'dashed' },
      ],
      zones: [
        { x: 10, y: 50, width: 35, height: 40, label: 'target', color: 'accent' },
        { x: 55, y: 10, width: 35, height: 40, label: 'target', color: 'accent' },
      ],
    },
    stepByStep: [
      'Both players stand in their forehand (deuce) corners.',
      'Start with a cooperative crosscourt feed.',
      'Rally crosscourt only — ball must land in the crosscourt half.',
      'Count continuous crosscourts out loud.',
      'Swap to backhand corners after 3 minutes.',
    ],
    whyItMatters:
      'The crosscourt rally is where 70% of points live. Owning this exchange — hitting with shape, depth, and recovery — is the single biggest tactical lever at the green ball level.',
    variations: [
      'Add a depth cone — only balls past the service line score.',
      'Live point after 4 crosscourts — player can go DTL.',
      'One player crosscourt only, one player can go anywhere.',
    ],
    commonSetupErrors: [
      'No depth target — players rally short and safe.',
      'Allowing any direction — defeats the pattern focus.',
      'Too many coaching cues mid-rally — let them play.',
    ],
  },

  'p-serve-1': {
    diagram: {
      caption: 'Serve placement — deuce side targets',
      positions: [
        { x: 60, y: 95, label: 'P', role: 'player' },
      ],
      paths: [
        { from: { x: 60, y: 95 }, to: { x: 35, y: 28 }, label: 'wide' },
        { from: { x: 60, y: 95 }, to: { x: 48, y: 40 }, label: 'body' },
        { from: { x: 60, y: 95 }, to: { x: 58, y: 40 }, label: 'T' },
      ],
      zones: [
        { x: 28, y: 22, width: 12, height: 18, label: 'wide', color: 'accent' },
        { x: 42, y: 30, width: 10, height: 14, label: 'body', color: 'muted' },
        { x: 54, y: 30, width: 10, height: 14, label: 'T', color: 'accent' },
      ],
    },
    stepByStep: [
      'Player serves from the deuce side.',
      'First 4 serves: wide target (outside corner).',
      'Next 4 serves: body target (middle).',
      'Last 4 serves: T target (center line).',
      'Score: 1 point per target hit. Goal is 8/12.',
    ],
    whyItMatters:
      'A serve that always goes to the middle gives no advantage. Learning three placements — wide, body, T — is the first step toward a tactical serve that sets up the next ball.',
    variations: [
      'Second serve only (spin required) — tighter target scoring.',
      'Call the target before you toss — commitment under pressure.',
      'Two-serve rule — use both if first misses.',
    ],
    commonSetupErrors: [
      'No visible targets (cones/tape) — player has nothing to aim at.',
      'Mixing all three targets randomly — no repetition builds.',
      'Allowing let-serves to count — must be a real serve.',
    ],
  },

  'p-liveball-1': {
    diagram: {
      caption: 'Neutral rally + attack on short ball',
      positions: [
        { x: 50, y: 10, label: 'C', role: 'coach' },
        { x: 50, y: 95, label: 'P', role: 'player' },
      ],
      paths: [
        { from: { x: 50, y: 10 }, to: { x: 50, y: 85 }, label: 'deep' },
        { from: { x: 50, y: 10 }, to: { x: 50, y: 65 }, label: 'short!', style: 'dashed' },
        { from: { x: 50, y: 65 }, to: { x: 30, y: 20 }, label: 'attack' },
      ],
      zones: [
        { x: 10, y: 8, width: 35, height: 30, label: 'target', color: 'accent' },
      ],
    },
    stepByStep: [
      'Coach feeds 2-3 deep balls — player rallies neutral.',
      'On feeder\'s cue, next ball is short (lands at service line).',
      'Player moves in, attacks short ball DTL or inside-out.',
      'Recover to center. Reset. Repeat.',
    ],
    whyItMatters:
      'Most green-ball players camp at the baseline and let balls come to them. Training the "see short, move in, attack" pattern early prevents passive baseline habits from locking in.',
    variations: [
      'Live point after the attack — must finish at net.',
      'Add a second short ball — build pattern awareness.',
      'Require DTL only on attack — force commitment.',
    ],
    commonSetupErrors: [
      'Short feed lands in the net — poor feeder rhythm kills the drill.',
      'No recovery demand — player stays inside baseline.',
    ],
  },

  'p-points-1': {
    diagram: {
      caption: 'Crosscourt-only singles — first to 7',
      positions: [
        { x: 80, y: 10, label: 'P1', role: 'player' },
        { x: 20, y: 90, label: 'P2', role: 'player' },
      ],
      zones: [
        { x: 10, y: 8, width: 38, height: 82, label: 'legal', color: 'accent' },
        { x: 52, y: 8, width: 38, height: 82, label: 'out', color: 'muted' },
      ],
    },
    stepByStep: [
      'Both players in deuce corners. Serve starts the point.',
      'All shots must land in the crosscourt half of the court.',
      'Any shot landing DTL is out — point to opponent.',
      'First to 7 wins. Switch to ad side for next game.',
    ],
    whyItMatters:
      'This constraint point forces players to work the crosscourt exchange — the real home of winning tactical patterns. It rewards depth, spin, and patience over flashy DTL flip-outs.',
    variations: [
      'Allow DTL only on short balls (open court rule).',
      'Add a target zone deep crosscourt for bonus points.',
      'Time-limited — 5 minutes, highest score wins.',
    ],
    commonSetupErrors: [
      'Unclear on where "crosscourt" ends — use tape or cones.',
      'Not tracking score — loses competitive intent.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // JASA — Yellow Ball Competitive
  // ═══════════════════════════════════════════════════════════════════

  'j-warmup-1': {
    diagram: {
      caption: 'Shadow pattern warmup — serve+1 rehearsal',
      positions: [
        { x: 60, y: 95, label: 'P', role: 'player' },
      ],
      paths: [
        { from: { x: 60, y: 95 }, to: { x: 35, y: 28 }, label: 'serve' },
        { from: { x: 50, y: 85 }, to: { x: 30, y: 55 }, kind: 'movement', label: '+1 move' },
        { from: { x: 30, y: 55 }, to: { x: 75, y: 20 }, label: 'FH +1' },
      ],
    },
    stepByStep: [
      'Dynamic warmup (5 min).',
      'Shadow a serve motion — full swing, no ball.',
      'Shadow the +1 move — split step, forehand inside-out swing.',
      'Build to live: toss + hit serve, then live +1 forehand.',
      '10 reps each side (deuce + ad).',
    ],
    whyItMatters:
      'JASA players need to think in patterns, not just shots. Shadowing the serve+1 before each session wires the most winning pattern in tennis — serve wide, forehand to open court.',
    variations: [
      'Serve+1 to ball machine feed.',
      'Partner rehearsal — one serves, one returns and feeds +1.',
    ],
    commonSetupErrors: [
      'Skipping shadow reps — player jumps to live without grooving.',
      'No visible target for +1 — swing without direction.',
    ],
  },

  'j-feeding-1': {
    diagram: {
      caption: 'Figure-8 pattern — CC then DTL',
      positions: [
        { x: 50, y: 10, label: 'C', role: 'coach' },
        { x: 50, y: 95, label: 'P', role: 'player' },
      ],
      paths: [
        { from: { x: 50, y: 10 }, to: { x: 20, y: 85 }, label: '1' },
        { from: { x: 20, y: 85 }, to: { x: 20, y: 15 }, label: 'CC' },
        { from: { x: 50, y: 10 }, to: { x: 80, y: 85 }, label: '2' },
        { from: { x: 80, y: 85 }, to: { x: 20, y: 15 }, label: 'DTL', style: 'dashed' },
      ],
    },
    stepByStep: [
      'Coach feeds corner to corner — forehand then backhand.',
      'Player hits forehand crosscourt, then backhand down-the-line.',
      'Rally continues in the figure-8 pattern.',
      '8-10 ball patterns, then live point out.',
    ],
    whyItMatters:
      'The figure-8 drills the two most useful patterns (CC and DTL) and the movement that connects them. Players who can run this cleanly have the footwork base for full-court rally tolerance.',
    variations: [
      'Add a target cone on each side for depth.',
      'Reverse pattern (BH CC, FH DTL).',
      'Random call — coach says CC or DTL on each feed.',
    ],
    commonSetupErrors: [
      'Feeds arrive too early — player can\'t recover.',
      'No directional requirement — pattern breaks down.',
    ],
  },

  'j-liveball-1': {
    diagram: {
      caption: 'Rally tolerance — 10+ ball minimum',
      positions: [
        { x: 50, y: 10, label: 'P1', role: 'player' },
        { x: 50, y: 95, label: 'P2', role: 'player' },
      ],
      paths: [
        { from: { x: 50, y: 10 }, to: { x: 30, y: 85 } },
        { from: { x: 30, y: 85 }, to: { x: 70, y: 15 } },
        { from: { x: 70, y: 15 }, to: { x: 50, y: 90 }, style: 'dashed' },
      ],
      zones: [
        { x: 15, y: 25, width: 70, height: 50, label: 'rally zone', color: 'muted' },
      ],
    },
    stepByStep: [
      'Both players start at the baseline.',
      'Cooperative crosscourt feed to begin.',
      'Rally must reach 10 balls before any attack is allowed.',
      'Ball 11 onwards: live point — anywhere legal.',
      'Reset every point, track longest rally.',
    ],
    whyItMatters:
      'Players who can\'t rally 10 balls consistently can\'t win matches against anyone solid. This is the baseline measurement of JASA-level competence.',
    variations: [
      'Bump to 15 balls for higher-UTR players.',
      'No-misses format — one error loses the rally.',
      'Add depth zone — every ball must pass service line.',
    ],
    commonSetupErrors: [
      'Letting players attack before 10 — drill collapses.',
      'No count called — nobody knows when to go live.',
    ],
  },

  'j-serve-1': {
    diagram: {
      caption: 'Serve + 1 forehand — deuce side',
      positions: [
        { x: 60, y: 95, label: 'P', role: 'player' },
        { x: 35, y: 25, label: 'R', role: 'player' },
      ],
      paths: [
        { from: { x: 60, y: 95 }, to: { x: 30, y: 30 }, label: 'wide serve' },
        { from: { x: 35, y: 25 }, to: { x: 50, y: 80 }, label: 'return' },
        { from: { x: 50, y: 80 }, to: { x: 85, y: 20 }, label: '+1 FH' },
      ],
      zones: [
        { x: 70, y: 10, width: 20, height: 25, label: 'target', color: 'accent' },
      ],
    },
    stepByStep: [
      'Server serves wide to the deuce side.',
      'Returner blocks a neutral return to the middle.',
      'Server moves around and hits inside-out forehand into the open ad court.',
      'Point is live from the +1 onwards.',
      '10 reps, then switch roles.',
    ],
    whyItMatters:
      'Serve+1 is the highest-percentage winning pattern at every level from juniors to ATP. Training it explicitly — not hoping it emerges — separates tactical players from ball-hitters.',
    variations: [
      'T serve + forehand to the open deuce corner.',
      'Body serve + forehand anywhere.',
      'Second-serve version — must win point within 3 shots.',
    ],
    commonSetupErrors: [
      'Returner hits too aggressively — distorts the pattern.',
      'Server doesn\'t move around for the forehand — defaults to backhand.',
    ],
  },

  'j-points-1': {
    diagram: {
      caption: 'Short-ball game — attack on anything short',
      positions: [
        { x: 50, y: 10, label: 'P1', role: 'player' },
        { x: 50, y: 95, label: 'P2', role: 'player' },
      ],
      zones: [
        { x: 15, y: 40, width: 70, height: 20, label: 'trigger zone', color: 'accent' },
      ],
    },
    stepByStep: [
      'Regular singles points, but one rule: any ball landing inside the service box must be attacked.',
      'Attack means aggressive swing — not a pusher return.',
      'Failing to attack = point to opponent.',
      'Play to 11, win by 2.',
    ],
    whyItMatters:
      'Short balls are free points if you take them. JASA players who develop the instinct to step in and attack — instead of hitting a safe reset — win the close matches.',
    variations: [
      'Must come to net after attacking a short ball.',
      'Must hit DTL on the attack.',
      'Double bonus point for a winner off a short ball.',
    ],
    commonSetupErrors: [
      'No clear service-line marker — arguments on what counts.',
      'Weak feeders start points — no short balls appear.',
    ],
  },

  'j-comp-1': {
    diagram: {
      caption: 'Star drill — 5 balls, 5 corners',
      positions: [
        { x: 50, y: 10, label: 'C', role: 'coach' },
        { x: 50, y: 90, label: 'P', role: 'player' },
      ],
      paths: [
        { from: { x: 50, y: 10 }, to: { x: 15, y: 80 }, label: '1' },
        { from: { x: 50, y: 10 }, to: { x: 85, y: 80 }, label: '2' },
        { from: { x: 50, y: 10 }, to: { x: 85, y: 50 }, label: '3', style: 'dashed' },
        { from: { x: 50, y: 10 }, to: { x: 15, y: 50 }, label: '4', style: 'dashed' },
        { from: { x: 50, y: 10 }, to: { x: 50, y: 85 }, label: '5', style: 'dashed' },
      ],
    },
    stepByStep: [
      'Coach feeds 5 balls in sequence from a basket.',
      'Ball 1: wide forehand. Ball 2: wide backhand.',
      'Ball 3: short forehand (drop). Ball 4: short backhand.',
      'Ball 5: middle (overhead or put-away).',
      'Player must return all 5 in play. Track misses.',
    ],
    whyItMatters:
      'The star drill tests everything — movement, transition, approach, overhead, baseline recovery — in one pattern. It\'s the cleanest way to diagnose competitive fitness gaps.',
    variations: [
      'Full recovery required between balls (stress fitness).',
      'Timed — how many complete 5-ball sets in 5 minutes.',
      'All 5 must be placed in coach\'s target.',
    ],
    commonSetupErrors: [
      'Feeds land inconsistently — player fights the ball, not the drill.',
      'No rest between sets — quality collapses.',
    ],
  },
};
