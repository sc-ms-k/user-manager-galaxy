
import { User, ApiResponse } from '@/types';

const API_URL = 'http://localhost:4000/graphql';

// GraphQL queries and mutations
const GET_USERS = `
  query GetUsers {
    users {
      id
      name
      birthday
      quantity
      avatar
    }
  }
`;

const CREATE_USER = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      birthday
      quantity
      avatar
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
      console.error('GraphQL error:', result.errors);
      return { success: false, error: result.errors[0].message };
    }

    // Map server response (birthday) to client model (birthdate)
    const users = result.data.users.map((user: any) => ({
      id: user.id,
      name: user.name,
      birthdate: user.birthday, // Map birthday to birthdate
      quantity: user.quantity,
      avatar: user.avatar,
    }));

    return { success: true, data: users };
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
    // Convert from client model to server model (birthdate -> birthday)
    const variables = {
      input: {
        name: user.name,
        birthday: user.birthdate, // Map birthdate to birthday
        quantity: user.quantity,
        avatar: user.avatar
      }
    };
    
    console.log('Sending createUser mutation with variables:', variables);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CREATE_USER,
        variables: variables,
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL error:', result.errors);
      return { success: false, error: result.errors[0].message };
    }

    // Map from server's birthday back to client's birthdate
    const serverUser = result.data.createUser;
    const clientUser: User = {
      id: serverUser.id,
      name: serverUser.name,
      birthdate: serverUser.birthday, // Map birthday to birthdate
      quantity: serverUser.quantity,
      avatar: serverUser.avatar,
    };

    return { success: true, data: clientUser };
  } catch (error) {
    console.error('Error creating user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}
