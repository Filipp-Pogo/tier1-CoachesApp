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
      'Maintaining Tier 1 standards and culture',
      'Competitive preparation for high school tennis',
      'Continued technical and tactical development',
      'Physical fitness and match endurance',
      'Leadership and team dynamics'
    ],
    nonNegotiables: [
      'Tier 1 culture and intensity are maintained',
      'Players are held to real standards regardless of competitive goals',
      'Training is purposeful, not just recreational'
    ],
    commonMistakes: [
      'Lowering standards because players are "just doing high school tennis"',
      'Not providing enough structure or progression',
      'Treating HS as a holding group rather than a development environment'
    ],
    competitionExpectations: 'High school team play plus additional tournament participation based on individual goals.',
    advancementExpectations: 'Movement to ASA or FTA requires demonstrated commitment, competitive results, and leadership approval.',
    advancementOwner: 'Jon & Filipp',
    contentStatus: 'placeholder',
    order: 4
  },
  {
    id: 'asa',
    name: 'Tier 1 ASA',
    shortName: 'ASA',
    subtitle: 'After School Academy',
    purpose: 'Train serious competitive players with strong standards, full commitment, structured fitness expectations, and clear tournament alignment. Players in this environment should be highly invested in development and pursuing strong competitive outcomes.',
    priorities: [
      'High-level competitive preparation',
      'Structured fitness and physical development',
      'Advanced tactical and technical training',
      'Tournament alignment and scheduling',
      'Mental toughness and competitive resilience',
      'Full commitment to the development process'
    ],
    nonNegotiables: [
      'Full commitment to training schedule',
      'Structured fitness expectations are met',
      'Tournament participation is aligned with development goals',
      'Players demonstrate professional conduct'
    ],
    commonMistakes: [
      'Allowing players to coast without accountability',
      'Not integrating fitness into the training plan',
      'Lack of tournament planning and alignment'
    ],
    competitionExpectations: 'Strong tournament schedule with clear goals. Players should be pursuing meaningful competitive outcomes.',
    advancementExpectations: 'Movement to FTA requires exceptional commitment, competitive results, and leadership approval from Jon and Filipp.',
    advancementOwner: 'Jon & Filipp',
    contentStatus: 'placeholder',
    order: 5
  },
  {
    id: 'fta',
    name: 'Tier 1 FTA',
    shortName: 'FTA',
    subtitle: 'Full Time Academy',
    purpose: 'This is the highest commitment training environment. It combines on court development, match play, structure, physical development, and long term college or elite competitive preparation. It should be presented as the most complete and demanding development environment in the system.',
    priorities: [
      'Elite on-court development',
      'Comprehensive physical training',
      'Match play integration',
      'College or elite competitive preparation',
      'Mental performance and resilience',
      'Complete athlete development'
    ],
    nonNegotiables: [
      'Highest level of commitment and professionalism',
      'Complete integration of on-court, fitness, and mental training',
      'Clear competitive pathway and goals',
      'Exemplary conduct and leadership'
    ],
    commonMistakes: [
      'Not demanding enough from players at this level',
      'Lack of integrated training approach',
      'Not maintaining the highest professional standards'
    ],
    competitionExpectations: 'Full competitive schedule aligned with college recruitment or elite competitive goals.',
    advancementExpectations: 'FTA is the highest level in the Tier 1 pathway. Development continues within this environment toward individual competitive goals.',
    advancementOwner: 'Jon & Filipp',
    contentStatus: 'placeholder',
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
  // ── Foundations (Red/Orange Ball) Drills ──
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
  // ── Orange Ball Specific Drills ──
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
  // ── Green Ball / Prep Drills ──
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
    coachingCues: ['Aim deep — past the service line', 'Use topspin to control depth', 'Recover to the center of your half', 'Be patient — own the rally before changing direction'],
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
  // ── JASA Drills ──
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
  // ── Multi-level Drills ──
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
    level: ['foundations', 'prep', 'jasa'],
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
      {
        name: 'Physical Literacy',
        standards: [
          'Demonstrates basic balance on one foot',
          'Can catch and throw with reasonable accuracy',
          'Shows coordination in basic movement patterns',
          'Maintains effort through full session'
        ]
      },
      {
        name: 'Footwork',
        standards: [
          'Moves to the ball with basic readiness',
          'Attempts split step with coaching cue',
          'Shows basic recovery toward center'
        ]
      },
      {
        name: 'Baseline',
        standards: [
          'Demonstrates basic unit turn',
          'Can rally to the center consistently',
          'Uses correct grip with reminders',
          'Makes contact in front of the body'
        ]
      },
      {
        name: 'Transition & Net Play',
        standards: [
          'Can execute simple volleys at the net',
          'Understands basic net positioning',
          'Shows willingness to come forward'
        ]
      },
      {
        name: 'Serve & Return',
        standards: [
          'Can execute basic serve motion',
          'Toss is reasonably consistent',
          'Returns balls into play'
        ]
      },
      {
        name: 'Character',
        standards: [
          'Listens to coach instructions',
          'Shows respect for coaches and other players',
          'Demonstrates effort and willingness to try',
          'Handles mistakes without major disruption'
        ]
      },
      {
        name: 'Competition',
        standards: [
          'Understands basic scoring',
          'Can play simple points',
          'Shows awareness of the court boundaries'
        ]
      }
    ]
  },
  {
    stageId: 'foundations',
    stageName: 'Orange Ball',
    categories: [
      {
        name: 'Physical Literacy',
        standards: [
          'Improved balance and coordination',
          'Can perform basic athletic movements (shuffles, crossovers)',
          'Shows rhythm in movement patterns',
          'Maintains effort and focus through longer sessions'
        ]
      },
      {
        name: 'Footwork',
        standards: [
          'Consistent split step habit',
          'Recovery to center after shots',
          'Crossover movement developing',
          'Adjusts feet to the ball before swinging'
        ]
      },
      {
        name: 'Baseline',
        standards: [
          'Unit turn is becoming habitual',
          'Topspin basics are developing',
          'Directional rallying (crosscourt and down the line)',
          'Contact point is more consistent'
        ]
      },
      {
        name: 'Transition & Net Play',
        standards: [
          'Continental grip developing on volleys',
          'Overhead basics are in place',
          'Can execute approach and volley sequence'
        ]
      },
      {
        name: 'Serve & Return',
        standards: [
          'Continental grip on serve is developing',
          'Toss and smooth motion improving',
          'Basic placement awareness',
          'Returns with direction'
        ]
      },
      {
        name: 'Character',
        standards: [
          'Problem solving on court',
          'Shows independence in training',
          'Handles competition with composure',
          'Supports teammates and training partners'
        ]
      },
      {
        name: 'Competition',
        standards: [
          'Participates in Orange Ball tournaments',
          'Understands match play format',
          'Competes with effort regardless of score'
        ]
      }
    ]
  },
  {
    stageId: 'prep',
    stageName: 'Green Ball',
    categories: [
      {
        name: 'Physical Literacy',
        standards: [
          'Advanced coordination and athletic literacy',
          'Can perform multi-directional movements fluidly',
          'Balance maintained during shot execution',
          'Endurance for longer training sessions'
        ]
      },
      {
        name: 'Footwork',
        standards: [
          'Split step timing is consistent',
          'Deeper court coverage with proper recovery',
          'Open stance developing on groundstrokes',
          'Movement in multiple directions is fluid'
        ]
      },
      {
        name: 'Baseline',
        standards: [
          'Grip changes between forehand and backhand',
          'Better contact points with consistency',
          'Playing on the rise developing',
          'Changing direction with intent',
          'Exploiting opponent weaknesses'
        ]
      },
      {
        name: 'Transition & Net Play',
        standards: [
          'Transition patterns developing',
          'Overhead accuracy improving',
          'Approach shot to volley sequence',
          'Net positioning awareness'
        ]
      },
      {
        name: 'Serve & Return',
        standards: [
          'Serve placement to specific zones',
          'Leg drive developing in serve',
          'Tactical serving concepts emerging',
          'Return with depth and direction'
        ]
      },
      {
        name: 'Character',
        standards: [
          'Emotional control in competition',
          'Takes ownership of effort and attitude',
          'Shows resilience after setbacks',
          'Communicates respectfully with partners'
        ]
      },
      {
        name: 'Competition',
        standards: [
          'Regular Green Ball tournament participation',
          'Competitive habits developing',
          'Doubles basics understood',
          'Competes with patterns and intent'
        ]
      }
    ]
  },
  {
    stageId: 'jasa',
    stageName: 'JASA',
    categories: [
      {
        name: 'Physical Literacy',
        standards: [
          'Strong athletic base for full court play',
          'Wider lower base in ready position',
          'Deeper movement patterns',
          'Physical endurance for extended play'
        ]
      },
      {
        name: 'Footwork',
        standards: [
          'Full court movement with efficient recovery',
          'Split step is automatic',
          'Can cover the full court and recover',
          'Movement supports tactical execution'
        ]
      },
      {
        name: 'Baseline',
        standards: [
          'Full court pace and depth',
          'Extension through the hitting zone',
          'Tactical use of the forehand',
          'Open court patterns developing',
          'Consistency under pace'
        ]
      },
      {
        name: 'Transition & Net Play',
        standards: [
          'Transition competence — approach, volley, overhead',
          'Attacking short balls with intent',
          'Net play is a weapon, not a weakness',
          'Closing patterns developing'
        ]
      },
      {
        name: 'Serve & Return',
        standards: [
          'Serve targets with consistency',
          'More compact return technique',
          'Serve + 1 pattern developing',
          'Return with tactical intent'
        ]
      },
      {
        name: 'Character',
        standards: [
          'Independence in training and competition',
          'Resilience under pressure',
          'Self-analysis habits developing',
          'Accountability for effort and attitude',
          'Professional conduct on court'
        ]
      },
      {
        name: 'Competition',
        standards: [
          'UTR readiness',
          'Regular yellow ball tournament play',
          'Competes with intent and learns from results',
          'Match play habits are developing'
        ]
      }
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
      'Sessions must align with WSC training standards',
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
    id: 'general-120',
    name: 'General — 2 Hour Group Session',
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
  }
];
