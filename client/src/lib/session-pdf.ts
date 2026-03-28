/*
  SESSION PDF EXPORT
  Generates a clean, print-ready HTML document and triggers browser print/save-as-PDF.
  Uses window.open + print() for zero-dependency PDF generation.
  Designed for on-court reference: high contrast, large text, minimal decoration.
*/

import { pathwayStages, sessionBlocks, drills, type PathwayStageId, type SessionBlockId } from './data';

interface ExportBlock {
  blockId: SessionBlockId;
  drillId?: string;
  duration: string;
  notes: string;
}

interface SessionExportData {
  level: PathwayStageId;
  totalTime: string;
  blocks: ExportBlock[];
  date?: string;
}

export function exportSessionPDF(data: SessionExportData) {
  const stage = pathwayStages.find(s => s.id === data.level);
  const dateStr = data.date || new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const blockRows = data.blocks.map((block, i) => {
    const blockInfo = sessionBlocks.find(b => b.id === block.blockId);
    const drill = block.drillId ? drills.find(d => d.id === block.drillId) : null;

    const drillDetails = drill ? `
      <div class="drill-details">
        <div class="drill-name">${drill.name}</div>
        <div class="drill-objective"><strong>Objective:</strong> ${drill.objective}</div>
        <div class="drill-setup"><strong>Setup:</strong> ${drill.setup}</div>
        <div class="drill-cues">
          <strong>Coaching Cues:</strong>
          <ul>
            ${drill.coachingCues.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
        <div class="drill-standards">
          <strong>Standards:</strong>
          <ul>
            ${drill.standards.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      </div>
    ` : '';

    return `
      <tr class="block-row">
        <td class="block-num">${i + 1}</td>
        <td class="block-name">${blockInfo?.name || block.blockId}</td>
        <td class="block-duration">${block.duration}</td>
        <td class="block-content">
          ${drill ? drill.name : (block.notes || blockInfo?.description || '—')}
          ${block.notes && drill ? `<div class="block-notes">Notes: ${block.notes}</div>` : ''}
        </td>
      </tr>
      ${drill ? `<tr class="detail-row"><td colspan="4">${drillDetails}</td></tr>` : ''}
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tier 1 Session Plan — ${stage?.shortName || data.level} — ${dateStr}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'DM Sans', sans-serif;
      color: #1a1a1a;
      background: #fff;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 40px;
    }

    /* Header */
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 3px solid #1a3c2a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header-left { }
    .brand {
      font-family: 'Oswald', sans-serif;
      font-size: 22px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1a3c2a;
    }
    .brand-sub {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #888;
      margin-top: 2px;
    }
    .header-right {
      text-align: right;
      font-size: 12px;
      color: #555;
    }
    .header-right .date { font-weight: 600; color: #1a1a1a; }

    /* Session Meta */
    .meta {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
      padding: 12px 16px;
      background: #f5f0e8;
      border-radius: 6px;
    }
    .meta-item {
      font-size: 13px;
    }
    .meta-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #888;
      margin-bottom: 2px;
    }
    .meta-value {
      font-weight: 600;
      color: #1a1a1a;
    }

    /* Block Table */
    .session-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .session-table th {
      font-family: 'Oswald', sans-serif;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #fff;
      background: #1a3c2a;
      padding: 8px 12px;
      text-align: left;
    }
    .session-table th:first-child {
      width: 40px;
      text-align: center;
      border-radius: 4px 0 0 0;
    }
    .session-table th:last-child {
      border-radius: 0 4px 0 0;
    }
    .block-row td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e5e5;
      font-size: 13px;
      vertical-align: top;
    }
    .block-num {
      text-align: center;
      font-weight: 700;
      color: #1a3c2a;
      font-size: 14px;
    }
    .block-name {
      font-weight: 600;
      white-space: nowrap;
    }
    .block-duration {
      color: #555;
      white-space: nowrap;
    }
    .block-content {
      color: #333;
    }
    .block-notes {
      font-size: 11px;
      color: #888;
      margin-top: 4px;
      font-style: italic;
    }

    /* Drill Details */
    .detail-row td {
      padding: 0 12px 12px 52px;
      border-bottom: 1px solid #e5e5e5;
    }
    .drill-details {
      background: #fafaf7;
      border: 1px solid #e8e4da;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 12px;
      line-height: 1.5;
    }
    .drill-name {
      font-family: 'Oswald', sans-serif;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1a3c2a;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e8e4da;
    }
    .drill-details div { margin-bottom: 6px; }
    .drill-details strong { color: #1a1a1a; }
    .drill-details ul {
      margin: 4px 0 0 16px;
      padding: 0;
    }
    .drill-details li {
      margin-bottom: 2px;
    }

    /* Footer */
    .footer {
      border-top: 2px solid #e5e5e5;
      padding-top: 12px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Print */
    @media print {
      body { padding: 0; }
      .page { padding: 16px 24px; max-width: none; }
      .no-print { display: none !important; }
      .detail-row { break-inside: avoid; }
      .block-row { break-inside: avoid; }
    }

    /* Print button */
    .print-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #1a3c2a;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 100;
    }
    .print-bar button {
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      padding: 8px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .print-bar button:hover { opacity: 0.85; }
    .btn-print {
      background: #fff;
      color: #1a3c2a;
    }
    .btn-close {
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3) !important;
    }
    .print-spacer { height: 56px; }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
    <button class="btn-close" onclick="window.close()">Close</button>
  </div>
  <div class="print-spacer no-print"></div>

  <div class="page">
    <div class="header">
      <div class="header-left">
        <div class="brand">Tier 1 Academy</div>
        <div class="brand-sub">Woodinville Sports Club &middot; Caliber Sports Facility</div>
      </div>
      <div class="header-right">
        <div class="date">${dateStr}</div>
        <div>Session Plan</div>
      </div>
    </div>

    <div class="meta">
      <div class="meta-item">
        <div class="meta-label">Level</div>
        <div class="meta-value">${stage?.shortName || data.level}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Total Time</div>
        <div class="meta-value">${data.totalTime} min</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Blocks</div>
        <div class="meta-value">${data.blocks.length}</div>
      </div>
    </div>

    <table class="session-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Block</th>
          <th>Time</th>
          <th>Drill / Activity</th>
        </tr>
      </thead>
      <tbody>
        ${blockRows}
      </tbody>
    </table>

    <div class="footer">
      <span>Tier 1 Academy &middot; Internal Use Only</span>
      <span>Every Rep Matters</span>
    </div>
  </div>
</body>
</html>`;

  // Open in a new window and trigger print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
