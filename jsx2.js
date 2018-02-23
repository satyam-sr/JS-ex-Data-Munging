var fs = require('fs');
//var fw = require('fs');
var readline = require('readline');
var stream = require('stream');

var instream = fs.createReadStream('./Indicators.csv');
var ostream = fs.createWriteStream('ans.json');
var ostream1 = fs.createWriteStream('part21.json');
var ostream2 = fs.createWriteStream('part22.json');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);
var a = 0;
var head;
var list = ["Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei Darussalam","Cambodia","China","Cyprus",
           "Georgia","India","Indonesia","Iraq","Israel","Japan","Jordan","Kazakhstan","Kuwait","Lebanon",
           "Malaysia","Maldives","Mongolia","Myanmar","Nepal","Oman","Pakistan","Philippines","Qatar",
           "Saudi Arabia","Singapore","Sri Lanka","Syrian Arab Republic","Tajikistan","Thailand",
           "Timor-Leste","Turkey","Turkmenistan","United Arab Emirates","Uzbekistan","Vietnam"]

cnt = 0;
ans = [];
mp1 = {};
mp2 = {};
mp3 = {};

for(i=0;i<list.length;i++){
	mp1[list[i]] = 0;
	mp2[list[i]] = 0;
	mp3[list[i]] = 0;
}

rl.on('line', function(line) {
  str = line.toString();
  if(a==0)
  { 
    head = str.split(',');
  }
  else{
  	var obj = {};
    p = 0;
    var spl = str.split(',');
    for(i=0;i<list.length;i++){
      if(spl[0]==list[i]){
        p = 1;
        break ;
      }
    }
    //console.log(spl[2]);
    var pos = spl[2].search(/^"Life expectancy at birth/);
    if(pos!=-1 && p==1){
       console.log(str);
       //ostream.write(cnt+" -> {"+str+"}"+"\n");
       obj[head[0]] = spl[0];
       obj[head[1]] = spl[1];
       var st = spl[2]+","+spl[3];
       obj[head[2]] = st.replace(/\"/g,"");
       obj[head[3]] = spl[4];
       obj[head[4]] = spl[5];
       obj[head[5]] = spl[6];

       //spl[3] = spl[3].replace(/\'/g,"")

       if(spl[3].includes("female")){
       	mp2[spl[0]] += parseFloat(spl[6]);
       }

       else if(spl[3].includes("male")){
       		mp1[spl[0]] += parseFloat(spl[6]);
       }
       
       else{
       		mp3[spl[0]] += parseFloat(spl[6]);
       }

       ans.push(obj);
    }
    
  }
  //console.log(cnt++);
  a++;
});

rl.on('close', function() {

  //console.log('closed')
  ansjson = JSON.stringify(ans);
  ostream.write(ansjson);
   
  bar = [];
  for(i=0;i<list.length;i++){
  	dict = {};
  	mp1[list[i]] = mp1[list[i]]/56.0 ;
  	mp2[list[i]] = mp2[list[i]]/56.0 ;
  	mp3[list[i]] = mp3[list[i]]/56.0 ;

  	dict["Country"] = list[i];
  	dict["AverageExpectancyMale"] = mp1[list[i]];
  	dict["AverageExpectancyFemale"] = mp2[list[i]];

  	/*dict1 = {} ;
  	dict1["Male"] = mp1[list[i]];
  	dict1["female"] = mp2[list[i]];

  	dict["AverageExpectancy"] = dict1;*/

  	bar.push(dict);
  }

  grf2 = [];
  for(i=0;i<5;i++){
  	dic = {};
  	max = 0;
  	for(j=0;j<list.length;j++){
  		if(mp3[list[j]] > max){
  			max = mp3[list[j]];
  			k = j;
  		}
  	}
  	dic["Country"] = list[k];
  	dic["AverageExpectancyTotal"] = mp3[list[k]] ;
  	grf2.push(dic);
  	mp3[list[k]] = 0;
  }

  barjson = JSON.stringify(bar);
  grf2json = JSON.stringify(grf2);
  ostream1.write(barjson);
  ostream2.write(grf2json);
  console.log(mp1);
});

