var startTime = Date.now() / 1000;//开始时间
var endTime = document.getElementById('endTime').innerHTML; //结束时间
setInterval(function () {
    var ts = endTime - startTime;//计算剩余的毫秒数
    // console.log(endTime, startTime,  ts);
    var dd = parseInt(ts / 60 / 60 / 24, 10);//计算剩余的天数
    var hh = parseInt(ts / 60 / 60 % 24, 10);//计算剩余的小时数
    var mm = parseInt(ts / 60 % 60, 10);//计算剩余的分钟数
    var ss = parseInt(ts % 60, 10);//计算剩余的秒数
    dd = checkTime(dd);
    hh = checkTime(hh);
    mm = checkTime(mm);
    ss = checkTime(ss);
    if (document.getElementById('endTime')) {
        if (ts > 0) {
            document.getElementById('endTime').innerHTML = hh + ":" + mm + ":" + ss;
            startTime++;
        } else if (ts < 0) {
            document.getElementById('endTime').innerHTML = "已结束";
        }
    }
}, 1000);
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
