import { Suspense } from 'react';
import { FlagPilot } from '@flagpilot/sdk-js';

const client = new FlagPilot({
  url: process.env.NEXT_PUBLIC_EVAL_URL ?? 'http://localhost:5000',
});

async function FlagStatus() {
  const isEnabled = await client.isEnabled('test-flag');

  return (
    <strong style={{ color: isEnabled ? 'green' : 'red' }}>
      {isEnabled ? 'ENABLED' : 'DISABLED'}
    </strong>
  );
}

export default function DemoPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>FlagPilot Demo</h1>
      <p>
        Flag <code>test-flag</code>:{' '}
        <Suspense fallback={<span>Loading...</span>}>
          <FlagStatus />
        </Suspense>
      </p>
    </main>
  );
}
