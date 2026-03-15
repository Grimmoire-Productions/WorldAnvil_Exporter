import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useLogin } from "../../app/hooks/useLogin";
import UserProvider from "../../app/context/UserContext/UserProvider";
import type { UserInitialValues, User } from "../../../app/utils/types";
import { setUserToken } from "../../app/utils/userToken";

import backendAPI from "../../app/utils/backendAPI";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Mock userToken functions
jest.mock("../../app/utils/userToken", () => ({
  setUserToken: jest.fn(),
  getUserToken: jest.fn(),
}));

// Override specific mock behavior for this test
const mockBackendAPI = backendAPI as jest.Mocked<typeof backendAPI>;
mockBackendAPI.getWorlds.mockResolvedValue([
  { id: "world-1", title: "Test World", cssClassName: "TestWorld" },
]);

describe("useLogin", () => {
  const userInit: UserInitialValues = {
    isLoggedIn: false,
    user: null,
    accessToken: "",
    expiresAt: null,
    applicationKey: null,
    isAutoLoginPending: false,
    isAutoLoginInProgress: false,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UserProvider initialValues={userInit}>{children}</UserProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should provide login function", () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    expect(result.current.login).toBeDefined();
    expect(typeof result.current.login).toBe("function");
  });

  it("should call login, store token in localStorage, and return user with worlds", async () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    const mockSetUserToken = setUserToken as jest.MockedFunction<
      typeof setUserToken
    >;

    let user: User;
    await act(async () => {
      user = await result.current.login("test-token", "test-app-key");
    });

    // Verify token is stored in localStorage
    expect(mockSetUserToken).toHaveBeenCalledWith(
      "test-token",
      expect.any(Number),
    );

    // Verify user data is returned correctly
    expect(user).toEqual({
      id: "mock-user-id",
      displayName: "Mock User",
      worlds: [
        { id: "world-1", title: "Test World", cssClassName: "TestWorld" },
      ],
    });
  });
});
