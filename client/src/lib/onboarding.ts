/*
  TIER 1 ACADEMY — Coach Onboarding Data
  Modules, lessons, and quiz questions for new coach onboarding.
  Quiz requires 90% or higher to pass.
*/

// ─── Types ────────────────────────────────────────────────────────

export interface OnboardingLesson {
  id: string;
  title: string;
  content: string[];        // paragraphs of lesson content
  keyTakeaways: string[];   // bullet points to remember
  /** Optional quote or callout */
  callout?: string;
}

export interface OnboardingModule {
  id: string;
  title: string;
  subtitle: string;
  icon: string;             // lucide icon name
  order: number;
  lessons: OnboardingLesson[];
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  answers: { questionId: string; selectedIndex: number; correct: boolean }[];
}

export const PASS_THRESHOLD = 90;

// ─── Modules ──────────────────────────────────────────────────────

export const onboardingModules: OnboardingModule[] = [
  // ═══════════════════════════════════════════════════════════════
  // MODULE 1: Tier 1 Culture & Philosophy
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'culture',
    title: 'Tier 1 Culture & Philosophy',
    subtitle: 'What we believe and how we operate',
    icon: 'Shield',
    order: 1,
    lessons: [
      {
        id: 'culture-1',
        title: 'The Standard Is The Standard',
        content: [
          'Tier 1 Performance is not a recreational tennis program. It is a performance academy built on the belief that every player — regardless of age or level — deserves structured, purposeful, and accountable coaching. The tagline "The Standard Is The Standard" is not a slogan. It is a daily operating principle.',
          'This means that every session has clear objectives. Every rep matters. Every coach holds the same expectations for effort, behavior, and engagement. Whether you are coaching a 6-year-old in Red Ball or a nationally ranked FTA player, the standard of coaching quality, preparation, and professionalism does not change.',
          'Tier 1 is part of the Woodinville Sports Club campus, but it operates as its own performance brand. Tier 1 handles all academy programming — tennis, golf, and Athletic Performance Lab (APL). WSC handles the facility, membership, and general public-facing operations. These brands do not overlap in design, voice, or content.'
        ],
        keyTakeaways: [
          'Tier 1 is a performance academy, not a recreational program',
          '"The Standard Is The Standard" means consistent quality at every level',
          'Every session must have clear objectives and structure',
          'Tier 1 is the performance brand; WSC is the facility brand — never mix them'
        ],
        callout: '"The Standard Is The Standard." — This is not optional. It applies to every session, every level, every day.'
      },
      {
        id: 'culture-2',
        title: 'Core Values & Player-First Approach',
        content: [
          'Tier 1 operates on six core cultural pillars: Player First, Long-Term Development, Accountability, Professionalism, Intensity With Purpose, and Every Rep Matters. These are not abstract concepts — they are actionable coaching behaviors that should be visible in every session you run.',
          'Player First means that coaching decisions are made in the best interest of the player\'s long-term development, not short-term results or parent satisfaction. It means being honest about a player\'s readiness, even when it is uncomfortable. It means not rushing advancement to make someone feel good.',
          'Long-Term Development means we do not sacrifice fundamentals for quick wins. We build athletic literacy before stroke technique. We build rally tolerance before tactical complexity. We build competitive habits before tournament pressure. The pathway exists for a reason — trust the process.',
          'Accountability means coaches hold players to standards, and coaches are held to standards themselves. If a player is not meeting effort expectations, that is coached — not ignored. If a coach is not preparing sessions with intention, that is addressed.',
          'Professionalism means showing up prepared, on time, dressed appropriately, and ready to deliver. It means communicating clearly with parents and colleagues. It means representing Tier 1 with pride in every interaction.',
          'Intensity With Purpose means every drill has a reason. Every rep has a target. We do not run drills just to fill time. If a drill is not serving the session objective, change it. Energy should be high, but it should be directed.',
          'Every Rep Matters means we do not tolerate lazy reps. If a player is going through the motions, stop the drill and reset the standard. Quality of repetition is more important than quantity.'
        ],
        keyTakeaways: [
          'Six pillars: Player First, Long-Term Development, Accountability, Professionalism, Intensity With Purpose, Every Rep Matters',
          'Player First means long-term development over short-term results',
          'Accountability applies to both players AND coaches',
          'Every drill must have a clear purpose — no filler',
          'Quality of reps matters more than quantity'
        ]
      },
      {
        id: 'culture-3',
        title: 'What Tier 1 Is Not',
        content: [
          'Understanding what Tier 1 is NOT is just as important as understanding what it is. Tier 1 is not a drop-in clinic. It is not a babysitting service. It is not a place where parents dictate coaching decisions. It is not a program where advancement is based on age or how long someone has been enrolled.',
          'Coaches should never use the following words in Tier 1 context: recreational, fitness (as a program descriptor), discount, deal, sale, promo, amazing, incredible, awesome, world-class, or state-of-the-art. These words dilute the brand and misrepresent the culture.',
          'Tier 1 does not lower standards for any group. The HS track is not a "casual" track. Foundations is not "just for little kids." Every level has real expectations, real structure, and real coaching. If you find yourself thinking "this group doesn\'t need as much preparation," you are wrong.'
        ],
        keyTakeaways: [
          'Tier 1 is not recreational, not a drop-in clinic, not babysitting',
          'Advancement is based on readiness, not age or tenure',
          'Never use prohibited brand words: recreational, fitness, discount, amazing, world-class, etc.',
          'Every level deserves the same quality of preparation and coaching'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 2: Development Pathway
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pathway',
    title: 'The Development Pathway',
    subtitle: 'Six stages from Foundations to FTA',
    icon: 'Route',
    order: 2,
    lessons: [
      {
        id: 'pathway-1',
        title: 'Pathway Overview',
        content: [
          'The Tier 1 development pathway has six stages: Foundations, Prep, JASA, HS, ASA, and FTA. Each stage has a clear purpose, specific priorities, non-negotiables, and advancement criteria. Players move through the pathway based on demonstrated readiness — not age, not time enrolled, not parent request.',
          'Foundations covers Red Ball and Orange Ball. Prep covers Green Ball. JASA is early Yellow Ball competitive. HS serves the high school pathway. ASA is the After School Academy for serious competitive players. FTA is the Full Time Academy — the highest commitment level.',
          'Each stage has an advancement owner. Foundations advancement is owned by Max. Prep and JASA advancement is owned by Rebeka. ASA and higher academy movement is overseen by Jon and Filipp. Coaches should never promise or imply advancement without consulting the appropriate owner.'
        ],
        keyTakeaways: [
          'Six stages: Foundations → Prep → JASA → HS → ASA → FTA',
          'Advancement is based on readiness, not age or tenure',
          'Each stage has a designated advancement owner',
          'Never promise advancement without consulting the owner'
        ]
      },
      {
        id: 'pathway-2',
        title: 'Foundations & Prep',
        content: [
          'Foundations (Red Ball & Orange Ball) builds athletic literacy, balance, coordination, rhythm, listening habits, basic grips, rallying, and early tennis discipline. Sessions should be engaging but structured — not free play. Players learn to move, focus, follow direction, and train with purpose from the beginning. Advancement owner: Max.',
          'Common mistakes at Foundations: making it purely recreational with no standards, skipping athletic literacy for stroke technique too early, not coaching effort and behavior, and rushing players to Orange Ball before readiness.',
          'Prep (Green Ball) develops stronger spacing, footwork, rally tolerance, topspin, directional control, serve and return structure, point awareness, and early competition habits. This is a critical bridge level — players should NOT be rushed through it. Advancement owner: Rebeka.',
          'Key Prep priorities include grip changes, open stance development, playing on the rise, changing direction, transition patterns, serve placement, doubles basics, and emotional control in competition. Players must develop real footwork, not just hit from a standing position.'
        ],
        keyTakeaways: [
          'Foundations: athletic literacy first, structure always, fun with purpose',
          'Prep: critical bridge level — do NOT rush players through Green Ball',
          'Foundations advancement owner: Max',
          'Prep advancement owner: Rebeka',
          'Topspin must be introduced with proper mechanics at Prep level'
        ]
      },
      {
        id: 'pathway-3',
        title: 'JASA & HS',
        content: [
          'JASA (Junior Academy Student Athlete) is the early Yellow Ball competitive stage. It builds full court skills, depth and direction, tactical awareness, pace tolerance, transition play, serve and return quality, tournament habits, accountability, resilience, and independence. JASA should feel serious and developmental, not casual. Advancement owner: Rebeka.',
          'JASA non-negotiables: sessions must feel serious and developmental, players must be accountable for effort and attitude, tournament participation is expected, and self-analysis and independence are actively coached.',
          'HS (High School) maintains Tier 1 culture and intensity while serving players who want to push toward stronger levels or maximize their high school tennis. HS is NOT a casual track — it still reflects real standards and progression. Players are held to Tier 1 expectations regardless of competitive level.',
          'Common HS mistakes: lowering standards because players are "just doing high school tennis," not providing enough structure, treating HS as a holding group, ignoring doubles development, and failing to connect training to long-term goals.'
        ],
        keyTakeaways: [
          'JASA should feel serious and developmental — never casual',
          'Tournament participation is expected at JASA level',
          'HS maintains full Tier 1 standards — it is NOT a casual track',
          'JASA advancement owner: Rebeka; HS movement to ASA/FTA: Jon & Filipp'
        ]
      },
      {
        id: 'pathway-4',
        title: 'ASA & FTA',
        content: [
          'ASA (After School Academy) trains serious competitive players with strong standards, full commitment, structured fitness expectations through APL, and clear tournament alignment. ASA represents a significant step up in intensity, accountability, and expectation. Players must demonstrate professional conduct at all times.',
          'ASA non-negotiables: full commitment to training schedule, structured fitness through APL integration, tournament participation aligned with development goals, professional conduct, and clear session objectives every day.',
          'FTA (Full Time Academy) is the highest commitment training environment at Tier 1. It combines on-court development, match play, physical development through APL, mental performance training, and long-term college or elite competitive preparation. FTA players set the standard for the entire academy.',
          'FTA represents complete athlete development: on-court, fitness, mental performance, video analysis, nutrition, recovery, and time management. Players at this level are expected to demonstrate the highest level of professionalism and leadership. Both ASA and FTA advancement/movement is overseen by Jon and Filipp.'
        ],
        keyTakeaways: [
          'ASA: serious competitive environment with APL fitness integration',
          'FTA: highest commitment level — complete athlete development',
          'Both ASA and FTA are overseen by Jon and Filipp',
          'FTA players set the standard for the entire academy',
          'Professional conduct is non-negotiable at ASA and FTA'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 3: Session Structure
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'sessions',
    title: 'Session Structure & Blocks',
    subtitle: 'How every practice is built',
    icon: 'LayoutList',
    order: 3,
    lessons: [
      {
        id: 'sessions-1',
        title: 'The 8 Session Blocks',
        content: [
          'Every Tier 1 session follows a structured block format. There are 8 standard session blocks, and every session should use most or all of them in order. The blocks are: Athletic Warm Up, Movement & Footwork, Feeding Drills, Live Ball Rallies, Serve & Return, Point Play, Competitive Finish, and Reflection & Journaling.',
          'Athletic Warm Up (10-15 min): Coordination, rhythm, balance, and athletic preparation. This is not just jogging and stretching — it should be purposeful movement that prepares the body and mind for training.',
          'Movement & Footwork (10-15 min): Split step, recovery, movement patterns, court coverage. This block builds the movement foundation that supports everything else in the session.',
          'Feeding Drills (15-20 min): Spacing, contact point, stroke mechanics, repetition. Coach-fed balls allow players to focus on technique without the variability of live ball.',
          'Live Ball Rallies (15-20 min): Rally skills, decision making, problem solving under pressure. This is where technique meets tactics in a cooperative or semi-competitive environment.'
        ],
        keyTakeaways: [
          '8 blocks: Warm Up → Movement → Feeding → Live Ball → Serve/Return → Points → Comp Finish → Reflection',
          'Every session should use most or all blocks in order',
          'Warm up is purposeful movement, not just jogging',
          'Feeding allows technique focus; Live Ball adds decision making'
        ]
      },
      {
        id: 'sessions-2',
        title: 'Serve, Points, Competition & Reflection',
        content: [
          'Serve & Return (10-15 min): Toss, motion, placement, return positioning and tactics. Serve and return are the most important shots in tennis — they start every point. This block should never be skipped or rushed.',
          'Point Play (15-20 min): Modified scoring, restrictions, pattern application. This is where players apply what they have been working on in a competitive context with specific constraints.',
          'Competitive Finish (5-10 min): Fun competitive games reinforcing skills with energy. This block should end the session on a high note while still reinforcing the session\'s objectives. It is not free play.',
          'Reflection & Journaling (5 min): Takeaways, self-assessment, goal setting. Players should be able to articulate what they worked on, what they learned, and what they want to improve. This builds self-awareness and independence.',
          'Session timing varies by level: Foundations sessions are typically 60 minutes. Prep and JASA sessions range from 90 to 120 minutes. ASA and FTA sessions are 90 to 120 minutes with additional fitness blocks through APL.'
        ],
        keyTakeaways: [
          'Serve & Return should never be skipped — it starts every point',
          'Point Play applies session work in competitive context with constraints',
          'Competitive Finish is structured fun, not free play',
          'Reflection builds self-awareness — players articulate what they learned',
          'Session length: Foundations 60 min, Prep/JASA 90-120 min, ASA/FTA 90-120 min + APL'
        ]
      },
      {
        id: 'sessions-3',
        title: 'Session Planning Principles',
        content: [
          'Every session must have a clear objective before you step on court. "Hit forehands" is not an objective. "Improve crosscourt forehand depth using a two-cross-one-line pattern with emphasis on recovery" is an objective. If you cannot articulate the session objective in one sentence, you are not prepared.',
          'Sessions should build progressively: technique → application → competition. Start with isolated skill work (feeding), progress to applied skill work (live ball), and finish with competitive application (points and competitive finish). Do not jump straight to competition without building the foundation first.',
          'Adapt the session to what you see. If players are struggling with a concept in the feeding block, spend more time there. If they are executing well, move to live ball sooner. The block structure is a framework, not a rigid script. Use your coaching judgment.',
          'Always connect drills to match play relevance. Players should understand WHY they are doing a drill and how it transfers to real match situations. "This pattern helps you build the point so you can attack a short ball" is better than "do this drill."'
        ],
        keyTakeaways: [
          'Every session needs a clear, specific objective — not just "hit forehands"',
          'Build progressively: technique → application → competition',
          'The block structure is a framework — adapt based on what you see',
          'Always explain match play relevance — players need to know WHY'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 4: Drill Library & Methodology
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'drills',
    title: 'Drill Library & Methodology',
    subtitle: 'How drills are structured and delivered',
    icon: 'Target',
    order: 4,
    lessons: [
      {
        id: 'drills-1',
        title: 'Drill Structure & Components',
        content: [
          'Every drill in the Tier 1 library has a consistent structure with specific components: Level, Session Block, Objective, Setup, Coaching Cues, Standards, Common Breakdowns, Progression, Regression, Competitive Variation, and Match Play Relevance.',
          'The Objective tells you what the drill is designed to develop. The Setup tells you how to organize players and equipment. Coaching Cues are the specific verbal cues you should use during the drill. Standards define what "good" looks like — the minimum acceptable quality.',
          'Common Breakdowns are the most frequent mistakes you will see. Knowing these in advance helps you coach proactively instead of reactively. Progression and Regression allow you to adjust difficulty up or down based on player performance.',
          'Competitive Variation adds a scoring or competitive element to the drill. Match Play Relevance explains how the drill transfers to real match situations. You should communicate this to players regularly.'
        ],
        keyTakeaways: [
          'Every drill has: Objective, Setup, Cues, Standards, Breakdowns, Progression, Regression, Competitive Variation, Match Play Relevance',
          'Know common breakdowns in advance — coach proactively',
          'Use progressions and regressions to match player level',
          'Always communicate match play relevance to players'
        ]
      },
      {
        id: 'drills-2',
        title: 'Drill Types & Feeding Styles',
        content: [
          'Drills are categorized by type: Technical (focused on mechanics and repetition), Tactical (focused on decision making and patterns), Competitive (focused on scoring and pressure), and Cooperative (focused on consistency and teamwork).',
          'Feeding styles include: Coach-Fed (coach controls the ball for isolated skill work), Live Ball (players rally with each other), and Both (drill can be run either way depending on the group level).',
          'Skill categories span the full range of tennis development: Baseline, Transition & Net Play, Serve & Return, Movement & Footwork, Doubles, Tactical, Physical & Athletic, Mental & Character, and specialized categories like Serve + 1, Return + 1, Defense, Attacking, Baseline Pattern, Point Play, and Pressure & Match Prep.',
          'When selecting drills for a session, consider: Does this drill serve the session objective? Is it appropriate for the group level? Can I progress or regress it based on what I see? Does it connect to match play? If you cannot answer yes to all four, choose a different drill.'
        ],
        keyTakeaways: [
          'Four drill types: Technical, Tactical, Competitive, Cooperative',
          'Three feeding styles: Coach-Fed, Live Ball, Both',
          'Skill categories cover all aspects of tennis development',
          'Every drill must serve the session objective and be level-appropriate'
        ]
      },
      {
        id: 'drills-3',
        title: 'Coaching Cues & Standards',
        content: [
          'Coaching cues should be short, specific, and actionable. "Good job" is not a coaching cue. "Stay low through the contact" is. "Move your feet" is vague. "Split step when I make contact, then push off to the ball" is specific.',
          'Use positive cues more than corrective cues. Instead of "Don\'t stand up," say "Stay low." Instead of "Stop hitting it into the net," say "Brush up through the ball." Players respond better to what they should do rather than what they should not do.',
          'Standards must be visible and measurable. "Hit it better" is not a standard. "7 out of 10 crosscourt forehands land past the service line" is a standard. When you set a standard, hold it. If a player is not meeting the standard, stop the drill, reset, and try again.',
          'Common breakdowns should be anticipated, not discovered. Before running a drill, review the common breakdowns listed in the drill card. Position yourself where you can see the most common breakdown. Coach it before it becomes a habit.'
        ],
        keyTakeaways: [
          'Cues must be short, specific, and actionable — not "good job"',
          'Use positive cues: say what TO do, not what NOT to do',
          'Standards must be visible and measurable — hold them',
          'Anticipate common breakdowns before running the drill'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 5: Coaching Standards & Expectations
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'standards',
    title: 'Coaching Standards & Expectations',
    subtitle: 'What is expected of every Tier 1 coach',
    icon: 'Award',
    order: 5,
    lessons: [
      {
        id: 'standards-1',
        title: 'Before, During & After Every Session',
        content: [
          'Before every session: Review the session plan. Know your objective. Know which drills you will run and why. Have your equipment ready. Be on court early. Greet players by name as they arrive.',
          'During every session: Deliver with energy and intention. Use specific coaching cues. Hold standards — do not let lazy reps slide. Move around the court to see all players. Adapt if something is not working. Keep the session flowing — minimize standing around time.',
          'After every session: Reflect on what worked and what did not. Note any player observations that should be communicated to the advancement owner or lead coach. Clean up the court. Be available briefly for parent questions if needed, but keep it professional and brief.',
          'Time management is critical. If your session is 90 minutes, you should have a plan that fills 90 minutes with purpose. Running out of drills with 20 minutes left is a preparation failure. Having to rush through the last three blocks because you spent too long on feeding is a pacing failure.'
        ],
        keyTakeaways: [
          'Arrive early, prepared, with equipment ready',
          'Hold standards during the session — no lazy reps',
          'Reflect after every session and note player observations',
          'Time management is a coaching skill — plan to fill the full session'
        ]
      },
      {
        id: 'standards-2',
        title: 'Communication & Professionalism',
        content: [
          'Communicate with players using specific, encouraging, and honest language. Avoid generic praise ("great job!") and prohibited brand words. Be specific: "Your recovery to the center was much faster that time — that\'s what we want."',
          'Parent communication should be professional, brief, and focused on development. Do not discuss other players. Do not make promises about advancement. If a parent asks about advancement, direct them to the appropriate advancement owner.',
          'Dress code: Tier 1 branded apparel or clean, professional athletic wear. No casual clothing, no torn or dirty gear. You represent the brand every time you step on court.',
          'Punctuality is non-negotiable. Being late to a session is disrespectful to the players, the parents, and the program. If an emergency arises, communicate immediately with your lead coach.',
          'Social media: If you post about Tier 1, use the correct brand voice and guidelines. Do not post photos of players without proper consent. When in doubt, check with the marketing lead.'
        ],
        keyTakeaways: [
          'Use specific, encouraging, honest language — avoid generic praise',
          'Direct advancement questions to the appropriate owner',
          'Professional dress code at all times on court',
          'Punctuality is non-negotiable',
          'Follow brand guidelines for any social media posts'
        ]
      },
      {
        id: 'standards-3',
        title: 'Non-Negotiables for All Coaches',
        content: [
          'These are the non-negotiable expectations for every Tier 1 coach, regardless of which level you are coaching:',
          'Preparation: Every session has a written plan with clear objectives. No coach should ever walk on court without knowing exactly what they are going to do and why.',
          'Standards: You hold the standard in every drill. If a player is not meeting the standard, you stop, reset, and coach it. You do not ignore it. You do not lower the bar.',
          'Energy: You bring energy and intention to every session. Players feed off your energy. If you are flat, the session will be flat. This does not mean being loud — it means being present, engaged, and purposeful.',
          'Accountability: You hold players accountable for effort, attitude, and behavior. You also hold yourself accountable for preparation, delivery, and professionalism.',
          'Development: You coach for long-term development, not short-term results. You do not skip fundamentals. You do not rush advancement. You trust the pathway.',
          'Culture: You represent Tier 1 culture in every interaction — on court, off court, with players, with parents, with colleagues. "The Standard Is The Standard" applies to you first.'
        ],
        keyTakeaways: [
          'Written session plan with clear objectives — every time',
          'Hold the standard — stop, reset, and coach when needed',
          'Bring energy and intention — players feed off your presence',
          'Coach for long-term development, not short-term results',
          'You represent Tier 1 culture in every interaction'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MODULE 6: Assessment & Advancement
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'advancement',
    title: 'Assessment & Advancement',
    subtitle: 'How players are evaluated and promoted',
    icon: 'TrendingUp',
    order: 6,
    lessons: [
      {
        id: 'advancement-1',
        title: 'Assessment Philosophy',
        content: [
          'Assessment at Tier 1 is ongoing, not event-based. Coaches should be continuously observing and noting player development across technical, tactical, physical, mental, and competitive dimensions. Formal assessment checkpoints exist, but they confirm what coaches already know from daily observation.',
          'Assessment is holistic. A player who has strong strokes but poor effort habits is not ready for advancement. A player who competes well but has technical gaps that will limit future development needs those gaps addressed before moving up. We assess the whole player.',
          'Assessment should be honest and constructive. Players and parents deserve to know where a player stands, what they need to work on, and what readiness for the next level looks like. Sugarcoating does not serve the player\'s development.'
        ],
        keyTakeaways: [
          'Assessment is ongoing — not just formal checkpoints',
          'Assess the whole player: technical, tactical, physical, mental, competitive',
          'Strong strokes with poor effort habits = not ready for advancement',
          'Be honest and constructive — sugarcoating does not serve development'
        ]
      },
      {
        id: 'advancement-2',
        title: 'Advancement Ownership & Process',
        content: [
          'Advancement decisions are owned by specific people, not made unilaterally by any coach. The ownership structure is: Foundations advancement is owned by Max. Prep and JASA advancement is owned by Rebeka. ASA and higher academy movement is overseen by Jon and Filipp.',
          'If you believe a player is ready for advancement, communicate your observations to the appropriate owner. Provide specific evidence: what competencies the player has demonstrated, what their competitive results show, and how their effort and attitude align with the next level\'s expectations.',
          'Never promise or imply advancement to a player or parent. Do not say "you\'re almost ready for the next level" or "just a few more weeks." Advancement is a decision made by the owner based on comprehensive readiness, not a timeline.',
          'When a player is advanced, ensure the transition is smooth. Brief the receiving coach on the player\'s strengths, areas for development, and any behavioral or competitive context that will help them succeed at the new level.'
        ],
        keyTakeaways: [
          'Foundations: Max | Prep & JASA: Rebeka | ASA & higher: Jon & Filipp',
          'Communicate readiness observations to the advancement owner with specific evidence',
          'NEVER promise or imply advancement to players or parents',
          'Ensure smooth transitions when players advance — brief the receiving coach'
        ]
      },
      {
        id: 'advancement-3',
        title: 'What Readiness Looks Like',
        content: [
          'Readiness for advancement is not about being the best player in the current group. It is about demonstrating the competencies needed to succeed at the next level. A player who dominates their current level but lacks the foundational skills for the next level is not ready.',
          'Foundations to Prep: Consistent effort, basic rally skills, movement readiness, and behavioral maturity to handle Green Ball structure.',
          'Prep to JASA: Grip changes, directional control, serve placement, emotional regulation, and readiness for full court yellow ball play.',
          'JASA to ASA/HS: Full court competence, tactical awareness, competitive maturity, and readiness for higher intensity training environments.',
          'ASA to FTA: Exceptional commitment, competitive results, physical readiness for full-time training, and leadership approval from Jon and Filipp.',
          'At every transition, the question is not "Can this player hit the ball well enough?" The question is "Is this player ready — technically, tactically, physically, mentally, and behaviorally — to thrive at the next level?"'
        ],
        keyTakeaways: [
          'Readiness is about competencies for the next level, not dominance at the current level',
          'Each transition has specific criteria beyond just hitting ability',
          'The question is always: can this player THRIVE at the next level?',
          'Technical, tactical, physical, mental, AND behavioral readiness all matter'
        ]
      }
    ]
  }
];

// ─── Quiz Questions ───────────────────────────────────────────────
// 30 questions across all 6 modules (5 per module)

export const quizQuestions: QuizQuestion[] = [
  // ── Module 1: Culture & Philosophy (5 questions) ──
  {
    id: 'q1',
    moduleId: 'culture',
    question: 'What does "The Standard Is The Standard" mean at Tier 1?',
    options: [
      'It is a marketing slogan for parents',
      'Consistent quality of coaching, preparation, and professionalism at every level, every day',
      'Only FTA players are held to high standards',
      'Standards are flexible depending on the group'
    ],
    correctIndex: 1,
    explanation: '"The Standard Is The Standard" is a daily operating principle meaning consistent quality at every level, not just a slogan.'
  },
  {
    id: 'q2',
    moduleId: 'culture',
    question: 'Which of the following is NOT one of Tier 1\'s six core cultural pillars?',
    options: [
      'Player First',
      'Winning At All Costs',
      'Accountability',
      'Every Rep Matters'
    ],
    correctIndex: 1,
    explanation: 'The six pillars are: Player First, Long-Term Development, Accountability, Professionalism, Intensity With Purpose, and Every Rep Matters. "Winning At All Costs" contradicts the Player First and Long-Term Development principles.'
  },
  {
    id: 'q3',
    moduleId: 'culture',
    question: 'What is the relationship between Tier 1 Performance and Woodinville Sports Club (WSC)?',
    options: [
      'They are the same brand used interchangeably',
      'Tier 1 is the performance brand for academy programming; WSC is the facility brand — they should never be mixed',
      'WSC handles coaching; Tier 1 handles facilities',
      'Tier 1 is a sub-brand of WSC used only for marketing'
    ],
    correctIndex: 1,
    explanation: 'Tier 1 is the performance brand handling all academy programming. WSC is the facility and platform brand. They are never mixed in design, voice, or content.'
  },
  {
    id: 'q4',
    moduleId: 'culture',
    question: 'Which word should NEVER be used in Tier 1 context?',
    options: [
      'Development',
      'Competitive',
      'Recreational',
      'Performance'
    ],
    correctIndex: 2,
    explanation: '"Recreational" is a prohibited word in Tier 1 context. Tier 1 is a performance academy, and using "recreational" dilutes the brand and misrepresents the culture.'
  },
  {
    id: 'q5',
    moduleId: 'culture',
    question: '"Intensity With Purpose" means:',
    options: [
      'Every session should be as physically demanding as possible',
      'Coaches should yell to create intensity',
      'Every drill has a reason, every rep has a target — energy is high but directed',
      'Only competitive drills matter'
    ],
    correctIndex: 2,
    explanation: 'Intensity With Purpose means every drill has a reason, every rep has a target. Energy should be high but directed toward the session objective — not just loud or physically exhausting.'
  },

  // ── Module 2: Development Pathway (5 questions) ──
  {
    id: 'q6',
    moduleId: 'pathway',
    question: 'What is the correct order of the Tier 1 development pathway?',
    options: [
      'Foundations → JASA → Prep → HS → ASA → FTA',
      'Foundations → Prep → JASA → HS → ASA → FTA',
      'Prep → Foundations → JASA → ASA → HS → FTA',
      'Foundations → Prep → ASA → JASA → HS → FTA'
    ],
    correctIndex: 1,
    explanation: 'The correct pathway order is: Foundations → Prep → JASA → HS → ASA → FTA.'
  },
  {
    id: 'q7',
    moduleId: 'pathway',
    question: 'Who owns advancement decisions for Prep and JASA?',
    options: [
      'Jon and Filipp',
      'Any coach can decide',
      'Rebeka',
      'Max'
    ],
    correctIndex: 2,
    explanation: 'Prep and JASA advancement is owned by Rebeka. Foundations is owned by Max. ASA and higher is overseen by Jon and Filipp.'
  },
  {
    id: 'q8',
    moduleId: 'pathway',
    question: 'What ball color does the Prep stage use?',
    options: [
      'Red Ball',
      'Orange Ball',
      'Green Ball',
      'Yellow Ball'
    ],
    correctIndex: 2,
    explanation: 'Prep uses Green Ball. Foundations covers Red Ball and Orange Ball. JASA and above use Yellow Ball.'
  },
  {
    id: 'q9',
    moduleId: 'pathway',
    question: 'What is the primary purpose of the Foundations stage?',
    options: [
      'Develop advanced tactical patterns',
      'Build athletic literacy, balance, coordination, rhythm, and early tennis discipline',
      'Prepare players for tournaments',
      'Focus exclusively on stroke technique'
    ],
    correctIndex: 1,
    explanation: 'Foundations builds athletic literacy, balance, coordination, rhythm, listening habits, basic grips, rallying, and early tennis discipline. Stroke technique comes later — athletic literacy comes first.'
  },
  {
    id: 'q10',
    moduleId: 'pathway',
    question: 'What is a common mistake at the JASA level?',
    options: [
      'Making sessions too intense',
      'Treating JASA as casual or recreational',
      'Requiring tournament participation',
      'Coaching self-analysis and independence'
    ],
    correctIndex: 1,
    explanation: 'A common JASA mistake is treating it as casual or recreational. JASA should feel serious and developmental. Tournament participation and self-analysis are expected, not mistakes.'
  },

  // ── Module 3: Session Structure (5 questions) ──
  {
    id: 'q11',
    moduleId: 'sessions',
    question: 'How many standard session blocks are there in a Tier 1 session?',
    options: [
      '4',
      '6',
      '8',
      '10'
    ],
    correctIndex: 2,
    explanation: 'There are 8 standard session blocks: Athletic Warm Up, Movement & Footwork, Feeding Drills, Live Ball Rallies, Serve & Return, Point Play, Competitive Finish, and Reflection & Journaling.'
  },
  {
    id: 'q12',
    moduleId: 'sessions',
    question: 'What is the correct progressive build of a session?',
    options: [
      'Competition → Application → Technique',
      'Technique → Application → Competition',
      'Application → Competition → Technique',
      'Competition → Technique → Application'
    ],
    correctIndex: 1,
    explanation: 'Sessions build progressively: Technique (feeding) → Application (live ball) → Competition (points and competitive finish). Do not jump straight to competition.'
  },
  {
    id: 'q13',
    moduleId: 'sessions',
    question: 'Which session block should NEVER be skipped or rushed?',
    options: [
      'Athletic Warm Up',
      'Feeding Drills',
      'Serve & Return',
      'Competitive Finish'
    ],
    correctIndex: 2,
    explanation: 'Serve & Return should never be skipped or rushed. Serve and return are the most important shots in tennis — they start every point.'
  },
  {
    id: 'q14',
    moduleId: 'sessions',
    question: 'What is the purpose of the Reflection & Journaling block?',
    options: [
      'To fill remaining time at the end of the session',
      'To let players rest before going home',
      'To build self-awareness — players articulate what they worked on and learned',
      'It is optional and only for advanced players'
    ],
    correctIndex: 2,
    explanation: 'Reflection builds self-awareness and independence. Players should articulate what they worked on, what they learned, and what they want to improve.'
  },
  {
    id: 'q15',
    moduleId: 'sessions',
    question: 'Which of the following is a proper session objective?',
    options: [
      '"Hit forehands"',
      '"Work on stuff"',
      '"Improve crosscourt forehand depth using a two-cross-one-line pattern with emphasis on recovery"',
      '"Have fun and play games"'
    ],
    correctIndex: 2,
    explanation: 'A proper objective is specific and actionable. "Hit forehands" is too vague. "Improve crosscourt forehand depth using a two-cross-one-line pattern with emphasis on recovery" tells you exactly what you are working on and how.'
  },

  // ── Module 4: Drill Library & Methodology (5 questions) ──
  {
    id: 'q16',
    moduleId: 'drills',
    question: 'Which of the following is NOT a standard component of every Tier 1 drill?',
    options: [
      'Objective and Setup',
      'Coaching Cues and Standards',
      'Player Ratings and Rankings',
      'Progression and Regression'
    ],
    correctIndex: 2,
    explanation: 'Every drill has: Objective, Setup, Coaching Cues, Standards, Common Breakdowns, Progression, Regression, Competitive Variation, and Match Play Relevance. Player ratings and rankings are not part of drill structure.'
  },
  {
    id: 'q17',
    moduleId: 'drills',
    question: 'What are the four drill types in the Tier 1 system?',
    options: [
      'Easy, Medium, Hard, Expert',
      'Technical, Tactical, Competitive, Cooperative',
      'Forehand, Backhand, Serve, Volley',
      'Individual, Pairs, Small Group, Full Group'
    ],
    correctIndex: 1,
    explanation: 'The four drill types are: Technical (mechanics and repetition), Tactical (decision making and patterns), Competitive (scoring and pressure), and Cooperative (consistency and teamwork).'
  },
  {
    id: 'q18',
    moduleId: 'drills',
    question: 'Which is an example of a proper coaching cue?',
    options: [
      '"Good job!"',
      '"Hit it better"',
      '"Split step when I make contact, then push off to the ball"',
      '"Move your feet"'
    ],
    correctIndex: 2,
    explanation: 'Coaching cues must be short, specific, and actionable. "Split step when I make contact, then push off to the ball" tells the player exactly what to do and when. "Good job" and "move your feet" are too vague.'
  },
  {
    id: 'q19',
    moduleId: 'drills',
    question: 'When selecting a drill for a session, which question should you NOT need to answer "yes" to?',
    options: [
      'Does this drill serve the session objective?',
      'Is it appropriate for the group level?',
      'Is this the most fun drill available?',
      'Does it connect to match play?'
    ],
    correctIndex: 2,
    explanation: 'The four selection criteria are: serves the session objective, appropriate for group level, can be progressed/regressed, and connects to match play. "Most fun" is not a selection criterion — purpose comes first.'
  },
  {
    id: 'q20',
    moduleId: 'drills',
    question: 'What should you do with common breakdowns listed on a drill card?',
    options: [
      'Ignore them — every group is different',
      'Read them after the drill to see if they happened',
      'Review them before the drill and position yourself to coach them proactively',
      'Only share them with advanced players'
    ],
    correctIndex: 2,
    explanation: 'Common breakdowns should be anticipated, not discovered. Review them before running the drill and position yourself where you can see and coach the most common breakdown proactively.'
  },

  // ── Module 5: Coaching Standards (5 questions) ──
  {
    id: 'q21',
    moduleId: 'standards',
    question: 'What should a coach do BEFORE every session?',
    options: [
      'Just show up and see what the players need',
      'Review the session plan, know the objective, have equipment ready, and be on court early',
      'Ask the players what they want to work on',
      'Check social media for drill ideas'
    ],
    correctIndex: 1,
    explanation: 'Before every session: review the plan, know your objective, know your drills and why, have equipment ready, be on court early, and greet players by name.'
  },
  {
    id: 'q22',
    moduleId: 'standards',
    question: 'If a player is not meeting the effort standard during a drill, what should you do?',
    options: [
      'Ignore it — they will get better over time',
      'Wait until after the session to mention it',
      'Stop the drill, reset the standard, and coach it',
      'Remove the player from the drill'
    ],
    correctIndex: 2,
    explanation: 'If a player is not meeting the standard, stop the drill, reset the standard, and coach it. Do not ignore it or let lazy reps slide. Accountability is a core pillar.'
  },
  {
    id: 'q23',
    moduleId: 'standards',
    question: 'A parent asks you when their child will advance to the next level. What should you do?',
    options: [
      'Give them an estimated timeline based on your observation',
      'Tell them their child is almost ready to make them feel good',
      'Direct them to the appropriate advancement owner',
      'Promise advancement within the next month'
    ],
    correctIndex: 2,
    explanation: 'Never promise or imply advancement. Direct advancement questions to the appropriate owner: Max (Foundations), Rebeka (Prep/JASA), or Jon & Filipp (ASA and higher).'
  },
  {
    id: 'q24',
    moduleId: 'standards',
    question: 'Running out of drills with 20 minutes left in a session is an example of:',
    options: [
      'Good time management — you finished early',
      'A preparation failure',
      'An opportunity for free play',
      'Normal — it happens to everyone'
    ],
    correctIndex: 1,
    explanation: 'Running out of drills is a preparation failure. Time management is a coaching skill. Your session plan should fill the full session with purpose.'
  },
  {
    id: 'q25',
    moduleId: 'standards',
    question: 'Which of the following is a measurable standard?',
    options: [
      '"Hit it better"',
      '"Try harder"',
      '"7 out of 10 crosscourt forehands land past the service line"',
      '"Be more consistent"'
    ],
    correctIndex: 2,
    explanation: 'Standards must be visible and measurable. "7 out of 10 crosscourt forehands land past the service line" is specific and measurable. The other options are vague and unmeasurable.'
  },

  // ── Module 6: Assessment & Advancement (5 questions) ──
  {
    id: 'q26',
    moduleId: 'advancement',
    question: 'Assessment at Tier 1 is:',
    options: [
      'A one-time event at the end of each quarter',
      'Ongoing and continuous, with formal checkpoints that confirm daily observations',
      'Only done when a parent requests it',
      'Based solely on tournament results'
    ],
    correctIndex: 1,
    explanation: 'Assessment is ongoing and continuous. Formal checkpoints exist but they confirm what coaches already know from daily observation. It is not event-based or triggered by parent requests.'
  },
  {
    id: 'q27',
    moduleId: 'advancement',
    question: 'A player has strong strokes but consistently poor effort habits. Are they ready for advancement?',
    options: [
      'Yes — their strokes are good enough',
      'Yes — effort will improve at the next level',
      'No — assessment is holistic and effort habits matter',
      'It depends on how long they have been in the program'
    ],
    correctIndex: 2,
    explanation: 'Assessment is holistic. Strong strokes with poor effort habits means the player is NOT ready. We assess the whole player: technical, tactical, physical, mental, and behavioral.'
  },
  {
    id: 'q28',
    moduleId: 'advancement',
    question: 'Who oversees ASA and higher academy movement?',
    options: [
      'Max',
      'Rebeka',
      'Any senior coach',
      'Jon and Filipp'
    ],
    correctIndex: 3,
    explanation: 'ASA and higher academy movement is overseen by Jon and Filipp. Foundations is Max. Prep and JASA is Rebeka.'
  },
  {
    id: 'q29',
    moduleId: 'advancement',
    question: 'The key question for advancement readiness is:',
    options: [
      '"Can this player beat everyone in their current group?"',
      '"Has this player been here long enough?"',
      '"Is this player ready — technically, tactically, physically, mentally, and behaviorally — to thrive at the next level?"',
      '"Do the parents want their child to move up?"'
    ],
    correctIndex: 2,
    explanation: 'The question is always: "Is this player ready to THRIVE at the next level?" across all dimensions. Dominance at the current level, time enrolled, or parent wishes are not the criteria.'
  },
  {
    id: 'q30',
    moduleId: 'advancement',
    question: 'When a player advances to the next level, what should the current coach do?',
    options: [
      'Nothing — the new coach will figure it out',
      'Brief the receiving coach on strengths, development areas, and relevant context',
      'Tell the player to work harder at the new level',
      'Post about it on social media'
    ],
    correctIndex: 1,
    explanation: 'Ensure smooth transitions by briefing the receiving coach on the player\'s strengths, areas for development, and any behavioral or competitive context that will help them succeed.'
  }
];
