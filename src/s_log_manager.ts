export enum LogCategory
{
    Activity = "activity",
    Levels = "levels",
    Misc = "misc"
}

export class LogManager
{
    messages: Map<string, MessageQueueHandler>;

    logContainer: HTMLElement;

    constructor()
    {
        this.logContainer = document.getElementById("log_container")!;
        this.messages = new Map<string, MessageQueueHandler>([
            [LogCategory.Activity, new MessageQueueHandler(LogCategory.Activity, 20)],
            [LogCategory.Levels, new MessageQueueHandler(LogCategory.Levels, 20)],
            [LogCategory.Misc, new MessageQueueHandler(LogCategory.Misc, 20)]
        ]);
    }

    public log(message: string, type: LogCategory = LogCategory.Misc): void
    {
        let newEntry: HTMLDivElement = document.createElement("div");

        newEntry.innerHTML = message;
        newEntry.className = "log_message log_message." + type;

        this.logContainer.appendChild(newEntry);

        let olderMessage: HTMLDivElement | null = this.messages.get(type)!.push(newEntry);
        if(olderMessage)
        {
            this.logContainer.removeChild(olderMessage);
        }

        // scroll it down, not up
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    public clearLog(type: string = "all"): void
    {
        if(type == "all")
        {
            for(const [key, value] of this.messages.entries())
            {
                this.clearLogByType(key);
            }
        }
        else
        {
            this.clearLogByType(type);
        }
    }

    clearLogByType(type: string)
    {
        let queueToClear: MessageQueueHandler = this.messages.get(type)!;

        while(queueToClear.count > 0)
        {
            queueToClear.pop();
        }
    }
}

class MessageQueueHandler
{
    visible: boolean;
    filterButton: HTMLElement;

    head: Message | null;
    tail: Message | null;
    count: number;

    limit: number;

    constructor(type: string, limit: number)
    {
        this.visible = true;

        this.head = null;
        this.tail = null;
        this.count = 0;

        this.limit = limit;

        this.filterButton = document.getElementById("log_filter." + type)!;
        this.filterButton.addEventListener("click", evt => this.toggleFilter(type, this.filterButton));
    }

    push(message: HTMLDivElement): HTMLDivElement | null
    {
        const newMessage = new Message(message);

        if(!this.head)
        {
            this.head = newMessage;
            this.tail = newMessage;
        }

        this.tail!.next = newMessage;
        this.tail = newMessage;

        this.count++;

        if(this.count > this.limit)
        {
            return this.pop();
        }

        return null;
    }
    
    pop(): HTMLDivElement | null
    {
        if(this.head)
        {
            let first: Message = this.head;
            this.head = this.head.next;
            this.count--;

            return first.value;
        }
        
        return null;
    }
    
    toggleFilter(type: string, filterButton: HTMLElement)
    {
        this.visible = !this.visible;

        if(this.visible)
        {
            filterButton.className = "tab_button filter_button_selected";

            for(let message of document.getElementsByClassName("log_message." + type))
            {
                message.className = "log_message log_message." + type;
            }
        }
        else
        {
            filterButton.className = "tab_button filter_button_unselected";

            for(let message of document.getElementsByClassName("log_message." + type))
            {
                message.className = "log_message log_message." + type + " invisible";
            }
        }
    }
}

class Message
{
    value: HTMLDivElement;
    next: Message | null;

    constructor(value: HTMLDivElement)
    {
        this.value = value;
        this.next = null;
    }
}