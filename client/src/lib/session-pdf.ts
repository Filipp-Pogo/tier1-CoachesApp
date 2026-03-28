/*
  SESSION PDF EXPORT — Tier 1 Performance Cold Dark Brand
  Generates a clean, print-ready HTML document and triggers browser print/save-as-PDF.
  Uses window.open + print() for zero-dependency PDF generation.
  Brand: Dark bg #1a1d21, surface #22262b, blue accent #3b82f6, Inter + Oswald
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
  sessionNotes?: string;
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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', system-ui, sans-serif;
      color: #e8e8e8;
      background: #1a1d21;
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
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand {
      font-family: 'Oswald', system-ui, sans-serif;
      font-size: 22px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #ffffff;
    }
    .brand-sub {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #a0a5ad;
      margin-top: 2px;
    }
    .header-right {
      text-align: right;
      font-size: 12px;
      color: #a0a5ad;
    }
    .header-right .date { font-weight: 600; color: #e8e8e8; }

    /* Session Meta */
    .meta {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
      padding: 12px 16px;
      background: #172554;
      border-radius: 6px;
    }
    .meta-item {
      font-size: 13px;
    }
    .meta-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #a0a5ad;
      margin-bottom: 2px;
    }
    .meta-value {
      font-weight: 600;
      color: #e8e8e8;
    }

    /* Block Table */
    .session-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .session-table th {
      font-family: 'Oswald', system-ui, sans-serif;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #fff;
      background: #3b82f6;
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
      border-bottom: 1px solid rgba(255,255,255,0.08);
      font-size: 13px;
      vertical-align: top;
      color: #e8e8e8;
    }
    .block-num {
      text-align: center;
      font-weight: 700;
      color: #3b82f6;
      font-size: 14px;
    }
    .block-name {
      font-weight: 600;
      white-space: nowrap;
    }
    .block-duration {
      color: #a0a5ad;
      white-space: nowrap;
    }
    .block-content {
      color: #e8e8e8;
    }
    .block-notes {
      font-size: 11px;
      color: #a0a5ad;
      margin-top: 4px;
      font-style: italic;
    }

    /* Drill Details */
    .detail-row td {
      padding: 0 12px 12px 52px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .drill-details {
      background: #22262b;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 12px;
      line-height: 1.5;
      color: #e8e8e8;
    }
    .drill-name {
      font-family: 'Oswald', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #3b82f6;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .drill-details div { margin-bottom: 6px; }
    .drill-details strong { color: #ffffff; }
    .drill-details ul {
      margin: 4px 0 0 16px;
      padding: 0;
    }
    .drill-details li {
      margin-bottom: 2px;
      color: #e8e8e8;
    }

    /* Footer */
    .footer {
      border-top: 2px solid rgba(255,255,255,0.08);
      padding-top: 12px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #a0a5ad;
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

    /* Print button bar */
    .print-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #172554;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 100;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .print-bar button {
      font-family: 'Inter', system-ui, sans-serif;
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
      background: #3b82f6;
      color: #fff;
    }
    .btn-close {
      background: transparent;
      color: #a0a5ad;
      border: 1px solid rgba(255,255,255,0.15) !important;
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
        <div class="brand">Tier 1 Performance</div>
        <div class="brand-sub">Internal Session Plan &middot; Caliber Sports Facility</div>
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

    ${data.sessionNotes ? `
    <div style="background:#22262b;border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:12px 16px;margin-bottom:20px;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#a0a5ad;margin-bottom:6px;font-weight:600;">Session Notes</div>
      <div style="font-size:13px;color:#e8e8e8;line-height:1.5;white-space:pre-wrap;">${data.sessionNotes}</div>
    </div>` : ''}

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
      <span>Tier 1 Performance &middot; Internal Use Only</span>
      <span>The Standard Is The Standard.</span>
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
