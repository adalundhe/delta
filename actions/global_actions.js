import {Store} from '../structures/store'

const initApp = (app,key,context) => {
  if(!app.ready(key) || !key){
    app.items = Store
    return app.items.stateful(key, context, false)[key]
  } else {
    return app.items.instance[key].merge(key,context, false)
  }
}

const getStore = (app,key) => {
  if(!app.ready(key) || !key){
    return app.items.instance['default']
  }
  return app.items.instance[key]
}

const readyStore = (app,key) => {
  if(!app.items || !app.items.instance || !app.items.instance[key]){
    return false
  }
  return true
}

const deleteStore = (app,instance,key) => {
  delete app.items.instance[key]
  return app.items.instance
}

const defaultStore = (app, key) => {
  app.items = Store
  return app.items.stateful(key,{}, true)[key]
}

const mapToProps = (app, key, context) => {
  if(app.ready(key)){
    return {...context.props, ...app.items.instance[key].get()}
  }
  return {}
}

export {initApp, getStore, readyStore, deleteStore, defaultStore, mapToProps}
