module.exports = {
  getNextSequenceValue: function(sequenceName) {
    const sequenceDocuments = db.counters.findAndModify({
      query: { _id: sequenceName },
      update: {$inc: { sequence_value: 1}},
      new: true,
    });
    return sequenceDocuments.sequence_value;
  },
};
