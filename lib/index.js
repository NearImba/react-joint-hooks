'use strict';
import { useEffect, useState } from 'react';
import { errorlog } from './utils';
const TopStore = {};
const CbMap = {};
const isDev = process.env.NODE_ENV !== 'production';
export function createJtStore(key, state) {
    if (key in TopStore) {
        if (isDev) {
            errorlog(`${key} in already defined in Jt TopStore`);
        }
    }
    else {
        TopStore[key] = state;
    }
}
function addCallback(key, cb) {
    if (!(key in CbMap)) {
        Object.defineProperty(CbMap, key, {
            value: [],
            writable: false
        });
    }
    CbMap[key].push(cb);
}
function changeTopStore(key) {
    return (state) => {
        if (Object.is(state, TopStore[key])) {
            if (isDev) {
                errorlog(`you reassign a same value to ${key} store, the deprecated value is ${JSON.stringify(state)}`);
            }
        }
        else {
            TopStore[key] = state;
            CbMap[key].forEach(cb => {
                cb(state);
            });
        }
    };
}
export function useJtStore(key) {
    if (key in TopStore) {
        const [state, setState] = useState(TopStore[key]);
        useEffect(() => {
            addCallback(key, setState);
            return () => {
                const index = CbMap[key].findIndex(setState);
                if (index > -1) {
                    CbMap[key].splice(index, 1);
                }
            };
        }, []);
        return [state, changeTopStore(key)];
    }
    else {
        throw new TypeError(`${key} is undefined in TopStore, Please use createJtStore before useJtStore`);
    }
}
//# sourceMappingURL=index.js.map