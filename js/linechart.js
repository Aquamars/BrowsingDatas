
window.onload = a;
function a(){
    google.charts.load('current', { 'packages': ['line', 'corechart','calendar','timeline','annotationchart','orgchart','bar','table'] });
    google.charts.setOnLoadCallback(drawLineChart); 
    init();   
}

function drawLineChart() {

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getDataByDays&jsonPara=[]", false);
    xhttp.send();
    var rep = xhttp.responseText;
    var obj = JSON.parse(rep.substring(1, rep.length - 1));
    //console.log(obj);

    var xhttpPie = new XMLHttpRequest();
    xhttpPie.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getAllHost&jsonPara=[]", false);
    xhttpPie.send();
    var repPie = xhttpPie.responseText;
    var repPie2 = repPie.replace(/\\"/g, "");
    var objPie = JSON.parse(repPie2.substring(1,repPie2.length-1));

    var xhttpPie2 = new XMLHttpRequest();
    xhttpPie2.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getAllIp&jsonPara=[]", false);
    xhttpPie2.send();
    var repPie_ = xhttpPie2.responseText;
    var repPie_2 = repPie_.replace(/\\"/g, "");
    var objPie2 = JSON.parse(repPie_2.substring(1,repPie_2.length-1));

    var xhttpTimeLine = new XMLHttpRequest();
    xhttpTimeLine.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getIntervalWithHost&jsonPara=[]", false);
    xhttpTimeLine.send();
    var repTimeLine = xhttpTimeLine.responseText;
    var repTimeLine2 = repTimeLine.replace(/\\"/g, "");
    var objTimeLine = JSON.parse(repTimeLine2.substring(1, repTimeLine2.length - 1));

    var xhttpAChart = new XMLHttpRequest();
    xhttpAChart.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getHoursData&jsonPara=[]", false);
    xhttpAChart.send();
    var repAChart = xhttpAChart.responseText;
    var objAChart = JSON.parse(repAChart.substring(1, repAChart.length - 1));

    var xhttpTableChart = new XMLHttpRequest();
    xhttpTableChart.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getRefAndURL&jsonPara=[]", false);
    xhttpTableChart.send();
    var repTableChart= xhttpTableChart.responseText;
    var objTableChart = JSON.parse(repTableChart.substring(1, repTableChart.length - 1));

    var dataOrgChart = new google.visualization.DataTable();
    dataOrgChart.addColumn('string', 'Name');
    dataOrgChart.addColumn('string', 'Ref');
    var dataTableChart = new google.visualization.DataTable();
    dataTableChart.addColumn('string', 'UrlHost');
    dataTableChart.addColumn('number', 'Sub items');
    dataTableChart.addColumn('number', 'Click counts');
    var dataOrgChartTmp = new google.visualization.DataTable();
    dataOrgChartTmp.addColumn('string', 'UrlHost');
    dataOrgChartTmp.addColumn('string', 'Ref');    
    var tmp ="0";
    for (var i = 0; i < objTableChart.RefUrl.length; i++) {
        var counter = objTableChart.RefUrl[i];       

        if(typeof counter.url!= "undefined"){
            dataOrgChart.addRows([
               [{v:counter.url, f:counter.url+"  "+counter.UrlCount}, counter.ref]
               //[{v:counter.url, f:counter.url+"  "+counter.UrlCount}, {v:counter.ref, f:counter.ref+"  "+counter.RefCount}]
            ]);
            if(tmp===counter.ref){
                dataOrgChartTmp.addRows([
               [{v:counter.url, f:counter.url+"  "+counter.UrlCount}, counter.ref]
            ]);
            }
        }        
        if(typeof counter.REF!= "undefined"){
            dataTableChart.addRows([
               [counter.REF, counter.sub, counter.count ]
            ]);
            var g=document.createElement('div');
            g.setAttribute("id", tmp);
            g.setAttribute("class", 'indepOrg');
            $("#OrgChart2_div").append(g);
            g.style.display = "none";
            g.style.overflow ="auto";
            var OrgChartTmp = new google.visualization.OrgChart(g);
            OrgChartTmp.draw(dataOrgChartTmp,{allowHtml:true} );
            dataOrgChartTmp.removeRows(0, dataOrgChartTmp.getNumberOfRows());            
            tmp=counter.REF;
        }        
    }

    var dataAChart = new google.visualization.DataTable();
    dataAChart.addColumn('date', 'Date');
    dataAChart.addColumn('number', 'LogDates');
    dataAChart.addColumn('string', 'title');
    dataAChart.addColumn('string', 'text');
    for (var i = 0; i < objAChart.HOURS.length; i++) {
        var counter = objAChart.HOURS[i];
        dataAChart.addRows([
           [new Date(2016, counter.Month, counter.Day, counter.Hour), counter.Count, parseInt(counter.Month)+1+"/"+counter.Day+"/"+counter.Hour+":00", "Hours Count :"+counter.Count  ]
           //[new Date(2016, counter.Month, counter.Day, counter.Hour), counter.Count, undefined, undefined ]
        ]);
    }

    var dataTimeLine = google.visualization.arrayToDataTable([
        ["Host", {type: 'date', label: 'Start Date'}, {type: 'date', label: 'End Date'}]]);
    for (var i = 0; i < objTimeLine.Interval.length; i++) {
        var counter = objTimeLine.Interval[i];
        //console.log(counter.host+"-"+counter.sMonth+":"+counter.sDay+"*"+counter.eMonth+":"+counter.eDay);
         dataTimeLine.addRows([
            [counter.host, new Date(2016, counter.sMonth, counter.sDay), new Date(2016, counter.eMonth, counter.eDay)]
          ]);
    }

    var dataPie = new google.visualization.DataTable();
    dataPie.addColumn('string', 'HostUrl');
    dataPie.addColumn('number', 'Counts');
    for (var i = 0; i < objPie.hostData.length; i++) {
        var counter = objPie.hostData[i];
        //console.log(counter.Host+"-"+counter.Count);
         dataPie.addRows([
            [counter.Host,  parseInt(counter.Count)]
          ]);
    }

    var dataPie2 = new google.visualization.DataTable();
    dataPie2.addColumn('string', 'Ip');
    dataPie2.addColumn('number', 'Counts');
    for (var i = 0; i < objPie2.IpData.length; i++) {
        var counter = objPie2.IpData[i];
        //console.log(counter.Ip+"-"+counter.Count);
         dataPie2.addRows([
            [counter.Ip,  parseInt(counter.Count)]
          ]);
    }    

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'Won/Loss' });

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Days');
    data.addColumn('number', "LogDatas");

    var data2 = new google.visualization.DataTable();
    data2.addColumn('date', 'Time of Day');
    data2.addColumn('number', 'LogDatas');

    var total=0;
    for (var i = 0; i < obj.days.length; i++) {
        var counter = obj.days[i];
        //console.log(counter.Month + ":" + counter.Day + "-" + counter.Count);
        total=total+parseInt(counter.Count);
        data.addRows([
            [new Date(2016, counter.Month, counter.Day), parseInt(counter.Count)]
        ]);
        data2.addRows([
            [new Date(2016, counter.Month, counter.Day), parseInt(counter.Count)]
        ]);
         dataTable.addRows([
            [new Date(2016, counter.Month,counter.Day),  parseInt(counter.Count)]
          ]);
    }
    $(".incremental-counter").attr("data-value", total);
    $(".incremental-counter").incrementalCounter({
        "digits": 6
    });

    console.log(total);

    var OrgOptions = {
        size : 'medium'
    };

    var TableOptions = {
        showRowNumber: true,
        width: '75%',
        height: '400px',
        tooltip: { trigger: 'selection' }
    };

    var Table2Options = {
        showRowNumber: true,
        width: '35%',
        height: '350px',
        tooltip: { trigger: 'selection' }
    };

    var AnnotationOptions = {
        displayAnnotations: true
    };

    var TimeLineOptions = {
        height: 450,
        timeline: {
          groupByRowLabel: true
        }
    };
    
    var PieOptions = {
          title: 'Global Mall Total browsing Host datas  (visible > 0.5%)',
          sliceVisibilityThreshold: .005,
          'width':650,
          'height':500,
           tooltip: { trigger: 'selection' }
    };

    var Pie2Options = {
          title: 'Global Mall Total browsing Ip datas  (visible > 0.5%)',
          sliceVisibilityThreshold: .005,
          'width':600,
          'height':500,
          tooltip: { trigger: 'selection' }
    };

    var options = {
        title: 'Datas from 2016/1/30 to Nowadays',
        width: 1200,
        height: 600,
        hAxis: {
            format: 'M/d/yy',
            gridlines: { count: 30 }
        },
        vAxis: {
            gridlines: { color: 'none' },
            minValue: 0
        }
    };

    var CalendarOptions = {
        title: "Hsinchu GlobalMall",
        height: 300,
        width:1600,
        tooltip: { trigger: 'selection' },
        calendar: {
        cellSize: 20,
        colorAxis: {colors: ['green', 'blue']},
        focusedCellColor: {
          stroke: 'red',
          strokeOpacity: 1,
          strokeWidth: 1,
        },
        cellColor: {
          stroke: '#76a7fa',
          strokeOpacity: 0.5,
          strokeWidth: 1,
        },
        noDataPattern: {
          backgroundColor: '#76a7fa',
          color: '#bfbfbf'
        },
        underYearSpace: 10, // Bottom padding for the year labels.
        yearLabel: {
          fontName: 'Times-Roman',
          fontSize: 32,
          color: '#1A8763',
          bold: true,
          italic: true
        }
       }

      };

    var materialOptions = {
        chart: {
            title: 'Datas from 2016/1/30 to Nowadays'
        },
        width: 900,
        height: 500,
        series: {
            // Gives each series an axis name that matches the Y-axis below.
            0: { axis: '' },
            1: { axis: '' }
        },
        axes: {
            // Adds labels to each axis; they don't have to match the axis names.
            y: {
                Temps: { label: 'Data Counts' },
                Daylight: { label: 'Daylight' }
            }
        }
    };

    var classicOptions = {
        title: 'Datas from 2016/1/30',
        width: 1200,
        height: 600,
        // Gives each series an axis that matches the vAxes number below.
        series: {
            0: { targetAxisIndex: 0 },
            1: { targetAxisIndex: 1 }
        },
        vAxes: {
            // Adds titles to each axis.
            0: { title: 'Temps (Celsius)' },
            1: { title: 'Daylight' }
        },
        hAxis: {
            ticks: []
        },
        vAxis: {
            viewWindow: {
                max: 30
            }
        }
    };

    var TableChart2 = new google.visualization.Table(document.getElementById('TableChart2_div'));

    //var OrgChart = new google.visualization.OrgChart(document.getElementById('OrgChart_div'));

    var TableChart = new google.visualization.Table(document.getElementById('TableChart_div'));
    
    var AChart = new google.visualization.AnnotationChart(document.getElementById('LineChart_div'));

    var PieChart = new google.visualization.PieChart(document.getElementById('PieChart_div'));

    var PieChart2 = new google.visualization.PieChart(document.getElementById('PieChart2_div'));

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    var CalendarChart = new google.visualization.Calendar(document.getElementById('Calendar_div'));

    var TimeLinechart = new google.visualization.Timeline(document.getElementById('TimeLineChart_div'));

    var chartDiv = document.getElementById('LineChart_div');
    var materialChart = new google.charts.Line(chartDiv);

    
    function selectHandler() {
        var selectedItem = PieChart.getSelection()[0];
        if (selectedItem) {
            var topping = dataPie.getValue(selectedItem.row, 0);
            drawPieChartByHost(topping);
        }
    }
    function selectHandler2() {
        var selectedItem = PieChart2.getSelection()[0];
        if (selectedItem) {
            var topping = dataPie2.getValue(selectedItem.row, 0);
            drawPieChartByIP(topping);
        }
    }
    function selectHandler3() {
        var selectedItem = CalendarChart.getSelection()[0];
        if (selectedItem) {
            //var topping = CalendarChart.getValue(selectedItem.row, 0);
            var time = new Date(selectedItem.date);
            var dates =  time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
            //console.log(dates);
            drawBarChartByDate(dates);
        }
    }
    function selectHandler4() {
        var selection = TableChart.getSelection();
        var selectName='';
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null && item.column != null) {
              selectName = dataTableChart.getFormattedValue(item.row, item.column);
            } else if (item.row != null) {
              selectName = dataTableChart.getFormattedValue(item.row, 0);
            } else if (item.column != null) {
              selectName = dataTableChart.getFormattedValue(0, item.column);              
            }
        }
        var getChart = document.getElementById(selectName);
        $('.indepOrg').hide();
        getChart.style.display = "block";
        //console.log(selectName);
    }
    function selectHandler5() {
        var selection = TableChart2.getSelection();
        var selectName='';
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null && item.column != null) {
              selectName = dataPie.getFormattedValue(item.row, item.column);
            } else if (item.row != null) {
              selectName = dataPie.getFormattedValue(item.row, 0);
            } else if (item.column != null) {
              selectName = dataPie.getFormattedValue(0, item.column);              
            }
        }

        drawBarChartByhost(selectName);
    }

    google.visualization.events.addListener(PieChart, 'select', selectHandler);    
    google.visualization.events.addListener(PieChart2, 'select', selectHandler2);  
    google.visualization.events.addListener(CalendarChart, 'select', selectHandler3);
    google.visualization.events.addListener(TableChart, 'select', selectHandler4);
    google.visualization.events.addListener(TableChart2, 'select', selectHandler5);

    TableChart2.draw(dataPie, Table2Options);
    TableChart.draw(dataTableChart, TableOptions);
    chart.draw(data2, options);
    CalendarChart.draw(dataTable, CalendarOptions);
    PieChart.draw(dataPie, PieOptions);
    PieChart2.draw(dataPie2, Pie2Options);
    //materialChart.draw(data, materialOptions);
    TimeLinechart.draw(dataTimeLine, TimeLineOptions);
    AChart.draw(dataAChart, AnnotationOptions);
    //OrgChart.draw(dataOrgChart,OrgOptions );
    
    $('#loading').fadeOut(1000);
    $('#herf').fadeIn(1000);

}

function drawPieChartByIP(ip){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getIpCountWithDays&jsonPara=[(\"ip\":\""+ip+"\")]", false);
    xhttp.send();
    var rep = xhttp.responseText;
    var obj = JSON.parse(rep.substring(1, rep.length - 1));

    var chart = new google.visualization.LineChart(document.getElementById('IPChart_div'));

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'count' });
    for (var i = 0; i < obj.IP.length; i++) {
        var counter = obj.IP[i];
        //console.log(counter.Month + ":" + counter.Day + "-" + counter.Count);
        dataTable.addRows([
            [new Date(2016, counter.Month, counter.Day), parseInt(counter.Count)]
        ]);
    }
    var materialOptions = {
        chart: {
            title: 'Datas from 2016/1/30 to Nowadays'
        },
        width: 600,
        height: 500,
        series: {
            // Gives each series an axis name that matches the Y-axis below.
            0: { axis: '' },
            1: { axis: '' }
        },
        axes: {
            // Adds labels to each axis; they don't have to match the axis names.
            y: {
                Temps: { label: 'Data Counts' },
                Daylight: { label: 'Daylight' }
            }
        }
    };

    chart.draw(dataTable, materialOptions);
}

function drawPieChartByHost(host){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getHostCountWithDays&jsonPara=[(\"host\":\""+host+"\")]", false);
    xhttp.send();
    var rep = xhttp.responseText;
    var obj = JSON.parse(rep.substring(1, rep.length - 1));

    var chart = new google.visualization.LineChart(document.getElementById('HOSTChart_div'));

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'count' });
    for (var i = 0; i < obj.HOST.length; i++) {
        var counter = obj.HOST[i];
        //console.log(counter.Month + ":" + counter.Day + "-" + counter.Count);
        dataTable.addRows([
            [new Date(2016, counter.Month, counter.Day), parseInt(counter.Count)]
        ]);
    }
    var materialOptions = {
        chart: {
            title: 'Datas from 2016/1/30 to Nowadays'
        },
        width: 600,
        height: 500,
        series: {
            // Gives each series an axis name that matches the Y-axis below.
            0: { axis: '' },
            1: { axis: '' }
        },
        axes: {
            // Adds labels to each axis; they don't have to match the axis names.
            y: {
                Temps: { label: 'Data Counts' },
                Daylight: { label: 'Daylight' }
            }
        }
    };

    chart.draw(dataTable, materialOptions);
}

function drawBarChartByDate(dates){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getDailyDataByDate&jsonPara=[(\"date\":\""+dates+"\")]", false);
    xhttp.send();
    var rep = xhttp.responseText;
    var obj = JSON.parse(rep.substring(1, rep.length - 1));
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'URLhost');
    dataTable.addColumn('number', "counts");
    for (var i = 0; i < obj.DailyData.length; i++) {
        var counter = obj.DailyData[i];
        dataTable.addRows([
            [counter.host, parseInt(counter.Count)]
        ]);
    }
    var options = {
        title: dates+' browsing url',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Counts',
          minValue: 0
        },
        vAxis: {
          title: 'URLhost'
        }
    };
    var chart = new google.visualization.BarChart(document.getElementById('BarChart_div'));
    chart.draw(dataTable, options);
}

function drawBarChartByhost(host){
    var BarChart = new XMLHttpRequest();
    BarChart.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getDailyHoursDataByHost&jsonPara=[(\"host\":\""+host+"\")]", false);
    BarChart.send();
    var repBarChart= BarChart.responseText;
    repBarChart = repBarChart.replace(/\\"/g, "");
    var objBarChart = JSON.parse(repBarChart.substring(1, repBarChart.length - 1));
    console.log(host);
    console.log(objBarChart);
    var dataBarChart = new google.visualization.DataTable();
    dataBarChart.addColumn('timeofday', 'Time of Day');
    dataBarChart.addColumn('number', 'Counts');
    for (var i = 0; i < objBarChart.WebHours.length; i++){
        var counter = objBarChart.WebHours[i];
        separated = counter.hours.split(",");
        for (var i = 0, length = separated.length; i < length; i++){
            dataBarChart.addRows([
               [[i, 0, 0], parseInt(separated[i]) ]
            ]);
        }      
    }
    var options = {
        hAxis: {
          title: 'Time of Day',
          format: 'h:mm a',
          viewWindow: {
            min: [0, 0, 0],
            max: [23, 0, 0]
          }
        }
      };

    var chart = new google.visualization.ColumnChart(document.getElementById('TableColumnChart_div'));

    chart.draw(dataBarChart, options);

}

function init() {
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    var diagram = $(go.Diagram, "OrgChart_div",  // id of DIV
                    { // Automatically lay out the diagram as a tree;
                      // separate trees are arranged vertically above each other.
                      layout: $(go.TreeLayout, { nodeSpacing: 3 })
                    });

    // Define a node template showing class names.
    // Double-clicking opens up the documentation for that class.
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        {
          doubleClick: nodeDoubleClick,  // this function is defined below
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "lightyellow" }),
              $(go.TextBlock, "double-click\nfor link",
                { margin: 5 })
            )
        },
        $(go.Shape, { fill: "#1F4963", stroke: null }),
        $(go.TextBlock,
          { font: "bold 13px Helvetica, bold Arial, sans-serif",
            stroke: "white", margin: 3 },
          new go.Binding("text", "key")));

    // Define a trivial link template with no arrowhead
    diagram.linkTemplate =
      $(go.Link,  // the whole link panel
        { selectable: false },
        $(go.Shape));  // the link shape, with the default black stroke

    // Collect all of the data for the model of the class hierarchy
    var nodeDataArray = [];

    var xhttpOrgChart = new XMLHttpRequest();
    xhttpOrgChart.open("GET", "http://tarsan.ddns.net:8080/TARSAN/service/main?service=getRefAndURL&jsonPara=[]", false);
    xhttpOrgChart.send();
    var repOrgChart= xhttpOrgChart.responseText;
    var objOrgChart = JSON.parse(repOrgChart.substring(1, repOrgChart.length - 1));
     

     // set up the nodeDataArray
    for (var i = 0; i < objOrgChart.RefUrl.length; i++) {
      var counter = objOrgChart.RefUrl[i];
      nodeDataArray.push({ key: counter.url, parent: counter.ref});
      nodeDataArray.push({ key: counter.ref});    
    }
    
    

    function uniqBy(a, key) {
        var seen = {};
        return a.filter(function(item) {
            var k = key(item);        
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }
    b = uniqBy(nodeDataArray, JSON.stringify)
    //console.log(b);
    // Iterate over all of the classes in "go"
    // for (k in go) {
    //   var cls = go[k];
    //   if (!cls) continue;
    //   var proto = cls.prototype;
    //   if (!proto) continue;
    //   proto.constructor.className = k;  // remember name
    //   // find base class constructor
    //   var base = Object.getPrototypeOf(cls.prototype).constructor;
    //   if (base === Object) {  // "root" node?
    //     nodeDataArray.push({ key: k });
    //   } else {
    //     // add a node for this class and a tree-parent reference to the base class name
    //     nodeDataArray.push({ key: k, parent: base.className });
    //   }
    // }

    // Create the model for the hierarchy diagram
    diagram.model = new go.TreeModel(b);

    // Now collect all node data that are singletons
    var singlesArray = [];  // for classes that don't inherit from another class
    diagram.nodes.each(function(node) {
        if (node.linksConnected.count === 0) {
          singlesArray.push(node.data);
        }
      });

    // Remove the unconnected class nodes from the main Diagram
    diagram.model.removeNodeDataCollection(singlesArray);

    // Display the unconnected classes in a separate Diagram
    // var singletons =
    //   $(go.Diagram, "mySingletons",
    //     {
    //       nodeTemplate: diagram.nodeTemplate, // share the node template with the main Diagram
    //       layout:
    //         $(go.GridLayout,
    //           { wrappingColumn: 1,  // put the unconnected nodes in a column
    //             spacing: new go.Size(3, 3) }),
    //       model: new go.Model(singlesArray)  // use a separate model
    //     });
  }

  // When a Node is double clicked, open the documentation for the corresponding class in a new window
  function nodeDoubleClick(event, node) {
    
    var url=node.data.key.replace(/\.*\d$/g, "");
    console.log(url);
    window.open('http://'+url,'_blank');
  }
