import 'dotenv/config';

import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, "0.0.0.0",() => {
            console.log(`Server running on port http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });
