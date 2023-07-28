function add_menu()
{
  var menu = SpreadsheetApp.getUi().createMenu('Custom');
  menu.addItem('To Calendar Trigger', 'create_trigger');
  menu.addToUi();
}

function create_trigger()
{
  ScriptApp.newTrigger('orders_func')
      .timeBased()
      .everyMinutes(5)
      .create();
}

function orders_func() 
{
  var spreadsheet = SpreadsheetApp.getActiveSheet();
  //var calendarID = spreadsheet.getRange("G3").getValue();
  var eventCal = CalendarApp.getCalendarById("09a2534d7e86c27ab60bdec1190087b61625de84e48eb5d6d5827b5601402276@group.calendar.google.com");

  var row_offset = 2; //to start in first data row
  var column_offset = 1; //to start in first column
  var range = spreadsheet.getDataRange().offset(row_offset, column_offset);
  var values = range.getValues();

  //var data = spreadsheet.getRange(range).getValues();  
  /* for (x=0 ; x < data.length ; x++)
  {
    var shift = data[x];
    var proj_num = shift[0];
    var date = shift[1];
    eventCal.createAllDayEvent(proj_num, date);
  } */

  for (x=0 ; x < values.length; x++)  //iterate through the data read from the spreadsheet
  {
    var shift = values[x];
    var order_date = shift[0];
    var lead_time = shift[1];
    var proj_num = shift[2];
    var date = shift[3];
    var week = shift[4];

    if(order_date != 0)
    {
      var old_entry = false;
      var printing = order_date + " : " + lead_time + " : " + proj_num + " : " + date + " : " + week;
      //Logger.log(printing);

      var days_events_array = eventCal.getEventsForDay(date);
      for(i = 0 ; i < days_events_array.length ; i++)
      {
        Logger.log(days_events_array[i].getTitle());
        if(days_events_array[i].getTitle() == proj_num)
        {
          old_entry = true;
          break;
        }
      }

      if(!old_entry)
      {
        Logger.log("New Entry");
        eventCal.createAllDayEvent(proj_num, date);
      }

    }

  }

}