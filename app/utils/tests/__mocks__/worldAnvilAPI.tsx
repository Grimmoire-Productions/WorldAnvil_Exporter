const backendAPI = {
  logIn: jest.fn(),
  logout: jest.fn(),
  checkSession: jest.fn(),
  getWorlds: jest.fn(),
  getCharacterSheets: jest.fn(),
  fetchCharacterRaw: jest.fn(),
  fetchCharacter: jest.fn(), // Legacy compatibility
  fetchSecrets: jest.fn(),
  getUser: jest.fn(() => {
    Promise.resolve({
      displayName: '',
      id: '',
    });
  }),
  // getSearchEndpoint: jest.fn(() => ''),
  // getTracks: jest.fn(() => {
  //   Promise.resolve({
  //     trackList: [],
  //     total: 2,
  //     next: null,
  //     previous: null,
  //   });
  // }),
  // createPlaylist: jest.fn(() => {
  //   Promise.resolve('');
  // }),
  // addTracks: jest.fn(() => {
  //   Promise.resolve('');
  // }),
};

export default backendAPI;