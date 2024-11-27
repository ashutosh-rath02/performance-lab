"use client";

export interface NetworkSpeed {
  name: string;
  downloadSpeed: number; // in kbps
  latency: number; // in ms
}

const NETWORK_SPEEDS: NetworkSpeed[] = [
  { name: "No Throttling", downloadSpeed: 0, latency: 0 },
  { name: "4G", downloadSpeed: 4000, latency: 100 },
  { name: "3G", downloadSpeed: 1500, latency: 200 },
  { name: "Slow 3G", downloadSpeed: 500, latency: 400 },
];

interface Props {
  value: NetworkSpeed;
  onChange: (speed: NetworkSpeed) => void;
}

export function NetworkThrottle({ value, onChange }: Props) {
  return (
    <select
      value={value.name}
      onChange={(e) => {
        const speed = NETWORK_SPEEDS.find((s) => s.name === e.target.value);
        if (speed) onChange(speed);
      }}
      className="input-control"
    >
      {NETWORK_SPEEDS.map((speed) => (
        <option key={speed.name} value={speed.name}>
          {speed.name}
        </option>
      ))}
    </select>
  );
}
