AlarmStorage = function (alarmName) {
    this.alarmName = alarmName;
    this.items = [];
};

// load items from local storage
AlarmStorage.prototype.loadItems = function () {
    var items = localStorage != null ? localStorage[this.alarmName + "_items"] : null;
    if (items != null && JSON != null) {
        try {
            var items = JSON.parse(items);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.id != null && item.start != null && item.type != null && item.tone != null && item.snooze != null) {
                    item = new alarmItem(item.id, item.start, item.type, item.tone, item.snooze);
                    this.items.push(item);
                }
            }
        }
        catch (err) {
            // ignore errors while loading...
        }
    }
};

// save items to local storage
AlarmStorage.prototype.saveItems = function () {
    if (localStorage != null && JSON != null) {
        localStorage[this.alarmName + "_items"] = JSON.stringify(this.items);
    }
};

// adds an item to the cart
AlarmStorage.prototype.addItem = function (id, start, type, tone, snooze) {

    var item = new alarmItem(id, start, type, tone, snooze);
    this.items = [ item ];

    // save changes
    this.saveItems();
};

// clear the cart
AlarmStorage.prototype.clearItems = function () {
    this.items = [];
    this.saveItems();
};

AlarmStorage.prototype.getNotificationId = function () {

    var num = 0;
    for ( var name in localStorage )
    {
        if ( name.indexOf('_items') != -1 )
            num++;
    }
    return 10000+num;
};


//----------------------------------------------------------------
// items in the alarm
//
function alarmItem(id, start, type, tone, snooze) {
    this.id = id;
    this.start = start;
    this.type = type;
    this.tone = tone;
    this.snooze = snooze;
};