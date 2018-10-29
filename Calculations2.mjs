let mean;

function Mean(id, values) {
  let total = 0;
  let i;
  for (i in values) {
    total += values[i];
  }
  mean = total / values.length;
  return  {
    id,
    mean,
  }
}

function Median(id, values) {
  let median;
  let numsLen = values.length;
  values.sort();

  if (numsLen % 2 === 0) {
    median = (values[numsLen / 2 - 1] + values[numsLen / 2]) / 2;
  } else {
    median = values[(numsLen - 1) / 2];
  }

  return  {
    id,
    median,
  }
}

function Mode(id, values) {
  let mode = [];
  let count = [];
  let i;
  let number;
  let maxIndex = 0;
  let k = 0;

  for (i in values) {
    number = values[i];
    count[number] = (count[number] || 0) + 1;
    if (count[number] > maxIndex) {
      maxIndex = count[number];
      k += 1;
    }
  }

  for (i in count) {
    if (count[i] === maxIndex) {
      mode.push(Number(i));
    }
  }

  if (k <= 1) {
    console.log('N/A');
  } else {
    return  {
      id,
      mode,
    }
  }
}

function StandardDeviation(id, values) {
  let meanVal = mean;
  let SDprep = 0;
  let i;
  for (i in values) {
    SDprep += Math.pow((parseFloat(values[i]) - meanVal), 2);
  }
  let SDresult = Math.sqrt(SDprep / values.length);
  return  {
    id,
    SDresult,
  }
}

export default {
  Mean,
  Median,
  Mode,
  StandardDeviation,
}
