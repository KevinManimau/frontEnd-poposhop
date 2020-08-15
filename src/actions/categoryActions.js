import Axios from "axios";
import { 
  CATEGORY_LIST_REQUEST, 
  CATEGORY_LIST_SUCCESS, 
  CATEGORY_LIST_FAIL, 
  CATEGORY_DELETE_REQUEST, 
  CATEGORY_DELETE_SUCCESS, 
  CATEGORY_DELETE_FAIL, 
  CATEGORY_SAVE_REQUEST, 
  CATEGORY_SAVE_SUCCESS, 
  CATEGORY_SAVE_FAIL 
} from "../constants/categoryConstants";

const listCategory = () => async (dispatch) => {
    dispatch({
        type: CATEGORY_LIST_REQUEST, loading: true 
    });
  try {
    const { data } = await Axios.get("/api/category");
    dispatch({
        type: CATEGORY_LIST_SUCCESS, loading: false , payload: data
    });
  } catch (error) {
    dispatch({
        type: CATEGORY_LIST_FAIL, loading: false , payload: error.message
    });
  }
}

const saveCategory = (category) => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_SAVE_REQUEST, payload: category });
    const {
      userSignin: { userInfo },
    } = getState();
    if (!category._id) {
      const { data } = await Axios.post('/api/category', category, {
        headers: {
          Authorization: 'Bearer ' + userInfo.token,
        },
      });
      dispatch({ type: CATEGORY_SAVE_SUCCESS, payload: data });
    } else {
      const { data } = await Axios.put(
        '/api/category/' + category._id,
        category,
        {
          headers: {
            Authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
      dispatch({ type: CATEGORY_SAVE_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({ type: CATEGORY_SAVE_FAIL, payload: error.message });
  }
};

const deleteCategory = (categoryId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    dispatch({ type: CATEGORY_DELETE_REQUEST, payload: categoryId });
    const { data } = await Axios.delete('/api/category/' + categoryId, {
      headers: {
        Authorization: 'Bearer ' + userInfo.token,
      },
    });
    dispatch({ type: CATEGORY_DELETE_SUCCESS, payload: data, success: true });
  } catch (error) {
    dispatch({ type: CATEGORY_DELETE_FAIL, payload: error.message });
  }
};


export { listCategory , saveCategory , deleteCategory}