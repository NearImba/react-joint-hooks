# react-joint-hooks

The simplest data sharing base on react hooks and Subscribe/Publish

### api

- **createJtStore**

  initialize an Joint store with key and initialization
  state

```
createJtStore<T>(key: string, state: T)
```

- **useJtStore**

  get value and method that can change this value

```
useJtStore<T>(key: string): [T, (a: T) => any] | never
```

### example

```
import React from 'react'
import { createJtStore, useJtStore } from 'react-joint-hooks'

createJtStore('n', 1)

function Index() {
  const [n, setNumber] = useJtStore('n')
  return <div>
    {n}
    <button onClick={() => { setNumber(n + 1)}}>increase<button>
  </div>
}
```
