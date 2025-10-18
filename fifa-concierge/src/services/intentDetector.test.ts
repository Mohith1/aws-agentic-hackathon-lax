import { detectRideIntent } from './intentDetector';

test('detects uber ride from Amazon santa monica to LAX airport', () => {
  const text = 'I want to book a uber from Amazon santa monica to LAX airport.';
  const intent = detectRideIntent(text);
  expect(intent.provider).toBe('uber');
  expect(intent.destination).toMatch(/LAX/i);
  expect(intent.start).toMatch(/Amazon/i);
});

test('detects lyft ride when mentioned', () => {
  const text = 'Can you get me a Lyft from my hotel to the stadium?';
  const intent = detectRideIntent(text);
  expect(intent.provider).toBe('lyft');
  expect(intent.destination).toMatch(/stadium/i);
});

test('partial intent with only destination', () => {
  const text = 'Drive me to LAX airport';
  const intent = detectRideIntent(text);
  expect(intent.destination).toMatch(/LAX/i);
});
