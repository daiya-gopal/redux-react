
let initialState = "";

const userData = (state = initialState, action) => {

    switch(action.type){ 
      case "USERDATA" : return action.parm;
      case "RESET": return initialState;
      default : return state;
  }
}


export default userData