import pool from '../config/db';

export const TodoModel = {
    // Ambil semua todo milik user dengan pagination (Tugas #6)
    getByUserId: async (userId: number, limit: number, offset: number) => {
        const [rows] = await pool.query(
            'SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
            [userId, limit, offset]
        );
        return rows;
    },

    // Hitung total todo milik user, untuk keperluan pagination (Tugas #6)
    countByUserId: async (userId: number) => {
        const [rows]: any = await pool.query(
            'SELECT COUNT(*) AS total FROM todos WHERE user_id = ?',
            [userId]
        );
        return rows[0].total as number;
    },

    // Ambil satu todo berdasarkan ID (Tugas #5)
    getById: async (id: number, userId: number) => {
        const [rows]: any = await pool.query(
            'SELECT * FROM todos WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    },

    // Buat todo baru
    create: async (userId: number, task: string) => {
        const [result]: any = await pool.query(
            'INSERT INTO todos (user_id, task) VALUES (?, ?)',
            [userId, task]
        );
        return result.insertId;
    },

    // Update task atau status is_completed (Tugas #5)
    update: async (id: number, task: string | undefined, isCompleted: boolean | undefined, userId: number) => {
        const fields: string[] = [];
        const values: any[] = [];

        if (task !== undefined) {
            fields.push('task = ?');
            values.push(task);
        }
        if (isCompleted !== undefined) {
            fields.push('is_completed = ?');
            values.push(isCompleted);
        }

        if (fields.length === 0) return 0;

        values.push(id, userId);

        const [result]: any = await pool.query(
            `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );
        return result.affectedRows;
    },

    // Hapus todo berdasarkan ID (Tugas #7)
    delete: async (id: number, userId: number) => {
        const [result]: any = await pool.query(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows;
    },
};
