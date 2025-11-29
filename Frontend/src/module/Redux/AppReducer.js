import {
    FETCH_ALL_SUBMISSIONS,
    IS_LOADING_STATE,
    FETCH_FORM_DATA,
    } from "./AppAction";
    
    const initialState = {
      submissions: [],
      formdata:null,
      isloading: false,
      count:0
    };
    
    const AppReducer = (state = initialState, action) => {
      switch (action.type) {
        case FETCH_ALL_SUBMISSIONS:
          return {
            ...state,
            submissions: action.submissions,
          };
          case IS_LOADING_STATE:
            return {
              ...state,
              isloading: action.isloading,
            };
            case FETCH_FORM_DATA:
                return {
                  ...state,
                  formdata: action.formdata,
                };    
        default:
          return state;
      }
    };
    export const fetchSubmissionsListDetails = (state) => state.app.submissions;
    export const fetchSubmissionFormDetails = (state) => state.app.formdata;
    export const fetchloadingState = (state) => state.app.isloading;
  
    
    export default AppReducer;