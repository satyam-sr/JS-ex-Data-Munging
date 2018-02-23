const fs = require('fs');
// var fw = require('fs');
const readline = require('readline');
const stream = require('stream');

const instream = fs.createReadStream('./Indicators.csv');
const ostream = fs.createWriteStream('ans.json');
const ostream1 = fs.createWriteStream('part21.json');
const ostream2 = fs.createWriteStream('part22.json');
const outstream = new stream();
const rl = readline.createInterface(instream, outstream);
let a = 0;
let head;
const list = ['Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei Darussalam', 'Cambodia', 'China', 'Cyprus',
  'Georgia', 'India', 'Indonesia', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Lebanon',
  'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'Oman', 'Pakistan', 'Philippines', 'Qatar',
  'Saudi Arabia', 'Singapore', 'Sri Lanka', 'Syrian Arab Republic', 'Tajikistan', 'Thailand',
  'Timor-Leste', 'Turkey', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam',
];

const ans = [];
const mp1 = {};
const mp2 = {};
const mp3 = {};

for (let i = 0; i < list.length; i += 1) {
  mp1[list[i]] = 0;
  mp2[list[i]] = 0;
  mp3[list[i]] = 0;
}

rl.on('line', (line) => {
  const str = line.toString();
  if (a === 0) {
    head = str.split(',');
  } else {
    const obj = {};
    let p = 0;
    const spl = str.split(',');
    for (let i = 0; i < list.length; i += 1) {
      if (spl[0] === list[i]) {
        p = 1;
        break;
      }
    }
    // console.log(spl[2]);
    const name = 0;
    const cd = 1;
    const id1 = 2;
    const id2 = 3;
    const idc = 4;
    const year = 5;
    const val = 6;
    const pos = spl[id1].search(/^"Life expectancy at birth/);
    if (pos !== -1 && p === 1) {
      // console.log(str);
      // ostream.write(cnt+" s-> {"+str+"}"+"\n");
      obj[head[name]] = spl[name];
      obj[head[cd]] = spl[cd];
      const st = `${spl[id1]},${spl[id2]}`;
      obj[head[id1]] = st.replace(/"/g, '');
      obj[head[id2]] = spl[idc];
      obj[head[idc]] = spl[year];
      obj[head[year]] = spl[val];

      // spl[3] = spl[3].replace(/\'/g,"")

      if (spl[3].includes('female')) {
        mp2[spl[0]] += parseFloat(spl[6]);
      } else if (spl[3].includes('male')) {
        mp1[spl[0]] += parseFloat(spl[6]);
      } else {
        mp3[spl[0]] += parseFloat(spl[6]);
      }

      ans.push(obj);
    }
  }
  // console.log(cnt++);
  a += 1;
});

rl.on('close', () => {
  // console.log('closed')
  const ansjson = JSON.stringify(ans);
  ostream.write(ansjson);

  const bar = [];
  for (let i = 0; i < list.length; i += 1) {
    const dict = {};
    mp1[list[i]] /= 56.0;
    mp2[list[i]] /= 56.0;
    mp3[list[i]] /= 56.0;

    dict.Country = list[i];
    dict.AverageExpectancyMale = mp1[list[i]];
    dict.AverageExpectancyFemale = mp2[list[i]];

    /* dict1 = {} ;
        dict1["Male"] = mp1[list[i]];
        dict1["female"] = mp2[list[i]];

        dict["AverageExpectancy"] = dict1; */

    bar.push(dict);
  }

  const grf2 = [];
  for (let i = 0; i < 5; i += 1) {
    const dic = {};
    let max = 0;
    let k;
    for (let j = 0; j < list.length; j += 1) {
      if (mp3[list[j]] > max) {
        max = mp3[list[j]];
        k = j;
      }
    }
    dic.Country = list[k];
    dic.AverageExpectancyTotal = mp3[list[k]];
    grf2.push(dic);
    mp3[list[k]] = 0;
  }

  const barjson = JSON.stringify(bar);
  const grf2json = JSON.stringify(grf2);
  ostream1.write(barjson);
  ostream2.write(grf2json);
  // console.log(mp1);
});
