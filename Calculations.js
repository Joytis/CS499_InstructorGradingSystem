const fs = require('fs');

let contents = fs.readFileSync('test.json');
let nums = [];
let numbers = [];
let mean;
nums = JSON.parse(contents);
numbers[0] = nums.score;
numbers[1] = nums.score2;
numbers[2] = nums.score3;
numbers[3] = nums.score4;
numbers[4] = nums.score5;

console.log(numbers);

function sortNum(a, b) {
  return a - b;
}

function Mean() {
  let total = 0;
  let i;
  for (i = 0; i < numbers.length; i += 1) {
    total += numbers[i];
  }
  mean = total / numbers.length;
  console.log(nums.id, mean);
}

function Median() {
  let median;
  let numsLen = numbers.length;
  numbers.sort(sortNum);

  if (numsLen % 2 === 0) {
    median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
  } else {
    median = numbers[(numsLen - 1) / 2];
  }

  console.log(nums.id, median);
}

function Mode() {
  let mode = [];
  let count = [];
  let i;
  let number;
  let maxIndex = 0;
  let k = 0;

  for (i = 0; i < numbers.length; i += 1) {
    number = numbers[i];
    count[number] = (count[number] || 0) + 1;
    if (count[number] > maxIndex) {
      maxIndex = count[number];
      k += 1;
    }
  }

  for (i = 0; i < count.length; i += 1) {
    if (count[i] === maxIndex) {
      mode.push(Number(i));
    }
  }

  if (k === 1) {
    console.log('N/A');
  } else {
    console.log(nums.id, mode);
  }
}

function StandardDeviation() {
  let meanVal = mean;
  let SDprep = 0;
  let i;
  for (i = 0; i < numbers.length; i += 1) {
    SDprep += Math.pow((parseFloat(numbers[i]) - meanVal), 2);
  }
  let SDresult = Math.sqrt(SDprep / numbers.length);
  console.log(nums.id, SDresult);
}

Mean();
Median();
Mode();
StandardDeviation();
