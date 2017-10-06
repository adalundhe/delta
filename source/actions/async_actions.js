import {execute} from './helper_actions'


const AsyncActions = {
  stateful_type: undefined,
  func: undefined,
  args: undefined,
  asyncWait(stateful_type, func, args, cb){
    this.stateful_type = stateful_type
    this.func = func
    this.args = args
    const wait = (stateful_type = this.stateful_type, func = this.func, args = this.args) => {
      if(execute(stateful_type, func, args)){
        cb(stateful_type)
      }
      else{
        setTimeout((stateful_type, func, args) => {
          wait(stateful_type, func, args)
        }, 0)
      }
    }
    wait(stateful_type, func, args)
  }
}

export {AsyncActions}
