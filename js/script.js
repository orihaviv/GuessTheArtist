


// Global vars
var guessAble;
var numOfRounds = 5;
var currentArtist;
var currentScore;
var currentHints;
var round;
var total;
var attempt;
var chosenAlbums = [];//led, amy, radio, daft,gorillaz
var artistsIds = [["994656",2,10],["13125609",3,2],["657515",2,6],["5468295",6,1],["567072",3,4],["494311026",1,2],["889780", 4,19],
                    ["62852",2,6], ["487143",2,1],["121982",11,1],["909253",3,1],["136975",8,1],["35315",2,3], ["467464",2,3],
                    ["62820413",3,1],["112018",4,2], ["368183298",2,1]["365673",6,3],["5893059",2,1],["13493906",2,1]];
// Led Zeppelin, Amy Winehouse, Radiohead ,Daft Punk, Gorillaz, alt-J, Red Hot Chili Peppers,
// Jimi Hendrix, Pink Floyd, Bob Marley,Jack Johnson, The Beatles, Dr. Dre, Pearl Jam,
// Arctic Monkeys, Nirvana, Kendrick Lamar, Janis Joplin, The Black Keys, Sia


$(document).ready(function() {
    generateChosenAlbums();
    currentHints = [];
    round = -1;
    total = 0;
    nextQuestion();

//search butten
    $("#searchBtn").on("click", function() {
        if ((round <= 4) && (guessAble)) {
            var x = document.getElementById("myText").value;
            checkResult(x);
        }
    });


//enter
    $("#myText").keypress(function(event) {
        if ((event.keyCode == 13) && (round <= 4) && (guessAble)) {
            var x = document.getElementById("myText").value;
            checkResult(x);
        }
    });
});

//Choose 5 random artists
function generateChosenAlbums() {
    var marked = [];
    var flag;
    var num;
    for (var i=0; i < numOfRounds; i++) {
        flag = false;
        while(!flag) {
            num = Math.floor(Math.random() * (artistsIds.length));
            flag = true;
            for (var j=0; j < marked.length; j++) {
                if (num === marked[j]){
                    flag = false;
                }
            }
        }
        marked[i] = num;
        chosenAlbums[i] = artistsIds[num];
    }
}

//Show the correct answer and move to the next round
function nextQuestion() {
    document.getElementsByClassName("board")[0].innerHTML = null;
    if (round > -1) {
        guessAble = false;
        document.getElementById("scoreHeader").innerHTML = null;
        tag = "<h2>" + "Answer: " + currentArtist + "</h2>";
        $(".board").append(tag);

        setTimeout(function () {
            nextQustionExe();
        }, 2000);
    }
    else{
        nextQustionExe();
    }
}

//Generate the next round's question
function nextQustionExe() {
    document.getElementsByClassName("board")[0].innerHTML = null;
    updateTotal();
    if (round === 4) {
        gameOver();
    }
    else {
        round++;
        currentScore = 5;
        attempt = 0;
        $.getJSON("https://itunes.apple.com/lookup?id=" + chosenAlbums[round][0] + "&entity=album", function (data) {
            currentArtist = data["results"][0].artistName;
            currentHints[0] = data["results"][chosenAlbums[round][1]].collectionName;
            currentHints[1] = data["results"][chosenAlbums[round][2]].collectionName;
            currentHints[2] = data["results"][chosenAlbums[round][2]].artworkUrl100;
            updateScore();
            addHint();
            guessAble = true;
        });
    }
}

//Adding the next hint
function addHint() {
    var tag;
    if (attempt <= 1){
        tag = "<h4>" +"- "+currentHints[attempt] + "</h4>";
        $(".board").append(tag);
    }
    else if(attempt == 2){
        tag = "<img class='artwork' src='" + currentHints[2] + "' />";
        $(".board").append(tag);
    }
}




//Decreasing the currentScore
function decreaseScore() {
    if (currentScore == 5){currentScore = 3;}
    else if (currentScore == 3){currentScore = 1;}
    updateScore();
}

//Updating the current prize for the question
function updateScore() {
    document.getElementById("scoreHeader").innerHTML = "For "+currentScore+" points";
}

//Updating the total score of the user
function updateTotal() {
    document.getElementById("totalScoreHeader").innerHTML = "Your total score is: "+total;
}


//Announcing the end of the game
function gameOver() {
    document.getElementsByClassName("board")[0].innerHTML = null;
    document.getElementById("scoreHeader").innerHTML = null;
    tag = "<h2>" +"Game Over" + "</h2>";
    $(".board").append(tag);
}


//Checking the correctness of the user's guess
function checkResult(res) {
    document.getElementById("myText").value = null;
    if ((res != null) && (res.length > 0)) {
        if (res === currentArtist) {
            total = total + currentScore;
            updateTotal();
            nextQuestion();
        }
        else {
            if (attempt < 3) {
                attempt++;
                decreaseScore();
                addHint();
            }
            if (attempt == 3) {
                nextQuestion();
            }
        }
    }
}