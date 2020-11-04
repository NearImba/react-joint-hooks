'use strict'

import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { errorlog } from './utils'

interface JtTopStore<T> {
  [key: string]: T;
}

const TopStore: JtTopStore<any>= {}
const CbMap: JtTopStore<Array<any>> = {}

const isDev = process.env.NODE_ENV !== 'production'

export function createJtStore<T>(key: string, state: T) {
  if (key in TopStore) {
    if (isDev) {
      errorlog(`${key} in already defined in Jt TopStore`)
    }
  } else {
    TopStore[key] = state
  }
}

function addCallback<T>(key: string, cb: Dispatch<SetStateAction<T>>) {
  if (!(key in CbMap)) {
    Object.defineProperty(CbMap, key, {
      value: [],
      writable: false
    })
  }
  CbMap[key].push(cb)
}

function changeTopStore<T>(key: string) {
  return (state: T) => {
    if (Object.is(state, TopStore[key])) {
      if (isDev) {
        errorlog(`you reassign a same value to ${key} store, the deprecated value is ${JSON.stringify(state)}`)
      }
    } else {
      TopStore[key] = state
      CbMap[key].forEach(cb => {
        cb(state)
      })
    }
  }
}

export function useJtStore<T>(key: string): [T, (a: T) => any] | never {
  if (key in TopStore) {
    const [state, setState] = useState<T>(TopStore[key])

    useEffect(() => {
      addCallback<T>(key, setState)
      return () => {
        const index = CbMap[key].findIndex(setState)
        if (index > -1) {
          CbMap[key].splice(index, 1)
        }
      }
    }, [])

    return [state, changeTopStore<T>(key)]
  } else {
    throw new TypeError(`${key} is undefined in TopStore, Please use createJtStore before useJtStore`)
  }
}