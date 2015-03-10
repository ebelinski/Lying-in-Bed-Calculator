(function($){
    // **Item class**: The atomic part of our Model. A model is basically a Javascript object, i.e. key-value pairs, with some helper functions to handle event triggering, persistence, etc.
    var Item = Backbone.Model.extend({
        defaults: {
            haveSpent: '0 months',
            willSpend: '0 more years',
            total: '0 years'
        }
    });

    var AppView = Backbone.View.extend({
        el: $('.content'),
        events: {
            'change input#dailyminutes': 'addItem',
            'change input#yearsold': 'yearsOldChanged',
            'change input#minutesless': 'updateTimeSaved'
            // 'keypress': 'addItem'
        },

        // `initialize()` now instantiates a Collection, and binds its `add` event to own method `appendItem`. (Recall that Backbone doesn't offer a separate Controller for bindings...).
        initialize: function(){
            _.bindAll(this, 'render', 'addItem', 'appendItem'); // remember: every function that uses 'this' as the current object should be in here

            this.render();
        },

        render: function(){
            // Save reference to `this` so it can be accessed from within the scope of the callback below
            var self = this;
            $('#results').hide();
            $('#savetime').hide();
        },

        // `addItem()` now deals solely with models/collections. View updates are delegated to the `add` event listener `appendItem()` below.
        addItem: function(){
            var self = this;
            var item = new Item();

            var haveSpent = '0 months';
            var willSpend = '0 more years';
            var total = '0 years';

            var minutes = parseInt($("#dailyminutes").val());
            var age = parseInt($("#yearsold").val());

            var minutesSpent = minutes * 365 * (age - 10);
            var totalMinutes = minutes * 365 * (85 - 10);
            var minutesWillSpend = totalMinutes - minutesSpent;

            var daysSpent = minutesSpent / 60 / 24;
            var totalDays = totalMinutes / 60 / 24;
            var daysWillSpend = minutesWillSpend / 60 / 24;
            daysSpent = Math.round(daysSpent)
            totalDays = Math.round(totalDays)
            daysWillSpend = Math.round(daysWillSpend)

            var monthsSpent = minutesSpent / 60 / 24 / 30;
            var totalMonths = totalMinutes / 60 / 24 / 30;
            var monthsWillSpend = minutesWillSpend / 60 / 24 / 30;
            monthsSpent = Math.round(monthsSpent*10)/10
            totalMonths = Math.round(totalMonths*10)/10
            monthsWillSpend = Math.round(monthsWillSpend*10)/10

            var yearsSpent = minutesSpent / 60 / 24 / 30 / 12;
            var totalYears = totalMinutes / 60 / 24 / 30 / 12;
            var yearsWillSpend = minutesWillSpend / 60 / 24 / 30 / 12;
            yearsSpent = Math.round(yearsSpent*10)/10
            totalYears = Math.round(totalYears*10)/10
            yearsWillSpend = Math.round(yearsWillSpend*10)/10

            if (daysSpent === "NaN") monthsSpent = 0;
            if (totalDays === "NaN") monthsSpent = 0;
            if (daysWillSpend === "NaN") monthsSpent = 0;
            if (monthsSpent === "NaN") monthsSpent = 0;
            if (totalMonths === "NaN") monthsSpent = 0;
            if (monthsWillSpend === "NaN") monthsSpent = 0;
            if (yearsSpent === "NaN") yearsSpent = 0;
            if (totalYears === "NaN") totalYears = 0;
            if (yearsWillSpend === "NaN") yearsWillSpend = 0;

            if (daysSpent > 365) {
                item.set({
                    haveSpent: yearsSpent + ' years',
                });
            } else if (daysSpent > 100) {
                item.set({
                    haveSpent: monthsSpent + ' months',
                });
            } else {
                item.set({
                    haveSpent: daysSpent + ' days',
                });
            }

            if (daysWillSpend > 365) {
                item.set({
                    willSpend: yearsWillSpend + ' more years',
                });
            } else if (daysWillSpend > 100) {
                item.set({
                    willSpend: monthsWillSpend + ' more months',
                });
            } else {
                item.set({
                    willSpend: daysWillSpend + ' more days',
                });
            }

            if (totalDays > 365) {
                item.set({
                    total: totalYears + ' full years',
                });
            } else if (totalDays > 100) {
                item.set({
                    total: totalMonths + ' full months',
                });
            } else {
                item.set({
                    total: totalDays + ' full days',
                });
            }
            self.appendItem(item);
            self.updateTimeSaved();
        },

        // `appendItem()` is triggered by the collection event `add`, and handles the visual update.
        appendItem: function(item){
            $('#results').show();
            $('#haveSpent').html(item.get('haveSpent'));
            $('#willSpend').html(item.get('willSpend'));
            $('#total').html(item.get('total'));
        },

        updateTimeSaved: function(){

            var minutes = parseInt($("#dailyminutes").val());
            var age = parseInt($("#yearsold").val());

            $('#savetime').show();

            if ($('#minutesless').val() === "") {
                if (minutes > 5) {
                    $('#minutesless').val(5);
                } else {
                    $('#minutesless').val(minutes);
                }
            } else {
                if ($('#minutesless').val() > minutes) {
                    $('#minutesless').val(minutes);
                }
            }

            var minutesLess = parseInt($("#minutesless").val());
            var minutesWillSave = minutesLess * 365 * (85 - age);
            // var minutesWillSave = minutesWillSpend - minutesToSave;

            var daysWillSave = minutesWillSave / 60 / 24;
            daysWillSave = Math.round(daysWillSave)

            var monthsWillSave = minutesWillSave / 60 / 24 / 30;
            monthsWillSave = Math.round(monthsWillSave*10)/10

            var yearsWillSave = minutesWillSave / 60 / 24 / 30 / 12;
            yearsWillSave = Math.round(yearsWillSave*10)/10

            if (daysWillSave > 365) {
                $('#timeSaved').html(yearsWillSave + " full years");
            } else if (daysWillSave > 100) {
                $('#timeSaved').html(monthsWillSave + " full months");
            } else {
                $('#timeSaved').html(daysWillSave + " full days");
            }
        },

        yearsOldChanged: function(){
            $('#results').hide();
            $('#savetime').hide();
            $('#dailyminutes').val("");
            $('#minutesless').val("");

        }
    });

    var AppView = new AppView();
})(jQuery);