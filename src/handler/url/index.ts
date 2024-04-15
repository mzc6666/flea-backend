/**
 * [JS对象转换为URL中的search参数]
 */
export function data2UrlSearch(data: Record<string, any>): string {
  const fragment = [];
  for (let [k, v] of Object.entries(data)) {
    fragment.push(`${k}=${v}`);
  }
  return `?${fragment.join('&')}`;
}

/**
 * [search参数转换为JS对象]
 */
export function searchToObj(search: string): Record<string, any> {
  const searchParams = new URLSearchParams(search);
  const jsObj = {};
  for (const [k, v] of searchParams.entries()) {
    jsObj[k] = encodeURIComponent(v);
  }
  return jsObj;
}

/**
 * [获取图片链接]
 */
export const getImageUrl = (imgName: string) => {
  return `http://127.0.0.1:3000/${imgName}`;
};
