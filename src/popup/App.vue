<template>
  <div>
    <div>current index: {{ currentIndex }}</div>
    <div @click="exp">export</div>
    <div @click="del">delete</div>
    <div v-if="!enabled" @click="enable">enable</div>
    <div v-else @click="disable">disable</div>
  </div>
</template>

<script>
import db from '../db.js'

export default {
  name: 'App',
  data() {
    return {
      currentIndex: null,
      enabled: false
    }
  },
  methods: {
    enable() {
      window.localStorage.setItem('ENABLED', true)
      this.enabled = true
    },
    disable() {
      window.localStorage.setItem('ENABLED', false)
      this.enabled = false
    },
    exp() {
      const cols = [
        'index',
        'className',
        'id',
        'tabId',
        'tag',
        'type',
        'path',
        'x',
        'y',
        'url',
        'title',
        'status',
        'text'
      ]
      db.events
        .where('index')
        .above(0)
        .toArray()
        .then(allEvents => {
          const dataString = allEvents
            .map(e =>
              cols
                .map(name => {
                  if (name === 'text') return e.text
                  return e[name]
                })
                .join(';')
            )
            .join('\n')
          const data = new Blob([cols.join(';') + '\n', dataString], { type: 'text/csv' })

          window.open(window.URL.createObjectURL(data))
        })
    },
    del() {
      db.events
        .where('index')
        .above(0)
        .delete()
        .then(() => {
          window.localStorage.setItem('CURRENT_INDEX', 0)
        })
    }
  },
  mounted() {
    db.events
      .where('index')
      .above(0)
      .last()
      .then(value => {
        this.currentIndex = value.index
      })

    this.enabled = window.localStorage.getItem('ENABLED') === 'true'
  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
