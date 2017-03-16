const elemLeft = canvas.offsetLeft
const elemTop = canvas.offsetTop

canvas.addEventListener('click', function(event) {
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;

    console.log(x, y)
    console.log(a.wasHit(x,y))
}, false)
