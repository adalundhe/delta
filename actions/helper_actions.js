import {StatefulActions} from './stateful_type_actions'
import {privates} from '../managers/private_states'

const setArgs = (stateful_type, args) => {
  if(Array.isArray(args)){
    const newArgs = args.map((arg) => {
      if(typeof arg === 'string'){
        const getData = StatefulActions.getState(stateful_type, arg)
        return getData ? getData : arg
      } else{
        return arg
      }
    })

    return newArgs
  }
  else{
    return args
  }
}

const execute = (stateful_type, func, args) => {
  if(typeof func === 'string'){
    return StatefulActions.getOperator(stateful_type, func).apply(stateful_type, setArgs(stateful_type, args))
  }
  return func.apply(stateful_type, args)
}

const findChild = (key, state) => {
  key = key.toLowerCase()
  for(const child in state.children){
    if(state.children[child].constructor.name.toLowerCase() === key){
      return state.children[child]
    }
  }

  const notFound = new Error('Data not found in main state or child states. Did you forget to merge state?')
  throw notFound
}

const findChildByData = (dataKey, state) => {
  for(const child in state.children){
    if(state.children[child].state[dataKey] !== undefined){
      return state.children[child]
    }
  }
  const notFound = new Error('Data not found in main state or child states. Did you forget to merge state?')
  throw notFound
}

const accessPrivates = (stateful_type) => privates.get(stateful_type)

const setPrivates = (stateful_type, nextState) => privates.set(stateful_type, nextState)

const createAndSet = (stateful_type, key, data) => StatefulActions.setState(stateful_type, setObject(key, data))

const mergeAndSet = (stateful_type, toObject, fromObject, optKey) => privates.set(stateful_type, mergeObjects(toObject, fromObject, optKey))

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

const mergeObjects = (toObject, fromObject, optKey) => {
  const merged = {...toObject, ...fromObject}
  if(!optKey){
    return {...toObject, ...fromObject}
  }
  return setObject(optKey, merged)
}

export {setArgs, execute, accessPrivates, setPrivates, mergeObjects, setObject, createAndSet, mergeAndSet, findChildByData, findChild}
