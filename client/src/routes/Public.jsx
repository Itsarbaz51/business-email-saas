import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "../layout/Layout";
import HomePage from "../pages/renderer/HomePage";
import Inbox from "../pages/dashboard/Inbox";
import InboxDetail from "../pages/dashboard/InboxDetail";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="inbox" element={<Inbox />} />
      <Route path="/inbox/detail/:id" element={<InboxDetail />} />
    </Route>
  )
);
