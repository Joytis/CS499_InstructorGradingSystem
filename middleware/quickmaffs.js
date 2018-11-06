function Mean(values) {
  if (!Array.isArray(values)) throw new Error('Values are not an array!');
  // Gets javascript to shut up about for in loops
  const total = values.reduce((acc, entry) => acc + entry);
  return total / values.length; // no need for ID
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
  values.forEach(number => { numMapping[number] = (numMapping[number] || 0) + 1; });
  const numMappingKeys = Object.keys(numMapping);
  const greatestFreq = numMappingKeys.reduce((acc, key) => Math.max(acc, numMapping[key]));
  const modes = numMappingKeys.filter(key => numMappingKeys[key] === greatestFreq);
  return (modes.length === 1) ? modes[0] : NaN;
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
