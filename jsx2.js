const fs = require('fs');
// var fw = require('fs');
const readline = require('readline');
const stream = require('stream');

const instream = fs.createReadStream('./Indicators.csv');
const ostream = fs.createWriteStream('ans.json');
const ostream1 = fs.createWriteStream('graph1.json');
const ostream2 = fs.createWriteStream('graph2.json');
const outstream = new stream();
const rl = readline.createInterface(instream, outstream);
let cnt = 0;
let header;
const AsianCountries = ['Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei Darussalam', 'Cambodia', 'China', 'Cyprus',
  'Georgia', 'India', 'Indonesia', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Lebanon',
  'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'Oman', 'Pakistan', 'Philippines', 'Qatar',
  'Saudi Arabia', 'Singapore', 'Sri Lanka', 'Syrian Arab Republic', 'Tajikistan', 'Thailand',
  'Timor-Leste', 'Turkey', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam',
];

const ans = [];
const MapOfMale = {};
const MapOfFemale = {};
const MapOfTotal = {};

for (let i = 0; i < AsianCountries.length; i += 1) {
  MapOfMale[AsianCountries[i]] = 0;
  MapOfFemale[AsianCountries[i]] = 0;
  MapOfTotal[AsianCountries[i]] = 0;
}

rl.on('line', (line) => {
  const str = line.toString();
  if (cnt === 0) {
    header = str.split(',');
  } else {
    const obj = {};
    let p = 0;
    const spl = str.split(',');
    for (let i = 0; i < AsianCountries.length; i += 1) {
      if (spl[0] === AsianCountries[i]) {
        p = 1;
        break;
      }
    }
    // console.log(spl[2]);
    const name = header.indexOf('CountryName');
    const code = header.indexOf('CountryCode');
    const id1 = header.indexOf('IndicatorName');
    const id2 = header.indexOf('IndicatorName') + 1;
    const idcode = header.indexOf('IndicatorCode') + 1;
    const year = header.indexOf('Year') + 1;
    const val = header.indexOf('Value') + 1;
    const pos = spl[id1].includes('Life expectancy at birth');
    if (pos === true && p === 1) {
      // console.log(str);
      // ostream.write(cnt+" s-> {"+str+"}"+"\n");
      obj[header[name]] = spl[name];
      obj[header[code]] = spl[code];
      const st = `${spl[id1]},${spl[id2]}`;
      obj[header[id1]] = st.replace(/"/g, '');
      obj[header[id2]] = spl[idcode];
      obj[header[idcode]] = spl[year];
      obj[header[year]] = spl[val];

      // spl[3] = spl[3].replace(/\'/g,"")

      if (spl[3].includes('female')) {
        MapOfFemale[spl[0]] += parseFloat(spl[6]);
      } else if (spl[3].includes('male')) {
        MapOfMale[spl[0]] += parseFloat(spl[6]);
      } else {
        MapOfTotal[spl[0]] += parseFloat(spl[6]);
      }

      ans.push(obj);
    }
  }
  // console.log(cnt++);
  cnt += 1;
});

rl.on('close', () => {
  // console.log('closed')
  const ansinjson = JSON.stringify(ans);
  ostream.write(ansinjson);

  const dataGraph1 = [];
  for (let i = 0; i < AsianCountries.length; i += 1) {
    const dict = {};
    MapOfMale[AsianCountries[i]] /= 56.0;
    MapOfFemale[AsianCountries[i]] /= 56.0;
    MapOfTotal[AsianCountries[i]] /= 56.0;

    dict.Country = AsianCountries[i];
    dict.AverageExpectancyMale = MapOfMale[AsianCountries[i]];
    dict.AverageExpectancyFemale = MapOfFemale[AsianCountries[i]];

    /* dict1 = {} ;
        dict1["Male"] = MapOfMale[AsianCountries[i]];
        dict1["female"] = MapOfFemale[AsianCountries[i]];

        dict["AverageExpectancy"] = dict1; */

    dataGraph1.push(dict);
  }

  const dataGraph2 = [];
  for (let i = 0; i < 5; i += 1) {
    const dic = {};
    let max = 0;
    let IndexofMax;
    for (let j = 0; j < AsianCountries.length; j += 1) {
      if (MapOfTotal[AsianCountries[j]] > max) {
        max = MapOfTotal[AsianCountries[j]];
        IndexofMax = j;
      }
    }
    dic.Country = AsianCountries[IndexofMax];
    dic.AverageExpectancyTotal = MapOfTotal[AsianCountries[IndexofMax]];
    dataGraph2.push(dic);
    MapOfTotal[AsianCountries[IndexofMax]] = 0;
  }

  const dataGraph1inJson = JSON.stringify(dataGraph1);
  const dataGraph2inJson = JSON.stringify(dataGraph2);
  ostream1.write(dataGraph1inJson);
  ostream2.write(dataGraph2inJson);
  // console.log(MapOfMale);
});
