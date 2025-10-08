/**
 * 生成指定长度的随机字符串
 * @param {number} length 字符串长度
 * @returns {string}
 */
export function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * 构建存储在KV中的数据对象
 * @param {string} data base64编码的日志文件内容
 * @param {string} name 日志文件名
 * @returns {object}
 */
export function generateStorageData(data, name) {
  const now = new Date().toISOString();
  return {
    client: "SealDice",
    created_at: now,
    data: data,
    name: name,
    note: "",
    updated_at: now,
  };
}