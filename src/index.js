import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Root from "./Root";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./views/Home";
import AuthContextProvider from "./context/auth-context";
import Login, { loginAction } from "./views/Login";
import UserEditInfo, { editInfoAction } from "./components/User/UserEditInfo";
import User from "./views/User";
import UserCreatePost, {
  createPostAction,
} from "./components/User/UserCreatePost";
import UserPosts, { userPostsLoader } from "./components/User/UserPosts";
import UserGallery, {
  getGalleryLoader,
  setGalleryAction,
} from "./components/User/UserGallery";
import SingleImage, { singleImageLoader } from "./views/SingleImage";
import { deleteAction } from "./components/User/UserSinglePost";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Fragment>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />}></Route>
        <Route path="/login" element={<Login />} action={loginAction}></Route>

        <Route path="/user/:id" element={<User />}>
          <Route
            index
            element={<UserCreatePost />}
            action={createPostAction}
          ></Route>
          <Route
            path="edit-info"
            element={<UserEditInfo />}
            action={editInfoAction}
          ></Route>
          <Route
            path="posts"
            element={<UserPosts />}
            loader={userPostsLoader}
            action={deleteAction}
          ></Route>
          <Route
            path="gallery"
            element={<UserGallery />}
            loader={getGalleryLoader}
            action={setGalleryAction}
          ></Route>
        </Route>
        <Route
          path="/gallery/:img"
          element={<SingleImage />}
          loader={singleImageLoader}
        ></Route>
      </Route>
    </Fragment>
  )
);

const session = JSON.parse(localStorage.getItem("user"));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthContextProvider session={session}>
    <RouterProvider router={router} />
  </AuthContextProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
