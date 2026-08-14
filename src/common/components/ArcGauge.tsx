import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { colors } from '../constants';

type ArcGaugeProps = {
  value: number;
  min: number;
  max: number;
  /** Outer width of the gauge in px. */
  size?: number;
  strokeWidth?: number;
  /** Total degrees the arc covers, centred on 12 o'clock. */
  sweepAngle?: number;
  color?: string;
  trackColor?: string;
  /** Renders `min` / `max` under the two arc ends. */
  showBounds?: boolean;
  /** Centred overlay — the score, delta, etc. */
  children?: React.ReactNode;
};

const toRadians = (degrees: number) => ((degrees - 90) * Math.PI) / 180;

const pointOnArc = (cx: number, cy: number, r: number, angle: number) => {
  const rad = toRadians(angle);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = pointOnArc(cx, cy, r, startAngle);
  const end = pointOnArc(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

function ArcGauge({
  value,
  min,
  max,
  size = 220,
  strokeWidth = 14,
  sweepAngle = 250,
  color = colors.positive,
  trackColor = colors.track,
  showBounds = true,
  children,
}: ArcGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const startAngle = -sweepAngle / 2;
  const endAngle = sweepAngle / 2;

  const span = max - min;
  const ratio = span > 0 ? (value - min) / span : 0;
  const progress = Math.min(Math.max(ratio, 0), 1);
  const progressAngle = startAngle + progress * sweepAngle;

  const ends = pointOnArc(center, center, radius, endAngle);
  const labelRow = ends.y + 20;
  const height = Math.max(ends.y, center) + strokeWidth / 2 + (showBounds ? 26 : 0);

  return (
    <View style={{ width: size, height }}>
      <Svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
        <Path
          d={arcPath(center, center, radius, startAngle, endAngle)}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        {progress > 0 && (
          <Path
            d={arcPath(center, center, radius, startAngle, progressAngle)}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {showBounds && (
          <>
            <SvgText
              x={size - ends.x}
              y={labelRow}
              fill={colors.textMuted}
              fontSize={12}
              textAnchor="middle"
            >
              {String(min)}
            </SvgText>
            <SvgText
              x={ends.x}
              y={labelRow}
              fill={colors.textMuted}
              fontSize={12}
              textAnchor="middle"
            >
              {String(max)}
            </SvgText>
          </>
        )}
      </Svg>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        pointerEvents="none"
      >
        {children}
      </View>
    </View>
  );
}

export default ArcGauge;
