import {operatorStore} from '../managers/global_stores'
import {execute, setArgs, accessPrivates, mergeObjects, findChildByData,
        setObject, createAndSet, mergeAndSet, findChild} from './helper_actions'

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

    if(!data || state.bind.constructor.name.toLowerCase() === data){
      this.executeDispatch(state, false)
      return this
    }
    else if (data && typeof data === 'string') {

      const childState = findChild(data, state)
      this.executeDispatch(childState, true)
    }

    if(data && typeof data === 'object'){
      const dataKey = Object.keys(data)[0]

      mergeAndSet(stateful_type, state, mergeObjects(state.data, data, 'data'))
      if(dataKey in Object.keys(state.bind.state)){
        this.executeDispatch(state, false)
        return this
      }

      const childState = findChildByData(dataKey, state)
      this.executeDispatch(childState, true)
      return this
    }
  },
  getOperator(stateful_type, key){
    return accessPrivates(stateful_type)['operator'][key]
  },
  setOperator(stateful_type, func){
    const state = accessPrivates(stateful_type)
    const newOperator = mergeObjects(state['operator'], setObject(func.name, func), 'operator')
    mergeAndSet(stateful_type, state, newOperator)
    stateful_type.operatorKeys[func.name] = func.name
    operatorStore[state.key] = newOperator
    this.executeDispatch(state)
    return this
  },
  executeDispatch(state, isChild){
    if(isChild){
      state.forceUpdate()
      return this
    }
    state.bind.forceUpdate()
    return this
  },
  executeMerge(stateful_type, state){
    const currentState = accessPrivates(stateful_type)
    const mergeBind = mergeObjects(currentState.children, setObject(state.constructor.name, state), 'children')
    const mergeData = mergeObjects(currentState.data, state.state, 'data')
    const mergeState = mergeObjects(mergeBind, mergeData)
    mergeAndSet(stateful_type, currentState, mergeState)
    return this
  },
  executeTransform(stateful_type, func, args){
    const result = execute(stateful_type, func, args)
    createAndSet(stateful_type, args[0], result)
    return this
  },
  executeSeries(stateful_type, funcs, args){
    const data = setArgs(stateful_type, args)
    const loadedFuncs = funcs.map((func) => this.getOperator(stateful_type, func))
    const result = loadedFuncs.reduce((data, func) => func(data), data[0])
    createAndSet(stateful_type, args, result)
    return this
  },
  executeSequence(stateful_type, funcs, args){
    const data = setArgs(stateful_type, args)
    const loadedFuncs = funcs.map((func) => this.getOperator(stateful_type, func))
    const result = data.map((value, index) => loadedFuncs[index](value))
    result.forEach((value, index) => createAndSet(stateful_type, args[index], value))
    return this
  },
  executeNorm(stateful_type, func, args){
    const data = setArgs(stateful_type, args)
    const loadedFunc = this.getOperator(stateful_type, func)
    const result = data.map((value) => loadedFunc(value))
    result.forEach((value, index) => createAndSet(stateful_type, args[index], value))
  },
  executeRun(stateful_type, sequence){
    const results = sequence.map((args) => execute(stateful_type, args[0], args.slice(1)))
    const mappedResults = results.map((result, index) => [sequence[index][1], result])
    mappedResults.forEach((kv) => createAndSet(stateful_type, kv[0], kv[1]))
    return this
  }
}

export {StatefulActions}
