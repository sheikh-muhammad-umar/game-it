/**
 * Type trait for sequelize model
 * @param {import('sequelize').Model} model Sequelize model instance
 * @mixin TypeTrait
 */
module.exports = model => {
  /**
   * @private
   * Rendered labels
   * @type {{number: string}}
   */
  let labels = {};
  
  /**
   * Get type label
   * @name TypeTrait#toType
   * @return {?string} The label / None
   */
  model.prototype.toType = function () {
    return model.getTypeLabel(this.role);
  };
  
  /**
   * @static
   * Get type label
   * @name TypeTrait.getTypeLabel
   * @param {number} type Status ID
   * @return {?string} The label / None
   */
  model.getTypeLabel = function ( type ) {
    return labels[Number(type)];
  };
  
  /**
   * @static
   * Get types labels
   * @name TypeTrait.typeLabels
   * @return {{number: string}} {id:label} pairs of labels
   */
  model.typeLabels = function () {
    if ( labels.length ) {
      return labels;
    }
    
    for ( let value of Object.keys(model) ) {
      if ( !/^TYPE_[A-Z_]+$/.test(value) ) {
        continue;
      }
      
      let val = Number(model[value]),
        label = value.replace(/TYPE_/, '')
          .replace('_', ' ')
          .toLowerCase().trim();
      
      labels[val] = label.substr(0, 1).toUpperCase()
        + label.substr(1);
    }
    
    return labels;
  };
  
  model.typeLabels();
};
