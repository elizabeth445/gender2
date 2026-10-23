type Animal = 'giraffe' | 'elephant' | 'elephant-blue' | 'elephant-pink' | 'monkey' | 'foliage';
export function Artwork({
  name,
  className = '',
  eager = false,
}: {
  name: Animal;
  className?: string;
  eager?: boolean;
}) {
  const tall = name === 'giraffe' || name === 'monkey';
  const ribbon = name === 'elephant-blue' || name === 'elephant-pink';
  return (
    <img
      className={`art ${className}`}
      src={`/art/${name}.webp`}
      width={ribbon ? 600 : 900}
      height={ribbon ? 624 : tall ? 1350 : name === 'foliage' ? 822 : 935}
      style={{
        aspectRatio: ribbon
          ? '25 / 26'
          : tall
            ? '2 / 3'
            : name === 'foliage'
              ? '1312 / 1199'
              : '1230 / 1278',
      }}
      alt=""
      aria-hidden="true"
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager && name === 'giraffe' ? 'high' : 'auto'}
      decoding="async"
      draggable="false"
    />
  );
}
export function BotanicalSprig({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`botanical-sprig ${className}`}
      width="100"
      height="160"
      viewBox="0 0 100 160"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 153C32 125 35 100 50 72S67 29 78 9M35 110L19 84M47 79L73 61M59 50L47 27M67 31L85 23" />
        <path
          d="M29 128C8 125 8 110 10 100C28 105 34 114 29 128ZM38 103C59 105 69 92 69 82C50 83 41 90 38 103ZM49 75C31 71 27 58 30 48C46 53 51 61 49 75ZM60 49C78 53 89 41 90 32C75 33 64 38 60 49ZM72 23C59 17 61 6 65 2C76 8 77 15 72 23Z"
          fill="currentColor"
          fillOpacity=".12"
        />
      </g>
    </svg>
  );
}
export function BotanicalMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`botanical-mark ${className}`}
      width="60"
      height="70"
      viewBox="0 0 60 70"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M27 65C26 44 39 27 32 7M29 46C12 46 10 31 11 25C25 25 31 34 29 46ZM31 35C45 35 52 23 49 17C35 18 29 25 31 35ZM32 22C20 19 19 10 22 5C32 8 36 14 32 22Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
