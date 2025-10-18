const { detectRideIntent } = require('../src/services/intentDetector');
const { DeepLinkService } = require('../src/services/deepLinkService');

const text = 'I want to book a uber from Amazon santa monica to LAX airport.';
const intent = detectRideIntent(text);
console.log('Detected intent:', intent);

const provider = intent.provider || 'uber';
const start = intent.start;
const dest = intent.destination;

const link = DeepLinkService.generateUberLinkFromAddress(start, dest);
console.log('Generated Uber link:', link);

const lyftLink = DeepLinkService.generateLyftLinkFromAddress(start, dest);
console.log('Generated Lyft link:', lyftLink);
