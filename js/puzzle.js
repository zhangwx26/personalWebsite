$('.sure:first').on('click', function(){
	startClick();
});

var startClick = function() {
	var allArgs = new Object();
	getHardNum(allArgs);
	if (allArgs.level == null) {
		alert("请选择难度")
		return;
	}
	resetArgs(allArgs);
	initialize(allArgs);
}

var resetArgs = function(allArgs) {
	if (allArgs.level == 0) {
		setArgs(allArgs, 14, 5, 3, 99, 200, 400);
	} else {
		setArgs(allArgs, 59, 10, 6, 49, 250, 450);
	}
	allArgs.arr = [];
	allArgs.click = false;
	for (var i = 0; i <= allArgs.chipsNum; i++) {
		allArgs.arr.push(i)
	}
}

var setArgs = function(allArgs, a, c, d, e, f, g) {
	allArgs.blankNo = allArgs.chipsNum = a;
	allArgs.w = c;
	allArgs.h = d;
	allArgs.width = e;
	allArgs.blankTop = f;
	allArgs.blankLeft = g;
	allArgs.stop = false;
}

var initialize = function(allArgs) {
	var innerHTML = '';
	for (var i = 0; i < allArgs.chipsNum; i++) {
		innerHTML += '<div class="chips"></div>';
	}
	$('.puzzle:first').html(innerHTML);
	setting(allArgs);
	mix(allArgs);
	start(allArgs);
}

var setting = function(allArgs) {
	for (var i = 0; i < allArgs.h; i++) {
		for (var j = 0; j < allArgs.w; j++) {	
			if (i == allArgs.h - 1 && j == allArgs.w - 1) break;
			$('.chips:eq(' + (i * allArgs.w + j) + ')').attr('No', i * allArgs.w + j)
			.css({'width' : allArgs.width + 'px', 'height' : allArgs.width + 'px', 'top' : i * (allArgs.width + 1) + 'px', 'left' : j * (allArgs.width + 1) + 'px',
				'background-position' : -j * (allArgs.width + 1) + 'px' + ' ' + -i * (allArgs.width + 1) + 'px'});
		}
	}
}

function randomsort(a, b) {
    return Math.random()>.5 ? -1 : 1;//用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
}

var swapArray = function(allArgs) {
	var arr = new Array(allArgs.arr.length);
	for (var i = 0; i < allArgs.arr.length; i++) {
		arr[allArgs.arr[i]] = i;
	}
	allArgs.arr = arr;
}

var isInverse = function(arr) {
	var temp = 0;
	for (var i = 0; i < arr.length - 1; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (arr[j] < arr[i]) {
				temp++;
			}
		}
	}
	return temp % 2 == 0 ? true : false;
}

var mixArray = function(allArgs) {
	if (isInverse(allArgs.arr.sort(randomsort))) {
		swapArray(allArgs);
	} else {
		mixArray(allArgs);
	}
}

var mix = function(allArgs) {
	mixArray(allArgs);
	for (var i = 0; i < allArgs.chipsNum; i++)
		$('.chips:eq(' + i + ')').attr('No', allArgs.arr[i]).animate({'top': parseInt(allArgs.arr[i] / allArgs.w) * (allArgs.width + 1) + 'px', 'left': allArgs.arr[i] % allArgs.w * (allArgs.width + 1) + 'px'});
	allArgs.blankNo = allArgs.arr[allArgs.chipsNum];
	allArgs.blankTop = parseInt(allArgs.blankNo / allArgs.w) * (allArgs.width + 1);
	allArgs.blankLeft = allArgs.blankNo % allArgs.w * (allArgs.width + 1);
	console.log(allArgs.blankNo + ' ' + allArgs.blankTop + ' ' + allArgs.blankLeft);
}

var start = function(allArgs) {
	allArgs.stop = false;
	for (var i = 0; i < allArgs.chipsNum; i++)
		$('.chips:eq(' + i + ')').on('click', function() {
			click_($(this), allArgs);
		});
}

var click_ = function(obj, allArgs) {
	var temp = Math.abs(parseInt(obj.attr('No')) - allArgs.blankNo);
	if ((temp != 1 && temp != allArgs.w) || allArgs.stop)
		return;
	if (!allArgs.click)
		allArgs.click = true;
	swap(obj, allArgs);
}

var swap = function(obj, allArgs) {
	var tempNo = parseInt(parseInt(obj.attr('No')));
	var tempTop = parseInt(parseInt(obj.css('top')));
	var tempLeft = parseInt(parseInt(obj.css('left')));
	obj.attr('No', allArgs.blankNo).animate({'top': allArgs.blankTop, 'left': allArgs.blankLeft}, function() {
		allArgs.click = false;
		allArgs.blankNo = tempNo;
		allArgs.blankTop = tempTop;
		allArgs.blankLeft = tempLeft;
		winOrNot(allArgs);
	});
}

var winOrNot = function(allArgs) {
	for (var i = 0; i < allArgs.chipsNum; i++) {
		if (parseInt($('.chips:eq(' + i + ')').attr('No')) != i) {
			return;
		}
	}
	allArgs.stop = true;
	alert('You Win!!!');
}

var getHardNum = function(allArgs) {
	if ($('.radio-style:first').is(':checked')) allArgs.level = 0;
    else if ($('.radio-style:eq(1)').is(':checked')) allArgs.level = 1;
	else allArgs.level = null;
}