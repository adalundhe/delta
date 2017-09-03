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
  default (key) {
    return defaultStore(this, key)
  },
  map (key, props) {
    return mapToProps(this, key, props)
  }
}

export default app
