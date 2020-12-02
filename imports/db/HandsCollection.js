import { Mongo } from 'meteor/mongo';

class HandsCollectionClass extends Mongo.Collection {
    update(selector, modifier) {
        const result = super.update(selector, modifier);
        


    }
}

export const HandsCollection = new Mongo.Collection('hands');