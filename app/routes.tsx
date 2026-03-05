import {
  index,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export const ROUTE_PATHS = Object.freeze({
  home: "/",
  login: "/auth/login",
  unauthorized: "/auth/unauthorized",
  worlds: "/worlds",
  worldDetail: "/worlds/:worldId",
  worldExport: "/worlds/:worldId/export",
  characterSheet: "/worlds/:worldId/export/:articleId",
});

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

export default [
  index("routes/home.tsx"),
  ...prefix("auth", [
    route("login", "routes/auth/login.tsx"),
    route("unauthorized", "routes/auth/unauthorized.tsx"),
  ]),
  route("", "routes/authenticated.tsx", [
    route("worlds", "routes/worlds/wrapper.tsx", [
      index("routes/worlds/index.tsx"),
    ]),
    // Individual world routes
    route("worlds/:worldId", "routes/worlds/$worldId/wrapper.tsx", [
      index("routes/worlds/$worldId/index.tsx"),
      route("export", "routes/worlds/$worldId/export/wrapper.tsx", [
        index("routes/worlds/$worldId/export/index.tsx"),
        route(":articleId", "routes/worlds/$worldId/export/$articleId.tsx"),
      ]),
    ])
  ]),
] satisfies RouteConfig;