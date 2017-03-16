const canvas1 = document.getElementById('canvasUnder')
const canvas2 = document.getElementById('canvasOver')
const c = canvas1.getContext('2d')
const d = canvas2.getContext('2d')
var TH = 28

class Block {
    constructor(c, center, dimension) {
        this.state = false
        this.activeRectColor = [0, 255, 0, 1]

        d.strokeStyle = '#FFFFFF'
        d.fillStyle = '#FFFFFF'


        this.c = c
        this.center = center
        this.dimension = dimension
        this.upperLeft = {
            x: center.x - dimension.width/2,
            y: center.y - dimension.height/2
        }
        this.bottomRight = {
            x: center.x + dimension.width/2,
            y: center.y + dimension.height/2
        }
        this.width = dimension.width
        this.height = dimension.height
    }
    _decreaseActiveRect() {
        for (let i = 0; i < this.activeRectColor.length; i++) {
            this.activeRectColor[i] *= 0.95
        }
    }
    render() {
        let r = this.activeRectColor[0],
        g = this.activeRectColor[1],
        b = this.activeRectColor[2],
        a = this.activeRectColor[3]

        this._decreaseActiveRect()
        let cc = this.c
        d.beginPath()
        d.fillStyle = `rgba(${r},${g},${b},${a})`
        d.fillRect(this.upperLeft.x, this.upperLeft.y, this.width, this.height)
        d.rect(this.upperLeft.x, this.upperLeft.y, this.width, this.height)
        d.stroke()
        d.closePath()
    }
    renderWithoutStroke() {
        let cc = this.c
        d.beginPath()
        d.rect(this.upperLeft.x, this.upperLeft.y, this.width, this.height)
        d.closePath()
    }
    computeColor(c) {
        let average_color = [0,0,0,0], // R,G,B,A
            ul = this.upperLeft,
            data = c.getImageData(ul.x + 1, ul.y + 1, this.width - 1, this.height - 1).data

        for (let canal = 0; canal < 4; canal++) {
            for (let i = canal; i < data.length; i+= 4) {
                average_color[canal] += data[i]
            }
            average_color[canal] = average_color[canal] * 4 / data.length
        }
        return average_color
    }

    _computeAverage(arr) {
        return (arr[0] + arr[1] + arr[2]) / 3
    }

    hasChanged() {
        let col_arr = this.computeColor(this.c)
        let avg = this._computeAverage(col_arr)

        if (avg > TH && this.state == false ) {
            this.state = true
            this.activeRectColor = [0,255,0,1]
            return true
        } else if (avg <= TH && this.state == true) {
            this.state = false
            this.activeRectColor = [0,255,0,1]
            return true
        }

        return false
    }
}







class Grid {
    constructor(c, start={x: 437, y: 338,height: 406, width: 770, cols: 8, rows: 6}) {
        c.strokeStyle = '#FFFFFF'
        this.c = c
        this.cols = start.cols
        this.rows = start.rows
        this.width = start.width
        this.height = start.height
        this.x = start.x
        this.y = start.y
        this.upperLeft = {x: start.x - (start.width/2), y: start.y - start.height/2}
        this.bottomRight = {x: start.x + start.width/2, y: start.y + start.height/2}

        this.blocks = this._getBlocks()
    }

    _computeGridColors() {
        // console.time("trvanie")
        for (let i = 0, len = this.blocks.length; i < len; i++) {
            this.blocks[i].computeColor(this.c)
        }
        // console.timeEnd("trvanie")
    }

    _renderAllBlocks() {
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].render()
        }
    }

    _getBlocks() {
        let row,
            col,
            colWidth = this.width / this.cols,
            rowHeight = this.height / this.rows,
            tmp_block,
            blocks = []

        for (row = 0; row < this.rows; row++) {
            for (col=0; col < this.cols; col++) {
                tmp_block = new Block(
                    this.c,
                    {
                        x:  this.upperLeft.x + col * colWidth + colWidth/2,
                        y:  this.upperLeft.y + row * rowHeight + rowHeight/2
                    },
                    {
                        width: colWidth,
                        height: rowHeight
                    }
                )
                blocks.push(tmp_block)
            }
        }
        return blocks
    }
    setWidth() {
        this.heightBlocks = a
        this._recomputeBlocks()
        this.render()
    }
    setHeight(a) {
        this.heightWidth = a
        this._recomputeBlocks()
        this.render()
    }
    setColumns(a) {
        this.cols = a
    }
    setRows(a) {
        this.rows = a
    }

    checkForChange() {
        let bool
        for (let i = 0; i < this.blocks.length; i++) {
            bool = this.blocks[i].hasChanged()

            if (bool) {
                console.log(`SOMETHING HAS CHANGED IN BLOCK ${i}`)
            }
        }
    }

    render() {
        let c = this.c,
            upperLeft = this.upperLeft,
            bottomRight = this.bottomRight

        d.beginPath()
        d.globalAlpha = 0
        d.clearRect(0,0,10000,10000)
        d.globalAlpha = 1
        d.closePath()


        d.beginPath()
        d.rect(upperLeft.x, upperLeft.y, this.width, this.height)
        this._renderAllBlocks()
        this._computeGridColors()
        d.stroke()
        d.closePath()
    }
}


const html_elements = {
    x: document.querySelector('input[name="x"]'),
    y: document.querySelector('input[name="y"]'),
    width: document.querySelector('input[name="width"]'),
    height: document.querySelector('input[name="height"]'),
    cols: document.querySelector('input[name="cols"]'),
    rows: document.querySelector('input[name="rows"]'),
    th: document.querySelector('input[name="th"]')
}


document.addEventListener('DOMContentLoaded', function(){
    var v = document.querySelector('#video');
    var context = c

    canvas1.height = v.videoHeight
    canvas1.width = v.videoWidth
    canvas2.height = v.videoHeight
    canvas2.width = v.videoWidth
    let cw = v.videoWidth
    let ch = v.videoHeight

    v.addEventListener('play', function(){
        draw(this, context, cw, ch);
    }, false);

}, false);



function draw(v,c,w,h) {
    if (v.paused || v.ended) return false;
    c.drawImage(v, 0, 0, w, h);
    MainGrid.render()
    MainGrid.checkForChange()
    setTimeout(function() {
        draw(v, c ,w ,h)
    }, 20);
}



var MainGrid = new Grid(c)

function renderGrid() {

    let x = html_elements.x.value,
        y = html_elements.y.value,
        width = html_elements.width.value,
        height = html_elements.height.value,
        cols = html_elements.cols.value,
        rows = html_elements.rows.value,
        TH = html_elements.th.value

        MainGrid = new Grid(c, {x,y,width,height,cols,rows})
        MainGrid.render()
}
