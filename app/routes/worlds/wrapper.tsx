import { Outlet } from "react-router";
import MainHeader from "../../features/MainHeader/MainHeader";

export default function WorldsWrapper() {
  return (
    <>
      <MainHeader/>
      <Outlet/>
    </>
  );
}
