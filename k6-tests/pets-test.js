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

  //crear pet
  if (token) {
    const species = ['Dog', 'Cat', 'Bird', 'Rabbit'];
    res = http.post(
      `${baseUrl}/pets`,
      JSON.stringify({
        name: `Pet ${randomString(5)}`,
        species: species[Math.floor(Math.random() * species.length)],
        breed: `Breed ${randomString(5)}`,
        age: Math.floor(Math.random() * 15) + 1,
        description: `A lovely pet ${randomString(20)}`,
        status: 'available',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    check(res, {
      'crear pet exitoso': (r) => r.status === 201,
    });

    //obtener pets
    res = http.get(`${baseUrl}/pets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    check(res, {
      'obtener pets exitoso': (r) => r.status === 200,
    });
  }

  sleep(1);
}
