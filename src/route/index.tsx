import React, {
  createContext,
  useState,
  useContext,
  type PropsWithChildren,
  type JSX,
  useEffect,
  useMemo,
} from "react";
import { AppLayout } from "@/layouts/app-layout";

type Query = Record<string, string>[];

type URLData = {
  path: string;
  query?: Query;
};

type Route = {
  path: string;
  element: JSX.Element;
};

type ActiveRoute = Route & { query?: Query };

type RouterContextType = {
  currentPath: URLData;
  navigate: (data: URLData) => void;
  registerRoute: (route: Route) => void;
  activeRoute?: ActiveRoute;
};

const RouterContext = createContext<RouterContextType | null>(null);

export const Routes: React.FC<PropsWithChildren> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [currentPath, setCurrentPath] = useState<URLData>({
    path: "home",
    query: [],
  });

  const navigate = (data: URLData) => {
    setCurrentPath(data)};

  const registerRoute = (route: Route) => {
    setRoutes((prev) => {
      const exists = prev.some((r) => r.path === route.path);
      return exists ? prev : [...prev, route];
    });
  };

  const activeRoute: ActiveRoute | undefined = useMemo(() => {
    const found = routes.find((r) => r.path === currentPath.path);
    if (!found) return undefined;
    return { ...found, query: currentPath.query };
  }, [routes, currentPath]);

  const ctx: RouterContextType = useMemo(
    () => ({ currentPath, navigate, registerRoute, activeRoute }),
    [currentPath, activeRoute]
  );

  return (
    <RouterContext.Provider value={ctx}>
      {activeRoute ? (
        activeRoute.path == 'login' ? (
          activeRoute.element
        ) : (
          <AppLayout>{activeRoute.element}</AppLayout>
        )
      ) : (
        children 
      )}
    </RouterContext.Provider>
  );
};

export const Route: React.FC<Route> = ({ path, element }) => {
  const router = useContext(RouterContext);
  useEffect(() => {
    router?.registerRoute({ path, element });
  }, [path, element, router]);
  return null;
};

export const useNavigate = () => {
  const router = useContext(RouterContext);
  if (!router) throw new Error("useNavigate must be used inside <Routes>");
  return router.navigate;
};

export const useRoute = () => {
  const router = useContext(RouterContext);
  if (!router) throw new Error("useRoute must be used inside <Routes>");
  return router.activeRoute;
};
