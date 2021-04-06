import db from './db.js'

const getIndex = () => {
  let index = parseInt(window.localStorage.getItem('CURRENT_INDEX'), 10) || 0
  index = index + 1
  window.localStorage.setItem('CURRENT_INDEX', index)
  return index
}

browser.runtime.onMessage.addListener(function(request, sender) {
  if(sender.url.includes('celonis.cloud')) {
    window.localStorage.setItem('ENABLED', true)
    chrome.browserAction.setIcon({ path: '/assets/stop.png' })
  }

  if (window.localStorage.getItem('ENABLED') === 'true' && sender.url.includes('celonis.cloud')) {
    if (['CLICK', 'SCROLL', 'MOUSEOVER', 'KEYPRESS', 'DRAG'].includes(request.type)) {
      db.events.add({
        index: getIndex(),
        tabId: sender.tab.id,
        ...request
      })
    }
  }
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (window.localStorage.getItem('ENABLED') === 'true') {
    db.events.add({
      timestamp: +new Date(),
      index: getIndex(),
      tabId,
      type: 'TABUPDATE',
      status: changeInfo.status,
      url: tab.url,
      title: tab.title
    })
  }
})

chrome.runtime.onMessage.addListener(function(request) {
  if (request.action === 'updateIcon') {
    if (request.value) {
      chrome.browserAction.setIcon({ path: '/assets/stop.png' })
    } else {
      chrome.browserAction.setIcon({ path: '/assets/start.png' })
    }
  }
})

chrome.browserAction.setIcon({ path: '/assets/start.png' })
