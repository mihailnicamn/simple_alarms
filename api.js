class Alarm {
    constructor() {
        this.list = [];
        if (!localStorage.getItem('alarms') || localStorage.getItem('alarms') == "[]") localStorage.setItem('alarms', JSON.stringify(this.list));
        Notification.requestPermission();
        this.audio = new Audio('alarm.mp3');
    }
    verify() {
        var time_now = new Date().toLocaleTimeString().toString().split(":");
        this.list.forEach((alarm) => {
            console.log("verified, alarm is " + JSON.stringify(alarm));
            if (alarm.time == time_now[0] + ":" + time_now[1] && alarm.triggered == false && alarm.last_verified !== time_now[0] + ":" + time_now[1] || alarm.run == true) {
                console.log("running alarm", JSON.stringify(alarm));
                alarm.triggered = true;
                alarm.last_verified = time_now[0] + ":" + time_now[1];
                return this.startAlarm(alarm);
            }
        });
    }
    startAlarm(alarm) {
        this.audio.play();
        this.audio.addEventListener('ended', () => { this.audio.currentTime = 0; this.audio.play(); });
        return this.sendNotification(alarm);
    }
    sendNotification(alarm) {
        new Notification("It's Time", { body: alarm.message }).onclick = (notification) => { notification.close(); return this.stopAlarm() }
    }
    stopAlarm() {
        this.audio.pause();
        this.audio.removeEventListener('ended', () => { this.audio.currentTime = 0; this.audio.play(); });
    }
    addAlarm(alarm) {
        this.list.push(alarm);
        return this.updateAlarms();
    }
    removeAlarm(alarm_) {
        this.list = this.list.filter((alarm) => { return alarm.time !== alarm_.time });
        return this.updateAlarms();
    }
    updateAlarms() {
        localStorage.setItem('alarms', JSON.stringify(this.list));
    }
    getAlarms() {
        return JSON.parse(localStorage.getItem('alarms'));
    }
    loadAlarms() {
        this.list = this.getAlarms();
        if (this.list.length > 0) return this.list = this.list.sort((a, b) => { return a.time.localeCompare(b.time) });
        return this.list;
    }
    renderAlarms() {
        const list = $("#alarm_list");
        list.empty();
        this.list.forEach((alarm) => {
            list.append(`<li class="alarm_item" data-time="${alarm.time}">${alarm.time} - ${alarm.message}</br><button class="btn btn-outline-danger remove_alarm align-left" onclick="removeAlarm(this)">remove</button></li>`);
        });
    }
    stopAlarms() {
        this.list.forEach((alarm) => { alarm.triggered = false; });
        this.stopAlarm();
        return this.updateAlarms();
    }
}

const alarm_manager = new Alarm();
alarm_manager.loadAlarms();
alarm_manager.renderAlarms();
const _addAlarm = () => {
    const modal = $("#addAlarm_modal");
    modal.modal('show');
};
const _cancelAddAlarm = () => {
    const modal = $("#addAlarm_modal");
    modal.modal('hide');
};
const addAlarm = () => {
    const time = $("#alarm_time").val();
    const message = $("#alarm_message").val();
    alarm_manager.addAlarm({ time: time, message: message, triggered: false, last_verified: new Date().toLocaleTimeString().toString(), run: true });
    alarm_manager.loadAlarms();
    alarm_manager.renderAlarms();
    _cancelAddAlarm();
}
const removeAlarm = (element) => {
    const time = $(element).parent().data('time');
    alarm_manager.removeAlarm({ time: time });
    alarm_manager.loadAlarms();
    alarm_manager.renderAlarms();
}
const stopAlarms = () => {
    alarm_manager.stopAlarms();
    alarm_manager.loadAlarms();
    alarm_manager.renderAlarms();
}

setInterval(() => { alarm_manager.verify(); }, 1000);
