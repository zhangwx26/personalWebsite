// 此方式不太准确
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

// 实现promise
var WAITING = 0,
    SUCCESS = 1,
    FAIL = 2;

function MyPromise(fn) {

    // 定义状态变量
    var state = WAITING;

    var taskArr = [];
    
    // 解决之后，应该怎么处理
    function success(result) {
        state = SUCCESS;
        taskArr.forEach(handle);
        taskArr = null;
    }

    function reject(result) {
        state = FAIL;
        taskArr.forEach(handle);
        taskArr = null;
    }

    function resolve(result) {
        if (result) {
            if (typeof result === 'object') {
                result.then.call(result, resolve, reject);
            } else {
                success(result);
            }
        } else {
            success();
        }
    }

    // 新建MyPromise对象之后就理科运行参数函数fn
    fn(resolve, reject);

    function handle(task) {
        if (state == WAITING) {
            taskArr.push(task);
        } else {
            if (state == SUCCESS) {
                task.onSuccess();
            } else {
                task.onFail();
            }
        }
    }

    this.done = function(onSuccess, onFail) {
        handle({
            onSuccess: onSuccess,
            onFail: onFail
        });
    }

    this.then = function(onSuccess, onFail) {
        var self = this;
        if (typeof onSuccess == 'function') {
            return new MyPromise(function(res, rej) {
                return self.done(
                function(result) {
                    res(onSuccess());
                }, function(error) {
                    onFail();
                });
            });
        }
    };
}

var reset = function(params) {
    params.x0 = 0;
    params.y0 = 0;
    params.x1 = 500;
    params.y1 = 500;
    params.monsterX = 50;
    params.wallHole = 200;
    params.wallHoleUp = 150;
    params.width = 600;
    params.height = 530;
    params.hit = false;
    params.left = false;
    params.fall = false;
    params.scope = 0;
    params.move = false;
}

var updateScope = function(scope) {
    var scopeText = document.querySelector('.description');
    var str = '您当前已过' + scope + '关！';
    scopeText.innerText = str;
}

// 画笔，x坐标值，是否面向左，角度
var drawMonster = function(ctx, X, left, ang) {
    ctx.beginPath();
    if (left) {
        ctx.arc(X, 480, 20, Math.PI - ang, Math.PI + ang, true);
    } else {
        ctx.arc(X, 480, 20, ang, 2 * Math.PI - ang, false);
    }
    ctx.lineTo(X, 480);
    ctx.closePath();
    ctx.fillStyle = '#ff8000';
    ctx.fill();
}

var drawFloor = function(ctx, width, height) {
    ctx.fillStyle = "#403737";
    ctx.fillRect(0, height - 30, width, 30);
}

var drawWall = function(ctx, params, ang, tranX) {
    ctx.save();
    ctx.fillStyle = "#403737";
    ctx.translate(params.x1, params.y1);
    ctx.rotate(ang);
    ctx.translate(-params.x1, -params.y1);
    ctx.translate(tranX, 0);
    ctx.fillRect(params.width - 100, 0, 10, params.wallHoleUp);
    ctx.fillRect(params.width - 100, params.wallHole + params.wallHoleUp, 10, params.height - params.wallHole - params.wallHoleUp - 30);
    ctx.restore();
}

var drawFood = function(ctx, height, tranX) {
    ctx.save();
    ctx.translate(tranX, 0);
    ctx.beginPath();
    ctx.arc(555, height - 45, 5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.restore();
}

var initFrame = function(ctx, params) {
    ctx.clearRect(0, 0, 600, 500)
    // draw monster
    drawMonster(ctx, params.monsterX, params.left, Math.PI / 6)

    // draw floor
    drawFloor(ctx, params.width, params.height);

    // draw wall
    drawWall(ctx, params, 0, 0);

    // draw food
    drawFood(ctx, params.height, 0);
    
}

var monsterMove = function(ctx, params) {
    var speed = 3;
    if (params.left) {
        if (params.monsterX - speed <= 20) {
            params.monsterX = 20;
            ctx.clearRect(0, 0, 500, 500);
            drawMonster(ctx, params.monsterX, params.left, Math.PI / 6);
            params.left = false;
        } else {
            params.monsterX -= speed;
            ctx.clearRect(0, 0, 500, 500);
            drawMonster(ctx, params.monsterX, params.left, Math.PI / 6);
        }
    } else {
        if (params.monsterX + speed >= 480) {
            params.monsterX = 480;
            ctx.clearRect(0, 0, 500, 500);
            drawMonster(ctx, params.monsterX, params.left, Math.PI / 6);
            params.left = true;
        } else {
            params.monsterX += speed;
            ctx.clearRect(0, 0, 500, 500);
            drawMonster(ctx, params.monsterX, params.left, Math.PI / 6);
        }
    }
}

var eat = function(ctx, params) {
    ctx.clearRect(0, 0, 600, 500);
    drawMonster(ctx, params.monsterX, params.left, 0);
}

var moveToStart = function(ctx, params, callback) {
    var speed = 14;
    var temp = 140;
    var hole = Math.ceil(Math.random() * temp) + temp - params.scope - 70;
    var holeUp = Math.ceil(Math.random() * 300);
    params.wallHole = hole;
    params.wallHoleUp = holeUp;
    var timer = setInterval(function() {
        if (params.monsterX - speed <= 50) {
            params.monsterX = 50;
            ctx.clearRect(0, 0, 600, 500);
            drawMonster(ctx, params.monsterX, params.left, Math.PI / 6);
            drawFood(ctx, params.height, params.monsterX - 50);
            drawWall(ctx, params, 0, params.monsterX - 50);
            callback();
            clearInterval(timer);
        } else {
            params.monsterX -= speed;
            ctx.clearRect(0, 0, 600, 500);
            drawMonster(ctx, params.monsterX, params.left, Math.PI / 6);
            drawFood(ctx, params.height, params.monsterX - 50);
            drawWall(ctx, params, 0, params.monsterX - 50);
        }
    }, 30);
}

var moveToFood = function(ctx, params, callback) {
    params.left = false;
    var speed = 7;
    var timer = setInterval(function() {
        if (params.monsterX + speed >= 545) {
            params.monsterX = 545;
            ctx.clearRect(0, 0, 600, 500);
            drawMonster(ctx, params.monsterX, params.left, Math.PI / 6);
            drawFood(ctx, params.height, 0);
            callback();
            clearInterval(timer);
        } else {
            params.monsterX += speed;
            ctx.clearRect(0, 0, 600, 500);
            drawMonster(ctx, params.monsterX, params.left, Math.PI / 6);
            drawFood(ctx, params.height, 0);
        }
    }, 30);
}

var gameOver = function(ctx, params) {
    if (confirm("游戏结束！重新开始？")) {
        reset(params);
        updateScope(params.scope);
        initFrame(ctx, params);
    } else {
        window.top.close();
    }
}

var fall = function(ctx, params, callback) {
    var len = Math.sqrt(20 * 20 + Math.pow(500 - params.monsterX, 2)) - 20;
    var safeLen = params.height - params.wallHoleUp - params.wallHole - 30;
    
    var ang = 0;
    var speed = 0.01;
    var maxAng;
    if (len >= safeLen && len + 40 <= safeLen + params.wallHole) {
        maxAng = Math.PI / 2;
    } else {
        maxAng = Math.asin(20 / (len + 20)) * 2;
        maxAng = Math.PI / 2 - maxAng;
        // console.log(maxAng);
    }

    var timer = setInterval(function() {
        if (ang + speed >= maxAng) {
            ang = maxAng;
            // console.log(ang);
            ctx.clearRect(0, 0, 510, 500);
            drawMonster(ctx, params.monsterX, params.left, Math.PI / 6);
            drawWall(ctx, params, -ang, 0);
            clearInterval(timer);
            if (maxAng == Math.PI / 2) {
                var p = new MyPromise(function(resolve, reject) {
                    setTimeout(function() {
                        moveToFood(ctx, params, resolve);
                    }, 200);
                });
                p.then(function() {
                    return new MyPromise(function(resolve, reject) {
                        eat(ctx, params);
                        resolve();
                    });
                })
                .then(function() {
                    return new MyPromise(function(resolve, reject) {
                        setTimeout(function() {
                            moveToStart(ctx, params, resolve);
                        }, 200);
                    });
                })
                .then(function() {
                    params.scope += 1;
                    updateScope(params.scope);
                    params.fall = false;
                    params.move = false;
                });
                

            } else {
                setTimeout(function() {
                    gameOver(ctx, params);
                }, 500);
            }
        } else {
            ang += speed;
            speed += 0.02;
            ctx.clearRect(0, 0, 510, 500);
            drawMonster(ctx, params.monsterX, params.left, Math.PI / 6);
            drawWall(ctx, params, -ang, 0);
        }
    }, 50);

}

var loop = function(ctx, params) {
    if (IsPC()) {
        var interval;
        document.onkeypress = function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 32 && params.fall == false && params.move == false) {
                params.move = true;
                interval = setInterval(function() {
                    monsterMove(ctx, params);
                }, 30);
            }
        }

        document.onkeyup = function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 32 && params.fall == false) {
                params.fall = true;
                clearInterval(interval);
                // 墙倒，完毕后设置params.fall = false
                setTimeout(function() {
                    fall(ctx, params);
                }, 200);
            }
        }

    } else {
        var body = document.getElementsByTagName('html')[0];
        var timer;
        body.addEventListener('touchstart', function(event) {
            event.preventDefault()
            if (params.fall == false) {
                timer = setInterval(function() {
                    monsterMove(ctx, params);
                }, 30);
            }
        });
        body.addEventListener('touchend', function(event) {
            if (params.fall == false) {
                clearInterval(timer);
                params.fall = true;

                setTimeout(function() {
                    fall(ctx, params);
                }, 200);
            }
        });
    }
}

var init = function() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    var params = {}
    reset(params);

    initFrame(ctx, params);
    loop(ctx, params);
}

window.onload = function() {
    init();
}
