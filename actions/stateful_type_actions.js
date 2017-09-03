import {privates} from '../managers/private_states'
import {operatorStore} from '../managers/global_stores'

const StatefulActions =  {
  getState(stateful_type, prop){
    if(prop){
      return privates.get(stateful_type).data[prop]
    }
    return privates.get(stateful_type).data
  },
  setState(stateful_type, innerData){
    const state = privates.get(stateful_type)
    if(innerData){
      const nextState = {data: {...state.data, ...innerData}}
      privates.set(stateful_type,{...state, ...nextState})
    }
    this.executeDispatch(state)
    return this
  },
  getOperator(stateful_type, key){
    const state = privates.get(stateful_type)
    return state['operator'][key]
  },
  setOperator(stateful_type, func){
    const state = privates.get(stateful_type)
    state.operator[func.name] = func
    privates.set(stateful_type, state)
    stateful_type.operatorKeys[func.name] = func.name
    operatorStore[state.key] = operatorStore[state.key] || {}
    operatorStore[state.key][func.name] = func
    this.executeDispatch(state)
    return this
  },
  executeDispatch(state){
    state.bind.forceUpdate()
    return this
  },
  executeTransform(stateful_type, key, args){
    const result = this.execute(stateful_type, key, args)
    this.setState(result)
    return this
  },
  executeLambda(stateful_type, func, args){
    const data = {}
    const key = args[0]
    data[key] = func.apply(stateful_type, this.setArgs(stateful_type, args))
    this.setState(stateful_type, data)
    return this
  },
  executeMerge(stateful_type, state){
    const currentState = privates.get(stateful_type)
    const mergeState = {data: {...currentState.data, ...state.state}}
    privates.set(stateful_type, {...currentState, ...mergeState})
    return this
  }
}

export {StatefulActions}
