export const environment = {
  production: false,
  beta: false,
  dev: true,
  API_URL: 'http://127.0.0.1:3000/api',
  msalConfig: {
    auth: {
      clientId: '975d380b-dc7d-4258-bfe2-1fd973f18439',
      authority: 'https://login.microsoftonline.com/c70170b0-7b13-42ed-b2df-d0dda97ce652',
    },
  },
  apiConfig: {
    scopes: ['api://975d380b-dc7d-4258-bfe2-1fd973f18439/read.role'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
};
