// Create brake, throttle, steering and speed element

class GroupGraphics{
  constructor (name, graphic){
    this.name = name;
    this.graphic = graphic;
    this.series = [];
  }
}

var dataEx = [{
  date: new Date(2021, 0, 1).getTime(),
  value: 100,
  value2: 220
}, {
  date: new Date(2021, 0, 2).getTime(),
  value: 320,
  value2: 300
}, {
  date: new Date(2021, 0, 3).getTime(),
  value: 216,
  value2: 120
}, {
  date: new Date(2021, 0, 4).getTime(),
  value: 150,
  value2: 190
}, {
  date: new Date(2021, 0, 5).getTime(),
  value: 156,
  value2: 190
}, {
  date: new Date(2021, 0, 6).getTime(),
  value: 199,
  value2: 120
}, {
  date: new Date(2021, 0, 7).getTime(),
  value: 114,
  value2: 300
}, {
  date: new Date(2021, 0, 8).getTime(),
  value: 269,
  value2: 290
}, {
  date: new Date(2021, 0, 9).getTime(),
  value: 190,
  value2: 290
}, {
  date: new Date(2021, 0, 10).getTime(),
  value: 380,
  value2: 170
}, {
  date: new Date(2021, 0, 11).getTime(),
  value: 250,
  value2: 200
}, {
  date: new Date(2021, 0, 12).getTime(),
  value: 110,
  value2: 210
}, {
  date: new Date(2021, 0, 13).getTime(),
  value: 185,
  value2: 85
}, {
  date: new Date(2021, 0, 14).getTime(),
  value: 105,
  value2: 244
}];




let brake = am5.Root.new("chartdiv_Brake");
let throttle = am5.Root.new("chartdiv_Throttle");
let steering = am5.Root.new("chartdiv_Steering");
let speed = am5.Root.new("chartdiv_Speed");

let graphics = [];
graphics.push(new GroupGraphics("brake",brake));
graphics.push(new GroupGraphics("throttle",throttle));
graphics.push(new GroupGraphics("steering",steering));
graphics.push(new GroupGraphics("speed",speed));

//receiving data from server
// let socket = new WebSocket("ws://192.168.2.40:8080");
//
// socket.onopen = function(e) {
//   alert("[open] Conexión establecida");
//   alert("Enviando al servidor");
//   //socket.send("Mi nombre es John");
// };
//
// socket.onmessage = function(event) {
//   alert(`[message] Datos recibidos del servidor: ${event.data}`);
// };
//
// socket.onclose = function(event) {
//   if (event.wasClean) {
//     alert(`[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`);
//   } else {
//     // ej. El proceso del servidor se detuvo o la red está caída
//     // event.code es usualmente 1006 en este caso
//     alert('[close] La conexión se cayó');
//   }
// };
//
// socket.onerror = function(error) {
//   alert(`[error]`);
// };

// Set theme s 
for(let gr of graphics){
  gr.graphic.setThemes([
    am5themes_Animated.new(gr.graphic)
  ]);




// Generate random data



let data = generateChartData();


// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
let chart = gr.graphic.container.children.push(am5xy.XYChart.new(gr.graphic, {
  focusable: true,
  panX: true,
  panY: true,
  wheelX: "panX",
  wheelY: "zoomX",
  pinchZoomX:true
}));

let easing = am5.ease.linear;


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xAxis = chart.xAxes.push(am5xy.DateAxis.new(gr.graphic, {
  maxDeviation: 0.5,
  groupData: false,
  extraMax:0.1, // this adds some space in front
  extraMin:-0.1,  // this removes some space form th beginning so that the line would not be cut off
  baseInterval: {
    timeUnit: "second",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(gr.graphic, {
    minGridDistance: 50
  }),
  tooltip: am5.Tooltip.new(gr.graphic, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(gr.graphic, {
  renderer: am5xy.AxisRendererY.new(gr.graphic, {})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.LineSeries.new(gr.graphic, {
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  valueXField: "date",
  tooltip: am5.Tooltip.new(gr.graphic, {
    pointerOrientation: "horizontal",
    labelText: "{valueY}"
  })
}));
let series2 = chart.series.push(am5xy.LineSeries.new(gr.graphic, {
  name: "Series 2",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  valueXField: "date",
  tooltip: am5.Tooltip.new(gr.graphic, {
    pointerOrientation: "horizontal",
    labelText: "{valueY}"
  })
}));

// tell that the last data item must create bullet
data[data.length - 1].bullet = true;
series.data.setAll(data);
series2.data.setAll(data);


// Create animating bullet by adding two circles in a bullet container and
// animating radius and opacity of one of them.
series.bullets.push(function(brake, series, dataItem) {  
  // only create sprite if bullet == true in data context
  if (dataItem.dataContext.bullet) {    
    let container = am5.Container.new(brake, {});
    let circle0 = container.children.push(am5.Circle.new(brake, {
      radius: 5,
      fill: am5.color(0xff0000)
    }));
    let circle1 = container.children.push(am5.Circle.new(brake, {
      radius: 5,
      fill: am5.color(0xff0000)
    }));

    circle1.animate({
      key: "radius",
      to: 20,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic),
      loops: Infinity
    });
    circle1.animate({
      key: "opacity",
      to: 0,
      from: 1,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic),
      loops: Infinity
    });

    return am5.Bullet.new(brake, {
      locationX:undefined,
      sprite: container
    })
  }
})
series2.bullets.push(function(brake, series, dataItem) {  
  // only create sprite if bullet == true in data context
  if (dataItem.dataContext.bullet) {    
    let container = am5.Container.new(brake, {});
    let circle0 = container.children.push(am5.Circle.new(brake, {
      radius: 5,
      fill: am5.color(0xff0000)
    }));
    let circle1 = container.children.push(am5.Circle.new(brake, {
      radius: 10,
      fill: am5.color(0x000000)
    }));

    circle1.animate({
      key: "radius",
      to: 20,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic),
      loops: Infinity
    });
    circle1.animate({
      key: "opacity",
      to: 0,
      from: 1,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic),
      loops: Infinity
    });
    interval();
    return am5.Bullet.new(brake, {
      locationX:undefined,
      sprite: container
    })
  }
})


// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(gr.graphic, {
  xAxis: xAxis
}));
cursor.lineY.set("visible", false);


// Update data every second
function interval (){setInterval(function () {
  addData(easing,series,xAxis,yAxis);
  addData(easing,series2,xAxis,yAxis);
}, 1000)
}





// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);

gr.series.push(series);
gr.series.push(series2);

var exporting = am5plugins_exporting.Exporting.new(gr.graphic, {
  menu: am5plugins_exporting.ExportingMenu.new(gr.graphic, {}),
    dataSource: dataEx
});
exporting.events.on("dataprocessed", function(ev) {
  for(var i = 0; i < ev.data.length; i++) {
    ev.data[i].sum = ev.data[i].value + ev.data[i].value2;
  }
});

}





