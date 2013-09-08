(function () {
    console.log("hi?");

    var plot = makePlot(document.getElementById("canvas"), 2, 2, 1, 0);
        
    plot.drawAxis(.1, .1, .02, .02);
}());