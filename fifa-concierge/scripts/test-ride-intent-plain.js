function detectRideIntent(text) {
  const lower = text.toLowerCase();
  const mentionsUber = /\buber\b/.test(lower);
  const mentionsLyft = /\blyft\b/.test(lower);
  const provider = mentionsLyft ? 'lyft' : mentionsUber ? 'uber' : null;

  const fromToRegex = /from\s+([^,]+?)\s+(?:to|->)\s+(.+)$/i;
  const toFromRegex = /to\s+([^,]+?)\s+from\s+(.+)$/i;
  const simpleToRegex = /to\s+(.+?)$/i;

  let start = null;
  let destination = null;

  const fmatch = text.match(fromToRegex);
  if (fmatch) {
    start = fmatch[1].trim();
    destination = fmatch[2].trim();
  } else {
    const rmatch = text.match(toFromRegex);
    if (rmatch) {
      destination = rmatch[1].trim();
      start = rmatch[2].trim();
    } else {
      const smatch = text.match(simpleToRegex);
      if (smatch) {
        destination = smatch[1].trim();
      }
    }
  }

  if (destination && /\blax\b/i.test(destination) && !/airport/i.test(destination)) {
    destination = destination.replace(/\b(lax)\b/i, 'LAX Airport');
  }

  return { provider, start, destination };
}

function generateUberLinkFromAddress(startAddress, destinationAddress) {
  const pickup = startAddress ? encodeURIComponent(startAddress) : 'my_location';
  const dropoff = encodeURIComponent(destinationAddress);

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator?.userAgent || '')) {
    return `uber://?action=setPickup&pickup[formatted_address]=${pickup}&dropoff[formatted_address]=${dropoff}`;
  }

  return `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${pickup}&dropoff[formatted_address]=${dropoff}`;
}

const text = 'I want to book a uber from Amazon santa monica to LAX airport.';
const intent = detectRideIntent(text);
console.log('Detected intent:', intent);

// generate link using desktop fallback
const pickup = intent.start ? encodeURIComponent(intent.start) : 'my_location';
const dropoff = encodeURIComponent(intent.destination);
const uberLink = `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${pickup}&dropoff[formatted_address]=${dropoff}`;
console.log('Uber link (web fallback):', uberLink);
