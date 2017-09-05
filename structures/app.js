import {initApp, getStore, readyStore, deleteStore, defaultStore, mapToProps} from '../actions/global_actions'

const app = {
  items: {},
  create (key, context) {
    return initApp(this, key, context)
  },
  load (key) {
    return getStore(this, key)
  },
  remove (key) {
    return deleteStore(this, key)
  },
  describe (key) {
    console.log(key.toUpperCase())
    console.table(this.items.instance[key])
  },
  ready (key){
    return readyStore(this, key)
  },
  default () {
    if(!this.items.instance){
      return defaultStore(this, 'default')
    }
    return this.load('default')
  },
  map (key, context) {
    if(typeof key !== 'string'){
      const context = key
      return mapToProps(this, 'default', context)
    }
    return mapToProps(this, key, context)
  }
}

export default app
