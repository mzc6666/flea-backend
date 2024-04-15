/**
 * [深拷贝]
 */
export const cloneDeep = (values: any) => {
  return JSON.parse(JSON.stringify(values));
};
