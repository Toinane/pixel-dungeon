let pixelcore = {

      debug: true,
      player: {
         life: 3,
         godmode: false,
         x: 0,
         y: 0
      },
      exit: {
         x: 0,
         y: 0
      },
      ennemies: [],
      coins: [],
      grid: [
         [2, 1, 5, 1, 4, 0, 0, 3],
         [0, 1, 0, 4, 0, 1, 0, 1],
         [0, 0, 0, 1, 0, 0, 4, 0],
         [5, 1, 1, 1, 1, 0, 1, 0],
         [0, 0, 0, 0, 0, 0, 0, 0]
      ],
      level: [],


   //////////////////////////
   //  FUNCTION START      //
   //////////////////////////
   // DESC: launch game    //
   // INPUT: null          //
   // OUTPUT: boolean      //
   //////////////////////////
   start: function(){
      if(this.createlvl(this.grid)){
         if(this.debug){
            console.log('[info] DEBUG ACTIVED');
            this.showdebug();
         }
         this.listener();
         return true;
      }
      else{
         return false;
      }
   },


   /////////////////////////////
   //  FUNCTION CREATELVL     //
   /////////////////////////////
   // DESC: create table lvl  //
   // INPUT: level            //
   // OUTPUT: boolean         //
   /////////////////////////////
   createlvl: function(grid){
      let table = '', totX = 0, totY = 0;
      for(let y = 0; y < grid.length; y++){
         totX = 0; totY++;
         table += '<tr>';
         for(let x = 0; x < grid[y].length; x++){
            totX++;
            if(grid[y][x] == 1){
               table += '<td id="'+x+'-'+y+'" class="black"></td>';
            }
            else if(grid[y][x] == 2){
               table += '<td id="'+x+'-'+y+'" class="blue"></td>';
               this.player.x = x;
               this.player.y = y;
            }
            else if(grid[y][x] == 3){
               table += '<td id="'+x+'-'+y+'" class="red"></td>';
               this.exit.x = x;
               this.exit.y = y;
            }
            else if(grid[y][x] == 4){
               table += '<td id="'+x+'-'+y+'" class="green"></td>';
               this.ennemies.push([x, y]);
            }
            else if(grid[y][x] == 5){
               table += '<td id="'+x+'-'+y+'" class="yellow"></td>';
               this.coins.push([x, y]);
            }
            else{
               table += '<td id="'+x+'-'+y+'"></td>';
            }
         }
         table += '</tr>';
      }
      this.level = [totX, totY];
      document.getElementsByTagName('table')[0].innerHTML = table;
      return true;
   },


   moveplayer: function(e){
      if(e.keyCode === 38 || e.charCode === 122){ // UP Key
         if(this.canmove(this.player.x, this.player.y, 'up')){
            document.getElementById(this.player.x+'-'+this.player.y).classList.remove('blue');
            this.player.y--;
            document.getElementById(this.player.x+'-'+this.player.y).classList.add('blue');
            this.ennemiesmove();
         }
         else {
            if(this.debug){console.log('[info] Player cannot move to top.');}
            return false;
         }
      }
      else if(e.keyCode === 37 || e.charCode === 113){ // LEFT Key
         if(this.canmove(this.player.x, this.player.y, 'left')){
            document.getElementById(this.player.x+'-'+this.player.y).classList.remove('blue');
            this.player.x--;
            document.getElementById(this.player.x+'-'+this.player.y).classList.add('blue');
            this.ennemiesmove();
         }
         else {
            if(this.debug){console.log('[info] Player cannot move to left.');}
            return false;
         }
      }
      else if(e.keyCode === 39 || e.charCode === 100){ // RIGHT Key
         if(this.canmove(this.player.x, this.player.y, 'right')){
            document.getElementById(this.player.x+'-'+this.player.y).classList.remove('blue');
            this.player.x++;
            document.getElementById(this.player.x+'-'+this.player.y).classList.add('blue');
            this.ennemiesmove();
         }
         else {
            if(this.debug){console.log('[info] Player cannot move to right.');}
            return false;
         }
      }
      else if(e.keyCode === 40 || e.charCode === 115){ // DOWN Key
         if(this.canmove(this.player.x, this.player.y, 'down')){
            document.getElementById(this.player.x+'-'+this.player.y).classList.remove('blue');
            this.player.y++;
            document.getElementById(this.player.x+'-'+this.player.y).classList.add('blue');
            this.ennemiesmove();
         }
         else {
            if(this.debug){console.log('[info] Player cannot move to bottom.');}
            return false;
         }
      }
      else if(e.charCode === 118){ // DEBUG Key - V
         if(this.debug){
            this.showdebug();
         }
      }
   },


   canmove: function(x, y, dir){
      switch (dir) {
         case 'up':
            if(--y >= 0 && !document.getElementById(x+'-'+(y--)).classList.contains('black')){
               return true;
            }
            else{ return false; }
            break;
         case 'left':
            if(--x >= 0 && !document.getElementById((x--)+'-'+y).classList.contains('black')){
               return true;
            }
            else{ return false; }
            break;
         case 'right':
            if(++x < this.level[0] && !document.getElementById((x++)+'-'+y).classList.contains('black')){
               return true;
            }
            else{ return false; }
            break;
         case 'down':
            if(++y < this.level[1] && !document.getElementById(x+'-'+(y++)).classList.contains('black')){
               return true;
            }
            else{ return false; }
            break;
         default:
            return false;
      }
   },



   ennemiesmove: function(){
      for(let i = 0; i < this.ennemies.length; i++){
         let easystar = new EasyStar.js(), ennemie = this.ennemies[i];
         if(ennemie[1] == undefined){
            if(this.debug){console.error('[error] ID('+ennemie+') undefined for path');}
            return false;
         }
         easystar.setGrid(this.grid);
         easystar.setAcceptableTiles([0, 2, 3, 4, 5]);
         easystar.findPath(ennemie[0], ennemie[1], this.player.x, this.player.y, (path) => {

            if(path === null){
               if(this.debug){console.log('[info] ID('+id+') No path');}
                return false;
             }
            else{
               if(this.debug){this.showpath(ennemie, path);}
               if(path[1] != undefined){
                  document.getElementById(ennemie[0]+'-'+ennemie[1]).classList.remove('green');
                  this.ennemies[i][0] = path[1].x;
                  this.ennemies[i][1] = path[1].y;
                  document.getElementById(path[1].x+'-'+path[1].y).classList.add('green');
               }
            }
         });
         easystar.calculate();
      }
   },


   ///////////////////////////
   //  FUNCTION LISTENER    //
   ///////////////////////////
   // DESC: launch listener //
   // INPUT: null           //
   // OUTPUT: null          //
   ///////////////////////////
   listener: function(){
      document.addEventListener('keypress', (e) => this.moveplayer(e));
   },


   //////////////////////////
   //  FUNCTION SHOWPATH   //
   //////////////////////////
   // DESC: debug path     //
   // INPUT: null          //
   // OUTPUT: path & debug //
   //////////////////////////
   showpath: function(id, path){
      console.log('[info] ID('+id+') Pathfinder :');
      console.log(path);
      // for(let i = 1; i < path.length; i++){
      //    document.getElementById(path[i].x+'-'+path[i].y).classList.add('path');
      // }
   },


   //////////////////////////
   //  FUNCTION SHOWDEBUG  //
   //////////////////////////
   // DESC: show debug     //
   // INPUT: null          //
   // OUTPUT: debug        //
   //////////////////////////
   showdebug: function(){
      console.log('#############################');
      console.log('[info] Player info :');
      console.log(this.player);
      console.log('[info] Ennemies info :');
      console.log(this.ennemies);
      console.log('[info] Coins info :');
      console.log(this.coins);
      console.log('[info] Exit info :');
      console.log(this.exit);
      console.log('[info] Level info :');
      console.log(this.level);
      console.log('#############################');
   }

}

pixelcore.start();
