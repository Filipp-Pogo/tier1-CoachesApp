/**
 * CourtDiagram - SVG tennis court renderer for visual drill cues.
 *
 * Coordinate system:
 *   x: 0-100 (% of court width, 0=left, 100=right)
 *   y: 0-100 (% of court length, 0=far baseline, 100=near baseline)
 *   50 = net line
 */

export interface CourtPosition {
  x: number;
  y: number;
  label: string;
  role?: 'coach' | 'player' | 'machine';
}

export interface CourtPath {
  from: { x: number; y: number };
  to: { x: number; y: number };
  label?: string;
  style?: 'solid' | 'dashed';
  kind?: 'ball' | 'movement';
}

export interface CourtZone {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  color?: 'accent' | 'muted';
}

export interface CourtDiagramData {
  positions: CourtPosition[];
  paths?: CourtPath[];
  zones?: CourtZone[];
  view?: 'full' | 'half-near' | 'half-far';
  caption?: string;
}

interface Props {
  diagram: CourtDiagramData;
  className?: string;
}

// Court SVG constants
const COURT_LEFT = 10;
const COURT_RIGHT = 90;
const COURT_TOP = 8;
const COURT_BOTTOM = 152;
const NET_Y = 80;
const SERVICE_LINE_TOP_Y = 44;
const SERVICE_LINE_BOTTOM_Y = 116;
const SINGLES_LEFT = 18;
const SINGLES_RIGHT = 82;
const CENTER_X = 50;

// Map 0-100 user coordinates to SVG space
function mapX(x: number): number {
  return COURT_LEFT + (x / 100) * (COURT_RIGHT - COURT_LEFT);
}
function mapY(y: number): number {
  return COURT_TOP + (y / 100) * (COURT_BOTTOM - COURT_TOP);
}

function roleColor(role?: string): string {
  switch (role) {
    case 'coach':
      return '#B85C38';
    case 'machine':
      return '#6B7B8D';
    default:
      return '#2C2C2C';
  }
}

function zoneColor(color?: string): string {
  switch (color) {
    case 'accent':
      return 'rgba(184, 92, 56, 0.15)';
    case 'muted':
    default:
      return 'rgba(107, 123, 141, 0.12)';
  }
}

export function CourtDiagram({ diagram, className = '' }: Props) {
  const { positions = [], paths = [], zones = [], caption } = diagram;

  return (
    <figure className={`not-prose ${className}`}>
      <svg
        viewBox="0 0 100 160"
        className="w-full h-auto"
        role="img"
        aria-label={caption || 'Tennis court diagram'}
      >
        <defs>
          <marker
            id="ball-arrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#B85C38" />
          </marker>
          <marker
            id="move-arrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7B8D" />
          </marker>
        </defs>

        {/* Court surface */}
        <rect
          x={COURT_LEFT}
          y={COURT_TOP}
          width={COURT_RIGHT - COURT_LEFT}
          height={COURT_BOTTOM - COURT_TOP}
          fill="#EDE8DF"
          stroke="#2C2C2C"
          strokeWidth="0.4"
        />

        {/* Singles sidelines */}
        <line x1={SINGLES_LEFT} y1={COURT_TOP} x2={SINGLES_LEFT} y2={COURT_BOTTOM} stroke="#2C2C2C" strokeWidth="0.4" />
        <line x1={SINGLES_RIGHT} y1={COURT_TOP} x2={SINGLES_RIGHT} y2={COURT_BOTTOM} stroke="#2C2C2C" strokeWidth="0.4" />

        {/* Service lines */}
        <line x1={SINGLES_LEFT} y1={SERVICE_LINE_TOP_Y} x2={SINGLES_RIGHT} y2={SERVICE_LINE_TOP_Y} stroke="#2C2C2C" strokeWidth="0.4" />
        <line x1={SINGLES_LEFT} y1={SERVICE_LINE_BOTTOM_Y} x2={SINGLES_RIGHT} y2={SERVICE_LINE_BOTTOM_Y} stroke="#2C2C2C" strokeWidth="0.4" />

        {/* Center service line */}
        <line x1={CENTER_X} y1={SERVICE_LINE_TOP_Y} x2={CENTER_X} y2={SERVICE_LINE_BOTTOM_Y} stroke="#2C2C2C" strokeWidth="0.4" />

        {/* Center marks on baselines */}
        <line x1={CENTER_X - 1} y1={COURT_TOP} x2={CENTER_X + 1} y2={COURT_TOP} stroke="#2C2C2C" strokeWidth="0.4" />
        <line x1={CENTER_X - 1} y1={COURT_BOTTOM} x2={CENTER_X + 1} y2={COURT_BOTTOM} stroke="#2C2C2C" strokeWidth="0.4" />

        {/* Net */}
        <line x1={COURT_LEFT - 2} y1={NET_Y} x2={COURT_RIGHT + 2} y2={NET_Y} stroke="#2C2C2C" strokeWidth="1.2" />
        <text
          x={COURT_LEFT - 3}
          y={NET_Y + 1.5}
          fontSize="3"
          fill="#6B7B8D"
          textAnchor="end"
          fontFamily="IBM Plex Mono, monospace"
        >
          NET
        </text>

        {/* Zones (target areas) */}
        {zones.map((zone, i) => (
          <g key={`z-${i}`}>
            <rect
              x={mapX(zone.x)}
              y={mapY(zone.y)}
              width={mapX(zone.x + zone.width) - mapX(zone.x)}
              height={mapY(zone.y + zone.height) - mapY(zone.y)}
              fill={zoneColor(zone.color)}
              stroke={zone.color === 'accent' ? '#B85C38' : '#6B7B8D'}
              strokeWidth="0.3"
              strokeDasharray="1 1"
              rx="1"
            />
            {zone.label && (
              <text
                x={mapX(zone.x + zone.width / 2)}
                y={mapY(zone.y + zone.height / 2) + 1}
                fontSize="2.8"
                fill={zone.color === 'accent' ? '#8B4C2A' : '#5A6B7D'}
                textAnchor="middle"
                fontFamily="Source Sans 3, sans-serif"
                fontWeight="600"
              >
                {zone.label}
              </text>
            )}
          </g>
        ))}

        {/* Paths (ball trajectories, movement) */}
        {paths.map((path, i) => {
          const isBall = path.kind !== 'movement';
          const x1 = mapX(path.from.x);
          const y1 = mapY(path.from.y);
          const x2 = mapX(path.to.x);
          const y2 = mapY(path.to.y);
          // Curve control point for ball paths
          const dx = x2 - x1;
          const dy = y2 - y1;
          const midX = (x1 + x2) / 2 + (isBall ? -dy * 0.15 : 0);
          const midY = (y1 + y2) / 2 + (isBall ? dx * 0.15 : 0);

          return (
            <g key={`p-${i}`}>
              <path
                d={isBall ? `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}` : `M ${x1} ${y1} L ${x2} ${y2}`}
                stroke={isBall ? '#B85C38' : '#6B7B8D'}
                strokeWidth={isBall ? '0.7' : '0.5'}
                strokeDasharray={path.style === 'dashed' || !isBall ? '1.2 1' : undefined}
                fill="none"
                markerEnd={isBall ? 'url(#ball-arrow)' : 'url(#move-arrow)'}
              />
              {path.label && (
                <text
                  x={midX}
                  y={midY - 1.5}
                  fontSize="2.6"
                  fill={isBall ? '#8B4C2A' : '#5A6B7D'}
                  textAnchor="middle"
                  fontFamily="Source Sans 3, sans-serif"
                  fontWeight="600"
                >
                  {path.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Positions (players, coach) */}
        {positions.map((pos, i) => (
          <g key={`pos-${i}`}>
            <circle
              cx={mapX(pos.x)}
              cy={mapY(pos.y)}
              r="3"
              fill={roleColor(pos.role)}
              stroke="#FDFBF7"
              strokeWidth="0.5"
            />
            <text
              x={mapX(pos.x)}
              y={mapY(pos.y) + 1}
              fontSize="2.6"
              fill="#FDFBF7"
              textAnchor="middle"
              fontFamily="Source Sans 3, sans-serif"
              fontWeight="700"
            >
              {pos.label}
            </text>
          </g>
        ))}
      </svg>

      {caption && (
        <figcaption className="mt-2 text-xs text-t1-muted text-center font-sans">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
