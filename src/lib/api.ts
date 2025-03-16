
import { User, ApiResponse } from '@/types';

const API_URL = 'http://localhost:4000/graphql';

// GraphQL queries and mutations
const GET_USERS = `
  query GetUsers {
    users {
      id
      name
      birthdate
      quantity
    }
  }
`;

const ADD_USER = `
  mutation AddUser($name: String!, $birthdate: String!, $quantity: Int!) {
    addUser(name: $name, birthdate: $birthdate, quantity: $quantity) {
      id
      name
      birthdate
      quantity
    }
  }
`;

// API helper functions
export async function fetchUsers(): Promise<ApiResponse<User[]>> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_USERS,
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return { success: false, error: result.errors[0].message };
    }

    return { success: true, data: result.data.users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

export async function createUser(user: Omit<User, 'id'>): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ADD_USER,
        variables: {
          name: user.name,
          birthdate: user.birthdate,
          quantity: user.quantity,
        },
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return { success: false, error: result.errors[0].message };
    }

    return { success: true, data: result.data.addUser };
  } catch (error) {
    console.error('Error creating user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}
