var vote_num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
var voting = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var total_num = 20;
var api = "https://hl2018.qz5z.ren/api/";

init();

function init() {
    //初始化投票记录储存
    if (!localStorage.voting) {
        localStorage.voting = JSON.stringify(voting);
    }

    //动态加载 DOM
    j = 0;
    for (var i = 1; i <= total_num; i++) {
        t = "<div class=\"item item-" + (i + 1) + "\"><div class=\"say-box\"><img src=\"assets/img/" + i + ".png\" style=\"max-width: 100%\"><div class=\"ui button vote-btn\" to=\"" + i + "\">点赞<span class=\"vote-num\"></span></div></div></div>";
        // console.log(t);
        $("#wrap").append(t);
    }
    t1 = "<!-- 首屏 --><div class=\"item item-1\"><div class=\"say-box\"><img src=\"assets/img/first.png\"><img src=\"assets/img/second.png\" style=\"animation: shake 5s infinite ease-in-out;\"></div></div>";
    t2 = "<!-- 尾屏 --><div class=\"item item-22\"><img class=\"end1\" src=\"assets/img/end1.png\" style=\"top:5%;z-index:233\"><img class=\"end2\" src=\"assets/img/hat.png\" style=\"top:20%;z-index:232\"><img class=\"end3\" src=\"assets/img/runway.png\" style=\"position:fixed;bottom:0;z-index:231\"><img class=\"end4\" src=\"assets/img/end2.png\" style=\"position:fixed;bottom:0;z-index:666\"></div>";
    $("#wrap").prepend(t1);
    $("#wrap").append(t2);

    //获取票数
    $.ajax({
        type: "GET",
        url: api + "get.php",
        dataType: "json",
        success: function (response) {
            //写入票数
            for (var i = 0; i <= 19; i++) {
                vote_num[i] = parseInt(response[i].num);
            }
            $('.vote-btn').each(function () {
                id = $(this).attr('to');
                num = vote_num[id - 1];
                $(this).children('.vote-num').html('(' + num + ')');
            });
            last = 0;
            //初始化滑动组件
            var myslider = new iSlider({
                wrap: '#wrap',
                item: '.item',
                onslide: function (index) {
                    console.log(index);
                    t1 = $("#bg1").css("background-position").split(" ");
                    console.log(t1);
                    t2 = $("#bg2").css("background-position").split(" ");
                    if (index > last) {
                        //向下
                        $("#bg1").css("background-position", (parseInt(t1[0]) + 30) + "px " + (parseInt(t1[1]) + 30) + "px");
                        $("#bg2").css("background-position", (parseInt(t2[0]) + 60) + "px " + (parseInt(t2[1]) + 60) + "px");
                    } else {
                        //向上
                        $("#bg1").css("background-position", (parseInt(t1[0]) - 30) + "px " + (parseInt(t1[1]) - 30) + "px");
                        $("#bg2").css("background-position", (parseInt(t2[0]) - 60) + "px " + (parseInt(t2[1]) - 60) + "px");
                    }
                    last = index;
                    //最后一页就隐藏slide
                    if (index == 21) {
                        $(".slider").hide();
                    } else {
                        $(".slider").show();
                    }
                    //重绑定投票按钮
                    $('.vote-btn').unbind();
                    $('.vote-btn').click(function () {
                        to = $(this).attr('to');
                        ele = $(this);
                        vote(to, ele);
                    });
                }
            });
            console.info(myslider);

            //绑定投票按钮
            $('.vote-btn').click(function () {
                to = $(this).attr('to');
                ele = $(this);
                vote(to, ele);
            });
        }
    });
}

function vote(id, ele) {
    t = JSON.parse(localStorage.voting);
    if (t[id - 1]) {
        layer.tips('您已点赞，谢谢！', ele, {
            tips: [1, '#000000'],
            time: 1000
        });
        return;
    }
    num = vote_num[id - 1] + 1;
    $(ele).children('.vote-num').html('(' + num + ')');

    $.ajax({
        type: "POST",
        url: api + "post.php",
        data: {
            id: id
        },
        dataType: "json",
        success: function (response) {
            /*             layer.tips('+1', ele, {
                            tips: [1, '#000000'],
                            time: 1000
                        }); */
        }
    });

    voting[id - 1] = 1;
    localStorage.voting = JSON.stringify(voting);
}

// BGM
var playing = false;
var first = true;
var bgmElm = document.getElementById("bgm");

function switchPlay() {
    if (playing) {
        $('.music-btn').attr('src', 'assets/img/music-off.png');
        playing = false;
        bgmElm.pause();
    } else {
        $('.music-btn').attr('src', 'assets/img/music.png');
        playing = true;
        first = false;
        bgmElm.volume = 0.2;
        bgmElm.play();
    }
}
bgmElm.oncanplay = function () {
    if (!playing) switchPlay();
};
document.addEventListener("WeixinJSBridgeReady", function () {
    if (!playing) switchPlay();
}, false);

$('html').on('touchstart', function () {
    if (!playing && first) switchPlay();
});
$('.music-btn').click(function () {
    switchPlay();
});