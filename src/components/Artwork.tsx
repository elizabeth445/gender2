type Animal = 'giraffe' | 'elephant' | 'monkey' | 'foliage';
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
  return (
    <img
      className={`art ${className}`}
      src={`/art/${name}.webp`}
      width={900}
      height={tall ? 1350 : name === 'foliage' ? 822 : 935}
      style={{ aspectRatio: tall ? '2 / 3' : name === 'foliage' ? '1312 / 1199' : '1230 / 1278' }}
      alt=""
      aria-hidden="true"
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager && name === 'giraffe' ? 'high' : 'auto'}
      decoding="async"
      draggable="false"
    />
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
