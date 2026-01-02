import { Schema, Document } from 'mongoose';

export interface QueryResult {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export const paginate = (schema: Schema) => {
  schema.statics.paginate = async function (filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult> {
    let sort = '';
    
    if (options.sortBy) {
      const sortingCriteria: any[] = [];
      options.sortBy.split(',').forEach((sortOption: string) => {
        let [key, order] = sortOption.split(':');
        
        if (key === 'id') {
          key = '_id';
        }

        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'created_at';
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    const docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return result;
    });
  };
};