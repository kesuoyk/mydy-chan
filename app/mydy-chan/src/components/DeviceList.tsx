type Props = {
  devices: string[];
}
export function DeviceList({ devices }: Props) {
  return (
    <ul>
      {devices.length > 0
        ? devices.map(device => (
          <li key={device}>{device}</li>
        ))
        : (
          <li>No devices</li>
        )}
      </ul>
    );
}
