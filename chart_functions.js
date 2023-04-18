let value = 100;
function generateChartData() {
    let chartData = [];
    let firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 1000);
    firstDate.setHours(0, 0, 0, 0);
  
    for (let i = 0; i < 50; i++) {
      let newDate = new Date(firstDate);
      newDate.setSeconds(newDate.getSeconds() + i);
  
      value += (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10;
  
      chartData.push({
        date: newDate.getTime(),
        value: value
      });
    }
    return chartData;
  }

  function addData(easing,series,xAxis,yAxis) {
    let lastDataItem = series.dataItems[series.dataItems.length - 1];
    //console.log(series.dataItems[series.dataItems.length - 1]);
    let lastValue = lastDataItem.get("valueY");
    let newValue = value + ((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
    let lastDate = new Date(lastDataItem.get("valueX"));
    let time = am5.time.add(new Date(lastDate), "second", 1).getTime();
    //series.data.removeIndex(0);
    series.data.push({
      date: time,
      value: newValue
    })
  
    let newDataItem = series.dataItems[series.dataItems.length - 1];
    newDataItem.animate({
      key: "valueYWorking",
      to: newValue,
      from: lastValue,
      duration: 600,
      easing: easing
    });
  
    // use the bullet of last data item so that a new sprite is not created
    newDataItem.bullets = [];
    newDataItem.bullets[0] = lastDataItem.bullets[0];
    newDataItem.bullets[0].get("sprite").dataItem = newDataItem;
    // reset bullets
    lastDataItem.dataContext.bullet = false;
    lastDataItem.bullets = [];
  
  
    let animation = newDataItem.animate({
      key: "locationX",
      to: 0.5,
      from: -0.5,
      duration: 600
    });
    if (animation) {
      let tooltip = xAxis.get("tooltip");
      if (tooltip && !tooltip.isHidden()) {
        animation.events.on("stopped", function () {
          xAxis.updateTooltip();
        })
      }
    }
  }
