import {operatorStore} from '../managers/global_stores'
import {execute, setArgs, accessPrivates, setPrivates, mergeObjects, setObject} from './helper_actions'

const StatefulActions =  {
  getState(stateful_type, prop){
    const calledData = accessPrivates(stateful_type).data
    if(prop){
      return calledData[prop]
    }
    return calledData
  },
  setState(stateful_type, data){
    const state = accessPrivates(stateful_type)
    if(data){
      const nextData = mergeObjects(state.data, data, 'data')
      setPrivates(stateful_type, mergeObjects(state, nextData))
    }
    this.executeDispatch(state)
    return this
  },
  getOperator(stateful_type, key){
    return accessPrivates(stateful_type)['operator'][key]
  },
  setOperator(stateful_type, func){
    const state = accessPrivates(stateful_type)
    const newOperator = mergeObjects(state['operator'], setObject(func.name, func), 'operator')
    setPrivates(stateful_type, mergeObjects(state, newOperator))
    stateful_type.operatorKeys = mergeObjects(stateful_type.operatorKeys, newOperator)
    operatorStore[state.key] = newOperator
    this.executeDispatch(state)
    return this
  },
  executeDispatch(state){
    state.bind.forceUpdate()
    return this
  },
  executeTransform(stateful_type, func, args){
    const key = args[0]
    const result = execute(stateful_type, func, setArgs(stateful_type, args))
    this.setState(stateful_type, setObject(key, result))
    return this
  },
  executeMerge(stateful_type, state){
    const currentState = accessPrivates(stateful_type)
    const mergeState = mergeObjects(currentState.data, state.state, 'data')
    setPrivates(stateful_type, mergeObjects(currentState, mergeState))
    return this
  }
}

export {StatefulActions}
