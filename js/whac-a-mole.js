(function() {
	var handle;
	$(function() {
		var str = "";
		for (var i = 0; i < 60; i++) {
			str += '<li class="fl"><div class="cycle"></div></li>';
		}
		$('.mole-father:first').html(str);
		whacAMole();
	});

	// 主函数
	var whacAMole = function() {
		var allArgs = new Object();
		resetArgs(allArgs);
		for (var i = 0; i < 60; i++) {
			$('li:eq(' + i + ')').click(click_(allArgs, i));
		}
		$('.start:first').click(startOrStop(allArgs));
		$('.game-over:first').click(over(allArgs));
	}

	// 重置参数
	var resetArgs = function(allArgs) {
		allArgs.now = allArgs.turn = 0;
		allArgs.isOn = allArgs.isStop = false;
		allArgs.countScore = allArgs.countTime = 0;
		allArgs.hit = allArgs.miss = 0;
		allArgs.timer = 0;
	}

	// 停止计时
	var stopTime = function(allArgs) {
		allArgs.isStop = true;
		if (allArgs.timer != null)
			clearTimeout(allArgs.timer);
	}

	// 更新时间
	var updateTime = function(allArgs) {
		allArgs.countTime++;
		if (allArgs.countTime >= 30) {
			overGame(allArgs);
		} else {
			$('.time:first').text(allArgs.countTime + '');
			allArgs.timer = setTimeout(function() {
				updateTime(allArgs);
			}, 1000);
		}
	}

	// 游戏结束
	var overGame = function(allArgs) {
		clearTimeout(handle);
		alert("hit:" + allArgs.hit + "\r" + "miss:" + allArgs.miss + "\r" + "time:" + allArgs.countTime);
		$('li:eq(' + allArgs.now + ')').css('background-color', '#fff').children('div:first').css('display', 'none');
		$('.time:first').text('0');
		$('.score:first').text('0');
		stopTime(allArgs);
		resetArgs(allArgs);
	}

	// 开始游戏
	var displayMole = function(allArgs) {
		while (allArgs.turn == allArgs.now)
			allArgs.turn = parseInt(60 * Math.random());
		$('li:eq(' + allArgs.now + ')').css('background-color', '#fff').children('div:first').css('display', 'none');
		$('li:eq(' + allArgs.turn + ')').css('background-color', '#005aab').children('div:first').css('display', 'block');
		allArgs.now = allArgs.turn;
		if (allArgs.isOn && !allArgs.isStop) {
			handle = setTimeout(function() {
				displayMole(allArgs);
			}, 900);
		}
	}

	// 结束游戏按钮点击事件
	var over = function(allArgs) {
		return function() {
			overGame(allArgs);
		}
	}

	// 开始游戏
	var start = function(allArgs) {
		if (allArgs.isOn) {
			allArgs.isStop = false;
			allArgs.timer = setTimeout(function() {
				updateTime(allArgs);
			}, 1000);
			handle = setTimeout(function() {
				displayMole(allArgs);
			}, 900);
		} else {
			allArgs.isOn = true;
			allArgs.timer = setTimeout(function() {
				updateTime(allArgs);
			}, 1000);
			displayMole(allArgs);
		}
	}

	// 开始或者停止
	var startOrStop = function(allArgs) {
		return function() {
			if (!allArgs.isOn || allArgs.isStop) {
				start(allArgs);
				
			} else {
				stopTime(allArgs);
				if (handle != null) {
					clearTimeout(handle);
				}
			}
		}
	}

	// 点击绑定事件
	var click_ = function(allArgs, i) {
		return function() {
			if (!allArgs.isOn || allArgs.isStop)
				return;
			if (i == allArgs.turn) {
				addHit(allArgs);
			} else {
				addMiss(allArgs);
			}
		}
	}

	// 增加点击击中分数
	var addHit = function(allArgs) {
		allArgs.hit++;
		allArgs.countScore++;
		$('.score:first').text(allArgs.countScore + '');
		if (handle != null) {
			clearTimeout(handle);
		}
		displayMole(allArgs);
	}

	// 增加点击失误分数
	var addMiss = function(allArgs) {
		allArgs.miss++;
		allArgs.countScore--;
		if (allArgs.countScore < 0) {
			allArgs.countScore = 0;
		}
		$('.score:first').text(allArgs.countScore + '');
	}
})();