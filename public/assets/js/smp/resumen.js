$(document).ready(function () {

       red()
        carga();
});

function red() {
    let a = {
        p:{
            w:$("#colpiechart").width()
        },
        bh:{
            w:$("#colbarcharts").width()
        },
        bv:{
            w:$("#colbarchartsver").width()
        },
        l:{
            w:$("#collinecharts").width()
        },
        
    };
    console.log("aaaaaa",a);
    
    $("#piechart").width(a.p.w);
    $("#barcharts").width(a.bh.w);
    $("#barchartsver").width(a.bv.w);
    $("#linecharts").width(a.l.w);

}
function carga() {
    google.charts.load('current', {'packages':['corechart','bar','line']});
    google.charts.setOnLoadCallback(drawChart);
    google.charts.setOnLoadCallback(drawChart2);
    google.charts.setOnLoadCallback(drawChart3);
    google.charts.setOnLoadCallback(drawChart4);

    function drawChart4() {

        var data = google.visualization.arrayToDataTable([
            ['Acciones', '2019 Acciones',],
            ['Acción 1', 8175000],
            ['Acción 2', 3792000],
            ['Acción 3', 2695000],
            ['Acción 4', 2099000],
            ['Acción 5', 1526000]
          ]);
    
          var options = {
            title: 'Título gráfica',
            subtitle: 'Información: 2014-2017',
            chartArea: {width: '50%'},
            hAxis: {
              title: 'Total ',
              minValue: 0
            },
            vAxis: {
              title: 'Nombre de acciones'
            }
          };
    
          var chart = new google.visualization.BarChart(document.getElementById('barcharts'));
    
          chart.draw(data, options);
    }    
    function drawChart3() {

        
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Alcance');
      data.addColumn('number', 'Habitantes');
      data.addColumn('number', 'Municipios');
      data.addColumn('number', 'Colonias');

      data.addRows([
        [1,  37.8, 80.8, 41.8],
        [2,  30.9, 69.5, 32.4],
        [3,  25.4,   57, 25.7],
        [4,  11.7, 18.8, 10.5],
        [5,  11.9, 17.6, 10.4],
        [6,   8.8, 13.6,  7.7],
        [7,   7.6, 12.3,  9.6],
        [8,  12.3, 29.2, 10.6],
        [9,  16.9, 42.9, 14.8],
        [10, 12.8, 30.9, 11.6],
        [11,  5.3,  7.9,  4.7],
        [12,  6.6,  8.4,  5.2],
        [13,  4.8,  6.3,  3.6],
        [14,  4.2,  6.2,  3.4]
      ]);

      var options = {
        chart: {
            title: 'Título gráfica',
            subtitle: 'Información: 2014-2017',
        },
        width: $("#colbarchartsver").width(),
        height: $("#colbarchartsver").height()
      };

      var chart = new google.charts.Line(document.getElementById('barchartsver'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }    
    function drawChart2() {

        var data = google.visualization.arrayToDataTable([
            ['Año', 'Programas', 'Objetivos', 'Acciones'],
            ['2014', 1000, 400, 200],
            ['2015', 1170, 460, 250],
            ['2016', 660, 1120, 300],
            ['2017', 1030, 540, 350]
          ]);
  
          var options = {
            chart: {
              title: 'Título gráfica',
              subtitle: 'Información: 2014-2017',
            }
          };
  
          var chart = new google.charts.Bar(document.getElementById('linecharts'));
  
          chart.draw(data, google.charts.Bar.convertOptions(options));
    }    
    function drawChart() {

        var data = google.visualization.arrayToDataTable([
            ['Tareas', 'Porciento'],
            ['Tarea 1', 80],
            ['Tarea 2',      2],
            ['Tarea 3',  2],
            ['Tarea 4', 2],
            ['Tarea 5',    7]
        ]);

        var options = {
            title: 'Gráfica de píe - tareas'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
    }    
    return true;
}
