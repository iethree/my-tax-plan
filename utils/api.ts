// generic API fetching

// TODO: move to environment vars
const BASE_URL = 'https://nkoxmpmnexlrtlxlwtkd.supabase.co';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb3htcG1uZXhscnRseGx3dGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU4MDE4OTYsImV4cCI6MTk2MTM3Nzg5Nn0.NNMaRbgSgC_YGM1qoPFd4jzw2xNJOiFjHTMSSFl97i8';

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(BASE_URL, apiKey);

type RequestCredentials = 'omit' | 'same-origin' | 'include';

const handleResponse = async (r: Response) => {
  try {
    if (r.ok) {
      return r.json();
    }
    return Promise.reject(await r.json());
  } catch (e) {
    return Promise.reject(new Error(`received an error from ${r.url}`));
  }
};

const defaultOptions: {
  credentials: RequestCredentials | undefined,
  headers: { [key: string]: string },
} = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

export function get(endpoint: string) {
  return fetch(`${BASE_URL}${endpoint}`, {
    ...defaultOptions,
    method: 'GET',
  }).then(handleResponse);
}

export function put(endpoint: string, body: any) {
  return fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...defaultOptions,
  }).then(handleResponse);
}

export function post(endpoint: string, body: any) {
  return fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(body),
    ...defaultOptions,
  }).then(handleResponse);
}

export function fetchDelete(endpoint: string, body: any = {}) {
  return fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
    body: JSON.stringify(body),
    ...defaultOptions,
  }).then(handleResponse);
}

