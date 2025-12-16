import { Document, Schema } from 'mongoose';

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const deleteAtPath = (obj: any, path: string[], index: number) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

export const toJSON = (schema: Schema) => {
  let transform: any;
  
  // Safely retrieve existing toJSON options
  const toJSONOptions = schema.get('toJSON');
  
  if (toJSONOptions && typeof toJSONOptions === 'object' && toJSONOptions.transform) {
    transform = toJSONOptions.transform;
  }

  schema.set('toJSON', {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform(doc: any, ret: any, options: any) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }
      
      delete ret.__v;
      // delete ret.created_at; 
      // delete ret.updated_at; 

      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};