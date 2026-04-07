/**
 * Generates seed SQL from hardcoded TypeScript data.
 * Run: npx tsx supabase/scripts/generate-seed-sql.ts
 * Outputs: supabase/migrations/002_seed_data.sql
 */

import fs from 'node:fs';
import path from 'node:path';

// We dynamically import the data files
const PROJECT_ROOT = path.resolve(import.meta.dirname, '../..');

// Helper to escape single quotes for SQL
function esc(val: string): string {
  return val.replace(/'/g, "''");
}

// Helper to format a text[] array for SQL
function sqlArray(arr: string[]): string {
  if (!arr || arr.length === 0) return "'{}'";
  const items = arr.map((s) => `"${esc(s)}"`).join(',');
  return `'{${items}}'`;
}

// Helper for nullable text
function sqlText(val: string | undefined | null): string {
  if (val === undefined || val === null) return 'null';
  return `'${esc(val)}'`;
}

// Helper for nullable text[]
function sqlArrayOrNull(arr: string[] | undefined | null): string {
  if (!arr || arr.length === 0) return 'null';
  return sqlArray(arr);
}

async function main() {
  // Import the data modules
  const dataModule = await import(path.join(PROJECT_ROOT, 'client/src/lib/data.ts'));
  const plansModule = await import(path.join(PROJECT_ROOT, 'client/src/lib/sessionPlans.ts'));

  const {
    pathwayStages,
    sessionBlocks,
    skillCategories,
    drills,
    assessments,
    coachStandards,
  } = dataModule;

  const { sessionPlans } = plansModule;

  const lines: string[] = [];
  lines.push('-- Auto-generated seed data from hardcoded TypeScript');
  lines.push(`-- Generated: ${new Date().toISOString()}`);
  lines.push('');

  // ─── Pathway Stages ──────────────────────────────────────────
  lines.push('-- Pathway Stages');
  for (const s of pathwayStages) {
    lines.push(`insert into public.pathway_stages (id, name, short_name, subtitle, ball_color, purpose, priorities, non_negotiables, common_mistakes, competition_expectations, advancement_expectations, advancement_owner, content_status, sort_order) values (${sqlText(s.id)}, ${sqlText(s.name)}, ${sqlText(s.shortName)}, ${sqlText(s.subtitle)}, ${sqlText(s.ballColor)}, ${sqlText(s.purpose)}, ${sqlArray(s.priorities)}, ${sqlArray(s.nonNegotiables)}, ${sqlArray(s.commonMistakes)}, ${sqlText(s.competitionExpectations)}, ${sqlText(s.advancementExpectations)}, ${sqlText(s.advancementOwner)}, ${sqlText(s.contentStatus)}, ${s.order}) on conflict (id) do nothing;`);
  }
  lines.push('');

  // ─── Session Blocks ──────────────────────────────────────────
  lines.push('-- Session Blocks');
  for (const b of sessionBlocks) {
    lines.push(`insert into public.session_blocks (id, name, short_name, description, typical_duration, sort_order) values (${sqlText(b.id)}, ${sqlText(b.name)}, ${sqlText(b.shortName)}, ${sqlText(b.description)}, ${sqlText(b.typicalDuration)}, ${b.order}) on conflict (id) do nothing;`);
  }
  lines.push('');

  // ─── Skill Categories ────────────────────────────────────────
  lines.push('-- Skill Categories');
  for (let i = 0; i < skillCategories.length; i++) {
    const c = skillCategories[i];
    lines.push(`insert into public.skill_categories (id, name, sort_order) values (${sqlText(c.id)}, ${sqlText(c.name)}, ${i + 1}) on conflict (id) do nothing;`);
  }
  lines.push('');

  // ─── Drills ──────────────────────────────────────────────────
  lines.push('-- Drills');
  for (let i = 0; i < drills.length; i++) {
    const d = drills[i];
    lines.push(`insert into public.drills (id, name, level, session_block, skill_category, feeding_style, type, objective, setup, recommended_time, coaching_cues, standards, common_breakdowns, progression, regression, competitive_variation, match_play_relevance, video_url, sub_band, format, sort_order) values (${sqlText(d.id)}, ${sqlText(d.name)}, ${sqlArray(d.level)}, ${sqlText(d.sessionBlock)}, ${sqlText(d.skillCategory)}, ${sqlText(d.feedingStyle)}, ${sqlText(d.type)}, ${sqlText(d.objective)}, ${sqlText(d.setup)}, ${sqlText(d.recommendedTime)}, ${sqlArray(d.coachingCues)}, ${sqlArray(d.standards)}, ${sqlArray(d.commonBreakdowns)}, ${sqlText(d.progression)}, ${sqlText(d.regression)}, ${sqlText(d.competitiveVariation)}, ${sqlText(d.matchPlayRelevance)}, ${sqlText(d.videoUrl)}, ${sqlArrayOrNull(d.subBand)}, ${sqlText(d.format)}, ${i + 1}) on conflict (id) do nothing;`);
  }
  lines.push('');

  // ─── Session Plans ───────────────────────────────────────────
  lines.push('-- Session Plans');
  for (let i = 0; i < sessionPlans.length; i++) {
    const p = sessionPlans[i];
    const blocksJson = JSON.stringify(p.blocks).replace(/'/g, "''");
    lines.push(`insert into public.session_plans (id, plan_number, name, level_tag, level, sub_band, total_time, objective, blocks, coaching_emphasis, standards, common_mistakes, match_play_transfer, sort_order) values (${sqlText(p.id)}, ${p.planNumber}, ${sqlText(p.name)}, ${sqlText(p.levelTag)}, ${sqlText(p.level)}, ${sqlText(p.subBand)}, ${p.totalTime}, ${sqlText(p.objective)}, '${blocksJson}'::jsonb, ${sqlText(p.coachingEmphasis)}, ${sqlArray(p.standards)}, ${sqlArray(p.commonMistakes)}, ${sqlText(p.matchPlayTransfer)}, ${i + 1}) on conflict (id) do nothing;`);
  }
  lines.push('');

  // ─── Assessments ─────────────────────────────────────────────
  lines.push('-- Assessments');
  for (let i = 0; i < assessments.length; i++) {
    const a = assessments[i];
    const catsJson = JSON.stringify(a.categories).replace(/'/g, "''");
    lines.push(`insert into public.assessments (stage_id, stage_name, categories, sort_order) values (${sqlText(a.stageId)}, ${sqlText(a.stageName)}, '${catsJson}'::jsonb, ${i + 1});`);
  }
  lines.push('');

  // ─── Coach Standards ─────────────────────────────────────────
  lines.push('-- Coach Standards');
  for (let i = 0; i < coachStandards.length; i++) {
    const s = coachStandards[i];
    lines.push(`insert into public.coach_standards (category, items, sort_order) values (${sqlText(s.category)}, ${sqlArray(s.items)}, ${i + 1});`);
  }
  lines.push('');

  const output = lines.join('\n');
  const outPath = path.join(PROJECT_ROOT, 'supabase/migrations/002_seed_data.sql');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.log(`Seed SQL written to ${outPath}`);
  console.log(`  Pathway stages: ${pathwayStages.length}`);
  console.log(`  Session blocks: ${sessionBlocks.length}`);
  console.log(`  Skill categories: ${skillCategories.length}`);
  console.log(`  Drills: ${drills.length}`);
  console.log(`  Session plans: ${sessionPlans.length}`);
  console.log(`  Assessments: ${assessments.length}`);
  console.log(`  Coach standards: ${coachStandards.length}`);
}

main().catch(console.error);
