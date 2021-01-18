const getBasics = event => ({
  timestamp: +new Date(),
  tag: event.target.tagName,
  id: event.target.id,
  className: event.target.className,
  name: event.target.name,
  y: event.y,
  x: event.x,
  title: event.title,
  path: event.path
    .map(element => {
      const boundingRect = element && element.getBoundingClientRect ? element.getBoundingClientRect() : {}
      return (
        [
          ...['top', 'left', 'bottom', 'right'].map(prop => [prop, boundingRect[prop]]),

          ...['tagName', 'className', 'id', 'title', 'name'].map(prop => [prop, element[prop]])
        ]
          // eslint-disable-next-line no-unused-vars
          .filter(([_, data]) => Boolean(data))
          .map(([prop, data]) => `${prop}:${data}`)
          .filter(Boolean)
          .join('|')
      )
    })
    .filter(Boolean)
    .join('<')
})

const clickHandler = event => {
  browser.runtime.sendMessage({
    type: 'CLICK',
    ...getBasics(event),
    text: event.target.innerText?.slice(0, 50).replace(/(\W)/g, '')
  })
}
const scrollkHandler = event => {
  browser.runtime.sendMessage({
    type: 'SCROLL',
    ...getBasics(event),
    scrollY: window.scrollY
  })
}
/*
const mouseOverHandler = event => {
  browser.runtime.sendMessage({
    type: 'MOUSEOVER',
    ...getBasics(event),
    text: event.target.innerText.slice(0, 50).replace(/(\W)/g, '')
  })
}*/

const keypressHandler = event => {
  browser.runtime.sendMessage({
    type: 'KEYPRESS',
    ...getBasics(event),
    text: event.target.innerText.slice(0, 50).replace(/(\W)/g, ''),
    key: event.key,
    altKey: event.altKey,
    shiftKey: event.shiftKey
  })
}

const dragHandler = event => {
  browser.runtime.sendMessage({
    type: 'DRAG',
    ...getBasics(event)
  })
}

document.addEventListener('click', clickHandler, true)
document.addEventListener('scroll', scrollkHandler, true)
//document.addEventListener('mouseover', mouseOverHandler, true)
document.addEventListener('keypress', keypressHandler, true)
document.addEventListener('dragstart', dragHandler, true)
document.addEventListener('dragend', dragHandler, true)
