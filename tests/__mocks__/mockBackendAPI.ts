const mockBackendAPI = {
  checkCredentials: jest.fn().mockResolvedValue({ hasAppKey: false }),
  logIn: jest.fn().mockResolvedValue({
    id: 'mock-user-id',
    displayName: 'Mock User'
  }),
  getWorlds: jest.fn().mockResolvedValue([]),
  logout: jest.fn().mockResolvedValue(undefined),
  checkSession: jest.fn().mockResolvedValue({ authenticated: false }),
  getCharacterSheets: jest.fn().mockResolvedValue([]),
  fetchCharacterRaw: jest.fn().mockResolvedValue({}),
  fetchSecrets: jest.fn().mockResolvedValue({ content: '' }),
  fetchCharacter: jest.fn().mockResolvedValue({})
};

export default mockBackendAPI;