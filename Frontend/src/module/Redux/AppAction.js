import { showNotification } from "../Constants/Toast";
import { FORM_ID } from "../Constants/constant";
import callApi from "../Util/apiCaller";

export const FETCH_ALL_SUBMISSIONS = "FETCH_ALL_SUBMISSIONS";
export const IS_LOADING_STATE = "IS_LOADING_STATE";
export const FETCH_FORM_DATA = "FETCH_FORM_DATA";

export function loadSubmissionsDetails(data) {
  return {
    type: FETCH_ALL_SUBMISSIONS,
    submissions: data,
  };
}

export function loadingstate(status) {
  return {
    type: IS_LOADING_STATE,
    isloading: status,
  };
}

export function loadFormDetails(data) {
  return {
    type: FETCH_FORM_DATA,
    formdata: data,
  };
}

export function fetchAllSubmissionsDetails(payload) {
  return async (dispatch) => {
    loadingstate(true);
    try {
      const res = await callApi(`api/submission/submission-list`, "post", payload);
      if (res.status === "Success") {
        dispatch(loadSubmissionsDetails(res.data));
        loadingstate(true);
        showNotification("Submissions List Fetched Successfully", "success");
      } else {
        showNotification("Not Fetched", "error");
      }
    } catch (error) {
      showNotification("error");
    }
  };
}

export function fetchSubmissionForm() {
  return async (dispatch) => {
    loadingstate(true);
    try {
      const res = await callApi(`api/form/${FORM_ID}`, "get");
      if (res.status === "Success") {
        dispatch(loadFormDetails(res.data));
        loadingstate(true);
        showNotification("Submissions Form Fetched Successfully", "success");
      } else {
        showNotification("Not Fetched", "error");
      }
    } catch (error) {
      showNotification("error");
    }
  };
}

export function submissionFormAdd(data) {
  return async (dispatch) => {
    try {
      const res = await callApi(`api/submission/new`, "post", data);
      if (res.status === "Success") {
        showNotification("Form submitted successfully!", "success");
      } else {
        showNotification("Not Added", "error");
      }
    } catch (error) {
      showNotification("error");
    }
  };
}

export function submissionFormUpdate(id) {
  return async (dispatch) => {
    try {
      const res = await callApi(`api/submissions/${id}/update`, "get");
      if (res.status === "Success") {
        showNotification("Update Successfully", "success");
      } else {
        showNotification("Not Fetched", "error");
      }
    } catch (error) {
      showNotification("error");
    }
  };
}

export function submissionRemove(id) {
  return async (dispatch) => {
    try {
      const res = await callApi(`api/submissions/${id}/remove`, "get");
      if (res.status === "Success") {
        showNotification("Delete Successfully", "success");
        dispatch(fetchAllSubmissionsDetails({}));
      } else {
        showNotification("Not Delete", "error");
      }
    } catch (error) {
      showNotification("error");
    }
  };
}
