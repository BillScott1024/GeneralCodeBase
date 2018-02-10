function WPLog(msg) {
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "-" + date.getMilliseconds();
    console.log(time + "         \n" + msg);
}

module.exports = {
    WPLog : WPLog
};
