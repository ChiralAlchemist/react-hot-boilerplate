import React, { Component } from 'react';
import {createStore} from 'redux';
import deepFreeze from 'deep-freeze'; 
import expect from 'expect';



const makeEmptyBoard =  function (size) {
    var emptyBoard = [];
    for(let width = 0; width < size; width++) {
        let row = [];
        for(let height = 0; height < size; height++) {
            row.push(0);
        }
        emptyBoard.push(row);
    }
    return emptyBoard;
} 

const setPiece = (state, coordinates) =>  {
    return [
        ...state.slice(0,coordinates.y),
        [...state[coordinates.y].slice(0, coordinates.x), 1 , ...state[coordinates.y].slice(coordinates.x+1)], 
        ...state.slice(coordinates.y+1)    
    ]
}

const testSetPiece = () =>  {
    const startState = makeEmptyBoard(5);
    const nextState = [
        [1,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]   
    ];
    const nextState2 = [
        [1,0,1,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]   
    ];
    const nextStateY = [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,1,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0] 
    ]
    deepFreeze(startState);
    expect(
        setPiece(startState,{x : 0, y :0})
    ).toEqual(nextState);
    
    expect(
        setPiece(nextState, {x : 2 , y : 0})
    ).toEqual(nextState2);
    
    expect(
        setPiece(startState, {x: 2 , y: 2})
    ).toEqual(nextStateY);
    
    console.log('setPiece is working');
}

const togglePiece = (state, coordinates) => {
    var newValue = state[coordinates.y][coordinates.x] === 0 ? 1 : 0;
    return [
        ...state.slice(0,coordinates.y),
        [...state[coordinates.y].slice(0, coordinates.x), newValue , ...state[coordinates.y].slice(coordinates.x+1)], 
        ...state.slice(coordinates.y+1)    
    ]
}

const testTogglePiece = () =>  {
    const startState = [
        [1,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]   
    ];
    const toggledState = [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]   
    ];
    
    deepFreeze(startState);
    deepFreeze(toggledState);
    
    expect(
        togglePiece(startState,{x : 0, y :0})
    ).toEqual(toggledState);
    
    expect(
        togglePiece(toggledState,{x : 0, y :0})
    ).toEqual(startState);
    
    console.log('tooglePiece is working');
}

const rightMove = (state, coordinates) => {
    var toogledState = togglePiece(state, coordinates);
    var newCoordinates = {
        x : coordinates.x+1,
        y : coordinates.y
    }
    return setPiece(toogledState, newCoordinates)
}

const testRightMove = () =>  {
    const startState = [
        [1,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]   
    ];
    const movedState = [
        [0,1,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]   
    ];
    
    const twomovedState = [
        [0,0,1,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]   
    ];
    
    deepFreeze(startState);
    deepFreeze(movedState);
    
    expect(
        rightMove(startState,{x : 0, y :0})
    ).toEqual(movedState);
    
    expect(
        rightMove(movedState,{x : 1, y :0})
    ).toEqual(twomovedState);
    
    console.log('rightMove is working');
}

const game = (state = makeEmptyBoard(5), action) => {
    var actionsThatCanBePerformed = {
        setPiece,
        togglePiece,
        rightMove
    }
    
    if(!actionsThatCanBePerformed[action.type]) {
        console.log('unrecogized action type returning state');
        return state
    }
    console.log(actionsThatCanBePerformed[action.type](state, action))
    return actionsThatCanBePerformed[action.type](state, action);
}





const testApp = () => {
    testSetPiece();
    testTogglePiece();
    testRightMove();
    console.log('It all works');
}

testApp();

const store = createStore(game);
console.log('state is ', store.getState());
store.dispatch({
    type : 'togglePiece',
    x : 1, 
    y : 1
})
console.log('state is ', store.getState());

export default class App extends Component {
  render() {
    return (
        <div>
            <h1>Hello, world.</h1>
            {/*<Grid board={board}/>*/}
        </div>
    );
  }
}
