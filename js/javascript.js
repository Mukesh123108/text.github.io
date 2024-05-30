const setStyles = ({ target, h, w, x, y }) =>{
    if (h) target.style.height = h
    if (w) target.style.width = w
    target.style.transform = `translate(${x || 0}, ${y || 0})`
  }

  const elements = {
    body: document.querySelector('.wrapper'),
    myPose: {
      wrapper: document.querySelector('.myPose-wrapper'),
      body: document.querySelector('.myPose-body'),
    
     
      bodyMarker: document.querySelector('.myPose-body-marker'),
      
      beakMarker: document.querySelector('.beak-marker'),
    
     
      legs: document.querySelectorAll('.leg'),
    },
    marker: document.querySelectorAll('.marker'),
  }

  const positionMarker = (i, pos) => {
    elements.marker[i].style.left = px(pos.x)
    elements.marker[i].style.top = px(pos.y)
  }

  const px = num => `${num}px`
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))

  const setAngle = ({ target, angle }) => {
    target.style.transform = `rotate(${angle}deg)`
  }

  const getTargetAngle = () =>{
    const { x, y } = getmyPoseBeakPos()
    return angle = radToDeg(Math.atan2(y - control.y, x - control.x)) - 90
  }
  
  const control = {
    x: null, 
    y: null,
    myPoseTimer: null,
  }

  const getValueWithinBound = ({ value, min, max, buffer }) => {
    return value = value < (min - buffer)
    ? min - buffer
    : value > (max + buffer)
    ? max + buffer
    : value
  }

  const moveWithinBound = ({ target, boundary, pos, buffer }) => {
    const { left: hX, top: hY, width, height } = boundary.getBoundingClientRect()

    setStyles({ 
      target, 
      x: px(getValueWithinBound({
          value: pos.x - (target.clientWidth / 2),
          min: hX,
          max: hX + width - target.clientWidth,
          buffer: buffer.x
        }) - hX), 
      y: px(getValueWithinBound({
          value: pos.y - (target.clientHeight / 2),
          min: hY,
          max: hY + height - target.clientHeight,
          buffer: buffer.y
        }) - hY), 
    })
  }

  const movemyPose = pos => {
    control.x = pos.x
    control.y = pos.y
    positionMarker(0, control)

    const { body, bodyMarker, wrapper, headMarker  } = elements.myPose

    ;[
      { 
        target: body, 
        boundary: wrapper,
      },
      { 
        target: bodyMarker, 
        boundary: wrapper,
      },
     
      { 
        target: headMarker, 
        boundary: bodyMarker,
      },
      
      
      
    ].forEach(item => {
        moveWithinBound({
          target: item.target,
          boundary: item.boundary,
          pos: control,
          buffer: item.buffer || { x: 15, y: 15 } 
        })
      })

    
  }

  const getmyPoseBeakPos = () => {
    const { x, y, width, height } = elements.myPose.beakMarker.getBoundingClientRect()
    return {
      x: x + (width / 2),
      y: y + (height / 2)
    }
  }

  const myClickTowardsClick = () => {
    const { x, y } = elements.myPose.wrapper.getBoundingClientRect()
    const newX = control.x + (x - getmyPoseBeakPos().x)
    const newY = control.y + (y - getmyPoseBeakPos().y)

    positionMarker(1, {
      x: newX,
      y: newY
    })
    setStyles({
      target: elements.myPose.wrapper,
      x: px(newX),
      y: px(newY)
    })

    elements.myPose.legs.forEach(leg => {
      leg.classList.add('swim')
    })
    setTimeout(()=>{
      elements.myPose.legs.forEach(leg => {
        leg.classList.remove('swim')
      })
    }, 3000)
  }

  const positionmyPose = () => {
    clearTimeout(control.myPoseTimer)
    const { offsetWidth, offsetHeight } = elements.body
    control.x = offsetWidth / 2
    control.y = (offsetHeight / 2) - elements.myPose.wrapper.clientHeight

    myClickTowardsClick()
    movemyPose({
      x: control.x + 10,
      y: control.y + 100
    })
    control.myPoseTimer = setTimeout(()=>{
      movemyPose({
        x: control.x,
        y: control.y + 80
      })
    }, 5000)
  }


  elements.body.addEventListener('mousemove', e => movemyPose({
    x: e.pageX,
    y: e.pageY
  }))
  window.addEventListener('click', myClickTowardsClick)
  window.addEventListener('resize', positionmyPose) 
  
  positionmyPose()
