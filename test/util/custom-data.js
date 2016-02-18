'use strict';

module.exports = {
    Account: {
        schema: 'super_schema',
        customTableAttribute: '"tableAtt"',
        attributes: {
            id: { type: '"fake_type_id"', onUpdate: '"UPDATE ME"', customAttribute: 3 },
            ss: { type: '"fake_type_ss"', specialAttribute: '"ok"' },
            dd: { type: '"fake_type_dd"', onUpdate: '"UPDATE ME TOO"', specA: 3, specB: 4, specC: 6 }
        },
        hasMany: {
            HasContacts: {
                as: 'CustomHasContacts'
            }
        },
        belongsTo: {
            Owner: {
                as: 'CustomBelongsTo'
            }
        },
        belongsToMany: {
            ContactSecondCompanies: {
                as: 'CustomBelongsToMany',
                foreignKey: 'fake_id'
            }
        }
    },
    Cart: {
        customData: { a: 1, b: 'O\'Reilly'}
    }
};
