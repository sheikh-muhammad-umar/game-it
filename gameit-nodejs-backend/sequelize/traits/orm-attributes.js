/**
 * @package traits
 * ORM General Attributes trait
 * @param {import('sequelize').Model} model - Sequelize model instance
 * @mixin GeneralMethodsTrait
 */
module.exports = model => {
  /** @type {Object} */
  const rawAttributes = model.rawAttributes;
  
  /**
   * @public
   * @static
   * @override
   * Returns the attribute hints.
   *
   * Attribute hints are mainly used for display purpose. For example, given an attribute
   * `isPublic`, we can declare a hint `Whether the post should be visible for not logged in users`,
   * which provides user-friendly description of the attribute meaning and can be displayed to end users.
   *
   * Unlike label hint will not be generated, if its explicit declaration is omitted.
   *
   * Note, in order to inherit hints defined in the parent class, a child class needs to
   * merge the parent hints with child hints using functions such as `merge`.
   *
   * @name GeneralMethodsTrait.attributeHints
   * @returns {Object} - Attribute hints (name => hint)
   */
  model.attributeHints = () => {
    /** @type {Object} */
    const attributes = {};
    
    Object.keys(rawAttributes).forEach(name => {
      attributes[name] = '';
    });
    
    return attributes;
  };
  
  /**
   * @public
   * Returns attribute values.
   * @methodOf GeneralMethodsTrait
   * @param {string[]} names=[] - List of attributes whose value needs to be returned.
   * Defaults to null, meaning all attributes listed in [[attributes()]] will be returned.
   * If it is an array, only the attributes in the array will be returned.
   * @param {string[]} except=[] - List of attributes whose value should NOT be returned.
   * @returns {Object} - Attribute values (name => value).
   */
  model.prototype.getAttributes = function ( names = [], except = [] ) {
    /** @type {Object} */
    const attributesName = model.attributesName(except);
    
    /** @type {Object} */
    const attributes = {};
    
    attributesName.forEach(name => {
      attributes[name] = this.get(name);
    });
    
    return attributes;
  };
  
  /**
   * @public
   * @static
   * Returns the attribute names
   * @name GeneralMethodsTrait.attributesName
   * @param {string[]} except=[] - List of attributes whose value should NOT be returned.
   * @returns {string[]} - Attribute names
   */
  model.attributesName = ( except = [] ) => {
    /** @type {string[]} */
    const attributes = Object.keys(rawAttributes);
    
    return except.length
      ? attributes.filter(n => !except.includes(n))
      : attributes;
  };
  
  /**
   * @public
   * @static
   * @override
   * Returns the attribute labels.
   *
   * Attribute labels are mainly used for display purpose. For example, given an attribute
   * `firstName`, we can declare a label `First Name` which is more user-friendly and can
   * be displayed to end users.
   *
   * Note, in order to inherit hints defined in the parent class, a child class needs to
   * merge the parent hints with child hints using functions such as `merge`.
   *
   * @name GeneralMethodsTrait.attributeLabels
   * @returns {Object} - Attribute labels (name => label)
   */
  model.attributeLabels = () => {
    /** @type {Object} */
    const attributes = {};
    
    Object.keys(rawAttributes).forEach(name => {
      attributes[name] = rawAttributes[name].comment;
    });
    
    return attributes;
  };
};
