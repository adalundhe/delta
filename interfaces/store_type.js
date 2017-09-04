import {StatefulActions as actions} from '../actions/stateful_type_actions'
import {AsyncActions as asyncx} from '../actions/async_actions'
import {setPrivates, setObject, mergeObjects} from '../actions/helper_actions'

class Store {
  constructor (context, key, isDefault) {
    if (context) {
      const privateDefaults = {
        data: {},
        operator: {},
        bind: context,
        key: key
      }
      this.dataKeys = Object.keys(context.state).reduce((dataKeys, key) => mergeObjects(dataKeys, setObject(key, key)), {})
      this.operatorKeys = {}
      privateDefaults.data = mergeObjects(privateDefaults.data, context.state)
      setPrivates(this, privateDefaults)
    }
    this.default = isDefault
  }
  get (prop) {
    return actions.getState(this, prop)
  }
  set (data) {
    actions.setState(this, data)
    return this
  }
  provide (...funcs) {
    funcs.forEach(func => actions.setOperator(this, func))
    return this
  }
  transform (func, ...args) {
    if(func && args){
      actions.executeTransform(this, func, args)
    }
    return this
  }
  merge (state) {
    actions.executeMerge(this, state)
    return this
  }
  isDefault(){
    return this.default
  }
  async(func, args, cb){
    asyncx.asyncWait(this, func, args, cb)
    return this
  }
  series(funcs, args){
    actions.executeSeries(this, funcs, args)
    return this
  }
  sequence(funcs, args){
    actions.executeSequence(this, funcs, args)
    return this
  }
  norm(func, args){
    actions.executeNorm(this, func, args)
    return this
  }
  run(...sequence){
    actions.executeRun(this, sequence)
    return this
  }
}

export {Store}
