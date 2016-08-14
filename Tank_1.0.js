/*Tank
*Author: John Marlett
*github:  https://github/jmarlett93/Tank/
*This is a versatile Tank battle simulator that demonstrates functional javascript and 
*tells the story of how a few tanks battle each other on a 2D gridded board
*/

function playTank(){
    /** Gameplay Architecture **/
    /*After initializing a gameboard and tanks, gameengine adds tiles with tanks in occupiedField to it's occupiedTiles arr. To execute moves
    the, gameengine asks occupiedTiles for moves, gets new Tiles by position, adds the tanks to the new tile, and deletes old Tile.*/
    /*start up tasks*/

    var gameboard = boardConstructor(5,5);
    var gametimer = true;    
    var occupiedTiles = [];

    //gen Tanks + positions and pass tank objects to the "occupiedField" of the tiles
    setupTanks();
    
    while(gametimer) {
        checkTiles(); 
        console.log(occupiedTiles);
        gametimer = false;
    }

    function setupTanks(){
         //returns an array of random occupied tiles by reading a database of unique tank stats and calling tankConstructor    
         var tankData = tankDataStorage();      
            /*Bug!!!  it adds multiple instances of an tile if randTile gets the same one */
         for(var i = 0; i < tankData.tankDatabase.length ; i++){
            var initPos = gameboard.randTilePos();
            var elem = tankData.tankDatabase[i].split(' ');
            var tempTank = tankConstructor( elem[0] , Number(elem[1]) , Number(elem[2]), Number(elem[3]), Number(elem[4]), initPos);
            if( compareTilesByCoord(initPos).length != 0){
                //add to correct occupiedTile here
            console.log("baloney");
            }else{
            var initTile = gameboard.getTileByCoordinate(initPos);
            initTile.occupiedField.push(tempTank);
            occupiedTiles.push(initTile); }
         }
    }//end setup tanks

    function compareTilesByCoord(coord){
        return occupiedTiles.filter(validateWithCoordinate);
        function validateWithCoordinate(elem) {
            return (elem.position[0] === coord[0] && elem.position[1] === coord[1]);
            }
    }

    function checkTiles(){
        if(occupiedTiles.length > 1){
            return gametimer = true;
        }else{
            return gametimer = false;
        }
    }

//we need to loop through occupiedTiles, read new moves from randPos() and push Tank to occupiedField of destination Tile, then push destination tile to occupiedTiles
    function moveTanks(){
        var tempArray = [];
        for (var i = 0; i < occupiedTiles.length ; i++){
            var newPos = occupiedTiles[i].randMove();
            var destinationTile = getTileByCoordinate(newPos);
            destinationTile.occupiedField.push(occupiedTiles[i].giveTankFromField());
            occupiedTiles.splice(1, i, destinationTile);
        }

    }
/*Game play tasks*/

//ask the occupiedTiles array for new moves

//pass the tanks to the new occupiedField

//add the new occupied tiles to occupiedTiles

//ask if there are more than one tank with value isAlive = true in the occupiedField of each occupiedTile.tile

//resolve the battles

// add battle markers to the Board's visualization map.

/*end Game play tasks*/

}//end function playTank

function tankDataStorage(){
 
        var tankDatabase = ["Sherman 12 vroom 5 7", "Churchill 8 rumble 9 9", "Tiger 7 roar 10 10", "T-34 12 screech 6 6" ]; 
        var names = tabData();
    
        return {
            tankDatabase: tankDatabase,
            names: names
        }
        function tabData(){
        //Searches database and adds strings of the names\
        //(first item of each database string) into another array
            var tankNames = [];
            for(var i = 0; i < tankDatabase.length ; i++){
                var elem = tankDatabase[i].split(' ');
                tankNames.push(elem[0]);
            }
        return tankNames;
        }                        
    }

 function tankConstructor(name, speed, engineNoise, armor, gun, tankPos){

    var isAlive = true;
    return {
             name: name,
             speed: speed,
             engineNoise: engineNoise,
             armor: armor,
             gun: gun,
             isAlive: isAlive,
             tankPos: tankPos,
             rev: rev,
             engineDamage: engineDamage,
         };

    ///this method is just to be funny
    function rev() {
    console.log(engineNoise);
        if(engineDamage() < 10){
            console.log("puttputt");
        } else {
        console.log("BOOM! " + name + "'s engine has overheated and vehicle is destroyed");
        isAlive = false}
    }
    
    function engineDamage() {
    return Math.floor(Math.random() * 10 + 1);
    }

 } //end of tank constructor
 
 // defines a gameboard object containing an x,y position and possible movements.
function tileConstructor (position, maxCoords) {
    
    //var id = id;
    var moveNorth = [];
    var moveSouth = [];
    var moveEast = [];
    var moveWest = [];
    var occupiedField = [];

    createMoves();
    
    return {
            position: position,
            moveNorth: moveNorth,
            moveSouth: moveSouth,
            moveEast: moveEast,
            moveWest: moveWest,
            occupiedField: occupiedField,
            randMove: randMove,
            giveTankFromField: giveTankFromField,
            givePos: givePos
      };
    
    function randMove(){
        var rand = Math.floor(Math.random() * 4);
        
        if(rand == 0){
            return moveNorth;
        }
         if(rand == 1){
            return moveSouth;
        }
         if(rand == 2){
            return moveEast;
        }
         if(rand == 3){
            return moveWest;
        }
    }

    function giveTankFromField(){
        elem = occupiedField[0];
        occupiedField.splice(0,1);
        return elem;
    }
    
    function givePos() { return position; }
    
    /* generates the coordinates of adjacent tiles. And assigns the same coord if move is off the grid*/
    function createMoves(){
        if (position[1] == maxCoords[1]){
            moveNorth = position ;
        } else {
            moveNorth = [position[0], position[1] + 1];
            }  
        if (position[1] == 1){
            moveSouth = position; 
        } else {
            moveSouth = [position[0], position[1] - 1];
            }
        if (position[0] == 1){   
            moveEast = position;
        } else {
            moveEast = [position[0] - 1, position[1]];
                }
         if (position[0] == maxCoords[0]){
            moveWest = position ;
        } else {
            moveWest = [position[0] + 1, position[1]];
            }
            return moveNorth, moveSouth, moveEast, moveWest;
        }
  
    }  // end of tiles class
 
function boardConstructor (xparam, yparam){
    
    var tiles = generateTiles();
    
    return {
    tiles: tiles,
    getTileByCoordinate: getTileByCoordinate,
    randTilePos: randTilePos
    };
    
    function generateTiles() {
    //adds objects representing each member of the array and its attributes
        var tempTiles = [];
        var id = 0;
        for (var i = 0 ; i < yparam; i++ ) {
            //set up the number of Y iterations because it is the same number by row
            for (var j = 0 ; j < xparam ; j++ ) {  //loop through X and create arrays with x numbers
                id = id + 1;
                var elem = tileConstructor( [j+1 , i+1],[xparam, yparam]);
                tempTiles.push(elem);
                }
         }
    return tempTiles;
    }
    
    function getTileByCoordinate(coord) {
        arr = tiles.filter(validateWithCoordinate);
        return arr[0];
        function validateWithCoordinate(elem) {
            return (elem.position[0] === coord[0] && elem.position[1] === coord[1]);
            }
        }
   function randTilePos(){
        var x = tiles[Math.floor(Math.random() * ( xparam * yparam))];
        return x.position;
   }
}//end board constructor

playTank();