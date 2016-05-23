
$("[href='#LineChart2']").click(function(){
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
});

function drawChart() {

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Time of Day');
    data.addColumn('number', 'Rating');

        
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://140.96.29.77:8080/TARSAN/service/main?service=getDataByDays&jsonPara=[]", false);
    xhttp.send();
    var rep = xhttp.responseText;
    var obj = JSON.parse(rep.substring(1,rep.length-1));
    console.log(obj);

    var button = document.getElementById('change-chart');
    var chartDiv = document.getElementById('chart_div');

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Days');
    data.addColumn('number', "LogDatas");


    for (var i = 0; i < obj.days.length; i++) {
        var counter = obj.days[i];
        console.log(counter.Month+":"+counter.Day+"-"+counter.Count);
         data.addRows([
            [new Date(2016, counter.Month,counter.Day),  parseInt(counter.Count)]
          ]);
    }

        var options = {
          title: 'Datas from 2016/1/30 to Nowadays',
          width: 1200,
          height: 600,
          hAxis: {
            format: 'M/d/yy',
            gridlines: {count: 30}
          },
          vAxis: {
            gridlines: {color: 'none'},
            minValue: 0
          }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

        chart.draw(data, options);

        var button = document.getElementById('change');

        button.onclick = function () {

          // If the format option matches, change it to the new option,
          // if not, reset it to the original format.
          options.hAxis.format === 'M/d/yy' ?
          options.hAxis.format = 'MMM dd, yyyy' :
          options.hAxis.format = 'M/d/yy';

          chart.draw(data, options);
        };
      }