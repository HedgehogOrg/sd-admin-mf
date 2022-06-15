import { Buffer } from 'buffer';

const decodeBase64 = (str: string): string => Buffer.from(str, 'base64').toString('binary');

const encodeBase64 = (str: string): string => Buffer.from(str, 'binary').toString('base64');

/**
 * 对函数进行递归排序（children嵌套）
 * @param arr 排序的数组
 * @param key 排序的字段
 * @param type 排序的正反
 * @returns 排序后的函数
 */
function sort(arr: any[], key: string = 'sort', type: 1 | -1 | 0 = 1) {
  return arr.map((item) => {
    if (item.children && item.children.length) {
      Object.assign(item, { children: sort(item.children) });
    }
    return item;
  }).sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => (b[key] - a[key]) * type);
}

/**
 * 为树中元素添加父级字段
 * @param arr 树
 * @param [childKey=children] 子级字段
 * @param parents 父级
 * @returns 含父级的树
 */
function addParents(arr: any[], childKey: string = 'children', parents: any[] | undefined = undefined) {
  return arr.map((item) => {
    const tmpItem = item;
    if (parents) {
      tmpItem.parents = parents;
    }
    if (item[childKey]?.length) {
      const tmpParents = parents || [];
      const tmpParent = { ...item };
      Reflect.deleteProperty(tmpParent, childKey);
      tmpItem[childKey] = addParents(item[childKey], childKey, [...tmpParents, tmpParent]);
    }
    return tmpItem;
  });
}

/**
 * 扁平化树
 * @param arr 树
 * @param [childKey=children] 子级字段
 * @param parents 父级
 * @returns 扁平化的数组
 */
function flattenTree(arr: any[], childKey: string = 'children', parents: any[] | undefined = undefined) {
  const flatArr: any[] = [];
  arr.forEach((item) => {
    const tmpItem = item;
    if (parents) {
      tmpItem.parents = parents;
    }
    flatArr.push(tmpItem);
    if (item[childKey]?.length) {
      const tmpParents = parents || [];
      const tmpParent = { ...item };
      Reflect.deleteProperty(tmpParent, childKey);
      flatArr.push(...flattenTree(item[childKey], childKey, [...tmpParents, tmpParent]));
    }
  });
  return flatArr;
}

export {
  encodeBase64, decodeBase64, sort, addParents, flattenTree,
};
