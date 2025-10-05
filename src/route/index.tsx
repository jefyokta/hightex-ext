import { AppLayout } from "@/layouts/app-layout";
import React, {
  createContext,
  useState,
  useContext,
  type PropsWithChildren,
  type JSX,
  useEffect,
} from "react";

type URLData = {
  path: string,
  query?: Record<string, string>[]
}
type Route = {
  element: JSX.Element;
} & URLData;



type RouterContextType = {
  currentPath: URLData;
  navigate: (data: URLData) => void;
  routes: Route[];
  registerRoute: (route: Route) => void;
};

const RouterContext = createContext<RouterContextType | null>(null);

export const Routes: React.FC<PropsWithChildren> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [currentPath, setCurrentPath] = useState<URLData>({ path: "home", query: [] });

  const [activeRoute, setActiveRoute] = useState<Route | undefined>(routes[0] || undefined)

  const navigate = ({ path, query }: URLData) => setCurrentPath({ path, query });
  useEffect(() => {
    setActiveRoute(routes.find(r => r.path === currentPath.path));
  }, [currentPath, routes]);


  const registerRoute = (route: Route) =>
    setRoutes((prev) => {
      return [...prev, route]
    });

  const ctx: RouterContextType = { currentPath, navigate, routes, registerRoute };


  return (
    <RouterContext.Provider value={ctx}>
      {activeRoute
        ? activeRoute.path.startsWith("auth")
          ? activeRoute.element
          : <AppLayout>{activeRoute.element}</AppLayout>
        : children}
    </RouterContext.Provider>
  );
};

export const Route: React.FC<Route> = ({ path, element }) => {
  const router = useContext(RouterContext);
  React.useEffect(() => {
    router?.registerRoute({ path, element });
  }, []);
  return null;
};

export const useNavigate = () => {
  const router = useContext(RouterContext);
  if (!router) throw new Error("useNavigate must be used inside <Routes>");
  return router.navigate;
};
