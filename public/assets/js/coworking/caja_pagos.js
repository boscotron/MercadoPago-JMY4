jQuery(function ($) { 
    $(document).ready(function () {
        var dataViews = {
            labels: ['Mon', 'Isa', 'Cri', 'Nat', 'Kar'],
            series: [
              [-21,0,10,150,5000]
            ]
          };
        
          var optionsViews = {
            seriesBarDistance: 10,
            classNames: {
              bar: 'ct-bar'
            },
            axisX: {
              showGrid: false,
        
            },
            height: "250px"
        
          };
        
          var responsiveOptionsViews = [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                }
              }
            }]
          ];
        
          Chartist.Bar('#graficaSaldos', dataViews, optionsViews, responsiveOptionsViews); 
    });
});
