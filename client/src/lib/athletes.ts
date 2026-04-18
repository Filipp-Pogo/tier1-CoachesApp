/*
  ATHLETE DATA MODEL — FTA Command Center
  Mock data for V1 development. In production, this will be backed by a database.
  Matches the Data Object Model from the Product Architecture Document.
*/

// ─── Types ───────────────────────────────────────────────────

export type ProgramLevel = 'core' | 'prep' | 'jasa' | 'asa' | 'fta';
export type WellnessStatus = 'green' | 'yellow' | 'red';
export type NoteCategory = 'technical' | 'tactical' | 'mental' | 'physical' | 'general';
export type TournamentPurpose = 'development' | 'confidence' | 'exposure' | 'points' | 'level-testing' | 'match-volume';
export type TournamentStatus = 'upcoming' | 'in-progress' | 'completed' | 'withdrawn';
export type FitnessCategory = 'speed' | 'agility' | 'strength' | 'mobility' | 'power' | 'endurance';
export type CommType = 'email' | 'phone' | 'in-person' | 'video-call';

export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO
  graduationYear: number;
  photo?: string;
  program: ProgramLevel;
  subBand?: string;
  primaryCoach: string;
  enrollmentDate: string; // ISO
  currentUTR: number;
  utrTrend: 'up' | 'down' | 'stable';
  developmentFocus: string[];
  status: 'active' | 'inactive' | 'on-break';
  wellnessStatus: WellnessStatus;
}

export interface DevelopmentPlan {
  id: string;
  athleteId: string;
  status: 'active' | 'archived';
  createdAt: string;
  createdBy: string;
  focusAreas: string[];
  shortTermGoals: string[];
  longTermGoals: string[];
  reviewNotes?: string;
}

export interface UTRSnapshot {
  id: string;
  athleteId: string;
  date: string;
  value: number;
  source: 'official' | 'estimated';
  notes?: string;
}

export interface MatchRecord {
  id: string;
  athleteId: string;
  date: string;
  opponent: string;
  opponentUTR?: number;
  score: string;
  result: 'win' | 'loss' | 'retirement';
  surface: 'hard' | 'clay' | 'grass' | 'indoor';
  tournamentId?: string;
  notes?: string;
}

export interface Tournament {
  id: string;
  athleteId: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  level: string;
  surface: string;
  ageDivision: string;
  purpose: TournamentPurpose;
  status: TournamentStatus;
  resultSummary?: string;
  notes?: string;
}

export interface FitnessTestResult {
  id: string;
  athleteId: string;
  date: string;
  tester: string;
  scores: {
    category: FitnessCategory;
    value: number;
    unit: string;
    benchmark?: number;
  }[];
  notes?: string;
}

export interface WellnessCheckIn {
  id: string;
  athleteId: string;
  date: string;
  sleep: number; // 1-5
  stress: number;
  energy: number;
  morale: number;
  focus: number;
  soreness: number;
  schoolLoad?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface CoachNote {
  id: string;
  athleteId: string;
  date: string;
  author: string;
  category: NoteCategory;
  content: string;
  visibility: 'standard' | 'sensitive';
}

export interface ParentComm {
  id: string;
  athleteId: string;
  date: string;
  parentName: string;
  staffMember: string;
  type: CommType;
  subject: string;
  summary: string;
  followUp?: string;
  followUpDate?: string;
}

export interface FileAttachment {
  id: string;
  athleteId: string;
  name: string;
  fileType: string;
  uploadDate: string;
  uploader: string;
  size: string;
  tags: string[];
  description?: string;
  permission: 'standard' | 'restricted';
}

// ─── Mock Athletes ───────────────────────────────────────────

export const athletes: Athlete[] = [
  {
    id: 'ath-001',
    firstName: 'Marcus',
    lastName: 'Chen',
    dateOfBirth: '2011-06-15',
    graduationYear: 2029,
    program: 'fta',
    subBand: 'UTR 8-10',
    primaryCoach: 'Jon',
    enrollmentDate: '2024-09-01',
    currentUTR: 7.2,
    utrTrend: 'up',
    developmentFocus: ['Transition & Net Play', 'Serve & Return'],
    status: 'active',
    wellnessStatus: 'green',
  },
  {
    id: 'ath-002',
    firstName: 'Sofia',
    lastName: 'Ramirez',
    dateOfBirth: '2010-03-22',
    graduationYear: 2028,
    program: 'fta',
    subBand: 'UTR 10-13',
    primaryCoach: 'Filipp',
    enrollmentDate: '2023-06-15',
    currentUTR: 10.8,
    utrTrend: 'stable',
    developmentFocus: ['Baseline Consistency', 'Point Construction'],
    status: 'active',
    wellnessStatus: 'green',
  },
  {
    id: 'ath-003',
    firstName: 'Ethan',
    lastName: 'Nakamura',
    dateOfBirth: '2012-11-08',
    graduationYear: 2030,
    program: 'fta',
    subBand: 'UTR 5-8',
    primaryCoach: 'Jon',
    enrollmentDate: '2025-01-10',
    currentUTR: 5.9,
    utrTrend: 'up',
    developmentFocus: ['Movement & Footwork', 'First Strike'],
    status: 'active',
    wellnessStatus: 'yellow',
  },
  {
    id: 'ath-004',
    firstName: 'Ava',
    lastName: 'Petrov',
    dateOfBirth: '2011-01-30',
    graduationYear: 2029,
    program: 'fta',
    subBand: 'UTR 8-10',
    primaryCoach: 'Filipp',
    enrollmentDate: '2024-03-01',
    currentUTR: 8.5,
    utrTrend: 'up',
    developmentFocus: ['Serve & Return', 'Pressure & Match Prep'],
    status: 'active',
    wellnessStatus: 'green',
  },
  {
    id: 'ath-005',
    firstName: 'Liam',
    lastName: 'Okafor',
    dateOfBirth: '2010-08-19',
    graduationYear: 2028,
    program: 'fta',
    subBand: 'UTR 10-13',
    primaryCoach: 'Jon',
    enrollmentDate: '2023-09-01',
    currentUTR: 11.3,
    utrTrend: 'stable',
    developmentFocus: ['Tactical Patterns', 'Doubles'],
    status: 'active',
    wellnessStatus: 'green',
  },
  {
    id: 'ath-006',
    firstName: 'Mia',
    lastName: 'Johansson',
    dateOfBirth: '2013-04-12',
    graduationYear: 2031,
    program: 'asa',
    subBand: 'UTR 3-5',
    primaryCoach: 'Rebeka',
    enrollmentDate: '2025-01-15',
    currentUTR: 4.2,
    utrTrend: 'up',
    developmentFocus: ['Baseline Fundamentals', 'Movement & Footwork'],
    status: 'active',
    wellnessStatus: 'green',
  },
  {
    id: 'ath-007',
    firstName: 'Noah',
    lastName: 'Williams',
    dateOfBirth: '2012-07-03',
    graduationYear: 2030,
    program: 'asa',
    subBand: 'UTR 5-8',
    primaryCoach: 'Jon',
    enrollmentDate: '2024-06-01',
    currentUTR: 6.1,
    utrTrend: 'up',
    developmentFocus: ['Serve Development', 'Point Play'],
    status: 'active',
    wellnessStatus: 'yellow',
  },
  {
    id: 'ath-008',
    firstName: 'Isabella',
    lastName: 'Kim',
    dateOfBirth: '2011-12-25',
    graduationYear: 2029,
    program: 'fta',
    subBand: 'UTR 5-8',
    primaryCoach: 'Filipp',
    enrollmentDate: '2024-08-01',
    currentUTR: 6.8,
    utrTrend: 'down',
    developmentFocus: ['Mental Toughness', 'Transition & Net Play'],
    status: 'active',
    wellnessStatus: 'red',
  },
  {
    id: 'ath-009',
    firstName: 'James',
    lastName: 'Patel',
    dateOfBirth: '2013-09-17',
    graduationYear: 2031,
    program: 'jasa',
    primaryCoach: 'Rebeka',
    enrollmentDate: '2025-02-01',
    currentUTR: 3.1,
    utrTrend: 'up',
    developmentFocus: ['Rally Consistency', 'Serve Basics'],
    status: 'active',
    wellnessStatus: 'green',
  },
  {
    id: 'ath-010',
    firstName: 'Emma',
    lastName: 'Larsson',
    dateOfBirth: '2010-05-08',
    graduationYear: 2028,
    program: 'fta',
    subBand: 'UTR 10-13',
    primaryCoach: 'Jon',
    enrollmentDate: '2023-01-15',
    currentUTR: 12.1,
    utrTrend: 'up',
    developmentFocus: ['Advanced Tactics', 'Pressure & Match Prep'],
    status: 'active',
    wellnessStatus: 'green',
  },
  {
    id: 'ath-011',
    firstName: 'Lucas',
    lastName: 'Fernandez',
    dateOfBirth: '2012-02-14',
    graduationYear: 2030,
    program: 'asa',
    subBand: 'UTR 3-5',
    primaryCoach: 'Rebeka',
    enrollmentDate: '2025-03-01',
    currentUTR: 3.8,
    utrTrend: 'stable',
    developmentFocus: ['Baseline Development', 'Footwork Patterns'],
    status: 'active',
    wellnessStatus: 'green',
  },
  {
    id: 'ath-012',
    firstName: 'Olivia',
    lastName: 'Andersen',
    dateOfBirth: '2011-10-01',
    graduationYear: 2029,
    program: 'fta',
    subBand: 'UTR 8-10',
    primaryCoach: 'Filipp',
    enrollmentDate: '2024-01-10',
    currentUTR: 9.2,
    utrTrend: 'up',
    developmentFocus: ['Serve & Return', 'Tactical Variety'],
    status: 'active',
    wellnessStatus: 'green',
  },
];

// ─── Mock Development Plans ──────────────────────────────────

export const developmentPlans: DevelopmentPlan[] = [
  {
    id: 'dp-001', athleteId: 'ath-001', status: 'active', createdAt: '2026-03-01', createdBy: 'Jon',
    focusAreas: ['Transition & Net Play', 'Serve & Return'],
    shortTermGoals: ['Close 60% of short ball opportunities at net', 'Develop consistent kick serve to ad side'],
    longTermGoals: ['Become a complete all-court player', 'Reach UTR 9.0 by end of 2026'],
  },
  {
    id: 'dp-002', athleteId: 'ath-002', status: 'active', createdAt: '2026-02-15', createdBy: 'Filipp',
    focusAreas: ['Baseline Consistency', 'Point Construction'],
    shortTermGoals: ['Maintain 70% first serve percentage in matches', 'Develop inside-out forehand as weapon'],
    longTermGoals: ['Compete consistently at L4+ tournaments', 'Reach UTR 12.0 by end of 2026'],
  },
  {
    id: 'dp-003', athleteId: 'ath-003', status: 'active', createdAt: '2026-03-10', createdBy: 'Jon',
    focusAreas: ['Movement & Footwork', 'First Strike'],
    shortTermGoals: ['Improve split step timing on return', 'Develop aggressive return position'],
    longTermGoals: ['Build athletic foundation for sustained rallies', 'Reach UTR 7.0 by end of 2026'],
  },
  {
    id: 'dp-004', athleteId: 'ath-008', status: 'active', createdAt: '2026-03-15', createdBy: 'Filipp',
    focusAreas: ['Mental Toughness', 'Transition & Net Play'],
    shortTermGoals: ['Develop pre-point routine for pressure situations', 'Improve approach shot selection'],
    longTermGoals: ['Build confidence in competitive matches', 'Reach UTR 8.0 by end of 2026'],
    reviewNotes: 'Isabella has been struggling with match confidence. Focus on process goals over results.',
  },
  {
    id: 'dp-005', athleteId: 'ath-010', status: 'active', createdAt: '2026-01-20', createdBy: 'Jon',
    focusAreas: ['Advanced Tactics', 'Pressure & Match Prep'],
    shortTermGoals: ['Win 2 of next 3 L4 tournaments', 'Develop serve +1 patterns on both sides'],
    longTermGoals: ['Compete at national level consistently', 'Maintain UTR above 12.0'],
  },
];

// ─── Mock UTR Snapshots ──────────────────────────────────────

export const utrSnapshots: UTRSnapshot[] = [
  // Marcus Chen
  { id: 'utr-001', athleteId: 'ath-001', date: '2025-09-01', value: 5.8, source: 'official' },
  { id: 'utr-002', athleteId: 'ath-001', date: '2025-12-01', value: 6.2, source: 'official' },
  { id: 'utr-003', athleteId: 'ath-001', date: '2026-01-15', value: 6.5, source: 'official' },
  { id: 'utr-004', athleteId: 'ath-001', date: '2026-03-01', value: 6.9, source: 'official' },
  { id: 'utr-005', athleteId: 'ath-001', date: '2026-04-10', value: 7.2, source: 'official' },
  // Sofia Ramirez
  { id: 'utr-006', athleteId: 'ath-002', date: '2025-06-01', value: 9.8, source: 'official' },
  { id: 'utr-007', athleteId: 'ath-002', date: '2025-09-01', value: 10.2, source: 'official' },
  { id: 'utr-008', athleteId: 'ath-002', date: '2025-12-01', value: 10.5, source: 'official' },
  { id: 'utr-009', athleteId: 'ath-002', date: '2026-03-01', value: 10.8, source: 'official' },
  // Ethan Nakamura
  { id: 'utr-010', athleteId: 'ath-003', date: '2025-12-01', value: 4.8, source: 'official' },
  { id: 'utr-011', athleteId: 'ath-003', date: '2026-02-01', value: 5.3, source: 'official' },
  { id: 'utr-012', athleteId: 'ath-003', date: '2026-04-01', value: 5.9, source: 'official' },
  // Emma Larsson
  { id: 'utr-013', athleteId: 'ath-010', date: '2025-06-01', value: 11.0, source: 'official' },
  { id: 'utr-014', athleteId: 'ath-010', date: '2025-09-01', value: 11.4, source: 'official' },
  { id: 'utr-015', athleteId: 'ath-010', date: '2025-12-01', value: 11.8, source: 'official' },
  { id: 'utr-016', athleteId: 'ath-010', date: '2026-03-01', value: 12.1, source: 'official' },
  // Isabella Kim
  { id: 'utr-017', athleteId: 'ath-008', date: '2025-09-01', value: 7.5, source: 'official' },
  { id: 'utr-018', athleteId: 'ath-008', date: '2025-12-01', value: 7.2, source: 'official' },
  { id: 'utr-019', athleteId: 'ath-008', date: '2026-03-01', value: 6.8, source: 'official' },
];

// ─── Mock Match Records ──────────────────────────────────────

export const matchRecords: MatchRecord[] = [
  { id: 'mr-001', athleteId: 'ath-001', date: '2026-04-12', opponent: 'Jake Torres', opponentUTR: 7.0, score: '6-4, 6-3', result: 'win', surface: 'hard', notes: 'Strong serving day. Closed well at net.' },
  { id: 'mr-002', athleteId: 'ath-001', date: '2026-04-05', opponent: 'Ryan Lee', opponentUTR: 7.5, score: '4-6, 6-4, 7-5', result: 'win', surface: 'hard', notes: 'Great comeback. Improved composure in third set.' },
  { id: 'mr-003', athleteId: 'ath-001', date: '2026-03-28', opponent: 'Alex Kim', opponentUTR: 8.1, score: '3-6, 2-6', result: 'loss', surface: 'hard', notes: 'Struggled with return. Need to work on positioning.' },
  { id: 'mr-004', athleteId: 'ath-002', date: '2026-04-14', opponent: 'Mia Zhang', opponentUTR: 10.5, score: '6-2, 6-1', result: 'win', surface: 'hard', notes: 'Dominant baseline play. Inside-out forehand was on.' },
  { id: 'mr-005', athleteId: 'ath-002', date: '2026-04-07', opponent: 'Elena Volkov', opponentUTR: 11.2, score: '6-7, 6-4, 6-3', result: 'win', surface: 'hard', notes: 'Tough first set. Adjusted tactics well.' },
  { id: 'mr-006', athleteId: 'ath-010', date: '2026-04-13', opponent: 'Sarah Mitchell', opponentUTR: 12.5, score: '6-4, 3-6, 7-6', result: 'win', surface: 'hard', notes: 'Clutch tiebreak. Serve +1 pattern was effective.' },
  { id: 'mr-007', athleteId: 'ath-010', date: '2026-04-06', opponent: 'Anna Kowalski', opponentUTR: 11.8, score: '6-3, 6-4', result: 'win', surface: 'hard', notes: 'Controlled the baseline. Good first strike.' },
  { id: 'mr-008', athleteId: 'ath-008', date: '2026-04-10', opponent: 'Lily Park', opponentUTR: 6.5, score: '4-6, 3-6', result: 'loss', surface: 'hard', notes: 'Tight in both sets. Lost focus after 4-4 in first.' },
  { id: 'mr-009', athleteId: 'ath-003', date: '2026-04-11', opponent: 'Ben Carter', opponentUTR: 5.5, score: '6-3, 6-4', result: 'win', surface: 'hard', notes: 'Good movement. Aggressive on short balls.' },
];

// ─── Mock Tournaments ────────────────────────────────────────

export const tournaments: Tournament[] = [
  { id: 'trn-001', athleteId: 'ath-001', name: 'USTA L4 Portland Spring', location: 'Portland, OR', startDate: '2026-04-25', endDate: '2026-04-27', level: 'L4', surface: 'Hard', ageDivision: 'B14', purpose: 'level-testing', status: 'upcoming', notes: 'Focus on serve confidence and first-set composure.' },
  { id: 'trn-002', athleteId: 'ath-002', name: 'USTA L3 Seattle Open', location: 'Seattle, WA', startDate: '2026-05-10', endDate: '2026-05-12', level: 'L3', surface: 'Hard', ageDivision: 'G16', purpose: 'points', status: 'upcoming', notes: 'Target: QF or better.' },
  { id: 'trn-003', athleteId: 'ath-010', name: 'USTA National Spring', location: 'Orlando, FL', startDate: '2026-05-15', endDate: '2026-05-20', level: 'National', surface: 'Hard', ageDivision: 'G16', purpose: 'exposure', status: 'upcoming', notes: 'First national-level tournament. Focus on process.' },
  { id: 'trn-004', athleteId: 'ath-003', name: 'USTA L5 Bellevue', location: 'Bellevue, WA', startDate: '2026-05-03', endDate: '2026-05-04', level: 'L5', surface: 'Hard', ageDivision: 'B14', purpose: 'match-volume', status: 'upcoming' },
  { id: 'trn-005', athleteId: 'ath-001', name: 'USTA L5 Tacoma Winter', location: 'Tacoma, WA', startDate: '2026-03-15', endDate: '2026-03-16', level: 'L5', surface: 'Indoor', ageDivision: 'B14', purpose: 'development', status: 'completed', resultSummary: 'SF — Lost to #1 seed 4-6, 6-7' },
  { id: 'trn-006', athleteId: 'ath-008', name: 'USTA L5 Redmond', location: 'Redmond, WA', startDate: '2026-04-19', endDate: '2026-04-20', level: 'L5', surface: 'Hard', ageDivision: 'G14', purpose: 'confidence', status: 'upcoming', notes: 'Low-pressure event. Focus on enjoying competition.' },
];

// ─── Mock Wellness Check-Ins ─────────────────────────────────

export const wellnessCheckIns: WellnessCheckIn[] = [
  // Marcus — healthy
  { id: 'wc-001', athleteId: 'ath-001', date: '2026-04-18', sleep: 4, stress: 2, energy: 4, morale: 5, focus: 4, soreness: 2, schoolLoad: 'low' },
  { id: 'wc-002', athleteId: 'ath-001', date: '2026-04-17', sleep: 4, stress: 2, energy: 5, morale: 4, focus: 4, soreness: 1, schoolLoad: 'low' },
  { id: 'wc-003', athleteId: 'ath-001', date: '2026-04-16', sleep: 5, stress: 1, energy: 5, morale: 5, focus: 5, soreness: 1, schoolLoad: 'low' },
  // Ethan — yellow flag (stress)
  { id: 'wc-004', athleteId: 'ath-003', date: '2026-04-18', sleep: 3, stress: 4, energy: 3, morale: 3, focus: 3, soreness: 3, schoolLoad: 'high', notes: 'Big exam week coming up.' },
  { id: 'wc-005', athleteId: 'ath-003', date: '2026-04-17', sleep: 3, stress: 4, energy: 3, morale: 4, focus: 2, soreness: 2, schoolLoad: 'high' },
  // Isabella — red flag (declining)
  { id: 'wc-006', athleteId: 'ath-008', date: '2026-04-18', sleep: 2, stress: 5, energy: 2, morale: 2, focus: 2, soreness: 4, schoolLoad: 'medium', notes: 'Right shoulder still bothering me.' },
  { id: 'wc-007', athleteId: 'ath-008', date: '2026-04-17', sleep: 3, stress: 4, energy: 2, morale: 2, focus: 3, soreness: 4, schoolLoad: 'medium' },
  { id: 'wc-008', athleteId: 'ath-008', date: '2026-04-16', sleep: 2, stress: 5, energy: 2, morale: 3, focus: 2, soreness: 3, schoolLoad: 'medium' },
  // Sofia — healthy
  { id: 'wc-009', athleteId: 'ath-002', date: '2026-04-18', sleep: 5, stress: 2, energy: 5, morale: 5, focus: 5, soreness: 1 },
  { id: 'wc-010', athleteId: 'ath-002', date: '2026-04-17', sleep: 4, stress: 2, energy: 4, morale: 5, focus: 4, soreness: 1 },
];

// ─── Mock Coach Notes ────────────────────────────────────────

export const coachNotes: CoachNote[] = [
  { id: 'cn-001', athleteId: 'ath-001', date: '2026-04-17', author: 'Jon', category: 'technical', content: 'Marcus showed great improvement on his approach shots today. Closing pattern after short ball recognition is becoming more natural. Need to keep reinforcing the split step before the volley.', visibility: 'standard' },
  { id: 'cn-002', athleteId: 'ath-001', date: '2026-04-14', author: 'Jon', category: 'tactical', content: 'Worked on serve +1 patterns on the deuce side. Marcus is starting to see the court better after the serve. The inside-out forehand after a wide serve is becoming a weapon.', visibility: 'standard' },
  { id: 'cn-003', athleteId: 'ath-002', date: '2026-04-16', author: 'Filipp', category: 'tactical', content: 'Sofia dominated from the baseline today. Her inside-out forehand is consistently finding the target. We need to challenge her more with variety — she tends to default to the same patterns.', visibility: 'standard' },
  { id: 'cn-004', athleteId: 'ath-008', date: '2026-04-17', author: 'Filipp', category: 'mental', content: 'Isabella is struggling with confidence in practice. She is playing tentatively and avoiding risks. We need to create more low-pressure competitive situations to rebuild her belief.', visibility: 'standard' },
  { id: 'cn-005', athleteId: 'ath-008', date: '2026-04-15', author: 'Filipp', category: 'physical', content: 'Isabella mentioned right shoulder soreness again. Recommended she see the trainer before the Redmond tournament. May need to modify serve volume this week.', visibility: 'sensitive' },
  { id: 'cn-006', athleteId: 'ath-003', date: '2026-04-16', author: 'Jon', category: 'physical', content: 'Ethan is moving well but tiring in the third set of practice matches. Need to build his endurance base. Recommended additional conditioning work with strength coach.', visibility: 'standard' },
  { id: 'cn-007', athleteId: 'ath-010', date: '2026-04-17', author: 'Jon', category: 'tactical', content: 'Emma is ready for nationals. Her serve +1 patterns are sharp and she is reading the game well. Focus this week on first-set composure — she tends to start slow in big matches.', visibility: 'standard' },
  { id: 'cn-008', athleteId: 'ath-010', date: '2026-04-14', author: 'Jon', category: 'mental', content: 'Discussed tournament preparation with Emma. She is excited but slightly anxious about nationals. Worked on visualization exercises and pre-match routine.', visibility: 'standard' },
];

// ─── Mock Parent Communications ──────────────────────────────

export const parentComms: ParentComm[] = [
  { id: 'pc-001', athleteId: 'ath-001', date: '2026-04-10', parentName: 'David Chen', staffMember: 'Jon', type: 'email', subject: 'Portland Tournament Preparation', summary: 'Discussed tournament goals and preparation plan for the L4 Portland event. Emphasized process focus over results. Parent is supportive and aligned.', followUp: 'Send tournament schedule details by April 20' },
  { id: 'pc-002', athleteId: 'ath-008', date: '2026-04-16', parentName: 'Michael Kim', staffMember: 'Filipp', type: 'phone', subject: 'Shoulder Concern and Tournament Decision', summary: 'Discussed Isabella\'s shoulder soreness and whether to play the Redmond tournament. Agreed to have trainer evaluate before making a decision. Parent expressed concern about pushing through pain.', followUp: 'Follow up after trainer evaluation', followUpDate: '2026-04-19' },
  { id: 'pc-003', athleteId: 'ath-010', date: '2026-04-12', parentName: 'Erik Larsson', staffMember: 'Jon', type: 'in-person', subject: 'National Tournament Travel and Expectations', summary: 'Met with Erik to discuss logistics and expectations for Emma\'s first national tournament. Emphasized that this is an exposure event. Parent is supportive and understands the development perspective.', followUp: 'Confirm travel arrangements by May 1' },
];

// ─── Mock Fitness Test Results ───────────────────────────────

export const fitnessTests: FitnessTestResult[] = [
  {
    id: 'ft-001', athleteId: 'ath-001', date: '2026-04-01', tester: 'Strength Coach',
    scores: [
      { category: 'speed', value: 4.8, unit: 'sec (20m)', benchmark: 4.5 },
      { category: 'agility', value: 12.3, unit: 'sec (T-test)', benchmark: 11.5 },
      { category: 'strength', value: 45, unit: 'kg (squat)', benchmark: 50 },
      { category: 'mobility', value: 8, unit: '/10', benchmark: 7 },
      { category: 'power', value: 195, unit: 'cm (broad jump)', benchmark: 200 },
      { category: 'endurance', value: 8.2, unit: 'min (beep test)', benchmark: 9.0 },
    ],
    notes: 'Good mobility. Speed and agility improving. Need more lower body strength work.',
  },
  {
    id: 'ft-002', athleteId: 'ath-010', date: '2026-03-15', tester: 'Strength Coach',
    scores: [
      { category: 'speed', value: 4.2, unit: 'sec (20m)', benchmark: 4.3 },
      { category: 'agility', value: 10.8, unit: 'sec (T-test)', benchmark: 11.0 },
      { category: 'strength', value: 55, unit: 'kg (squat)', benchmark: 55 },
      { category: 'mobility', value: 9, unit: '/10', benchmark: 7 },
      { category: 'power', value: 220, unit: 'cm (broad jump)', benchmark: 210 },
      { category: 'endurance', value: 10.5, unit: 'min (beep test)', benchmark: 9.5 },
    ],
    notes: 'Excellent across the board. Emma is one of the most athletic players in the program.',
  },
];

// ─── Helper Functions ────────────────────────────────────────

export function getAthlete(id: string): Athlete | undefined {
  return athletes.find(a => a.id === id);
}

export function getAthleteDevPlan(athleteId: string): DevelopmentPlan | undefined {
  return developmentPlans.find(dp => dp.athleteId === athleteId && dp.status === 'active');
}

export function getAthleteUTRHistory(athleteId: string): UTRSnapshot[] {
  return utrSnapshots.filter(u => u.athleteId === athleteId).sort((a, b) => a.date.localeCompare(b.date));
}

export function getAthleteMatches(athleteId: string): MatchRecord[] {
  return matchRecords.filter(m => m.athleteId === athleteId).sort((a, b) => b.date.localeCompare(a.date));
}

export function getAthleteTournaments(athleteId: string): Tournament[] {
  return tournaments.filter(t => t.athleteId === athleteId).sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getAthleteWellness(athleteId: string): WellnessCheckIn[] {
  return wellnessCheckIns.filter(w => w.athleteId === athleteId).sort((a, b) => b.date.localeCompare(a.date));
}

export function getAthleteNotes(athleteId: string): CoachNote[] {
  return coachNotes.filter(n => n.athleteId === athleteId).sort((a, b) => b.date.localeCompare(a.date));
}

export function getAthleteParentComms(athleteId: string): ParentComm[] {
  return parentComms.filter(p => p.athleteId === athleteId).sort((a, b) => b.date.localeCompare(a.date));
}

export function getAthleteFitnessTests(athleteId: string): FitnessTestResult[] {
  return fitnessTests.filter(f => f.athleteId === athleteId).sort((a, b) => b.date.localeCompare(a.date));
}

export function getAge(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export const programLabels: Record<ProgramLevel, string> = {
  core: 'Core',
  prep: 'Prep',
  jasa: 'JASA',
  asa: 'ASA',
  fta: 'FTA',
};

export const programColors: Record<ProgramLevel, string> = {
  core: 'bg-red-500',
  prep: 'bg-green-500',
  jasa: 'bg-yellow-500',
  asa: 'bg-purple-500',
  fta: 'bg-t1-blue',
};

export const wellnessStatusColors: Record<WellnessStatus, { bg: string; text: string; label: string }> = {
  green: { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', label: 'Good' },
  yellow: { bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', label: 'Monitor' },
  red: { bg: 'bg-red-500/15', text: 'text-red-600 dark:text-red-400', label: 'Concern' },
};
