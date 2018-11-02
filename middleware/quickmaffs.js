function Mean(id, values) {
  if (!Array.IsArray(values)) throw new Error('Values are not an array!');
  // Gets javascript to shut up about for in loops
  const total = values.reduce((acc, entry) => acc + entry);
  return total / values.length; // no need for ID
}


function Median(id, values) {
  if (!Array.IsArray(values)) throw new Error('Values are not an array!');
  let median;
  const numsLen = values.length;
  values.sort();

  if (numsLen % 2 === 0) {
    median = (values[numsLen / 2 - 1] + values[numsLen / 2]) / 2;
  } else {
    median = values[(numsLen - 1) / 2];
  }

  return median;
}

function Mode(id, values) {
  if (!Array.IsArray(values)) throw new Error('Values are not an array!');
  // values.
  const numMapping = {};
  let greatestFreq = 0;
  let mode;
  values.forEach(number => {
    numMapping[number] = (numMapping[number] || 0) + 1;

    if (greatestFreq < numMapping[number]) {
      greatestFreq = numMapping[number];
      mode = number;
    }
  });
  // NOTE: Make sure if two numbers have max that the mode is NAN
  return +mode;
}

function StandardDeviation(id, values, mean) {
  if (!Array.IsArray(values)) throw new Error('Values are not an array!');
  const SDprep = values.reduce((acc, value) => acc + ((parseFloat(value) - mean) ** 2));
  // NOTE: INCORRECT fix implementation.
  return Math.sqrt(SDprep / values.length);
}

export default {
  Mean,
  Median,
  Mode,
  StandardDeviation,
};
