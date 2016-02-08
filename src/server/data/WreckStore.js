import _ from 'lodash'

export class Wreck extends Object {}
export class Viewer extends Object {}

const VIEWER_ID = 'me';

var viewer = new Viewer();
viewer.id = VIEWER_ID;

var wrecksStore = []

const usersById = {
    [VIEWER_ID]: viewer
};

export function initState(wrecks) {

    //var typedWrecks = wrecks.map((elt) => {
    //    const todo = new Wreck();
    //    Object.assign(todo, elt);
    //    return todo
    //})

    wrecksStore = wrecks
    return wrecksStore
}

export function getById(id) {

    var wreck = wrecksStore.filter((elt) => {
        if(elt.id == id) {
            return elt
        }
    })

    return wreck[0]
}

export function getViewer() {

    console.log("getting viewer : " + JSON.stringify(usersById[VIEWER_ID]))
   return usersById[VIEWER_ID]
}

export function isInitialized() {
    if(wrecksStore.length === 0) {
        return false
    } else {
        return true
    }
}

export function getWrecks() {

    console.log("wrecksStore: " + wrecksStore.length)

    return wrecksStore
}

export function pushWreck(wreck) {

    var wreck = wrecksStore.filter((elt) => {
        if(elt.id == wreck.id) {
            return elt
        }
    })

    if(!wreck[0]) wrecksStore.push(wreck)
}
