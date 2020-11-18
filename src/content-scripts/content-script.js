const clickHandler = event => {
  browser.runtime.sendMessage({
    type: 'CLICK',
    tag: event.target.tagName,
    text: event.target.innerText.slice(0, 50).replace(/(\W)/g, ''),
    y: event.y,
    x: event.x,
    id: event.target.id,
    path: event.path
      .map(element => element.tagName)
      .filter(Boolean)
      .join('<'),
    className: event.target.className
  })
}
const scrollkHandler = event => {
  browser.runtime.sendMessage({
    type: 'SCROLL',
    tag: event.target.tagName,
    y: event.y,
    x: event.x,
    id: event.target.id,
    scrollY: window.scrollY,
    path: event.path
      .map(element => element.tagName)
      .filter(Boolean)
      .join('<'),
    className: event.target.className
  })
}
const mouseOverHandler = event => {
  browser.runtime.sendMessage({
    type: 'MOUSEOVER',
    tag: event.target.tagName,
    text: event.target.innerText.slice(0, 50).replace(/(\W)/g, ''),
    y: event.y,
    x: event.x,
    id: event.target.id,
    path: event.path
      .map(element => element.tagName)
      .filter(Boolean)
      .join('<'),
    className: event.target.className
  })
}

const keypressHandler = event => {
  browser.runtime.sendMessage({
    type: 'KEYPRESS',
    tag: event.target.tagName,
    text: event.target.innerText.slice(0, 50).replace(/(\W)/g, ''),
    id: event.target.id,
    path: event.path
      .map(element => element.tagName)
      .filter(Boolean)
      .join('<'),
    key: event.key,
    altKey: event.altKey,
    shiftKey: event.shiftKey
  })
}
document.addEventListener('click', clickHandler, true)
document.addEventListener('scroll', scrollkHandler, true)
document.addEventListener('mouseover', mouseOverHandler, true)
document.addEventListener('keypress', keypressHandler, true)
