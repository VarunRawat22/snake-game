const board= document.querySelector(".board");
const modal= document.querySelector(".modal");
const startButton=document.querySelector(".btn-start");
const startGameModal=document.querySelector(".start-game");
const gameOverModal=document.querySelector(".game-over");
const restartButton=document.querySelector(".btn-restart");

const highScoreElemnt=document.querySelector("#high-score");
const scoreElement=document.querySelector("#score");
const timeElemnt=document.querySelector("#time");

const blockHeight=50;
const blockWidth=50;

// starting m sab 0 h
let highScore=localStorage.getItem("highScore") || 0;
let score=0;
let time=`00:00`;

highScoreElemnt.innerText=highScore;


const cols= Math.floor(board.clientWidth/ blockWidth);   /* rows=23 */
const rows= Math.floor(board.clientHeight/ blockHeight);  /* cols= 22 */

let intervalId=null;
let timerIntervalId=null;

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
};


const blocks=[];  /* stores all the block[2d array] */
let snake=[ {   /**snake ki default length h 3  issliye 3 coordinate define kr diye */
    x:1, y:3
}
]

let direction='down';

// for(let i=0; i< rows*cols;i++){   /** display k size k hisab se J.S apne aap blocks add kr dega */
//     const block= document.createElement('div');  /* J.S se hi block design kr diya*/
//     block.classList.add("block"); /* block element ko block class dedi taki css apply kr sake */
//     board.appendChild(block); 
// }

for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){
        const block= document.createElement('div');  /* J.S se hi block design kr diya*/
        block.classList.add("block"); /* block element ko block class dedi taki css apply kr sake */
        board.appendChild(block);
        // block.innerText=`${col},${row}` /* shows coordinates of each block */
        blocks[`${row}-${col}`]= block;   /*  "-" iska use krke stote hua h => {x-y} */
    }
}

function renderSnake(){
     let head=null;

    blocks[`${food.x}-${food.y}`].classList.add("food");
     
    if(direction==="left"){
        head={x: snake[0].x, y:snake[0].y-1} /* since ham left dxn m move kr rhe h toh y coordinate 1 se dec. hoga */
    }else if(direction==="right"){
        head={x: snake[0].x, y:snake[0].y+1}
    }else if(direction==="down"){
        head={x: snake[0].x+1, y:snake[0].y}
    }else if(direction==="up"){
        head={x: snake[0].x-1, y:snake[0].y}
    }
    //wall collision LOGIC
    if(head.x<0 || head.x>=rows || head.y<0 || head.y >= cols){
        // alert("Game Over");
        clearInterval(intervalId);
        modal.style.display="flex";
        startGameModal.style.display="none";
        gameOverModal.style.display="flex";
        return;
    }
    //food consume LOGIC
    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        //respawn the food by re initialising the food coordinates
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
            }
        blocks[`${food.x}-${food.y}`].classList.add("food");

        snake.unshift(head); /* food consume krte hi length inc krne k liye head add kr diya */
        // food consume hone k baad score will increase  [1 food consume will give 10 pts]
        score+=10;  
        scoreElement.innerText=score;

        // high score logic
        if(score>highScore){
            highScore=score;
            localStorage.setItem("highScore",highScore.toString());  /* storing highscore in local el. localstorage m data is stored in string format  see in applications in console */
            highScoreElemnt.innerText = highScore;

        }

    }

    snake.forEach(segment=>{   /* ab snake k harr ek element ko treaverse krenge */
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
        })
        
        snake.unshift(head);  /* left dxn k coordinate append kra diya taki snake aage move kre */
        snake.pop();  /* last el ko pop kr diya taki aage move kre toh last se len dec ho */

    snake.forEach(segment=>{   /* ab snake k harr ek element ko treaverse krenge */
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })  
}

// intervalId= setInterval(()=>{
//     renderSnake()
// },200)


startButton.addEventListener("click", (event) => {
    modal.style.display = "none";

    intervalId = setInterval(() => {
        renderSnake();
    }, 200);

    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split(":").map(Number);  // <<--- FIXED

        if (sec === 59) {
            min++;
            sec = 0;
        } else {
            sec++;
        }

        time = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`; // <<--- FIXED
        timeElemnt.innerText = time;  // <<--- SUPER IMPORTANT
    }, 1000);
});


restartButton.addEventListener("click",restartGame)

function restartGame(){
    // current food ko remove kr rhe h
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    // marne k baad snake ko b remove krna h
    snake.forEach(segment=>{   /* ab snake k harr ek element ko treaverse krenge */
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });
    direction="down";
    score=0;
    time=`00-00`;
    scoreElement.innerText=score;
    timeElemnt.innerText=time;
    highScoreElemnt.innerText=highScore;

    modal.style.display="none";
    //recalculate the sankes position
    snake=[{x:1, y:3}];
    // recalculate the food position
    food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
    };
    // restart the loop
    intervalId=setInterval(()=>{
        renderSnake();
    },300);
}



// ab ek eventListner add krenge jo b user arrow key press krega uske acc. dxn change ho jaye

addEventListener("keydown", (event) => {
    switch(event.key) {
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;
        case "ArrowRight":
            direction = "right";
            break;
        case "ArrowLeft":
            direction = "left";
            break;
    }
});