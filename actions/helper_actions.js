import {StatefulActions} from './stateful_type_actions'
import {privates} from '../managers/private_states'

const setArgs = (stateful_type, args) => {
  const key = args[0]
  return [StatefulActions.getState(stateful_type, key), ...args.slice(1)]
}

const execute = (stateful_type, func, args) => {
  if(typeof func === 'string'){
    return StatefulActions.getOperator(stateful_type, func).apply(stateful_type, args)
  }
  return func.apply(stateful_type, args)
}

const accessPrivates = (stateful_type) => privates.get(stateful_type)

const setPrivates = (stateful_type, nextState) => privates.set(stateful_type, nextState)

const setObject = (key, data, optKey) => {
  const objectOut = {}
  objectOut[key] = data
  if(!optKey){
    return objectOut
  }
  const container = {}
  container[optKey] = objectOut
  return container
}

const mergeObjects = (fromObject, toObject, optKey) => {
  const merged = {...fromObject, ...toObject}
  if(!optKey){
    return {...fromObject, ...toObject}
  }
  return setObject(optKey, merged)
}

export {setArgs, execute, accessPrivates, setPrivates, mergeObjects, setObject}
