import {initStore, mergeContext} from '../actions/store_actions'

const store = {
  instance: {},
  stateful (key, context, isDefault) {
    return initStore(this, key, context, isDefault)
  },
  merge (key, context, isDefault){
    return mergeContext(this, key, context, isDefault)
  }
}

export {store as Store}
