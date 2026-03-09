const backendAPI = {
  logIn: jest.fn(),
  logout: jest.fn(),
  checkSession: jest.fn(),
  getWorlds: jest.fn(),
  getCharacterSheets: jest.fn(),
  fetchCharacterRaw: jest.fn(),
  fetchCharacter: jest.fn(), // Legacy compatibility
  fetchSecrets: jest.fn(),
};

export default backendAPI;
