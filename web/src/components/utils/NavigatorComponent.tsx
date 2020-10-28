import React, { createContext, Dispatch, SetStateAction } from "react";
import { goPlans } from "../../constants/paths";
// import { LOGIN_PATH } from "../../constants/paths";

import "./NavigatorComponent.scss";
export const NavItemsContext = createContext<
  [NavItem[], Dispatch<SetStateAction<NavItem[]>>] | undefined
>(undefined);

// type NavList = NavItem[];

type NavItem = {
  name: string;
  path: string;
};

// export const NavItemsContextProvider = (props: {
//   children: React.ReactNode;
// }) => {
//   const [navItems, setNavItems] = useState<NavItem[]>([]);
//   return (
//     <NavItemsContext.Provider value={[navItems, setNavItems]}>
//       {props.children}
//     </NavItemsContext.Provider>
//   );
// };

export const NavigatorComponent = () => {
  // const navItems: NavList[] = [[{ name: "login", path: LOGIN_PATH }]];
  return (
    <div id="navigator-component">
      <a onClick={goPlans}>Plans</a>
      <a>User</a>
    </div>
  );
};
