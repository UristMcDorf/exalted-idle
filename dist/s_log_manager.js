export var LogCategory;
(function (LogCategory) {
    LogCategory["Activity"] = "activity";
    LogCategory["Levels"] = "levels";
    LogCategory["Loot"] = "loot";
    LogCategory["Misc"] = "misc";
})(LogCategory || (LogCategory = {}));
export class LogManager {
    constructor() {
        this.logContainer = document.getElementById("log_container");
        this.messages = new Map([
            [LogCategory.Activity, new MessageQueueHandler(LogCategory.Activity, 20)],
            [LogCategory.Levels, new MessageQueueHandler(LogCategory.Levels, 20)],
            [LogCategory.Loot, new MessageQueueHandler(LogCategory.Loot, 20)],
            [LogCategory.Misc, new MessageQueueHandler(LogCategory.Misc, 20)]
        ]);
    }
    log(message, type = LogCategory.Misc) {
        let newEntry = document.createElement("div");
        newEntry.innerHTML = message;
        newEntry.className = "log_message log_message." + type;
        this.logContainer.appendChild(newEntry);
        let olderMessage = this.messages.get(type).push(newEntry);
        if (olderMessage) {
            this.logContainer.removeChild(olderMessage);
        }
        // scroll it down, not up
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
    clearLog(type = "all") {
        if (type == "all") {
            for (const [key, value] of this.messages.entries()) {
                this.clearLogByType(key);
            }
        }
        else {
            this.clearLogByType(type);
        }
    }
    clearLogByType(type) {
        let queueToClear = this.messages.get(type);
        while (queueToClear.count > 0) {
            queueToClear.pop();
        }
    }
}
class MessageQueueHandler {
    constructor(type, limit) {
        this.visible = true;
        this.head = null;
        this.tail = null;
        this.count = 0;
        this.limit = limit;
        this.filterButton = document.getElementById("log_filter." + type);
        this.filterButton.addEventListener("click", evt => this.toggleFilter(type, this.filterButton));
    }
    push(message) {
        const newMessage = new Message(message);
        if (!this.head) {
            this.head = newMessage;
            this.tail = newMessage;
        }
        this.tail.next = newMessage;
        this.tail = newMessage;
        this.count++;
        if (this.count > this.limit) {
            return this.pop();
        }
        return null;
    }
    pop() {
        if (this.head) {
            let first = this.head;
            this.head = this.head.next;
            this.count--;
            return first.value;
        }
        return null;
    }
    toggleFilter(type, filterButton) {
        this.visible = !this.visible;
        if (this.visible) {
            filterButton.className = "tab_button filter_button_selected";
            for (let message of document.getElementsByClassName("log_message." + type)) {
                message.className = "log_message log_message." + type;
            }
        }
        else {
            filterButton.className = "tab_button filter_button_unselected";
            for (let message of document.getElementsByClassName("log_message." + type)) {
                message.className = "log_message log_message." + type + " invisible";
            }
        }
    }
}
class Message {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
