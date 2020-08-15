import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    listCategory, 
    deleteCategory, 
    saveCategory 
} from '../actions/categoryActions';

function CategoryScreen(props) {
  const userSignin = useSelector(state => state.userSignin);
  const { loading, userInfo, error } = userSignin;

  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  
  const categoryList = useSelector((state) => state.categoryList);
  const { 
    categorys, 
    loading: loadingcategory, 
    error: errorcategory } = categoryList;

  const categorySave = useSelector((state) => state.categorySave);
  const {
    loading: loadingSave,
    success: successSave,
    error: errorSave,
  } = categorySave;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = categoryDelete;
  const dispatch = useDispatch();

  useEffect(() => {
    const redirect = props.location.search ? props.location.search.split("=")[1] : '/';
    if (userInfo == null || !userInfo.isAdmin) {
        props.history.push(redirect, {message: 'You not allowed to access'});
    }
    if (successSave) {
      setModalVisible(false);
    }
    dispatch(listCategory());
    return () => {
      //
    };
  }, [successSave, successDelete]);

  const openModal = (category) => {
    setModalVisible(true);
    setId(category._id);
    setName(category.name);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveCategory({
        _id: id,
        name,
      })
    );
  };
  const deleteHandler = (category) => {
    dispatch(deleteCategory(category._id));
  };

  return (
    <div className="content content-margined">
      <div className="product-header">
        <h3>Categories</h3>
        <button className="button primary" onClick={() => openModal({})}>
          Create Category
        </button>
      </div>
      {modalVisible && (
        <div className="form">
          <form onSubmit={submitHandler}>
            <ul className="form-container">
              <li>
                <h2>{id ? 'Update' : 'Create'} Category</h2>
              </li>
              <li>
                {loadingSave && <div>Loading...</div>}
                {errorSave && <div>{errorSave}</div>}
              </li>

              <li>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </li>
              <li>
                <button type="submit" className="button primary">
                  {id ? 'Update' : 'Create'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="button secondary"
                >
                  Back
                </button>
              </li>
            </ul>
          </form>
        </div>
      )}

      <div className="product-list">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
            {loadingcategory ? (
                <tbody>
                    <tr>
                        <td colSpan="3">Loading...</td>
                    </tr>
                </tbody>
            ) : errorcategory ? (
                <tbody>
                    <tr>
                        <td colSpan="3">{errorcategory}</td>
                    </tr>
                </tbody>
            ) : (
                <tbody>
                    {categorys.map((category) => (
                      <tr key={category._id}>
                        <td>{category._id}</td>
                        <td>{category.name}</td>
                        <td>
                          <button className="button" onClick={() => openModal(category)}>
                            Edit
                          </button>{' '}
                          <button
                            className="button"
                            onClick={() => deleteHandler(category)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
            )}
        </table>
      </div>
    </div>
  );
}
export default CategoryScreen;
