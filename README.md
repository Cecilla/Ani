Q2:
/**
 * 时间复杂度为：
 * 构建 bSet: O(m)，其中 m 是数组 b 的长度。
 * 遍历 a 并在 bSet 中查找: O(n)，其中 n 是数组 a 的长度。
 * 最终的时间复杂度为 O(n + m)，其中 n 是数组 a 的长度，m 是数组 b 的长度。
 */


judgeSame(a: number[], b: number[], v: number): boolean {
   let bSet = new Set(b);
   for (let index = 0; index < a.length; index++) {
     let value = v - a[index];
     if (bSet.has(value)) {
       return true;
     }
   }
   return false;
 }

Q3:

https://github.com/user-attachments/assets/ce78e00e-bfa3-423b-a721-18160ab3a998
