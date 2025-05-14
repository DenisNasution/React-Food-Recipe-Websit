import { useEffect, useLayoutEffect, useMemo, useState } from "preact/hooks";
import React from "react";
import { testAuth } from "../features/userActions";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { resetStatus } from "../features/userSlice";

const RequireAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { status, dataUser, error, login, user } = useSelector(
    (state) => state.user
  );
  const [log, setLog] = useState(false);
  useLayoutEffect(() => {
    // dispatch(resetStatus())
    // dispatch(testAuth())
    // setLog(true);
  }, []);
  return log ? (
    // <Outlet />
    <h3>testing</h3>
  ) : (
    <Navigate to='/login' state={{ from: location }}></Navigate>
  );
};

export default RequireAuth;
