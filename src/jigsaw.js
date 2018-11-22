const l = 42, r = 10, w = 310, h = 155, PI = Math.PI
const L = l + r * 2

/**
 * @description 基于 http://www.jq22.com/jquery-info19009
 * 优化了使用方式，支持服务端渲染
 * 解决了滑块移动过程中出现抖动的bug
 * TODO 支持touch事件
 * TODO loading
 */
class Jigsaw {

  constructor(el, opts) {
    this.defaultOpts = {
      success: null,
      fail: null,
      autoInit: true
    }
    this.opts = Object.assign({}, this.defaultOpts, opts)
    this.el = el
    this.success = this.opts.success
    this.fail = this.opts.fail
    this.isSuccess = false
    if (this.opts.autoInit) {
      this.initDOM()
      this.initImg()
      this.draw()
      this.bindEvents()
    }
  }

  init() {
    this.initDOM()
    this.initImg()
    this.draw()
    this.bindEvents()
  }

  createCanvas (width, height) {
    const canvas = this.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }

  createElement (tagName) {
    return document.createElement(tagName)
  }

  createImg (onload) {
    const img = this.createElement('img')
    img.crossOrigin = "Anonymous"
    img.onload = onload
    img.onerror = () => {
      img.src = this.getRandomImg()
    }
    img.src = this.getRandomImg()
    return img
  }

  getRandomImg () {
    return 'https://picsum.photos/300/150/?image=' + this.getRandomNumberByRange(0, 100)
  }

  getRandomNumberByRange (start, end) {
    return Math.round(Math.random() * (end - start) + start)
  }

  drawCard (ctx, operation, x, y) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + l / 2, y)
    ctx.arc(x + l / 2, y - r + 2, r, 0, 2 * PI)
    ctx.lineTo(x + l / 2, y)
    ctx.lineTo(x + l, y)
    ctx.lineTo(x + l, y + l / 2)
    ctx.arc(x + l + r - 2, y + l / 2, r, 0, 2 * PI)
    ctx.lineTo(x + l, y + l / 2)
    ctx.lineTo(x + l, y + l)
    ctx.lineTo(x, y + l)
    ctx.lineTo(x, y)
    ctx.fillStyle = '#fff'
    ctx[operation]()
    ctx.beginPath()
    ctx.arc(x, y + l / 2, r, 1.5 * PI, 0.5 * PI)
    ctx.globalCompositeOperation = "xor"
    ctx.fill()
  }

  addClass(tag, className) {
    tag.classList.add(className)
  }

  removeClass(tag, className) {
    tag.classList.remove(className)
  }

  sum (x, y) {
    return x + y
  }

  square(x) {
    return x * x
  }

  initDOM() {
    const canvas = this.createCanvas(w, h)
    const block = canvas.cloneNode(true)
    const sliderContainer = this.createElement('div')
    const refreshIcon = this.createElement('div')
    const sliderMask = this.createElement('div')
    const slider = this.createElement('div')
    const sliderIcon = this.createElement('span')
    const text = this.createElement('span')
    block.className = 'block'
    sliderContainer.className = 'sliderContainer'
    refreshIcon.className = 'refreshIcon'
    sliderMask.className = 'sliderMask'
    slider.className = 'slider'
    sliderIcon.className = 'sliderIcon'
    text.innerHTML = '向右滑动滑块填充拼图'
    text.className = 'sliderText'
    const el = this.el
    el.appendChild(canvas)
    el.appendChild(refreshIcon)
    el.appendChild(block)
    slider.appendChild(sliderIcon)
    sliderMask.appendChild(slider)
    sliderContainer.appendChild(sliderMask)
    sliderContainer.appendChild(text)
    el.appendChild(sliderContainer)
    Object.assign(this, {
      canvas,
      block,
      sliderContainer,
      refreshIcon,
      slider,
      sliderMask,
      sliderIcon,
      text,
      canvasCtx: canvas.getContext('2d'),
      blockCtx: block.getContext('2d')
    })
  }

  initImg () {
    const img = this.createImg(() => {
      this.canvasCtx.drawImage(img, 0, 0, w, h)
      this.blockCtx.drawImage(img, 0, 0, w, h)
      const y = this.y - r * 2 + 2
      const ImageData = this.blockCtx.getImageData(this.x, y, L, L)
      this.block.width = L
      this.blockCtx.putImageData(ImageData, 0, y)
    })
    this.img = img
  }

  draw () {
    this.x = this.getRandomNumberByRange(L + 10, w - (L + 10))
    this.y = this.getRandomNumberByRange(10 + r * 2, h - (L + 10))
    this.drawCard(this.canvasCtx, 'fill', this.x, this.y)
    this.drawCard(this.blockCtx, 'clip', this.x, this.y)
  }

  clean() {
    this.canvasCtx.clearRect(0, 0, w, h)
    this.blockCtx.clearRect(0, 0, w, h)
    this.block.width = w
  }

  bindEvents() {
    this.el.onselectstart = () => false
    this.refreshIcon.onclick = () => {
      this.reset()
    }
    let originX, originY, trail = [], isMouseDown = false
    this.slider.addEventListener('mousedown', function (e) {
      originX = e.x, originY = e.y
      isMouseDown = true
    })
    document.addEventListener('mousemove', (e) => {
      if (!isMouseDown || this.isSuccess) return false
      const moveX = e.x - originX
      const moveY = e.y - originY
      if (moveX < 0 || moveX + 38 >= w) return false
      // 计算滑块移动的位置
      let x = moveX > w - 40 ?  w - 40 : moveX
      let overflow = false
      if (x >= w - 40) overflow = true
      // 溢出判断
      this.slider.style.left = x + 'px'
      this.addClass(this.sliderContainer, 'sliderContainer_active')
      this.sliderMask.style.width = (x + 1) + 'px' // border-box
      trail.push(moveY)
      if (overflow) return
      // 计算小缺块的移动位置
      var blockLeft = (w - 40 - 20) / (w - 40) * moveX
      // let blockLeft = moveX
      this.block.style.left = blockLeft + 'px'
    })
    document.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return false
      isMouseDown = false
      if (e.x == originX) return false
      this.removeClass(this.sliderContainer, 'sliderContainer_active')
      this.trail = trail
      const {spliced, TuringTest} = this.verify()
      if (spliced) {
        if (TuringTest) {
          this.addClass(this.sliderContainer, 'sliderContainer_success')
          this.isSuccess = true
          this.el.removeChild(this.refreshIcon)
          this.success && this.success()
        } else {
          this.addClass(this.sliderContainer, 'sliderContainer_fail')
          this.text.innerHTML = '再试一次'
          this.reset()
        }
      } else {
        this.addClass(this.sliderContainer, 'sliderContainer_fail')
        this.fail && this.fail()
        setTimeout(() => {
          this.reset()
        }, 1000)
      }
    })
  }

  verify() {
    const arr = this.trail
    const average = arr.reduce(this.sum) / arr.length
    const deviations = arr.map(x => x - average)
    const stddev = Math.sqrt(deviations.map(this.square).reduce(this.sum) / arr.length)
    const left = parseInt(this.block.style.left)
    return {spliced: Math.abs(left - this.x) < 10, TuringTest: average !== stddev,}
  }

  reset () {
    this.sliderContainer.className = 'sliderContainer'
    this.slider.style.left = 0
    this.block.style.left = 0
    this.sliderMask.style.width = 0
    this.isSuccess = false
    this.clean()
    this.img.src = this.getRandomImg()
    this.draw()
  }
}

export default Jigsaw
