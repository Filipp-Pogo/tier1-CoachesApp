/*
  TIER 1 ACADEMY — Data Model
  All pathway stages, drills, assessments, session blocks, and standards
  are defined here as the single source of truth.
*/

// ─── Pathway Stages ────────────────────────────────────────────────

export type PathwayStageId = 'foundations' | 'prep' | 'jasa' | 'hs' | 'asa' | 'fta';

export interface PathwayStage {
  id: PathwayStageId;
  name: string;
  shortName: string;
  subtitle: string;
  ballColor?: string;
  purpose: string;
  priorities: string[];
  nonNegotiables: string[];
  commonMistakes: string[];
  competitionExpectations: string;
  advancementExpectations: string;
  advancementOwner: string;
  contentStatus: 'complete' | 'partial' | 'placeholder';
  order: number;
}

export const pathwayStages: PathwayStage[] = [
  {
    id: 'foundations',
    name: 'Tier 1 Foundations',
    shortName: 'Foundations',
    subtitle: 'Red Ball & Orange Ball',
    ballColor: 'red-orange',
    purpose: 'Build athletic literacy, balance, coordination, rhythm, listening, effort habits, basic grips, rallying, movement habits, and early tennis discipline. This level should still be engaging and fun, but it should have real structure and clear standards. Kids should start learning how to move, focus, follow direction, and train with purpose from the beginning.',
    priorities: [
      'Athletic literacy and movement fundamentals',
      'Balance, coordination, and rhythm',
      'Basic grip introduction',
      'Rallying and ball tracking',
      'Listening and effort habits',
      'Early discipline and focus'
    ],
    nonNegotiables: [
      'Every session has structure — not just free play',
      'Players learn to listen and follow direction',
      'Effort and attitude are coached, not ignored',
      'Basic movement patterns are taught correctly from day one'
    ],
    commonMistakes: [
      'Making it purely recreational with no standards',
      'Skipping athletic literacy for stroke technique too early',
      'Not coaching effort and behavior',
      'Rushing players to Orange Ball before readiness'
    ],
    competitionExpectations: 'Score awareness and basic match play introduction. Red Ball tournaments encouraged for exposure.',
    advancementExpectations: 'Player shows consistent effort, basic rally skills, movement readiness, and behavioral maturity to handle Orange Ball structure.',
    advancementOwner: 'Max',
    contentStatus: 'complete',
    order: 1
  },
  {
    id: 'prep',
    name: 'Tier 1 Prep',
    shortName: 'Prep',
    subtitle: 'Green Ball',
    ballColor: 'green',
    purpose: 'Develop stronger spacing, footwork, rally tolerance, topspin, directional control, serve and return structure, point awareness, decision making, and early competition habits. Players should not be rushed through this level. It is a key bridge between early development and yellow ball training.',
    priorities: [
      'Grip changes and contact point development',
      'Movement in multiple directions',
      'Open stance development',
      'Playing on the rise',
      'Changing direction and exploiting weaknesses',
      'Transition patterns and overhead accuracy',
      'Serve placement and doubles basics',
      'Emotional control in competition'
    ],
    nonNegotiables: [
      'Players must develop real footwork, not just hit from a standing position',
      'Topspin must be introduced with proper mechanics',
      'Competition is part of training, not separate from it',
      'Players should not be rushed to yellow ball'
    ],
    commonMistakes: [
      'Rushing to yellow ball before Green Ball competencies are solid',
      'Ignoring footwork in favor of stroke production',
      'Not enough live ball and point play',
      'Skipping serve and return development'
    ],
    competitionExpectations: 'Regular Green Ball tournament participation. Players should be developing competitive habits and emotional control.',
    advancementExpectations: 'Player demonstrates grip changes, directional control, serve placement, emotional regulation, and readiness for full court yellow ball play.',
    advancementOwner: 'Rebeka',
    contentStatus: 'complete',
    order: 2
  },
  {
    id: 'jasa',
    name: 'Tier 1 JASA',
    shortName: 'JASA',
    subtitle: 'Early Yellow Ball Competitive',
    ballColor: 'yellow',
    purpose: 'Build full court skills, depth and direction, tactical awareness, pace tolerance, transition play, serve and return quality, tournament habits, accountability, resilience, and independence. JASA should feel serious and developmental, not casual.',
    priorities: [
      'Full court pace and depth',
      'Extension through the hitting zone',
      'Wider lower base and deeper movement patterns',
      'Tactical use of the forehand',
      'Transition competence and attacking short balls',
      'Serve targets and compact returns',
      'Open court patterns',
      'Independence, resilience, and self-analysis'
    ],
    nonNegotiables: [
      'Sessions must feel serious and developmental',
      'Players must be accountable for effort and attitude',
      'Tournament participation is expected',
      'Self-analysis and independence are actively coached'
    ],
    commonMistakes: [
      'Treating JASA as casual or recreational',
      'Not pushing players on accountability',
      'Ignoring tactical development in favor of just hitting',
      'Not building tournament readiness into training'
    ],
    competitionExpectations: 'Regular yellow ball tournament play. UTR readiness. Players should be competing with intent and learning from results.',
    advancementExpectations: 'Player shows full court competence, tactical awareness, competitive maturity, and readiness for higher intensity training environments.',
    advancementOwner: 'Rebeka',
    contentStatus: 'partial',
    order: 3
  },
  {
    id: 'hs',
    name: 'Tier 1 HS',
    shortName: 'HS',
    subtitle: 'High School Pathway',
    purpose: 'Maintain Tier 1 culture and intensity while serving players who either want to push toward stronger Tier 1 levels or maximize their high school tennis and long term growth. HS should still reflect real standards and progression, even if it serves a broader range of long term outcomes.',
    priorities: [
      'Maintaining Tier 1 standards and culture in every session',
      'Competitive preparation for high school team play',
      'Continued technical refinement under pressure',
      'Tactical awareness and pattern execution in match play',
      'Physical fitness, endurance, and injury prevention',
      'Leadership development and team dynamics',
      'Doubles strategy and communication',
      'Mental toughness for dual-match pressure situations'
    ],
    nonNegotiables: [
      'Tier 1 culture and intensity are maintained regardless of competitive level',
      'Players are held to real standards — HS is not a casual track',
      'Training is purposeful with clear session objectives every day',
      'Players demonstrate leadership on and off the court'
    ],
    commonMistakes: [
      'Lowering standards because players are "just doing high school tennis"',
      'Not providing enough structure or progression within the HS track',
      'Treating HS as a holding group rather than a development environment',
      'Ignoring doubles development and team play skills',
      'Failing to connect HS training to long-term development goals'
    ],
    competitionExpectations: 'High school team play plus additional tournament participation based on individual goals. Players should be competing with intent in both team and individual settings.',
    advancementExpectations: 'Movement to ASA or FTA requires demonstrated commitment, competitive results, leadership qualities, and approval from Jon and Filipp.',
    advancementOwner: 'Jon & Filipp',
    contentStatus: 'partial',
    order: 4
  },
  {
    id: 'asa',
    name: 'Tier 1 ASA',
    shortName: 'ASA',
    subtitle: 'After School Academy',
    purpose: 'Train serious competitive players with strong standards, full commitment, structured fitness expectations, and clear tournament alignment. Players in this environment should be highly invested in development and pursuing strong competitive outcomes. ASA represents a significant step up in intensity, accountability, and expectation.',
    priorities: [
      'High-level competitive preparation and match-play integration',
      'Structured fitness and physical development through APL',
      'Advanced tactical training — pattern execution under pressure',
      'Tournament alignment, scheduling, and goal setting',
      'Mental toughness, competitive resilience, and composure',
      'Full commitment to the development process and training schedule',
      'Weapon development — building a signature game style',
      'Advanced serve and return as primary weapons'
    ],
    nonNegotiables: [
      'Full commitment to training schedule — attendance matters',
      'Structured fitness expectations are met through APL integration',
      'Tournament participation is aligned with development goals',
      'Players demonstrate professional conduct at all times',
      'Every session has clear tactical and technical objectives'
    ],
    commonMistakes: [
      'Allowing players to coast without accountability',
      'Not integrating fitness into the training plan',
      'Lack of tournament planning and alignment with development goals',
      'Treating ASA like an advanced clinic instead of a competitive training environment',
      'Not demanding enough from players who have earned this level'
    ],
    competitionExpectations: 'Strong tournament schedule with clear goals. Players should be pursuing meaningful competitive outcomes and tracking UTR progression.',
    advancementExpectations: 'Movement to FTA requires exceptional commitment, competitive results, physical readiness for full-time training, and leadership approval from Jon and Filipp.',
    advancementOwner: 'Jon & Filipp',
    contentStatus: 'partial',
    order: 5
  },
  {
    id: 'fta',
    name: 'Tier 1 FTA',
    shortName: 'FTA',
    subtitle: 'Full Time Academy',
    purpose: 'This is the highest commitment training environment at Tier 1. It combines on-court development, match play, structure, physical development through APL, mental performance training, and long-term college or elite competitive preparation. FTA represents the most complete and demanding development environment in the system.',
    priorities: [
      'Elite on-court development with individualized programming',
      'Comprehensive physical training through APL — strength, speed, endurance',
      'Match play integration — training must transfer to competition',
      'College recruitment preparation or elite competitive pathway',
      'Mental performance, visualization, and pressure management',
      'Complete athlete development — on and off the court',
      'Video analysis and tactical planning for upcoming opponents',
      'Professional habits — nutrition, recovery, time management'
    ],
    nonNegotiables: [
      'Highest level of commitment and professionalism expected',
      'Complete integration of on-court, fitness, and mental training',
      'Clear competitive pathway and measurable goals',
      'Exemplary conduct and leadership — FTA players set the standard',
      'Full accountability for training, competition, and personal development'
    ],
    commonMistakes: [
      'Not demanding enough from players at this level',
      'Lack of integrated training approach — on-court isolated from fitness',
      'Not maintaining the highest professional standards in every interaction',
      'Failing to individualize programming for each player\'s competitive goals',
      'Not connecting daily training to long-term recruitment or competitive outcomes'
    ],
    competitionExpectations: 'Full competitive schedule aligned with college recruitment or elite competitive goals. Players should be competing nationally and tracking measurable outcomes.',
    advancementExpectations: 'FTA is the highest level in the Tier 1 pathway. Development continues within this environment toward individual competitive goals — college placement, professional development, or elite amateur competition.',
    advancementOwner: 'Jon & Filipp',
    contentStatus: 'partial',
    order: 6
  }
];

// ─── Session Blocks ────────────────────────────────────────────────

export type SessionBlockId = 'warmup' | 'movement' | 'feeding' | 'liveball' | 'serve-return' | 'points' | 'competitive-finish' | 'reflection';

export interface SessionBlock {
  id: SessionBlockId;
  name: string;
  shortName: string;
  description: string;
  typicalDuration: string;
  order: number;
}

export const sessionBlocks: SessionBlock[] = [
  { id: 'warmup', name: 'Athletic Warm Up', shortName: 'Warm Up', description: 'Coordination, rhythm, balance, and athletic preparation', typicalDuration: '10-15 min', order: 1 },
  { id: 'movement', name: 'Movement & Footwork', shortName: 'Movement', description: 'Split step, recovery, movement patterns, court coverage', typicalDuration: '10-15 min', order: 2 },
  { id: 'feeding', name: 'Feeding Drills', shortName: 'Feeding', description: 'Spacing, contact point, stroke mechanics, repetition', typicalDuration: '15-20 min', order: 3 },
  { id: 'liveball', name: 'Live Ball Rallies', shortName: 'Live Ball', description: 'Rally skills, decision making, problem solving under pressure', typicalDuration: '15-20 min', order: 4 },
  { id: 'serve-return', name: 'Serve & Return', shortName: 'Serve/Return', description: 'Toss, motion, placement, return positioning and tactics', typicalDuration: '10-15 min', order: 5 },
  { id: 'points', name: 'Point Play', shortName: 'Points', description: 'Modified scoring, restrictions, pattern application', typicalDuration: '15-20 min', order: 6 },
  { id: 'competitive-finish', name: 'Competitive Finish', shortName: 'Comp Finish', description: 'Fun competitive games reinforcing skills with energy', typicalDuration: '5-10 min', order: 7 },
  { id: 'reflection', name: 'Reflection & Journaling', shortName: 'Reflection', description: 'Takeaways, self-assessment, goal setting', typicalDuration: '5 min', order: 8 }
];

// ─── Skill Categories ──────────────────────────────────────────────

export type SkillCategory = 'baseline' | 'transition' | 'serve-return' | 'movement' | 'doubles' | 'tactical' | 'physical' | 'mental';

export const skillCategories: { id: SkillCategory; name: string }[] = [
  { id: 'baseline', name: 'Baseline' },
  { id: 'transition', name: 'Transition & Net Play' },
  { id: 'serve-return', name: 'Serve & Return' },
  { id: 'movement', name: 'Movement & Footwork' },
  { id: 'doubles', name: 'Doubles' },
  { id: 'tactical', name: 'Tactical' },
  { id: 'physical', name: 'Physical & Athletic' },
  { id: 'mental', name: 'Mental & Character' }
];

// ─── Drill Library ─────────────────────────────────────────────────

export interface Drill {
  id: string;
  name: string;
  level: PathwayStageId[];
  sessionBlock: SessionBlockId;
  skillCategory: SkillCategory;
  feedingStyle: 'feeding' | 'live-ball' | 'both';
  type: 'technical' | 'tactical' | 'competitive' | 'cooperative';
  objective: string;
  setup: string;
  recommendedTime: string;
  coachingCues: string[];
  standards: string[];
  commonBreakdowns: string[];
  progression: string;
  regression: string;
  competitiveVariation: string;
  matchPlayRelevance: string;
}

export const drills: Drill[] = [
  // ═══════════════════════════════════════════════════════════════════
  // FOUNDATIONS (Red/Orange Ball)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'f-warmup-1',
    name: 'Animal Movement Relay',
    level: ['foundations'],
    sessionBlock: 'warmup',
    skillCategory: 'physical',
    feedingStyle: 'both',
    type: 'cooperative',
    objective: 'Build athletic literacy through movement patterns — bear crawls, crab walks, frog jumps, and lateral shuffles.',
    setup: 'Set up 4 cones in a line, 3 meters apart. Players line up at the start. Each cone marks a different animal movement.',
    recommendedTime: '8-10 min',
    coachingCues: ['Stay low through the bear crawl', 'Push off both feet on frog jumps', 'Eyes up, not on the ground', 'Move with purpose, not just speed'],
    standards: ['Players complete each movement with correct form', 'Players maintain effort throughout'],
    commonBreakdowns: ['Rushing through movements without proper form', 'Standing up too tall during crawls', 'Losing focus between stations'],
    progression: 'Add a tennis ball carry — players must balance a ball on the racket while completing movements.',
    regression: 'Reduce to 2 movements and shorter distances.',
    competitiveVariation: 'Relay race format — two teams, first team to complete all movements wins.',
    matchPlayRelevance: 'Athletic literacy is the foundation of all court movement. Players who move well athletically will move well on court.'
  },
  {
    id: 'f-warmup-2',
    name: 'Catch & Throw Circuit',
    level: ['foundations'],
    sessionBlock: 'warmup',
    skillCategory: 'physical',
    feedingStyle: 'both',
    type: 'cooperative',
    objective: 'Develop hand-eye coordination, throwing mechanics, and catching skills that transfer to racket skills.',
    setup: 'Partners face each other 3-4 meters apart. Use foam balls or tennis balls. Cycle through underhand throw, overhand throw, and bounce catch.',
    recommendedTime: '8 min',
    coachingCues: ['Step toward your target when throwing', 'Soft hands when catching', 'Track the ball with your eyes all the way in', 'Use your whole body, not just your arm'],
    standards: ['Players can catch 7 out of 10 throws consistently', 'Throwing motion uses proper weight transfer'],
    commonBreakdowns: ['Catching with stiff arms', 'Not stepping into throws', 'Losing focus between catches'],
    progression: 'Increase distance. Add movement — catch while shuffling sideways.',
    regression: 'Use larger foam balls. Decrease distance to 2 meters.',
    competitiveVariation: 'Count consecutive catches — which pair can get the longest streak?',
    matchPlayRelevance: 'Throwing mechanics mirror the serve motion. Catching develops the tracking and soft hands needed for volleys.'
  },
  {
    id: 'f-warmup-3',
    name: 'Rhythm Skipping & Cone Agility',
    level: ['foundations'],
    sessionBlock: 'warmup',
    skillCategory: 'physical',
    feedingStyle: 'both',
    type: 'cooperative',
    objective: 'Develop rhythm, coordination, and agility through structured movement patterns with cones.',
    setup: 'Set up a zigzag cone pattern. Players skip through the cones, then shuffle laterally, then backpedal to start. Repeat 3-4 rounds.',
    recommendedTime: '6-8 min',
    coachingCues: ['Stay on the balls of your feet', 'Pump your arms — they help you move', 'Quick feet through the cones, not big steps', 'Keep your head up and eyes forward'],
    standards: ['Players maintain rhythm through the full pattern', 'Feet stay light and quick through cone changes'],
    commonBreakdowns: ['Heavy, flat-footed movement', 'Losing the rhythm pattern', 'Cutting corners instead of moving through each cone'],
    progression: 'Add a racket — players carry the racket while completing the agility course.',
    regression: 'Slow the tempo. Walk through the pattern first before adding speed.',
    competitiveVariation: 'Time trial — each player tries to beat their previous best time.',
    matchPlayRelevance: 'Rhythm and agility are the building blocks of on-court movement. Players who can change direction quickly recover better between shots.'
  },
  {
    id: 'f-movement-1',
    name: 'Split Step Reaction Game',
    level: ['foundations'],
    sessionBlock: 'movement',
    skillCategory: 'movement',
    feedingStyle: 'both',
    type: 'cooperative',
    objective: 'Teach the split step as a fundamental movement habit. Players learn to time their split with the coach\'s contact.',
    setup: 'Players stand at the baseline in ready position. Coach stands at the net with a ball. Coach tosses or hits — players split step and move to the ball.',
    recommendedTime: '10 min',
    coachingCues: ['Land on the balls of your feet', 'Split when I make contact, not after', 'Stay low and balanced', 'First step should be explosive'],
    standards: ['Players consistently split step before moving', 'Landing is balanced with knees bent'],
    commonBreakdowns: ['Flat-footed landing', 'Splitting too late', 'Standing up tall after the split instead of staying low'],
    progression: 'Add directional cues — coach points left or right after the split.',
    regression: 'Use verbal cues ("split!") before visual cues.',
    competitiveVariation: 'Simon Says format — coach mixes real feeds with fake cues.',
    matchPlayRelevance: 'The split step is the single most important movement habit in tennis. It must become automatic.'
  },
  {
    id: 'f-movement-2',
    name: 'Shadow Swing Rally',
    level: ['foundations'],
    sessionBlock: 'movement',
    skillCategory: 'movement',
    feedingStyle: 'both',
    type: 'cooperative',
    objective: 'Build movement patterns and swing preparation without the pressure of hitting a ball. Players shadow their strokes while moving.',
    setup: 'Players line up on the baseline. Coach calls out "forehand" or "backhand" and a direction. Players shuffle, set up, and shadow swing, then recover to center.',
    recommendedTime: '8 min',
    coachingCues: ['Turn your shoulders first, then move your feet', 'Recover to the center after every shadow swing', 'Make the shadow swing look like a real swing — full follow through', 'Stay low and balanced throughout'],
    standards: ['Players demonstrate proper unit turn on every shadow swing', 'Recovery to center is consistent'],
    commonBreakdowns: ['No shoulder turn — just moving the arm', 'Not recovering to center between swings', 'Rushing through without proper form'],
    progression: 'Add a ball — coach feeds after the shadow swing setup.',
    regression: 'Coach demonstrates each movement before players attempt it.',
    competitiveVariation: 'Mirror drill — one player leads, the other mirrors the movement and swing.',
    matchPlayRelevance: 'Shadow swings build muscle memory for preparation and recovery. Players who prepare well hit better shots.'
  },
  {
    id: 'f-feeding-1',
    name: 'Target Rallying to Center',
    level: ['foundations'],
    sessionBlock: 'feeding',
    skillCategory: 'baseline',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Develop consistent contact and rally direction by hitting to a center target zone.',
    setup: 'Place a target zone (cones or lines) in the center of the opposite court. Coach feeds from the net. Player hits forehands and backhands aiming for the target.',
    recommendedTime: '12 min',
    coachingCues: ['Turn your shoulders before you swing', 'Watch the ball onto the racket', 'Follow through toward your target', 'Feet first, then swing'],
    standards: ['Player hits 6 out of 10 balls into the target zone', 'Consistent unit turn before contact'],
    commonBreakdowns: ['No shoulder turn — arm-only swing', 'Watching the target instead of the ball', 'Feet planted — not adjusting to the feed'],
    progression: 'Move the target to crosscourt or down the line. Add movement before the feed.',
    regression: 'Larger target zone. Slower, more predictable feeds.',
    competitiveVariation: 'Points for hitting the target — first to 10 wins.',
    matchPlayRelevance: 'Rallying to the center is the foundation of consistency. Players must be able to sustain a rally before they can direct one.'
  },
  {
    id: 'f-feeding-2',
    name: 'Volley Introduction — Catch and Hit',
    level: ['foundations'],
    sessionBlock: 'feeding',
    skillCategory: 'transition',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Introduce the volley through a catch-then-hit progression. Build soft hands and continental grip awareness.',
    setup: 'Player stands at the service line. Coach feeds gently from across the net. Start with catching the ball, then progress to volleying with the racket.',
    recommendedTime: '10 min',
    coachingCues: ['Catch the ball out in front', 'Firm wrist, no big swing', 'Step forward into the ball', 'Continental grip — like shaking hands with the racket'],
    standards: ['Player can volley 5 out of 10 feeds over the net', 'Continental grip is attempted consistently'],
    commonBreakdowns: ['Swinging at the volley instead of punching', 'Wrist is floppy on contact', 'Standing too far back from the net'],
    progression: 'Alternate forehand and backhand volleys. Add a target.',
    regression: 'Stay with catching only. Use a foam ball.',
    competitiveVariation: 'Volley rally — how many volleys can the pair keep going?',
    matchPlayRelevance: 'Net play is essential at every level. Early volley habits set the foundation for approach and transition play later.'
  },
  {
    id: 'f-feeding-3',
    name: 'Forehand Grip Check — Feed and Freeze',
    level: ['foundations'],
    sessionBlock: 'feeding',
    skillCategory: 'baseline',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Reinforce correct forehand grip by having players freeze at contact point for coach inspection.',
    setup: 'Coach feeds from the net. Player hits a forehand and freezes at the contact point. Coach checks grip, racket face angle, and contact position.',
    recommendedTime: '10 min',
    coachingCues: ['Find your forehand grip before the ball comes', 'Freeze at contact — hold it there', 'Racket face should point toward your target', 'Contact point is in front of your body, not beside it'],
    standards: ['Player demonstrates correct grip on 7 out of 10 feeds', 'Contact point is consistently in front of the body'],
    commonBreakdowns: ['Grip slipping to continental during the swing', 'Contact point too far behind the body', 'Not freezing long enough for the coach to check'],
    progression: 'Add backhand grip check. Alternate forehand and backhand feeds.',
    regression: 'Coach physically places the player\'s hand in the correct grip before each feed.',
    competitiveVariation: 'Grip quiz — coach calls "forehand" or "backhand" and player must show the correct grip within 2 seconds.',
    matchPlayRelevance: 'The grip is the connection between the player and the racket. Correct grip habits must be established early or they become difficult to fix later.'
  },
  // ── Orange Ball Specific ──
  {
    id: 'o-movement-1',
    name: 'Crossover Step Recovery Drill',
    level: ['foundations'],
    sessionBlock: 'movement',
    skillCategory: 'movement',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Develop the crossover step and recovery pattern. Players learn to move wide and recover to center efficiently.',
    setup: 'Player starts at center mark. Coach feeds alternating wide forehands and backhands. Player must use crossover step to reach the ball and recover to center.',
    recommendedTime: '12 min',
    coachingCues: ['Cross the outside foot over first', 'Push off the outside foot to recover', 'Stay low through the recovery', 'Split step before the next ball'],
    standards: ['Consistent crossover step on wide balls', 'Recovery to center between shots'],
    commonBreakdowns: ['Shuffling instead of crossing over', 'Not recovering to center', 'Standing up between shots'],
    progression: 'Increase feed pace and width. Add a third ball.',
    regression: 'Slower feeds. Only one direction at a time.',
    competitiveVariation: 'Count successful recoveries — beat your personal best.',
    matchPlayRelevance: 'The crossover recovery is how players cover the court in real rallies. Without it, players are always late to the next ball.'
  },
  {
    id: 'o-feeding-1',
    name: 'Topspin Introduction — Brush Up',
    level: ['foundations'],
    sessionBlock: 'feeding',
    skillCategory: 'baseline',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Introduce topspin mechanics through a low-to-high swing path. Players learn to brush up on the ball.',
    setup: 'Player at baseline. Coach feeds from the net at moderate pace. Focus on low-to-high racket path. Place a rope or line 3 feet above the net as a visual target.',
    recommendedTime: '15 min',
    coachingCues: ['Start the racket below the ball', 'Brush up the back of the ball', 'Finish high over your shoulder', 'Let the spin do the work — don\'t muscle it'],
    standards: ['Player demonstrates visible topspin on 5 out of 10 balls', 'Low-to-high swing path is consistent'],
    commonBreakdowns: ['Flat swing path — no brush', 'Dropping the racket head too much', 'Trying to hit too hard instead of focusing on spin'],
    progression: 'Add directional targets. Increase feed pace.',
    regression: 'Use a foam ball to exaggerate spin. Hand-feed from close range.',
    competitiveVariation: 'Spin challenge — who can make the ball bounce highest on the other side?',
    matchPlayRelevance: 'Topspin is the primary tool for controlling depth and consistency in rallies. It must be developed early and reinforced constantly.'
  },
  {
    id: 'o-serve-1',
    name: 'Serve Toss & Trophy Position',
    level: ['foundations'],
    sessionBlock: 'serve-return',
    skillCategory: 'serve-return',
    feedingStyle: 'both',
    type: 'technical',
    objective: 'Build a consistent toss and teach the trophy position as the foundation of the serve motion.',
    setup: 'Players stand at the baseline with a basket of balls. Focus on toss placement (slightly in front, at 1 o\'clock) and freezing in the trophy position.',
    recommendedTime: '10 min',
    coachingCues: ['Toss with your fingertips, not your palm', 'Release the ball at eye level', 'Trophy position — racket behind your head, elbow high', 'Hold the trophy position for 2 seconds before swinging'],
    standards: ['Toss lands within a racket length in front consistently', 'Trophy position shows proper arm and racket alignment'],
    commonBreakdowns: ['Toss going behind the head', 'Dropping the elbow in trophy position', 'Rushing through the motion without pausing'],
    progression: 'Connect the trophy position to a full serve motion. Add a target in the service box.',
    regression: 'Practice toss only — 20 tosses aiming for a target on the ground.',
    competitiveVariation: 'Toss accuracy challenge — place a hoop on the ground and see who can land the most tosses inside it.',
    matchPlayRelevance: 'The toss controls the entire serve. A consistent toss leads to a consistent serve. The trophy position is the power position for all serve types.'
  },
  {
    id: 'o-points-1',
    name: 'Mini Court Points — Service Box Only',
    level: ['foundations'],
    sessionBlock: 'points',
    skillCategory: 'tactical',
    feedingStyle: 'live-ball',
    type: 'competitive',
    objective: 'Introduce point play in a small court setting. Develop touch, placement, and competitive habits.',
    setup: 'Two players play points using only the service boxes. Underhand serve to start. First to 5 points.',
    recommendedTime: '10 min',
    coachingCues: ['Use soft hands — this is about placement, not power', 'Move your opponent around the box', 'Recover to the middle after every shot', 'Compete on every point — no free points'],
    standards: ['Players sustain rallies of 4+ shots', 'Players show tactical intent in shot placement'],
    commonBreakdowns: ['Hitting too hard for the small court', 'Standing still instead of recovering', 'Not keeping score or competing with intent'],
    progression: 'Expand to half court. Add volleys as an option.',
    regression: 'Cooperative rallying in the service box first — count consecutive balls before adding competition.',
    competitiveVariation: 'King of the Mini Court — winner stays, loser rotates.',
    matchPlayRelevance: 'Mini court points develop touch, feel, and competitive habits in a controlled environment. These skills transfer directly to full court play.'
  },
  {
    id: 'o-comp-1',
    name: 'Around the World Relay',
    level: ['foundations'],
    sessionBlock: 'competitive-finish',
    skillCategory: 'physical',
    feedingStyle: 'both',
    type: 'competitive',
    objective: 'High-energy competitive finish that reinforces movement, hustle, and team spirit.',
    setup: 'Players form two lines behind the baseline. Coach feeds a ball. First player hits and runs around the net post to the other side. Next player goes. Continuous rotation.',
    recommendedTime: '8 min',
    coachingCues: ['Sprint around the post — no walking', 'Hit and move immediately', 'Encourage your teammates', 'Every ball counts — no lazy swings'],
    standards: ['Players maintain full effort throughout', 'Balls are hit with intent, not just tapped over'],
    commonBreakdowns: ['Walking instead of sprinting', 'Not being ready when it is your turn', 'Losing energy as the drill continues'],
    progression: 'Add a rule — if the ball doesn\'t land in the court, the team loses a life.',
    regression: 'Slower rotation. Coach feeds easier balls.',
    competitiveVariation: 'This is already competitive. Add elimination — miss the court and you sit out.',
    matchPlayRelevance: 'Energy, hustle, and competing under fatigue are essential match play qualities. This drill builds all three.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // PREP (Green Ball)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'p-warmup-1',
    name: 'Topspin Short Court Rally',
    level: ['prep'],
    sessionBlock: 'warmup',
    skillCategory: 'baseline',
    feedingStyle: 'live-ball',
    type: 'cooperative',
    objective: 'Warm up with topspin in a controlled short court setting. Reinforce spin, feel, and consistency.',
    setup: 'Two players rally inside the service boxes. Both players must use topspin on every ball. Focus on height over the net and spin rather than pace.',
    recommendedTime: '8 min',
    coachingCues: ['Brush up on every ball — no flat shots', 'Get the ball 3-4 feet over the net with spin', 'Move your feet between shots', 'Control the rally — this is about feel, not power'],
    standards: ['Players sustain 15+ ball rallies with topspin', 'Visible spin on 80% of shots'],
    commonBreakdowns: ['Hitting flat instead of with spin', 'Trying to hit winners in the warm up', 'Standing still between shots'],
    progression: 'Add a slice only round. Alternate topspin and slice.',
    regression: 'Allow any spin. Focus on rally length only.',
    competitiveVariation: 'Longest rally challenge — which pair can sustain the longest topspin rally?',
    matchPlayRelevance: 'Short court topspin rallies develop the feel and spin control needed for consistent baseline play at the Green Ball level.'
  },
  {
    id: 'p-movement-1',
    name: 'Open Stance Footwork Circuit',
    level: ['prep'],
    sessionBlock: 'movement',
    skillCategory: 'movement',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Develop the open stance as a primary hitting position. Build the footwork pattern for loading and rotating.',
    setup: 'Player starts at center. Coach feeds wide forehands. Player must set up in open stance, load on the outside foot, rotate through the shot, and recover.',
    recommendedTime: '12 min',
    coachingCues: ['Load on your outside foot — feel the ground', 'Rotate your hips through the shot', 'Don\'t fall sideways — stay balanced', 'Push off the back foot to recover'],
    standards: ['Player demonstrates proper open stance on 7 out of 10 wide forehands', 'Weight transfer and rotation are visible'],
    commonBreakdowns: ['Stepping across instead of loading open', 'No hip rotation — arm-only swing', 'Falling off balance after the shot'],
    progression: 'Add a second ball — player must recover and hit a second shot after the open stance forehand.',
    regression: 'Coach demonstrates the footwork pattern. Player shadows before hitting.',
    competitiveVariation: 'Count clean open stance forehands in a row — beat your personal best.',
    matchPlayRelevance: 'The open stance is the primary hitting position for wide balls in modern tennis. Players who master it cover the court more efficiently.'
  },
  {
    id: 'p-feeding-1',
    name: 'Directional Rally — Own the Crosscourt',
    level: ['prep'],
    sessionBlock: 'feeding',
    skillCategory: 'baseline',
    feedingStyle: 'live-ball',
    type: 'tactical',
    objective: 'Develop crosscourt rally consistency and the ability to own a direction. Players learn to sustain crosscourt rallies with depth and spin.',
    setup: 'Two players rally crosscourt (forehand or backhand). Cones mark the target zone deep crosscourt. Rally must stay in the crosscourt half.',
    recommendedTime: '15 min',
    coachingCues: ['Aim deep crosscourt — past the service line', 'Use topspin to keep the ball in', 'Move your feet between shots — don\'t be lazy', 'Own this direction — make it your rally'],
    standards: ['Players sustain 8+ ball crosscourt rallies', 'Majority of balls land past the service line'],
    commonBreakdowns: ['Changing direction too early', 'Balls landing short in the service box', 'Not recovering between shots'],
    progression: 'Add a "change direction" rule — after 6 crosscourt balls, player can go down the line.',
    regression: 'Reduce to 4-ball rally targets. Allow full court.',
    competitiveVariation: 'First pair to reach 20 consecutive crosscourt balls wins.',
    matchPlayRelevance: 'The crosscourt rally is the most common pattern in match play. Players who can own the crosscourt control the point.'
  },
  {
    id: 'p-feeding-2',
    name: 'Approach Shot — Short Ball Attack',
    level: ['prep'],
    sessionBlock: 'feeding',
    skillCategory: 'transition',
    feedingStyle: 'feeding',
    type: 'tactical',
    objective: 'Teach players to recognize and attack short balls with an approach shot, then close to the net.',
    setup: 'Coach feeds a deep ball then a short ball. Player hits the deep ball, recognizes the short ball, approaches, and finishes at the net with a volley.',
    recommendedTime: '15 min',
    coachingCues: ['Read the short ball early', 'Move through the ball — don\'t stop and hit', 'Approach deep to the open court', 'Close to the net after the approach — don\'t hang back'],
    standards: ['Player recognizes short ball within 1 second', 'Approach shot lands deep', 'Player closes to net position'],
    commonBreakdowns: ['Hitting the approach and staying at the baseline', 'Approaching to the middle instead of the open court', 'Not splitting at the net before the volley'],
    progression: 'Add a live ball passing shot from the opponent.',
    regression: 'Feed only the short ball — remove the deep ball setup.',
    competitiveVariation: 'Play points starting with a short ball — approach and finish.',
    matchPlayRelevance: 'Attacking short balls is how players transition from defense to offense. This pattern wins points at every level.'
  },
  {
    id: 'p-feeding-3',
    name: 'Backhand Slice — Shape and Control',
    level: ['prep'],
    sessionBlock: 'feeding',
    skillCategory: 'baseline',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Develop the backhand slice as a tactical tool. Build proper technique with continental grip and high-to-low swing path.',
    setup: 'Coach feeds to the backhand side. Player hits slice backhands aiming deep crosscourt. Focus on continental grip, open racket face, and follow through.',
    recommendedTime: '12 min',
    coachingCues: ['Continental grip — same as your volley grip', 'High to low swing path — cut under the ball', 'Keep the ball low over the net', 'Follow through toward your target, not down into the ground'],
    standards: ['Player demonstrates proper slice technique on 6 out of 10 balls', 'Ball stays low after the bounce'],
    commonBreakdowns: ['Using an eastern grip instead of continental', 'Chopping down instead of slicing through', 'Ball floating high with no bite'],
    progression: 'Add a target deep in the court. Mix slice and topspin backhands.',
    regression: 'Hand-feed from close range. Focus on the grip and swing path only.',
    competitiveVariation: 'Slice rally — two players rally using only slice. Longest rally wins.',
    matchPlayRelevance: 'The slice is a defensive and transitional weapon. It changes the pace, stays low, and sets up approach shots.'
  },
  {
    id: 'p-serve-1',
    name: 'Serve Placement — Targets',
    level: ['prep'],
    sessionBlock: 'serve-return',
    skillCategory: 'serve-return',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Develop serve placement by aiming at specific targets in the service box. Build the habit of serving with intent.',
    setup: 'Place targets (cones or towels) in the corners of the service box — wide, body, and T. Player serves sets of 5 to each target.',
    recommendedTime: '12 min',
    coachingCues: ['Toss in front and slightly to the right (for righties)', 'Use your legs — push up into the serve', 'Aim for a target every time — no aimless serves', 'Smooth motion — don\'t rush'],
    standards: ['Player hits 3 out of 5 serves into the correct service box', 'At least 1 out of 5 hits the intended target zone'],
    commonBreakdowns: ['Inconsistent toss', 'No leg drive', 'Aiming without adjusting the toss location'],
    progression: 'Add a returner. Serve and play the point.',
    regression: 'Move closer to the net. Focus on toss and motion only.',
    competitiveVariation: 'Target challenge — points for hitting each zone. First to 10 wins.',
    matchPlayRelevance: 'The serve is the only shot you control completely. Placement turns the serve from a start to a weapon.'
  },
  {
    id: 'p-liveball-1',
    name: 'Rally to Pattern — Crosscourt to Down the Line',
    level: ['prep'],
    sessionBlock: 'liveball',
    skillCategory: 'tactical',
    feedingStyle: 'live-ball',
    type: 'tactical',
    objective: 'Develop the fundamental rally pattern: build crosscourt, then change direction down the line when the opportunity appears.',
    setup: 'Two players rally crosscourt. After 4+ crosscourt balls, one player changes direction down the line. Point is played out from there.',
    recommendedTime: '15 min',
    coachingCues: ['Build the point crosscourt first — be patient', 'Change direction when you get a short ball or a ball in your strike zone', 'Commit to the direction change — don\'t go tentative', 'After the direction change, close the court'],
    standards: ['Players sustain 4+ crosscourt balls before changing direction', 'Direction change is intentional and aggressive'],
    commonBreakdowns: ['Changing direction too early without building the point', 'Going down the line from a defensive position', 'Not closing the court after the direction change'],
    progression: 'Play full points starting crosscourt. Player must build and change direction.',
    regression: 'Coach feeds crosscourt. Player practices the direction change only.',
    competitiveVariation: 'Bonus point for a clean direction change winner.',
    matchPlayRelevance: 'The crosscourt-to-down-the-line pattern is the most fundamental tactical sequence in tennis. It is how points are constructed.'
  },
  {
    id: 'p-points-1',
    name: 'King of the Court — Green Ball',
    level: ['prep'],
    sessionBlock: 'points',
    skillCategory: 'tactical',
    feedingStyle: 'live-ball',
    type: 'competitive',
    objective: 'Competitive point play with rotation. Players learn to compete under pressure and apply patterns.',
    setup: 'One player on the "King" side, challengers line up on the other side. Coach feeds to start the point. Winner stays, loser rotates.',
    recommendedTime: '15 min',
    coachingCues: ['Play with intent — have a plan for each point', 'Use your patterns — crosscourt to set up, down the line to finish', 'Compete on every point, not just the easy ones', 'Reset mentally between points'],
    standards: ['Players compete with visible intent and effort', 'Patterns from training appear in point play'],
    commonBreakdowns: ['Passive play — just pushing the ball back', 'No plan on the point', 'Getting emotional after losing a point'],
    progression: 'Add serve and return to start the point.',
    regression: 'Coach feeds easier balls. Allow more time between points.',
    competitiveVariation: 'This is already competitive. Add a "must win 3 in a row to become King" rule.',
    matchPlayRelevance: 'King of the Court teaches players to compete under pressure with consequences — exactly like a real match.'
  },
  {
    id: 'p-doubles-1',
    name: 'Doubles Positioning — I Formation Introduction',
    level: ['prep'],
    sessionBlock: 'points',
    skillCategory: 'doubles',
    feedingStyle: 'live-ball',
    type: 'tactical',
    objective: 'Introduce basic doubles positioning and communication. Build awareness of net player responsibilities.',
    setup: 'Two teams of two. Server and net player set up. Focus on net player positioning, poaching signals, and communication.',
    recommendedTime: '15 min',
    coachingCues: ['Net player — stay active, not a statue', 'Communicate before every point — who is covering what', 'Server — get your first serve in and follow the plan', 'Close together at the net — don\'t leave gaps'],
    standards: ['Teams communicate before each point', 'Net player attempts at least 2 poaches per game'],
    commonBreakdowns: ['No communication between partners', 'Net player standing still and not engaging', 'Both players on the same side of the court'],
    progression: 'Add I-formation. Net player signals before the serve.',
    regression: 'One-up, one-back formation only. Focus on basic positioning.',
    competitiveVariation: 'Doubles tiebreaker — first team to 7 with serve rotation.',
    matchPlayRelevance: 'Doubles is a critical part of team tennis and tournament play. Communication and positioning are the foundation of doubles success.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // JASA (Early Yellow Ball)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'j-warmup-1',
    name: 'Topspin & Slice Short Court Alternation',
    level: ['jasa'],
    sessionBlock: 'warmup',
    skillCategory: 'baseline',
    feedingStyle: 'live-ball',
    type: 'cooperative',
    objective: 'Warm up with alternating topspin and slice in the service box. Develop feel, touch, and spin variation.',
    setup: 'Two players rally in the service boxes. Alternate: one topspin, one slice. Maintain the pattern throughout the rally.',
    recommendedTime: '8 min',
    coachingCues: ['Feel the difference between topspin and slice in your hand', 'Slice should stay low, topspin should bounce up', 'Smooth transitions between grips', 'Control and consistency — not pace'],
    standards: ['Players sustain 10+ ball rallies with alternating spin', 'Grip changes are smooth and consistent'],
    commonBreakdowns: ['Forgetting the alternation pattern', 'Slice floating too high', 'Not changing grip between shots'],
    progression: 'Add a drop shot option — player can drop shot instead of the next spin.',
    regression: 'Topspin only for one round, slice only for the next.',
    competitiveVariation: 'If you break the pattern, your opponent gets a point.',
    matchPlayRelevance: 'Spin variation is a key tactical tool. Players who can change spin keep opponents off balance and create opportunities.'
  },
  {
    id: 'j-movement-1',
    name: 'Full Court Coverage — 6 Ball Pattern',
    level: ['jasa'],
    sessionBlock: 'movement',
    skillCategory: 'movement',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Build full court movement and recovery through a structured 6-ball feeding pattern that covers all areas of the court.',
    setup: 'Coach feeds 6 balls in sequence: wide forehand, recovery, wide backhand, recovery, short ball approach, volley finish. Player must execute all 6 with proper footwork.',
    recommendedTime: '15 min',
    coachingCues: ['Split step before every ball', 'Crossover step on wide balls', 'Move through the short ball — don\'t stop', 'Close to the net after the approach — finish the pattern'],
    standards: ['Player completes the full 6-ball pattern with proper footwork', 'Recovery between shots is efficient'],
    commonBreakdowns: ['Skipping the split step between balls', 'Not recovering to center after wide balls', 'Stopping at the baseline after the approach shot'],
    progression: 'Increase feed pace. Add a 7th ball — a lob after the volley.',
    regression: 'Reduce to 4 balls. Slower feeds with more recovery time.',
    competitiveVariation: 'Score each ball — 1 point for execution, bonus point for a winner on the volley.',
    matchPlayRelevance: 'Full court coverage is what separates competitive players from recreational ones. This pattern mirrors real point construction.'
  },
  {
    id: 'j-feeding-1',
    name: 'Inside-Out Forehand — Weapon Development',
    level: ['jasa'],
    sessionBlock: 'feeding',
    skillCategory: 'baseline',
    feedingStyle: 'feeding',
    type: 'tactical',
    objective: 'Develop the inside-out forehand as an offensive weapon. Build the footwork and positioning to run around the backhand.',
    setup: 'Coach feeds to the backhand side (slightly middle). Player runs around the backhand and hits an inside-out forehand to the opponent\'s backhand corner.',
    recommendedTime: '15 min',
    coachingCues: ['Move your feet early — get around the ball', 'Set up in open stance on the forehand side', 'Hit with authority — this is your weapon', 'Aim deep to the opponent\'s backhand corner'],
    standards: ['Player runs around 6 out of 10 feeds successfully', 'Inside-out forehand lands deep in the target zone'],
    commonBreakdowns: ['Not moving feet early enough — late setup', 'Hitting inside-in instead of inside-out', 'Losing balance because of rushed footwork'],
    progression: 'Add a second ball — play out the point after the inside-out forehand.',
    regression: 'Coach feeds to the middle. Player practices the footwork pattern without pace pressure.',
    competitiveVariation: 'Inside-out forehand challenge — points for depth and placement.',
    matchPlayRelevance: 'The inside-out forehand is one of the most important offensive weapons in modern tennis. It allows players to dictate with their strongest shot.'
  },
  {
    id: 'j-liveball-1',
    name: 'Full Court Rally — Depth and Direction',
    level: ['jasa'],
    sessionBlock: 'liveball',
    skillCategory: 'baseline',
    feedingStyle: 'live-ball',
    type: 'tactical',
    objective: 'Build full court rally competence with emphasis on depth, direction, and pace tolerance.',
    setup: 'Two players rally full court. Target zone is the last 3 feet of the court (deep zone). Players must sustain rallies while maintaining depth.',
    recommendedTime: '15 min',
    coachingCues: ['Extend through the hitting zone', 'Aim deep — the back fence is your friend', 'Use topspin to control depth at pace', 'Move your opponent — don\'t just rally to the middle'],
    standards: ['Players sustain 10+ ball rallies with depth', '70% of balls land in the deep zone'],
    commonBreakdowns: ['Balls landing in the service box', 'No directional intent — just hitting to the middle', 'Losing depth when pace increases'],
    progression: 'Add a "change direction after 8 balls" constraint.',
    regression: 'Reduce to crosscourt only. Lower pace requirement.',
    competitiveVariation: 'Deep zone rally — any ball that lands short of the service line loses the point.',
    matchPlayRelevance: 'Depth is the most important tactical weapon in baseline tennis. Players who control depth control the rally.'
  },
  {
    id: 'j-liveball-2',
    name: 'Transition Drill — Approach, Volley, Overhead',
    level: ['jasa'],
    sessionBlock: 'liveball',
    skillCategory: 'transition',
    feedingStyle: 'live-ball',
    type: 'tactical',
    objective: 'Build the complete transition sequence: approach shot, split step at net, volley, and overhead finish.',
    setup: 'Two players rally. Coach calls "short" and feeds a short ball. Player approaches, closes to net, and plays out the point. Opponent can pass or lob.',
    recommendedTime: '15 min',
    coachingCues: ['Approach deep and to the open court', 'Split step at the service line before the volley', 'Close the net after the first volley', 'If they lob, turn and track — don\'t back up flat-footed'],
    standards: ['Player executes the full transition sequence 4 out of 10 times', 'Split step at the net is consistent'],
    commonBreakdowns: ['Staying at the baseline after the approach', 'No split step before the volley', 'Backing up on the lob instead of turning and running'],
    progression: 'Play full points with a mandatory approach on any short ball.',
    regression: 'Coach feeds the short ball directly. Remove the rally setup.',
    competitiveVariation: 'Approach points — bonus point for finishing at the net.',
    matchPlayRelevance: 'The transition game separates one-dimensional baseliners from complete players. Approaching the net puts pressure on the opponent and shortens points.'
  },
  {
    id: 'j-serve-1',
    name: 'Serve + 1 Pattern',
    level: ['jasa'],
    sessionBlock: 'serve-return',
    skillCategory: 'serve-return',
    feedingStyle: 'live-ball',
    type: 'tactical',
    objective: 'Develop the serve + 1 pattern — serve with placement, then execute a planned first groundstroke.',
    setup: 'Player serves to a specific target. Partner returns. Server executes a pre-planned first ball (e.g., inside-out forehand, crosscourt backhand).',
    recommendedTime: '15 min',
    coachingCues: ['Serve with a plan — know where you\'re going before you toss', 'First ball after the serve should be aggressive', 'Recover quickly after the serve to set up the first ball', 'Own the pattern — don\'t react, execute'],
    standards: ['Player executes the planned pattern 4 out of 10 times', 'Serve placement sets up the pattern'],
    commonBreakdowns: ['Serving without a plan', 'Not recovering fast enough after the serve', 'Abandoning the pattern after a weak return'],
    progression: 'Play out the full point after the serve + 1.',
    regression: 'Coach returns instead of a partner. Predictable returns.',
    competitiveVariation: 'Serve + 1 points — extra point if the pattern is executed correctly.',
    matchPlayRelevance: 'The serve + 1 is the most important offensive pattern in tennis. It turns the serve into a weapon, not just a start.'
  },
  {
    id: 'j-serve-2',
    name: 'Return of Serve — Block and Redirect',
    level: ['jasa'],
    sessionBlock: 'serve-return',
    skillCategory: 'serve-return',
    feedingStyle: 'live-ball',
    type: 'tactical',
    objective: 'Develop a compact, reliable return of serve. Build the ability to block and redirect with depth.',
    setup: 'One player serves, the other returns. Returner focuses on compact backswing, early preparation, and redirecting the serve deep crosscourt.',
    recommendedTime: '12 min',
    coachingCues: ['Short backswing — use the server\'s pace', 'Split step as the server makes contact', 'Aim deep crosscourt — don\'t try to do too much', 'Get the return in play first, then add direction'],
    standards: ['Player returns 7 out of 10 serves in play', 'Returns land past the service line'],
    commonBreakdowns: ['Big backswing — late on the return', 'No split step — flat-footed', 'Trying to hit a winner off the return'],
    progression: 'Add a return + 1 pattern — return deep, then execute a planned second shot.',
    regression: 'Server uses a slower serve. Returner focuses on getting the ball in play only.',
    competitiveVariation: 'Return games — returner must win 3 out of 5 return points.',
    matchPlayRelevance: 'The return of serve is the second most important shot in tennis. A solid return neutralizes the server\'s advantage and starts the point on your terms.'
  },
  {
    id: 'j-points-1',
    name: 'Pressure Sets — First to 7',
    level: ['jasa'],
    sessionBlock: 'points',
    skillCategory: 'tactical',
    feedingStyle: 'live-ball',
    type: 'competitive',
    objective: 'Simulate match pressure through short, intense sets. Build resilience, accountability, and competitive habits.',
    setup: 'Two players play first to 7 points (win by 1). Coach feeds to start each point. Players track their own score.',
    recommendedTime: '15 min',
    coachingCues: ['Compete on every point — no throwaway points', 'Stay composed when you\'re behind', 'Play your patterns under pressure', 'Own your score — no excuses'],
    standards: ['Players compete with full effort throughout', 'Players demonstrate tactical patterns under pressure', 'Players manage emotions between points'],
    commonBreakdowns: ['Giving up when behind', 'Abandoning patterns under pressure', 'Emotional reactions after errors'],
    progression: 'Play best of 3 sets to 7. Add serve and return.',
    regression: 'First to 5 points. Coach feeds easier balls.',
    competitiveVariation: 'Handicap start — stronger player starts down 0-3.',
    matchPlayRelevance: 'Short sets teach players to compete under scoreboard pressure — the most important skill in tournament tennis.'
  },
  {
    id: 'j-comp-1',
    name: 'Tiebreaker Simulation',
    level: ['jasa'],
    sessionBlock: 'competitive-finish',
    skillCategory: 'tactical',
    feedingStyle: 'live-ball',
    type: 'competitive',
    objective: 'Simulate tiebreaker pressure. Build the mental and tactical habits needed to perform in the most critical moments of a match.',
    setup: 'Two players play a full tiebreaker (first to 7, win by 2) with proper serve rotation and changeovers. Coach observes and provides feedback after.',
    recommendedTime: '10-15 min',
    coachingCues: ['Every point matters — treat it like a real match', 'Stick to your patterns — don\'t panic', 'Use the changeover to reset mentally', 'Serve with purpose — this is not the time for double faults'],
    standards: ['Players compete with match-level intensity', 'Players demonstrate composure during changeovers', 'Serve percentage stays above 60%'],
    commonBreakdowns: ['Rushing between points', 'Double faulting under pressure', 'Abandoning patterns and going for too much'],
    progression: 'Play best of 3 tiebreakers. Add a consequence for the loser (fitness).',
    regression: 'Play a shortened tiebreaker — first to 5.',
    competitiveVariation: 'Super tiebreaker — first to 10, win by 2.',
    matchPlayRelevance: 'Tiebreakers decide matches. Players who practice tiebreaker situations develop the composure and execution needed to win close sets.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // HS (High School Pathway)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hs-warmup-1',
    name: 'Dynamic Rally Warm Up — Full Court',
    level: ['hs'],
    sessionBlock: 'warmup',
    skillCategory: 'baseline',
    feedingStyle: 'live-ball',
    type: 'cooperative',
    objective: 'Full court rally warm up that builds intensity gradually. Develop rhythm and consistency at match pace.',
    setup: 'Two players rally full court. Start at 50% pace, increase to 75% after 3 minutes, then 90% for the final 2 minutes.',
    recommendedTime: '8-10 min',
    coachingCues: ['Build the pace gradually — don\'t start at full power', 'Move your feet between every shot', 'Use this time to find your rhythm and timing', 'Aim deep — warm up with purpose, not just hitting'],
    standards: ['Players sustain rallies at each pace level', 'Depth is maintained as pace increases'],
    commonBreakdowns: ['Starting too fast and making errors', 'Not moving feet — lazy warm up', 'Hitting to the middle with no direction'],
    progression: 'Add specific patterns — 5 crosscourt, then change direction.',
    regression: 'Stay at 50-75% pace. Focus on consistency only.',
    competitiveVariation: 'Rally challenge — sustain 20 balls at 90% pace.',
    matchPlayRelevance: 'A structured warm up prepares the body and mind for competition. Players who warm up with purpose perform better in the first few games.'
  },
  {
    id: 'hs-feeding-1',
    name: 'Groundstroke Consistency Under Pace',
    level: ['hs'],
    sessionBlock: 'feeding',
    skillCategory: 'baseline',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Build the ability to maintain consistent groundstrokes when receiving pace. Develop timing and preparation under pressure.',
    setup: 'Coach feeds at 70-80% pace to forehand and backhand alternating. Player must return every ball deep with controlled topspin.',
    recommendedTime: '15 min',
    coachingCues: ['Shorten your backswing when the pace increases', 'Use the incoming pace — don\'t try to generate your own', 'Stay balanced — don\'t get pushed off your base', 'Aim deep and let the ball do the work'],
    standards: ['Player returns 7 out of 10 feeds deep with control', 'Balance is maintained throughout'],
    commonBreakdowns: ['Big backswing causing late contact', 'Getting pushed back behind the baseline', 'Losing control when pace increases'],
    progression: 'Increase feed pace to 90%. Add directional targets.',
    regression: 'Reduce feed pace. Focus on one side at a time.',
    competitiveVariation: 'Count consecutive deep returns — beat your personal best.',
    matchPlayRelevance: 'High school and tournament opponents will hit with pace. Players who can absorb and redirect pace control the baseline exchange.'
  },
  {
    id: 'hs-liveball-1',
    name: 'Doubles Point Construction',
    level: ['hs'],
    sessionBlock: 'liveball',
    skillCategory: 'doubles',
    feedingStyle: 'live-ball',
    type: 'tactical',
    objective: 'Develop doubles point construction — serve, return, net play, and communication as a team.',
    setup: 'Two teams play doubles points. Focus on server-net player coordination, return positioning, and closing the net together.',
    recommendedTime: '20 min',
    coachingCues: ['Communicate before every point — who covers what', 'Net player — be active, look for the poach', 'Server — get the first serve in and follow the plan', 'Close together at the net — don\'t leave the middle open'],
    standards: ['Teams communicate before each point', 'Net player attempts poaches on at least 30% of points', 'Teams close to the net together when possible'],
    commonBreakdowns: ['No communication between partners', 'Net player standing still', 'Both players staying back at the baseline'],
    progression: 'Add specific formations — Australian, I-formation.',
    regression: 'One-up, one-back only. Focus on basic communication.',
    competitiveVariation: 'Doubles tiebreaker with serve rotation.',
    matchPlayRelevance: 'Doubles is a core part of high school team tennis. Strong doubles teams can carry a lineup. Communication and positioning are everything.'
  },
  {
    id: 'hs-serve-1',
    name: 'Second Serve Development — Kick and Slice',
    level: ['hs'],
    sessionBlock: 'serve-return',
    skillCategory: 'serve-return',
    feedingStyle: 'both',
    type: 'technical',
    objective: 'Develop a reliable second serve with spin variation. Build confidence in the kick serve and slice serve.',
    setup: 'Player serves sets of 10 second serves. Alternate between kick serve (heavy topspin) and slice serve (sidespin). Target specific zones.',
    recommendedTime: '15 min',
    coachingCues: ['Kick serve — toss slightly behind your head, brush up', 'Slice serve — toss slightly to the right, brush across', 'Second serve must go in — no double faults', 'Spin is your safety net — use it'],
    standards: ['Player makes 7 out of 10 second serves', 'Visible spin variation between kick and slice'],
    commonBreakdowns: ['Flat second serve — no spin', 'Toss in the wrong position for the intended spin', 'Decelerating the swing instead of swinging with spin'],
    progression: 'Play points starting with second serve only. Must hold serve.',
    regression: 'Focus on one serve type at a time. Build confidence before mixing.',
    competitiveVariation: 'Second serve challenge — 10 serves, must make 8. If not, fitness consequence.',
    matchPlayRelevance: 'The second serve is the most important serve in tennis. A weak second serve gets attacked. A strong second serve with spin keeps the server in control.'
  },
  {
    id: 'hs-points-1',
    name: 'Match Simulation — Dual Match Format',
    level: ['hs'],
    sessionBlock: 'points',
    skillCategory: 'tactical',
    feedingStyle: 'live-ball',
    type: 'competitive',
    objective: 'Simulate high school dual match pressure. Build the ability to compete in a team format where every match matters.',
    setup: 'Players play pro sets (first to 8 games) or shortened sets. Simulate the dual match environment — teammates watching, score matters.',
    recommendedTime: '20-25 min',
    coachingCues: ['Play for the team — every game matters', 'Stay composed — your teammates are counting on you', 'Stick to your game plan — don\'t try to be someone you\'re not', 'Compete on every point regardless of the score'],
    standards: ['Players compete with full effort throughout', 'Players demonstrate composure under team pressure', 'Players execute their game plan consistently'],
    commonBreakdowns: ['Changing game plan when losing', 'Getting distracted by other matches', 'Not competing when the team score is already decided'],
    progression: 'Add team scoring — individual results contribute to team total.',
    regression: 'Play shorter sets. Coach provides tactical guidance between games.',
    competitiveVariation: 'Team challenge — losing team does fitness.',
    matchPlayRelevance: 'High school tennis is a team sport. Players must learn to compete under the pressure of representing their team and school.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // ASA (After School Academy)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'asa-warmup-1',
    name: 'Competitive Rally Warm Up — Targets',
    level: ['asa'],
    sessionBlock: 'warmup',
    skillCategory: 'baseline',
    feedingStyle: 'live-ball',
    type: 'cooperative',
    objective: 'Warm up with competitive intent. Rally with specific targets to build accuracy and focus from the first ball.',
    setup: 'Two players rally full court. Place target cones deep in each corner. Players aim for targets while building pace gradually.',
    recommendedTime: '10 min',
    coachingCues: ['Warm up with intent — every ball has a target', 'Build pace gradually but maintain accuracy', 'Move your feet — no lazy warm ups at this level', 'This sets the tone for the entire session'],
    standards: ['Players hit 50% of balls within 3 feet of targets', 'Pace builds to match level by minute 5'],
    commonBreakdowns: ['Hitting without targets — just rallying', 'Starting too fast and making errors', 'Not moving feet between shots'],
    progression: 'Add a competitive element — first to hit 10 targets wins.',
    regression: 'Remove targets. Focus on depth and consistency only.',
    competitiveVariation: 'Target rally — point for every ball that lands within 3 feet of a target.',
    matchPlayRelevance: 'At the ASA level, warm ups must be purposeful. The habits you build in warm up carry into competition.'
  },
  {
    id: 'asa-movement-1',
    name: 'Defensive Recovery — Deep Behind the Baseline',
    level: ['asa'],
    sessionBlock: 'movement',
    skillCategory: 'movement',
    feedingStyle: 'feeding',
    type: 'tactical',
    objective: 'Build the ability to defend from deep behind the baseline and recover to a neutral position. Develop the defensive movement patterns needed for high-level play.',
    setup: 'Coach feeds deep, heavy balls that push the player behind the baseline. Player must defend with depth and topspin, then recover to a neutral position.',
    recommendedTime: '15 min',
    coachingCues: ['Stay low and load your legs — don\'t stand up', 'Use heavy topspin to buy time', 'Aim high over the net with margin', 'Recover forward after the defensive shot — don\'t stay back'],
    standards: ['Player defends 6 out of 10 deep balls with depth', 'Recovery to neutral position after defensive shots'],
    commonBreakdowns: ['Hitting flat from a defensive position', 'Not recovering forward after the defensive shot', 'Giving up on balls that push them deep'],
    progression: 'Add a second ball — player must transition from defense to offense.',
    regression: 'Coach feeds at reduced pace. Focus on the recovery pattern.',
    competitiveVariation: 'Defensive rally — player must survive 5 defensive shots before playing out the point.',
    matchPlayRelevance: 'At the ASA level, opponents will push you deep. The ability to defend and recover is what keeps you in points and creates counterattack opportunities.'
  },
  {
    id: 'asa-feeding-1',
    name: 'Weapon Development — Signature Shot Pattern',
    level: ['asa'],
    sessionBlock: 'feeding',
    skillCategory: 'baseline',
    feedingStyle: 'feeding',
    type: 'tactical',
    objective: 'Develop each player\'s signature offensive weapon. Build the shot that defines their game style.',
    setup: 'Coach feeds balls that set up the player\'s primary weapon (e.g., inside-out forehand, crosscourt backhand, drop shot). Player executes the weapon with full intent.',
    recommendedTime: '20 min',
    coachingCues: ['This is YOUR shot — own it', 'Set up with your feet first, then execute', 'Hit with authority — this is not practice, this is weapon building', 'Visualize using this shot in a match situation'],
    standards: ['Player executes the weapon with quality 6 out of 10 times', 'Footwork and setup are consistent'],
    commonBreakdowns: ['Not committing to the shot — going tentative', 'Poor setup — rushing the footwork', 'Not visualizing the match context'],
    progression: 'Play points where the player must set up and use their weapon.',
    regression: 'Isolate the footwork pattern. Build the setup before adding the shot.',
    competitiveVariation: 'Weapon challenge — play a set where bonus points are awarded for executing the signature shot.',
    matchPlayRelevance: 'Every competitive player needs a weapon — a shot that opponents fear. Developing this weapon is what separates ASA players from lower levels.'
  },
  {
    id: 'asa-liveball-1',
    name: 'Pattern Play — Serve + 1 + 2',
    level: ['asa'],
    sessionBlock: 'liveball',
    skillCategory: 'tactical',
    feedingStyle: 'live-ball',
    type: 'tactical',
    objective: 'Extend the serve + 1 pattern to include a planned second shot. Build three-shot offensive sequences.',
    setup: 'Player serves with a specific target. After the return, player executes a planned first ball (serve + 1). After the opponent\'s response, player executes a planned second ball (serve + 2). Point is played out.',
    recommendedTime: '20 min',
    coachingCues: ['Plan three shots before you serve — serve, +1, +2', 'Each shot should set up the next one', 'If the pattern breaks, adapt — but start with the plan', 'Own the first three shots of the point'],
    standards: ['Player executes the 3-shot pattern 3 out of 10 times', 'Serve placement consistently sets up the pattern'],
    commonBreakdowns: ['No plan beyond the serve', 'Abandoning the pattern after the first shot', 'Not adapting when the opponent disrupts the pattern'],
    progression: 'Play full sets with serve + 1 + 2 as the tactical focus.',
    regression: 'Focus on serve + 1 only. Add the second shot when the first pattern is consistent.',
    competitiveVariation: 'Pattern points — bonus point for completing the full 3-shot sequence.',
    matchPlayRelevance: 'At the ASA level, players must think in sequences, not individual shots. The serve + 1 + 2 is how elite players construct points from the service game.'
  },
  {
    id: 'asa-serve-1',
    name: 'Serve Variation — First and Second Serve Packages',
    level: ['asa'],
    sessionBlock: 'serve-return',
    skillCategory: 'serve-return',
    feedingStyle: 'both',
    type: 'tactical',
    objective: 'Develop serve packages — planned first and second serve combinations for different game situations.',
    setup: 'Player serves sets of 10. Each set has a specific package: e.g., wide first serve + kick second serve to the body. Alternate packages.',
    recommendedTime: '15 min',
    coachingCues: ['Your first and second serve should work together as a package', 'If the first serve goes wide, the second serve should go to the body — keep them guessing', 'Vary your packages — don\'t be predictable', 'Every serve must have a purpose'],
    standards: ['Player executes 3 different serve packages consistently', 'First serve percentage above 55%', 'Second serve has visible spin and placement'],
    commonBreakdowns: ['Same serve every time — no variation', 'Second serve is just a slower first serve', 'No tactical intent behind serve placement'],
    progression: 'Play points with specific serve packages assigned for each game.',
    regression: 'Focus on one package at a time. Build consistency before adding variation.',
    competitiveVariation: 'Serve package challenge — coach calls the package before each point.',
    matchPlayRelevance: 'At the ASA level, the serve must be a weapon with variation. Predictable servers get broken. Varied servers hold serve and control matches.'
  },
  {
    id: 'asa-points-1',
    name: 'Practice Sets — Match Simulation',
    level: ['asa'],
    sessionBlock: 'points',
    skillCategory: 'tactical',
    feedingStyle: 'live-ball',
    type: 'competitive',
    objective: 'Full match simulation with tactical focus. Build the ability to execute game plans under real match pressure.',
    setup: 'Players play full sets with proper scoring, changeovers, and warm up. Coach assigns a tactical focus for each player before the set.',
    recommendedTime: '25-30 min',
    coachingCues: ['Execute your game plan — don\'t abandon it when you lose a few points', 'Use the changeover to assess and adjust', 'Compete on every point — this is your tournament preparation', 'Track your patterns — are you executing what you planned?'],
    standards: ['Players execute their assigned tactical focus 50% of the time', 'Players demonstrate composure during changeovers', 'Players compete with full effort throughout'],
    commonBreakdowns: ['Abandoning the game plan after falling behind', 'Not using changeovers productively', 'Emotional reactions that affect the next point'],
    progression: 'Play best of 3 sets. Add post-match analysis with the coach.',
    regression: 'Play pro sets (first to 8). Coach provides tactical guidance at changeovers.',
    competitiveVariation: 'Consequence sets — loser does fitness. Winner earns a privilege.',
    matchPlayRelevance: 'Practice sets are the closest thing to real tournament play. Players who compete in practice compete in tournaments.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // FTA (Full Time Academy)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'fta-warmup-1',
    name: 'Match Intensity Warm Up — Point Simulation',
    level: ['fta'],
    sessionBlock: 'warmup',
    skillCategory: 'baseline',
    feedingStyle: 'live-ball',
    type: 'competitive',
    objective: 'Warm up at match intensity from the first ball. Build the habit of competing from the moment you step on court.',
    setup: 'Two players rally full court at 85-90% pace from the start. After 3 minutes, play 5 quick points. Then continue rallying at full intensity.',
    recommendedTime: '10-12 min',
    coachingCues: ['No casual warm ups at this level — compete from ball one', 'Find your rhythm quickly — you don\'t get 20 minutes in a match', 'Move your feet and prepare early', 'Set the tone for the session with your intensity'],
    standards: ['Players reach match pace within 2 minutes', 'Points are played with full competitive intent'],
    commonBreakdowns: ['Starting too slowly — casual warm up habits', 'Not competing during the point play section', 'Poor footwork in the first few minutes'],
    progression: 'Start with serve and return warm up instead of rally.',
    regression: 'Allow 5 minutes of gradual build before adding points.',
    competitiveVariation: 'Warm up points count — first to 3 wins.',
    matchPlayRelevance: 'FTA players must be ready to compete from the first point of a match. A slow start can cost you a set.'
  },
  {
    id: 'fta-movement-1',
    name: 'Court Coverage Under Fatigue',
    level: ['fta'],
    sessionBlock: 'movement',
    skillCategory: 'movement',
    feedingStyle: 'feeding',
    type: 'technical',
    objective: 'Build the ability to maintain court coverage and shot quality when fatigued. Develop physical and mental resilience.',
    setup: 'Player completes a fitness circuit (sprints, shuffles, burpees) for 2 minutes, then immediately enters a 10-ball feeding pattern. Repeat 3 rounds.',
    recommendedTime: '20 min',
    coachingCues: ['Your technique should not change when you\'re tired', 'Stay low — don\'t stand up when fatigue hits', 'Breathe between shots — manage your energy', 'This is where matches are won — in the third set when everyone is tired'],
    standards: ['Shot quality remains above 70% in fatigued rounds', 'Footwork patterns are maintained under fatigue'],
    commonBreakdowns: ['Standing up and losing balance when tired', 'Shortening the swing under fatigue', 'Giving up on wide balls'],
    progression: 'Increase the fitness circuit intensity. Add more feeding balls.',
    regression: 'Reduce the fitness circuit. Allow more recovery between rounds.',
    competitiveVariation: 'Fatigued points — play points immediately after the fitness circuit.',
    matchPlayRelevance: 'Matches are won in the later stages when both players are tired. The player who maintains technique and movement under fatigue wins.'
  },
  {
    id: 'fta-feeding-1',
    name: 'Advanced Pattern Drilling — 4 Shot Sequences',
    level: ['fta'],
    sessionBlock: 'feeding',
    skillCategory: 'tactical',
    feedingStyle: 'feeding',
    type: 'tactical',
    objective: 'Execute complex 4-shot tactical sequences with precision. Build the ability to construct points through planned patterns.',
    setup: 'Coach feeds a sequence of 4 balls that simulate a specific tactical pattern (e.g., deep crosscourt, deep crosscourt, short angle, approach and volley). Player must execute all 4 shots with quality.',
    recommendedTime: '20 min',
    coachingCues: ['Think 4 shots ahead — not just the next ball', 'Each shot sets up the next one', 'Execute with precision — this is not about power, it\'s about placement', 'Visualize the opponent\'s position after each shot'],
    standards: ['Player completes the 4-shot sequence with quality 4 out of 10 times', 'Shot placement is intentional on every ball'],
    commonBreakdowns: ['Losing focus after the second shot', 'Not adjusting footwork for each shot in the sequence', 'Hitting with power instead of placement'],
    progression: 'Play points where the player must execute the 4-shot sequence to win.',
    regression: 'Reduce to 3-shot sequences. Slower feeds.',
    competitiveVariation: 'Sequence challenge — bonus points for completing the full 4-shot pattern.',
    matchPlayRelevance: 'Elite players construct points through sequences, not individual shots. The ability to execute 4-shot patterns separates FTA players from the rest.'
  },
  {
    id: 'fta-liveball-1',
    name: 'Tactical Match Play — Opponent Scouting',
    level: ['fta'],
    sessionBlock: 'liveball',
    skillCategory: 'tactical',
    feedingStyle: 'live-ball',
    type: 'tactical',
    objective: 'Develop the ability to scout and adapt to an opponent\'s game during live play. Build tactical awareness and adjustment skills.',
    setup: 'Two players play a practice set. Before the set, each player is given a tactical brief about their opponent\'s strengths and weaknesses. Players must adapt their game plan accordingly.',
    recommendedTime: '25 min',
    coachingCues: ['Study your opponent in the first 2 games — what are their patterns?', 'Adapt your game plan based on what you see', 'Exploit weaknesses — don\'t just play your game, play against their game', 'Use the changeover to reassess and adjust'],
    standards: ['Players demonstrate tactical adaptation within the first 3 games', 'Players can articulate their opponent\'s patterns during changeovers'],
    commonBreakdowns: ['Playing the same game regardless of the opponent', 'Not adjusting when the initial game plan isn\'t working', 'Failing to identify opponent patterns'],
    progression: 'Add video review after the set. Analyze tactical decisions.',
    regression: 'Coach provides tactical cues during changeovers.',
    competitiveVariation: 'Scouting challenge — after the set, each player must identify 3 patterns their opponent used.',
    matchPlayRelevance: 'At the FTA level, players must be able to scout and adapt during a match. The best players in the world adjust their game plan based on what they see across the net.'
  },
  {
    id: 'fta-serve-1',
    name: 'Serve Under Pressure — Clutch Serving',
    level: ['fta'],
    sessionBlock: 'serve-return',
    skillCategory: 'serve-return',
    feedingStyle: 'both',
    type: 'competitive',
    objective: 'Develop the ability to serve with quality under extreme pressure. Build mental toughness on the serve.',
    setup: 'Player serves in pressure scenarios: 30-40, deuce, tiebreaker at 5-6. Must make the serve and execute the serve + 1 pattern. Consequences for double faults.',
    recommendedTime: '15 min',
    coachingCues: ['Trust your motion — don\'t change anything under pressure', 'Breathe before the toss — slow everything down', 'Commit to the serve — no tentative swings', 'Your routine is your anchor — use it every time'],
    standards: ['Player makes 80% of first serves in pressure scenarios', 'No more than 1 double fault per 10 pressure serves', 'Serve + 1 pattern is executed after successful serves'],
    commonBreakdowns: ['Changing the serve motion under pressure', 'Rushing the routine', 'Double faulting on big points', 'Decelerating the swing'],
    progression: 'Add a crowd simulation — other players watch and react.',
    regression: 'Start with less pressure scenarios (40-30, 40-15).',
    competitiveVariation: 'Clutch serve challenge — 10 pressure serves, must make 8 or fitness consequence.',
    matchPlayRelevance: 'The serve under pressure is what separates players who hold serve from players who get broken. FTA players must be clutch servers.'
  },
  {
    id: 'fta-points-1',
    name: 'Tournament Simulation — Full Match with Analysis',
    level: ['fta'],
    sessionBlock: 'points',
    skillCategory: 'tactical',
    feedingStyle: 'live-ball',
    type: 'competitive',
    objective: 'Full tournament-level match simulation with pre-match planning, in-match execution, and post-match analysis.',
    setup: 'Players play a full best-of-3 set match with proper warm up, changeovers, and scoring. Coach observes and takes notes. Post-match analysis session follows.',
    recommendedTime: '60-90 min',
    coachingCues: ['Treat this exactly like a tournament match', 'Execute your pre-match game plan', 'Use changeovers to assess and adjust — write notes', 'Compete with full intensity from first point to last'],
    standards: ['Players execute their game plan consistently', 'Players demonstrate tactical adaptation during the match', 'Players conduct themselves professionally throughout', 'Post-match analysis is specific and honest'],
    commonBreakdowns: ['Not treating practice matches with tournament intensity', 'Failing to adjust when the game plan isn\'t working', 'Poor body language affecting performance', 'Superficial post-match analysis'],
    progression: 'Add video analysis to the post-match review.',
    regression: 'Play a pro set instead of best of 3. Coach provides guidance during changeovers.',
    competitiveVariation: 'Consequence match — results affect training group placement for the week.',
    matchPlayRelevance: 'This is the ultimate training tool for FTA players. Tournament simulation with analysis is how players prepare for real competition at the highest level.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // MULTI-LEVEL DRILLS
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'm-warmup-1',
    name: 'Mini Tennis — Continental Grip',
    level: ['foundations', 'prep', 'jasa'],
    sessionBlock: 'warmup',
    skillCategory: 'baseline',
    feedingStyle: 'live-ball',
    type: 'cooperative',
    objective: 'Warm up hands, feel, and touch while reinforcing continental grip for volleys and slice.',
    setup: 'Two players rally inside the service boxes using only continental grip. Focus on touch, feel, and control.',
    recommendedTime: '5-8 min',
    coachingCues: ['Continental grip only — no switching', 'Soft hands and short backswing', 'Control the ball, don\'t hit through it', 'Move your feet — don\'t reach'],
    standards: ['Players sustain 10+ ball rallies in the service box', 'Continental grip is maintained throughout'],
    commonBreakdowns: ['Switching to forehand grip', 'Hitting too hard — no control', 'Standing still instead of adjusting feet'],
    progression: 'Add volleys — one player at the net, one at the service line.',
    regression: 'Allow any grip. Focus on rally consistency only.',
    competitiveVariation: 'First pair to 20 consecutive rallies wins.',
    matchPlayRelevance: 'Touch and feel are essential for net play, drop shots, and slice. Mini tennis develops these skills in a low-pressure setting.'
  },
  {
    id: 'm-reflection-1',
    name: 'Session Reflection — 3 Takeaways',
    level: ['foundations', 'prep', 'jasa', 'hs', 'asa', 'fta'],
    sessionBlock: 'reflection',
    skillCategory: 'mental',
    feedingStyle: 'both',
    type: 'cooperative',
    objective: 'Build self-analysis habits. Players identify what they learned, what they need to improve, and what they\'ll focus on next.',
    setup: 'Players sit in a circle or stand together. Each player shares: 1) One thing I did well, 2) One thing I need to work on, 3) One thing I\'ll focus on next time.',
    recommendedTime: '5 min',
    coachingCues: ['Be specific — not just "I played well"', 'Be honest about what needs work', 'Listen when others share', 'This is how you get better — by thinking about your game'],
    standards: ['Every player contributes', 'Reflections are specific and honest'],
    commonBreakdowns: ['Generic answers — "I did good"', 'Not taking it seriously', 'Rushing through without real thought'],
    progression: 'Add journaling — players write their reflections in a notebook.',
    regression: 'Coach prompts with specific questions.',
    competitiveVariation: 'Not applicable — reflection is cooperative by nature.',
    matchPlayRelevance: 'Self-analysis is what separates developing players from stagnant ones. The best players in the world reflect after every match.'
  },
  {
    id: 'm-mental-1',
    name: 'Pressure Point — Must Win Scenarios',
    level: ['jasa', 'hs', 'asa', 'fta'],
    sessionBlock: 'competitive-finish',
    skillCategory: 'mental',
    feedingStyle: 'live-ball',
    type: 'competitive',
    objective: 'Build mental toughness through must-win pressure scenarios. Develop composure and execution under stress.',
    setup: 'Two players start a point at a critical score (e.g., 5-6, 30-40 on serve). Must win the point. Rotate scenarios.',
    recommendedTime: '10 min',
    coachingCues: ['Breathe before the point — control your nerves', 'Play your pattern — don\'t panic', 'Trust your training — you\'ve practiced this', 'Win or lose, reset immediately for the next scenario'],
    standards: ['Players compete with composure in pressure scenarios', 'Players execute their patterns under pressure'],
    commonBreakdowns: ['Rushing the point — trying to end it too quickly', 'Playing passively — not committing to shots', 'Emotional reaction after losing a pressure point'],
    progression: 'Add consequences — loser does fitness.',
    regression: 'Start with less pressure scenarios. Build up gradually.',
    competitiveVariation: 'Pressure ladder — win 3 in a row to advance. Lose and start over.',
    matchPlayRelevance: 'Matches are decided in pressure moments. Players who practice these scenarios develop the composure to win tight matches.'
  },
  {
    id: 'm-warmup-2',
    name: 'Dynamic Stretch & Movement Circuit',
    level: ['prep', 'jasa', 'hs', 'asa', 'fta'],
    sessionBlock: 'warmup',
    skillCategory: 'physical',
    feedingStyle: 'both',
    type: 'cooperative',
    objective: 'Prepare the body for training through dynamic stretching and movement patterns. Reduce injury risk and improve readiness.',
    setup: 'Players move through a circuit: high knees, butt kicks, lateral shuffles, carioca, walking lunges, leg swings, arm circles. 2 lengths of the court for each movement.',
    recommendedTime: '8-10 min',
    coachingCues: ['Full range of motion on every movement', 'Stay light on your feet', 'This is preparation, not a workout — controlled effort', 'Focus on the muscles you\'ll use in training'],
    standards: ['Players complete all movements with proper form', 'Players are visibly warm and ready after the circuit'],
    commonBreakdowns: ['Rushing through movements', 'Half-effort on stretches', 'Skipping movements they don\'t like'],
    progression: 'Add sport-specific movements — split steps, crossover steps, approach footwork.',
    regression: 'Reduce the number of movements. Allow walking pace.',
    competitiveVariation: 'Not applicable — warm up is cooperative.',
    matchPlayRelevance: 'A proper dynamic warm up reduces injury risk and prepares the body for the demands of training and competition.'
  }
];

// ─── Assessment Standards ──────────────────────────────────────────

export interface AssessmentCategory {
  name: string;
  standards: string[];
}

export interface StageAssessment {
  stageId: PathwayStageId;
  stageName: string;
  categories: AssessmentCategory[];
}

export const assessments: StageAssessment[] = [
  {
    stageId: 'foundations',
    stageName: 'Red Ball',
    categories: [
      { name: 'Physical Literacy', standards: ['Demonstrates basic balance on one foot', 'Can catch and throw with reasonable accuracy', 'Shows coordination in basic movement patterns', 'Maintains effort through full session'] },
      { name: 'Footwork', standards: ['Moves to the ball with basic readiness', 'Attempts split step with coaching cue', 'Shows basic recovery toward center'] },
      { name: 'Baseline', standards: ['Demonstrates basic unit turn', 'Can rally to the center consistently', 'Uses correct grip with reminders', 'Makes contact in front of the body'] },
      { name: 'Transition & Net Play', standards: ['Can execute simple volleys at the net', 'Understands basic net positioning', 'Shows willingness to come forward'] },
      { name: 'Serve & Return', standards: ['Can execute basic serve motion', 'Toss is reasonably consistent', 'Returns balls into play'] },
      { name: 'Character', standards: ['Listens to coach instructions', 'Shows respect for coaches and other players', 'Demonstrates effort and willingness to try', 'Handles mistakes without major disruption'] },
      { name: 'Competition', standards: ['Understands basic scoring', 'Can play simple points', 'Shows awareness of the court boundaries'] }
    ]
  },
  {
    stageId: 'foundations',
    stageName: 'Orange Ball',
    categories: [
      { name: 'Physical Literacy', standards: ['Improved balance and coordination', 'Can perform basic athletic movements (shuffles, crossovers)', 'Shows rhythm in movement patterns', 'Maintains effort and focus through longer sessions'] },
      { name: 'Footwork', standards: ['Consistent split step habit', 'Recovery to center after shots', 'Crossover movement developing', 'Adjusts feet to the ball before swinging'] },
      { name: 'Baseline', standards: ['Unit turn is becoming habitual', 'Topspin basics are developing', 'Directional rallying (crosscourt and down the line)', 'Contact point is more consistent'] },
      { name: 'Transition & Net Play', standards: ['Continental grip developing on volleys', 'Overhead basics are in place', 'Can execute approach and volley sequence'] },
      { name: 'Serve & Return', standards: ['Continental grip on serve is developing', 'Toss and smooth motion improving', 'Basic placement awareness', 'Returns with direction'] },
      { name: 'Character', standards: ['Problem solving on court', 'Shows independence in training', 'Handles competition with composure', 'Supports teammates and training partners'] },
      { name: 'Competition', standards: ['Participates in Orange Ball tournaments', 'Understands match play format', 'Competes with effort regardless of score'] }
    ]
  },
  {
    stageId: 'prep',
    stageName: 'Green Ball',
    categories: [
      { name: 'Physical Literacy', standards: ['Advanced coordination and athletic literacy', 'Can perform multi-directional movements fluidly', 'Balance maintained during shot execution', 'Endurance for longer training sessions'] },
      { name: 'Footwork', standards: ['Split step timing is consistent', 'Deeper court coverage with proper recovery', 'Open stance developing on groundstrokes', 'Movement in multiple directions is fluid'] },
      { name: 'Baseline', standards: ['Grip changes between forehand and backhand', 'Better contact points with consistency', 'Playing on the rise developing', 'Changing direction with intent', 'Exploiting opponent weaknesses'] },
      { name: 'Transition & Net Play', standards: ['Transition patterns developing', 'Overhead accuracy improving', 'Approach shot to volley sequence', 'Net positioning awareness'] },
      { name: 'Serve & Return', standards: ['Serve placement to specific zones', 'Leg drive developing in serve', 'Tactical serving concepts emerging', 'Return with depth and direction'] },
      { name: 'Character', standards: ['Emotional control in competition', 'Takes ownership of effort and attitude', 'Shows resilience after setbacks', 'Communicates respectfully with partners'] },
      { name: 'Competition', standards: ['Regular Green Ball tournament participation', 'Competitive habits developing', 'Doubles basics understood', 'Competes with patterns and intent'] }
    ]
  },
  {
    stageId: 'jasa',
    stageName: 'JASA',
    categories: [
      { name: 'Physical Literacy', standards: ['Strong athletic base for full court play', 'Wider lower base in ready position', 'Deeper movement patterns', 'Physical endurance for extended play'] },
      { name: 'Footwork', standards: ['Full court movement with efficient recovery', 'Split step is automatic', 'Can cover the full court and recover', 'Movement supports tactical execution'] },
      { name: 'Baseline', standards: ['Full court pace and depth', 'Extension through the hitting zone', 'Tactical use of the forehand', 'Open court patterns developing', 'Consistency under pace'] },
      { name: 'Transition & Net Play', standards: ['Transition competence — approach, volley, overhead', 'Attacking short balls with intent', 'Net play is a weapon, not a weakness', 'Closing patterns developing'] },
      { name: 'Serve & Return', standards: ['Serve targets with consistency', 'More compact return technique', 'Serve + 1 pattern developing', 'Return with tactical intent'] },
      { name: 'Character', standards: ['Independence in training and competition', 'Resilience under pressure', 'Self-analysis habits developing', 'Accountability for effort and attitude', 'Professional conduct on court'] },
      { name: 'Competition', standards: ['UTR readiness', 'Regular yellow ball tournament play', 'Competes with intent and learns from results', 'Match play habits are developing'] }
    ]
  },
  {
    stageId: 'hs',
    stageName: 'HS',
    categories: [
      { name: 'Physical Literacy', standards: ['Match-level fitness and endurance', 'Can sustain intensity through a full dual match', 'Athletic movement patterns are automatic', 'Injury prevention awareness and habits'] },
      { name: 'Footwork', standards: ['Efficient court coverage in singles and doubles', 'Recovery patterns are automatic', 'Footwork supports shot variety and placement', 'Movement under pressure is consistent'] },
      { name: 'Baseline', standards: ['Consistent groundstrokes under pace', 'Directional control with intent', 'Can sustain rallies and build points', 'Shot selection matches the tactical situation'] },
      { name: 'Transition & Net Play', standards: ['Comfortable at the net in both singles and doubles', 'Approach and volley sequence is reliable', 'Overhead is a weapon, not a liability', 'Doubles net play is active and aggressive'] },
      { name: 'Serve & Return', standards: ['Reliable first and second serve', 'Spin variation on second serve', 'Return neutralizes the server', 'Serve placement matches the tactical plan'] },
      { name: 'Character', standards: ['Leadership on and off the court', 'Represents the team and program with professionalism', 'Supports teammates regardless of personal results', 'Handles adversity with composure and maturity'] },
      { name: 'Competition', standards: ['Competes with full effort in team and individual matches', 'Understands dual match strategy and team dynamics', 'Performs under pressure in close matches', 'Demonstrates sportsmanship and respect for opponents'] }
    ]
  },
  {
    stageId: 'asa',
    stageName: 'ASA',
    categories: [
      { name: 'Physical Literacy', standards: ['High-level athletic conditioning through APL', 'Strength and speed support on-court performance', 'Endurance for extended matches and training sessions', 'Recovery habits are established and consistent'] },
      { name: 'Footwork', standards: ['Elite court coverage — can defend and attack from any position', 'Footwork patterns are automatic and efficient', 'Movement supports weapon execution', 'Can maintain footwork quality under fatigue'] },
      { name: 'Baseline', standards: ['Weapon-level groundstroke on at least one side', 'Can construct points through patterns', 'Consistency under high pace and pressure', 'Directional control with depth and spin variation'] },
      { name: 'Transition & Net Play', standards: ['Transition game is a reliable offensive tool', 'Can finish points at the net consistently', 'Approach shot selection is tactical and intentional', 'Comfortable in all net play situations'] },
      { name: 'Serve & Return', standards: ['Serve is a weapon with variation and placement', 'Second serve has reliable spin and depth', 'Return can neutralize and attack', 'Serve + 1 patterns are consistent'] },
      { name: 'Character', standards: ['Full accountability for training and competition', 'Professional conduct at all times', 'Self-analysis is specific and actionable', 'Resilience under pressure is demonstrated consistently', 'Commitment to the development process is unwavering'] },
      { name: 'Competition', standards: ['Strong tournament schedule with clear goals', 'UTR is tracked and progressing', 'Competes with tactical intent and adapts during matches', 'Results reflect the quality of training'] }
    ]
  },
  {
    stageId: 'fta',
    stageName: 'FTA',
    categories: [
      { name: 'Physical Literacy', standards: ['Elite athletic conditioning — strength, speed, endurance, flexibility', 'Physical training is fully integrated with on-court development', 'Nutrition and recovery are part of the daily routine', 'Body management and injury prevention are prioritized'] },
      { name: 'Footwork', standards: ['World-class court coverage and movement efficiency', 'Footwork supports all tactical situations — offense, defense, transition', 'Movement quality is maintained in the third set under fatigue', 'Anticipation and positioning reduce the need for emergency movement'] },
      { name: 'Baseline', standards: ['Multiple weapons from the baseline', 'Can construct and execute complex point patterns', 'Adapts game style based on opponent analysis', 'Consistency and aggression are balanced at the highest level'] },
      { name: 'Transition & Net Play', standards: ['Complete net game — approach, volley, overhead, half-volley', 'Transition is a primary offensive strategy', 'Can finish points efficiently at the net', 'Net play decisions are tactically sound'] },
      { name: 'Serve & Return', standards: ['Serve is a primary weapon with full variation', 'Can hold serve against high-level opponents', 'Return is a weapon that creates break opportunities', 'Serve and return patterns are planned and executed'] },
      { name: 'Character', standards: ['Exemplary professionalism and leadership', 'Sets the standard for the entire program', 'Self-analysis is deep, honest, and drives improvement', 'Handles all competitive situations with composure', 'Commitment to excellence is visible in every interaction'] },
      { name: 'Competition', standards: ['Full competitive schedule aligned with recruitment or elite goals', 'Competes nationally with measurable outcomes', 'Match play demonstrates tactical sophistication', 'Results reflect sustained commitment to the development process'] }
    ]
  }
];

// ─── Coach Standards ───────────────────────────────────────────────

export interface CoachStandard {
  category: string;
  items: string[];
}

export const coachStandards: CoachStandard[] = [
  {
    category: 'Tier 1 Coach Mantra',
    items: [
      'Arrive early and prepared',
      'Set the tone with energy, voice, presence, and clarity',
      'Be fully present and not distracted',
      'Coach every rep, not just feed balls',
      'Give immediate and specific feedback',
      'Hold players accountable without losing care',
      'Build trust with players, parents, and staff',
      'Make every player feel seen, not just the best player',
      'Protect standards every day',
      'Finish sessions with purpose and clear takeaways'
    ]
  },
  {
    category: 'Professional Expectations',
    items: [
      'Coaches must be on time and prepared',
      'Sessions must align with Tier 1 training standards',
      'Phone use should be extremely limited during sessions',
      'Coaches must present professionally on court',
      'Safety and athlete engagement matter at all times',
      'Coaches are expected to communicate professionally with families and staff'
    ]
  },
  {
    category: 'Presence & Authority',
    items: [
      'Set the tone from the moment players arrive',
      'Use your voice — project, don\'t mumble',
      'Position yourself where you can see all players',
      'Move with purpose on court — don\'t stand in one spot',
      'Your energy sets the ceiling for the session'
    ]
  },
  {
    category: 'Coaching Every Rep',
    items: [
      'Every ball hit is an opportunity to coach',
      'Don\'t just feed — observe, correct, reinforce',
      'Give feedback in real time, not just at the end',
      'Be specific: "Turn your shoulders earlier" not "Good job"',
      'Hold the standard on every rep, not just the first few'
    ]
  },
  {
    category: 'Parent Communication',
    items: [
      'Communicate internally first before talking to families about advancement',
      'Families should only be informed after leadership approval',
      'Avoid speculative language about player movement',
      'Keep communication respectful, growth-focused, and clear',
      'Reinforce that development takes time and should not be rushed'
    ]
  },
  {
    category: 'What Tier 1 Coaches Are Not',
    items: [
      'Passive ball feeders',
      'Distracted or disengaged during sessions',
      'Vague or casual in presentation',
      'Lowering standards to avoid discomfort',
      'Prioritizing popularity over development'
    ]
  }
];

// ─── Advancement ───────────────────────────────────────────────────

export interface AdvancementInfo {
  statuses: { name: string; description: string; color: string }[];
  factors: string[];
  approvalChain: { stage: string; owner: string }[];
  communicationStandards: string[];
  philosophy: string[];
}

export const advancementInfo: AdvancementInfo = {
  statuses: [
    { name: 'Approved', description: 'Player has been evaluated and approved for advancement to the next stage. All readiness criteria have been met.', color: 'green' },
    { name: 'Pending', description: 'Player is being evaluated. Some criteria may be met, but full readiness has not been confirmed. Continued observation is needed.', color: 'amber' },
    { name: 'Deferred', description: 'Player is not ready for advancement at this time. Specific areas for development have been identified. This is not a permanent decision.', color: 'red' }
  ],
  factors: [
    'Technical readiness — can the player execute the skills required at the next level?',
    'Physical readiness — does the player have the movement, endurance, and athleticism?',
    'Emotional readiness — can the player handle the intensity and expectations?',
    'Competitive readiness — is the player competing at a level that warrants advancement?',
    'Behavioral readiness — does the player demonstrate the character and conduct expected?',
    'Cultural alignment — does the player embody Tier 1 values and standards?'
  ],
  approvalChain: [
    { stage: 'Foundations (Red & Orange Ball)', owner: 'Max' },
    { stage: 'Prep (Green Ball)', owner: 'Rebeka' },
    { stage: 'JASA', owner: 'Rebeka' },
    { stage: 'ASA and higher academy movement', owner: 'Jon & Filipp' }
  ],
  communicationStandards: [
    'Coaches communicate internally first before talking to families',
    'Families are only informed after leadership approval',
    'Coaches avoid speculative language about player movement',
    'Communication is respectful, growth-focused, and clear',
    'Advancement is presented as earned and coach-led, not parent-driven'
  ],
  philosophy: [
    'Advancement is based on continuous observation, not a single test',
    'Formal assessment combined with weekly coach review',
    'Leadership approval is required — coaches do not make unilateral decisions',
    'Holistic readiness matters — technical skill alone is not enough',
    'A player should not move up just because a parent wants it',
    'One good short-term result does not equal readiness',
    'Advancement is player-centered and long-term focused'
  ]
};

// ─── Session Templates ─────────────────────────────────────────────

export interface SessionTemplate {
  id: string;
  name: string;
  level: PathwayStageId;
  totalTime: string;
  blocks: { blockId: SessionBlockId; duration: string; notes: string }[];
}

export const sessionTemplates: SessionTemplate[] = [
  {
    id: 'orange-60',
    name: 'Orange Ball — 60 Min Session',
    level: 'foundations',
    totalTime: '60 min',
    blocks: [
      { blockId: 'warmup', duration: '8 min', notes: 'Coordination, rhythm, balance activities' },
      { blockId: 'movement', duration: '8 min', notes: 'Split step, recovery, movement patterns' },
      { blockId: 'feeding', duration: '12 min', notes: 'Spacing, contact point, stroke mechanics' },
      { blockId: 'liveball', duration: '12 min', notes: 'Rally skills and decision making' },
      { blockId: 'serve-return', duration: '8 min', notes: 'Toss, smooth motion, basic placement' },
      { blockId: 'points', duration: '8 min', notes: 'Modified scoring and restrictions' },
      { blockId: 'reflection', duration: '4 min', notes: 'Takeaways and wrap up' }
    ]
  },
  {
    id: 'green-60',
    name: 'Green Ball — 60 Min Session',
    level: 'prep',
    totalTime: '60 min',
    blocks: [
      { blockId: 'warmup', duration: '8 min', notes: 'Advanced coordination and athletic literacy' },
      { blockId: 'movement', duration: '8 min', notes: 'Balance, recovery, split step timing, deeper coverage' },
      { blockId: 'feeding', duration: '12 min', notes: 'Grip changes, shape, spacing, repetition' },
      { blockId: 'liveball', duration: '12 min', notes: 'Own the rally, solve problems under pressure' },
      { blockId: 'serve-return', duration: '8 min', notes: 'Placement, leg drive, tactical serving' },
      { blockId: 'points', duration: '8 min', notes: 'Pattern application and intent' },
      { blockId: 'reflection', duration: '4 min', notes: 'Competitive finish and reflection' }
    ]
  },
  {
    id: 'jasa-120',
    name: 'JASA — 2 Hour Group Session',
    level: 'jasa',
    totalTime: '120 min',
    blocks: [
      { blockId: 'warmup', duration: '15 min', notes: 'Continental grip and topspin short court' },
      { blockId: 'feeding', duration: '20 min', notes: 'Groundstroke warm up and movement drill' },
      { blockId: 'liveball', duration: '25 min', notes: 'Groundstroke and movement drill + ground games' },
      { blockId: 'serve-return', duration: '20 min', notes: 'Transition, serve, and return drill' },
      { blockId: 'points', duration: '25 min', notes: 'Point play with constraints' },
      { blockId: 'competitive-finish', duration: '10 min', notes: 'Competitive finish game' },
      { blockId: 'reflection', duration: '5 min', notes: 'Journaling and takeaways' }
    ]
  },
  {
    id: 'hs-90',
    name: 'HS — 90 Min Training Session',
    level: 'hs',
    totalTime: '90 min',
    blocks: [
      { blockId: 'warmup', duration: '10 min', notes: 'Dynamic warm up and rally build' },
      { blockId: 'movement', duration: '10 min', notes: 'Court coverage patterns and recovery' },
      { blockId: 'feeding', duration: '15 min', notes: 'Groundstroke consistency under pace' },
      { blockId: 'liveball', duration: '20 min', notes: 'Doubles point construction and singles patterns' },
      { blockId: 'serve-return', duration: '15 min', notes: 'Second serve development and return tactics' },
      { blockId: 'points', duration: '15 min', notes: 'Match simulation — dual match format' },
      { blockId: 'reflection', duration: '5 min', notes: 'Team debrief and individual takeaways' }
    ]
  },
  {
    id: 'asa-120',
    name: 'ASA — 2 Hour Competitive Session',
    level: 'asa',
    totalTime: '120 min',
    blocks: [
      { blockId: 'warmup', duration: '12 min', notes: 'Competitive rally warm up with targets' },
      { blockId: 'movement', duration: '15 min', notes: 'Defensive recovery and court coverage' },
      { blockId: 'feeding', duration: '20 min', notes: 'Weapon development and pattern drilling' },
      { blockId: 'liveball', duration: '25 min', notes: 'Pattern play — serve + 1 + 2 sequences' },
      { blockId: 'serve-return', duration: '18 min', notes: 'Serve variation and return packages' },
      { blockId: 'points', duration: '25 min', notes: 'Practice sets with tactical focus' },
      { blockId: 'reflection', duration: '5 min', notes: 'Self-analysis and goal setting' }
    ]
  },
  {
    id: 'fta-180',
    name: 'FTA — 3 Hour Full Training Block',
    level: 'fta',
    totalTime: '180 min',
    blocks: [
      { blockId: 'warmup', duration: '15 min', notes: 'Match intensity warm up with point simulation' },
      { blockId: 'movement', duration: '20 min', notes: 'Court coverage under fatigue — fitness integration' },
      { blockId: 'feeding', duration: '25 min', notes: 'Advanced pattern drilling — 4 shot sequences' },
      { blockId: 'liveball', duration: '30 min', notes: 'Tactical match play with opponent scouting' },
      { blockId: 'serve-return', duration: '20 min', notes: 'Clutch serving and return under pressure' },
      { blockId: 'points', duration: '60 min', notes: 'Tournament simulation — full match with analysis' },
      { blockId: 'reflection', duration: '10 min', notes: 'Post-match analysis, journaling, and goal review' }
    ]
  }
];
