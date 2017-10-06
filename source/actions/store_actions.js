import {Store} from '../interfaces/store_type'
import {boundTo} from '../managers/global_stores'

const initStore = (store, key, context, isDefault) => {
  boundTo[key] = context
  store.instance[key] = new Store(boundTo[key], key, isDefault)
  store.loaded = true
  return store.instance
}

const mergeContext = (store, key, context, isDefault) => {
  const oldContext = boundTo[key]
  boundTo[key] = {...oldContext, ...context}
  store.instance[key] = new Store(boundTo[key],key, isDefault)
  return store.instance
}

export {initStore, mergeContext}
