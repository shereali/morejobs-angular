import * as _ from 'lodash';

export interface ObjectMap<T = any> {
  [key: string]: T;
}


export class FilterParams {
  private filterData: ObjectMap<string> = {};

  get value(): any {
    return this.filterData;
  }

  set(key: string, value: string | number): any {
    this.filterData[key] = (value || typeof value === 'number') ? String(value) : '';
    return this;
  }

  setUsingObject(obj: ObjectMap): any {
    Object
      .entries(obj)
      .forEach(([key, value]) => this.set(key, value));
  }

  remove(key: string): any {
    this.filterData[key] = '';
    return this;
  }

  /**
   * For Table Order Selected or Not
   * @param key table Column key
   */
  isOrderSelected(key: string): boolean {
    const sort_by: string = this.value.sort_by;
    return sort_by ? sort_by.includes(key) : false;
  }

  setFilterFromQueryParams(data: ObjectMap): any {
    // this.reset();
    /**
     * Loop through all the key and set them to FilterData.
     */
    Object.keys(data).forEach(key => this.set(key, data[key]));
  }

  /**
   * For Table Order ASC OR DSC
   * @param key table Column key
   */
  order(key: string): any {
    const sort_by = this.value.sort_by;
    if (sort_by) {
      const order = sort_by.substr(-3);
      const k = sort_by.replace('_' + order, '');
      return (key === k ? order : null) as 'asc' | 'dsc';
    }
  }

  reset(): any {
    this.filterData = {};
    return this.value;
  }

  public formattedFilterParams(params: ObjectMap): any {
    return _.pickBy(params, _.identity);
  }
}
