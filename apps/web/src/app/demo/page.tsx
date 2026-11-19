import { FlagPilot } from '@flagpilot/sdk-js';

const client = new FlagPilot({
  url: process.env.NEXT_PUBLIC_EVAL_URL ?? 'http://localhost:5000',
});

export default async function DemoPage() {
  const isEnabled = await client.isEnabled('test-flag');

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>FlagPilot Demo</h1>
      <p>
        Flag <code>test-flag</code>:{' '}
        <strong style={{ color: isEnabled ? 'green' : 'red' }}>
          {isEnabled ? 'ENABLED' : 'DISABLED'}
        </strong>
      </p>
    </main>
  );
}
