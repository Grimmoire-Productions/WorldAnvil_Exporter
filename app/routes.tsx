import {
  index,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export const ROUTE_PATHS = Object.freeze({
  home: "/",
  login: "/auth/login",
  authenticated: "/authenticated",
  worlds: "/authenticated/worlds",
  worldDetail: "/authenticated/worlds/:worldId",
  worldExport: "/authenticated/worlds/:worldId/export",
});

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

export default [
  index("routes/home.tsx"),
  ...prefix("auth", [
    route("login", "routes/auth/login.tsx"),
  ]),
  route("authenticated", "routes/authenticated.tsx", [
    index("routes/authenticated/home.tsx"),
    ...prefix("worlds", [
      route(":worldId", "routes/authenticated/worlds/$worldId/details.tsx"),
      route(":worldId/export", "routes/authenticated/worlds/$worldId/export.tsx"),
    ]),
  ]),
] satisfies RouteConfig;