import http from 'k6/http';
import { sleep, check } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = { //SEBASTIAN PARRA
  scenarios: {
    carga_10: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
      tags: { prueba: '10_usuarios' },
    },
    carga_20: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s',
      startTime: '30s',
      tags: { prueba: '20_usuarios' },
    },
    carga_30: {
      executor: 'constant-vus',
      vus: 30,
      duration: '30s',
      startTime: '60s',
      tags: { prueba: '30_usuarios' },
    },
    carga_40: {
      executor: 'constant-vus',
      vus: 40,
      duration: '30s',
      startTime: '90s',
      tags: { prueba: '40_usuarios' },
    },
  },

  thresholds: {
    'http_req_duration{prueba:10_usuarios}': ['avg<500', 'max<2000'],
    'http_req_duration{prueba:20_usuarios}': ['avg<1000', 'max<4000'],
    'http_req_duration{prueba:30_usuarios}': ['avg<2000', 'max<10000'],
    'http_req_duration{prueba:40_usuarios}': ['avg<3000', 'max<20000'],
    http_req_failed: ['rate<0.05'],
  }, //SEBASTIAN PARRA
};

export default function () {
  const baseUrl = 'http://localhost:3000/api';
  const username = `user_${randomString(8)}`;
  const password = 'TestPassword123!';

  //registro
  let res = http.post(
    `${baseUrl}/auth/register`,
    JSON.stringify({ username, password }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, {
    'registro exitoso': (r) => r.status === 201,
  });

  //login
  res = http.post(
    `${baseUrl}/auth/login`,
    JSON.stringify({ username, password }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  let token;
  check(res, {
    'inicio sesion exitoso': (r) => {
      if (r.status === 200) {
        try {
          token = r.json('token');
          return true;
        } catch {
          return false;
        }
      }
      return false;
    },
  });

  sleep(1);
}
