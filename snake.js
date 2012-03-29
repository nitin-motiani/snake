var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
var movement_speed = 25;
var now;
var then;

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "background.jpg";


var snake = 
{
    speed : {x : 0, y : 0},  
    head : {x : 0, y : 0}, 
    tail : {x : 0, y : 0}, 
    turns : [], 
    length : 0
};
var food = {
    x : 0, 
    y : 0
};

var keysDown = {};
addEventListener ("keydown", function (e) {
            keysDown[e.keyCode] = true;
        }, false);
/*addEventListener ("keyup", function (e) {
            delete keysDown[e.keyCode];
        }, false);*/



var reset_snake = function() {
    snake.head.x = canvas.width/2;
    snake.head.y = canvas.height/2;
    snake.length = 100;
    snake.tail.x = snake.head.x - snake.length;
    snake.tail.y = snake.head.y;
    snake.turns = [];
    snake.speed.x = movement_speed;
    snake.speed.y = 0;
};

var create_food = function() {
    food.x = 32 + (Math.random() * (canvas.width - 64));
    food.y = 32 + (Math.random() * (canvas.height - 64));
};


var get_distance = function (x1, y1, x2, y2)
{
    var distance = ((x2 - x1) + (y2 - y1));     //as we'll make the call, only when both have same x or same y...
    return Math.abs(distance);
};


var get_new_position = function(time)
{
    snake.head.x += snake.speed.x*time;
    snake.head.y += snake.speed.y*time;
   
    if(snake.speed.x !== 0 || snake.speed.y !== 0)
    {
        //console.log("new head coordinates are " + snake.head.x + " "
                    //+ snake.head.y);
    }

    var no_of_turns = snake.turns.length;

    var first_end = snake.head;
    var second_end;
    var remaining_length = snake.length;


    var turn_no;

    for (turn_no = no_of_turns - 1; turn_no >= 0; turn_no--)
    {
        //console.log("remaining_length is " + remaining_length);
        //console.log("total length is " + snake.length);

        second_end = snake.turns[turn_no];
        //var dist = get_distance(first_end.x, first_end.y,
                                //second_end.x, first_end.y);   //how? how?? how???

        var dist = get_distance(first_end.x, first_end.y, second_end.x, second_end.y)
        if(dist >= remaining_length)
        {
            break;
        }
        else
        {
            remaining_length -= dist;
        }
        first_end = second_end;
    }

    if (turn_no < 0)
    {
        second_end = snake.tail;
    }
    if (first_end.x === second_end.x)
    {
        if (second_end.y < first_end.y)
        {
            snake.tail.y = first_end.y - remaining_length;
        }
        else 
        {
            snake.tail.y = first_end.y + remaining_length;
        }
        snake.tail.x = first_end.x;     //added later, to avoid any problem
    }
    if (first_end.y === second_end.y)
    {
        if (second_end.x < first_end.x)
        {
            snake.tail.x = first_end.x - remaining_length;
        }
        else
        {
            snake.tail.x = first_end.x + remaining_length;
        }
        snake.tail.y = first_end.y;     //added later, to avoid any problem
    }
    if (turn_no >= 0)
    {
        snake.turns.splice(0, turn_no + 1);
    }

};

var update = function () {
    
    if (38 in keysDown) 
    {
        //console.log("up key pressed");
        if (snake.speed.y === 0)
        {
            //console.log("now I try to move it to my up");
            snake.speed.x = 0;
            snake.speed.y = -movement_speed;
            //console.log("pushing turn to array");
            snake.turns.push({x : snake.head.x, y : snake.head.y});
            //console.log("after pushing length is " + snake.turns.length);
           // console.log("after this speed is " + snake.speed.x + " "
                            //+ snake.speed.y);
        }
        delete keysDown[38];

    }
    if (40 in keysDown) 
    {
        //console.log("down key pressed");
        if (snake.speed.y === 0)
        {
            //console.log("now I try to move it to my down");
            snake.speed.x = 0;
            snake.speed.y = movement_speed;
            snake.turns.push({x : snake.head.x, y : snake.head.y});
            //console.log("after this speed is " + snake.speed.x + " "
                            //+ snake.speed.y);

        }
        delete keysDown[40];
    }
    if (37 in keysDown) 
    {
        //console.log("left key pressed");
        if (snake.speed.x === 0)
        {
            //console.log("now I try to move it to my left");
            snake.speed.y = 0;
            snake.speed.x = -movement_speed;
            snake.turns.push({x : snake.head.x, y : snake.head.y});
            //console.log("after this speed is " + snake.speed.x + " "
                            //+ snake.speed.y);

        }
        delete keysDown[37];
    }
    if (39 in keysDown) 
    {
        if (snake.speed.x === 0)
        {
            //console.log("now I try to move it to my right");
            //console.log("right key pressed");
            snake.speed.y = 0;
            snake.speed.x = movement_speed;
            snake.turns.push({x : snake.head.x, y : snake.head.y});
            //console.log("after this speed is " + snake.speed.x + " "
                            //+ snake.speed.y);

        }
        delete keysDown[39];
    }

};

var lines_intersect = function (first_end1, second_end1, first_end2, second_end2)
{
    var x_dir1 = false;
    var y_dir1 = false;
    var x_dir2 = false;
    var y_dir2 = false;

    
    if(first_end1.x === second_end1.x)
    {
        x_dir1 = true;
    }
    if(first_end2.x === second_end2.x)
    {
        x_dir2 = true;
    }

    if(first_end1.y === second_end1.y)
    {
        y_dir1 = true;
    }
    if(first_end2.y === second_end2.y)
    {
        y_dir2 = true;
    }

    if((x_dir1 && x_dir2)
        || (y_dir1 && y_dir2))
    {
        if (point_on_segment (first_end1, second_end1,
                                first_end2)
            || point_on_segment(first_end1, second_end1,
                                second_end2))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        var common_x;
        var common_y;
        var min_x;
        var min_y;
        var max_x;
        var max_y;
        
        if(x_dir1 && y_dir2)
        {
            common_x = first_end1.x;
            common_y = first_end2.y;

            if (first_end1.y < second_end1.y)
            {
                min_y = first_end1.y;
                max_y = second_end1.y
            }
            else
            {
                min_y = second_end1.y;
                max_y = first_end1.y
            }

            if (first_end2.x < second_end2.x)
            {
                min_x = first_end2.x;
                max_x = second_end2.x
            }
            else
            {
                min_x = second_end2.x;
                max_x = first_end2.x
            }
        }
        if(x_dir2 && y_dir1)
        {
            common_x = first_end2.x;
            common_y = first_end1.y;

            if (first_end2.y < second_end1.y)
            {
                min_y = first_end2.y;
                max_y = second_end2.y
            }
            else
            {
                min_y = second_end2.y;
                max_y = first_end2.y
            }

            if (first_end1.x < second_end1.x)
            {
                min_x = first_end1.x;
                max_x = second_end1.x
            }
            else
            {
                min_x = second_end1.x;
                max_x = first_end1.x
            }
        }

        var x_lies_in_between = (common_x <= max_x && common_x >= min_x);
        var y_lies_in_between = (common_y <= max_y && common_y >= min_y);

        return (x_lies_in_between && y_lies_in_between);
    }
    
};

var point_on_segment = function(first_end, second_end, point) {
    if (first_end.x === second_end.x)
    {
        if (point.x !== first_end.x)
        {
            return false;
        }
        if (first_end.y < second_end.y
            && point.y <= second_end.y
            && point.y >= first_end.y)
        {
            console.log("i am gonna return true");
            return true;
        }
        if (first_end.y >= second_end.y
            && point.y >= second_end.y 
            && point.y <= first_end.y)
        {
            console.log("i am gonna return true");
            return true;
        }
       return false;
    }
    if (first_end.y === second_end.y)
    {
        if (point.y !== first_end.y)
        {
            return false;
        }
        if (first_end.x < second_end.x
            && point.x <= second_end.x
            && point.x >= first_end.x)
        {
            console.log("i am gonna return true");
            return true;
        }
        if (first_end.x >= second_end.x
            && point.x >= second_end.x 
            && point.x <= first_end.x)
        {
            console.log("i am gonna return true");
            return true;
        }
       return false;
    }
};

//a bit of overkill, I think
/*var can_eat = function() {
    
    var first_end = snake.head;
    var second_end; 

    var no_of_turns = snake.turns.length;
    var turn_no;
    for(turn_no = no_of_turns - 1; turn_no >= 0; turn_no--)
    {
        second_end = snake.turns[turn_no];
        if (point_on_segment(first_end, second_end, food))
        {
            return true;
        }
        first_end = second_end;
    }
    
    second_end = snake.tail;
    if(point_on_segment(first_end, second_end, food))
    {
        return true;
    }

    return false;
};*/

var can_eat = function() {
    if (snake.head.x >= food.x && snake.head.x <= food.x + 3
        && snake.head.y >= food.y && snake.head.y <= food.y + 3)
    {
        return true;
    }
    return false;
}

//a real pain in the ass.
var collide_with_itself = function() {
    console.log("I'm in collide");
    //console.log("My head is at " + snake.head.x + ", " + snake.head.y);
    var first_end;
    var second_end;
    var turn_no;
    var no_of_turns = snake.turns.length;
    //console.log("No. of turns are " + no_of_turns);
    if (no_of_turns < 3)            // i guess it's correct... because minimum 3 turns should be there for a collision
    {
        return false;
    }
    if(no_of_turns === 4)
    {
        console.log("My head is at " + snake.head.x + ", " + snake.head.y);
    }

    for(turn_no = no_of_turns - 2; turn_no > 0; turn_no--)
    {
        first_end = snake.turns[turn_no];
        second_end = snake.turns[turn_no - 1];
        if(no_of_turns == 4)
        {
            console.log("First end is " + first_end.x + ", " + first_end.y);
            console.log("Second end is " + second_end.x + ", " + second_end.y);
        }
        //if(point_on_segment(first_end, second_end, 
                                //snake.head))
        if(lines_intersect (first_end, second_end, snake.head, snake.turns[no_of_turns - 1]))
        {
            return true;
        }
        first_end = second_end;
    }
    
    second_end = snake.tail;
    if(no_of_turns == 4)
    {
        console.log("First end is " + first_end.x + ", " + first_end.y);
        console.log("Second end is " + second_end.x + ", " + second_end.y);
    }
   // if(point_on_segment(first_end, second_end, 
                                //snake.head))
    if(lines_intersect (first_end, second_end, snake.head, snake.turns[no_of_turns - 1]))
    {
        return true;
    }
    return false;
};

var collide_with_wall = function() {
    if (snake.head.x <= 0 ||  snake.head.x >= canvas.width
        || snake.head.y <= 0 || snake.head.y >= canvas.height)
    {
        return true;
    }
    return false;       //don't forget this
};

var render = function() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    
    ctx.fillStyle = "rgb(250, 250, 250)";
	/*ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	ctx.fillText("Lives Remaining : " + noOfLives, 64, 64);*/
    var first_end = snake.head;
    var second_end;
    var no_of_turns = snake.turns.length;
    if(no_of_turns !== 0)
    {
        //console.log("number of turns " + no_of_turns);
    }
    var turn_no;
    for(turn_no = no_of_turns - 1; turn_no >= 0; turn_no--)
    {
        second_end = snake.turns[turn_no];
        if(first_end.x === second_end.x)
        {
            ctx.beginPath();
            ctx.moveTo(first_end.x + 0.5, first_end.y);
            ctx.lineTo(second_end.x + 0.5, second_end.y);
            ctx.strokeStyle = "#eee";
            ctx.closePath();
            ctx.stroke();
        }
        else if(first_end.y === second_end.y)
        {
            ctx.beginPath();
            ctx.moveTo(first_end.x, first_end.y + 0.5);
            ctx.lineTo(second_end.x, second_end.y + 0.5);
            ctx.strokeStyle = "#eee";
            ctx.closePath();
            ctx.stroke();
        }
        first_end = second_end;
    }
    second_end = snake.tail;
    if(first_end.x === second_end.x)
    {
        ctx.beginPath();
        ctx.moveTo(first_end.x + 0.5, first_end.y);
        ctx.lineTo(second_end.x + 0.5, second_end.y);
        ctx.strokeStyle = "#eee";
        ctx.closePath();
        ctx.stroke();
    }
    if(first_end.y === second_end.y)
    {
        ctx.beginPath();
        ctx.moveTo(first_end.x, first_end.y + 0.5);
        ctx.lineTo(second_end.x, second_end.y + 0.5);
        ctx.strokeStyle = "#eee";
        ctx.closePath();
        ctx.stroke();
    }

    ctx.fillRect(food.x, food.y, 3, 3);
    /*ctx.strokeStyle = "#eee";
    ctx.stroke();*/
};


var main = function() {
    now = Date.now();
    var delta = now - then;
    update ();
    get_new_position(delta/1000);
    
    //stupid me, forgot to put parantheses to invoke the function... he ram
    if(collide_with_itself() )
    {
        console.log("i collided");
        reset_snake();
    }
    if(collide_with_wall())
    {
        console.log("i collided with wall");
        console.log("x " + snake.head.x + "y " + snake.head.y);
        reset_snake();
    }

    if(can_eat())
    {
        console.log("ate the food");
        //snake.head.x += snake.speed.x*50;
        //snake.head.y += snake.speed.y*50;             //how, how, how??? such a stupid mistake... x-(

        //snake.head.x += 50
        //snake.head.y += 50                    //this will cause n shitty stuff

        snake.head.x += snake.speed.x*2;
        snake.head.y += snake.speed.y*2;
        snake.length += movement_speed*2;

        create_food();
        console.log("new length : " + snake.length);
    }
    render();
    then = now;
};

reset_snake();
create_food();
then = Date.now(); 
setInterval(main, 1);
