const db = require('../db/connection');
const haversineDistance = require('../utils/haversine');

// Add School
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Latitude and Longitude must be numbers' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO school_api (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, parseFloat(latitude), parseFloat(longitude)]
        );
        res.status(201).json({ message: 'School added successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};

// List Schools
exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Valid latitude and longitude are required' });
    }

    try {
        const [schools] = await db.query('SELECT * FROM school_api');
        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        const sortedSchools = schools.map((school) => ({
            ...school,
            distance: haversineDistance(userLat, userLon, school.latitude, school.longitude),
        })).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};
