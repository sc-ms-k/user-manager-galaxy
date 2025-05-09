const resolvers = {
  Query: {
    users: async (_, __, { db }) => {
      try {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
      }
    },
    user: async (_, { id }, { db }) => {
      try {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
      } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw new Error('Failed to fetch user');
      }
    }
  },
  Mutation: {
    createUser: async (_, { input }, { db }) => {
      try {
        const { name, birthday, quantity, avatar } = input;
        
        const [result] = await db.query(
          'INSERT INTO users (name, birthday, quantity, avatar) VALUES (?, ?, ?, ?)',
          [name, birthday, quantity, avatar]
        );
        
        const id = result.insertId;
        return { id, name, birthday, quantity, avatar };
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }
    },
    updateUser: async (_, { id, input }, { db }) => {
      try {
        const { name, birthday, quantity, avatar } = input;
        const updates = [];
        const params = [];
        
        if (name !== undefined) {
          updates.push('name = ?');
          params.push(name);
        }
        
        if (birthday !== undefined) {
          updates.push('birthday = ?');
          params.push(birthday);
        }
        
        if (quantity !== undefined) {
          updates.push('quantity = ?');
          params.push(quantity);
        }
        
        if (avatar !== undefined) {
          updates.push('avatar = ?');
          params.push(avatar);
        }
        
        if (updates.length === 0) return null;
        
        params.push(id);
        
        await db.query(
          `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
          params
        );
        
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
      } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw new Error('Failed to update user');
      }
    },
    deleteUser: async (_, { id }, { db }) => {
      try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
      } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw new Error('Failed to delete user');
      }
    },
    updateUserQuantity: async (_, { id, quantity }, { db }) => {
      try {
        await db.query(
          'UPDATE users SET quantity = ? WHERE id = ?',
          [quantity, id]
        );
        
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
      } catch (error) {
        console.error('Error updating user quantity:', error);
        throw new Error('Failed to update user quantity');
      }
    },
    updateUserBirthday: async (_, { id, birthday }, { db }) => {
      try {
        await db.query(
          'UPDATE users SET birthday = ? WHERE id = ?',
          [birthday, id]
        );
        
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
      } catch (error) {
        console.error('Error updating user birthday:', error);
        throw new Error('Failed to update user birthday');
      }
    }
  }
};

module.exports = resolvers;
