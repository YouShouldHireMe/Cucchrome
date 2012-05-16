var H = 0;
var V = 0;
var moveSpeed = 2;
var refreshTime = 8;
var mouse_x = 0;
var mouse_y = 0;
var radius = 5;
var mouse_pos = [0,0];
var mouse_vel = [0,0];
var hitRadius = 20;
var pushRadius = 50;
var imgWidth = 18;
var imgHeight = 18;

function getDist(v) {
  return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2));
};

function normalize(v) {
    if (getDist(v) === 0) {
        return new [0,0];
    }
    v[0] = v[0]/getDist(v);
    v[1] = v[1]/getDist(v);
    return v;
}

var chickURL = chrome.extension.getURL("images/Chicken.gif");
var linkURL = chrome.extension.getURL("images/Link.gif");
document.body.innerHTML+='<img style="position:absolute;display:none;cursor:none;" id="mycursor" src="'+linkURL+'" />';

document.onmousemove = function(e) {
    mouse_vel[0] = e.clientX-mouse_pos[0];
    mouse_vel[1] = e.clientY-mouse_pos[1];
    mouse_pos[0] = e.clientX;
    mouse_pos[1] = e.clientY;
    var cur = document.getElementById('mycursor');
    if (mouse_pos[0] > 100){
        cur.style.display = "block";
    } else {
        cur.style.display = "none";
    }
    cur.style.left = mouse_pos[0] + "px";
    cur.style.top = mouse_pos[1] + "px";

};

function Chicken(x, y, type, id) {
  this.id = id;
  if(Math.random() > 0.5){this.H = 0;} else{this.H = 1;}
  if(Math.random() > 0.5){this.V = 0;} else{this.V = 1;}
  this.x = x;
  this.y = y;
  this.height = 18;
  this.width = 18;
  this.health = 5; 
  document.body.innerHTML += '<div class="chick" id="' + this.id + '" style="-webkit-transform: scaleX(-1); position:fixed; left:' + this.x + 'px; top:' + this.y + 'px; z-index:9999999;"><img height=' + this.height+'px src="' + chickURL + '" /></div>'
  this.setHealth = function(n) {
    this.health = Math.max(0, n);
    if(this.health == 0)
    {
      alert("you just pissed me off. CHICKS ASSEMBLEEEE!");
      addAngryChicks(2);
    }
  };

  this.push = function(pos) {
    var toRtn = pos;
    //Hitting the chicken...
    var diff = new Array(mouse_pos[0] - (pos[0]+imgWidth/2), mouse_pos[1] - (pos[1]+imgHeight/2));
    var distFromMouse = getDist(diff);
  
    if(distFromMouse < hitRadius) {
      this.setHealth(this.health-1);
      toRtn[0] = (pos[0]+imgWidth/2);
      toRtn[1] = (pos[1]+imgHeight/2);
      toRtn[0] += pushRadius*(normalize(mouse_vel)[0]);
      toRtn[1] += pushRadius*(normalize(mouse_vel)[1]); 
      toRtn[0] -= imgWidth/2;
      toRtn[1] -= imgHeight/2;
    }
    return toRtn;
  };

  this.doMoveNotAngry = function() {
    var newTop = (this.y+(Math.random()-this.H)*moveSpeed);
    var newLeft = (this.x + (Math.random()-this.V)*moveSpeed);

    var btm = document.documentElement.clientHeight;
    var right = document.documentElement.clientWidth;

    if (newTop < 0){ newTop = 0; this.H = 0;}
    if (newTop > btm-this.height) {newTop = btm-this.height; this.H=1;}
    if (newLeft < 0){ newLeft = 0; this.V = 0;}
    if (newLeft > right - this.width) {newLeft = right-this.width; this.V=1;} 

    var pushPos = this.push(new Array(newLeft,newTop));
    newLeft = pushPos[0];
    newTop = pushPos[1];
    

    this.x = newLeft;
    this.y = newTop;

    var foo = document.getElementById(this.id+"");
    if (this.V == 1) {
        foo.style.webkitTransform = 'scaleX(1)';
    } else {
        foo.style.webkitTransform = 'scaleX(-1)';
    }
    foo.style.top = this.y+'px';    
    foo.style.left = this.x+'px';
  };
  this.doMoveAngry = function() {
    var newTop = (this.y+(Math.random()-this.H)*moveSpeed*5);
    var newLeft = (this.x + (Math.random()-this.V)*moveSpeed*5);

    var btm = document.documentElement.clientHeight;
    var right = document.documentElement.clientWidth;

    if (newTop < 0){ newTop = 0; this.H = 0;}
    if (newTop > btm-this.height) {newTop = btm-this.height; this.H=1;}
    if (newLeft < 0){ newLeft = 0; this.V = 0;}
    if (newLeft > right - this.width) {newLeft = right-this.width; this.V=1;} 

    var pushPos = this.push(new Array(newLeft,newTop));
    newLeft = pushPos[0];
    newTop = pushPos[1];
    

    this.x = newLeft;
    this.y = newTop;

    var foo = document.getElementById(this.id+"");
    if (this.V == 1) {
        foo.style.webkitTransform = 'scaleX(1)';
    } else {
        foo.style.webkitTransform = 'scaleX(-1)';
    }
    foo.style.top = this.y+'px';    
    foo.style.left = this.x+'px';
  };
  
  if(type === "Angry")
  {
    this.doMove = this.doMoveAngry;
  }
  else
  {
    this.doMove = this.doMoveNotAngry;
  }
  
}

function makeChicks(numChick) {
  var chicks = new Array();
  for (var i = 0; i < numChick; i++) {
    var x = Math.random()*document.documentElement.clientWidth;
    var y = Math.random()*document.documentElement.clientHeight;
    var chick = new Chicken(x, y, "NotAngry", i);
    chicks.push(chick);
  }
  return chicks;
}

function addAngryChicks(numChick)
{
  var begin = chickens.length;
  for (var i = begin; i < begin+numChick; i++)
  {
    var x = Math.random()*document.documentElement.clientWidth;
    var y = Math.random()*document.documentElement.clientHeight;
    var chick = new Chicken(x, y, "Angry", i);
    chickens.push(chick);
  }
}

function updateChicks() {
    console.log("NumChicks is " + chickens.length);
    for (var i = 0; i < chickens.length; i++) {
      chickens[i].doMove();
    }
}
var chickens = makeChicks(1);
setInterval(updateChicks, refreshTime);
//setInterval(doMove, refreshTime);

