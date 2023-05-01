/**
 * @package traits
 * Status trait for sequelize model
 * @param {import('sequelize').Model} model - Sequelize model instance
 * @mixin StatusTrait
 */
module.exports = model => {
  /**
   * @private
   * Rendered labels
   * @type {{number: string}}
   */
  let labels = {};
  
  /**
   * Get status label
   * @name StatusTrait#toStatus
   * @return {?string} The label / None
   */
  model.prototype.toStatus = function () {
    return model.getStatusLabel(this.status);
  };
  
  /**
   * Get status label
   * @name StatusTrait.getStatusLabel
   * @param {number} type Status ID
   * @return {?string} The label / None
   */
  model.getStatusLabel = type => labels[Number(type)];
  
  /**
   * @static
   * Get statuses labels
   * @name StatusTrait.statusLabels
   * @return {{number: string}} {id:label} pairs of labels
   */
  model.statusLabels = () => {
    if ( labels.length ) {
      return labels;
    }
    
    for ( let value of Object.keys(model) ) {
      if ( !/^STATUS_[A-Z_]+$/.test(value) ) {
        continue;
      }
      
      let val = Number(model[value]),
        label = value.replace(/STATUS_/, '')
          .replace('_', ' ')
          .toLowerCase().trim();
      
      labels[val] = label.substr(0, 1).toUpperCase()
        + label.substr(1);
    }
    
    return labels;
  };
  
  model.statusLabels();
};
