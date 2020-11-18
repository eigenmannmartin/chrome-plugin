import Dexie from 'dexie'
const db = new Dexie('recordings')
db.version(1).stores({ events: '++index,tabID,className,id,tag,path,type,x,y,url,title,status' })

export default db
