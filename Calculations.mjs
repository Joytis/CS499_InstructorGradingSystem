import fs from 'fs';

let contents = fs.readFileSync('test.json');
let mean;

function arrayJson() { //Function for file reading from JSON using array
  let numbers = [];
  let i;
  let nums = [];
  nums = JSON.parse(contents);
  for (i in nums) {
    numbers.push(nums[i]);
  }
  return numbers;
}

function Mean(values) {
  values = arrayJson(); //For file reading from JSON. Can be removed
  let total = 0;
  let i;
  for (i in values) {
    total += values[i];
  }
  mean = total / values.length;
  console.log(mean);
  return mean;
}

function Median(values) {
  values = arrayJson(); //For file reading from JSON. Can be removed
  let median;
  let numsLen = values.length;
  values.sort();

  if (numsLen % 2 === 0) {
    median = (values[numsLen / 2 - 1] + values[numsLen / 2]) / 2;
  } else {
    median = values[(numsLen - 1) / 2];
  }

  console.log(median);
  return median;
}

function Mode(values) {
  values = arrayJson(); //For file reading from JSON. Can be removed
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
    console.log(mode);
    return mode;
  }
}

function StandardDeviation(values) {
  values = arrayJson(); //For file reading from JSON. Can be removed
  let meanVal = mean;
  let SDprep = 0;
  let i;
  for (i in values) {
    SDprep += Math.pow((parseFloat(values[i]) - meanVal), 2);
  }
  let SDresult = Math.sqrt(SDprep / values.length);
  console.log(SDresult);
  return SDresult;
}

Mean();
Median();
Mode();
StandardDeviation();

export default {
  Mean,
  Median,
  Mode,
  StandardDeviation,
}
