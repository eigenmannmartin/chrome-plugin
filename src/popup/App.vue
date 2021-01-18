<template>
  <div>
    <sui-grid :columns="2">
      <sui-grid-row>
        <sui-grid-column>
          <div>
            <tempalte v-if="enabled">Is recording</tempalte><template v-else>Is <b>not</b> recording</template>
          </div>
        </sui-grid-column>
        <sui-grid-column>
          <div>current index: {{ currentIndex }}</div>
        </sui-grid-column>
      </sui-grid-row>

      <sui-grid-row>
        <sui-grid-column>
          <sui-button v-if="!enabled" @click="enable" color="green">enable</sui-button>
          <sui-button v-else @click="disable" color="red">disable</sui-button>
        </sui-grid-column>
      </sui-grid-row>

      <sui-grid-row>
        <sui-grid-column>
          <sui-button @click="exp" :loading="isExporting" color="green" basic>export</sui-button>
        </sui-grid-column>
        <sui-grid-column>
          <sui-button @click="del" :loading="isDeleting" color="red" basic :disabled="enabled">delete</sui-button>
        </sui-grid-column>
      </sui-grid-row>
    </sui-grid>
  </div>
</template>

<script>
import db from '../db.js'
import { saveAs } from 'file-saver'

export default {
  name: 'App',
  data() {
    return {
      currentIndex: null,
      enabled: false,
      isExporting: false,
      isDeleting: false
    }
  },
  methods: {
    enable() {
      window.localStorage.setItem('ENABLED', true)
      this.enabled = true
      chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: true
      })
    },
    disable() {
      window.localStorage.setItem('ENABLED', false)
      this.enabled = false
      chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: false
      })
    },
    exp() {
      this.isExporting = true
      const cols = [
        'timestamp',
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
        'key',
        'altKey',
        'shiftKey',
        'scrollY',
        'text',
        'name'
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
          saveAs(data, 'export.csv')

          //window.open(window.URL.createObjectURL(data))
        })
        .finally(() => {
          this.isExporting = false
        })
    },
    del() {
      this.isDeleting = true
      db.events
        .where('index')
        .above(0)
        .delete()
        .then(() => {
          window.localStorage.setItem('CURRENT_INDEX', 0)
          this.currentIndex = 0
        })
        .finally(() => {
          this.isDeleting = false
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
