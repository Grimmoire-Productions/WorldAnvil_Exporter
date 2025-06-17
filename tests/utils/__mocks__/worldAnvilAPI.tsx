const worldAnvilAPI = {
  logIn: jest.fn(),
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

export default worldAnvilAPI;