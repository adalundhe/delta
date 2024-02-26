![bundle size](https://deno.bundlejs.com/badge?q=delta-state,delta-state&treeshake=[*],[{+create,atom,useAtom,DerivedAtom,AtomStore}])

# delta

__delta__ is a universal state-store/action manager for React. Designed to be easy
to use and minimally intrusive, delta embraces the immutable state concepts
of state-management libraries like Redux while allowing for greater freedom in
terms of the functions you provide to mutate data. It allows for single
application store, multiple localized stores, global re-rendering and local
re-rendering.

<br/>

### installing __delta__

You can install delta and save it to your package.json follows:

`npm install --save delta`

You can then import delta into your project as follows:

`import {app} from 'delta'`

### about __delta__

__delta__ is designed to mirror but otherwise exist separately from data you
instantiate via React state. In fact, the only way delta utilizes
React state is to trigger either local or global re-renders of tied components.
Rather than using complex graph data-structures or other 'fancy' means of
reducing data, delta simply stores the current value of a given item via key-value
paring within an object. You can configure delta to use a single store for
all data or multiple stores, but all data is stored within an object.

 However, note that the data stored within this object is never directly accessible. Instead, you must use the various methods provided by the *Store* data-type class (and the functions you write) to indirectly access and manipulate store. This approach is draconian, but also ensures that a programmer doesn't accidentally mutate the state of data in a Store. When you use the methods, you will never directly manipulate the state of data. The Store interface is constructed in such a way that either a copy of the current state is returned, new state entirely supersedes the current state (replaces it), or state remains unchanged.

delta is fully-featured in that a given store has knowledge of both the data
stored within it, and functions associated within the manipulation of that data (which you, dear programmer, provide). A function you provide a store to
manipulate data is called an *__Operator__*. Operators are simple, pure functions your write, may accept an arbitrary number of inputs, and must return the next state of a given item of data. Note that delta does not strictly enforce the use of pure functions, but mutating data within an Operator can easily result in side-effects, and so is strongly discouraged.

 delta also has several unique methods of chaining the use of functions to manipulate data, allowing for greater flexibility in how you write, use, and call Operators. These "chaining" methods will be covered later. Outside of where you pass an Operator to a Store, like state data you will never have direct access to an Operator function. Rather, you reference Operators by passing a string containing the function's name, and declare the function's arguments either by referencing the key under which it is stored, or passing a valid data-type to the Operator function.

 Again, the reason for hiding the Operators you provide is so that the functions provided remain as immune to accidental manipulation or alteration as possible. This way, if a transform produces incorrect output, you need only reference the single location where you wrote function provided as an Operator. Likewise, this also means that you can tie the execution of an Operator to a function local to a component without mutating the Operator.
 Don't panic! delta does make a list of the currently available data keys and Operators tied to a store. To see these, simply log a given Store to console and look under the 'dataKeys' or 'OperatorKeys' objects.


 By default, delta updates the state for a given store synchonously, and executes any re-renders immediately after new state is created. However, re-rendering will only take place in the parent component and any children components of the parent component to which the given state-data manipulated was originally tied. This enforces the flux pattern, and ensures strictly unidirectional data-flow in maintained. If for some reason a violation of the flux pattern is required by the application, the user may do so (again, this is strongly discouraged). The user may specify re-rendering without creating new State if needed (once more, strongly discouraged but possible). In general, a Store represents a single source of truth for both the data you provide and the means by which you manipulate said data. While delta allows you to adopt the pattern of data-flow most suitable to your application, violation of unidirectional data-flow carries the risk of invalidating a Store's purpose as said source of truth.

 delta *does not* automatically keep track of changes in state. There is no "diffing algorithm", no "virtual state", only a general interface allowing for controlled interactions with state. This simplicity means that state changes are either triggered through externally programmed means or user interaction with interface tied to delta Operators.

<br/>

### the __delta__ *store*

 A *__Store__* represents an abstract data-type, a strict interface that provides predetermined methods of interaction and enforces indirect interaction with application state. For delta, a Store contains any React state data of the parent component from which it was instantiated and the data of any additional components to which you *merge* into the given store. All data is stored inside a simple, single-level object. However, only the parent component from which a Store is instantiated is considered a *parent*. Any other React components whose state is merged into an existing store is strictly treated as a *child* Store of the parent. This means that delta can be used to keep track and enforce some degree of localized re-rendering if the programmer so chooses. Note, however, that delta has no knowledge of the structure of your application beyond the initial component from which you instantiate the Store being the parent, and any subsequent merged components being children of that parent Store. This means that ad-hoc instantiation, merging, or re-rendering calls can quickly result in unexpected application behavior either through unwanted re-rendering or failing to re-render.

 All Stores keep track of currently available state data items and any operators tied to a given store. You will always be able to reference what your Store currently has. Beyond this, a Store should be considered not as a data-structure but as a relatively "dumb" interface for which the data stored and methods provided must be dictated by the programmer.

<br/>

### state and __delta__

 *State is data, and data is State*. Much like with the electrons zipping about our universe, state is never directly accessible, only manipulable or observable through indirect methods. That being said, state should still be controllable and predictable. delta follows this analogy, allowing interaction with application state only through uniform and indirect methods provided by the Store interface.

When delta is first imported, delta has no knowledge of your application, it's purpose, structure, interface, external libraries used, etc. This decoupling of state-management from application design allows you to design interface as you see fit, only injecting interaction with state when and where necessary. The only portion of your application which delta directly manipulates is the re-rendering of parent and child components tied to the instance of a store. While careful composition of your application and judicious use of re-rendering can improve application performance, delta is otherwise indifferent to the application. It renders no components of its own and manipulation of Store state does not change the state of data within parent or children React components tied to a Store. In mapping state to the properties of a given component, a new *props* object is created, preserving the original.

The degree to which delta remains separate from React component state is again intrinsic to the idea of a Store's state being a single source of truth. It is likewise important note that the data for a given Store is *not* contained within that store, and is kept elsewhere by delta.

When an instance of a store is created or a component's state is merged to an existing store, delta maps the variable names and co-requisite default values declared in the `state` block of the component the data Object for that given Store. For example if in a React "smart component" the following state items are declared:

```have
  state = {
    counter: 0
  }
```

We can initialize an instance of a store as follows:

```
  app.create('myStore', this)
```

delta will then map the initial value we declared for `counter` to a key-value pairing with the `myStore` Store data object under the key `counter`.

We may then return the actual value of an item contained in a given Store's state by passing a valid string matching the variable name under which the state is stored to the Store `.get()` method like so:

```
  app.load('myStore').get('counter') // returns -> 0
```

Note that we do not have to repeatedly invoke the delta `.load()` method (which simply returns the store whose key matches the string provided). The following is a more desirable method by which one might reference a store's data:

```
const myStore = app.load('myStore') // reference -> 'myStore' store instance

myStore.get('counter') // returns -> 0
```

We may then change the value of our counter through the Store `.set()` method. Like React's own `.setState()`, the `.set()` method takes a single object as argument, which may contain the new values of any state items we wish to change. Note that in order for the value of a state item to be changed, the key for the value must match the key under which that state item is stored for the given Store. Like Redux, calling the `.set()` method does not mutate currently existing state, rather, the existing state and the new state are merged together to form an entirely separate state, which then replaces the existing state. Upon replacing the existing state, delta will trigger a re-render of the parent component (and any child components) from which the given state item was initially derived.

<br/>

### operators and __delta__

 Operators are pure functions, simply written means of taking arbitrary input and producing the same output for a given input regardless of application state (or anything else delta might be doing). You *__provide__* a delta Store with operators simply by passing the Store the signature of said function to the `.provide()` method like so:

 ```
  const addOne = (x) => x + 1

  const lessOne = (x) => (x > 0) ? x - 1 : 0

  app.load('myStore').provide(addOne, lessOne)
 ```

 Note that writing pure functions still allows for the use of conditionals, temporary values, etc. Although (again) not enforced, writing an operator like a reduction is ideal, as it ensures that the function:

* a.) Consistently produces the same behavior

* b.) Produces no side-effects

When you pass an operator as above, delta stores the Operator under in an object for which the key is the function name declared in the function signature. This enforces good naming practices, makes for readable code, and allows for intuitive recall of defined Operators.

Recall of (an) Operator(s) is done by calling one of the various methods the Store interface supplies. The primary means by which one may call an Operator (and thus synchronously generate the next state) for a given Store is by calling the `.transform()` method like so:

```
  app.load('myStore').transform('addOne', 'item', ...)
```

The transform method's first argument can be either a string matching the function signature under which Operator is stored or an an anonymous function. The latter may be done like so:

```
  app.load('myStore').transform((x) => x + 1, 'item', ...) // This is equivalent to the statement above but instead executes the function provided instead of
                                                           // a referenced Operator. This means you don't have to .provide() an Operator to execute one!
```

The second argument must likewise be a string matching the variable name matching a currently existing item of state within a Store. This ensures that delta references at least some currently existing item within Store state. Following arguments may be as many as the Operator allows arguments, and may be arbitrary data-types valid to the execution of the given operator or references to existing Store state items. Note that before executing an operator, delta will quickly map through all arguments provided, loading the current values of any state items referenced but otherwise leaving arguments provided unchanged. delta then applies these arguments to the Operator's arguments in the order in which they are provided.

There are several additional methods through which Operator(s) may generate new state given existing state. These include:

<br/>

* __series__:

  * ```
    .series(['addOne', 'addOne', 'lessOne'], 'counter') // Outputs cumulative total of all Operators' executions: counter => 1
    ```
  * First Argument: An array of *n* string-type references to provided Operators
  * Second Argument: A single string-type reference to a single state item
  * Returns: The aggregate result of each operator's execution upon the given state item.

<br/>

* __sequence__:

  * ```
    .sequence(['addOne', 'lessOne'], ['counterOne', 'counterTwo']) // Outputs: [ counterOne => 1, counterTwo => -1]
    ```
  * First Argument: An array of *n* string-type references to provided Operators
  * Second Argument: An array of equal size to the first argument, containing *n* string-type references to state items.
  * Returns: The execution of the ith Operator upon the ith state item.

<br/>

* __norm__:

  * ```
    .norm('addOne', ['counterOne', 'counterTwo', 'counterThree']) // Outputs: [ counterOne => 1, counterTwo => 1, counterThree => 1]
    ```
  * First Argument: A string-type reference to a single Operator
  * Second Argument: An array of *n* string-type references to state items.
  * Returns: The execution of the provided operator upon each provided state item.

<br/>

* __run__:

  * ```
    .run(['addY', 'counterOne', 2], ['addOne', 'counterTwo']) // Outputs: [ counterOne => 2, counterTwo => 1]
    ```
  * Arguments: *n* arrays of arguments provided the execution of *n* Operators.
  * Returns: The execution of the ith operator upon the ith array of arguments.
  * Note: This is akin to executing *n* transforms in sequence. Each array of arguments must follow the same format as if you were executing a transform (i.e. first argument must be a string referencing an Operator available to the Store, second a string referencing a state item valid to the store, followed by the arbitrary arguments required by the Operator).

<br/>

### rendering and __delta__

delta's execution of re-rendering (post set or transform) is synchronous and opportunistic in that delta will (by default) only re-render the parent-component and any child-components of the parent to which a given state item was originally tied. This default behavior can be overridden by calling the `.set()` method directly and passing the method a string matching the class name of the smart component from which we wish re-rendering to propagate like so:


```
```

app.load('myStore').set('someOtherStore') // Will not re-render starting from component from which 'myStore' Store was instantiated.
Note that any reference passed this way need not match the casing. In order to trigger re-rendering this way, the smart component from which we wish to trigger re-rendering *must* have been merged with the current Store which we are accessing.

If no reference string is provided, a re-render can still be triggered, however delta will then default re-rendering propagation to the parent component from which the Store was initialized. This can be done as below:

```
  app.load('myStore').set() // Will re-render starting from component from which `myStore` store was instantiated
```

<br/>

### merging/composition and __delta__

delta is flexible in that it allows for either single-store or localized store architecture. In opting for the former (or otherwise seeking to aggregate the state of multiple components), understanding the use of the Store `.merge()` method is requisite:

 * Argument: Keyword __this__. Must be passed to `.merge()` method from within the scope of the class of the component which we wish to merge *from*.

 We can call merge as below:

 ```
   const myStore = app.load('myStore')

   myStore.merge(this)
 ```

 Note that you *must* execute a merge from a component that is *not* the component in which a given Store is instantiated. Upon execution of a merge, delta will map the passed component's initial state variable names and values as key-value pairs to the target Store's data object and then add the passed component as a child of the target Store. Executing a merge will also map references of all state items of the provided component to the dataKeys reference object of the target Store before finally executing a re-render propagating from component from which the target Store was initialized. Note then that any manipulation of state items originally owned by the passed component will trigger re-rendering from the passed component, *__not__* the target component (unless otherwise specified).

<br/>

### asynchronous operations and __delta__

While delta enforces all state changes synchronously, due to the architecture of modern web applications data called from severs (or manipulated by outside libraries) is often available asynchronously. As a basic means of dealing with this reality, delta Stores are provided a single asynchronous method called `.async()`. Note that this method should *only* be used sparingly, in instances where no outside means of enforcing data hydration is available. The `.async()` method takes the following argument:

* First Argument: String-type reference to a provided transform or anonymous function (i.e. as with the first argument of a call to `.transform()`) that *must* return __true__ or __false__
* Second Argument: Array of references to the data required by the function passed as the first argument. Note that these may be arbitrary and need not involve references to state
* Third Argument: An anonymous function to be executed as a callback when the function provided as the first argument returns __true__. Indirectly returns reference to the Store upon which `.async()` was called

A valid call to `.async()` would then appear as below:

```
  app.load('myStore').async((products) => products.length > 0, ['products'], (loadedStore) => loadedStore.set())

  // The above calls a 'wait' function in a forked, asynchronous thread continuously until the first function returns true (until products.length > 0).
  // Once the first function returns true, the function provided as the third argument will execute as a callback, passing back a reference to `myStore`.
  // This local reference then executes a re-rendering of the application, propagating from the component from which the `myStore` Store was instantiated.
```

Note that `.async()` will continue to asynchronously execute and check the first argument to see if that function/Operator returns true. It is then *critical*
to pass *any* call to `.async()` a function or Operator that *will eventually return true*, else the asynchronous operation will continue to execute indefinitely.

<br/>

### app methods and __delta__

Note that, in addition to the methods provided to a Store, an instance of delta also has access to a few rudimentary methods. These include:

<br/>

 * __create__:

    * `.create('storeName', this)`

    * First Argument: The string containing the reference (key) under which the created store is to be referenced
    * Second Argument: The keyword __this__, which must be provided within the class scope of the component in which the Store is being created.
    * Does: Creates a store, mapping React state to delta state data object and creating references to said component for re-rendering purposes.
    * Returns: The newly created instance of the initialized Store data-type, to be stored or otherwise used.
    * Executes Re-Render: Yes
    * Note: If a Store is already referenced under the provided key, `.create()` instead executes a `.merge()`

<br/>

* __load__:

    * `.load('storeName')`
    * Argument: The string containing the reference (key) for the Store which we wish to access.
    * Returns: The referenced instance of the initialized Store data-type, to be stored or otherwise used.
    * Executes Re-Render: No
    * Note: If no reference string is provided or the Store is determined to be unavailable, `.load()` will return the app `default()` Store instance

<br/>

* __ready__:

    * `.ready('storeName')`
    * Argument: The string containing the reference (key) for the Store which we wish to access.
    * Returns: A boolean (__true__ or __false__) indicating whether the Store referenced by the argument string key is available or has been created.
    * Executes Re-Render: No

<br/>

* __default__:

    * `.default()`
    * Arguments: None
    * Returns: A dummy-instance of a Store data-type. Note that this instance has *no* access to re-rendering, state setting, transforms, etc.
    * Executes Re-Render: No

<br/>

* __map__:

    * `.map('storeName', this)`
    * First Argument: The string containing the reference (key) for the Store which we wish to access.
    * Second Argument: The keyword __this__ for React smart components or normal component __props__ object, which must be provided within the class scope of the component in which the Store is being created.
    * Returns: A new object, containing the merged key-value pairings of the provided React component "props" object and the current Store data object.
    * Note: *__This__* is the means by which you should make Store state available for display and use within a React smart component's `render()` method or a normal component.

<br/>
