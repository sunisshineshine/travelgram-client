import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const NavItemsContext = createContext<
  [NavItem[], Dispatch<SetStateAction<NavItem[]>>] | undefined
>(undefined);

export const NavItemsContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  return (
    <NavItemsContext.Provider value={[navItems, setNavItems]}>
      {props.children}
    </NavItemsContext.Provider>
  );
};

export const NavigationnComponent = () => {
  console.log("nav");
  const [navItems] = useContext(NavItemsContext)!;
  return (
    <div className="navigation-component">
      {navItems.map((navItem) => {
        return (
          <div key={Math.random()} onClick={navItem.navigate}>
            {navItem.content}
          </div>
        );
      })}
    </div>
  );
};
