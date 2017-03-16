const canvas = document.getElementById('mainCanvas')
const c = canvas.getContext('2d')

class Block {
    constructor(c, center, dimension) {
        c.strokeStyle = '#000'
        c.fillStyle = '#000'

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
    render() {
        let cc = this.c
        cc.beginPath()
        cc.rect(this.upperLeft.x, this.upperLeft.y, this.width, this.height)
        cc.stroke()
        cc.closePath()
    }
    renderWithoutStroke() {
        let cc = this.c
        cc.beginPath()
        cc.rect(this.upperLeft.x, this.upperLeft.y, this.width, this.height)
        cc.closePath()
    }
    computeColor(c) {
        let ul = this.upperLeft
        c.getImageData(ul.x, ul.y, this.width, this.height)
    }
}

class Grid {
    constructor(c, start={x: 60, y: 80,height: 50, width: 50, cols: 5, rows: 3}) {
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
        console.time("trvanie")
        for (let i = 0, len = this.blocks.length; i < len; i++) {
            this.blocks[i].computeColor(this.c)
        }
        console.timeEnd("trvanie")
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

    render() {
        let c = this.c,
            upperLeft = this.upperLeft,
            bottomRight = this.bottomRight

        c.beginPath()
        c.rect(upperLeft.x, upperLeft.y, this.width, this.height)
        this._renderAllBlocks()
        c.stroke()
        this._computeGridColors()
        c.closePath()

    }
}


function renderGrid() {
    c.clearRect(0,0,500,500)

    let x = document.querySelector('input[name="x"]').value,
        y = document.querySelector('input[name="y"]').value,
        width = document.querySelector('input[name="width"]').value,
        height = document.querySelector('input[name="height"]').value,
        cols = document.querySelector('input[name="cols"]').value,
        rows = document.querySelector('input[name="rows"]').value

        let a = new Grid(c, {x,y,width,height,cols,rows})
        a.render()
}

renderGrid()
