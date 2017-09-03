import {privates} from '../managers/private_states'
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
      const nextState = mergeObjects(state.data, data, 'data')
      setPrivates(stateful_type, mergeObjects(state, nextState))
    }
    this.executeDispatch(state)
    return this
  },
  getOperator(stateful_type, key){
    return accessPrivates(stateful_type)['operator'][key]
  },
  setOperator(stateful_type, func){
    const state = accessPrivates(stateful_type)
    const newOperator = setObject(func.name, func)
    setPrivates(stateful_type, mergeObjects(state, setObject('operator', newOperator)))
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
    const result = execute(stateful_type, func, setArgs(stateful_type, args))
    this.setState(result)
    return this
  },
  executeLambda(stateful_type, func, args){
    const key = args[0]
    const data = setObject(key, execute(stateful_type, func, args))
    this.setState(stateful_type, data)
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
