var test = 124;

var cavasBackground = function() {
    var sky = document.getElementsByClassName('sky')[0];
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    var radius = 1400;
    var earthHeight = 260;
    var centerX = canvas.width / 2;
    var centerY = canvas.height - 260 + radius;
    var maxX = Math.floor(sky.offsetWidth + (canvas.width - sky.offsetWidth) / 2);
    var minX = Math.floor((canvas.width - sky.offsetWidth) / 2);
    var shineHeight = 16;
    var shineWidth = 10;
    var count = 0;
    var maxAlpha = 1.0;
    var stars = [];
    var meteors = [];
    var shineCount = 0;
    var image = new Image();
    image.src = '../images/star.png';

    function Meteor() {
        var l = Math.floor(Math.random() * 100 + 70);
        this.x = minX + sky.offsetWidth;
        this.y = Math.random() * canvas.height / 3 + canvas.height / 10;
        this.passed = false;
        this.vx = Math.random() * 4 + 4;
        this.vy = this.vx / 4;
        this.len = Math.sqrt(l * l);
        this.tailX = this.len;
        this.tailY = this.len / 4;
    }

    Meteor.prototype.draw = function() {
        if (this.x - this.vx <= minX) {
            this.x = minX;
            this.passed = true;
        } else {
            this.x -= this.vx;
            this.y += this.vy;
        }
        var gra = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.len);
        gra.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gra.addColorStop(1, 'rgba(0, 0, 80, 0)');
        context.save();
        context.fillStyle = gra;
        context.beginPath();
        //流星头，二分之一圆
        context.arc(this.x, this.y, 2, Math.PI / 4, 5 * Math.PI / 4);
        //绘制流星尾，三角形
        context.lineTo(this.x + this.tailX, this.y - this.tailY);
        context.closePath();
        context.fill();
        context.restore();
    }

    function getStarY(x, height) {
        return centerY -Math.sqrt(radius * radius - (centerX - x) * (centerX - x)) - height;
    }

    function redraw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function Star() {
        count++;
        var interval;
        if (count % 4 == 0) {
            interval = 720;
        } else if (count % 3 == 0) {
            interval = 540;
        } else if (count % 2 == 0) {
            interval = 360;
        } else {
            interval = 180;
        }

        this.offsetHeight = Math.random() * interval + 20;
        this.x = Math.floor(Math.random() * sky.offsetWidth + minX);
        this.y = getStarY(this.x, this.offsetHeight);
        this.size = 0.5 + (Math.random() + 0.1 / 4);
        this.shine = false;
        this.shineX = 0;
        this.shineY = 0;
        this.shineAction = 1;
        this.alpha = 0.0;
        this.maxAlpha = 0.2 + (this.y / canvas.height) * Math.random() * 0.8;
        this.alphaAction = 1;
        this.vx = Math.random() * 0.05 + 0.2;
    }

    Star.prototype.draw = function() {
        this.x = (this.x + this.vx >= maxX) ? minX : this.x + this.vx;
        this.y = getStarY(this.x, this.offsetHeight);

        if (this.shine) {
            if (this.shineAction == 1) {
                if (this.shineX + 0.05 >= shineWidth) {
                    this.shineX = shineWidth;
                    this.shineAction = -1;
                } else {
                    this.shineX += 0.05;
                }
            } else {
                if (this.shineX - 0.05 <= 0) {
                    this.shineX = 0;
                    this.shineAction = 1;
                    shineCount--;
                    this.shine = false;
                } else {
                    this.shineX -= 0.05;
                }
            }
            this.shineY = this.shineX / shineWidth * shineHeight;
            this.alpha = this.shineX / shineWidth;

            context.save();
            context.beginPath();
            context.fillStyle='rgba(255,255,0,' + this.alpha.toString() + ')';
            context.drawImage(image, this.x - this.shineX, this.y - this.shineY, this.shineX * 2, this.shineY * 2);
            context.closePath();
            context.fill();
            context.restore();
        } else {
            // 不是闪耀
            if (this.alphaAction == 1) {
                if (this.alpha < this.maxAlpha ) {
                    this.alpha += 0.005;
                } else {
                    this.alphaAction = -1;
                }
            } else {
                if (this.alpha > 0.2 ) {
                    this.alpha -= 0.002;
                } else {
                    this.alphaAction = 1;
                }
            }

            // 绘制星星
            context.beginPath();
            context.fillStyle='rgba(255, 255, 255,' + this.alpha.toString() + ')';
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true); 
            context.closePath();
            context.fill();
        }
    }

    function render() {

        redraw();

        for (var i = 0; i < meteors.length; i++) {
            if (meteors[i].passed) {
                var temp = meteors[i];
                meteors.splice(i, 1);
                temp = null;
            } else {
                meteors[i].draw();
            }
        }

        // 星星实时移动
        for (var i = 0; i < stars.length; i++) {
            stars[i].draw();
        }

        requestAnimationFrame(render);
    }

    setInterval(function() {
        if (shineCount < 3) {
            var shineStar = Math.floor(Math.random() * 300);
            if (shineStar == 300) {
                shineStar--;
            }
            stars[shineStar].shine = true;
            shineCount++;
        }
    }, 2000);

    setInterval(function() {
        if (meteors.length <= 3) {
            meteors.push(new Meteor());
        }
    }, Math.random() * 2000 + 1500);

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(fn) {
            setTimeout(fn, 17);
        };
    }

    function init() {
        for (var i = 0; i < 300; i++) {
            stars.push(new Star());
        }
    }

    init();
    render();

};

window.onload = function() {
    cavasBackground();
};