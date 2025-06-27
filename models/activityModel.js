
const db = require('../config/db'); // Adjust path if needed

const activityModel = {
  // Create a new swimming activity
  create(data) {
    const { name, coach, price } = data;
    return db.none(
      'INSERT INTO activities (name, coach, price) VALUES ($1, $2, $3)',
      [name, coach, price]
    );
  },

  // Get all activities
 getAll() {
    return db.any('SELECT * FROM activities ORDER BY id ASC');
  },

  getById(id) {
    return db.one('SELECT * FROM activities WHERE id=$1', [id]);
  },

  // New method: get IDs of activities user marked as 'not interested'
   getUserUninterestedActivities(userId) {
    return db.any(
      'SELECT activity_id FROM uninterested_activities WHERE user_id = $1',
      [userId]
    ).then(rows => rows.map(row => row.activity_id));
  },

  addUserUninterestedActivity(userId, activityId) {
    return db.none(
      'INSERT INTO uninterested_activities (user_id, activity_id) VALUES ($1, $2)',
      [userId, activityId]
    );
  },

  update(id, data) {
    const { name, coach, price } = data;
    return db.none('UPDATE activities SET name=$1, coach=$2, price=$3 WHERE id=$4', [name, coach, price, id]);
  },

  // Delete activity
  delete(id) {
    return db.none('DELETE FROM activities WHERE id = $1', [id]);
  }
};

module.exports = activityModel;
