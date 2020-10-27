import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { LOGIN_PATH } from "../../constants/paths";

export const NavItemsContext = createContext<
  [NavItem[], Dispatch<SetStateAction<NavItem[]>>] | undefined
>(undefined);

type NavList = NavItem[];

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
  const navItems: NavList[] = [[{ name: "login", path: LOGIN_PATH }]];
  return <div className="navigation-component"></div>;
};
