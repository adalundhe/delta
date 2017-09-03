import {StatefulActions as actions} from '../actions/stateful_type_actions'
import {AsyncActions as asyncx} from '../actions/async_actions'
import {privates} from '../managers/private_states'

class Store {
  constructor (context, key, isDefault) {
    if (context) {
      const defaults = {
        data: {},
        operator: {},
        bind: context,
        key: key
      }
      const keys = {dataKeys: {}, operatorKeys: {}}
      this.dataKeys = {}
      this.operatorKeys = {}
      for (const prop in context.state) {
        defaults.data[prop] = context.state[prop]
        this.dataKeys[prop] = prop
      }
      privates.set(this, defaults)
    }
    this.default = isDefault
  }
  get (prop) {
    return actions.getState(this, prop)
  }
  set (data) {
    console.log("DATA!",data)
    actions.setState(this, data)
    return this
  }
  provide (func) {
    actions.setOperator(this, func)
    return this
  }
  transform (key, args) {
    if(key && args){
      actions.executeTransform(this, key, args)
    }
    return this
  }
  lambda (func, args) {
    actions.executeLambda(this, func, args)
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
}

export {Store}
