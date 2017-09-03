import {StatefulActions} from './stateful_type_actions'

const setArgs = (stateful_type, args) => {
  return [StatefulActions.getState(stateful_type, args[0])].concat(args[1])
}

const test = (stateful_type, func, args) => {
  if(typeof func === 'string'){
    return execute(stateful_type, func, args)
  }
  return func.apply(stateful_type, setArgs(stateful_type, args))
}

const execute = (stateful_type, key, args) => {
  return StatefulActions.getOperator(stateful_type, key).apply(stateful_type, setArgs(stateful_type, args))
}

const AsyncActions = {
  stateful_type: undefined,
  func: undefined,
  args: undefined,
  asyncWait(stateful_type, func, args, cb){
    this.stateful_type = stateful_type
    this.func = func
    this.args = args
    const wait = (stateful_type = this.stateful_type, func = this.func, args = this.args) => {
      if(test(stateful_type, func, args)){
        StatefulActions.setState(stateful_type, StatefulActions.getState(stateful_type))
        cb(stateful_type)
      }
      else{
        StatefulActions.setState(stateful_type)
        setTimeout((stateful_type, func, args) => {
          wait(stateful_type, func, args)
        }, 0)
      }
    }
    wait(stateful_type, func, args)
  }
}

export {AsyncActions}
