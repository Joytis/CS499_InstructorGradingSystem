function Mean(values) {
  if (!Array.isArray(values)) throw new Error('Values are not an array!');
  // Gets javascript to shut up about for in loops
  try {
    const total = values.reduce((acc, entry) => acc + entry);
    return total / values.length; // no need for ID
  } catch (err) {
    if (err.name === 'TypeError') return NaN;
    throw err;
  }
}


function Median(values) {
  if (!Array.isArray(values)) throw new Error('Values are not an array!');
  values.sort((a, b) => a - b);
  const lowMiddle = Math.floor((values.length - 1) / 2);
  const highMiddle = Math.ceil((values.length - 1) / 2);
  return (values[lowMiddle] + values[highMiddle]) / 2;
}

function Mode(values) {
  if (!Array.isArray(values)) throw new Error('Values are not an array!');
  // values.
  const numMapping = {};
  let greatestFreq = 0;
  let mode;
  values.forEach((number) => {
    numMapping[number] = (numMapping[number] || 0) + 1;

    if (greatestFreq < numMapping[number]) {
      greatestFreq = numMapping[number];
      mode = number;
    }
  });
  return (greatestFreq > 1) ? mode : NaN;
}

function StandardDeviation(values) {
  if (!Array.isArray(values)) throw new Error('Values are not an array!');
  const mean = Mean(values);
  const sqDifference = values.map(value => ((value - mean) ** 2));
  return Math.sqrt(Mean(sqDifference));
}

export default {
  Mean,
  Median,
  Mode,
  StandardDeviation,
};
